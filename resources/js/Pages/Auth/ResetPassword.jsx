import React, { useState } from 'react';
import { Head, Link, useForm } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import HeaderLogin from "@/Components/Student/HeaderLogin";
import "../../../css/student/students.css";

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email || '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/reset-password', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Password has been reset successfully! You can now log in.');
            },
            onError: () => {
                toast.error('Failed to reset the password. Please check the details and try again.');
            },
        });
    };

    return (
        <>
            <Head title="Reset Password" />
            <div className="container-fluid">
                <div className="row vh-100">
                    <HeaderLogin />
                    <div className="col d-flex align-items-center form-bg">
                        <div className="w-100 px-5 mx-4">
                            <h3 className="fw-semibold mb-4">Reset Password</h3>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email Address</label>
                                    <input 
                                        type="email" 
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback">
                                            {errors.email}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">New Password</label>
                                    <input 
                                        type="password" 
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        id="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    {errors.password && (
                                        <div className="invalid-feedback">
                                            {errors.password}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password_confirmation" className="form-label">Confirm Password</label>
                                    <input 
                                        type="password" 
                                        className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                                        id="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    {errors.password_confirmation && (
                                        <div className="invalid-feedback">
                                            {errors.password_confirmation}
                                        </div>
                                    )}
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100 mt-3"
                                    disabled={processing}
                                >
                                    {processing ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </form>

                            <div className="mt-4 text-center">
                                <Link 
                                    href="/login" 
                                    className="text-dark auth_btn"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ResetPassword.layout = (page) => <MainLayout>{page}</MainLayout>