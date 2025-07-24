import { useEffect, useState } from "react";
import { FaUserShield, FaUserEdit } from "react-icons/fa";
import useAuth from '../../../Hooks/useAuth.jsx';
import useAxios from '../../../Hooks/useAxios.jsx';

function ProfileSkeleton() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4">
            <div className="w-full max-w-2xl mx-auto p-10 rounded-2xl shadow-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/40 dark:border-slate-700/40 flex gap-8 animate-pulse">
                <div className="w-28 h-28 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                <div className="flex-1 space-y-4">
                    <div className="h-6 w-1/3 rounded bg-slate-200 dark:bg-slate-700"></div>
                    <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700"></div>
                    <div className="h-4 w-1/4 rounded bg-slate-200 dark:bg-slate-700"></div>
                </div>
            </div>
        </div>
    );
}

export default function ParticipantProfile() {
    const { saveUser, loading } = useAuth();
    const axios = useAxios();

    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({ name: "", image: "", phone: "" });
    const [updating, setUpdating] = useState(false);

    // Fetch profile
    useEffect(() => {
        if (saveUser?.email) {
            axios
                .get(`/profile?email=${saveUser.email}`)
                .then((res) => {
                    setProfile(res.data);
                    setForm({
                        name: res.data.name || "",
                        image: res.data.image || "https://i.ibb.co/t3fD2jf/user.png",
                        phone: res.data.phone || "",
                    });
                })
                .catch(console.error);
        }
    }, [saveUser, axios]);

    if (loading || !profile) return <ProfileSkeleton />;

    const { name, image, role, email, phone } = profile;

    // Input change for update
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Submit update
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const payload = { email, name: form.name, image: form.image, phone: form.phone };
            const { data } = await axios.put('/profile', payload);
            if (data.modifiedCount > 0 || data.success) {
                setProfile(payload);
                setEditMode(false);
            } else alert("No changes detected or update failed.");
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update profile, please try again.");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
            <div className="max-w-2xl mx-auto bg-white/80 dark:bg-slate-800/80 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-8 flex flex-col gap-6">
                {/* Profile Display */}
                {!editMode && (
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                        <img
                            src={image || "https://i.ibb.co/t3fD2jf/user.png"}
                            alt="Profile"
                            className="w-28 h-28 rounded-full border-4 border-indigo-300 dark:border-indigo-700 shadow-lg object-cover"
                        />
                        <div className="flex-1 text-center sm:text-left">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent mb-1">{name || "Anonymous"}</h2>
                            <p className="text-slate-600 dark:text-slate-300">{email}</p>
                            {role && role !== "user" && (
                                <p className="flex items-center gap-2 mt-1 justify-center sm:justify-start text-blue-600 dark:text-blue-400 text-sm font-semibold">
                                    <FaUserShield /> <span className="capitalize">{role}</span>
                                </p>
                            )}
                            {phone && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">📞 {phone}</p>
                            )}
                            <button
                                onClick={() => setEditMode(true)}
                                className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow transition"
                            >
                                <FaUserEdit /> Update Profile
                            </button>
                        </div>
                    </div>
                )}

                {/* Edit Profile Form */}
                {editMode && (
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5 max-w-xl mx-auto"
                        autoComplete="off"
                    >
                        <div>
                            <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-200">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-200">
                                Image URL
                            </label>
                            <input
                                type="url"
                                name="image"
                                value={form.image}
                                onChange={handleChange}
                                placeholder="https://example.com/avatar.png"
                                className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-200">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="+8801XXXXXXXXX"
                                className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => setEditMode(false)}
                                className="px-6 py-2 rounded-xl bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-400 dark:hover:bg-slate-600 transition"
                                disabled={updating}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                                disabled={updating}
                            >
                                {updating ? "Updating..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
