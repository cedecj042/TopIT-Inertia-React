import React from "react";
import { router } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import '../../../css/modal.css';

export default function AddCourse({ show, onClose }) {
    const {
        register,
        reset,
        formState:{errors,isSubmitting},
        handleSubmit,
    } = useForm();

    const onSubmit = (data) => {
        router.post(route("admin.course.add"),data,{
            onSuccess: (page) => {
                alert('Course Added successfully!');
                reset();
                onClose();
            },
            onError: (formErrors) => {
                console.error('Form errors:', formErrors); // This will now get triggered for non-200 responses
                alert('Failed to add course. Please check the form and try again.');
            }
        });
    };

    if (!show) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1" aria-labelledby="addCourseLabel" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="addCourseLabel">Add Course</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="courseName" className="form-label fs-6">Course Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="courseName"
                                    name="course_name"
                                    {...register('course_name',{
                                        required:"Course Name is required"
                                    })}
                                />
                                {errors.courseName &&(
                                    <p className="text-danger">{`${errors.course_name.message}`}</p>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="courseDescription" className="form-label fs-6">Course Description</label>
                                <textarea
                                    className="form-control"
                                    id="courseDescription"
                                    name="course_desc"
                                    {...register('course_desc',{
                                        required:"Course Description is required"
                                    })}
                                ></textarea>
                                {errors.courseDesc &&(
                                    <p className="text-danger">{`${errors.course_desc.message}`}</p>
                                )}                                
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Close
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                Add
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
