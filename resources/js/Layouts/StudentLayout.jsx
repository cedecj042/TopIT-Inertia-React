import StudentNavbar from "@/Components/Navigation/StudentNavbar";
import StudentSideBar from "@/Components/Navigation/StudentSideBar";
import { Head, usePage } from "@inertiajs/react";
import MainLayout from "./MainLayout";
import '../../css/student/students.css';
import { InertiaApp } from '@inertiajs/inertia-react';


export default function StudentLayout({ children, title }) {
    return (
        <MainLayout>
            <div className="container-fluid">
                <div className="row h-100">
                    <Head title="Student Login" />

                    <StudentSideBar title={title} />
                    <main className="col-md-9 ms-sm-auto col-lg-10 p-0">
                        <StudentNavbar />
                        {children}
                    </main>
                </div>
            </div>
        </MainLayout>
    );
}
