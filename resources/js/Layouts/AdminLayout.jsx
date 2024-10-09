import AdminNavbar from "@/Components/Admin/AdminNavBar";
import MainLayout from "./MainLayout";
import '../../css/admin.css';

export default function AdminLayout({children,title}) {
    return (
        <MainLayout>
            <div className="container-fluid">
                <div className="row h-100">
                    <AdminNavbar title={title}/>
                    <main className="col-md-9 ms-sm-auto col-xl-10 p-0">
                        {children}
                    </main>
                </div>
            </div>
        </MainLayout>
    );
}
