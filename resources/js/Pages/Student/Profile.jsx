import { useState } from "react";
import { Inertia } from '@inertiajs/inertia';
import { StudentContent } from "@/Components/LayoutContent/StudentContent";
import StudentProfile from "@/Components/Profile/StudentProfile";
import ThetaScoreBar from "@/Components/Chart/ThetaScoreBar";
import Modal from "@/Components/Modal/Modal";
import StudentProfileForm from "@/Components/Forms/StudentProfileForm";
import { toast } from "sonner";
import "../../../css/student/dashboard.css";
import { router } from '@inertiajs/react'; 

function Profile({ student, averageThetaScore }) {
    const [showModal, setShowModal] = useState(false);
    const [studentData, setStudentData] = useState(student.data);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    
    const handleProfileUpdate = (updatedProfile) => {
        router.put(route('student.profile.edit'), updatedProfile, {
            onStart: () => console.log("Starting PUT request"),
            onSuccess: (page) => {
                setStudentData(page.props.student.data);
                toast.success("Profile updated successfully!");
                closeModal();
            },
            onError: (errors) => {
                console.error("PUT request failed:", errors);
                toast.error("Failed to update profile");
            },
            preserveScroll: true,
        });
    };
    
    console.log("student", studentData);

    return (
        <>
            <div className="container-fluid p-3 mt-4 px-5">
                <div className="row justify-content-center">
                    <div className="col mb-3 btn-toolbar justify-content-between">
                        <h3 className="fw-bold mb-4">Your Profile</h3>
                        <button
                            type="button"
                            className="btn btn-primary p-3 pt-2 pb-2"
                            onClick={openModal}
                        >
                            Edit Profile
                        </button>
                    </div>

                    <div className="row w-100 px-5 mb-3">
                        <StudentProfile student={studentData} />
                    </div>
                    <div className="row w-100 px-5 mb-3">
                        <h5 className="fw-semibold">
                            Average Theta Scores per Course
                        </h5>
                        <div className="chart-container">
                            <ThetaScoreBar thetaScoreData={averageThetaScore} />
                        </div>
                    </div>
                </div>

                <Modal
                    show={showModal}
                    onClose={closeModal}
                    modalTitle={"Edit Profile"}
                >
                    <StudentProfileForm
                        student={studentData}
                        onSubmit={handleProfileUpdate}
                        onClose={closeModal}
                    />
                </Modal>
            </div>
        </>
    );
}

export default StudentContent(Profile);
