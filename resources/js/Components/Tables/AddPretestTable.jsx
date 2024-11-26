import { useContext } from "react";
import Table from "./Table";
import { useRequest, useSortState } from "@/Library/hooks";
import { toast } from "sonner";
import ContextProvider from "../Context/TableContext";
import { useSelectedQuestions } from "../Context/SelectedQuestionsProvider";

export default function AddPretestTable({ data, filters, queryParams }) {
    const { state, dispatch, visibleColumns } = useContext(ContextProvider);
    const keyField = "question_id"; // Unique identifier for each question
    const { changeSort } = useSortState(dispatch);
    const { selectedQuestions, setSelectedQuestions } = useSelectedQuestions();
    
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

    return (
        <>
            <Table
                data={data}
                visibleColumns={visibleColumns}
                sortState={state.sortState}
                changeSort={changeSort}
                keyField={keyField}
                isRowClickable={true}
                handleClick={handleRowClick}
                isSelectable={true}
                renderCheckbox={renderCheckbox}
            />
        </>
    );
}
