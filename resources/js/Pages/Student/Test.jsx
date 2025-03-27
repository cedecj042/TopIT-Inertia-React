import React from "react";
import { Link } from "@inertiajs/react";
import TestHistory from "@/Components/Test/TestHistoryList";
import "../../../css/student/students.css";
import { StudentContent } from "@/Components/LayoutContent/StudentContent";

function TestPage(props) {
    const testsData = props.tests && props.tests.data ? props.tests.data : [];
    const assessmentId = props.assessmentId || null;
    return (
        <>
            <main className="row p-3 mt-4">
                <div className="row align-items-center mb-4">
                    <div className="col-md-4 offset-md-2">
                        <img
                            src="/assets/test.svg"
                            width="500"
                            height="500"
                            alt="Test"
                            className="img-fluid"
                        />
                    </div>
                    <div className="col-md-3 offset-md-1">
                        <h2 className="fw-bold mb-3">Ready for a test?</h2>
                        <p className="text-muted mb-4">
                            This type of testing implements the Computerized
                            Adaptive Testing algorithm, which adapts to your
                            ability level from the different courses. Take a
                            test now!
                        </p>
                        <Link href={`/test/course`} className="btn btn-primary p-3 pt-2 pb-2 btn-hover-primary">
                            Take a Test
                        </Link>
                    </div>
                </div>
                <div className="row mt-4 px-5">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-semibold fs-5">Recent Attempts</h5>
                        <Link href={route('test.history')} className="text-decoration-none">
                            View Test History
                        </Link>
                    </div>
                    <TestHistory tests={testsData}/>
                </div>
            </main>
        </>
    );
}

export default StudentContent(TestPage);
