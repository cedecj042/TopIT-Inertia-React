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
            } else if (prevSelected.length < courses.data.length) {
                // Add course
                return [...prevSelected, courseId];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedCourses.length === courses.data.length) {
            setSelectedCourses([]);
        } else {
            const allCourseIds = courses.data.map(course => course.course_id);
            setSelectedCourses(allCourseIds);
        }
    };

    const handleStartTest = () => {
        if (selectedCourses.length === 0) {
            toast.error("Please select at least one course to proceed.", {
                duration: 3000,
            });
            return;
        }

        const data = { courses: selectedCourses };
        postRequest("test.start", data, {
            onSuccess: (data) => {
                console.log(data);
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
                    We'll personalize your test with your selected course.
                </h3>
                <p className="text-muted">
                    Please select at least one course you want to take up.
                </p>
            </div>

            <div className="row align-items-start mt-4 gx-4 px-5">
                <div className="col-md-6 mb-4">
                    <div className="d-flex flex-column gap-3">
                        <div className="input-group">
                            <div className="input-group-text gap-2 flex-grow-1 p-3 border-1 rounded-4 bg-light">
                                <input
                                    className="form-check-input mt-0"
                                    type="checkbox"
                                    checked={selectedCourses.length === courses.data.length}
                                    onChange={handleSelectAll}
                                    id="selectAll"
                                />
                                <label
                                    htmlFor="selectAll"
                                    className="flex-grow-1 text-start fw-semibold"
                                    role="button"
                                >
                                    Select All
                                </label>
                                <span className="text-muted ms-auto">
                                    {selectedCourses.length} of {courses.data.length} courses selected
                                </span>
                            </div>
                        </div>
                        
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
                                // disabled={
                                //     selectedCourses.length == 0 || isProcessing
                                // }
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