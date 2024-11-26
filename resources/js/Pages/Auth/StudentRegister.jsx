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
                    <Link
                        href={`/login`}
                        className="text-dark text-decoration-none d-flex align-items-center gap-2 neg mb-3"
                    >
                        <span className="material-symbols-outlined icons">
                            arrow_back
                        </span>
                        Back
                    </Link>
                    <RegisterForm routeName={"register"}/>
                </div>
            </div>
        </>
    );
}

StudentRegister.layout = (page) => <MainLayout>{page}</MainLayout>;
