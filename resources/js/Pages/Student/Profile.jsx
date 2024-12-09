import { useState } from "react";
import { router } from "@inertiajs/react";
import { StudentContent } from "@/Components/LayoutContent/StudentContent";
import StudentProfile from "@/Components/Profile/StudentProfile";
import Modal from "@/Components/Modal/Modal";
import StudentProfileForm from "@/Components/Forms/StudentProfileForm";
import "../../../css/profile.css";
import ProgressLineChart from "@/Components/Chart/ProgressLineChart";

function Profile({ student, progressData, availableMonths, selectedMonth }) {
    const [showModal, setShowModal] = useState(false);
    const studentData = student.data;
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const handleMonthChange = (month) => {
        router.get(
            route("student.profile"),
            { month },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    // Format months to "Month Year" format
    const formatMonthYear = (monthYear) => {
        const [year, month] = monthYear.split("-");
        const date = new Date(year, month - 1);
        return date.toLocaleString("default", {
            month: "long",
            year: "numeric",
        });
    };

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
                    <StudentProfile student={studentData} />
                    <div className="row w-100 px-5 mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-semibold fs-5">Monthly Progress</h5>
                            <div>
                                <select
                                    className="form-select"
                                    value={selectedMonth}
                                    onChange={(e) =>
                                        handleMonthChange(e.target.value)
                                    }
                                    style={{ width: "200px" }} 
                                >
                                    {availableMonths.map((month) => (
                                        <option key={month} value={month}>
                                            {formatMonthYear(month)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="chart-container position-relative">
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
