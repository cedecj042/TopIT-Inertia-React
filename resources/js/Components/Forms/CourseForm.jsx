import React, { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import "../../../css/modal.css";
import { toast } from "sonner";
import { useRequest } from "@/Library/hooks";

export default function CourseForm({ onClose }) {
    const {
        register,
        reset,
        formState: { errors, isSubmitting },
        handleSubmit,
    } = useForm();

    const { isProcessing, postRequest } = useRequest();
    const onSubmit = async (data) => {
        postRequest("admin.course.add", data, {
            onSuccess: (data) => {
                if (data.props.flash.error) {
                    toast.error(data.props.flash.error, { duration: 3000 });
                } else {
                    toast.success("Successfully added new course", { duration: 3000 });
                }
                onClose();
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
                <div className="mb-3">
                    <label htmlFor="course_title" className="form-label fs-6">
                        Course Title
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="course_title"
                        placeholder="Enter course title"
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
                        htmlFor="courseDescription"
                        className="form-label fs-6"
                    >
                        Course Description
                    </label>
                    <textarea
                        className="form-control"
                        id="courseDescription"
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
                    onClick={onClose}
                >
                    Close
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || isProcessing}
                >
                    Add
                </button>
            </div>
        </form>
    );
}
