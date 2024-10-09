import React from "react";
import { usePage } from "@inertiajs/react";
import StudentLayout from "@/Layouts/StudentLayout";

const Courses = ({courses}) => {

    return (
        <StudentLayout title="Student Course">
            <div className="row p-3">
                <div className="row mt-4 px-5">
                    <h3 className="fw-bold">Courses</h3>
                </div>
            </div>
            <div className="px-md-5">
                <div className="course-list mx-auto" style={{ width: "100%" }}>
                    {courses.map((course) => (
                        <div
                            key={course.course_id}
                            className="card mb-3 border-0 shadow-sm rounded-4 overflow-hidden"
                        >
                            <div className="card-body p-0">
                                <div className="d-flex align-items-center">
                                    <div
                                        className="bg-grey"
                                        style={{
                                            width: "20px",
                                            height: "90px",
                                        }}
                                    ></div>
                                    <div className="flex-grow-1 px-3 py-2">
                                        <h5 className="mt-3 mb-0 fw-semibold">
                                            {course.title}
                                        </h5>
                                        <p>{course.description}</p>
                                    </div>
                                    <div className="px-3 d-flex align-items-center">
                                        <a
                                            className="btn btn-link p-3"
                                            href={route(
                                                "student-course-detail",
                                                course.course_id
                                            )}
                                        >
                                            <i className="h3 bi bi-play-circle-fill"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </StudentLayout>
    );
};

export default Courses;
