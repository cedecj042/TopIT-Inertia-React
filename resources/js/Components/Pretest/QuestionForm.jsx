import React from "react";

const QuestionForm = ({
    questions,
    answers,
    onAnswerChange,
    onSubmit,
    currentCourseIndex,
    totalCourses,
    isLastCourse,
}) => {
    if (!Array.isArray(questions) || questions.length === 0) {
        return <div>No questions available.</div>;
    }
    return (
        <form onSubmit={onSubmit}>
            {questions.map((question, index) => (
                <div
                    key={question.questions.question_id}
                    className="card shadow-sm mb-4"
                >
                    <div className="card-body">
                        <div className="pb-3 mb-3 border-bottom">
                            <h6 className="text-muted mb-0">
                                Question {index + 1} of {questions.length}
                            </h6>
                        </div>
                        <p className="mb-4">{question.questions.question}</p>
                        {question.questions.questionable_type ===
                            "App\\Models\\MultiChoiceSingle" &&
                            question.questions.questionable.choices.map(
                                (option, key) => (
                                    <div key={key} className="form-check mb-3">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name={`answers[${question.questions.question_id}]`}
                                            id={`question${question.questions.question_id}_option${key}`}
                                            value={option}
                                            checked={
                                                answers[
                                                    question.questions
                                                        .question_id
                                                ] === option
                                            }
                                            onChange={(e) =>
                                                onAnswerChange(
                                                    question.questions
                                                        .question_id,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor={`question${question.questions.question_id}_option${key}`}
                                        >
                                            {option}
                                        </label>
                                    </div>
                                )
                            )}
                        {question.questions.questionable_type ===
                            "App\\Models\\MultiChoiceMany" &&
                            question.questions.questionable.choices.map(
                                (option, key) => (
                                    <div key={key} className="form-check mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name={`answers[${question.questions.question_id}][]`}
                                            id={`question${question.questions.question_id}_option${key}`}
                                            value={option}
                                            checked={answers[
                                                question.questions.question_id
                                            ]?.includes(option)}
                                            onChange={(e) => {
                                                const newAnswer =
                                                    answers[
                                                        question.questions
                                                            .question_id
                                                    ] || [];
                                                if (e.target.checked) {
                                                    newAnswer.push(option);
                                                } else {
                                                    const index =
                                                        newAnswer.indexOf(
                                                            option
                                                        );
                                                    if (index > -1)
                                                        newAnswer.splice(
                                                            index,
                                                            1
                                                        );
                                                }
                                                onAnswerChange(
                                                    question.questions
                                                        .question_id,
                                                    newAnswer
                                                );
                                            }}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor={`question${question.questions.question_id}_option${key}`}
                                        >
                                            {option}
                                        </label>
                                    </div>
                                )
                            )}
                        {question.questions.questionable_type ===
                            "App\\Models\\Identification" && (
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={
                                        answers[
                                            question.questions.question_id
                                        ] || ""
                                    }
                                    onChange={(e) =>
                                        onAnswerChange(
                                            question.questions.question_id,
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your answer here"
                                />
                            </div>
                        )}
                    </div>
                </div>
            ))}
            <div className="d-flex justify-content-between mt-4">
                {currentCourseIndex > 1 && (
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => onSubmit("previous")}
                    >
                        Previous
                    </button>
                )}
                <button type="submit" className="btn btn-primary">
                    {isLastCourse ? "Finish Attempt" : "Next"}
                </button>
            </div>
        </form>
    );
};

export default QuestionForm;
