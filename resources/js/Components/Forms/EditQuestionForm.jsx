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
            answer: question?.answer || [],
            choices: question?.choices?.map(choice => ({ value: choice })) || [],
            test_type: question?.test_type || '',
            difficulty: question?.difficulty_type || '',
            difficulty_value: question?.difficulty_value || '',
            question_type: question?.question_type || '',
            discrimination_index: question?.discrimination_index || '',
            course_title: question?.course?.title || '',
        },
    });
    const { fields, append, remove } = useFieldArray({ control, name: "choices" });
    const type = watch("question_type");
    const answer = watch("answer");
    const { isProcessing, putRequest } = useRequest();

    const canAddMoreChoices = fields.length < 4;

    useEffect(() => {
        const currentAnswer = watch("answer");
        if (type === "Multiple Choice - Many") {
            if (!Array.isArray(currentAnswer)) {
                setValue("answer", currentAnswer ? [currentAnswer] : []);
            }
        } else {
            if (Array.isArray(currentAnswer)) {
                setValue("answer", currentAnswer.join(", "));
            }
        }
    }, [type, setValue, watch]);

    const isCorrectAnswer = (choice) => {
        const currentAnswer = watch("answer");
        if (type === "Multiple Choice - Many") {
            return Array.isArray(currentAnswer) && currentAnswer.includes(choice);
        }
        return currentAnswer === choice;
    };

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
            onError: (error) => {
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
                            rows={4}
                            className="form-control"
                            id="question"
                            {...register("question", { required: "Question is required" })}
                        />
                        {errors.question && <p className="text-danger">{errors.question.message}</p>}
                    </div>

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
                    <div className="d-grid grid-2">
                        <div className="mb-3">
                            <label className="form-label">Question Type</label>
                            <select className="form-select" {...register("question_detail_type")}>
                                {filters.question_type.map((type, index) => (
                                    <option value={type} key={index}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Test Type</label>
                            <select className="form-select" {...register("test_type")}>
                                {filters.test_type.map((type, index) => (
                                    <option value={type} key={index}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="d-grid grid-3">
                        <div className="mb-2">
                            <label className="form-label">Difficulty</label>
                            <select className="form-select" {...register("difficulty")}>
                                {filters.difficulty.map((item, index) => (
                                    <option value={item} key={index}>{item}</option>
                                ))}
                            </select>
                        </div>
                        {/* Difficulty Value */}
                        <div className="mb-2">
                            <label className="form-label">Difficulty Value</label>
                            <input
                                className="form-control"
                                type="number"
                                step="0.1" // Allows decimal values
                                {...register("difficulty_value", {
                                    required: "Difficulty value is required",
                                    valueAsNumber: true, // Ensures it's converted to a number
                                    validate: (value) =>
                                        !isNaN(value) || "Difficulty value must be a valid number",
                                })}
                            />
                            {errors.difficulty_value && (
                                <p className="text-danger">{errors.difficulty_value.message}</p>
                            )}
                        </div>

                        {/* Discrimination Index */}
                        <div className="mb-2">
                            <label className="form-label">Discrimination Index</label>
                            <input
                                className="form-control"
                                type="number"
                                step="0.01"
                                {...register("discrimination_index", {
                                    required: "Discrimination index is required",
                                    valueAsNumber: true,
                                    validate: (value) =>
                                        !isNaN(value) || "Discrimination index must be a valid number",
                                })}
                            />
                            {errors.discrimination_index && (
                                <p className="text-danger">{errors.discrimination_index.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="mb-3 col">
                        <label className="form-label">Course</label>
                        <select className="form-select" {...register("course_title")}>
                            {filters.courses.map((type, index) => (
                                <option value={type} key={index}>{type}</option>
                            ))}
                        </select>
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