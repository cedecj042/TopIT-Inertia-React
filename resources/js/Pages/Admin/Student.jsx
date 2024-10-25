import ThetaScoreBar from "@/Components/Chart/ThetaScoreBar";
import StudentProfile from "@/Components/Profile/StudentProfile";
import "../../../css/admin/dashboard.css";
import { router } from "@inertiajs/react";
import { AdminContent } from "@/Components/LayoutContent/AdminContent";

function Student({ student, averageThetaScore ,title,queryParams}) {
    const handleBackClick = () => {
        router.get(route('admin.dashboard', queryParams));
    };
    return (
        <>
            <div className="row p-3 mt-2">
                <div className="row mt-4 px-5">
                    <div className="d-flex justify-content-between flex-column">
                        <div className="d-flex flex-row align-items-center">
                            <button
                                className="btn btn-transparent"
                                onClick={handleBackClick} 
                            >
                                <i className="bi bi-arrow-left"></i> 
                            </button>
                            <h5 className="fw-semibold m-0">Student Profile</h5>
                        </div>
                        <StudentProfile student={student.data}/>
                    </div>
                    <div className="row w-100 px-5 mb-3">
                        <h5 className="fw-semibold">
                            Average Theta Scores per Course
                        </h5>
                        <div className="chart-container">
                            <ThetaScoreBar thetaScoreData={averageThetaScore} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default AdminContent(Student);
