import { Head, Link } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { toast } from "sonner";
import { useRequest } from "@/Library/hooks";
import MainLayout from "@/Layouts/MainLayout";
import Navbar from "@/Components/Navigation/Navbar";
import "../../../../css/student/students.css";
import "../../../../css/student/welcome.css";
import { router } from "@inertiajs/react";


const Welcome = ({ student, hasExistingPretest }) => {
    const studentData = student.data;
    const contentRef = useRef(null);

    useEffect(() => {
        gsap.from(contentRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power2.out"
        });
    }, []);

    const handlePretestStart = (e) => {
        e.preventDefault();
        
        router.get(route('pretest.start'), {}, {
            preserveState: true,
            onError: () => {
                toast.error('Failed to start pretest. Please try again.');
            }
        });
    };

    return (
        <>
            <Head title="Welcome" />
            <Navbar isLight={false} />
            <div className="row align-items-center full-height custom-margin">
                <div className="col-md-4 left-column">
                    <div className="ps-4 ms-5" ref={contentRef}>
                        <h1 className="mb-4">Hi, {studentData.firstname}!</h1>
                        {hasExistingPretest ? (
                            <>
                                {toast.success(
                                    "You have already completed the pretest assessment. You can proceed to explore other features of TopIT.",
                                    {
                                        duration: 5,
                                        position: "top-center",
                                    }
                                )}
                                <p className="fs-5 mb-4">
                                    You've already completed the pre-test. 
                                    Feel free to explore your dashboard and
                                    start your learning journey!
                                </p>
                                <Link
                                    href={route("dashboard")}
                                    className="btn btn-primary w-50 p-2"
                                >
                                    Go to Dashboard
                                </Link>
                            </>
                        ) : (
                            <>
                                <p className="fs-5 mb-4 mt-4">
                                    Welcome to TopIT. We're excited to help you
                                    on your journey toward mastering the key
                                    concepts and skills required for the TOPCIT
                                    exam.
                                </p>
                                <p className="fs-5 mb-4">
                                    First, let's take a quick{" "}
                                    <strong>assessment test</strong>. This will
                                    help us understand your current proficiency
                                    across various domains.
                                </p>
                                <Link
                                    onClick={handlePretestStart}
                                    className="btn btn-primary w-50 p-2"
                                >
                                    Proceed to Pretest
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                <div className="col-md-6 text-center right-column">
                    <img
                        src="/assets/welcome.svg"
                        alt="Welcome Image"
                        className="img-fluid"
                    />
                </div>
            </div>
        </>
    );
};

Welcome.layout = (page) => <MainLayout children={page} />;
export default Welcome;