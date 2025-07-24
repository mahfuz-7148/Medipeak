import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import useAxios from "../../../Hooks/useAxios.jsx";
import useAuth from "../../../Hooks/useAuth.jsx";
import Swal from "sweetalert2";

const AddCamp = () => {
    const axios = useAxios();
    const { saveUser } = useAuth();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");  // আপলোড হওয়া image url

    // মিউটেশন দিয়ে ক্যাম্প ক্রিয়েট করা হবে
    const mutation = useMutation({
        mutationFn: async (campData) => axios.post("/camps", campData),
        onSuccess: () => {
            Swal.fire("Success", "Camp added successfully!", "success");
            reset();
            setImageUrl("");
            setImageFile(null);
        },
        onError: (error) => {
            Swal.fire("Error", error?.response?.data?.message || "Failed to add camp", "error");
        },
    });

    // Image Upload handler (imgbb API)
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await axios.post(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            const url = res.data?.data?.url;
            if (url) {
                setImageUrl(url);

            } else {
                Swal.fire("Error", "Image upload failed!", "error");
            }
        } catch (err) {
            Swal.fire("Error", "Image upload failed!", "error");
            console.error("Image upload error:", err);
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = (data) => {
        if (mutation.isPending) return;

        if (!imageUrl) {
            Swal.fire("Warning", "Please upload an image before submitting.", "warning");
            return;
        }

        const campData = {
            ...data,
            image: imageUrl,
            created_by: saveUser.email,
            campFees: Number(data.campFees),
            participantCount: 0,
        };

        mutation.mutate(campData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-sky-100 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-2">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-2xl rounded-2xl shadow-2xl p-8 bg-white dark:bg-gray-900 border border-blue-100 dark:border-gray-800"
                autoComplete="off"
            >
                <h2 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400 mb-6 text-center tracking-tight">
                    Add a New Camp
                </h2>
                <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
                    {/* Camp Name */}
                    <div>
                        <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">
                            Camp Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register("campName", { required: "Camp name is required" })}
                            className={`w-full border p-2 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 ${
                                errors.campName ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="Camp Name"
                            disabled={mutation.isPending}
                            autoFocus
                        />
                        {errors.campName && <p className="text-red-500 mt-1">{errors.campName.message}</p>}
                    </div>

                    {/* Image File upload */}
                    <div>
                        <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">
                            Upload Image <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={uploading || mutation.isPending}
                            className="w-full border p-2 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400"
                        />
                        {uploading && <p className="text-blue-600 mt-1">Uploading image...</p>}
                        {imageUrl && !uploading && (
                            <img src={imageUrl} alt="Uploaded" className="mt-2 w-32 h-20 object-cover rounded-lg" />
                        )}
                    </div>

                    {/* Camp Fees */}
                    <div>
                        <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">
                            Camp Fees <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            {...register("campFees", {
                                required: "Camp fees are required",
                                min: { value: 0, message: "Fees must be positive" },
                            })}
                            className={`w-full border p-2 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 ${
                                errors.campFees ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="Camp Fees"
                            disabled={mutation.isPending}
                        />
                        {errors.campFees && <p className="text-red-500 mt-1">{errors.campFees.message}</p>}
                    </div>

                    {/* Date and Time */}
                    <div>
                        <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">
                            Date & Time <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            {...register("dateTime", { required: "Date and time are required" })}
                            className={`w-full border p-2 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 ${
                                errors.dateTime ? "border-red-500" : "border-gray-300"
                            }`}
                            disabled={mutation.isPending}
                        />
                        {errors.dateTime && <p className="text-red-500 mt-1">{errors.dateTime.message}</p>}
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">
                            Location <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register("location", { required: "Location is required" })}
                            className={`w-full border p-2 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 ${
                                errors.location ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="Location"
                            disabled={mutation.isPending}
                        />
                        {errors.location && <p className="text-red-500 mt-1">{errors.location.message}</p>}
                    </div>

                    {/* Healthcare Professional Name */}
                    <div>
                        <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">
                            Healthcare Professional Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register("healthcareProfessionalName", {
                                required: "Healthcare professional name is required",
                            })}
                            className={`w-full border p-2 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 ${
                                errors.healthcareProfessionalName ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="Doctor or Specialist"
                            disabled={mutation.isPending}
                        />
                        {errors.healthcareProfessionalName && (
                            <p className="text-red-500 mt-1">{errors.healthcareProfessionalName.message}</p>
                        )}
                    </div>

                    {/* Participant Count (Read only) */}
                    <div>
                        <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">
                            Participant Count
                        </label>
                        <input
                            type="number"
                            value={0}
                            readOnly
                            disabled
                            className="w-full border p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                        />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            {...register("description", { required: "Description is required" })}
                            className={`w-full border p-2 rounded-lg shadow-sm min-h-[80px] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 ${
                                errors.description ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="Describe this camp..."
                            disabled={mutation.isPending}
                        />
                        {errors.description && <p className="text-red-500 mt-1">{errors.description.message}</p>}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={mutation.isPending || uploading}
                    className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3 rounded-xl font-semibold shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {(mutation.isPending || uploading) && (
                        <svg
                            className="animate-spin h-5 w-5 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C6.477 0 2 4.477 2 10c0 1.042.17 2.047.488 3.001l1.464-1.001z"
                            />
                        </svg>
                    )}
                    {mutation.isPending ? "Submitting..." : uploading ? "Uploading Image..." : "Add Camp"}
                </button>
            </form>
        </div>
    );
};

export default AddCamp;
