import { useRequest } from "@/Library/hooks";
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";

export default function EditQuestionForm({ question, onClose, filters }) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        watch,
        setValue,
    } = useForm({
        defaultValues: {
            question_id: question?.question_id || '',
            question: question?.question || '',
            answer: question?.question_detail?.answer || [],
            choices: question?.question_detail?.choices || [],
            difficulty: question?.difficulty?.name || '',
            question_detail_type: question?.question_detail?.type || '',
            test_type: question?.test_type || '',
            question_detail_id: question?.question_detail.question_detail_id || '',
            discrimination_index: question?.discrimination_index || '',
            course: question?.course?.title || '',
        },
    });
    
    const { fields, append, remove } = useFieldArray({ control, name: "choices" });
    const type = watch("question_detail_type"); 
    const answer = watch("answer");
    const { isProcessing, putRequest } = useRequest();
    const canAddMoreChoices = fields.length < 4; // Limit to 4 choices
    useEffect(() => {
        if (type === "Multiple Choice - Many") {
            // Convert string answer to an array
            if (!Array.isArray(answer)) {
                setValue("answer", answer ? [answer] : []);
            }
        } else if (type === "Multiple Choice - Single" || type === "Identification") {
            // Convert array answer to a comma-separated string
            if (Array.isArray(answer)) {
                setValue("answer", answer.join(", "));
            }
        }
    }, [type, answer, setValue]);
    const onSubmit = (data) =>{
        // Transform choices into a simple array
        const finalChoices = data.choices.filter(Boolean); // Remove any empty values
        const finalData = {
            ...data,
            choices: finalChoices,
        };

        console.log(finalData);
        // putRequest('admin.question.update',data.question_id,data,{
        //     onSuccess:()=>{
        //         toast.success('Question updated successfully',{duration:3000});
        //         onClose();
        //     },
        //     onError:()=>{
        //         toast.error('Error updating question',{duration:3000});
        //     }
        // });
    }
    return (
        <>
            <div className="modal-body">
                <form className="d-flex flex-column p-3" onSubmit={handleSubmit(onSubmit)}>
                    {/* Question Input */}
                    <div className="mb-2">
                        <label htmlFor="question" className="form-label">Question</label>
                        <textarea
                            type="text"
                            rows={2}
                            className="form-control"
                            id="question"
                            {...register("question", { required: "Question is required" })}
                        ></textarea>
                        {errors.question && <p className="text-danger">{errors.question.message}</p>}
                    </div>
                    <input type="text" hidden={true} {...register("question_detail_id")} />
                    <input type="text" hidden={true} {...register('question_id')} />

                    {/* Conditional Rendering for Choices */}
                    {type !== "Identification" && (
                        <div className="mb-0">
                            <label htmlFor="choices" className="form-label">Choices</label>
                            <ol type="a" className="p-0">
                                {fields.map((field, index) => (
                                    <li key={index} className="d-flex align-items-center mb-2">
                                        {type === "Multiple Choice - Many" ? (
                                            <input
                                                type="checkbox"
                                                className="form-check-input me-2"
                                                {...register("answer")}
                                                value={field.value || question.question_detail.choices[index] || ''}
                                                defaultChecked={
                                                    Array.isArray(question.question_detail.answer) &&
                                                    question.question_detail.answer.includes(
                                                        field.value || question.question_detail.choices[index] || ''
                                                    )
                                                }
                                            />
                                        ) : (
                                            <input
                                                type="radio"
                                                className="form-check-input me-2"
                                                {...register("answer")}
                                                value={field.value || question.question_detail.choices[index] || ''}
                                                defaultChecked={
                                                    question.question_detail.answer ===
                                                    (field.value || question.question_detail.choices[index] || '')
                                                }
                                            />
                                        )}
                                        <input
                                            type="text"
                                            className="form-control me-2"
                                            {...register(`choices.${index}`, { required: true })}
                                            placeholder={`Choice ${index + 1}`}
                                            defaultValue={field.value || question.question_detail.choices[index] || ''}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            onClick={() => remove(index)}
                                            disabled={fields.length <= 2} // Minimum two choices
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </li>
                                ))}
                            </ol>
                            <div className="text-align-end">
                            <button
                                type="button"
                                className={`btn ${canAddMoreChoices ? 'btn-outline-primary' : 'btn-outline-secondary'}`}
                                onClick={() => append({ value: '' })}
                                disabled={!canAddMoreChoices}
                            >
                                Add Choice
                            </button>
                            </div>

                        </div>
                    )}

                    {/* Answer Input for Identification */}
                    {type === "Identification" && (
                        <div className="mb-2">
                            <label htmlFor="answer" className="form-label">Answer</label>
                            <input
                                type="text"
                                className="form-control"
                                {...register("answer", { required: "Answer is required" })}
                                defaultValue={question.question_detail.answer}
                            />
                            {errors.answer && <p className="text-danger">{errors.answer.message}</p>}
                        </div>
                    )}

                    {/* Additional Details */}
                    {/* <label htmlFor="" className="mb-2">Details</label> */}
                        {/* Type Filter */}
                    <div className="d-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                
                        <div className="mb-3">
                            <label className="form-label">Question Type</label>
                            <select className="form-select" {...register("question_detail_type")}>
                                {filters.detail_types.map((type, index) => (
                                    <option value={type} key={index}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Course</label>
                            <select className="form-select" {...register("course")}>
                                {filters.courses.map((type, index) => (
                                    <option value={type} key={index}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="d-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                        {/* Difficulty Filter */}
                        <div className="mb-2">
                            <label className="form-label">Difficulty</label>
                            <select className="form-select" {...register("difficulty")}>
                                {filters.difficulty.map((item, index) => (
                                    <option value={item} key={index}>{item}</option>
                                ))}
                            </select>
                        </div>
                        {/* Discrimination Index */}
                        <div className="mb-2">
                            <label className="form-label">Discrimination Index</label>
                            <input className="form-control" {...register("discrimination_index")} />
                        </div>

                        {/* Discrimination Index */}
                        <div className="mb-2">
                            <label className="form-label">Test Type</label>
                            <select className="form-select" {...register("test_type")}>
                                {filters.test_types.map((item, index) => (
                                    <option value={item} key={index}>{item}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </form>
            </div>

            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Close
                </button>
                <button type="button" className="btn btn-primary" disabled={isProcessing} onClick={handleSubmit(onSubmit)}>
                    Save
                </button>
            </div>
        </>
    );
}
