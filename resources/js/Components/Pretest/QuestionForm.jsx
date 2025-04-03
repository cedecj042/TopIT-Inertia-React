import React, { useEffect } from 'react';
import Identification from "./../QuestionTypes/Identification";
import MultipleChoiceSingle from "./../QuestionTypes/MultipleChoiceSingle";
import MultipleChoiceMany from '../QuestionTypes/MultipleChoiceMany';

const QuestionForm = ({ index, item, register, setValue, watch, type }) => {
    const renderQuestion = (item) => {
        const question = item.question;
        const questionName = type === 'Pretest'
            ? `assessment_items[${item.assessment_course_id}_${item.assessment_item_id}].participant_answer`
            : 'participants_answer';
        switch (question.question_type) {
            case 'Multiple Choice - Single':
                return (
                    <MultipleChoiceSingle
                        key={item.assessment_item_id}
                        question={question}
                        questionName={questionName}
                        register={register}
                    />
                );
            case 'Multiple Choice - Many':
                return (
                    <MultipleChoiceMany
                        key={item.assessment_item_id}
                        question={question}
                        questionName={questionName}
                        setValue={setValue}
                        watch={watch}
                    />
                );
            case 'Identification':
                return (
                    <Identification
                        key={item.assessment_item_id}
                        questionName={questionName}
                        register={register}
                    />
                );

            default:
                return <div>Unknown question type</div>;
        }
    };
    return (
        <>
            <div className="card mb-4 border-1">
                <div className="card-header border-1 bg-light text-dark rounded-top-3 py-3 px-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0 fw-semibold fs-5">
                        Question {index + 1}
                        </h5>
                        <span className="badge rounded-pill bg-secondary text-white question-type-badge px-3 py-2">
                        {item.question.question_type}
                        </span>
                    </div>
                </div>
            <div className="card-body pt-3 p-2 px-4">
                <p className="card-text fs-5 mb-3 text-dark">{item.question.question}</p>
                    {renderQuestion(item, index)}
                    {type === "Pretest" && (
                        <>
                            <input
                                type="hidden"
                                {...register(`assessment_items[${item.assessment_course_id}_${item.assessment_item_id}].assessment_course_id`)}
                                value={item.assessment_course_id}
                            />
                            <input
                                type="hidden"
                                {...register(`assessment_items[${item.assessment_course_id}_${item.assessment_item_id}].assessment_item_id`)}
                                value={item.assessment_item_id}
                            />
                            <input
                                type="hidden"
                                {...register(`assessment_items[${item.assessment_course_id}_${item.assessment_item_id}].question_id`)}
                                value={item.question_id}
                            />
                        </>
                    )}
                    {type === "Test" && (
                        <>
                            <input
                                type="hidden"
                                {...register('assessment_id')}
                            />
                            <input
                                type="hidden"
                                {...register('assessment_item_id')}
                            />
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default QuestionForm;
