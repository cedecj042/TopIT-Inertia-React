
export const useCombinedState = (
    initialFilterState = {},
    initialSortState = ":",
    initialOtherState = {},
    routeName,
    components
) => {
    const [filterState, setFilterState] = useState(initialFilterState);
    const [sortState, setSortState] = useState(initialSortState);
    const [otherState, setOtherState] = useState(initialOtherState);


    const updateUrlWithAllStates = (sortState, filterState, otherState) => {
        const combinedState = {
            ...filterState,
            ...otherState,
        };

        if (sortState !== ":") {
            combinedState.sort = sortState;
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

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        const updatedFilters = {
            ...filterState,
            [key]: value || "",
        };
        setFilterState(updatedFilters);
        updateUrlWithAllStates(sortState, updatedFilters, otherState);
    };

    // Handle clearing filters
    const handleClearFilter = (filterKeys = []) => {
        const clearedFilters = { ...filterState };
        filterKeys.forEach((key) => {
            clearedFilters[key] = "";
        });
        setFilterState(clearedFilters);
        updateUrlWithAllStates(sortState, clearedFilters, otherState);
    };

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
        updateUrlWithAllStates(updatedSort, filterState, otherState);
    };

    // Handle clearing the sort state (reset to empty ":")
    const handleClearSort = () => {
        const clearedSort = ":"; // Reset to empty sort (no field, no direction)
        setSortState(clearedSort);
        updateUrlWithAllStates(clearedSort, filterState, otherState);
    };

    // Handle other changes
    const handleOtherChange = (key, value) => {
        const updatedOther = {
            ...otherState,
            [key]: value || "",
        };
        setOtherState(updatedOther);
        updateUrlWithAllStates(sortState, filterState, updatedOther);
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
        const clearedFilters = {
            ...otherState,
            [key]: "",
        };
        setOtherState(clearedFilters);
        updateUrlWithAllStates(sortState, filterState, clearedFilters);
    };

    return {
        // States
        filterState,
        sortState,
        otherState,
        // Handlers for filter
        handleFilterChange,
        handleClearFilter,
        // Handlers for sort
        changeSort,
        handleClearSort,
        // Handlers for other
        handleOtherChange,
        handleInputChange,
        handleClearInput,
        onKeyPress,
    };
};

/*

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

export const useFilterState = (
    initialState = {},
    setState
) => {
    const [filterState, setFilterState] = useState(initialState);

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        const updatedFilters = {
            ...filterState,
            [key]: value || "",
        };
        setFilterState(updatedFilters);

        // Update the combined state with the new filterState
        setState((prevState) => ({
            ...prevState,
            filterState: updatedFilters,
        }));
    };

    // Handle clearing filters
    const handleClearFilter = (filterKeys = []) => {
        const clearedFilters = { ...filterState };
        filterKeys.forEach((key) => {
            clearedFilters[key] = "";
        });
        setFilterState(clearedFilters);

        // Update the combined state with the new filterState
        setState((prevState) => ({
            ...prevState,
            filterState: clearedFilters,
        }));
    };

    return {
        filterState,
        handleFilterChange,
        handleClearFilter,
    };
};

export const useSortState = (
    initialState = ":",
    setState
) => {
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

        // Update the combined state with the new sortState
        setState((prevState) => ({
            ...prevState,
            sortState: updatedSort,
        }));
    };

    // Handle clearing the sort state (reset to empty ":")
    const handleClearSort = () => {
        const clearedSort = ":"; // Reset to empty sort (no field, no direction)
        setSortState(clearedSort);

        // Update the combined state with the new sortState
        setState((prevState) => ({
            ...prevState,
            sortState: clearedSort,
        }));
    };

    return {
        sortState,
        changeSort,
        handleClearSort,
    };
};

export const useOtherState = (
    initialOtherState = {},
    setState
) => {
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
    };

    const handleInputChange = (e) => {
        handleOtherChange(e.target.name, e.target.value);
    };

    const onKeyPress = (key, e) => {
        if (e.key === "Enter") {
            handleOtherChange(key, e.target.value);
        }
    };

    return {
        otherState,
        handleOtherChange,
        handleInputChange,
        onKeyPress,
    };
};

*/

/*

*/

/*



*/