import { usePage } from "@inertiajs/react";
import StudentLayout from "@/Layouts/StudentLayout";
import { StudentContent } from "@/Components/LayoutContent/StudentContent";

function CourseDetail () {
    const { course } = usePage().props;

    return (
        <StudentLayout title="Student Course">
            <div className="row p-3">
                <div className="row mt-4 px-5">
                    <h3 className="fw-semibold">{course.title}</h3>
                    <p>{course.description}</p>
                </div>
            </div>

            <div className="px-md-5">
                <h5>List of Modules</h5>
                <div className="course-list mx-auto" style={{ width: "100%" }}>
                    {/* Check if there are modules */}
                    {course.modules && course.modules.length > 0 ? (
                        course.modules.map((module) => (
                            <div
                                key={module.module_id}
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
                                            <h5 className="mb-0 fw-semibold">
                                                {module.title}
                                            </h5>
                                        </div>
                                        <div className="px-3 d-flex align-items-center">
                                            <a
                                                className="btn btn-link p-3"
                                                href={route(
                                                    "student-module-detail",
                                                    module.module_id
                                                )}
                                            >
                                                <i className="h3 bi bi-play-circle-fill"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No modules available for this course.</p>
                    )}
                </div>
                <a href={route("student-course")}
                className="btn btn-outline-secondary mb-3">
                Back to Courses
            </a>
            </div>
        </StudentLayout>
    );
};

export default StudentContent(CourseDetail);
