import QuestionFilters from "@/Components/Filter/QuestionFilters";
import { AdminContent } from "@/Components/LayoutContent/AdminContent";
import Pagination from "@/Components/Pagination";
import QuestionTable from "@/Components/Tables/QuestionTable";
import { TableContext } from "@/Components/Context/TableContext";
import { PRETEST_COLUMN, QUESTION_COLUMN, QUESTION_FILTER_COMPONENT } from "@/Library/constants";
import { INITIAL_QUESTION_STATE } from "@/Library/filterState";
import { useRequest } from "@/Library/hooks";
import { SelectedQuestionsProvider, useSelectedQuestions } from "@/Components/Context/SelectedQuestionsProvider";

function PretestInner({questions,filters,queryParams = {}}){
    const {isProcessing,getRequest} = useRequest();
    const { selectedQuestions } = useSelectedQuestions();
    const addPretest = () =>{
        getRequest('admin.pretest.add');
    }
    
    return(
        <>
        <div className="container-fluid p-5">
                <div className="row justify-content-center">
                <div className="col mb-3 btn-toolbar justify-content-between">
                        <h2 className="fw-bolder m-0">Pretest Items</h2>
                        <button
                            type="button"
                            className="btn btn-primary btn-md btn-size"
                            onClick={addPretest}
                        >
                            Add Question
                        </button>
                    </div>
                    <div className="row p-0">
                        <div className="d-flex flex-column col-12">
                            <h5 className="fw-semibold mb-3">List of Questions</h5>
                            <TableContext
                                initialState={INITIAL_QUESTION_STATE(queryParams)}
                                routeName={"admin.pretest.index"}
                                components={QUESTION_FILTER_COMPONENT}
                                column={PRETEST_COLUMN}
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

function Pretest(props){
    return(
        <SelectedQuestionsProvider>
            <PretestInner {...props} />
        </SelectedQuestionsProvider>
    )
}

export default AdminContent(Pretest);