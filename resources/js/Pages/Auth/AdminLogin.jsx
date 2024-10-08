import { Head } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import Login from "@/Components/Admin/Login";

export default function AdminLogin({}) {
    return (
        <MainLayout>
            <Head title="Admin Login"/>
            <Login/>
        </MainLayout>
    );
}
