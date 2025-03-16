import StudentNavbar from "@/Components/Navigation/StudentNavbar";
import StudentSideBar from "@/Components/Navigation/StudentSideBar";
import { Head } from "@inertiajs/react";
import "../../css/student/students.css";

export default function StudentLayout({ children, title }) {
    return (
        <>
            <Head title={title} />
            <div className="container-fluid h-100">
                <div className="row h-100">
                    <StudentSideBar title={title} />
                    <main className="col-md-9 ms-sm-auto col-lg-10 p-0">
                        <StudentNavbar />
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
