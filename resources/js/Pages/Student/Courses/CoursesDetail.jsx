import { StudentContent } from "@/Components/LayoutContent/StudentContent";
import { Link } from "@inertiajs/react";

function CourseDetail({ course }) {
    console.log(course);

    return (
        <>
            <div className="container p-5">
                <div className="row">
                    <div>
                        <Link
                            href={`/course`}
                            className="btn btn-link text-dark text-decoration-none mb-2 p-0"
                        >
                            <i className="bi bi-arrow-left"></i> Back to Courses
                        </Link>
                    </div>
                </div>
                <div className="row">
                    <h3 className="fw-semibold">{course.title}</h3>
                    <p>{course.description}</p>
                </div>
                <div className="row">
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
                                                        "course.module",
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
                </div>
            </div>
        </>
    );
};

export default StudentContent(CourseDetail);
