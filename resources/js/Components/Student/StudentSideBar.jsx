import { Link, usePage } from "@inertiajs/react";

export default function StudentSideBar(){
    const { url, component } = usePage();
    return (
        <div className="col-auto col-md-4 col-xl-2 py-4 px-0 side-bar d-flex flex-column justify-content-between h-100">
            <div className="d-flex flex-column justify-space-between pt-2">
                <h2 className="text-center py-5">
                    <img src="/assets/logo-2.svg" alt="TopIT Logo" width="100" height="40" />
                </h2>
                <ul className="nav nav-pills d-flex flex-column align-items-center" id="menu">
                    <li className="nav-item w-100">
                        <Link
                            href={route('dashboard')}
                            className={`nav-link text-dark py-3 ps-4 d-flex align-items-center gap-1 ${component === 'Dashboard' ? 'focused' : 'dimmed'}`}
                            id="dashboard-link"
                        >
                            <span className="material-symbols-outlined">home</span>
                            <span className="ms-1 d-none d-sm-inline fs-6">Dashboard</span>
                        </Link>
                    </li>
                    <li className="nav-item w-100">
                        <Link
                            // href={route('profile')}
                            className={`nav-link text-dark py-3 ps-4 d-flex align-items-center gap-1 ${component === 'Profile' ? 'focused' : 'dimmed'}`}
                            id="profile-link"
                        >
                            <span className="material-symbols-outlined">person</span>
                            <span className="ms-1 d-none d-sm-inline fs-6">Profile</span>
                        </Link>
                    </li>
                    <li className="nav-item w-100">
                        <Link
                            // href={route('student-course')}
                            className={`nav-link text-dark py-3 ps-4 d-flex align-items-center gap-1 ${component === 'StudentCourse' ? 'focused' : 'dimmed'}`}
                            id="course-link"
                        >
                            <span className="material-symbols-outlined">description</span>
                            <span className="ms-1 d-none d-sm-inline fs-6">Courses</span>
                        </Link>
                    </li>
                    <li className="nav-item w-100">
                        <Link
                            // href={route('test')}
                            className={`nav-link text-dark py-3 ps-4 d-flex align-items-center gap-1 ${component === 'Test' ? 'focused' : 'dimmed'}`}
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
                    // href={route('logout')}
                    method="post"
                    as="button"
                    className="nav-link text-dark py-3 ps-4 d-flex align-items-center gap-1"
                >
                    <span className="material-symbols-outlined">logout</span>
                    Logout
                </Link>
            </div>
        </div>
    );
}