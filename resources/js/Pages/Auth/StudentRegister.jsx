import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import Navbar from "@/Components/Navigation/Navbar";
import RegisterForm from "@/Components/Forms/RegisterForm";
import "../../../css/student/students.css";

export default function StudentRegister() {
    return (
        <>
            <Head title="Student Register" />
            <Navbar isLight={false} />
            <div className="row d-flex justify-content-center mb-5">
                <div className="col-6 mb-5 mt-5">
                    <button
                        onClick={() => window.history.back()}
                        className="btn btn-link text-dark text-decoration-none mb-4"
                    >
                        <i className="bi bi-arrow-left"></i> Back
                    </button>
                    <RegisterForm routeName={"register"} />
                </div>
            </div>
        </>
    );
}

StudentRegister.layout = (page) => <MainLayout>{page}</MainLayout>;
