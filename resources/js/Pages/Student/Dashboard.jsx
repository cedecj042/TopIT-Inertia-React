import StudentLayout from "@/Layouts/StudentLayout";
import { Head } from "@inertiajs/react";
import ThetaScoreBar from "@/Components/Chart/ThetaScoreBar";
import { useState } from "react";
import "../../../css/student/dashboard.css";


export default function Dashboard({ children, title, thetaScoreData }) {
    const [thetaScores] = useState(thetaScoreData || []); 

    return (
        <StudentLayout title="Student Dashboard">
            <Head title={title} />
            <div className="row p-3">
                <div className="row mt-4 px-5">
                    <h3 className="fw-bold">Dashboard</h3>
                </div>
            </div>
            {/* <div className="row w-100 px-5 mb-3">
                <h5 className="fw-semibold">Average Theta Scores</h5>
                <div className="chart-container">
                    <ThetaScoreBar thetaScoreData={thetaScores} />
                </div>
            </div> */}

        </StudentLayout>
    );
}
