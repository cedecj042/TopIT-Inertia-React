import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import Sidebar from "@/Components/Pretest/Sidebar";
import Navbar from "@/Components/Navigation/Navbar";
import ReviewQuestionForm from "@/Components/Pretest/ReviewQuestionForm";
import "../../../../css/student/students.css";
import "../../../../css/student/welcome.css";


const PretestReview = ({
    assessment = {},
}) => {


    // const [currentCourseIndex, setCurrentCourseIndex] = useState(0);

    const courses = data.assessment_courses;
    const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
    const [selectedAssessmentCourse, setSelectedAssessmentCourse] = useState(courses[currentCourseIndex]);

    // const questionsForCurrentCourse = courses.questions?.[currentCourseIndex]?.questions || [];
    const totalCourses = courses.length;


    const handleNextCourse = () => {
        if (currentCourseIndex < courses.data.length - 1) {
            setCurrentCourseIndex((prev) => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handlePreviousCourse = () => {
        if (currentCourseIndex > 0) {
            setCurrentCourseIndex((prev) => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    return (
        <>
            <Head title="Pretest" />
            <Navbar isLight={false} />

            <div className="pretestb container-fluid">
                <div className="row min-vh-100">
                    {/* Sidebar */}
                    <div className="col-md-3 position-fixed border-end h-100">
                        <Sidebar
                            courses={courses}
                            selectedCourse={selectedAssessmentCourse}
                            handleCourseChange={handleCourseChange}
                        />
                        <div className="px-4 mt-2">
                            <h5 className="pb-2">Assessment Summary</h5>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Assessment Summary</h5>
                                    <p className="mb-1">
                                        Score: {assessment.total_score} /{" "}
                                        {assessment.total_items}
                                    </p>
                                    <p className="mb-0">
                                        Percentage: {assessment.percentage}%
                                    </p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between mt-3">
                                <Link
                                    href={`/dashboard`}
                                    className="btn btn-primary w-50 p-2 mt-3 me-3"
                                >
                                    Proceed to Dashboard
                                </Link>
                                <Link
                                    href={`/pretest/finish/${assessment.assessment_id}`}
                                    className="btn btn-outline-primary w-50 p-2 mt-3"
                                >
                                    Go Back to Results
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-md-9 offset-md-3 p-4">
                        <div className="row align-items-center mb-4">
                            <div className="col-md-6">
                                <h1 className="display-9 fs-3 mb-0">
                                    Pretest Review
                                </h1>
                            </div>
                            <div className="col-md-6 text-end">
                                <h5 className="mb-0 fs-5">
                                    {coursesData[currentCourseIndex]?.title ||
                                        "Course Title"}
                                </h5>
                                <small className="text-muted">
                                    Course {currentCourseIndex + 1} of{" "}
                                    {totalCourses}
                                </small>
                            </div>
                        </div>

                        {/* {questionsForCurrentCourse.length > 0 ? (
                            <>
                                <ReviewQuestionForm
                                    course={{
                                        questions: questionsForCurrentCourse,
                                    }}
                                    key={currentCourseIndex}
                                />

                                <div className="d-flex justify-content-between mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={handlePreviousCourse}
                                        disabled={currentCourseIndex === 0}
                                    >
                                        Previous
                                    </button>

                                    {currentCourseIndex < totalCourses - 1 && (
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handleNextCourse}
                                        >
                                            Next
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p>No questions available for this course.</p>
                        )} */}
                    </div>
                </div>
            </div>
        </>
    );
};

PretestReview.layout = (page) => <MainLayout children={page} />;

export default PretestReview;
