import React, { useState } from "react";
import { router } from "@inertiajs/react";
import "../../../../css/student/students.css";
import { StudentContent } from "@/Components/LayoutContent/StudentContent";

function SelectCourses({ courses }) {
    const [selectedCourses, setSelectedCourses] = useState([]);

    const handleCourseSelect = (courseId) => {
        setSelectedCourses((prevSelected) => {
            // If course is already selected, remove it
            if (prevSelected.includes(courseId)) {
                return prevSelected.filter((id) => id !== courseId);
            }

            // If we're already at 3 courses, replace the first one
            if (prevSelected.length >= 3) {
                return [...prevSelected.slice(1), courseId];
            }

            // Add the new course
            return [...prevSelected, courseId];
        });
    };

    console.log("selected courses:", selectedCourses);

    const handleStartTest = () => {
        if (selectedCourses.length === 0) {
            alert("Please select at least one course to proceed.");
            return;
        }
        router.post("/test/start", { courses: selectedCourses });
    };

    return (
        <main className="row p-3 px-5">
            <div className="row mt-4 px-5">
                <div className="d-flex">
                    <button
                        onClick={() => window.history.back()}
                        className="btn btn-link text-dark text-decoration-none mb-2 p-0"
                    >
                        <i className="bi bi-arrow-left"></i> Back
                    </button>
                </div>
                <h3 className="fw-bold mb-2 mt-3">
                    We'll personalize your test with your selected topics.
                </h3>
                <p className="text-muted">
                    Please select up to 3 courses you want to take.
                </p>
                
            </div>

            <div className="row align-items-start mt-4 gx-4 px-5">
                {/* left side */}
                <div className="col-md-7 mb-4">
                    <div className="row">
                        {courses.map((course) => (
                            <div key={course.course_id} className="col-12 mb-3">
                                <div
                                    className={`border rounded-4 p-3 ${
                                        selectedCourses.includes(
                                            course.course_id
                                        )
                                            ? "bg-primary text-white"
                                            : "bg-light"
                                    }`}
                                    onClick={() =>
                                        handleCourseSelect(course.course_id)
                                    }
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={selectedCourses.includes(
                                                course.course_id
                                            )}
                                            onChange={() =>
                                                handleCourseSelect(
                                                    course.course_id
                                                )
                                            }
                                        />
                                        <label className="form-check-label flex-grow-1">
                                            {course.title}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* right side */}
                <div className="col-md-5 d-flex flex-column align-items-center">
                    <img
                        src="/assets/preference.svg"
                        alt="Preference"
                        className="img-fluid mb-4"
                        style={{ maxWidth: "500px", marginBottom: "auto" }}
                    />
                    <div>
                        <button
                            className="btn btn-primary p-3 pt-2 pb-2 mt-3"
                            onClick={handleStartTest}
                            disabled={selectedCourses.length === 0}
                        >
                            Start Test
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default StudentContent(SelectCourses);
