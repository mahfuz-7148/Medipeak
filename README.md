# 🏥 Medical Camp Management System

![Recipe Book App Screenshot](https://i.postimg.cc/XqFsVTTX/medipeak.png)

## 📋 Project Overview

A comprehensive MERN stack web application that streamlines medical camp organization and management. The platform connects organizers with participants, enabling seamless camp creation, registration, payment processing, and real-time coordination.

## 🔗 Live Links

- **Live Website**: https://medipeak-uj4i.vercel.app/

**Admin Credentials:**
- Email: `organizer@gmail.com`
- Password: `Admin1`

## 💻 Technologies Used

**Frontend:** React.js, React Router, TanStack Query, Tailwind CSS, Stripe.js, React Hook Form, Recharts

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt

**Tools:** Vite, Firebase Auth, Vercel

## ✨ Core Features

- 🏥 **Camp Management** - Create, edit, and delete medical camps
- 👥 **User Registration** - Participant registration with modal interface
- 💳 **Stripe Payments** - Secure payment processing
- 📊 **Analytics Dashboard** - Visual data charts with Recharts
- 🔍 **Search & Filter** - Advanced camp search and sorting
- 📱 **Responsive Design** - Mobile, tablet, desktop compatible
- 🔐 **JWT Authentication** - Secure role-based access
- ⭐ **Feedback System** - Post-payment ratings and reviews
- 📄 **Pagination** - Efficient data display (10 items/page)
- 🔔 **Real-time Notifications** - Toast alerts for all actions

## 📦 Key Dependencies

### Client Dependencies
```json
{
  "react": "^18.2.0",
  "@tanstack/react-query": "^4.29.0",
  "react-router-dom": "^6.8.0",
  "react-hook-form": "^7.43.0",
  "@stripe/stripe-js": "^1.52.0",
  "recharts": "^2.5.0",
  "react-hot-toast": "^2.4.0",
  "tailwindcss": "^3.2.0",
  "axios": "^1.3.0"
}
```

### Server Dependencies
```json
{
  "express": "^4.18.0",
  "mongodb": "^5.1.0",
  "mongoose": "^7.0.0",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.0",
  "stripe": "^12.0.0",
  "cors": "^2.8.0",
  "dotenv": "^16.0.0"
}
```

## 🚀 Local Setup Guide

### Prerequisites
- Node.js (v16+)
- MongoDB (local/Atlas)
- Git

### Client Setup

1. **Clone & Install**
   ```bash
   git clone https://github.com/mahfuz-7148/Medipeak.git
   cd mcms-client
   npm install
   ```

2. **Environment Variables**
   Create `.env.local`:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_API_URL=http://localhost:5000
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```


## 🎯 Key Functionality

**Organizers:**
- Manage camp creation and updates
- Monitor participant registrations
- Process payment confirmations
- View comprehensive analytics

**Participants:**
- Browse and search medical camps
- Register through secure payment system
- Track registration and payment history
- Provide feedback and ratings


## 📞 Contact

**Developer:** Mahfuzur Rahman Shanto  
**Email:** mrahman7148@gmail.com  
 


---

<div align="center">
Made with ❤️ for Healthcare Community Management
</div>
