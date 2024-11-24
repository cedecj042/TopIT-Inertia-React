import React, { useContext, useEffect, useState } from "react";
import ContextProvider from "./TableContext";
import Table from "./Table";
import { useSortState } from "@/Library/hooks";

export default function AddPretestTable({ data, filters, queryParams }) {
    const { state, dispatch, visibleColumns } = useContext(ContextProvider);
    const keyField = "question_id";
    const { changeSort } = useSortState(dispatch);

    const [selectedQuestions, setSelectedQuestions] = useState(() => {
        return localStorage.getItem("selectedQuestions")
            ? JSON.parse(localStorage.getItem("selectedQuestions"))
            : [];
    });

    // Persist selected questions to localStorage on change
    useEffect(() => {
        localStorage.setItem("selectedQuestions", JSON.stringify(selectedQuestions));
    }, [selectedQuestions]);

    // Handle row click
    const handleRowClick = (e, rowData) => {
        e.preventDefault();

        const isSelected = selectedQuestions.includes(rowData[keyField]);
        const updatedSelection = isSelected
            ? selectedQuestions.filter((id) => id !== rowData[keyField]) // Remove if already selected
            : [...selectedQuestions, rowData[keyField]]; // Add if not selected

        setSelectedQuestions(updatedSelection); // Update the selected questions
    };

    // Render checkbox for each row
    const renderCheckbox = (rowData) => (
        <input
            type="checkbox"
            className="form-check-input align-content-center"
            checked={selectedQuestions.includes(rowData[keyField])}
            onChange={() => handleRowClick(null, rowData)} // Sync checkbox click with row selection
        />
    );

    console.log("Selected Questions:", selectedQuestions);

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
            <div className="mt-3">
                <button
                    className="btn btn-success"
                    onClick={() => console.log("Selected Question IDs:", selectedQuestions)}
                >
                    Submit Selected
                </button>
            </div>
        </>
    );
}
