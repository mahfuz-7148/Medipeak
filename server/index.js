require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const admin = require("firebase-admin");
const serviceAccount = require("./adminsdk-fbsvc-79d2f04bd7.json");
const stripe = require('stripe')(process.env.PAYMENT_GATEWAY_KEY);
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@medipeak.nv96kmz.mongodb.net/?retryWrites=true&w=majority&appName=mediPeak`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // await client.connect();
        // console.log("MongoDB connected");

        const db = client.db('mediPeakDB');
        const usersCollection = db.collection('users');
        const organizerCollection = db.collection('organizers');
        const registrationsCollection = db.collection('registrations');
        const paymentsCollection = db.collection('payments');
        const feedbackCollection = db.collection('feedback');

        // custom middlewares
        const verifyFBToken = async (req, res, next) => {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).send({ message: "unauthorized access" });
            }
            const token = authHeader.split(" ")[1];
            if (!token) {
                return res.status(401).send({ message: "unauthorized access" });
            }

            // verify the token
            try {
                const decoded = await admin.auth().verifyIdToken(token);
                req.decoded = decoded;
                next();
            } catch (error) {
                return res.status(403).send({ message: "forbidden access" });
            }
        };

        const verifyAdmin = async (req, res, next) => {
            const email = req.decoded.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            if (!user || user.role !== 'admin') {
                return res.status(403).send({ message: 'forbidden access' })
            }
            next();
        }



        // --- users route with image/photoURL support ---
        app.post('/users', async (req, res) => {
            const { email, name, image, photoURL, role } = req.body;
            if (!email) return res.status(400).json({ message: 'Email is required' });
            try {
                const userExists = await usersCollection.findOne({ email });
                if (userExists) return res.status(200).json({ message: 'User already exists', inserted: false });

                // Support both image or photoURL field (frontend may call either)
                const newUser = {
                    email: email,
                    name: name || "",
                    image: image || photoURL || "",
                    role: role ,
                    createdAt: new Date()
                };
                const result = await usersCollection.insertOne(newUser);
                res.status(201).json({ insertedId: result.insertedId });
            } catch (err) {
                res.status(500).json({ message: err.message });
            }
        });


        app.get('/users/:email/role', async (req, res) => {
            try {
                const email = req.params.email;

                if (!email) {
                    return res.status(400).send({ message: 'Email is required' });
                }

                const user = await usersCollection.findOne({ email });

                if (!user) {
                    return res.status(404).send({ message: 'User not found' });
                }

                res.send({ role: user.role || 'user' });
            } catch (error) {
                console.error('Error getting user role:', error);
                res.status(500).send({ message: 'Failed to get role' });
            }
        });


        app.patch("/users/:id/role", verifyFBToken, async (req, res) => {
            const { id } = req.params;
            const { role } = req.body;

            if (!["admin", "user"].includes(role)) {
                return res.status(400).send({ message: "Invalid role" });
            }

            try {
                const result = await usersCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { role } }
                );
                res.send({ message: `User role updated to ${role}`, result });
            } catch (error) {
                console.error("Error updating user role", error);
                res.status(500).send({ message: "Failed to update user role" });
            }
        });


// Fetch user profile
        app.get('/profile', async (req, res) => {
            const email = req.query.email;
            if (!email) return res.status(400).json({ error: "Email required" });
            try {
                const user = await usersCollection.findOne({ email });
                if (!user) return res.status(404).json({ error: "User not found" });

                res.json({
                    name: user.name,
                    image: user.image,
                    email: user.email,
                    phone: user.phone || "",
                });
            } catch (err) {
                res.status(500).json({ error: "Internal server error" });
            }
        });

// Profile update (supports name/image/phone)
        app.put('/profile', async (req, res) => {
            const { email, name, image, phone } = req.body;
            if (!email || !name) return res.status(400).json({ error: "Email and name are required" });

            try {
                const result = await usersCollection.updateOne(
                    { email },
                    { $set: { name, image, phone } }
                );
                if (result.modifiedCount > 0)
                    res.json({ success: true, message: "Profile updated" });
                else
                    res.json({ success: true, message: "No changes made" });
            } catch (error) {
                res.status(500).json({ error: "Server error" });
            }
        });




        app.get('/organizer-camps', async (req, res) => {
            const { sort, limit } = req.query;
            // console.log('Requested sort:', sort, 'limit:', limit);
            try {
                let query = {};
                let sortOption = { participantCount: -1 }; // Sort by participant count descending
                const camps = await organizerCollection.find(query)
                    .sort(sortOption)
                    .limit(Number(limit) || 6)
                    .toArray();
                res.json(camps);
            } catch (err) {
                console.error('Error fetching popular camps:', err);
                res.status(500).json({ message: 'Failed to fetch popular camps' });
            }
        });

        // Camps
        app.get('/organizer-camp', verifyFBToken, verifyAdmin,  async (req, res) => {

            const email = req.query.email;

            if (req.decoded.email !== email) {
                return res.status(403).send({ message: 'forbidden access' })
            }

            try {
                const camps = await organizerCollection.find({ created_by: email }).toArray();
                res.json(camps);
            } catch {
                res.status(500).json({ message: 'Failed to fetch camps' });
            }
        });

        app.get('/camps', async (req, res) => {
            try {
                const { search = '', sort = '' } = req.query;
                let query = {};
                if (search) query = { $or: [{ campName: { $regex: search, $options: 'i' } }, { location: { $regex: search, $options: 'i' } }, { healthcareProfessionalName: { $regex: search, $options: 'i' } }] };
                let sortOption = {};
                if (sort === 'most-registered') sortOption = { participantCount: -1 };
                else if (sort === 'fees') sortOption = { campFees: 1 };
                else if (sort === 'name') sortOption = { campName: 1 };
                const camps = await organizerCollection.find(query).sort(sortOption).toArray();
                res.json(camps);
            } catch {
                res.status(500).json({ message: 'Failed to fetch camps' });
            }
        });

        app.post('/camps', async (req, res) => {
            const { campName, campFees, dateTime, location, image, description, healthcareProfessionalName, created_by } = req.body;
            if (!campName || !created_by) return res.status(400).json({ message: 'Camp name and creator required' });
            const camp = { campName, campFees: Number(campFees), dateTime: new Date(dateTime), location, image, description, healthcareProfessionalName, created_by, participantCount: 0, createdAt: new Date() };
            try {
                const result = await organizerCollection.insertOne(camp);
                res.status(201).json({ insertedId: result.insertedId });
            } catch {
                res.status(500).json({ message: 'Failed to create camp' });
            }
        });

        app.get('/camp/:id', async (req, res) => {
            const { id } = req.params;
            try {
                const camp = await organizerCollection.findOne({ _id: new ObjectId(id) });
                if (!camp) return res.status(404).json({ message: 'Camp not found' });
                res.json(camp);
            } catch {
                res.status(500).json({ message: 'Failed to fetch camp' });
            }
        });

        app.put('/update-camp/:id', async (req, res) => {
            const { id } = req.params;
            const { campName, dateTime, location, healthcareProfessionalName } = req.body;
            try {
                const result = await organizerCollection.updateOne({ _id: new ObjectId(id) }, { $set: { campName, dateTime: new Date(dateTime), location, healthcareProfessionalName } });
                res.json({ modifiedCount: result.modifiedCount });
            } catch {
                res.status(500).json({ message: 'Failed to update camp' });
            }
        });

        app.delete('/delete-camp/:campId', async (req, res) => {
            const { campId } = req.params;
            try {
                const result = await organizerCollection.deleteOne({ _id: new ObjectId(campId) });
                res.json({ deletedCount: result.deletedCount });
            } catch {
                res.status(500).json({ message: 'Failed to delete camp' });
            }
        });



        app.post('/participant/register/:campId', async (req, res) => {
            const { campId } = req.params;
            const { participantName, participantEmail, age, phoneNumber, gender, emergencyContact } = req.body;
            if (!participantName || !participantEmail || !age || !phoneNumber || !gender || !emergencyContact)
                return res.status(400).json({ message: 'All fields are required' });

            try {
                // Get camp details to include campFees
                const camp = await organizerCollection.findOne({ _id: new ObjectId(campId) });
                if (!camp) return res.status(404).json({ message: 'Camp not found' });

                const exist = await registrationsCollection.findOne({
                    campId: new ObjectId(campId),
                    participantEmail
                });

                const registration = {
                    campId: new ObjectId(campId),
                    participantName,
                    participantEmail,
                    age,
                    phoneNumber,
                    gender,
                    emergencyContact,
                    campFees: camp.campFees, // Add campFees from the camp document
                    paymentStatus: 'unpaid',
                    confirmationStatus: 'Pending',
                    registeredAt: new Date()
                };

                await registrationsCollection.insertOne(registration);
                await organizerCollection.updateOne(
                    { _id: new ObjectId(campId) },
                    { $inc: { participantCount: 1 } }
                );
                res.status(201).json({ message: 'Registered successfully' });
            } catch (err) {
                console.error('Registration error:', err);
                res.status(500).json({ message: 'Registration failed' });
            }
        });

        app.get('/participant/camps', verifyFBToken, async (req, res) => {
            const email = req.query.email;
            if (req.decoded.email !== email) {
                return res.status(403).send({ message: 'forbidden access' })
            }

            if (!email) return res.status(400).json({ message: 'User email required' });
            try {
                const registrations = await registrationsCollection.aggregate([
                    { $match: { participantEmail: email } },
                    { $lookup: { from: 'organizers', localField: 'campId', foreignField: '_id', as: 'campDetails' } },
                    { $unwind: '$campDetails' },
                    { $project: {
                            _id: 1,
                            campName: '$campDetails.campName',
                            campFees: '$campDetails.campFees',
                            participantName: 1,
                            paymentStatus: 1,
                            confirmationStatus: 1,
                            registeredAt: 1
                        } },
                ]).toArray();
                res.json(registrations);
            } catch {
                res.status(500).json({ message: 'Failed to fetch registrations' });
            }
        });



        app.put('/participant/camp/:registrationId/pay', async (req, res) => {
            const { registrationId } = req.params;
            const { transactionId } = req.body;
            try {
                const registration = await registrationsCollection.findOne({ _id: new ObjectId(registrationId) });
                if (!registration) return res.status(404).json({ message: 'Registration not found' });

                const amount = Number(registration.campFees) || 0;

                // Update both paymentStatus and confirmationStatus
                await registrationsCollection.updateOne(
                    { _id: new ObjectId(registrationId) },
                    { $set: { paymentStatus: 'paid', transactionId, confirmationStatus: 'Confirmed' } }
                );

                await paymentsCollection.insertOne({
                    registrationId: new ObjectId(registrationId),
                    participantEmail: registration.participantEmail,
                    campId: registration.campId,
                    transactionId,
                    amount: amount,
                    date: new Date()
                });

                res.json({ message: 'Payment successful' });
            } catch (err) {
                console.error('Payment processing error:', err);
                res.status(500).json({ message: 'Failed to process payment' });
            }
        });

        app.put('/participant/camp/:registrationId/confirm', async (req, res) => {
            const { registrationId } = req.params;
            try {
                const result = await registrationsCollection.updateOne(
                    { _id: new ObjectId(registrationId) },
                    { $set: { confirmationStatus: 'Confirmed' } }
                );
                if (result.modifiedCount > 0) res.json({ message: 'Confirmation updated' });
                else res.status(404).json({ message: 'Registration not found' });
            } catch {
                res.status(500).json({ message: 'Failed to update confirmation' });
            }
        });




        app.delete('/participant/camp/:registrationId/cancel', async (req, res) => {
            const { registrationId } = req.params;
            try {
                const registration = await registrationsCollection.findOne({ _id: new ObjectId(registrationId) });
                if (!registration) return res.status(404).json({ message: 'Registration not found' });
                await organizerCollection.updateOne({ _id: registration.campId }, { $inc: { participantCount: -1 } });
                const result = await registrationsCollection.deleteOne({ _id: new ObjectId(registrationId) });
                if (result.deletedCount === 0) return res.status(404).json({ message: 'Cancellation failed' });
                res.json({ message: 'Registration cancelled' });
            } catch {
                res.status(500).json({ message: 'Cancellation failed' });
            }
        });

        app.post('/participant/camp/:registrationId/feedback', async (req, res) => {
            const { registrationId } = req.params;
            const { rating, comment } = req.body;
            if (!rating || !comment) return res.status(400).json({ message: 'Rating and comment required' });
            try {
                const registration = await registrationsCollection.findOne({ _id: new ObjectId(registrationId) });
                if (!registration || registration.paymentStatus !== 'paid') return res.status(400).json({ message: 'Only paid users can submit feedback' });
                await feedbackCollection.insertOne({ registrationId: new ObjectId(registrationId), participantEmail: registration.participantEmail, campId: registration.campId, rating, comment, date: new Date() });
                res.status(201).json({ message: 'Feedback submitted' });
            } catch {
                res.status(500).json({ message: 'Failed to submit feedback' });
            }
        });

        // Existing feedback endpoint...
        app.get('/feedback', async (req, res) => {
            try {
                const feedback = await feedbackCollection.aggregate([
                    {
                        $lookup: {
                            from: "registrations",
                            localField: "registrationId",
                            foreignField: "_id",
                            as: "registration"
                        }
                    },
                    { $unwind: "$registration" },
                    {
                        $lookup: {
                            from: "organizers",
                            localField: "campId",
                            foreignField: "_id",
                            as: "camp"
                        }
                    },
                    { $unwind: "$camp" },
                    {
                        $project: {
                            _id: 1,
                            rating: 1,
                            comment: 1,
                            date: 1,
                            campName: "$camp.campName",
                            participantEmail: 1
                        }
                    }
                ]).sort({ date: -1 }).toArray();
                res.json(feedback);
            } catch (err) {
                console.error("Failed to fetch feedback:", err);
                res.status(500).json({ message: 'Failed to fetch feedback' });
            }
        });

// Existing organizer-camps endpoint...
        app.get('/organizer-camps', async (req, res) => {
            const { sort, limit } = req.query;
            console.log('Requested sort:', sort, 'limit:', limit);
            try {
                let sortOption = { participantCount: -1 };
                if (sort === 'participantCount') sortOption = { participantCount: -1 };
                const camps = await organizerCollection.find()
                    .sort(sortOption)
                    .limit(Number(limit) || 6)
                    .toArray();
                res.json(camps);
            } catch (err) {
                console.error('Error fetching popular camps:', err);
                res.status(500).json({ message: 'Failed to fetch popular camps' });
            }
        });


        app.get('/payments', verifyFBToken,  async (req, res) => {
            const email = req.query.email;
            if (req.decoded.email !== email) {
                return res.status(403).send({ message: 'forbidden access' })
            }
            // console.log('emaillll', email)

            // console.log('decoded', req.decoded)

            try {
                const payments = await paymentsCollection.find({ participantEmail: email }).sort({ date: -1 }).toArray();
                res.json(payments);
            } catch {
                res.status(500).json({ message: 'Failed to fetch payments' });
            }
        });

        // Stripe payment intent
        app.post('/create-payment-intent', async (req, res) => {
            try {
                const { amountInCents } = req.body;
                const paymentIntent = await stripe.paymentIntents.create({ amount: amountInCents, currency: 'usd', payment_method_types: ['card'] });
                res.json({ clientSecret: paymentIntent.client_secret });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

    } catch (err) {
        console.error("Server error:", err);
    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});