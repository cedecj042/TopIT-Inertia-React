import React, { useEffect } from 'react';
import Identification from "./../QuestionTypes/Identification";
import MultipleChoiceSingle from "./../QuestionTypes/MultipleChoiceSingle";
import MultipleChoiceMany from '../QuestionTypes/MultipleChoiceMany';

const QuestionForm = ({ index, assessment_items, register, setValue, watch}) => {
    const renderQuestion = (item) => {
        const question = item.question;
        const questionName = `assessment_items[${item.assessment_course_id}_${item.assessment_item_id}].participant_answer`;
        switch (question.question_detail.type) {
            case 'Multiple Choice - Single':
                return (
                    <MultipleChoiceSingle
                        key={item.assessment_item_id}
                        question_detail={question.question_detail}
                        questionName={questionName}
                        register={register}
                    />
                );
            case 'Multiple Choice - Many':
                return (
                    <MultipleChoiceMany
                        key={item.assessment_item_id}
                        question_detail={question.question_detail}
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
        <div>
            {assessment_items.length > 0 ? (
                assessment_items.map((item, itemIndex) => (
                    <div key={item.question_id} className="card mb-4 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Question {itemIndex + 1}</h5>
                            <p className="card-text">{item.question.question}</p>
                            {renderQuestion(item, itemIndex)}
                            <input
                                type="hidden"
                                {...register(`assessment_items[${item.assessment_course_id}_${item.assessment_item_id}].assessment_course_id`)}
                                value={item.assessment_item_id}
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
