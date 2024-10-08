import StudentNavbar from "@/Components/Student/StudentNavbar";
import StudentSideBar from "@/Components/Student/StudentSideBar";
import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard({children}) {
    return (
        <MainLayout>
            <Head title="Student Login" />
            <div className="container-fluid">
                <div className="row h-100">
                    <StudentSideBar />
                    <main className="col-md-9 ms-sm-auto col-lg-10 p-0">
                        <StudentNavbar />
                        {children}
                    </main>
                </div>
            </div>
        </MainLayout>
    );
}
