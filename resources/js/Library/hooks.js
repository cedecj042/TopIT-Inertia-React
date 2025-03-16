import { router } from "@inertiajs/react";
import { useState } from "react";
import { toast } from "sonner";

export const useColumnVisibility = (initialColumns=[]) => {
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
export const useFilterState = (dispatch) => {
    // Handle filter changes
    const handleFilterChange = (key, value) => {
        dispatch({
            type: 'SET_FILTER',
            payload: {
                [key]: value || "", // Only update the specific filter key
            },
        });
    };

    // Handle clearing filters
    const handleClearFilter = (filterKeys = []) => {
        dispatch({
            type: 'SET_FILTER',
            payload: filterKeys.reduce((acc, key) => {
                acc[key] = ""; // Clear each specified key
                return acc;
            }, {}),
        });
    };

    return {
        handleFilterChange,
        handleClearFilter,
    };
};

export const useSortState = (dispatch) => {
    // Handle sorting changes (field:direction)
    const toggleTableSort = (field) => {
        dispatch({
            type: 'SET_SORT',
            payload: (prevSortState) => {
                const [currentField, currentDirection] = prevSortState.split(":");
                const newDirection =
                    currentField === field
                        ? currentDirection === "asc"
                            ? "desc"
                            : "asc"
                        : "asc";
                return `${field}:${newDirection}`;
            },
        });
    };

    const changeDropdownSort = (field, direction) => {
        dispatch({
            type: 'SET_SORT',
            payload: `${field}:${direction}`,
        });
    };

    const handleClearSort = () => {
        dispatch({ type: 'SET_SORT', payload: ":" });
    };

    return {
        toggleTableSort,
        changeDropdownSort,
        handleClearSort,
    };
};

export const useOtherState = (dispatch) => {
    const handleOtherChange = (key, value) => {
        dispatch({
            type: 'SET_OTHER',
            payload: {
                [key]: value || ""  // Clear the input if value is empty
            },
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        handleOtherChange(name, value);
    };

    const onKeyPress = (key, e) => {
        if (e.key === "Enter") {
            handleOtherChange(key, e.target.value);

        }
    };

    return {
        handleInputChange,
        handleOtherChange,
        onKeyPress
    };
};
export const useDateState = (dispatch) => {
    const handleDateChange = (key, value) => {
        dispatch({
            type: "SET_DATE",
            payload: {
                [key]: value || "", 
            },
        });
    };


    const onDateClear = () => {
        dispatch({
            type: "SET_DATE",
            payload: { from: "", to: "" },
        });
    };

    return {
        handleDateChange,
        onDateClear,
    };
};


export const useRequest = () => {
    const [isProcessing, setIsProcessing] = useState(false);

    // Default callbacks
    const defaultCallbacks = {
        onSuccess: () => {
            toast.success("Request successful", { duration: 3000 });
        },
        onError: (error) => {
            console.log(error)
            toast.error("Unexpected error", { duration: 3000 });
        },
        onFinish: () => {
            setIsProcessing(false);
        },
    };

    // Default Inertia options
    const defaultOptions = {
        // preserveScroll: false,
        // preserveState: false,
        // replace: false,
    };

    // POST request handler
    const postRequest = async (routeName,data, customCallbacks = {}, options = {}) => {
        setIsProcessing(true);
        const requestOptions = { ...defaultOptions, ...options };
        
        try {
            await router.post(route(routeName), data, {
                ...requestOptions,
                onSuccess: (page) => {
                    (customCallbacks.onSuccess || defaultCallbacks.onSuccess)(page);
                },
                onError: (page) => {
                    (customCallbacks.onError || defaultCallbacks.onError)(page);
                },
                onFinish: () => {
                    (customCallbacks.onFinish || defaultCallbacks.onFinish)();
                },
            });
        } catch (error) {
            defaultCallbacks.onError(error); // Handle unexpected errors
            setIsProcessing(false);
        }
    };
    // PUT request handler
    const putRequest = async (routeName, id, data, customCallbacks = {}, options = {}) => {
        setIsProcessing(true);
        const requestOptions = { ...defaultOptions, ...options }; 
        try {
            await router.put(route(routeName, { id }), data, {
                ...requestOptions,
                onSuccess: (page) => {
                    (customCallbacks.onSuccess || defaultCallbacks.onSuccess)(page);
                },
                onError: (page) => {
                    (customCallbacks.onError || defaultCallbacks.onError)(page);
                },
                onFinish: () => {
                    (customCallbacks.onFinish || defaultCallbacks.onFinish)();
                },
            });
        } catch (error) {
            defaultCallbacks.onError(error); // Handle unexpected errors
            setIsProcessing(false);
        }
    };


    // GET request handler
    const getRequest = async (routeName, params = {}, customCallbacks = {}, options = {}) => {
        setIsProcessing(true);
        const requestOptions = { ...defaultOptions, ...options }; // Merge default options with custom options
        // const url = params ? route(routeName, { id: params }) : route(routeName);
        const url = route(routeName, params);
        try {
            await router.get(url, {
                ...requestOptions, // Spread merged options here
                onSuccess: (page) => {
                    (customCallbacks.onSuccess || defaultCallbacks.onSuccess)(page);
                },
                onError: (page) => {
                    (customCallbacks.onError || defaultCallbacks.onError)(page);
                },
                onFinish: () => {
                    (customCallbacks.onFinish || defaultCallbacks.onFinish)();
                },
            });
        } catch (error) {
            defaultCallbacks.onError(error);
            setIsProcessing(false);
        }
    };

    // DELETE request handler
    const deleteRequest = async (routeName, params, customCallbacks = {}, options = {}) => {
        setIsProcessing(true);
        const requestOptions = { ...defaultOptions, ...options }; 

        try {
            await router.delete(route(routeName, params), {
                ...requestOptions, // Spread merged options here
                onSuccess: (page) => {
                    (customCallbacks.onSuccess || defaultCallbacks.onSuccess)(page);
                },
                onError: (page) => {
                    (customCallbacks.onError || defaultCallbacks.onError)(page);
                },
                onFinish: () => {
                    (customCallbacks.onFinish || defaultCallbacks.onFinish)();
                },
            });
        } catch (error) {
            defaultCallbacks.onError(error);
            setIsProcessing(false);
        }
    };

    return { isProcessing, postRequest,putRequest, getRequest, deleteRequest };
};
