import { useRequest } from "@/Library/hooks";
import { useForm, useFieldArray } from "react-hook-form";

export default function AssessmentTypeForm({ difficultyCount, types, close }) {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            types: types || [],
        },
    });

    const { isProcessing, postRequest } = useRequest();

    const { fields } = useFieldArray({
        control,
        name: "types",
    });

    const submitForm = async (data) => {
        console.log(data);

        postRequest('admin.assessments.bulkUpdate', { types: data.types }, {
            onSuccess: () => {
                close();
            },
            onError: (error) => {
                console.log(error);
            }
        });
    }

    return (
        <>
            <div className="modal-body">
                <form className="container mt-2">
                    <div className="mb-3">
                        <label className="form-label">Total Difficulty Levels</label>
                        <input
                            type="number"
                            className="form-control"
                            value={difficultyCount}
                            readOnly
                            disabled
                        />
                    </div>
                    {fields.map((field, index) => (
                        <div className="card mb-4" key={field.id}>
                            <div className="card-body">
                                <h5 className="card-title">
                                    Assessment Type #{index + 1}
                                </h5>

                                {/* Hidden ID field */}
                                <input
                                    type="hidden"
                                    {...register(`types.${index}.type_id`)}
                                />

                                <div className="d-grid">
                                    <div className="mb-3">
                                        <label className="form-label">Type</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors?.types?.[index]?.type ? 'is-invalid' : ''}`}
                                            {...register(`types.${index}.type`, { required: true })}
                                            placeholder="e.g. Identification"
                                        />
                                        {errors?.types?.[index]?.type && (
                                            <div className="invalid-feedback">Type is required</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Total Questions per Course</label>
                                        <input
                                            type="number"
                                            className={`form-control ${errors?.types?.[index]?.total_questions ? 'is-invalid' : ''}`}
                                            {...register(`types.${index}.total_questions`, {
                                                required: true,
                                                min: 0,
                                                validate: (value) => {
                                                    const isEvenly = control._formValues?.types?.[index]?.evenly_distributed;
                                                    if (isEvenly && value % difficultyCount !== 0) {
                                                        return `Total questions must be divisible by ${difficultyCount} when evenly distributed.`;
                                                    }
                                                    return true;
                                                },
                                            })}
                                        />
                                        {errors?.types?.[index]?.total_questions && (
                                            <div className="invalid-feedback">
                                                {errors.types[index].total_questions.message}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="form-check mb-2">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        {...register(`types.${index}.evenly_distributed`)}
                                    />
                                    <label className="form-check-label">Evenly Distributed</label>
                                </div>
                            </div>
                        </div>
                    ))}
                </form>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={close} disabled={isProcessing || isSubmitting}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleSubmit(submitForm)} disabled={isProcessing || isSubmitting}>Save All</button>
            </div>
        </>
    );
}
