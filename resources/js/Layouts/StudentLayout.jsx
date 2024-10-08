import StudentSideBar from "@/Components/Student/StudentSideBar";
import MainLayout from "./MainLayout";
import StudentNavbar from "@/Components/Student/StudentNavbar";

export default function StudentLayout({children}) {
    return (
        <MainLayout>
            <div className="container-fluid">
                <div className="row h-100">
                    <StudentSideBar/>
                    <main className="col-md-9 ms-sm-auto col-xl-10 p-0">
                        <StudentNavbar />
                        {children}
                    </main>
                </div>
            </div>
        </MainLayout>
    );
}
