import AdminNavbar from "@/Components/Navigation/AdminNavBar";
import '../../css/admin/admin.css';
import { Head } from "@inertiajs/react";
import AdminListener from "./AdminListener";

export default function AdminLayout({ children, title }) {
    return (
        <>
            <Head title={title} />
            <div className="container-fluid">
                <div className="row h-100">
                    <AdminNavbar title={title} />
                    <main className="col-md-9 ms-sm-auto col-xl-10 p-0">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}