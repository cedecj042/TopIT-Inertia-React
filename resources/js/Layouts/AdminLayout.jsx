import AdminNavbar from "@/Components/Admin/AdminNavBar";
import { Head, usePage } from "@inertiajs/react";
import MainLayout from "./MainLayout";

export default function AdminLayout({ children}) {
    return (
        <MainLayout>
            <div className="container-fluid">
                <div className="row h-100">
                    <AdminNavbar />
                    <main className="col-md-9 ms-sm-auto col-xl-10 p-0">
                        {children}
                    </main>
                </div>
            </div>
        </MainLayout>
    );
}
