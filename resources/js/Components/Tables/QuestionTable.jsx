import { useContext, useState } from "react";
import ContextProvider from "./TableContext";
import Table from "./Table";
import { useColumnVisibility, useRequest, useSortState } from "@/Library/hooks";
import Modal from "../Modal/Modal";
import DeleteForm from "../Forms/DeleteForm";
import ViewQuestionModal from "../Modal/ViewQuestionModal";
import EditQuestionForm from "../Forms/EditQuestionForm";


export default function QuestionTable({
    data,
    filters,
    queryParams,
}){ 
    const { state, dispatch,visibleColumns} = useContext(ContextProvider);
    const keyField = "question_id";
    const {changeSort} = useSortState(dispatch);
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
                            e.stopPropagation(); // Prevent row click
                            openModal('delete',rowData);
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

    const editQuestion = () => {
        e.stopPropagation();
        
    };

    const deleteQuestion = (question_id) => {
        deleteRequest("admin.question.delete", question_id, {
            onSuccess:()=>{
                toast.success("Question deleted successfully.");
                closeModal();
            },
            onError: (error) => {
                toast.error("Error deleting question");
            },
        });
    };
    const viewCourse = (e,rowData) => {
        e.preventDefault();
        openModal("view", rowData); // Open view modal on row click
    };
    return(
        <>  
            <Table
                data={data}
                visibleColumns={visibleColumns}
                sortState={state.sortState}
                changeSort={changeSort}
                renderActions={renderActions}
                keyField={keyField}
                isRowClickable={true}
                handleClick={viewCourse}
            />

            
        
            {/* Modal for View, Edit, and Delete */}
            <Modal 
                show={Boolean(activeModal)} 
                onClose={closeModal} 
                modalTitle={`${activeModal?.charAt(0).toUpperCase() + activeModal?.slice(1)} Question`}
                modalSize={'modal-lg'}
            >
                {activeModal === "view" && selectedQuestion && (
                    <ViewQuestionModal onClose={closeModal} question={selectedQuestion}/>
                )}
                {activeModal === "edit" && selectedQuestion && (
                    <EditQuestionForm onClose={closeModal} question={selectedQuestion} filters = {filters} />
                )}
                {activeModal === "delete" && selectedQuestion && (
                    <DeleteForm
                        title={selectedQuestion.question}s
                        onClose={closeModal}
                        onDelete={() => deleteQuestion(selectedQuestion.question_id)}
                        isProcessing={isProcessing}
                    />
                )}
            </Modal>
        </>
    );
}