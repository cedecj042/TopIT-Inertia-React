import StudentLayout from "@/Layouts/StudentLayout";
import { Head } from "@inertiajs/react";
import ThetaScoreBar from "@/Components/Chart/ThetaScoreBar";
import TestHistory from "@/Components/Test/TestHistory";
import "../../../css/student/dashboard.css";
import { StudentContent } from "@/Components/LayoutContent/StudentContent";

function Dashboard({ title, averageThetaScore, tests }) {
    const testsData = tests && tests.data ? tests.data : [];

    return (
        <>
            <div className="row p-3">
                <div className="row mt-4 px-5">
                    <h3 className="fw-bold mb-4">Dashboard</h3>
                    <h5 className="fw-semibold">Average Theta Scores</h5>
                    <div className="row w-100 px-5 mb-3">
                        <div className="chart-container">
                            <ThetaScoreBar thetaScoreData={averageThetaScore} />
                        </div>
                    </div>
                </div>
                <div className="row mt-4 px-5">
                    <TestHistory tests={testsData} />
                </div>
            </div>
        </>
    );
}

export default StudentContent(Dashboard);
