import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRequest } from "@/Library/hooks";

export default function AdminForm({ onClose }) {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm();

    const { isProcessing, postRequest } = useRequest();

    const onSubmit = async (data) => {

        // Prepare FormData for file and other fields
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (key === "profile_image") {
                formData.append(key, data[key][0]); // Append the first file
            } else {
                formData.append(key, data[key]);
            }
        });
        postRequest("admin.users.create", formData, {
            onSuccess: () => {
                toast.success("Coordinator added successfully!", { duration: 3000 });
                reset();
                onClose();
            },
            onError:(error)=>{
                console.log(error)
                toast.error("Error adding coordinator")
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
                <div className="row">
                    <div className="mb-3 col">
                        <label htmlFor="firstname" className="form-label">
                            First Name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstname"
                            {...register("firstname", {
                                required: "First name is required",
                            })}
                        />
                        {errors.firstname && (
                            <p className="text-danger">{errors.firstname.message}</p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div className="mb-3 col">
                        <label htmlFor="lastname" className="form-label">
                            Last Name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastname"
                            {...register("lastname", {
                                required: "Last name is required",
                            })}
                        />
                        {errors.lastname && (
                            <p className="text-danger">{errors.lastname.message}</p>
                        )}
                    </div>
                </div>

                {/* Profile Image */}
                <div className="mb-3">
                    <label htmlFor="profile_image" className="form-label">
                        Profile Image
                    </label>
                    <input
                        type="file"
                        accept=".jpg,.png"
                        className="form-control"
                        id="profile_image"
                        {...register("profile_image")}
                    />
                    {errors.profile_image && (
                        <p className="text-danger">{errors.profile_image.message}</p>
                    )}
                </div>
                
                {/* Email */}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Invalid email format",
                            },
                        })}
                    />
                    {errors.email && (
                        <p className="text-danger">{errors.email.message}</p>
                    )}
                </div>

                {/* Username */}
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                        Username
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        {...register("username", {
                            required: "Username is required",
                        })}
                    />
                    {errors.username && (
                        <p className="text-danger">{errors.username.message}</p>
                    )}
                </div>

                <div className="d-grid gap-2" style={{gridTemplateColumns:'repeat(2,1fr)'}}>
                    {/* Password */}
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters",
                                },
                            })}
                        />
                        {errors.password && (
                            <p className="text-danger">{errors.password.message}</p>
                        )}
                    </div>
                    {/* Confirm Password */}
                    <div className="mb-3">
                        <label htmlFor="password_confirmation" className="form-label">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password_confirmation"
                            {...register("password_confirmation", {
                                required: "Confirm Password is required",
                                validate: (value) =>
                                    value === watch("password") || "Passwords do not match",
                            })}
                        />
                        {errors.password_confirmation && (
                            <p className="text-danger">{errors.password_confirmation.message}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="modal-footer">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onClose}
                >
                    Close
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || isProcessing}
                >
                    Add
                </button>
            </div>
        </form>
    );
}
