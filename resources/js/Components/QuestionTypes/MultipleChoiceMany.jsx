import React from 'react';

const MultipleChoiceMany = ({ question,questionName, setValue, watch }) => {
    const choices = question.choices || [];
    const selectedAnswers = Array.isArray(watch(questionName)) ? watch(questionName) : [];

    const handleChoiceChange = (choice, checked) => {
        let updatedAnswers = [...selectedAnswers];

        if (checked) {
            if (!updatedAnswers.includes(choice)) {
                updatedAnswers.push(choice);
            }
        } else {
            updatedAnswers = updatedAnswers.filter((answer) => answer !== choice);
        }
        setValue(questionName, updatedAnswers);
    };

    return (
        <div>
            {choices.map((choice, index) => (
                <div key={index} className="form-check mb-2">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id={`${question.question_id}-${index}`}
                        checked={selectedAnswers.includes(choice)}
                        onChange={(e) => handleChoiceChange(choice, e.target.checked)}
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
