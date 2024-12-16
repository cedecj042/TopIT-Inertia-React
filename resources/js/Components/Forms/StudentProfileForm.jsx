import { useRequest } from "@/Library/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";

export default function StudentProfileForm({ student, onClose }) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            student_id: student.student_id || "",
            profile_image: null,
            firstname: student.firstname || "",
            lastname: student.lastname || "",
            birthdate: student.birthdate || "",
            gender: student.gender || "Male",
            address: student.address || "",
            school: student.school || "",
            year: student.year ? student.year.toString() : "",
        },
    });

    const [previewImage, setPreviewImage] = useState(
        student.profile_image ? `/storage/profile_images/${student.profile_image}` : null
    );

    const { postRequest } = useRequest();

    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Get the first selected file
        if (file) {
            setValue("profile_image", file); // Set the file in react-hook-form
            const reader = new FileReader(); // For image preview
            reader.onload = (event) => {
                setPreviewImage(event.target.result); // Set the image preview
            };
            reader.readAsDataURL(file);
        } else {
            setValue("profile_image", null);
            setPreviewImage(null); // Clear the preview if no file is selected
        }
    };


    const onSubmitForm = (data) => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (key === "profile_image" && value instanceof File) {
                formData.append(key, value); // Append the actual file
            } else if (value !== null && value !== undefined && value !== "") {
                formData.append(key, value); // Append other fields
            }
        });

        postRequest("student.profile.edit", formData, {
            onSuccess: () => {
                toast.success("Profile updated successfully!");
                onClose();
            },
            onError: (error) => {
                toast.error("Failed to update profile. Please check the form.");
                console.error(error);
            },
        });
    };


    return (
        <>
            <div className="modal-body">
                <form id="student-profile-form" className="p-4">
                    {/* Profile Image Preview */}
                    <div className="mb-3 text-center">
                        {previewImage ? (
                            <img
                                src={previewImage}
                                alt="Profile Preview"
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

                    {/* Student ID (Hidden) */}
                    <input type="hidden" {...register("student_id")} />

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

                    
                    <div className="row g-3">
                        {/* Birthdate */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Birthdate</label>
                            <input
                                type="date"
                                {...register("birthdate", { required: "Birthdate is required" })}
                                className={`form-control ${errors.birthdate ? "is-invalid" : ""}`}
                            />
                            {errors.birthdate && (
                                <div className="invalid-feedback">{errors.birthdate.message}</div>
                            )}
                        </div>
                        {/* Gender */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Gender</label>
                            <select
                                {...register("gender", { required: "Gender is required" })}
                                className={`form-select ${errors.gender ? "is-invalid" : ""}`}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Others">Others</option>
                            </select>
                            {errors.gender && (
                                <div className="invalid-feedback">{errors.gender.message}</div>
                            )}
                        </div>
                        
                    </div>
                    

                    {/* Address */}
                    <div className="mb-3">
                        <label className="form-label">Address</label>
                        <input
                            type="text"
                            {...register("address", { required: "Address is required" })}
                            className={`form-control ${errors.address ? "is-invalid" : ""}`}
                        />
                        {errors.address && (
                            <div className="invalid-feedback">{errors.address.message}</div>
                        )}
                    </div>

                    {/* School */}
                    <div className="mb-3">
                        <label className="form-label">School</label>
                        <input
                            type="text"
                            {...register("school", { required: "School is required" })}
                            className={`form-control ${errors.school ? "is-invalid" : ""}`}
                        />
                        {errors.school && (
                            <div className="invalid-feedback">{errors.school.message}</div>
                        )}
                    </div>
                    {/* Year */}
                    <div className="mb-3">
                            <label className="form-label">Year</label>
                            <select
                                {...register("year", { required: "Year is required" })}
                                className={`form-select ${errors.year ? "is-invalid" : ""}`}
                            >
                                {[1, 2, 3, 4, 5].map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                            {errors.year && (
                                <div className="invalid-feedback">{errors.year.message}</div>
                            )}
                        </div>
                </form>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
                <button type="button" onClick={onClose} className="btn btn-secondary">
                    Cancel
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmit(onSubmitForm)}
                >
                    Save Changes
                </button>
            </div>
        </>
    );
}
