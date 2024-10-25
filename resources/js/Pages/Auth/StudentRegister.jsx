// Existing imports...
import React, { useState } from "react";
import axios from "axios";
import "../../../css/student/students.css";
import MainLayout from "@/Layouts/MainLayout";

export default function StudentRegister(){
    const [formData, setFormData] = useState({
        profile_image: null,
        firstname: "",
        lastname: "",
        birthdate: "",
        gender: "",
        address: "",
        course: "",
        school: "",
        year: "",
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "profile_image" ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccess("");
        setError("");

        const formDataToSubmit = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSubmit.append(key, formData[key]);
        });

        try {
            const response = await axios.post("/register", formDataToSubmit);
            setSuccess(response.data.message);
            setTimeout(() => history.push("/student/login"), 2000);
        } catch (err) {
            if (err.response && err.response.data.errors) {
                setErrors(err.response.data.errors);
            } else if (err.response && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError("An error occurred. Please try again later.");
            }
        }
    };

    return (
        <>
            <div className="row d-flex justify-content-start mb-5">
                <div className="col">
                    <img
                        src="/assets/logo-2.svg"
                        alt="TopIT Logo"
                        width="100"
                        height="30"
                        className="mt-4 ms-4"
                    />
                </div>
            </div>
            <div className="row d-flex justify-content-center mb-5">
                <div className="col-6 mb-5">
                    <a
                        href="/login"
                        className="text-dark text-decoration-none d-flex align-items-center gap-2 neg mb-3"
                    >
                        <span className="material-symbols-outlined icons">
                            arrow_back
                        </span>
                        Back
                    </a>
                    <form
                        onSubmit={handleSubmit}
                        className="row g-3 mb-5"
                        encType="multipart/form-data"
                    >
                        <h3>Register</h3>
                        <hr />
                        <h5>Personal Details</h5>
                        <div className="col-12">
                            <label
                                htmlFor="profile_image"
                                className="form-label"
                            >
                                Profile Image
                            </label>
                            <input
                                className="form-control w-100"
                                type="file"
                                id="profile_image"
                                name="profile_image"
                                accept="image/*"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="firstname" className="form-label">
                                First Name
                            </label>
                            <input
                                type="text"
                                className="form-control auth-textbox"
                                id="firstname"
                                name="firstname"
                                placeholder="Juan"
                                value={formData.firstname}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="lastname" className="form-label">
                                Last Name
                            </label>
                            <input
                                type="text"
                                className="form-control auth-textbox"
                                id="lastname"
                                name="lastname"
                                placeholder="Dela Cruz"
                                value={formData.lastname}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="birthdate" className="form-label">
                                Birthdate
                            </label>
                            <input
                                type="date"
                                className="form-control auth-textbox"
                                id="birthdate"
                                name="birthdate"
                                value={formData.birthdate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="gender" className="form-label">
                                Gender
                            </label>
                            <select
                                id="gender"
                                className="form-select auth-textbox"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="">Choose...</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="others">Others</option>
                            </select>
                        </div>
                        <div className="col-12">
                            <label htmlFor="address" className="form-label">
                                Address
                            </label>
                            <input
                                type="text"
                                className="form-control auth-textbox"
                                id="address"
                                name="address"
                                placeholder="1234 Main St"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-12">
                            <label htmlFor="course" className="form-label">
                                Course
                            </label>
                            <input
                                type="text"
                                className="form-control auth-textbox"
                                id="course"
                                name="course"
                                placeholder="Bachelor of Science Major in Computer Science"
                                value={formData.course}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-8">
                            <label htmlFor="school" className="form-label">
                                School
                            </label>
                            <input
                                type="text"
                                className="form-control auth-textbox"
                                id="school"
                                name="school"
                                placeholder="University of ..."
                                value={formData.school}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="year" className="form-label">
                               Year Level
                            </label>
                            <select
                                id="year"
                                className="form-select auth-textbox"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                            >
                                <option value="">Choose...</option>
                                {[1, 2, 3, 4, 5, 6].map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <hr />
                        <h5>Login Details</h5>
                        <div className="col-12">
                            <label htmlFor="username" className="form-label">
                                Username
                            </label>
                            <input
                                type="text"
                                className="form-control auth-textbox"
                                id="username"
                                name="username"
                                placeholder="Enter username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-12">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                className="form-control auth-textbox"
                                id="email"
                                name="email"
                                placeholder="sample@email.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                className="form-control auth-textbox"
                                id="password"
                                name="password"
                                placeholder="********"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label
                                htmlFor="confirm_password"
                                className="form-label"
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                className="form-control auth-textbox"
                                id="confirm_password"
                                name="password_confirmation"
                                placeholder="********"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-12">
                            <button
                                type="submit"
                                className="btn btn-primary w-100 auth-button"
                            >
                                Register
                            </button>
                        </div>
                    </form>

                    {/* displaying errors */}
                    {errors && Object.keys(errors).length > 0 && (
                        <div className="alert alert-danger">
                            <ul>
                                {Object.entries(errors).map(
                                    ([field, messages]) =>
                                        messages.map((message, index) => (
                                            <li key={`${field}-${index}`}>
                                                {message}
                                            </li>
                                        ))
                                )}
                            </ul>
                        </div>
                    )}
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && (
                        <div className="alert alert-success">{success}</div>
                    )}
                </div>
            </div>
        </>
    );
};

StudentRegister.layout = (page) => <MainLayout>{page}</MainLayout>