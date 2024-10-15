import Navbar from "@/Components/Navigation/Navbar";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { useEffect } from "react";

export default function Error({title}){
    const { props } = usePage();
    console.log(props.errors.error)
    return(
        <MainLayout>
            <Head title={title}/>
            <div className="container-fluid px-0">
                <Navbar isLight={true} />
                <div className="row justify-content-center">
                    <div className="col text-center">
                        <img src="/assets/stop.svg" alt=""/>
                        <h3>Page not found</h3>
                        <p>{props.errors.error}</p>
                        <Link className="btn btn-primary d-inline-flex" onClick={()=>window.history.back()}>
                            <span className="material-symbols-outlined">arrow_back</span>
                            Go Back
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}