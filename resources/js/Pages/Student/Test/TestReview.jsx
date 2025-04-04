import React, { useEffect, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import Navbar from "@/Components/Navigation/Navbar";
import ReviewQuestionForm from "@/Components/Pretest/ReviewQuestionForm";
import Sidebar from "@/Components/Pretest/Sidebar";
import "../../../../css/student/students.css";


const TestReview = ({
    assessment_courses,
    assessment_id
}) => {

    const assessmentCourses = assessment_courses.data;
    const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
    const [selectedAssessmentCourse, setSelectedAssessmentCourse] = useState(assessmentCourses[currentCourseIndex]);
    useEffect(() => {
        setSelectedAssessmentCourse(assessmentCourses[currentCourseIndex]);
    }, [currentCourseIndex]);
    
    const handleCourseChange = (index) => {
        setCurrentCourseIndex(index);
        window.scrollTo(0, 0);
    };


    return (
        <>
            <Head title="Test Review" />
            <Navbar isLight={true} />
            <div
                className="container-fluid h-100"
            >
                <div className="row min-vh-100">
                    {/* Sidebar */}
                    <div className="col-md-3 position-fixed border-end h-100 mt-5">
                        <Sidebar
                            assessment_courses={assessmentCourses}
                            selectedCourse={selectedAssessmentCourse}
                            handleCourseChange={handleCourseChange}
                        />
                        <div className="px-4 mt-2">
                            <h5 className="pb-2">Assessment Summary</h5>
                            <div className="card">
                                <div className="card-body d-grid gap-2" style={{ gridTemplateColumns: "auto auto" }}>
                                    <span className="fw-semibold d-flex flex-row justify-content-between pe-3">Score <span>:</span></span>
                                    <span>{selectedAssessmentCourse.total_score} / {selectedAssessmentCourse.total_items}</span>

                                    <span className="fw-semibold d-flex flex-row justify-content-between pe-3">Percentage <span>:</span></span>
                                    <span>{selectedAssessmentCourse.percentage}%</span>

                                    <span className="fw-semibold d-flex flex-row justify-content-between pe-3">Initial Theta <span>:</span></span>
                                    <span>{selectedAssessmentCourse.initial_theta_score}</span>

                                    <span className="fw-semibold d-flex flex-row justify-content-between pe-3">Final Theta <span>:</span></span>
                                    <span>{selectedAssessmentCourse.final_theta_score}</span>
                                </div>
                            </div>
                            <div className="row g-0 gap-3 mt-3">
                                <Link
                                    href={route('dashboard')}
                                    className="btn btn-primary col btn-hover-primary"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={route('test.finish', assessment_id)}
                                    className="btn btn-outline-primary col btn-hover-outline"
                                >
                                    Summary
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-md-9 offset-md-3 p-4 mt-5">
                        <div className="row align-items-center mb-4">
                            <div className="col-md-6">
                                <h1 className="display-9 fs-3 mb-0">
                                    Test Review
                                </h1>
                            </div>
                            <div className="col-md-6 text-end">
                                <h5 className="mb-0 fs-5">
                                    {selectedAssessmentCourse.course.title ||
                                        "Course Title"}
                                </h5>
                                <small className="text-muted">
                                    Course {currentCourseIndex + 1} of{" "}
                                    {assessment_courses.length}
                                </small>
                            </div>
                        </div>
                        <ReviewQuestionForm
                            assessment_items={selectedAssessmentCourse.assessment_items}
                        />
                        <div className="d-flex justify-content-between mt-4">
                            <button
                                type="button"
                                className={`btn ${!!currentCourseIndex ? "btn-secondary" : "btn-outline-secondary"}`}
                                onClick={() => handleCourseChange(currentCourseIndex - 1)}
                                disabled={currentCourseIndex === 0}
                            >
                                Previous
                            </button>
                            {currentCourseIndex < assessmentCourses.length - 1 && (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => handleCourseChange(currentCourseIndex + 1)}
                                >
                                    Next
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

TestReview.layout = (page) => <MainLayout children={page} />;

export default TestReview;
