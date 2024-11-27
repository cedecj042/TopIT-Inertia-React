import React from 'react';

const MultipleChoiceMany = ({ question, answers, setValue }) => {
    const choices = question.question_detail?.choices || [];
    const currentValues = answers[question.question_id] || [];

    const handleMultipleChoiceMany = (questionId, choice, checked) => {
        const newValues = checked
            ? [...currentValues, choice]
            : currentValues.filter((value) => value !== choice);

        setValue(`answers.${questionId}`, newValues, { shouldDirty: true });
    };

    return (
        <div>
            {choices.map((choice, index) => (
                <div key={index} className="form-check mb-2">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id={`${question.question_id}-${index}`}
                        checked={currentValues.includes(choice)}
                        onChange={(e) =>
                            handleMultipleChoiceMany(question.question_id, choice, e.target.checked)
                        }
                    />
                    <label className="form-check-label" htmlFor={`${question.question_id}-${index}`}>
                        {choice}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default MultipleChoiceMany;
