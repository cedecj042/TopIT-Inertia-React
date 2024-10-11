import { Head } from "@inertiajs/react";
import { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import HeaderLogin from "@/Components/Student/Auth/HeaderLogin";
import FormLogin from "@/Components/Student/Auth/FormLogin";
import '../../../css/student/students.css';


export default function StudentLogin() {
    return (
        <MainLayout>
            <Head title="Student Login"/>
            <HeaderLogin></HeaderLogin>
            <FormLogin></FormLogin>
        </MainLayout>
    );
}
