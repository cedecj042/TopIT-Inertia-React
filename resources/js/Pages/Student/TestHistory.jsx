import React from "react";
import { Link } from "@inertiajs/react";
import TestHistory from "@/Components/Test/TestHistory";
import { StudentContent } from "@/Components/LayoutContent/StudentContent";
import "../../../css/student/students.css";

const TestHistoryPage = ({ tests = [], paginationLinks = [] }) => {
    const testsData = tests.data || [];  
    const pagination = paginationLinks || [];

    // console.log("pagination", paginationLinks);
    // console.log("tests", tests);

    return (
        <>
            <main className="row p-3">
                <div className="row mt-4 px-5">
                    <h3 className="fw-bold">Test History</h3>
                    <p className="text-muted">
                        Review your past tests and track your progress.
                    </p>
                </div>

                <div className="row mt-4 px-5">
                    <TestHistory tests={testsData} />
                </div>

                {/* Pagination Section */}
                <div className="row mt-4">
                    <div className="col-12 d-flex justify-content-center">
                        {/* Render pagination links dynamically */}
                        {pagination.length > 0 && pagination.map((link) =>
                            link.url ? (
                                <Link
                                    key={link.label}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                    href={link.url || "#"}
                                    className={`btn ${
                                        link.active
                                            ? "btn-primary"
                                            : "btn-outline-primary"
                                    } mx-1`}
                                ></Link>
                            ) : (
                                <span
                                    key={link.label}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                    className="btn btn-outline-secondary disabled mx-1"
                                />
                            )
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default StudentContent(TestHistoryPage);
