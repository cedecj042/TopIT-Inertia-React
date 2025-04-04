import { StudentContent } from "@/Components/LayoutContent/StudentContent";
import { Link } from "@inertiajs/react";
import "../../../../css/student/test.css";

function CourseDetail({ course }) {
    console.log(course);

    const handleClick = (moduleId) => {
        window.location.href = route("course.module", moduleId);
    };

    return (
        <>
            <div className="container p-5">
                <div className="row">
                    <div>
                        <Link
                            href={route("course.index")}
                            className="btn btn-link text-dark text-decoration-none mb-4 p-0"
                        >
                            <i className="bi bi-arrow-left"></i> Back
                        </Link>
                    </div>
                </div>
                <div className="row mb-4">
                    <h3 className="fw-semibold">{course.title}</h3>
                    <p>{course.description}</p>
                </div>
                <div className="row">
                    <h5>List of Modules</h5>
                    <div
                        className="course-list mx-auto"
                        style={{ width: "100%" }}
                    >
                        {/* Check if there are modules */}
                        {course.modules && course.modules.length > 0 ? (
                            course.modules.map((module) => (
                                <div
                                    key={module.module_id}
                                    className="card mb-3 border-1 shadow-sm rounded-4 overflow-hidden clickable"
                                    onClick={() =>
                                        handleClick(module.module_id)
                                    }
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
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div
                                className="alert alert-light p-5 no-data d-flex flex-column"
                                role="alert"
                            >
                                <img
                                    src="/assets/sad-cloud.svg"
                                    alt="sad cloud"
                                />
                                <label
                                    htmlFor=""
                                    className="text-secondary mt-3 text-center"
                                >
                                    There are no modules for this course.
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default StudentContent(CourseDetail);
