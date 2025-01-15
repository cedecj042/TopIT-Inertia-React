import { useRequest } from "@/Library/hooks";
import { useState } from "react";
import { toast } from "sonner";
import "../../../css/admin/question.css";

export default function GenerateQuestionForm({ data, closeModal }) {
    const courses = data.courses;
    const difficulties = data.difficulty;
    const { isProcessing, postRequest } = useRequest();
    const [selectedCourses, setSelectedCourses] = useState([]);

    const handleCourseCheck = (courseId) => {
        setSelectedCourses((prevState) => {
            const courseIndex = prevState.findIndex(course => course.course_id === courseId);
            if (courseIndex > -1) {
                return prevState.filter(course => course.course_id !== courseId);
            }
            return [
                ...prevState,
                {
                    course_id: courseId,
                    difficulties: difficulties.reduce((acc, difficulty) => {
                        acc[difficulty] = 0; // Initialize difficulty count to 0
                        return acc;
                    }, {}),
                },
            ];
        });
    };

    const handleDifficultyInput = (courseId, difficulty, value) => {
        setSelectedCourses((prevState) => {
            const courseIndex = prevState.findIndex(course => course.course_id === courseId);
            if (courseIndex > -1) {
                const course = prevState[courseIndex];
                const newDifficulties = { ...course.difficulties };
                newDifficulties[difficulty] = parseInt(value, 10) || 0;

                return [
                    ...prevState.slice(0, courseIndex),
                    {
                        ...course,
                        difficulties: newDifficulties,
                    },
                    ...prevState.slice(courseIndex + 1),
                ];
            }
            return prevState;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = selectedCourses.map((course) => ({
            course_id: course.course_id,
            course_title: courses.find(c => c.course_id === course.course_id)?.title || "Unknown Title",
            difficulty: {
                numOfVeryEasy: course.difficulties["Very Easy"] || 0,
                numOfEasy: course.difficulties["Easy"] || 0,
                numOfAverage: course.difficulties["Average"] || 0,
                numOfHard: course.difficulties["Hard"] || 0,
                numOfVeryHard: course.difficulties["Very Hard"] || 0,
            },
        }));

        console.log("Prepared FormData:", JSON.stringify(formData, null, 2));

        postRequest("admin.question.generate", formData, {
            onSuccess: () => {
                toast.success("Successfully submitted", { duration: 3000 });
                closeModal();
            },
            onError: (error) => {
                console.error("Request Failed:", error.response?.data || error);
                toast.error("Unexpected Error", { duration: 3000 });
            },
        });
    };

    return (
        <>
            <div className="modal-body">
                <form onSubmit={handleSubmit} className="row g-3 p-2">
                    {courses.map((course) => (
                        <div
                            className={`form-check custom-checkbox ${
                                selectedCourses.some(selected => selected.course_id === course.course_id) ? "selected-course" : ""
                            }`}
                            key={course.course_id}
                        >
                            <div className="custom-label">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`course_${course.course_id}`}
                                    onChange={() => handleCourseCheck(course.course_id)}
                                    checked={selectedCourses.some(selected => selected.course_id === course.course_id)}
                                />
                                <label className="form-check-label" htmlFor={`course_${course.course_id}`}>{course.title}</label>
                            </div>

                            {selectedCourses.some(selected => selected.course_id === course.course_id) && (
                                <div className="materials-container">
                                    <div className="card custom-card p-3 mt-2">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    {difficulties.map((difficulty) => (
                                                        <th key={difficulty}>{difficulty}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {difficulties.map((difficulty) => (
                                                        <td key={difficulty}>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                min="0"
                                                                step="1"
                                                                defaultValue="0"
                                                                disabled={
                                                                    !selectedCourses.some(selected => selected.course_id === course.course_id)
                                                                }
                                                                onChange={(e) =>
                                                                    handleDifficultyInput(
                                                                        course.course_id,
                                                                        difficulty,
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                    ))}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </form>
            </div>
            <div className="modal-footer">
                <button type="submit" className="btn btn-primary" onClick={handleSubmit} disabled={isProcessing}>
                    Generate
                </button>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                </button>
            </div>
        </>
    );
}
