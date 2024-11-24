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
            choices: question?.question_detail?.choices?.map(choice => ({ value: choice })) || [],
            difficulty: question?.difficulty?.name || '',
            question_detail_type: question?.question_detail?.type || '',
            test_type: question?.test_type || '',
            question_detail_id: question?.question_detail?.question_detail_id || '',
            discrimination_index: question?.discrimination_index || '',
            course: question?.course?.title || '',
        },
    });
    
    const { fields, append, remove } = useFieldArray({ control, name: "choices" });
    const type = watch("question_detail_type");
    const answer = watch("answer");
    const { isProcessing, putRequest } = useRequest();

    const canAddMoreChoices = fields.length < 4;
    
    // Handle answer format based on question type
    useEffect(() => {
        const currentAnswer = watch("answer");
        
        if (type === "Multiple Choice - Many") {
            // Ensure answer is array
            if (!Array.isArray(currentAnswer)) {
                setValue("answer", currentAnswer ? [currentAnswer] : []);
            }
        } else {
            // Ensure answer is string for single choice and identification
            if (Array.isArray(currentAnswer)) {
                setValue("answer", currentAnswer.join(", "));
            }
        }
    }, [type, setValue, watch]);

    // Check if a choice is a correct answer
    const isCorrectAnswer = (choice) => {
        const currentAnswer = watch("answer");
        if (type === "Multiple Choice - Many") {
            return Array.isArray(currentAnswer) && currentAnswer.includes(choice);
        }
        return currentAnswer === choice;
    };

    // Handle answer selection
    const handleAnswerChange = (choice, checked) => {
        const currentAnswer = watch("answer");
        
        if (type === "Multiple Choice - Many") {
            let newAnswer = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
            
            if (checked) {
                newAnswer.push(choice);
            } else {
                newAnswer = newAnswer.filter(ans => ans !== choice);
            }
            
            setValue("answer", newAnswer);
        } else {
            setValue("answer", checked ? choice : "");
        }
    };

    const onSubmit = (data) => {
        const finalChoices = data.choices.map(choice => choice.value).filter(Boolean);
        const finalData = {
            ...data,
            choices: finalChoices,
        };
        putRequest('admin.question.update', data.question_id, finalData, {
            onSuccess: () => {
                toast.success('Question updated successfully', { duration: 3000 });
                onClose();
            },
            onError: () => {
                toast.error('Error updating question', { duration: 3000 });
            }
        });
    };

    return (
        <>
            <div className="modal-body">
                <form className="d-flex flex-column p-3" onSubmit={handleSubmit(onSubmit)}>
                    {/* Question Input */}
                    <div className="mb-2">
                        <label htmlFor="question" className="form-label">Question</label>
                        <textarea
                            rows={2}
                            className="form-control"
                            id="question"
                            {...register("question", { required: "Question is required" })}
                        />
                        {errors.question && <p className="text-danger">{errors.question.message}</p>}
                    </div>
                    
                    <input type="hidden" {...register("question_detail_id")} />
                    <input type="hidden" {...register("question_id")} />

                    {/* Choices Section */}
                    {type !== "Identification" && (
                        <div className="mb-0">
                            <label className="form-label">Choices</label>
                            <ol type="a" className="p-0">
                                {fields.map((field, index) => (
                                    <li key={field.id} className="d-flex align-items-center mb-2">
                                        {type === "Multiple Choice - Many" ? (
                                            <input
                                                type="checkbox"
                                                className="form-check-input me-2"
                                                checked={isCorrectAnswer(field.value)}
                                                onChange={(e) => handleAnswerChange(field.value, e.target.checked)}
                                            />
                                        ) : (
                                            <input
                                                type="radio"
                                                className="form-check-input me-2"
                                                checked={isCorrectAnswer(field.value)}
                                                onChange={(e) => handleAnswerChange(field.value, e.target.checked)}
                                                name="single-choice"
                                            />
                                        )}
                                        <input
                                            type="text"
                                            className="form-control me-2"
                                            {...register(`choices.${index}.value`, { required: true })}
                                            placeholder={`Choice ${index + 1}`}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            onClick={() => remove(index)}
                                            disabled={fields.length <= 2}
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </li>
                                ))}
                            </ol>
                            <div className="text-end">
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

                    {/* Identification Answer Input */}
                    {type === "Identification" && (
                        <div className="mb-2">
                            <label htmlFor="answer" className="form-label">Answer</label>
                            <input
                                type="text"
                                className="form-control"
                                {...register("answer", { required: "Answer is required" })}
                            />
                            {errors.answer && <p className="text-danger">{errors.answer.message}</p>}
                        </div>
                    )}

                    {/* Additional Details */}
                    <label htmlFor="" className="mb-2  form-label">Details</label>
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
                <button
                    type="button"
                    className="btn btn-primary"
                    disabled={isProcessing}
                    onClick={handleSubmit(onSubmit)}
                >
                    Save
                </button>
            </div>
        </>
    );
}