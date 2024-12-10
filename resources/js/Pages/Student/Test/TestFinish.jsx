import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import Navbar from "@/Components/Navigation/Navbar";
import "../../../../css/student/students.css";
import "../../../../css/student/welcome.css";

const TestFinish = ({ score, totalQuestions, pretestId }) => {
    return (
        <>
            <Head title="Finish" />
            <Navbar isLight={false} />

            <div className="pretestb container-fluid">
                <div
                    className="row align-items-center"
                    style={{ height: "calc(100vh - 100px)" }}
                >
                    <div
                        className="col-md-4 text-center"
                        style={{ marginLeft: "15rem", marginRight: "-10rem" }}
                    >
                        <img
                            src="/assets/postpretest.svg"
                            alt="Assessment Complete"
                            className="img-fluid"
                        />
                    </div>
                    <div className="col-md-6 offset-md-1">
                        <div className="pe-md-5">
                            <h2 className="mb-4">Test Completed!</h2>
                            <p className="fs-5">
                                You got a score of{" "}
                                <strong>
                                    {score}/{totalQuestions}
                                </strong>
                                . Thank you for taking the test.{" "}
                                <br />
                            </p>
                            <Link
                                href={`/dashboard`}
                                className="btn btn-primary w-50 p-2 mt-4"
                            >
                                Proceed to Dashboard
                            </Link>
                        </div>

                        <div className="pe-md-5">
                            <Link
                                href={`/pretest/review/${pretestId}`}
                                className="btn btn-outline-primary w-50 p-2 mt-3"
                            >
                                Review Answers
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
TestFinish.layout = (page) => <MainLayout children={page} />;

export default TestFinish;
