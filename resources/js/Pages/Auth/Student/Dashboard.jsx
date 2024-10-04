import StudentSideBar from "@/Components/Student/StudentSideBar";
import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";

export default function StudentLogin({children}) {
    return (
        <MainLayout>
            <Head title="Student Login" />
            <div className="container-fluid">
                <div className="row">
                    <StudentSideBar />
                    <main className="col-md-9 ms-sm-auto col-lg-10 p-0">
                        {children}
                    </main>
                </div>
            </div>
        </MainLayout>
    );
}
