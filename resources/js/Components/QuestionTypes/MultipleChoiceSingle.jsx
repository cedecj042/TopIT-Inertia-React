import React from 'react';

const MultipleChoiceSingle = ({ question_detail, questionName, register }) => {
    const choices = question_detail?.choices || [];
    return (
        <div>
            {choices.map((choice, index) => (
                <div key={index} className="form-check mb-2">
                    <input
                        {...register(questionName)}
                        className="form-check-input"
                        type="radio"
                        value={choice}
                        id={`${question_detail.question_detail_id}-${index}`}
                    />
                    <label className="form-check-label" htmlFor={`${question_detail.question_detail_id}-${index}`}>
                        {choice}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default MultipleChoiceSingle;
