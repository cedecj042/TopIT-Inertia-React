import React from 'react';
import Identification from "./../QuestionTypes/Identification";
import MultipleChoiceSingle from "./../QuestionTypes/MultipleChoiceSingle";
import MultipleChoiceMany from "./../QuestionTypes/MultipleChoiceMany";

const QuestionForm = ({ course, register, setValue, answers }) => {
    const renderQuestion = (question) => {
        const questionDetail = question.question_detail || {};
        const questionName = `answers.${question.question_id}`;
        
        console.log("Pretest question: ", question);

        switch (questionDetail.type) {
            case 'Multiple Choice - Single':
                return (
                    <MultipleChoiceSingle
                        question={question}
                        questionName={questionName}
                        register={register}
                    />
                );

            case 'Multiple Choice - Many':
                return (
                    <MultipleChoiceMany
                        question={question}
                        answers={answers}
                        setValue={setValue}
                    />
                );

            case 'Identification':
                return (
                    <Identification
                        question={question}
                        questionName={questionName}
                        register={register}
                    />
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
