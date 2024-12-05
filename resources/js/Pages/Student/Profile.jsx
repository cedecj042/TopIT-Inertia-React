import { useState } from "react";
import { StudentContent } from "@/Components/LayoutContent/StudentContent";
import StudentProfile from "@/Components/Profile/StudentProfile";
import Modal from "@/Components/Modal/Modal";
import StudentProfileForm from "@/Components/Forms/StudentProfileForm";
import "../../../css/profile.css";
import ProgressLineChart from "@/Components/Chart/ProgressLineChart";

function Profile({ student, progressData }) {
    const [showModal, setShowModal] = useState(false);
    const studentData = student.data;
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    return (
        <>
            <div className="container-fluid p-3 mt-4 px-5">
                <div className="row justify-content-center">
                    <div className="col mb-3 btn-toolbar justify-content-between">
                        <h3 className="fw-bold mb-0">Your Profile</h3>
                        <button
                            type="button"
                            className="btn btn-primary p-3 pt-2 pb-2"
                            onClick={openModal}
                        >
                            Edit Profile
                        </button>
                    </div>
                    <StudentProfile student={student.data} />
                    <div className="row w-100 px-5 mb-3">
                        <div className="chart-container">
                            <ProgressLineChart progressData={progressData} />
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
                        onClose={closeModal}
                    />
                </Modal>
            </div>
        </>
    );
}

export default StudentContent(Profile);
