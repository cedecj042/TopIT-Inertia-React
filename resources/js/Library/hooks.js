import { useRef, useState } from "react";
import { router } from "@inertiajs/react";

export const useColumnVisibility = (initialColumns) => {
    const [visibleColumns, setVisibleColumns] = useState(initialColumns);

    const onColumnChange = (columnName, isVisible) => {
        const updatedColumns = visibleColumns.map((column) =>
            column.key === columnName
                ? { ...column, visible: isVisible }
                : column
        );
        setVisibleColumns(updatedColumns);
    };

    return {
        visibleColumns,
        onColumnChange,
    };
};

export const useCombinedState = (initialState = {}, routeName, components) => {
    const [state, setState] = useState(initialState);

    const updateUrlWithAllStates = () => {
        const combinedState = {
            ...state.filterState,
            ...state.otherState,
        };

        if (state.sortState !== ":") {
            combinedState.sort = state.sortState;
        }

        const filteredParams = Object.fromEntries(
            Object.entries(combinedState).filter(([key, value]) => value !== "")
        );

        router.get(route(routeName), filteredParams, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            only: components,
        });
    };

    return {
        state,
        setState,
        updateUrlWithAllStates,
    };
};

export const useFilterState = (initialState = {}) => {
    const [filterState, setFilterState] = useState(initialState);

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        const updatedFilters = {
            ...filterState,
            [key]: value || "",
        };
        setFilterState(updatedFilters);
    };
    // Handle clearing filters
    const handleClearFilter = (filterKeys = []) => {
        const clearedFilters = { ...filterState };
        filterKeys.forEach((key) => {
            clearedFilters[key] = "";
        });
        setFilterState(clearedFilters);
    };
    return {
        filterState,
        handleFilterChange,
        handleClearFilter,
    };
};

export const useSortState = (initialState = ":", updateUrlWithAllStates) => {
    const [sortState, setSortState] = useState(initialState);

    // Handle sorting changes (field:direction)
    const changeSort = (field) => {
        const [currentField, currentDirection] = sortState.split(":");

        const newDirection =
            currentField === field
                ? currentDirection === "asc"
                    ? "desc"
                    : "asc"
                : "asc";

        const updatedSort = `${field}:${newDirection}`;
        setSortState(updatedSort);
        updateUrlWithAllStates();
    };

    // Handle clearing the sort state (reset to empty ":")
    const handleClearSort = () => {
        const clearedSort = ":"; // Reset to empty sort (no field, no direction)
        setSortState(clearedSort);
        updateUrlWithAllStates();
    };

    return {
        sortState,
        changeSort,
        handleClearSort,
    };
};

export const useOtherState = (initialOtherState = {}, setState,updateUrlWithAllStates) => {
    const [otherState, setOtherState] = useState(initialOtherState);

    const handleOtherChange = (key, value) => {
        const updatedOther = {
            ...otherState,
            [key]: value || "",
        };
        setOtherState(updatedOther);

        // Update the combined state with the new otherState
        setState((prevState) => ({
            ...prevState,
            otherState: updatedOther,
        }));

        // Optionally call updateUrlWithAllStates to reflect changes in the URL
        updateUrlWithAllStates();
    };

    const handleInputChange = (e) => {
        handleOtherChange(e.target.name, e.target.value);
    };

    const onKeyPress = (key, e) => {
        if (e.key === "Enter") {
            handleOtherChange(key, e.target.value);
        }
    };

    const handleClearInput = (key) => {
        const clearedOtherState = {
            ...otherState,
            [key]: "",
        };
        setOtherState(clearedOtherState);

        // Update the combined state with the cleared otherState
        setState((prevState) => ({
            ...prevState,
            otherState: clearedOtherState,
        }));

        updateUrlWithAllStates();
    };

    return {
        otherState,
        handleOtherChange,
        handleInputChange,
        handleClearInput,
        onKeyPress,
    };
};

