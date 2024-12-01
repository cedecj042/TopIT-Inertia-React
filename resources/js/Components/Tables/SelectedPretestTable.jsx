import { useColumnVisibility, useRequest } from "@/Library/hooks";
import { useSelectedQuestions } from "../Context/SelectedQuestionsProvider"
import Table from "./Table";
import { PRETEST_COLUMN, QUESTION_COLUMN } from "@/Library/constants";
import { toast } from "sonner";

export default function SelectedPretestTable(
    closeModal,
){
    const keyField = 'question_id';
    const {selectedQuestions, setSelectedQuestions} = useSelectedQuestions();
    const  {visibleColumns,onColumnChange} =  useColumnVisibility(PRETEST_COLUMN); 
    const  {isProcessing,postRequest} = useRequest();
    const addToPretest = () => {

        const questions = selectedQuestions.map((question) => question.question_id);
        console.log({questions:questions})
        postRequest("admin.pretest.add", {questions:questions}, {
            onSuccess: (success) => {
                console.log(success);
                toast.success("Questions added to Pretest successfully.", { duration: 3000 });
                setSelectedQuestions([]);
            },
            onError: () => {
                toast.error("Error saving the questions.", { duration: 3000 });
            },
        });
    };
    // Handle row selection toggle
    const handleRowClick = (e, rowData) => {
        e.preventDefault();

        const isSelected = selectedQuestions.some(
            (question) => question[keyField] === rowData[keyField]
        ); // Check if the rowData is already in selectedQuestions

        const updatedSelection = isSelected
            ? selectedQuestions.filter(
                  (question) => question[keyField] !== rowData[keyField]
              ) // Remove if already selected
            : [...selectedQuestions, rowData]; // Add the full question object if not selected

        setSelectedQuestions(updatedSelection); // Update context
    };

    // Render checkbox state
    const renderCheckbox = (rowData) => (
        <input
            type="checkbox"
            className="form-check-input align-content-center"
            checked={selectedQuestions.some(
                (question) => question[keyField] === rowData[keyField]
            )} // Check if rowData is in selectedQuestions
            onChange={(e) => handleRowClick(e, rowData)} // Sync checkbox click with row selection
        />
    );


    return(
        <>
            <div className="modal-body">
                <Table
                    isSelectable={true}
                    handleClick={handleRowClick}
                    data={selectedQuestions}
                    visibleColumns={visibleColumns}
                    keyField={keyField}
                    isRowClickable={true}
                    renderCheckbox={renderCheckbox}
                />
            </div>
            <div className="modal-footer">
                <div className="d-inline-flex justify-content-end gap-2 mt-3">
                    <button className="btn btn-secondary" onClick={closeModal}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={addToPretest}>
                        Submit
                    </button>
                </div>
            </div>

        </>
    )
}