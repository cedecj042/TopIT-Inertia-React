import React, { useState, useEffect } from "react";
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
import { data } from "autoprefixer";

const Test = ({ test_item }) => {

    const testItem = test_item.data;
    const { isProcessing, postRequest } = useRequest();
    const { data, watch,reset,register, } = useForm({
        defaultValues: {
            assessment_id: testItem.assessment_id,
            assessment_item_id: testItem.assessment_item_id,
            question_id: testItem.question_id,
            participants_answer: []
        }
    });

    const onSubmit = (data) => {
        const answer = {
            assessment_id: assessment_course.assessment_id,
            assessment_item_id: assessment_item.data.assessment_item_id,
            question_id: assessment_item.data.question_id,
            answer: data.answers[currentQuestion.question_id],
        };
        postRequest('test.submit',data,{preserveScroll: true});
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
                                {assessment.updated_at}{" "}
                                <span className="ms-2">
                                    {assessment.start_time}
                                </span>
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
