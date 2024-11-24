import React, { useContext, useEffect, useState } from "react";
import { usePage } from "@inertiajs/react"; // To detect the current URL
import Table from "./Table";
import { useRequest, useSortState } from "@/Library/hooks";
import { toast } from "sonner";

export default function AddPretestTable({ data, filters, queryParams }) {
    const { state, dispatch, visibleColumns } = useContext(ContextProvider);
    const { url } = usePage(); // Get the current URL
    const keyField = "question_id";
    const { changeSort } = useSortState(dispatch);
    const { isProcessing, postRequest } = useRequest();

    const [selectedQuestions, setSelectedQuestions] = useState(() => {
        return localStorage.getItem("selectedQuestions")
            ? JSON.parse(localStorage.getItem("selectedQuestions"))
            : [];
    });

    // Persist selected questions to localStorage on change
    useEffect(() => {
        localStorage.setItem("selectedQuestions", JSON.stringify(selectedQuestions));
    }, [selectedQuestions]);

    // Clear localStorage when the URL changes outside `/pretest/add`
    useEffect(() => {
        const currentPath = window.location.pathname; // Use `window.location.pathname` for accuracy
        console.log("Current Path:", currentPath); // Debugging

        if (!currentPath.includes("/admin/pretest/add")) {
            localStorage.removeItem("selectedQuestions");
            setSelectedQuestions([]); // Clear the local state as well
        }
    }, [window.location.pathname]);
    console.log(url)

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

    const addToPretest = () => {
        postRequest("admin.pretest.add", selectedQuestions, {
            onSuccess: () => {
                toast.success("Question added to Pretest successfully.", { duration: 3000 });
                localStorage.removeItem("selectedQuestions"); // Clear localStorage on success
                setSelectedQuestions([]); // Clear local state as well
            },
            onError: () => {
                toast.error("Error saving the question.", { duration: 3000 });
            },
        });
    };

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
                    onClick={addToPretest} // Correctly invoke the function
                >
                    Submit Selected
                </button>
            </div>
        </>
    );
}
