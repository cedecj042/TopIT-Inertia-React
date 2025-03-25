import React from 'react';

const MultipleChoiceSingle = ({ question, questionName, register }) => {
    const choices = question.choices || [];
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
                    <label className="form-check-label" htmlFor={`${question.question_id}-${index}`}>
                        {choice}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default MultipleChoiceSingle;
