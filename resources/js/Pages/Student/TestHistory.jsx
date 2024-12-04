import { Link } from "@inertiajs/react";
import TestHistory from "@/Components/Test/TestHistory";
import Pagination from "@/Components/Pagination";
import { StudentContent } from "@/Components/LayoutContent/StudentContent";
import "../../../css/student/students.css";
import { TableContext } from "@/Components/Context/TableContext";
import { INITIAL_TEST_STATE } from "@/Library/filterState";

const TestHistoryPage = ({ tests = [], paginationLinks = [],queryParams={},filters}) => {
    const testsData = tests.data || [];
    const pagination = paginationLinks || [];

    return (
        <>
            <main className="row p-3">
                <div className="row mt-4 px-5">
                    <div className="d-flex justify-content-between">
                        <Link
                            href={`/test`}
                            className="btn btn-link text-dark text-decoration-none mb-2 p-0"
                        >
                            <i className="bi bi-arrow-left"></i> Back
                        </Link>
                    </div>
                    <h3 className="fw-bold mb-2 mt-3">Test History</h3>
                    <p className="text-muted">
                        Review your past tests and track your progress.
                    </p>
                </div>
                <TableContext
                    initialState={INITIAL_TEST_STATE(queryParams)}
                    routeName={'student.test.history'}
                    components={tests}
                    column={null}
                >




                </TableContext>
                <div className="row mt-4 px-5">
                    <TestHistory tests={testsData} />
                </div>

                <div className="row mt-4">
                    <div className="col-12">
                        {pagination.length > 0 && (
                            <Pagination links={pagination} />
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default StudentContent(TestHistoryPage);
