import { useRequest } from "@/Library/hooks";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function VectorForm({ courses, closeModal }) {
    const [selectedCourses, setSelectedCourses] = useState({});
    const { isProcessing, postRequest } = useRequest();

    useEffect(() => {
        const initialSelections = {};
        courses.forEach(course => {
            initialSelections[course.course_id] = { checked: false, modules: {}, showModules: false };
            course.modules.forEach(module => {
                initialSelections[course.course_id].modules[module.module_id] = false;
            });
        });
        setSelectedCourses(initialSelections);
    }, [courses]);

    const toggleCourseModules = (courseId) => {
        setSelectedCourses(prevState => ({
            ...prevState,
            [courseId]: {
                ...prevState[courseId],
                showModules: !prevState[courseId].showModules,
            },
        }));
    };

    const handleCourseCheck = (courseId) => {
        setSelectedCourses(prevState => {
            const isChecked = !prevState[courseId].checked;
            const updatedModules = Object.keys(prevState[courseId].modules).reduce((acc, moduleId) => {
                acc[moduleId] = isChecked;
                return acc;
            }, {});
            return {
                ...prevState,
                [courseId]: {
                    ...prevState[courseId],
                    checked: isChecked,
                    modules: updatedModules,
                },
            };
        });
    };

    const handleModuleCheck = (courseId, moduleId) => {
        setSelectedCourses(prevState => {
            const updatedModules = {
                ...prevState[courseId].modules,
                [moduleId]: !prevState[courseId].modules[moduleId],
            };
            const allModulesChecked = Object.values(updatedModules).every(Boolean);
            return {
                ...prevState,
                [courseId]: {
                    ...prevState[courseId],
                    checked: allModulesChecked,
                    modules: updatedModules,
                },
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            courses: {},
        };

        Object.keys(selectedCourses).forEach(courseId => {
            const selectedModules = Object.keys(selectedCourses[courseId].modules).filter(
                moduleId => selectedCourses[courseId].modules[moduleId]
            );
            if (selectedModules.length > 0) {
                formData.courses[courseId] = selectedModules;
            }
        });

        postRequest("admin.module.vectorize", formData, {
            onSuccess: () => {
                closeModal();
            },
            onError: (error) => {
                toast.error('Failed to send the request', { duration: 3000 });
            }
        });
    };

    // Style for checked items
    const checkedStyle = { backgroundColor: "#f3f7ff" };

    return (
        <>
            <div className="modal-body">
                <form onSubmit={handleSubmit} className="row g-3 p-2">
                    {courses.map(course => (
                        <div
                            key={course.course_id}
                            className="form-check p-3 border rounded"
                            style={selectedCourses[course.course_id]?.checked ? checkedStyle : {}}
                        >
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <input
                                        type="checkbox"
                                        className="form-check-input course-checkbox mx-2 clickable"
                                        style={{ transform: "scale(1.1)" }}
                                        id={`course_${course.course_id}`}
                                        checked={selectedCourses[course.course_id]?.checked || false}
                                        onChange={() => handleCourseCheck(course.course_id)}
                                        disabled={course.modules.every(module => module.vectorized) || course.modules.length === 0}
                                    />
                                    <label className="form-check-label fw-bold" htmlFor={`course_${course.course_id}`}>
                                        {course.title}
                                    </label>
                                </div>
                                {course.modules.length > 0 && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-link"
                                        onClick={() => toggleCourseModules(course.course_id)}
                                    >
                                        <span
                                            id={`toggle-icon-${course.course_id}`}
                                            className={
                                                selectedCourses[course.course_id]?.showModules
                                                    ? "bi bi-chevron-up"
                                                    : "bi bi-chevron-down"
                                            }
                                            style={{ color: "black", fontWeight: "bolder", fontSize: "14px" }}
                                        ></span>
                                    </button>
                                )}
                            </div>

                            {selectedCourses[course.course_id]?.showModules && course.modules.length > 0 && (
                                <div className="materials-container" style={{ display: "block" }}>
                                    <hr className="my-2" />
                                    {course.modules.every(module => module.vectorized) ? (
                                        <div className="ps-5 pe-2 py-2 custom-card text-muted">
                                            All modules are vectorized
                                        </div>
                                    ) : (
                                        course.modules.filter(module => !module.vectorized).map(module => (
                                            <div
                                                key={module.module_id}
                                                className="form-check ps-5 pe-2 py-2 custom-card"
                                                style={
                                                    selectedCourses[course.course_id]?.modules[module.module_id]
                                                        ? checkedStyle
                                                        : {}
                                                }
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input module-checkbox p-2"
                                                    id={`module_${module.module_id}-course_${course.course_id}`}
                                                    checked={
                                                        selectedCourses[course.course_id]?.modules[module.module_id] || false
                                                    }
                                                    onChange={() => handleModuleCheck(course.course_id, module.module_id)}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor={`module_${module.module_id}-course_${course.course_id}`}
                                                >
                                                    {module.title}
                                                </label>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {course.modules.length === 0 && (
                                <div className="ps-5 pe-2 py-2 custom-card text-muted">
                                    No modules available
                                </div>
                            )}
                        </div>
                    ))}

                </form>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={isProcessing}>Generate</button>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
            </div>
        </>
    );
}
