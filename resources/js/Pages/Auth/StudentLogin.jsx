import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import HeaderLogin from "@/Components/Student/HeaderLogin";
import LoginForm from "@/Components/Forms/LoginForm";
import "../../../css/student/students.css";

export default function StudentLogin() {
    return (
        <>
            <Head title="Student Login" />
            <div className="container-fluid">
                <div className="row vh-100">
                    <HeaderLogin/>
                    <div className="col d-flex align-items-center form-bg">
                        <div className="w-100 px-5 mx-4">
                            <h3 className="fw-semibold">Login</h3>
                            <LoginForm
                                routeName={"login"}
                                btn={"btn-primary"}
                            />
                            <div className="mt-5 text-center">
                                <Link
                                    href="/register"
                                    className="text-dark auth_btn"
                                >
                                    Register Now
                                </Link>
                            </div>
                            <br />
                            <div className="mt-5 text-center">
                                <a
                                    href="/admin/login"
                                    className="text-dark auth_btn"
                                >
                                    Admin Login
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

StudentLogin.layout = (page) => <MainLayout>{page}</MainLayout>