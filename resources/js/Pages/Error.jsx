import Navbar from "@/Components/Navigation/Navbar";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, usePage } from "@inertiajs/react";

function Error({title}){
    return(
        <>
            <div className="error-background"></div>
            <Head title={title}/>
            <Navbar isLight={true} />
            <div className="container-fluid h-100 px-0">
                <div className="row justify-content-center h-100 align-content-center pb-5 mb-5">
                    <div className="col text-center">
                        <img src="/assets/stop.svg" alt=""/>
                        <h3>Page not found</h3>
                        <p>Oops.. Seems like this url does not work. Let's go back</p>
                        <Link className="btn btn-primary d-inline-flex" href={'/'}>
                            <span className="material-symbols-outlined">arrow_back</span>
                            Go Back
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

Error.layout = (page) => <MainLayout children={page} />;

export default Error;
