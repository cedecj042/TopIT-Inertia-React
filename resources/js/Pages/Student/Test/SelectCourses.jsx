import { useState } from "react";
import "../../../../css/student/students.css";
import { StudentContent } from "@/Components/LayoutContent/StudentContent";
import { toast } from "sonner";
import { useRequest } from "@/Library/hooks";

function SelectCourses({ courses }) {
    const [selectedCourses, setSelectedCourses] = useState([]);
    const { isProcessing, postRequest } = useRequest();

    const handleCourseSelect = (courseId) => {
        setSelectedCourses((prevSelected) => {
            if (prevSelected.includes(courseId)) {
                // Deselect course if already selected
                return prevSelected.filter((id) => id !== courseId);
            } else if (prevSelected.length < 3) {
                // Add course only if less than 3 are selected
                return [...prevSelected, courseId];
            } else {
                // Provide feedback if limit is reached
                toast.error("You can only select up to 3 courses.", {
                    duration: 3000,
                });
                return prevSelected;
            }
        });
    };
    const handleStartTest = () => {
        if (selectedCourses.length === 0) {
            // alert("Please select at least one course to proceed.");
            toast.error("Please select at least one course to proceed.", {
                duration: 3000,
            });
            return;
        }

        const data = { courses: selectedCourses };
        postRequest("test.start", data, {
            onSuccess: (data) => {
                toast.success("Test Started! Goodluck", { duration: 3000 });
            },
            onError: (error) => {
                toast.error(error, { duration: 3000 });
            },
        });
    };

    return (
        <main className="row p-3 px-5">
            <div className="row mt-3 px-5">
                <div className="d-flex">
                    <button
                        onClick={() => window.history.back()}
                        className="btn btn-link text-dark text-decoration-none mb-2 p-0 "
                    >
                        <i className="bi bi-arrow-left"></i> Back
                    </button>
                </div>
                <h3 className="fw-bold mb-2 mt-3">
                    We'll personalize your test with your selected topic.
                </h3>
                <p className="text-muted">
                    Please select the course you want to take up to 3 courses.
                </p>
            </div>

            <div className="row align-items-start mt-4 gx-4 px-5">
                <div className="col-md-6 mb-4">
                    <div className="d-flex flex-column gap-3">
                        {courses.data.map((course) => (
                            <div className="input-group" key={course.course_id}>
                                <div
                                    className={`input-group-text gap-2 flex-grow-1 p-3 border rounded-4
                        ${
                            selectedCourses.includes(course.course_id)
                                ? "bg-primary text-white"
                                : "bg-light"
                        }`}
                                >
                                    <input
                                        className="form-check-input mt-0"
                                        type="checkbox"
                                        value={course.course_id}
                                        checked={selectedCourses.includes(
                                            course.course_id
                                        )}
                                        onChange={() =>
                                            handleCourseSelect(course.course_id)
                                        }
                                        id={`course${course.course_id}`}
                                    />
                                    <label
                                        htmlFor={`course${course.course_id}`}
                                        className="flex-grow-1 text-start"
                                        role="button"
                                    >
                                        {course.title}
                                    </label>
                                </div>
                            </div>
                        ))}
                        <div className="text-center mt-3">
                            <button
                                className="btn btn-primary px-4 pt-2 pb-2 btn-hover-primary"
                                onClick={handleStartTest}
                                disabled={
                                    selectedCourses.length == 0 || isProcessing
                                }
                            >
                                Start Test
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 d-flex justify-content-end">
                    <img
                        src="/assets/preference.svg"
                        alt="Preference"
                        className="img-fluid"
                        style={{ maxWidth: "100%", height: "auto" }}
                    />
                </div>
            </div>
        </main>
    );
}

export default StudentContent(SelectCourses);