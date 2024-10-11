import React from "react";
import StudentLayout from "@/Layouts/StudentLayout";
import TestHistory from "@/Components/Test/TestHistory";
import "../../../css/student/students.css";

const TestPage = (props) => {

    const testsData = props.tests && props.tests.data ? props.tests.data : [];
    return (
        <StudentLayout title="Student Test">
            <main className="row p-3 mt-4">
                <div className="row align-items-center mb-4">
                    <div className="col-md-4 offset-md-2">
                        <img src="/assets/test.svg" width="500" height="500" alt="Test" className="img-fluid" />
                    </div>
                    <div className="col-md-3 offset-md-1">
                        <h2 className="fw-bold mb-3">Ready for a test?</h2>
                        <p className="text-muted mb-4">
                            This type of testing implements the Computerized Adaptive Testing algorithm,
                            which adapts to your ability level from the different courses. Take a test now!
                        </p>
                        <button className="btn btn-primary p-3 pt-2 pb-2">
                            Take a Test
                        </button>
                    </div>
                </div>
                <div className="row mt-4 px-5">
                <TestHistory tests={testsData } />
                </div>
            </main>
        </StudentLayout>
    );
};
export default TestPage;
