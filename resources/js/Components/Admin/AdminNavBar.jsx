import { Link, usePage } from "@inertiajs/react";
import "../../../css/admin/navigation.css";

export default function AdminNavbar({title}) {
    const {auth } = usePage().props;

    const profileImageUrl = auth.user && auth.user.profile_image
            ? `/storage/profile_images/${auth.user.profile_image}`
            : "/assets/profile-circle.png";

    return (
        <div className="col-auto col-md-3 col-xl-2 py-4 px-0 side-bar d-flex flex-column justify-content-between h-100 navbar-bg">
            <div className="d-flex flex-column justify-space-between pt-2">
                <h2 className="text-center py-5">
                    <img
                        src="/assets/logo.svg"
                        alt="TopIT Logo"
                        width="100"
                        height="40"
                    />
                </h2>
                <ul
                    className="nav nav-pills d-flex flex-column align-items-center"
                    id="menu"
                >
                    <li className="nav-item w-100">
                        <Link
                            href={route('admin.dashboard')}
                            // className="nav-link text-white py-3 ps-4 d-flex align-items-center gap-1"
                            className={`nav-link text-white py-3 ps-4 d-flex align-items-center gap-1 ${
                                title === 'Admin Dashboard' ? 'active' : ''
                            }`}
                            id="dashboard-link"
                            data-page="admin.dashboard"
                        >
                            <span className="material-symbols-outlined">
                                home
                            </span>
                            <span className="ms-1 d-none d-sm-inline fs-6">
                                Dashboard
                            </span>
                        </Link>
                    </li>
                    <li className="nav-item w-100">
                        <Link
                            href="#coursesSubmenu"
                            data-bs-toggle="collapse"
                            className="nav-link text-white py-3 ps-4 d-flex align-items-center gap-1 dropdown-toggle"
                        >
                            <span className="material-symbols-outlined">
                                description
                            </span>
                            <span className="ms-1 d-none d-sm-inline fs-6">
                                Reviewers
                            </span>
                        </Link>
                        <ul
                            className="collapse nav flex-column ms-0"
                            id="coursesSubmenu"
                            data-bs-parent="#menu"
                        >
                            <li className="w-100">
                                <Link
                                    href="{{ route('admin.course.index') }}"
                                    className="nav-link text-white py-3 ps-5"
                                >
                                    Courses
                                </Link>
                            </li>
                            <li className="w-100">
                                <Link
                                    href="{{ route('admin.modules.index') }}"
                                    className="nav-link text-white py-3 ps-5"
                                >
                                    Modules
                                </Link>
                            </li>
                            <li className="w-100">
                                <Link
                                    href="{{ route('admin.sections.index') }}"
                                    className="nav-link text-white py-3 ps-5"
                                >
                                    Sections
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className="nav-item w-100">
                        <Link
                            href="#questionBankSubmenu"
                            data-bs-toggle="collapse"
                            className="nav-link text-white py-3 ps-4 d-flex align-items-center gap-1 dropdown-toggle"
                        >
                            <span className="material-symbols-outlined">quiz</span>
                            <span className="ms-1 d-none d-sm-inline fs-6">
                                Question Bank
                            </span>
                        </Link>
                        <ul
                            className="collapse nav flex-column ms-0"
                            id="questionBankSubmenu"
                            data-bs-parent="#menu"
                        >
                            <li className="w-100">
                                <Link
                                    href="{{ route('admin.questions.index') }}"
                                    className="nav-link text-white py-3 ps-5"
                                >
                                    List of Questions
                                </Link>
                            </li>
                            <li className="w-100">
                                <Link
                                    href="{{ route('admin.questions.pretest.index') }}"
                                    className="nav-link text-white py-3 ps-5"
                                >
                                    Pretest Questions
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className="nav-item w-100">
                        <Link
                            href="{{ route('admin.users.index') }}"
                            className="nav-link text-white py-3 ps-4 d-flex align-items-center gap-1"
                            id="users-link"
                            data-page="users"
                        >
                            <span className="material-symbols-outlined">
                                person
                            </span>
                            <span className="ms-1 d-none d-sm-inline fs-6">
                                Manage Users
                            </span>
                        </Link>
                    </li>
                    <li className="nav-item w-100">
                        <Link
                            href="{{ route('admin.reports') }}"
                            className="nav-link text-white py-3 ps-4 d-flex align-items-center gap-1"
                            id="reports"
                            data-page="admin-reports"
                        >
                            <span className="material-symbols-outlined">quiz</span>
                            <span className="ms-1 d-none d-sm-inline fs-6">
                                Reports
                            </span>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="dropdown pb-4 px-4">
                <Link
                    href="#"
                    className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                    id="dropdownUser1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <img
                        src={profileImageUrl}
                        alt="Profile Image"
                        className="rounded-circle"
                        width="30"
                        height="30"
                    />
                    <span className="d-none d-sm-inline mx-1 fs-6">{auth.username}</span>
                </Link>
                <ul className="dropdown-menu dropdown-menu text-small shadow">
                    <li>
                        <Link
                            className="dropdown-item fs-6"
                            href="{{ route('admin.profile') }}"
                        >
                            Profile
                        </Link>
                    </li>
                    <li>
                        <Link
                            className="dropdown-item fs-6"
                            href={route('logout')}
                            // onclick="clearMenuState();"
                        >
                            Sign out
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
