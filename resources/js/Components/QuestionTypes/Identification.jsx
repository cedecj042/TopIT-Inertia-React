import React from 'react';

const Identification = ({ questionName, register }) => {
    return (
        <div className="mb-3 choices">
            <input
                {...register(questionName)}
                type="text"
                className="form-control"
                placeholder="Type your answer here"
                key={questionName}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
            />
        </div>
    );
};

export default Identification;