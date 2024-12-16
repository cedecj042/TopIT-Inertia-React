
export default function CourseCard({ course, selectedCourses, handleCourseCheck, handleQuestionTypeCheck, handleDifficultyInput, difficulties, questionTypes }) {
    return (
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
                                        <th key={difficulty}>{difficulty}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {questionTypes.map((type) => (
                                    <tr key={type}>
                                        <td className="align-content-center px-3" style={{ width: "20rem" }}>
                                            <input
                                                type="checkbox"
                                                className="form-check-input custom-check me-2"
                                                id={`type_${type}_course_${course.course_id}`}
                                                onChange={() => handleQuestionTypeCheck(course.course_id, type)}
                                                checked={
                                                    selectedCourses.some(selected => 
                                                        selected.course_id === course.course_id && 
                                                        selected.types[type]
                                                    )
                                                }
                                            />
                                            <label htmlFor={`type_${type}_course_${course.course_id}`}>{type}</label>
                                        </td>
                                        {difficulties.map((difficulty) => (
                                            <td key={difficulty}>
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
                                                        handleDifficultyInput(course.course_id, type, difficulty, e.target.value)
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
    );
};
