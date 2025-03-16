import React from 'react';

const MultipleChoiceMany = ({ question_detail, questionName, setValue, watch }) => {
    const choices = question_detail.choices || [];
    const selectedAnswers = watch(questionName) || [];

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
                        id={`${question_detail.question_detail_id}-${index}`}
                        checked={selectedAnswers.includes(choice)}
                        onChange={(e) => handleChoiceChange(choice, e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor={`${question_detail.question_detail_id}-${index}`}>
                        {choice}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default MultipleChoiceMany;
