import { useRequest } from "@/Library/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function AdminProfileForm({ onclose, auth }) {
    const admin = auth.userable.data;
    const {
        register,
        formState: { isSubmitting, errors },
        handleSubmit,
        setValue,
    } = useForm({
        defaultValues: {
            user_id: auth?.user?.user_id,
            username: auth?.user?.username || "",
            email: auth?.user?.email || "",
            firstname: admin?.firstname || "",
            lastname: admin?.lastname || "",
            profile_image: null,
        }
    });
    const { isProcessing, postRequest } = useRequest();
    const [previewImage, setPreviewImage] = useState(
        admin?.profile_image ? `/storage/profile_images/${admin?.profile_image}` : null
    );

    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Get the first selected file
        if (file) {
            setValue("profile_image", file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreviewImage(event.target.result); 
            };
            reader.readAsDataURL(file);
        } else {
            setValue("profile_image", null);
            setPreviewImage(null);
        }
    };

    const submitForm = (data) => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (key === "profile_image" && value instanceof File) {
                formData.append(key, value); // Append the actual file
            } else if (value !== null && value !== undefined && value !== "") {
                formData.append(key, value); // Append other fields
            }
        });

        postRequest("admin.profile.update",formData, {
            onSuccess: (data) => {
                toast.success("Profile updated successfully!");
                onclose();
            },
            onError: (error) => {
                toast.error("Failed to update profile. Please check the form.");
            }
        });
    }


    return (
        <>
            <div className="modal-body">
                <form  encType="multipart/form-data">
                    <input type="number" hidden={true} {...register("user_id")} />
                    {/* Profile Image Preview */}
                    <div className="mb-3 text-center">
                        {previewImage ? (
                            <img
                                src={previewImage}
                                alt="Profile"
                                className="img-thumbnail"
                                width="150"
                                height="150"
                            />
                        ) : (
                            <p>No profile image available</p>
                        )}
                    </div>

                    {/* Profile Image Upload */}
                    <div className="mb-3">
                        <label className="form-label">Profile Image</label>
                        <input
                            type="file"
                            name="profile_image"
                            id="profile_image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="form-control"
                        />
                    </div>

                    <div className="row g-3">
                        {/* First Name */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label">First Name</label>
                            <input
                                type="text"
                                {...register("firstname", { required: "First name is required" })}
                                className={`form-control ${errors.firstname ? "is-invalid" : ""}`}
                            />
                            {errors.firstname && (
                                <div className="invalid-feedback">{errors.firstname.message}</div>
                            )}
                        </div>

                        {/* Last Name */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Last Name</label>
                            <input
                                type="text"
                                {...register("lastname", { required: "Last name is required" })}
                                className={`form-control ${errors.lastname ? "is-invalid" : ""}`}
                            />
                            {errors.lastname && (
                                <div className="invalid-feedback">{errors.lastname.message}</div>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="text"
                            {...register("email", { required: "Email is required" })}
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        />
                        {errors.lastname && (
                            <div className="invalid-feedback">{errors.email.message}</div>
                        )}
                    </div>

                    {/* Username*/}
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            {...register("username", { required: "Username is required" })}
                            className={`form-control ${errors.username ? "is-invalid" : ""}`}
                        />
                        {errors.lastname && (
                            <div className="invalid-feedback">{errors.username.message}</div>
                        )}
                    </div>
                </form>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onclose} disabled={isProcessing || isSubmitting}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleSubmit(submitForm)} disabled={isProcessing || isSubmitting}>Save</button>
            </div>
        </>
    );
}