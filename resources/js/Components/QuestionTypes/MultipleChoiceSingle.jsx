import React from 'react';

const MultipleChoiceSingle = ({ question, questionName, register }) => {
    // const choices = question.question_detail?.choices || [];
    const choices = Array.isArray(question.question_detail?.choices) 
    ? question.question_detail.choices 
    : (
        typeof question.question_detail?.choices === 'string' 
        ? JSON.parse(question.question_detail.choices) 
        : []
    );
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
