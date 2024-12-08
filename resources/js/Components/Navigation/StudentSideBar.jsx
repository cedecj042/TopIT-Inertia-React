import { Link } from "@inertiajs/react";
import "../../../css/student/sidebar.css";


export default function StudentSideBar({title}){
    return (
        <div className="col-auto col-md-3 col-xl-2 py-4 px-0 side-bar d-flex flex-column justify-content-between h-100">
            <div className="d-flex flex-column justify-space-between pt-2">
                <h2 className="text-center py-5">
                    <img src="/assets/logo-2.svg" alt="TopIT Logo" width="100" height="40" />
                </h2>
                <ul className="nav nav-pills d-flex flex-column align-items-center" id="menu">
                    <li className="nav-item w-100">
                        <Link
                            href={route('dashboard')}
                            className={`nav-link text-dark py-3 ps-4 d-flex align-items-center gap-1 ${
                                title === 'Student Dashboard' ? 'active' : 'dimmed'
                            }`} 
                             id="dashboard-link"
                        >
                            <span className="material-symbols-outlined">home</span>
                            <span className="ms-1 d-none d-sm-inline fs-6">Dashboard</span>
                        </Link>
                    </li>
                    <li className="nav-item w-100">
                        <Link
                            href={route('profile')}
                            className={`nav-link text-dark py-3 ps-4 d-flex align-items-center gap-1 ${
                                title === 'Student Profile' ? 'active' : 'dimmed'
                            }`}
                            id="profile-link"
                        >
                            <span className="material-symbols-outlined">person</span>
                            <span className="ms-1 d-none d-sm-inline fs-6">Profile</span>
                        </Link>
                    </li>
                    <li className="nav-item w-100">
                        <Link
                            href={route('course.index')}
                            className={`nav-link text-dark py-3 ps-4 d-flex align-items-center gap-1 ${
                                title === 'Student Course' ? 'active' : 'dimmed'
                            }`}
                            id="course-link"
                        >
                            <span className="material-symbols-outlined">description</span>
                            <span className="ms-1 d-none d-sm-inline fs-6">Courses</span>
                        </Link>
                    </li>
                    <li className="nav-item w-100">
                        <Link
                            href={route('test.index')}
                            className={`nav-link text-dark py-3 ps-4 d-flex align-items-center gap-1 ${
                                title === 'Student Test' ? 'active' : 'dimmed'}`}
                            id="test-link"
                        >
                            <span className="material-symbols-outlined">quiz</span>
                            <span className="ms-1 d-none d-sm-inline fs-6">Test</span>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="pb-3">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="nav-link text-dark py-3 ps-4 d-flex align-items-center gap-1 w-100"
                >
                    <span className="material-symbols-outlined">logout</span>
                    Logout
                </Link>
            </div>
        </div>
    );
}