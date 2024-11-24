import React from 'react';

const QuestionForm = ({ course, register, setValue, answers }) => {
    const handleMultipleChoiceMany = (questionId, choice, checked) => {
        const currentValues = answers[questionId] || [];
        const newValues = checked
            ? [...currentValues, choice]
            : currentValues.filter(value => value !== choice);
        
        setValue(`answers.${questionId}`, newValues, { shouldDirty: true });
    };

    const renderQuestion = (question) => {
        const questionDetail = question.question_detail || {};
        console.log('Question detail:', questionDetail);

        const questionName = `answers.${question.question_id}`;
        const choices = questionDetail.choices;

        // if (!choices) {
        //     console.warn('Choices are not defined for question:', question);
        //     return <div>No choices available for this question</div>;
        // }

        switch (questionDetail.type) {
            case 'Multiple Choice - Single':
                return (
                    <div>
                        {choices.map((choice, index) => (
                            <div key={index} className="form-check mb-2">
                                <input
                                    {...register(questionName)}
                                    className="form-check-input"
                                    type="radio"
                                    value={choice}
                                    id={`${question.question_id}-${index}`}
                                />
                                <label 
                                    className="form-check-label" 
                                    htmlFor={`${question.question_id}-${index}`}
                                >
                                    {choice}
                                </label>
                            </div>
                        ))}
                    </div>
                );

            case 'Multiple Choice - Many':
                const currentValues = answers[question.question_id] || [];
                return (
                    <div>
                        {choices.map((choice, index) => (
                            <div key={index} className="form-check mb-2">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`${question.question_id}-${index}`}
                                    checked={currentValues.includes(choice)}
                                    onChange={(e) => handleMultipleChoiceMany(
                                        question.question_id,
                                        choice,
                                        e.target.checked
                                    )}
                                />
                                <label 
                                    className="form-check-label"
                                    htmlFor={`${question.question_id}-${index}`}
                                >
                                    {choice}
                                </label>
                            </div>
                        ))}
                    </div>
                );

            case 'Identification':
                return (
                    <div className="mb-3">
                        <input
                            {...register(questionName)}
                            type="text"
                            className="form-control"
                            placeholder="Type your answer here"
                        />
                    </div>
                );

            default:
                return <div>Unknown question type</div>;
        }
    };

    return (
        <div>
            {course.questions?.length > 0 ? (
                course.questions.map((question, index) => (
                    <div key={question.question_id} className="card mb-4 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Question {index + 1}</h5>
                            <p className="card-text">{question.question}</p>
                            {renderQuestion(question)}
                        </div>
                    </div>
                ))
            ) : (
                <p>No questions found for this course.</p>
            )}
        </div>
    );
};

export default QuestionForm;