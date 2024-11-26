import React, { useState, useEffect, useRef } from "react";
import { Head, router } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRequest } from "@/Library/hooks";
import MainLayout from "@/Layouts/MainLayout";
import Sidebar from "@/Components/Pretest/Sidebar";
import Navbar from "@/Components/Navigation/Navbar";
import QuestionForm from "@/Components/Pretest/QuestionForm";
import Modal from "@/Components/Modal/Modal";
import "../../../../css/student/students.css";
import "../../../../css/student/welcome.css";

const Pretest = ({
    courses = { data: [], questions: [] },
    assessment = {},
}) => {
    const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
    const [confirmationModal, setConfirmationModal] = useState({
        show: false,
        title: "",
        message: "",
        onConfirm: null,
    });
    const submissionInProgress = useRef(false);

    const { register, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            answers: {},
            assessment_id: assessment?.assessment_id,
        },
    });

    const { postRequest, loading } = useRequest();
    const answers = watch("answers");

    useEffect(() => {
        if (!assessment?.assessment_id) {
            toast.error("No assessment ID found");
            return;
        }

        const initialAnswers = {};
        courses.questions?.forEach((courseQuestions) => {
            courseQuestions.questions?.forEach((question) => {
                initialAnswers[question.question_id] =
                    question.question_detail?.type === "Multiple Choice - Many"
                        ? []
                        : "";
            });
        });
        setValue("answers", initialAnswers);
    }, [courses.questions, setValue, assessment]);

    const showConfirmationModal = (title, message, onConfirm) => {
        setConfirmationModal({
            show: true,
            title,
            message,
            onConfirm,
        });
    };

    const hideConfirmationModal = () => {
        setConfirmationModal({
            show: false,
            title: "",
            message: "",
            onConfirm: null,
        });
    };

    const onSubmit = async (formData) => {
        if (submissionInProgress.current) {
            return;
        }

        const unansweredCount = Object.values(formData.answers).filter(
            (answer) =>
                !answer || (Array.isArray(answer) && answer.length === 0)
        ).length;

        const handleSubmission = () => {
            try {
                submissionInProgress.current = true;

                router.post(route("pretest.submit"), formData, {
                    onSuccess: () => {
                        router.visit(
                            route("pretest.finish", {
                                assessmentId: assessment?.assessment_id,
                            })
                        );
                        toast.success("Assessment submitted successfully!");
                    },
                    onError: (errors) => {
                        console.error("Submission errors:", errors);
                        toast.error(
                            errors.message ||
                                "An error occurred while submitting your assessment. Please try again later."
                        );
                    },
                    onFinish: () => {
                        submissionInProgress.current = false;
                        hideConfirmationModal();
                    },
                });
            } catch (error) {
                console.error("Submission error:", error);
                toast.error(
                    error.message ||
                        "An error occurred while submitting your assessment. Please try again later."
                );
                submissionInProgress.current = false;
                hideConfirmationModal();
            }
        };

        showConfirmationModal(
            "Submit Assessment",
            unansweredCount > 0
                ? `You have ${unansweredCount} unanswered question(s). Are you sure you want to submit?`
                : "Are you sure you want to submit your assessment?",
            handleSubmission
        );
    };

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

    const coursesData = courses.data || [];
    const questionsForCurrentCourse =
        courses.questions?.[currentCourseIndex]?.questions || [];
    const totalCourses = coursesData.length;

    return (
        <>
            <Head title="Pretest" />
            <Navbar isLight={true} />

            <div className="pretestb container-fluid">
                <div className="row min-vh-100">
                    {/* Sidebar */}
                    <div className="col-md-3 position-fixed border-end h-100">
                        <Sidebar
                            courses={courses}
                            currentCourseIndex={currentCourseIndex}
                            setCurrentCourseIndex={setCurrentCourseIndex}
                        />
                        <div className="p-3 mt-1">
                            <button
                                onClick={handleSubmit(onSubmit)}
                                className="btn btn-success w-100"
                            >
                                Finish Attempt
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-md-9 offset-md-3 p-4">
                        <div className="row align-items-center mb-4">
                            <div className="col-md-6">
                                <h1 className="display-9 fs-3 mb-0">
                                    Pretest Assessment
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

                        {questionsForCurrentCourse.length > 0 ? (
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <QuestionForm
                                    course={{
                                        questions: questionsForCurrentCourse,
                                    }}
                                    register={register}
                                    setValue={setValue}
                                    watch={watch}
                                    answers={answers}
                                    key={currentCourseIndex}
                                />

                                <div className="d-flex justify-content-between mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={handlePreviousCourse}
                                        disabled={
                                            currentCourseIndex === 0 || loading
                                        }
                                    >
                                        Previous
                                    </button>

                                    {currentCourseIndex < totalCourses - 1 ? (
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handleNextCourse}
                                            disabled={loading}
                                        >
                                            Next
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            className="btn btn-success"
                                        >
                                            Finish Attempt
                                        </button>
                                    )}
                                </div>
                            </form>
                        ) : (
                            <p>No questions available for this course.</p>
                        )}
                    </div>
                </div>
            </div>

            <Modal
                show={confirmationModal.show}
                modalTitle={confirmationModal.title}
                onClose={hideConfirmationModal}
            >
                <div className="modal-body">{confirmationModal.message}</div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={hideConfirmationModal}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            confirmationModal.onConfirm();
                        }}
                    >
                        Confirm
                    </button>
                </div>
            </Modal>
        </>
    );
};

Pretest.layout = (page) => <MainLayout children={page} />;

export default Pretest;
