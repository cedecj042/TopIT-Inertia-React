import StudentProfile from "@/Components/Profile/StudentProfile";
import "../../../css/chart.css";
import { router } from "@inertiajs/react";
import { AdminContent } from "@/Components/LayoutContent/AdminContent";
import ThetaScoreLine from "@/Components/Chart/ThetaScoreLine";
import { useRequest } from "@/Library/hooks";
function Student({ student, theta_score, queryParams }) {
    const {getRequest} = useRequest();
    const handleBackClick = () => {
        getRequest('admin.report',{...queryParams});
        // router.get(route('admin.report', queryParams));
    };
    return (
        <>
            <div className="container-fluid mt-4 px-5 py-3">
                <div className="row">
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
                        Ability Scores per Course
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
