import StudentProfile from "@/Components/Profile/StudentProfile";
import "../../../css/chart.css";
import { AdminContent } from "@/Components/LayoutContent/AdminContent";
import ThetaScoreLine from "@/Components/Chart/ThetaScoreLine";
import { useRequest } from "@/Library/hooks";
import { FilterContext } from "@/Components/Context/FilterContext";
import { INITIAL_TEST_STATE } from "@/Library/filterState";
import AssessmentFilters from "@/Components/Filter/AssessmentFilters";
import AssessmentList from "@/Components/Test/AssessmentList";
import Pagination from "@/Components/Pagination";
function Student({ student, theta_score, queryParams ={},filters,assessments }) {
    const { getRequest,isProcessing } = useRequest();
    const handleBackClick = () => {
        getRequest('admin.report', { ...queryParams });
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
                <div className="row w-100 px-5 mb-5">
                    <h5 className="fw-semibold">
                        Ability Scores per Course
                    </h5>
                    <div className="col-12 chart-height">
                        <ThetaScoreLine thetaScoreData={theta_score} />;
                    </div>
                </div>
                <div className="row mt-3 px-5">
                    <h5 className="mb-3">Assessment History</h5>
                    <FilterContext
                        initialState={INITIAL_TEST_STATE(queryParams)}
                        routeName={"admin.student"}
                        routeId={student.data.student_id}
                        components={assessments}
                    >
                        <AssessmentFilters filters={filters}/>
                        <AssessmentList tests={assessments.data} />
                    </FilterContext>
                    <Pagination links={assessments.meta.links} queryParams={queryParams} />
                </div>
            </div>
        </>
    );
}
export default AdminContent(Student);
