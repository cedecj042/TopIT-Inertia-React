import QuestionFilters from "@/Components/Filter/QuestionFilters";
import GenerateQuestionForm from "@/Components/Forms/GenerateQuestionForm";
import { AdminContent } from "@/Components/LayoutContent/AdminContent";
import Modal from "@/Components/Modal/Modal";
import Pagination from "@/Components/Pagination";
import { TableContext } from "@/Components/Context/TableContext";
import { QUESTION_COLUMN, QUESTION_FILTER_COMPONENT } from "@/Library/constants";
import { INITIAL_QUESTION_STATE } from "@/Library/filterState";
import axios from "axios";
import { useState } from "react";
import { SelectedQuestionsProvider, useSelectedQuestions } from "@/Components/Context/SelectedQuestionsProvider";
import QuestionTable from "@/Components/Tables/QuestionTable";
import DeleteQuestionTable from "@/Components/Tables/DeleteQuestionTable";

function QuestionInner({ questions, filters, queryParams = {} }) {
    const { selectedQuestions } = useSelectedQuestions();
    const [showModal, setShowModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [removeState, setRemoveState] = useState(false);
    const [data, setData] = useState([]);
    const openModal = async () => {
        try {
            const response = await axios.get(route('admin.question.courses'));
            setData(response.data);
            setShowModal(true);

        } catch (error) {
            console.error("Failed to fetch courses with modules:", error);
        }
    };
    const closeModal = () => setShowModal(false);

    return (
        <>
            <div className="container-fluid p-5">
                <div className="row justify-content-center">
                    <div className="col mb-3 btn-toolbar justify-content-between">
                        <h2 className="fw-bolder m-0">Question Bank</h2>
                        <div className="d-inline-flex gap-3">
                            <div className="d-flex gap-3">
                                {(selectedQuestions && removeState) && (
                                    selectedQuestions.length > 0 && (
                                        <div className="position-relative">
                                            <button className="btn h-100 btn-secondary-subtle d-flex align-content-center border clickable" onClick={() => setDeleteModal(true)}>
                                                <span className="material-symbols-outlined align-self-center text-danger">delete</span>
                                            </button>
                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{zIndex:"100"}}>
                                                {selectedQuestions.length > 99 ? "99+" : selectedQuestions.length}
                                                <span className="visually-hidden">selected questions</span>
                                            </span>
                                        </div>
                                    )
                                )}
                                <div
                                    className={`position-relative d-inline-flex align-items-center px-3 py-2 rounded gap-1 h-full ${removeState ? "bg-primary-subtle text-primary" : "bg-light clickable border border-1 "}`}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setRemoveState(!removeState)}
                                >
                                    <span>Select Questions</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="btn btn-primary btn-md btn-size"
                                onClick={openModal}
                            >
                                Generate Question
                            </button>
                        </div>

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
                                <QuestionFilters
                                    filters={filters}
                                    setRemoveState={setRemoveState}
                                    removeState={removeState}
                                    selectedQuestions={selectedQuestions}
                                />
                                <QuestionTable
                                    data={questions.data}
                                    filters={filters}
                                    queryParams={queryParams}
                                    removeState={removeState}
                                />
                            </TableContext>
                            <Pagination links={questions.meta.links} queryParams={queryParams} />
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                show={showModal}
                modalTitle={'Generate Question'}
                modalSize={'modal-xl'}
                onClose={closeModal}
            >
                <GenerateQuestionForm data={data} closeModal={closeModal} />

            </Modal>
            <Modal
                modalTitle={'Selected Questions for deletion'}
                modalSize={'modal-xl'}
                onClose={()=> setDeleteModal(false)}
                show={deleteModal}
            >
                <DeleteQuestionTable closeModal={() =>setDeleteModal(false)} />
            </Modal>

        </>
    );
}
function Question(props) {
    return (
        <SelectedQuestionsProvider>
            <QuestionInner {...props} />
        </SelectedQuestionsProvider>
    );
}

export default AdminContent(Question);
