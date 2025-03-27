import { useState } from "react";
import { router } from "@inertiajs/react";
import { StudentContent } from "@/Components/LayoutContent/StudentContent";
import StudentProfile from "@/Components/Profile/StudentProfile";
import Modal from "@/Components/Modal/Modal";
import StudentProfileForm from "@/Components/Forms/StudentProfileForm";
import "../../../css/profile.css";
import ProgressLineChart from "@/Components/Chart/ProgressLineChart";
import DateRangeFilter from "@/Components/Filter/Filters/DateRangeFilter";


function Profile({ student, progressData, from, to }) {
    const isEmpty = !progressData || !progressData.labels || progressData.labels.length === 0;
    const [showModal, setShowModal] = useState(false);
    const studentData = student.data;
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    function getCurrentWeekDates() {
        const now = new Date();
        const dayOfWeek = now.getDay(); 
        const startDate = new Date(now);
        startDate.setDate(
            now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
        ); // monday
    
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6); // Sunday
    
        return {
            from: startDate.toLocaleDateString('en-CA'), 
            to: endDate.toLocaleDateString('en-CA'),
        };
    }
    
    const defaultDates = getCurrentWeekDates();

    const handleDateChange = (type, value) => {
        const formatDate = (date) => {
            if (!date) return '';
            const d = new Date(date);
            // Convert to YYYY-MM-DD format (en-CA gives this format)
            return d.toLocaleDateString('en-CA'); 
        };
    
        router.get(
            route("profile"),
            {
                from: type === "from" ? formatDate(value) : formatDate(from),
                to: type === "to" ? formatDate(value) : formatDate(to),
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleDateClear = () => {
        const { from, to } = getCurrentWeekDates();
        router.get(
            route("profile"),
            { from, to },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <>
            <div className="container-fluid p-3 mt-4 px-5">
                <div className="row justify-content-center">
                    <div className="col mb-3 btn-toolbar justify-content-between">
                        <h3 className="fw-bold mb-0">Your Profile</h3>
                        <button
                            type="button"
                            className="btn btn-primary p-3 pt-2 pb-2 btn-hover-primary"
                            onClick={openModal}
                        >
                            Edit Profile
                        </button>
                    </div>
                    <StudentProfile student={studentData} />
                    <div className="row w-100 px-5 mb-3">
                        <div className="d-flex align-items-center mb-3">
                            <h5 className="fw-semibold fs-5">Progress</h5>
                        </div>
                        <div style={{ width: "300px" }}>
                                <DateRangeFilter
                                    from={from || defaultDates.from}
                                    to={to || defaultDates.to}
                                    onDateChange={handleDateChange}
                                    onDateClear={handleDateClear}
                                />
                            </div>
                        <div className="chart-container position-relative">
                            <ProgressLineChart progressData={progressData} />
                            {isEmpty && (
                                <div
                                    className="alert alert-light p-5 no-data d-flex flex-column"
                                    role="alert"
                                >
                                    <img
                                        src="/assets/sad-cloud.svg"
                                        alt="sad cloud"
                                    />
                                    <label
                                        htmlFor=""
                                        className="text-secondary mt-3 text-center"
                                    >
                                        It seems like there is no data
                                        available.
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Modal
                    show={showModal}
                    onClose={closeModal}
                    modalTitle={"Edit Profile"}
                    modalSize={"modal-lg"}
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
