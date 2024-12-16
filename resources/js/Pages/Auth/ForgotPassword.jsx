import React from 'react';
import { Head, Link, useForm } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import HeaderLogin from "@/Components/Student/HeaderLogin";
import "../../../css/student/students.css";
import { Toaster, toast } from 'sonner'; 


export default function ForgotPassword() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/forgot-password', {
            preserveScroll: true,
            onSuccess: (page) => {
                toast.success('Success! Check your email for the reset link.');
            },
            onError: () => {
                toast.error('Failed to send reset link. Please try again.');
            },
        });
    };

    return (
        <>
            <Head title="Forgot Password" />
            <div className="container-fluid">
                <div className="row vh-100">
                    <HeaderLogin />
                    <div className="col d-flex align-items-center form-bg">
                        <div className="w-100 px-5 mx-4">
                            <h3 className="fw-semibold mb-4">Forgot Password</h3>
                            <p className="text-muted mb-4">
                                To recover your password, input your email address for the password reset link.
                            </p>
                            
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

                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100 mt-3"
                                    disabled={processing}
                                >
                                    {processing ? 'Sending...' : 'Submit'}
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

ForgotPassword.layout = (page) => <MainLayout>{page}</MainLayout>