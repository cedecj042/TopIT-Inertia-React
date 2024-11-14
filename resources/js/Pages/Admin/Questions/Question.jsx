import QuestionFilters from "@/Components/Filter/QuestionFilters";
import { AdminContent } from "@/Components/LayoutContent/AdminContent";
import Pagination from "@/Components/Pagination";
import QuestionTable from "@/Components/Tables/QuestionTable";
import { TableContext } from "@/Components/Tables/TableContext";
import { QUESTION_COLUMN, QUESTION_FILTER_COMPONENT } from "@/Library/constants";
import { INITIAL_QUESTION_STATE } from "@/Library/filterState";

function Question({ questions,filters,queryParams = {} }) {
    return (
        <>
            <div className="container-fluid p-5">
                <div className="row justify-content-center">
                    <div className="col mb-3 btn-toolbar justify-content-between">
                        <h3 className="fw-bold">Questions</h3>
                    </div>
                    <div className="row mt-2 p-0">
                        <div className="d-flex flex-column col-12">
                            <h5 className="fw-semibold mb-3">List of Questions</h5>
                            <TableContext
                                initialState={INITIAL_QUESTION_STATE(queryParams)}
                                routeName={"admin.question.index"}
                                components={QUESTION_FILTER_COMPONENT}
                                column={QUESTION_COLUMN}
                            >
                                <QuestionFilters filters={filters} />
                                <QuestionTable
                                    data={questions.data}
                                    filters={filters}
                                    queryParams={queryParams}
                                />
                            </TableContext>
                            <Pagination links={questions.meta.links} queryParams={queryParams} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminContent(Question);
