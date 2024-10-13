import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import HeaderLogin from "@/Components/Student/HeaderLogin";
import FormLogin from "@/Components/Forms/Login";
import "../../../css/student/students.css";

export default function StudentLogin() {
    return (
        <MainLayout>
            <Head title="Student Login" />
            <HeaderLogin></HeaderLogin>
            <div className="col d-flex align-items-center form-bg">
                <div className="w-100 px-5 mx-4">
                    <h3 className="fw-semibold">Login</h3>
                    <FormLogin routeName={"login"} btn={'btn-primary'} />
                    <div className="mt-4">
                        <Link href="#" className="text-dark auth_btn">
                            Forgot Password?
                        </Link>
                    </div>
                    <div className="mt-5 text-center">
                        <Link href="/register" className="text-dark auth_btn">
                            Register Now
                        </Link>
                    </div>
                    <br />
                    <div className="mt-5 text-center">
                        <a href="/admin/login" className="text-dark auth_btn">
                            Admin Login
                        </a>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
