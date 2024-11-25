import React from "react";
import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons";

const ReviewQuestionForm = ({ course }) => {
    const renderAnswer = (question) => {
        const questionDetail = question.question_detail || {};
        let studentAnswer = question.student_answer;

        let correctAnswer = questionDetail.answer;
        let choices = questionDetail.choices;

        // console.log("question data", question);
        // console.log("Student Answer (raw):", studentAnswer);
        // console.log("Correct Answer (raw):", correctAnswer);

        const getAnswerStyle = (isCorrect) => ({
            backgroundColor: isCorrect ? "#e7f6e7" : "#ffe7e7",
            padding: "0.5rem",
            borderRadius: "0.25rem",
            marginTop: "0.5rem",
        });

        // Multiple Choice - Single
        if (questionDetail.type === "Multiple Choice - Single") {
            const singleAnswer = studentAnswer || "No answer provided";
            return (
                <div>
                    {choices.map((choice, index) => (
                        <div key={index} className="form-check mb-2">
                            <input
                                className="form-check-input"
                                type="radio"
                                checked={singleAnswer === choice}
                                disabled
                            />
                            <label
                                className={`form-check-label ${
                                    choice === correctAnswer
                                        ? "text-success fw-bold"
                                        : ""
                                }`}
                            >
                                {choice}
                                {choice === correctAnswer ? (
                                    <CheckCircleFill className="ms-2 text-success" />
                                ) : singleAnswer === choice ? (
                                    <XCircleFill className="ms-2 text-danger" />
                                ) : null}
                            </label>
                        </div>
                    ))}
                    <div style={getAnswerStyle(question.is_correct)}>
                        <strong>Your Answer:</strong> {singleAnswer}
                        {!question.is_correct && (
                            <div className="text-danger mt-1">
                                <strong>Correct Answer:</strong> {correctAnswer}
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        if (questionDetail.type === "Multiple Choice - Many") {
            const studentAnswerArray = Array.isArray(studentAnswer)
                ? studentAnswer
                : [];

            return (
                <div>
                    {choices.map((choice, index) => (
                        <div key={index} className="form-check mb-2">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={studentAnswerArray.includes(choice)}
                                disabled
                            />
                            <label
                                className={`form-check-label ${
                                    Array.isArray(correctAnswer) &&
                                    correctAnswer.includes(choice)
                                        ? "text-success fw-bold"
                                        : ""
                                }`}
                            >
                                {choice}
                                {Array.isArray(correctAnswer) &&
                                correctAnswer.includes(choice) ? (
                                    <CheckCircleFill className="ms-2 text-success" />
                                ) : studentAnswerArray.includes(choice) ? (
                                    <XCircleFill className="ms-2 text-danger" />
                                ) : null}
                            </label>
                        </div>
                    ))}
                    <div style={getAnswerStyle(question.is_correct)}>
                        <strong>Your Answers:</strong>{" "}
                        {studentAnswerArray.length > 0
                            ? studentAnswerArray.join(", ")
                            : "No answer provided"}
                        {!question.is_correct &&
                            Array.isArray(correctAnswer) &&
                            correctAnswer.length > 0 && (
                                <div className="text-danger mt-1">
                                    <strong>Correct Answers:</strong>{" "}
                                    {correctAnswer.join(", ")}
                                </div>
                            )}
                    </div>
                </div>
            );
        }
        if (questionDetail.type === "Identification") {
            return (
                <div>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            value={studentAnswer || ""}
                            disabled
                        />
                    </div>
                    <div style={getAnswerStyle(question.is_correct)}>
                        <strong>Your Answer:</strong>{" "}
                        {studentAnswer || "No answer provided"}
                        {!question.is_correct && correctAnswer && (
                            <div className="text-danger mt-1">
                                <strong>Correct Answer:</strong> {correctAnswer}
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
            {course.questions?.length > 0 ? (
                course.questions.map((question, index) => {
                    return (
                        <div
                            key={question.question_id}
                            className="card mb-4 shadow-sm"
                        >
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="card-title">
                                        Question {index + 1}
                                    </h5>
                                    <span
                                        className={`badge ${
                                            question.is_correct
                                                ? "bg-success"
                                                : "bg-danger"
                                        }`}
                                    >
                                        {question.is_correct
                                            ? "Correct"
                                            : "Incorrect"}
                                    </span>
                                </div>
                                <p className="card-text">{question.question}</p>
                                {renderAnswer(question)}
                            </div>
                        </div>
                    );
                })
            ) : (
                <p>No questions found for this course.</p>
            )}
        </div>
    );
};

export default ReviewQuestionForm;
