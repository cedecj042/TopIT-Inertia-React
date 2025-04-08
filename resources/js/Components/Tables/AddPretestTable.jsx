import { useContext } from "react";
import Table from "./Table";
import { useRequest, useSortState } from "@/Library/hooks";
import { toast } from "sonner";
import ContextProvider from "../Context/TableContext";
import { useSelectedQuestions } from "../Context/SelectedQuestionsProvider";

export default function AddPretestTable({ data, filters, queryParams }) {
    const { state, dispatch, visibleColumns } = useContext(ContextProvider);
    const keyField = "question_id"; // Unique identifier for each question
    const { toggleTableSort } = useSortState(dispatch);
    const { selectedQuestions, setSelectedQuestions } = useSelectedQuestions();

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

    return (
        <>
            <Table
                data={data}
                visibleColumns={visibleColumns}
                sortState={state.sortState}
                changeSort={toggleTableSort}
                keyField={keyField}
                isRowClickable={true}
                handleClick={handleRowClick}
                isSelectable={true}
                renderCheckbox={renderCheckbox}
                renderSelectAllCheckbox={renderSelectAllCheckbox}
            />
        </>
    );
}
