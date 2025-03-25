import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { useRequest } from "@/Library/hooks";
import MainLayout from "@/Layouts/MainLayout";
import Sidebar from "@/Components/Pretest/Sidebar";
import Navbar from "@/Components/Navigation/Navbar";
import QuestionForm from "@/Components/Pretest/QuestionForm";
import Modal from "@/Components/Modal/Modal";
import "../../../../css/student/students.css";
import "../../../../css/student/welcome.css";
import { toast } from "sonner";

const Pretest = ({ assessment_id, assessment_courses }) => {
    const assessmentCourses = assessment_courses.data;

    const [confirmationState, setConfirmationState] = useState({
        show: false,
        unansweredCount: 0,
    });

    const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
    const [selectedAssessmentCourse, setSelectedAssessmentCourse] = useState(assessmentCourses[currentCourseIndex]);

    const { getValues, register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            assessment_id: Number(assessment_id),
            assessment_items: Object.fromEntries(
                assessmentCourses.flatMap(course =>
                    course.assessment_items.map(item => {
                        const key = `${course.assessment_course_id}_${item.assessment_item_id}`;
                        return [key, {
                            assessment_course_id: Number(course.assessment_course_id),
                            assessment_item_id: Number(item.assessment_item_id),
                            question_id: Number(item.question_id),
                            participant_answer: [],
                        }];
                    })
                )
            )
        }
    });

    useEffect(() => {
        setSelectedAssessmentCourse(assessmentCourses[currentCourseIndex]);
    }, [currentCourseIndex])

    const handleCourseChange = (index) => {
        setCurrentCourseIndex(index);
    };
    const { putRequest, getRequest, isProcessing } = useRequest();

    const onSubmit = async () => {
        const formData = getValues();
        putRequest("pretest.submit", assessment_id, formData, {
            onSuccess: () => {
                toast.success("Pretest submitted successfully.");
                setConfirmationState(false);
            }
        });
    };

    const handleNextCourse = () => {
        if (!assessmentCourses || assessmentCourses.length === 0 || !selectedAssessmentCourse) return;

        if (currentCourseIndex < assessmentCourses.length - 1) {
            setCurrentCourseIndex(currentCourseIndex + 1)
            window.scrollTo(0, 0);
        }
    };

    const handlePreviousCourse = () => {
        if (!assessmentCourses || assessmentCourses.length === 0 || !selectedAssessmentCourse) return; //Safety checks.

        if (currentCourseIndex > 0) {
            setCurrentCourseIndex(currentCourseIndex - 1)
            window.scrollTo(0, 0);
        }
    };

    const handleConfirmationModal = () => {
        const formData = getValues();
        const assessmentItems = Object.values(formData.assessment_items) || [];
        const unansweredCount = assessmentItems.filter(item => {
            const answer = item?.participant_answer;
            return !answer || (Array.isArray(answer) && answer.length === 0);
        }).length;

        setConfirmationState({
            show: true,
            unansweredCount: unansweredCount
        });
    };

    return (
        <>
            <Head title="Pretest" />
            <Navbar isLight={true} />

            <div className="pretestb container-fluid">
                <div className="row min-vh-100">
                    {/* Sidebar */}
                    <div className="col-md-3 position-fixed border-end h-100">
                        <Sidebar
                            assessment_courses={assessmentCourses}
                            selectedCourse={selectedAssessmentCourse}
                            handleCourseChange={handleCourseChange}
                        />
                        <div className="p-3 mt-1">
                            <button
                                onClick={handleConfirmationModal}
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
                                    {selectedAssessmentCourse.course.title}
                                </h5>
                                <small className="text-muted">
                                    Course {currentCourseIndex + 1} of{" "}
                                    {assessmentCourses.length}
                                </small>
                            </div>
                        </div>

                        {selectedAssessmentCourse.assessment_items.length > 0 ? (
                            <form>

                                {selectedAssessmentCourse.assessment_items.length > 0 ? (
                                    selectedAssessmentCourse.assessment_items.map((item, itemIndex) => (
                                        <QuestionForm
                                            index={itemIndex}
                                            item={item}
                                            register={register}
                                            watch={watch}
                                            setValue={setValue}
                                            key={itemIndex}
                                            type={"Pretest"}
                                        />

                                    ))
                                ) : (
                                    <p>No questions found for this course.</p>
                                )}

                                <div className="d-flex justify-content-between mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={handlePreviousCourse}
                                        disabled={
                                            currentCourseIndex === 0 || isProcessing
                                        }
                                    >
                                        Previous
                                    </button>

                                    {currentCourseIndex < assessmentCourses.length - 1 ? (
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handleNextCourse}
                                            disabled={isProcessing}
                                        >
                                            Next
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={handleConfirmationModal}
                                            disabled={isProcessing}
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
                show={confirmationState.show}
                modalTitle={"Confirm Pretest"}
                onClose={() => setConfirmationState({ show: false, unansweredCount: 0 })}
            >

                <div className="modal-body">
                    <p>Are you finished with your pretest?</p>
                    {confirmationState.unansweredCount > 0 && (
                        <p>You have <span className="text-danger fw-bold">{confirmationState.unansweredCount}</span> unanswered questions.</p>
                    )}
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setConfirmationState({ show: false, unansweredCount: 0 })}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={onSubmit}
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
