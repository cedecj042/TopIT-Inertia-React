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
                    types: {},
                },
            ];
        });
    };

    const handleQuestionTypeCheck = (courseId, questionType) => {
        setSelectedCourses((prevState) => {
            const courseIndex = prevState.findIndex(course => course.course_id === courseId);
            if (courseIndex > -1) {
                const course = prevState[courseIndex];
                const newTypes = { ...course.types };

                if (newTypes[questionType]) {
                    delete newTypes[questionType];
                } else {
                    newTypes[questionType] = {
                        difficulties: difficulties.reduce((acc, difficulty) => {
                            acc[difficulty.name] = 0;
                            return acc;
                        }, {}),
                    };
                }

                return [
                    ...prevState.slice(0, courseIndex),
                    { ...course, types: newTypes },
                    ...prevState.slice(courseIndex + 1),
                ];
            }
            return prevState;
        });
    };

    const handleDifficultyInput = (courseId, questionType, difficulty, value) => {
        setSelectedCourses((prevState) => {
            const courseIndex = prevState.findIndex(course => course.course_id === courseId);
            if (courseIndex > -1) {
                const course = prevState[courseIndex];
                const newTypes = { ...course.types };
                const newDifficulties = { ...newTypes[questionType].difficulties };

                newDifficulties[difficulty] = parseInt(value, 10) || 0;

                return [
                    ...prevState.slice(0, courseIndex),
                    {
                        ...course,
                        types: {
                            ...newTypes,
                            [questionType]: {
                                ...newTypes[questionType],
                                difficulties: newDifficulties,
                            },
                        },
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
            questions: Object.entries(course.types).map(([typeKey, typeData]) => ({
                type: typeKey,
                difficulty: {
                    numOfVeryEasy: typeData.difficulties["Very Easy"] || 0,
                    numOfEasy: typeData.difficulties["Easy"] || 0,
                    numOfAverage: typeData.difficulties["Average"] || 0,
                    numOfHard: typeData.difficulties["Hard"] || 0,
                    numOfVeryHard: typeData.difficulties["Very Hard"] || 0,
                },
            })),
        }));

        console.log("Prepared FormData:", formData);

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
                                                    <th>Question Type</th>
                                                    {difficulties.map((difficulty) => (
                                                        <th key={difficulty.difficulty_id}>{difficulty.name}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.question_detail_types.map((type) => (
                                                    <tr key={type}>
                                                        <td className="align-content-center px-3" style={{ width: "20rem" }}>
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input custom-check me-2"
                                                                id={`type_${type}_course_${course.course_id}`}
                                                                onChange={() =>
                                                                    handleQuestionTypeCheck(course.course_id, type)
                                                                }
                                                                checked={
                                                                    selectedCourses.some(selected => 
                                                                        selected.course_id === course.course_id && 
                                                                        selected.types[type]
                                                                    )
                                                                }
                                                            />
                                                            <label
                                                                htmlFor={`type_${type}_course_${course.course_id}`}
                                                            >
                                                                {type}
                                                            </label>
                                                        </td>
                                                        {difficulties.map((difficulty) => (
                                                            <td key={difficulty.difficulty_id}>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    min="0"
                                                                    step="1"
                                                                    defaultValue="0"
                                                                    disabled={
                                                                        !selectedCourses.some(selected => 
                                                                            selected.course_id === course.course_id && 
                                                                            selected.types[type]
                                                                        )
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleDifficultyInput(
                                                                            course.course_id,
                                                                            type,
                                                                            difficulty.name,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
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
