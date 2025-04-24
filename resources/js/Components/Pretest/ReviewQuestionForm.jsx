import { useRequest } from "@/Library/hooks";
import React from "react";
import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons";

const ReviewQuestionForm = ({ assessment_items }) => {
    const { isProcessing, getRequest } = useRequest();
    const openModule = (module_id) => {
        getRequest('course.module', { id: module_id }, {});
    }
    const renderAnswer = (item) => {
        const question = item.question;
        const is_correct = item.score > 0;
        const correctAnswer = question.answer;

        const getAnswerStyle = (isCorrect) => ({
            backgroundColor: isCorrect ? "#e7f6e7" : "#ffe7e7",
            padding: "0.5rem",
            borderRadius: "0.25rem",
            marginTop: "0.5rem",
        });

        // Multiple Choice - Single
        if (question.question_type === "Multiple Choice - Single") {
            const singleAnswer = item.participants_answer || "No answer provided";
            return (
                <>
                    {question.choices.map((choice, index) => {
                        const isTheAnswer = singleAnswer === choice;
                        return (
                            <div key={index} className="form-check mb-2">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    checked={isTheAnswer}
                                    disabled={!isTheAnswer}
                                    readOnly
                                />
                                <label
                                    className={`form-check-label ${isTheAnswer ? is_correct ? "text-success fw-semibold" : "text-danger fw-semibold" : ""}`}
                                >
                                    {choice}
                                    {isTheAnswer && (
                                        is_correct ? (<CheckCircleFill className="ms-2 text-success" />) : (<XCircleFill className="ms-2 text-danger" />)
                                    )}
                                </label>
                            </div>
                        )
                    })}
                    <div style={getAnswerStyle(is_correct)}>
                        <strong>Your Answer:</strong> {singleAnswer}
                        {!is_correct && (
                            <div className="text-danger mt-1">
                                <strong>Correct Answer:</strong> {correctAnswer}
                            </div>
                        )}
                    </div>
                </>

            );
        }

        if (question.question_type === "Multiple Choice - Many") {
            const studentAnswerArray = Array.isArray(item.participants_answer)
                ? item.participants_answer
                : [];

            return (
                <>
                    {question.choices.map((choice, index) => (
                        <div key={index} className="form-check mb-2">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={studentAnswerArray.includes(choice)}
                                readOnly
                                disabled={!studentAnswerArray.includes(choice)}
                            />
                            <label
                                className={`form-check-label ${Array.isArray(correctAnswer) &&
                                    studentAnswerArray.includes(choice)
                                    ? correctAnswer.includes(choice) ? "text-success fw-semibold" : "text-danger fw-semibold"
                                    : null
                                    }`}
                            >
                                {choice}
                                {studentAnswerArray.includes(choice) ?
                                    correctAnswer.includes(choice) ?
                                        (<CheckCircleFill className="ms-2 text-success" />) : (<XCircleFill className="ms-2 text-danger" />)
                                    :
                                    null
                                }
                            </label>
                        </div>
                    ))}
                    <div style={getAnswerStyle(is_correct)}>
                        <strong>Your Answers:</strong>{" "}
                        {studentAnswerArray.length > 0
                            ? studentAnswerArray.join(", ")
                            : "No answer provided"}
                        {!is_correct &&
                            Array.isArray(correctAnswer) &&
                            correctAnswer.length > 0 && (
                                <div className="text-danger mt-1">
                                    <strong>Correct Answers:</strong> {correctAnswer.join(", ")}
                                </div>
                            )}
                    </div>
                </>

            );
        }

        // Identification
        if (question.question_type === "Identification") {
            return (
                <div>
                    <div className="mb-3 d-flex flex-row">
                        <input
                            type="text"
                            className={`form-control bg-light fw-semibold ${item.score > 0 ? ("text-success") : ("text-danger")}`}
                            value={item.participants_answer || ""}
                            disabled
                            readOnly
                        />
                        <div className="align-self-center">
                            {item.score > 0 ? (
                                <CheckCircleFill className="ms-2 text-success" />
                            ) : (
                                <XCircleFill className="ms-2 text-danger" />
                            )}
                        </div>
                    </div>
                    <div style={getAnswerStyle(is_correct)}>
                        <strong>Your Answer:</strong>{" "}
                        {item.participants_answer || "No answer provided"}
                        {!is_correct && correctAnswer && (
                            <div className="text-danger mt-1">
                                <strong>Correct Answer:</strong> {Array.isArray(correctAnswer) ? correctAnswer.join(", ") : correctAnswer}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return <div>Unknown question type</div>;
    };

    return (
        <div>
            {assessment_items.length > 0 ? (
                assessment_items.map((item, index) => (
                    <div key={index} className="card mb-4 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="card-title">Question {index + 1}</h5>
                                <span
                                    className={`badge pt-2 
                                        ${!!item.participants_answer ? (item.score > 0 ? "bg-success" : "bg-danger") : "bg-secondary"}
                                        `}
                                >
                                    {!!item.participants_answer ? (item.score > 0 ? "Correct" : "Incorrect") : "Not Answered"}
                                </span>
                            </div>
                            <p className="card-text">{item.question.question}</p>
                            {renderAnswer(item)}
                            {item.question.module_id && (
                                <button
                                    className="btn btn-outline-primary btn-sm mt-3"
                                    onClick={() => openModule(item.question.module_id)}
                                >
                                    View Module
                                </button>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p>No questions found for this course.</p>
            )}
        </div>
    );
};

export default ReviewQuestionForm;