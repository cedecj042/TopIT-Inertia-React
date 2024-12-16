import { useRequest } from "@/Library/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EditcourseForm({ onClose, course }) {
    const {
        register,
        setValue,
        formState: { isSubmitting, errors },
        handleSubmit,
    } = useForm({
        defaultValues: {
            course_id: course?.course_id,
            course_title: course?.title,
            course_desc: course?.description
        }
    });

    const { isProcessing, putRequest } = useRequest();

    const onSubmit = async (data) => {
        const { course_id, ...formData } = data;

        putRequest('admin.course.update', course_id, formData, {
            onSuccess: (data) => {
                if (data.props.flash.error) {
                    toast.error(data.props.flash.error, { duration: 3000 });
                } else {
                    toast.success("Course updated successfully", { duration: 3000 });
                    onClose();
                }
            },
            onError: (error) => {
                console.log(error);
                toast.error("Failed to update course", { duration: 3000 });
            }
        });
    }
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-body">
                    <input type="number"
                        className="d-none"
                        {...register("course_id", {
                            required: "Course Id is required",
                        })}
                    />
                    <div className="mb-3">
                        <label htmlFor="course_title" className="form-label fs-6">
                            Course Title
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="course_title"
                            placeholder="Enter course name"
                            name="course_title"
                            {...register("course_title", {
                                required: "Course Title is required",
                            })}
                        />
                        {errors.courseName && (
                            <p className="text-danger">{`${errors.course_title.message}`}</p>
                        )}
                    </div>
                    <div className="mb-3">
                        <label
                            htmlFor="course_desc"
                            className="form-label fs-6"
                        >
                            Course Description
                        </label>
                        <textarea
                            className="form-control"
                            id="course_desc"
                            placeholder="Enter course description"
                            name="course_desc"
                            {...register("course_desc", {
                                required: "Course Description is required",
                            })}
                        ></textarea>
                        {errors.courseDesc && (
                            <p className="text-danger">{`${errors.course_desc.message}`}</p>
                        )}
                    </div>
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClose || isProcessing}
                    >
                        Close
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting || isProcessing}
                    >
                        Edit
                    </button>
                </div>
            </form>

        </>
    );
}