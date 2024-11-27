import React from 'react';

const Identification = ({ question, questionName, register }) => {
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
};

export default Identification;
