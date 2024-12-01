import QuestionFilters from "@/Components/Filter/QuestionFilters";
import { AdminContent } from "@/Components/LayoutContent/AdminContent";
import Pagination from "@/Components/Pagination";
import AddPretestTable from "@/Components/Tables/AddPretestTable";
import { QUESTION_COLUMN, QUESTION_FILTER_COMPONENT } from "@/Library/constants";
import { INITIAL_QUESTION_STATE } from "@/Library/filterState";
import { TableContext } from "@/Components/Context/TableContext";
import { SelectedQuestionsProvider, useSelectedQuestions } from "@/Components/Context/SelectedQuestionsProvider";
import SelectedPretestTable from "@/Components/Tables/SelectedPretestTable";
import Modal from "@/Components/Modal/Modal";
import { useState } from "react";
import { useRequest } from "@/Library/hooks";

function AddPretestInner({ questions, filters, queryParams }) {
    const { selectedQuestions } = useSelectedQuestions();
    const {isProcessing,getRequest} = useRequest();
    const [modal, setModal] = useState(false);

    const openModal = () => setModal(true);
    const closeModal = () => setModal(false);

    const handleBackClick = async () => {
        getRequest('admin.pretest.index',queryParams);
    };

    return (
        <>
            <div className="container-fluid p-5">
                <div className="row justify-content-center">
                    <div className="col mb-3 btn-toolbar justify-content-between">
                        <div className="d-inline-flex align-items-center">
                            <button
                                className="btn btn-transparent"
                                disabled={isProcessing}
                                onClick={handleBackClick}
                            >
                                <i className="bi bi-arrow-left"></i>
                            </button>
                            <h5 className="fw-regular m-0">Add Pretest Question</h5>
                        </div>
                        <button type="button" className="btn btn-primary position-relative" onClick={openModal}>
                            Selected Questions
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {selectedQuestions.length > 99 ? "99+" : selectedQuestions.length}
                                <span className="visually-hidden">selected questions</span>
                            </span>
                        </button>
                    </div>
                    <div className="row mt-2 p-0">
                        <div className="d-flex flex-column col-12">
                            <h3 className="fw-semibold mb-3">List of Questions</h3>
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

                <Modal
                    modalTitle={'Selected Questions'}
                    modalSize={'modal-xl'}
                    onClose={closeModal}
                    show={modal}
                >
                    <SelectedPretestTable closeModal={closeModal} />
                </Modal>
            </div>
        </>
    );
}

function AddPretest(props) {
    return (
        <SelectedQuestionsProvider>
            <AddPretestInner {...props} />
        </SelectedQuestionsProvider>
    );
}

export default AdminContent(AddPretest);
