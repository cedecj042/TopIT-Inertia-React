// RegisterForm.jsx
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { toast } from "sonner";
import { useRequest } from "@/Library/hooks";

export default function RegisterForm({ routeName }) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();

    const { isProcessing, postRequest } = useRequest();
    const [previewImage, setPreviewImage] = useState(null);

    // Handle file changes and set the profile image in the form state
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

    // Handle form submission
    const onSubmit = async (data) => {
        const formData = new FormData();

        // Append fields to FormData
        Object.entries(data).forEach(([key, value]) => {
            if (key === "profile_image" && value instanceof File) {
                formData.append(key, value); // Append the actual file
            } else if (value !== null && value !== undefined && value !== "") {
                formData.append(key, value); // Append other fields
            }
        });

        postRequest(routeName, formData, {
            onSuccess: () => {
                toast.success("Registration Successful", { duration: 3000 });
                reset();
                setPreviewImage(null); // Clear the preview
            },
            onError: (error) => {
                toast.error("Registration Failed", { duration: 3000 });
                console.error(error);
            },
        });
    };

    // Animation on mount
    const formRef = useRef(null);
    useEffect(() => {
        const elements = formRef.current.querySelectorAll(".stagger-item");
        gsap.from(elements, {
            opacity: 0,
            y: 50,
            duration: 0.6,
            stagger: 0.2,
            ease: "power3.out",
        });
    }, []);

    return (
        <form onSubmit={handleSubmit(onSubmit)} ref={formRef} encType="multipart/form-data" className="row g-3 mb-5">
            <h3 className="stagger-item">Register</h3>
            <hr />
            <h5 className="stagger-item">Personal Details</h5>

            {/* Profile Image Preview */}
            <div className="col-12 stagger-item text-center">
                {previewImage ? (
                    <img
                        src={previewImage}
                        alt="Profile Preview"
                        className="img-thumbnail"
                        width="150"
                        height="150"
                    />
                ) : (
                    <p>No profile image selected</p>
                )}
            </div>

            {/* Profile Image Upload */}
            <div className="col-12 stagger-item">
                <label htmlFor="profile_image" className="form-label">
                    Profile Image
                </label>
                <input
                    className="form-control w-100"
                    type="file"
                    id="profile_image"
                    accept="image/*"
                    onChange={handleFileChange} // Manually handle file changes
                />
                <p className="text-danger">{errors.profile_image?.message}</p>
            </div>

            <div className="col-md-6 stagger-item">
                <label htmlFor="firstname" className="form-label">First Name</label>
                <input
                    type="text"
                    className="form-control auth-textbox"
                    id="firstname"
                    placeholder="Juan"
                    {...register('firstname', {
                        required: "First name is required"
                    })}
                />
                <p className="text-danger">{errors.firstname?.message}</p>
            </div>

            <div className="col-md-6 stagger-item">
                <label htmlFor="lastname" className="form-label">Last Name</label>
                <input
                    type="text"
                    className="form-control auth-textbox"
                    id="lastname"
                    placeholder="Dela Cruz"
                    {...register('lastname', {
                        required: "Last name is required"
                    })}
                />
                <p className="text-danger">{errors.lastname?.message}</p>
            </div>

            <div className="col-md-6 stagger-item">
                <label htmlFor="birthdate" className="form-label">Birthdate</label>
                <input
                    type="date"
                    className="form-control auth-textbox"
                    id="birthdate"
                    {...register('birthdate', {
                        required: "Birthdate is required"
                    })}
                />
                <p className="text-danger">{errors.birthdate?.message}</p>
            </div>

            <div className="col-md-6 stagger-item">
                <label htmlFor="gender" className="form-label">Gender</label>
                <select
                    id="gender"
                    className="form-select auth-textbox"
                    {...register('gender', {
                        required: "Gender is required"
                    })}
                >
                    <option value="">Choose...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                </select>
                <p className="text-danger">{errors.gender?.message}</p>
            </div>

            <div className="col-12 stagger-item">
                <label htmlFor="address" className="form-label">Address</label>
                <input
                    type="text"
                    className="form-control auth-textbox"
                    id="address"
                    placeholder="1234 Main St"
                    {...register('address', {
                        required: "Address is required"
                    })}
                />
                <p className="text-danger">{errors.address?.message}</p>
            </div>

            <div className="col-12 stagger-item">
                <label htmlFor="course" className="form-label">Course</label>
                <input
                    type="text"
                    className="form-control auth-textbox"
                    id="course"
                    placeholder="Bachelor of Science Major in Computer Science"
                    {...register('course', {
                        required: "Course is required"
                    })}
                />
                <p className="text-danger">{errors.course?.message}</p>
            </div>

            <div className="col-8 stagger-item">
                <label htmlFor="school" className="form-label">School</label>
                <input
                    type="text"
                    className="form-control auth-textbox"
                    id="school"
                    placeholder="University of ..."
                    {...register('school', {
                        required: "School is required"
                    })}
                />
                <p className="text-danger">{errors.school?.message}</p>
            </div>

            <div className="col-md-4 stagger-item">
                <label htmlFor="year" className="form-label">Year Level</label>
                <select
                    id="year"
                    className="form-select auth-textbox"
                    {...register('year', {
                        required: "Year level is required"
                    })}
                >
                    <option value="">Choose...</option>
                    {[1, 2, 3, 4, 5, 6].map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
                <p className="text-danger">{errors.year?.message}</p>
            </div>

            <hr />
            <h5 className="stagger-item">Login Details</h5>

            <div className="col-12 stagger-item">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                    type="text"
                    className="form-control auth-textbox"
                    id="username"
                    placeholder="Enter username"
                    {...register('username', {
                        required: "Username is required"
                    })}
                />
                <p className="text-danger">{errors.username?.message}</p>
            </div>

            <div className="col-12 stagger-item">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                    type="email"
                    className="form-control auth-textbox"
                    id="email"
                    placeholder="sample@email.com"
                    {...register('email', {
                        required: "Email is required",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                        }
                    })}
                />
                <p className="text-danger">{errors.email?.message}</p>
            </div>

            <div className="col-md-6 stagger-item">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                    type="password"
                    className="form-control auth-textbox"
                    id="password"
                    placeholder="********"
                    {...register('password', {
                        required: "Password is required",
                        minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters"
                        }
                    })}
                />
                <p className="text-danger">{errors.password?.message}</p>
            </div>

            <div className="col-md-6 stagger-item">
                <label htmlFor="password_confirmation" className="form-label">Confirm Password</label>
                <input
                    type="password"
                    className="form-control auth-textbox"
                    id="password_confirmation"
                    placeholder="********"
                    {...register('password_confirmation', {
                        required: "Please confirm your password"
                    })}
                />
                <p className="text-danger">{errors.password_confirmation?.message}</p>
            </div>

            <div className="col-12 stagger-item">
                <button
                    type="submit"
                    disabled={isSubmitting || isProcessing}
                    className="btn btn-primary w-100 auth-button"
                >
                    Register
                </button>
            </div>
        </form>
    );
}