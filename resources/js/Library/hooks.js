import { useState } from "react";
import { router } from "@inertiajs/react";

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


export const useFilters = (filterState,setFilterState,routeName, components) => {
    const updateUrlWithFilters = (filters) => {
        const filteredParams = Object.fromEntries(
            Object.entries(filters).filter(([k, v]) => v !== "")
        );

        router.get(route(routeName), filteredParams, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            only: components,
        });
    };

    const handleFilterChange = (key, value) => {
        const updatedFilters = {
            ...filterState,
            [key]: value || "",
        };

        setFilterState(updatedFilters);
        updateUrlWithFilters(updatedFilters);
    };

    const handleClearInput = (key) => {
        handleFilterChange(key, "");
    };

    const handleInputChange = (e) => {
        handleFilterChange(e.target.name, e.target.value);
    };

    const onKeyPress = (key, e) => {
        if (e.key === "Enter") {
            handleFilterChange(key, e.target.value);
        }
    };
    const handleClearFilter = (filterKeys = []) => {
        const clearedFilters = { ...filterState };

        filterKeys.forEach((key) => {
            clearedFilters[key] = "";
        });
    
        setFilterState(clearedFilters);
        updateUrlWithFilters(clearedFilters);
    };

    return {
        filterState,
        handleFilterChange,
        handleClearInput,
        handleInputChange,
        onKeyPress,
        handleClearFilter
    };
};
