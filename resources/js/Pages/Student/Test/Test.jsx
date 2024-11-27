import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import Identification from "../../../Components/QuestionTypes/Identification";
import MultipleChoiceSingle from "../../../Components/QuestionTypes/MultipleChoiceSingle";
import MultipleChoiceMany from "../../../Components/QuestionTypes/MultipleChoiceMany";
import { StudentContent } from "@/Components/LayoutContent/StudentContent";
import "../../../../css/student/students.css";
import MainLayout from "@/Layouts/MainLayout";
import Navbar from "@/Components/Navigation/Navbar";
import "../../../../css/student/students.css";
import "../../../../css/student/welcome.css";

const Test = ({ assessment, question, thetaScores }) => {
    const [currentQuestion, setCurrentQuestion] = useState(question);
    const [currentAnswer, setCurrentAnswer] = useState(null);

    const renderQuestion = () => {
        const questionName = `answers.${currentQuestion.question_id}`;
        switch (currentQuestion.question_detail.type) {
            case "Multiple Choice - Single":
                return (
                    <MultipleChoiceSingle
                        question={currentQuestion}
                        questionName={questionName}
                        register={() => {}} // Implement later
                    />
                );
            case "Multiple Choice - Many":
                return (
                    <MultipleChoiceMany
                        question={currentQuestion}
                        answers={{}} 
                        setValue={() => {}} 
                    />
                );
            case "Identification":
                return (
                    <Identification
                        question={currentQuestion}
                        questionName={questionName}
                        register={() => {}} 
                    />
                );
            default:
                return <p>Unknown question type.</p>;
        }
    };

    if (!currentQuestion) return <p>No more questions. Test completed!</p>;

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar isLight={true} />
            <div className="pretestb container-fluid">
            <div className="flex-grow flex items-center justify-center py-12">
                <div className="w-full max-w-2xl px-4">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="p-6">
                            <h1 className="text-2xl font-bold text-center mb-6">Adaptive Test</h1>
                            <div 
                                key={currentQuestion.question_id}
                                className="mb-4"
                            >
                                <h5 className="text-lg font-semibold mb-3">
                                    Question
                                </h5>
                                <p className="text-gray-700 mb-4">
                                    {currentQuestion.question}
                                </p>
                                {renderQuestion()}
                            </div>
                            
                            <div className="text-center mt-6">
                                <button
                                    className="btn btn-primary px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    // onClick={handleSubmitAnswer}
                                    disabled={!currentAnswer}
                                >
                                    Submit Answer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

Test.layout = (page) => <MainLayout children={page} />;
export default Test;

    // const handleSubmitAnswer = () => {
    //     // Submit the current answer and fetch the next question
    //     axios
    //         .post(`/api/cat/${assessment.assessment_id}/submit`, {
    //             question_id: currentQuestion.question_id,
    //             answer: currentAnswer,
    //         })
    //         .then((response) => {
    //             const { nextQuestion } = response.data;
    //             setCurrentQuestion(nextQuestion);
    //             setCurrentAnswer(null);
    //         })
    //         .catch((error) => console.error(error));
    // };
