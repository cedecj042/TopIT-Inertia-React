import React from "react";
import { Link } from "@inertiajs/react"; // For Inertia.js links

const TestHistory = ({ tests = [] }) => {
    if (!Array.isArray(tests) || tests.length === 0) {
        <div
            className="alert alert-light p-5 no-data d-flex flex-column"
            role="alert"
        >
            <img src="/assets/sad-cloud.svg" alt="sad cloud" />
            <label htmlFor="" className="text-secondary mt-3">
                It seems like there is no data available.
            </label>
        </div>;
    }
    console.log("test ype:", tests);

    return (
        <div>
            <div className="row">
                {tests.map((test, index) => (
                    <div key={index} className="col-12 mb-3">
                        <div className="card border-1 rounded-4 my-1 py-1">
                            <div className="card-body py-2 fs-6 d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="card-text mb-0">
                                        <small
                                            className="text-muted"
                                            style={{ fontSize: "0.8rem" }}
                                        >
                                            Started: {test.start_time} | Ended:{" "}
                                            {test.end_time}
                                        </small>
                                    </p>
                                    <h6
                                        className="card-title mb-2 mt-2"
                                        style={{ fontSize: "1.2rem" }}
                                    >
                                        {test.updated_at}
                                    </h6>
                                    <span
                                        className="badge bg-light text-dark"
                                        style={{
                                            fontSize: "0.8rem",
                                            fontWeight: "normal",
                                            padding: "0.6em 1em",
                                        }}
                                    >
                                        Score: {test.total_score} /{" "}
                                        {test.total_items} ({test.percentage}%)
                                    </span>
                                </div>
                                <div className="ms-3">
                                    <Link
                                        href={`/${
                                            test.type === "Pretest"
                                                ? "pretest"
                                                : "test"
                                        }/review/${test.assessment_id}`}
                                        className="btn btn-link p-3"
                                        title="Student Test"
                                    >
                                        <i className="h3 bi bi-play-circle-fill"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestHistory;
