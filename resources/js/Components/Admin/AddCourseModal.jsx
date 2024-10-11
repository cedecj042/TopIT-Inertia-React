import React, { useState } from "react";
import { router } from "@inertiajs/react";
import '../../../css/modal.css';

export default function AddCourseModal({ show, onClose }) {
    const [courseName, setCourseName] = useState("");
    const [courseDesc, setCourseDesc] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route("admin.course.add"), {
            course_name: courseName,
            course_desc: courseDesc,
        });
        onClose();
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
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="courseName" className="form-label fs-6">Course Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="courseName"
                                    name="course_name"
                                    value={courseName}
                                    onChange={(e) => setCourseName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="courseDescription" className="form-label fs-6">Course Description</label>
                                <textarea
                                    className="form-control"
                                    id="courseDescription"
                                    name="course_desc"
                                    value={courseDesc}
                                    onChange={(e) => setCourseDesc(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                style={{ fontSize: "0.9rem", padding: "0.7em 1em" }}
                                onClick={onClose}
                            >
                                Close
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ fontSize: "0.9rem", padding: "0.7em 1em" }}
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
