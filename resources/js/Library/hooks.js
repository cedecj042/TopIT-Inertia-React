import { useState } from "react";

export const useColumnVisibility = (initialColumns) => {
    const [visibleColumns, setVisibleColumns] = useState(initialColumns);

    const onColumnChange = (columnName, isVisible) => {
        if (columnName === "all") {
            // Update visibility for all columns
            const updatedColumns = Object.keys(visibleColumns).reduce((columns, key) => {
                columns[key] = isVisible;
                return columns;
            }, {});
            setVisibleColumns(updatedColumns);
        } else {
            // Update visibility for specific column
            const updatedColumns = {
                ...visibleColumns,
                [columnName]: isVisible,
            };
    
            // Automatically update the "all" checkbox based on other columns
            const allChecked = Object.keys(initialColumns)
                .filter((key) => key !== "all")
                .every((key) => updatedColumns[key]); // Check if all other columns are true
    
            updatedColumns["all"] = allChecked; // Update "all" checkbox
    
            setVisibleColumns(updatedColumns);
        }
    };

    return {
        visibleColumns,
        onColumnChange,
    };
};
