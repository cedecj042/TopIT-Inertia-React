import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import Navbar from "@/Components/Navigation/Navbar";
import "../../../../css/student/students.css";
// import "../../../../css/student/welcome.css";

const TestFinish = ({ assessment, assessment_courses }) => {
    const assessmentData = assessment.data;
    const assessmentCourses = assessment_courses.data;

    return (
        <>
            <Head title="Finish" />
            <Navbar isLight={false} />
            <div className="container-fluid">
                <div className="row min-vh-100">
                    <div className="col-11 d-flex flex-row justify-content-center align-items-center mb-5 assessment-container">
                        <div className="mx-5 px-5">
                            <img
                                src="/assets/postpretest.svg"
                                alt="Assessment Complete"
                                className="img-fluid"
                            />
                        </div>
                        <div className="d-flex flex-column gap-3">
                            <div>
                                <div className="row">
                                    <div>
                                        <Link
                                            href={route("test.index")}
                                            className="btn btn-link text-dark text-decoration-none mb-4 p-0"
                                        >
                                            <i className="bi bi-arrow-left"></i>{" "}
                                            Back
                                        </Link>
                                    </div>
                                </div>

                                <h2>Assessment Completed!</h2>
                                <p
                                    className="fs-5 "
                                    style={{
                                        maxWidth: "650px",
                                        lineHeight: "1.5",
                                    }}
                                >
                                    {/* You got a score of{" "}
                                    <strong>
                                        {assessmentData.total_score}/{assessmentData.total_items}
                                    </strong>
                                    .  */}
                                    Thank you for taking the assessment test.{" "}
                                    You have completed your{" "}
                                    {assessmentData.type}. Happy reviewing!
                                </p>
                            </div>
                            <div className="w-75 d-flex flex-column align-items-center">
                                <h5 className="text-start w-100">
                                    Assessment Summary
                                </h5>
                                <div className="card bg-transparent w-100">
                                    <div
                                        className="card-body d-grid gap-2"
                                        style={{
                                            gridTemplateColumns: "auto auto",
                                        }}
                                    >
                                        {/* <span className="fw-bold d-flex flex-row justify-content-between pe-3">Score <span>:</span></span>
                                        <span>{assessmentData.total_score} / {assessmentData.total_items}</span> */}

                                        <span className="fw-bold d-flex flex-row justify-content-between pe-3">
                                            Percentage <span>:</span>
                                        </span>
                                        <span>
                                            {assessmentData.percentage}%
                                        </span>

                                        <span className="fw-bold d-flex flex-row justify-content-between pe-3">
                                            Time Taken <span>:</span>
                                        </span>
                                        <span>
                                            {assessmentData.start_time} -{" "}
                                            {assessmentData.end_time}
                                        </span>

                                        <span className="fw-bold d-flex flex-row justify-content-between pe-3">
                                            Date Started <span>:</span>
                                        </span>
                                        <span>{assessmentData.created_at}</span>

                                        <span className="fw-bold d-flex flex-row justify-content-between pe-3">
                                            Date Completed <span>:</span>
                                        </span>
                                        <span>{assessmentData.updated_at}</span>
                                    </div>
                                </div>

                                <div className="card bg-transparent mt-3 mb-3 w-100">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between">
                                            <span className="fw-bold">
                                                Course{" "}
                                            </span>
                                            <span className="fw-bold">
                                                Ability Score
                                            </span>
                                        </div>
                                        <hr className="my-2" />
                                        {assessmentCourses.map(
                                            (course, index) => (
                                                <div
                                                    key={index}
                                                    className="d-flex justify-content-between"
                                                >
                                                    <span>
                                                        {course.course.title}
                                                    </span>
                                                    <span className="text-muted">
                                                        {
                                                            course.final_theta_score
                                                        }
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="text-muted small mt-2 mb-4 w-100">
                                    <p
                                        className="mb-1"
                                        style={{
                                            maxWidth: "600px",
                                            lineHeight: "1.5",
                                        }}
                                    >
                                        <strong>About Ability Scores:</strong>{" "}
                                        Your score measures your skill level in
                                        each course. Higher values (closer to
                                        +5) mean stronger mastery, while lower
                                        scores (closer to -5) indicate areas
                                        needing practice. This adaptive score
                                        helps track your progress over time.
                                    </p>
                                </div>

                                <div className="d-flex flex-row gap-3 mt-3">
                                    <Link
                                        href={route("dashboard")}
                                        className="btn btn-primary btn-hover-primary"
                                    >
                                        Proceed to Dashboard
                                    </Link>
                                    <Link
                                        href={route(
                                            "test.review",
                                            assessmentData.assessment_id
                                        )}
                                        className="btn btn-outline-primary btn-hover-outline"
                                    >
                                        Review Answers
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
TestFinish.layout = (page) => <MainLayout children={page} />;

export default TestFinish;
