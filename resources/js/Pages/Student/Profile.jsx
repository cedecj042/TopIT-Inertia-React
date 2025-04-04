import { useState } from "react";
import { router } from "@inertiajs/react";
import { StudentContent } from "@/Components/LayoutContent/StudentContent";
import StudentProfile from "@/Components/Profile/StudentProfile";
import Modal from "@/Components/Modal/Modal";
import StudentProfileForm from "@/Components/Forms/StudentProfileForm";
import "../../../css/profile.css";
import ProgressLineChart from "@/Components/Chart/ProgressLineChart";
import DateRangeFilter from "@/Components/Filter/Filters/DateRangeFilter2";

function Profile({ student, progressData, from, to }) {
    const isEmpty =
        !progressData ||
        !progressData.labels ||
        progressData.labels.length === 0;
    const [showModal, setShowModal] = useState(false);
    const [activeFilter, setActiveFilter] = useState("weekly");

    const studentData = student.data;
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    function getCurrentWeekDates() {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const startDate = new Date(now);
        startDate.setDate(
            now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
        ); // Monday
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6); //sunday

        return { from: formatDate(startDate), to: formatDate(endDate) };
    }

    function getCurrentMonthDates() {
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        return { from: formatDate(startDate), to: formatDate(endDate) };
    }

    function formatDate(date) {
        return date.toISOString().split("T")[0];
    }

    const handleFilterChange = (filterType) => {
        setActiveFilter(filterType);
        const { from, to } =
            filterType === "weekly"
                ? getCurrentWeekDates()
                : getCurrentMonthDates();
        updateDateRange(from, to);
    };

    const updateDateRange = (from, to) => {
        router.get(route("profile"),{ from: from, to: to },{ preserveState: true, preserveScroll: true });
    };

    const handlePrev = () => {
        const fromDate = new Date(from);
        const toDate = new Date(to);

        if (activeFilter === "weekly") {
            fromDate.setDate(fromDate.getDate() - 7);
            toDate.setDate(toDate.getDate() - 7);
        } else {
            fromDate.setMonth(fromDate.getMonth() - 1);
            toDate.setMonth(toDate.getMonth() - 1);
        }

        updateDateRange(formatDate(fromDate), formatDate(toDate));
    };

    const handleNext = () => {
        const fromDate = new Date(from);
        const toDate = new Date(to);

        if (activeFilter === "weekly") {
            fromDate.setDate(fromDate.getDate() + 7);
            toDate.setDate(toDate.getDate() + 7);
        } else {
            fromDate.setMonth(fromDate.getMonth() + 1);
            toDate.setMonth(toDate.getMonth() + 1);
        }

        updateDateRange(formatDate(fromDate), formatDate(toDate));
    };

    function getMonthName(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString("default", {
            month: "long",
            year: "numeric",
        });
    }

    return (
        <div className="container-fluid p-3 mt-4 px-5">
            <div className="row justify-content-center">
                <div className="col mb-3 btn-toolbar justify-content-between">
                    <h3 className="fw-bold mb-0">Your Profile</h3>
                    <button
                        type="button"
                        className="btn btn-primary"
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

                    <div className="d-flex gap-2 mb-3">
                        <button
                            className={`btn ${activeFilter === "weekly"
                                    ? "btn-primary"
                                    : "btn-outline-primary"
                                }`}
                            onClick={() => handleFilterChange("weekly")}
                        >
                            Weekly
                        </button>
                        <button
                            className={`btn ${activeFilter === "monthly"
                                    ? "btn-primary"
                                    : "btn-outline-primary"
                                }`}
                            onClick={() => handleFilterChange("monthly")}
                        >
                            Monthly
                        </button>
                        <div style={{ width: "300px" }}>
                            <DateRangeFilter
                                from={from}
                                to={to}
                                onDateChange={updateDateRange}
                            />
                        </div>
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
                                <label className="text-secondary mt-3 text-center">
                                    It seems like there is no data available.
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="d-flex align-items-center justify-content-between gap-3">
                        <button
                            className="btn btn-outline-secondary border-0"
                            onClick={handlePrev}
                        >
                            <i className="bi bi-arrow-left"> Previous</i>
                        </button>
                        <p className="m-0">
                            {getMonthName(from)} - {getMonthName(to)}
                        </p>
                        <button
                            className="btn btn-outline-secondary border-0"
                            onClick={handleNext}
                        >
                            <i className="bi bi-arrow-right"> Next</i>
                        </button>
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
    );
}

export default StudentContent(Profile);
