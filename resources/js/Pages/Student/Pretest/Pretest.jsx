import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import Sidebar from "@/Components/Pretest/Sidebar";
import Navbar from "@/Components/Navigation/Navbar";
import QuestionForm from "@/Components/Pretest/QuestionForm";
import "bootstrap/dist/css/bootstrap.min.css";

const Pretest = ({ courses, assessment }) => {
    const [currentCourseIndex, setCurrentCourseIndex] = useState(0); // track the current course
    const [answers, setAnswers] = useState({}); // track student answers

    useEffect(() => {
        console.log("Courses data:", courses);
        console.log("Assessment data: ", assessment);
    }, [courses, assessment]);

    const handleAnswerChange = (questionId, answer) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: answer,
        }));
    };

    //temp
    const handleSubmit = () => {
        router.post("/assessment/submit", {
            assessment_id: assessment.assessment_id,
            answers: answers,
        });
    };

    const allQuestionsAnswered = () => {
      const currentCourseQuestions = courses.questions?.[currentCourseIndex]?.questions || [];
      
      return currentCourseQuestions.every(question => answers[question.question_id]);
    };

    const coursesData = courses.data || [];
    const questionsForCurrentCourse =
        courses.questions?.[currentCourseIndex]?.questions || [];
    const totalCourses = coursesData.length;

    const handleNextCourse = () => {
        if (currentCourseIndex < totalCourses - 1) {
            setCurrentCourseIndex(currentCourseIndex + 1);
        }
    };

    const handlePreviousCourse = () => {
        if (currentCourseIndex > 0) {
            setCurrentCourseIndex(currentCourseIndex - 1);
        }
    };

    return (
        <>
            <Head title="Pretest" />
            <Navbar isLight={true} />

            <div
                className="container-fluid"
                style={{ paddingTop: "60px", background: "transparent" }}
            >
                <div className="row min-vh-100 ">
                    {/* course sidebar */}
                    <div className="col-md-3 position-fixed border-end h-100">
                        <Sidebar
                            courses={courses}
                            currentCourseIndex={currentCourseIndex}
                            setCurrentCourseIndex={setCurrentCourseIndex}
                            answeredQuestions={answers}
                        />
                        <div className="p-3 mt-1">
                            <button
                                onClick={handleSubmit}
                                className="btn btn-success w-100"
                                disabled={!allQuestionsAnswered()} 
                            >
                                Finish Attempt
                            </button>
                        </div>
                    </div>

                    {/* main */}
                    <div className="col-md-9 offset-md-3 p-4">
                        <div className="row align-items-center mb-4">
                            <div className="col-md-6">
                                <h1 className="display-9 fs-3 mb-0">
                                    Pretest Assessment
                                </h1>
                            </div>

                            {/* course info */}
                            <div className="col-md-6 text-end">
                                <h5 className="mb-0 fs-5">
                                    {coursesData[currentCourseIndex]?.title ||
                                        "Course Title"}
                                </h5>
                                <small className="text-muted">
                                    Course {currentCourseIndex + 1} of{" "}
                                    {coursesData.length}
                                </small>
                            </div>
                        </div>

                        {questionsForCurrentCourse.length > 0 ? (
                            <>
                                <QuestionForm
                                    course={{
                                        questions: questionsForCurrentCourse,
                                    }}
                                    onAnswerChange={handleAnswerChange}
                                    savedAnswers={answers}
                                />
                                {/* next previous buttons */}
                                <div className="d-flex justify-content-between mt-4">
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={handlePreviousCourse}
                                        disabled={currentCourseIndex === 0}
                                    >
                                        Previous
                                    </button>

                                    {currentCourseIndex < totalCourses - 1 ? (
                                        <button
                                            className="btn btn-primary"
                                            onClick={handleNextCourse}
                                        >
                                            Next
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-success"
                                            onClick={handleSubmit}
                                            disabled={!allQuestionsAnswered()}
                                        >
                                            Finish Attempt
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p>Loading questions...</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

Pretest.layout = (page) => <MainLayout children={page} />;

export default Pretest;
