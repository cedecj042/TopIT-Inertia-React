import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import Navbar from "@/Components/Navigation/Navbar";
import ReviewQuestionForm from "@/Components/Pretest/ReviewQuestionForm";
import "../../../../css/student/students.css";
import "../../../../css/student/welcome.css";
import Sidebar from "@/Components/Pretest/Sidebar";

const TestReview = ({
    courses = { data: [], questions: [] },
    assessment = {},
}) => {

    // const currentCourseIndex = courses.data[0].course_id;
    const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
    
    const coursesData = courses.data || [];

    const questionsForCurrentCourse =
        courses.questions?.[currentCourseIndex + 1 ]?.questions || [];

    console.log("Courses data:", courses);
    console.log("Questions:", courses);
    console.log("Courses index:", currentCourseIndex);
    
    const totalCourses = coursesData.length;

    return (
        <>
            <Head title="Test Review" />
            <Navbar isLight={true} />

            <div className="testb container-fluid">
                <div className="row min-vh-100">
                    {/* Sidebar */}
                    <div className="col-md-3 position-fixed border-end h-100 mt-5">
                        <Sidebar
                            courses={courses}
                            currentCourseIndex={currentCourseIndex}
                            setCurrentCourseIndex={setCurrentCourseIndex}
                        />
                        <div className="px-4 mt-2">
                            <h5 className="pb-2">Assessment Summary</h5>
                            <div className="card">
                                <div className="card-body">
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
                                    href={`/test/finish/${assessment.assessment_id}`}
                                    className="btn btn-outline-primary w-50 p-2 mt-3"
                                >
                                    Go Back to Results
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
                                    {coursesData[currentCourseIndex]?.title ||
                                        "Course Title"}
                                </h5>
                                <small className="text-muted">
                                    Course {currentCourseIndex + 1} of{" "}
                                    {totalCourses}
                                </small>
                            </div>
                        </div>

                            <>
                                <ReviewQuestionForm
                                    course={{ questions: questionsForCurrentCourse }}
                                />

                                
                            </>
                       
                    </div>
                </div>
            </div>
        </>
    );
};

TestReview.layout = (page) => <MainLayout children={page} />;

export default TestReview;
