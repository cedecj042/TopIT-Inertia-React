import StudentProfile from "@/Components/Profile/StudentProfile";
import "../../../css/chart.css";
import { router } from "@inertiajs/react";
import { AdminContent } from "@/Components/LayoutContent/AdminContent";
import ThetaScoreLine from "@/Components/Chart/ThetaScoreLine";
function Student({ student, theta_score, queryParams }) {
    console.log(student)
    const handleBackClick = () => {
        router.get(route('admin.report', queryParams));
    };
    return (
        <>
            <div className="row mt-4 p-3">
                <div className="d-flex justify-content-between flex-column">
                    <div className="d-flex flex-row align-items-center mb-3">
                        <button
                            className="btn btn-transparent"
                            onClick={handleBackClick}
                        >
                            <i className="bi bi-arrow-left"></i>
                        </button>
                        <h5 className="fw-semibold m-0">Student Profile</h5>
                    </div>
                    <StudentProfile student={student.data} />
                </div>
                <div className="row w-100 px-5 mb-3">
                    <h5 className="fw-semibold">
                        Theta Scores per Course
                    </h5>
                    <div className="col-12 chart-height">
                        <ThetaScoreLine thetaScoreData={theta_score} />;
                    </div>
                </div>
            </div>
        </>
    );
}
export default AdminContent(Student);
