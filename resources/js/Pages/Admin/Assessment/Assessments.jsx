import { Link } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import { INITIAL_TEST_STATE } from "@/Library/filterState";
import TestFilters from "@/Components/Filter/TestFilters";
import { FilterContext } from "@/Components/Context/FilterContext";
import TestHistoryList from "@/Components/Test/TestHistoryList";
import { AdminContent } from "@/Components/LayoutContent/AdminContent";

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
                    initialState={INITIAL_TEST_STATE(queryParams)}
                    routeName={'admin.assessments.index'}
                    components={tests}
                >
                    <TestFilters
                        filters={filters}
                    />
                    <TestHistoryList tests={testsData} />
                </FilterContext>
                </div>
                
                <div className="row mt-2">
                    <div className="col-12">
                        <Pagination links={tests.meta.links} />
                    </div>
                </div>
            </main>
        </>
    );
};
export default AdminContent(Assessments);
