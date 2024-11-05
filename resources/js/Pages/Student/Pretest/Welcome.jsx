import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import Navbar from "@/Components/Navigation/Navbar";
import "../../../../css/student/students.css";
import "../../../../css/student/welcome.css";

const Welcome = ({ student }) => { 
    const studentData = student.data;
    
    return (
        <>
            <Head title="Welcome" />
            <Navbar isLight={false} />
            <div className="row align-items-center full-height custom-margin">
                <div className="col-md-4 left-column">
                    <div className="ps-4 ms-5">
                        <h1 className="mb-4">Hi, {studentData.firstname}!</h1>
                        <p className="fs-5 mb-4 mt-4">
                            Welcome to TopIT. We're excited to help you on your
                            journey toward mastering the key concepts and skills
                            required for the TOPCIT exam.
                        </p>
                        <p className="fs-5 mb-4">
                            First, let’s take a quick{" "}
                            <strong>assessment test</strong>. This will help us
                            understand your current proficiency across various
                            domains.
                        </p>
                        <Link
                            href={route("pretest.start")}
                            className="btn btn-primary w-50 p-2"
                        >
                            Proceed to Pretest
                        </Link>
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
