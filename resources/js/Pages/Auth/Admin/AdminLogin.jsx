import { Head } from "@inertiajs/react";
import { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import HeaderLogin from "@/Components/Student/Auth/HeaderLogin";
import FormLogin from "@/Components/Student/Auth/FormLogin";

export default function AdminLogin({}) {
    const [values, setValues] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.post("/admin/login", values);
    };

    return (
        <MainLayout>
            <Head title="Admin Login" />
            <HeaderLogin></HeaderLogin>
            <FormLogin></FormLogin>
        </MainLayout>
    );
}
