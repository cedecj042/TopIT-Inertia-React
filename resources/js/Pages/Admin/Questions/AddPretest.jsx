import QuestionFilters from "@/Components/Filter/QuestionFilters";
import { AdminContent } from "@/Components/LayoutContent/AdminContent";
import Modal from "@/Components/Modal/Modal";
import Pagination from "@/Components/Pagination";
import AddPretestTable from "@/Components/Tables/AddPretestTable";
import QuestionTable from "@/Components/Tables/QuestionTable";
import { TableContext } from "@/Components/Tables/TableContext";
import { QUESTION_COLUMN, QUESTION_FILTER_COMPONENT } from "@/Library/constants";
import { INITIAL_QUESTION_STATE } from "@/Library/filterState";
import { useRequest } from "@/Library/hooks";

function AddPretest({questions,filters,queryParams = {}}){
    const {isProcessing,getRequest} = useRequest();
    
    const addPretest = () =>{
        getRequest('admin.pretest.add');
    }
    
    return(
        <>
        <div className="container-fluid p-5">
                <div className="row justify-content-center">
                <div className="col mb-3 btn-toolbar justify-content-start">
                        <h2 className="fw-bolder m-0">Add Pretest Question</h2>
                    </div>
                    <div className="row mt-2 p-0">
                        <div className="d-flex flex-column col-12">
                            <h5 className="fw-semibold mb-3">List of Questions</h5>
                            <TableContext
                                initialState={INITIAL_QUESTION_STATE(queryParams)}
                                routeName={"admin.pretest.add"}
                                components={QUESTION_FILTER_COMPONENT}
                                column={QUESTION_COLUMN}
                            >
                                <QuestionFilters filters={filters} />
                                <AddPretestTable
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

export default AdminContent(AddPretest);