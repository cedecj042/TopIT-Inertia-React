import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRequest } from "@/Library/hooks";
import { Head, Link, router } from "@inertiajs/react";
import Identification from "../../../Components/QuestionTypes/Identification";
import MultipleChoiceSingle from "../../../Components/QuestionTypes/MultipleChoiceSingle";
import MultipleChoiceMany from "../../../Components/QuestionTypes/MultipleChoiceMany";
import { StudentContent } from "@/Components/LayoutContent/StudentContent";
import MainLayout from "@/Layouts/MainLayout";
import Navbar from "@/Components/Navigation/Navbar";
import "../../../../css/student/students.css";
import "../../../../css/student/welcome.css";

const Test = ({ assessment, question, thetaScores }) => {
    const { register, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            answers: {},
        },
    });

    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);

    const [currentQuestion, setCurrentQuestion] = useState(question);
    const answers = watch("answers");

    const onSubmit = (data) => {
        // get the current question's answer
        console.log("current answer: ", data);
        const currentQuestionAnswer = data.answers[currentQuestion.question_id];

        router.post(
            route("test.next-question"),
            {
                assessment_id: assessment.assessment_id,
                question_id: currentQuestion.question_id,
                answer: currentQuestionAnswer,
            },
            {
                onSuccess: (page) => {
                    setValue("answers", {});
                    setCurrentQuestion(page.props.question);
                    setCurrentQuestionNumber((prev) => prev + 1);
                },
            }
        );
    };

    const isNextDisabled = () => {
        const currentAnswer = answers[currentQuestion.question_id];
        console.log("Current question object:", currentQuestion);

        if (!currentQuestion.question_detail) {
            console.error("Question detail is missing", currentQuestion);
            return true;
        }

        switch (currentQuestion.question_detail.type) {
            case "Multiple Choice - Single":
            case "Identification":
                return !currentAnswer;
            case "Multiple Choice - Many":
                return !currentAnswer || currentAnswer.length === 0;
            default:
                return true;
        }
    };

    const renderQuestion = () => {
        if (!currentQuestion.question_detail) {
            console.error("Question detail is missing", currentQuestion);
            return <p>Error: Question detail not found</p>;
        }

        const questionName = `answers.${currentQuestion.question_id}`;
        switch (currentQuestion.question_detail.type) {
            case "Multiple Choice - Single":
                return (
                    <MultipleChoiceSingle
                        question={currentQuestion}
                        questionName={questionName}
                        register={register}
                    />
                );
            case "Multiple Choice - Many":
                return (
                    <MultipleChoiceMany
                        question={currentQuestion}
                        answers={answers}
                        setValue={setValue}
                    />
                );
            case "Identification":
                return (
                    <Identification
                        question={currentQuestion}
                        questionName={questionName}
                        register={register}
                    />
                );
            default:
                return <p>Unknown question type.</p>;
        }
    };

    if (!currentQuestion) return <p>No more questions. Test completed!</p>;

    return (
        <div>
            <Navbar isLight={true} />
            <div className="min-vh-100 d-flex align-items-center">
                <div className="container mb-6">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6">
                            <h1 className="h3 mb-2">Assessment Test</h1>
                            <p className="text-muted small mb-5">
                                {assessment.updated_at} {assessment.start_time}
                            </p>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="card shadow-sm">
                                    <div className="card-body p-4">
                                        <div className="mb-4">
                                            <h5 className="card-title mb-3">
                                                Question {currentQuestionNumber}
                                            </h5>
                                            <p className="card-text mb-4">
                                                {currentQuestion.question}
                                            </p>
                                            <div className="answer-options">
                                                {renderQuestion()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-end mt-5">
                                    <button
                                        type="submit"
                                        className="btn btn-primary px-4"
                                        disabled={isNextDisabled()}
                                    >
                                        Next
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Test.layout = (page) => <MainLayout children={page} />;
export default Test;
