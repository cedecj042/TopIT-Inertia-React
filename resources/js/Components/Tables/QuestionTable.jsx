import { useContext, useState } from "react";
import ContextProvider from "../Context/TableContext";
import Table from "./Table";
import { useColumnVisibility, useRequest, useSortState } from "@/Library/hooks";
import Modal from "../Modal/Modal";
import DeleteForm from "../Forms/DeleteForm";
import ViewQuestionModal from "../Modal/ViewQuestionModal";
import EditQuestionForm from "../Forms/EditQuestionForm";
import { toast } from "sonner";
import { useSelectedQuestions } from "../Context/SelectedQuestionsProvider";


export default function QuestionTable({
    data,
    filters,
    queryParams,
    removeState,
}) {
    const { selectedQuestions, setSelectedQuestions } = useSelectedQuestions();
    const { state, dispatch, visibleColumns } = useContext(ContextProvider);
    const keyField = "question_id";
    const { toggleTableSort } = useSortState(dispatch);
    const { isProcessing, postRequest, deleteRequest } = useRequest();

    const [selectedQuestion, setSelectedQuestion] = useState();
    const [activeModal, setActiveModal] = useState(null);

    const openModal = (modalType, question) => {
        setSelectedQuestion(question);
        setActiveModal(modalType);
    };
    const closeModal = () => {
        setActiveModal(null);
        setSelectedQuestion(null);
    };
    const toggleQuestionSelection = (rowData) => {
        const isSelected = selectedQuestions.some(
            (question) => question[keyField] === rowData[keyField]
        );

        const updatedSelection = isSelected
            ? selectedQuestions.filter(
                (question) => question[keyField] !== rowData[keyField]
            )
            : [...selectedQuestions, rowData];

        setSelectedQuestions(updatedSelection);
    };

    const handleRowClick = (e, rowData) => {
        e.preventDefault();
        toggleQuestionSelection(rowData);
    };

    const renderCheckbox = (rowData) => (
        <input
            type="checkbox"
            className="form-check-input align-content-center"
            checked={selectedQuestions.some(
                (question) => question[keyField] === rowData[keyField]
            )}
            onClick={(e) => e.stopPropagation()}
            onChange={() => toggleQuestionSelection(rowData)} 
        />
    );
    const allSelected = data.length > 0 && data.every((row) =>
        selectedQuestions.some((q) => q[keyField] === row[keyField])
    );

    const toggleSelectAll = () => {
        if (allSelected) {
            const remaining = selectedQuestions.filter(
                (q) => !data.some((d) => d[keyField] === q[keyField])
            );
            setSelectedQuestions(remaining);
        } else {
            const newSelections = data.filter(
                (row) => !selectedQuestions.some((q) => q[keyField] === row[keyField])
            );
            setSelectedQuestions([...selectedQuestions, ...newSelections]);
        }
    };

    const renderSelectAllCheckbox = () => (
        <>
            <input
                type="checkbox"
                className="form-check-input align-content-center"
                checked={allSelected}
                onChange={toggleSelectAll}
                id="selectAllCheckbox"
            />
        </>
    );

    const renderActions = (rowData) => {
        return (
            <>
                <div className="d-inline-flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openModal("edit", rowData);
                        }}
                        className="btn btn-outline-primary d-flex justify-content-center align-items-left"
                    >
                        <span className="material-symbols-outlined align-self-center">
                            edit_square
                        </span>{" "}
                        Edit
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openModal('delete', rowData);
                        }}
                        className="btn btn-outline-danger d-flex justify-content-center align-items-left"
                    >
                        <span className="material-symbols-outlined align-self-center">
                            delete
                        </span>{" "}
                        Delete
                    </button>
                </div>
            </>
        );
    };


    const deleteQuestion = (question_id) => {
        deleteRequest("admin.question.delete", question_id, {
            onSuccess: () => {
                toast.success("Question deleted successfully.");
                closeModal();
            },
            onError: (error) => {
                toast.error("Error deleting question");
            },
        });
    };

    const viewQuestion = (e, rowData) => {
        e.preventDefault();
        openModal("view", rowData); // Open view modal on row click
    };

    return (
        <>

            <Table
                data={data}
                visibleColumns={visibleColumns}
                sortState={state.sortState}
                changeSort={toggleTableSort}
                renderActions={renderActions}
                keyField={keyField}
                isRowClickable={true}
                handleClick={removeState ? handleRowClick : viewQuestion}
                isSelectable={removeState}
                renderCheckbox={renderCheckbox}
                renderSelectAllCheckbox={removeState ? renderSelectAllCheckbox : null}
            />

            <Modal
                show={Boolean(activeModal)}
                onClose={closeModal}
                modalTitle={`${activeModal?.charAt(0).toUpperCase() + activeModal?.slice(1)} Question`}
                modalSize={'modal-lg'}
            >
                {activeModal === "view" && selectedQuestion && (
                    <ViewQuestionModal onClose={closeModal} question={selectedQuestion} />
                )}
                {activeModal === "edit" && selectedQuestion && (
                    <EditQuestionForm onClose={closeModal} question={selectedQuestion} filters={filters} />
                )}
                {activeModal === "delete" && selectedQuestion && (
                    <DeleteForm
                        title={selectedQuestion.question} s
                        onClose={closeModal}
                        onDelete={() => deleteQuestion(selectedQuestion.question_id)}
                        isProcessing={isProcessing}
                    />
                )}
            </Modal>
        </>
    );
}