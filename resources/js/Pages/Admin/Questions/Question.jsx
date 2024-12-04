import QuestionFilters from "@/Components/Filter/QuestionFilters";
import GenerateQuestionForm from "@/Components/Forms/GenerateQuestionForm";
import { AdminContent } from "@/Components/LayoutContent/AdminContent";
import Modal from "@/Components/Modal/Modal";
import Pagination from "@/Components/Pagination";
import QuestionTable from "@/Components/Tables/QuestionTable";
import { TableContext } from "@/Components/Context/TableContext";
import { QUESTION_COLUMN, QUESTION_FILTER_COMPONENT } from "@/Library/constants";
import { INITIAL_QUESTION_STATE } from "@/Library/filterState";
import axios from "axios";
import { useState } from "react";

function Question({ questions,filters,queryParams = {} }) {
    const [showModal, setShowModal] = useState(false);
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
                        <button
                            type="button"
                            className="btn btn-primary btn-md btn-size"
                            onClick={openModal}
                        >
                            Generate Question
                        </button>
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
            <Modal
                show={showModal}
                modalTitle={'Generate Question'}
                modalSize={'modal-xl'}
                onClose={closeModal}
            >
                <GenerateQuestionForm data={data} closeModal={closeModal} />

            </Modal>
        </>
    );
}

export default AdminContent(Question);
