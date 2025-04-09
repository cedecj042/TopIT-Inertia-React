import { Link } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import { INITIAL_ASSESSMENT_STATE, INITIAL_TEST_STATE } from "@/Library/filterState";
import { FilterContext } from "@/Components/Context/FilterContext";
import { AdminContent } from "@/Components/LayoutContent/AdminContent";
import AssessmentList from "@/Components/Test/AssessmentList";
import AssessmentFilters from "@/Components/Filter/AssessmentFilters";

const Assessments = ({ tests = [],queryParams={},filters}) => {
    const testsData = tests.data || [];
    return (
        <>
            <main className="row p-3">
                <div className="row mt-3 px-5">
                    <div className="d-flex justify-content-between">
                        <Link
                            href={route('admin.report')}
                            className="btn btn-link text-dark text-decoration-none mb-2 p-0"
                        >
                            <i className="bi bi-arrow-left"></i> Back to Report
                        </Link>
                    </div>
                    <h3 className="fw-bold mb-2 mt-2">Assessments</h3>
                </div>
                <div className="row mt-3 px-5">

                <FilterContext
                    initialState={INITIAL_ASSESSMENT_STATE(queryParams)}
                    routeName={'admin.assessments.index'}
                    components={tests}
                >
                    <AssessmentFilters filters={filters} />
                    <AssessmentList tests={testsData} />
                </FilterContext>
                </div>
                
                <div className="row mt-2">
                    <div className="col-12">
                        <Pagination links={tests.meta.links} queryParams={queryParams}  />
                    </div>
                </div>
            </main>
        </>
    );
};
export default AdminContent(Assessments);
