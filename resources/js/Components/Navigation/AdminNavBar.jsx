import { Link, router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import "../../../css/admin/navigation.css";
import Modal from "../Modal/Modal";
import AdminProfile from "../Profile/AdminProfile";
import AdminProfileForm from "../Forms/AdminProfileForm";

export default function AdminNavbar({ title }) {
    const { auth } = usePage().props;

    const profileImageUrl = auth.user && auth.user.profile_image
        ? `/storage/profile_images/${auth.user.profile_image}`
        : "/assets/profile-circle.png";

    const [isReviewersOpen, setIsReviewersOpen] = useState(() => {
        const savedReviewersOpen = localStorage.getItem('reviewersSubmenu');
        return savedReviewersOpen ? JSON.parse(savedReviewersOpen) : false;
    });
    const [isQuestionBankOpen, setIsQuestionBankOpen] = useState(() => {
        const savedQuestionBankOpen = localStorage.getItem('questionBankSubmenu');
        return savedQuestionBankOpen ? JSON.parse(savedQuestionBankOpen) : false;
    });

    const handleToggleReviewers = () => {
        const newState = !isReviewersOpen;
        setIsReviewersOpen(newState);
        localStorage.setItem('reviewersSubmenu', JSON.stringify(newState));
    };

    const handleToggleQuestionBank = () => {
        const newState = !isQuestionBankOpen;
        setIsQuestionBankOpen(newState);
        localStorage.setItem('questionBankSubmenu', JSON.stringify(newState));
    };

    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const openProfileModal = () => {
        if (!showProfileModal) {
            setShowEditModal(false); // Ensure edit modal is closed
            setShowProfileModal(true); // Open profile modal
        }
    };
    const closeProfileModal = () => setShowProfileModal(false);

    const openEditModal = () => {
        closeProfileModal(); // Close the profile modal before showing the edit modal
        setShowEditModal(true);
    };
    const closeEditModal = () => setShowEditModal(false);

    return (
        <>
        <div className="col-auto col-sm-4 col-md-3 col-xl-2 py-3 px-0 side-bar d-flex flex-column justify-content-between h-100 navbar-bg">
            <div className="d-flex flex-column justify-space-between pt-2">
                <div className="text-center py-4">
                    <img src="/assets/logo.svg" alt="TopIT Logo" width="100" height="40" />
                </div>
                <ul className="nav nav-pills d-flex flex-column align-items-center" id="menu">
                    <li className="nav-item w-100">
                        <Link
                            href={route('admin.dashboard')}
                            className={`nav-link text-white py-3 ps-4 d-flex align-items-center gap-1 ${title === 'Admin Dashboard' ? 'active' : ''}`}
                        >
                            <span className="material-symbols-outlined">home</span>
                            <span className="ms-1 d-none d-sm-inline fs-6">Dashboard</span>
                        </Link>
                    </li>
                    <li className="nav-item w-100">
                        <Link
                            href="#coursesSubmenu"
                            onClick={(e) => {
                                e.preventDefault();
                                handleToggleReviewers();
                            }}
                            className={`nav-link text-white py-3 ps-4 d-flex align-items-center gap-1 dropdown-toggle ${isReviewersOpen ? '' : 'collapsed'}`}
                        >
                            <span className="material-symbols-outlined">description</span>
                            <span className="ms-1 d-none d-sm-inline fs-6">Reviewers</span>
                        </Link>
                        <ul
                            className={`collapse nav flex-column ms-0 ${isReviewersOpen ? 'show' : ''}`}
                            id="coursesSubmenu"
                        >
                            <li className="w-100">
                                <Link href={route('admin.course.index')} 
                                className={` nav-link text-white py-3 ps-5 d-flex align-items-center gap-1 ${title === 'Admin Course' ? 'active' : ''}`}>
                                    <span className="material-symbols-outlined">book</span>
                                    <span className="ms-1 d-none d-sm-inline fs-6">Courses</span>
                                </Link>
                            </li>
                            <li className="w-100">
                                <Link href={route('admin.module.index')} 
                                    className={`nav-link text-white py-3 ps-5 d-flex align-items-center gap-1 ${title === 'Admin Module' ? 'active' : ''} `}>
                                    <span className="material-symbols-outlined">view_module</span>
                                    <span className="ms-1 d-none d-sm-inline fs-6">Modules</span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className="nav-item w-100">
                        <Link
                            href="#questionBankSubmenu"
                            onClick={(e) => {
                                e.preventDefault();
                                handleToggleQuestionBank();
                            }}
                            className={`nav-link text-white py-3 ps-4 d-flex align-items-center gap-1 dropdown-toggle ${isQuestionBankOpen ? '' : 'collapsed'}`}
                        >
                            <span className="material-symbols-outlined">quiz</span>
                            <span className="ms-1 d-none d-sm-inline fs-6">Question Bank</span>
                        </Link>
                        <ul className={`collapse nav flex-column ms-0 ${isQuestionBankOpen ? 'show' : ''}`} id="questionBankSubmenu">
                            <li className="w-100">
                                <Link href={route('admin.question.index')} className={`nav-link text-white py-3 ps-5 d-flex align-items-center gap-1 ${title === 'Admin Question' ? 'active' : ''}`}>
                                    <span className="material-symbols-outlined">quiz</span>
                                    <span className="ms-1 d-none d-sm-inline fs-6">Questions</span>
                                </Link>
                                
                            </li>
                            <li className="w-100">
                                <Link href={route('admin.pretest.index')} className={`nav-link text-white py-3 ps-5 d-flex align-items-center gap-1  ${title === 'Admin Pretest' ? 'active' : ''} `}>
                                    <span className="material-symbols-outlined">inventory</span>
                                    <span className="ms-1 d-none d-sm-inline fs-6">Pretest Items</span>
                                    
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className="nav-item w-100">
                        <Link
                            href={route('admin.users.index')}
                            className={`nav-link text-white py-3 ps-4 d-flex align-items-center gap-1 ${title === 'Admin Users' ? 'active' : ''} `}
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
                            href={ route('admin.report') }
                            className={`nav-link text-white py-3 ps-4 d-flex align-items-center gap-1 ${title === 'Admin Reports' ? 'active' : ''}`}
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
                <Link href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src={profileImageUrl} alt="Profile Image" className="rounded-circle" width="30" height="30" />
                    <span className="d-none d-sm-inline mx-1 fs-6">{auth.user.username}</span>
                </Link>
                <ul className="dropdown-menu dropdown-menu text-small shadow">
                    <li>
                        <button className="dropdown-item fs-6 btn" onClick={openProfileModal}>Profile</button>
                    </li>
                    <li>
                        <Link className="dropdown-item fs-6" href={route('logout')} method="post" as="button">Sign out</Link>
                        
                    </li>
                </ul>
            </div>
        </div>
        <Modal
            modalTitle={'Admin Profile'}
            modalSize={'modal-lg'}
            show={showProfileModal}
            onClose={closeProfileModal}
        >
            <AdminProfile 
                close={closeProfileModal}
                openEditModal={openEditModal}  
                auth={auth}
            />
        </Modal>
        {/* Edit Modal */}
        <Modal
            modalTitle="Edit Profile"
            modalSize="modal-lg"
            show={showEditModal}
            onClose={closeEditModal}
        >
            <AdminProfileForm onclose={openProfileModal} auth={auth}/>
        </Modal>
        
        </>
    );
}
