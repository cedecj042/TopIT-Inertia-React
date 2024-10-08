import React from "react";
import { usePage } from "@inertiajs/react";
import StudentLayout from "@/Layouts/StudentLayout";

// gi convert tani since wla koy data for modules

const ModuleDetail = () => {
    const { module, moduleContent } = usePage().props;

    return (
        <StudentLayout title={module.title}>
            <div className="row p-3">
                <div className="row mt-4 px-5">
                    <h3 className="fw-semibold">{module.title}</h3>
                </div>
            </div>

            <div className="px-md-5">
                <h5>Module Content</h5>
                <div className="course-list mx-auto" style={{ width: "100%" }}>
                    {/* Iterate through module content */}
                    {moduleContent && moduleContent.length > 0 ? (
                        moduleContent.map((item, index) => (
                            <div key={index}>
                                {item.type === "Header" ? (
                                    <h5>{item.text}</h5>
                                ) : item.type === "Text" ? (
                                    <p>{item.text}</p>
                                ) : null}
                            </div>
                        ))
                    ) : (
                        <p>No content available for this module.</p>
                    )}
                </div>
                <hr />

                <h5>Lessons</h5>
                <div className="lessons-list">
                    {module.lessons && module.lessons.length > 0 ? (
                        module.lessons.map((lesson) => (
                            <div key={lesson.id} className="lesson">
                                <h4 className="lesson-title">{lesson.title}</h4>
                                {lesson.content && (
                                    <div>
                                        {lesson.content.map((content, i) => (
                                            <p key={i}>{content.text}</p>
                                        ))}
                                    </div>
                                )}

                                <div className="sections-list">
                                    {lesson.sections && lesson.sections.length > 0 ? (
                                        lesson.sections.map((section) => (
                                            <div key={section.id} className="section">
                                                <h5 className="section-title">{section.title}</h5>

                                                {/* Section content */}
                                                {section.content.map((item, i) => (
                                                    <div key={i}>
                                                        {item.type === "text" && <p>{item.text}</p>}
                                                        {item.type === "table" && (
                                                            <div className="table">
                                                                <p className="table-title">{item.caption}</p>
                                                                {item.images && item.images.length > 0 ? (
                                                                    item.images.map((img, idx) => (
                                                                        <img
                                                                            key={idx}
                                                                            src={img.file_path}
                                                                            alt="Table Image"
                                                                            className="img-fluid"
                                                                        />
                                                                    ))
                                                                ) : (
                                                                    <p>No images available for this table.</p>
                                                                )}
                                                            </div>
                                                        )}
                                                        {item.type === "figure" && (
                                                            <div className="figure">
                                                                <p className="figure-title">{item.caption}</p>
                                                                {item.images.map((img, idx) => (
                                                                    <img
                                                                        key={idx}
                                                                        src={img.file_path}
                                                                        alt="Figure Image"
                                                                        className="img-fluid"
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}
                                                        {item.type === "code" && (
                                                            <div className="code">
                                                                <p className="code-title">{item.caption}</p>
                                                                {item.images.map((img, idx) => (
                                                                    <img
                                                                        key={idx}
                                                                        src={img.file_path}
                                                                        alt="Code Image"
                                                                        className="img-fluid"
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}

                                                {/* Subsections */}
                                                {section.subsections.map((subsection) => (
                                                    <div key={subsection.id} className="subsection">
                                                        <h6 className="subsection-title">{subsection.title}</h6>
                                                        {subsection.content.map((item, i) => (
                                                            <div key={i}>
                                                                {item.type === "text" && <p>{item.text}</p>}
                                                                {item.type === "table" && (
                                                                    <div className="table">
                                                                        <p className="table-title">{item.caption}</p>
                                                                        {item.images && item.images.length > 0 ? (
                                                                            item.images.map((img, idx) => (
                                                                                <img
                                                                                    key={idx}
                                                                                    src={img.file_path}
                                                                                    alt="Table Image"
                                                                                    className="img-fluid"
                                                                                />
                                                                            ))
                                                                        ) : (
                                                                            <p>No images available for this table.</p>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                {item.type === "figure" && (
                                                                    <div className="figure">
                                                                        <p className="figure-title">{item.caption}</p>
                                                                        {item.images.map((img, idx) => (
                                                                            <img
                                                                                key={idx}
                                                                                src={img.file_path}
                                                                                alt="Figure Image"
                                                                                className="img-fluid"
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                {item.type === "code" && (
                                                                    <div className="code">
                                                                        <p className="code-title">{item.caption}</p>
                                                                        {item.images.map((img, idx) => (
                                                                            <img
                                                                                key={idx}
                                                                                src={img.file_path}
                                                                                alt="Code Image"
                                                                                className="img-fluid"
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        ))
                                    ) : (
                                        <p>No sections available for this lesson.</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No lessons available for this module.</p>
                    )}
                </div>

                <a
                    href={route("student-course-detail", module.course_id)}
                    className="btn btn-outline-secondary mb-3"
                >
                    Back to Modules
                </a>
            </div>
        </StudentLayout>
    );
};

export default ModuleDetail;
