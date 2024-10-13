import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import "../../../../css/student/welcome.css";
import "../../../../css/students.css";
import Navbar from "@/Components/Navigation/Navbar";

const Welcome = () => {
    const { auth } = usePage().props;

    return (
        <MainLayout>
            <Navbar />
            <div className="row align-items-center full-height custom-margin">
                <div className="col-md-4 left-column">
                    <div className="ps-4 ms-5">
                        <h1 className="mb-4">Hi, {auth.user}!</h1>
                        <p className="fs-5 mb-4 mt-4">
                            Welcome to TopIT. We're excited to help you on your journey toward mastering the key concepts and skills required for the TOPCIT exam.
                        </p>
                        <p className="fs-5 mb-4">
                            First, let’s take a quick <strong>assessment test</strong>. This will help us understand your current proficiency across various domains.
                        </p>
                        <Link href={route('pretest.start')} className="btn btn-primary w-50 p-2">
                            Proceed to Pretest
                        </Link>
                    </div>
                </div>
                <div className="col-md-6 text-center right-column">
                    <img src="/assets/welcome.svg" alt="Welcome Image" className="img-fluid" />
                </div>
            </div>
        </MainLayout>
    );
};

export default Welcome;
