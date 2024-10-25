import { router } from "@inertiajs/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

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
    const changeSort = (field) => {
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

    // Handle clearing the sort state
    const handleClearSort = () => {
        dispatch({ type: 'SET_SORT', payload: ":" }); // Reset to empty state
    };

    return {
        changeSort,
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

export const useRequest = () => {
    const [isProcessing, setIsProcessing] = useState(false);

     // Predefined default callbacks
     const defaultCallbacks = {
        onSuccess: (page) => {
            toast.success(page.props.flash.success, { duration: 3000 });
        },
        onError: (page) => {
            toast.error(page.props.flash.error, { duration: 3000 });
        },
        onFinish: () => {
            setIsProcessing(false);
        },
    };

    // POST request handler
    const postRequest = async (routeName, data, customCallbacks = {}) => {
        setIsProcessing(true);
        try {
            await router.post(route(routeName), data, {
                onSuccess: (page) => {
                    // Merge default onSuccess with custom onSuccess (if provided)
                    (customCallbacks.onSuccess || defaultCallbacks.onSuccess)(page);
                },
                onError: (page) => {
                    // Merge default onError with custom onError (if provided)
                    (customCallbacks.onError || defaultCallbacks.onError)(page);
                },
                onFinish: () => {
                    // Merge default onFinish with custom onFinish (if provided)
                    (customCallbacks.onFinish || defaultCallbacks.onFinish)();
                },
            });
        } catch (error) {
            defaultCallbacks.onError(error); // Handle unexpected errors
            setIsProcessing(false);
        }
    };

    // GET request handler
    const getRequest = async (routeName, params = null, customCallbacks = {}) => {
        setIsProcessing(true);
        try {
            // Use params only if they are not null or undefined
            const url = params ? route(routeName, {id:params}) : route(routeName);
    
            await router.get(url, {
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
    const deleteRequest = async (routeName, data, customCallbacks = {}) => {
        setIsProcessing(true);
        try {
            await router.delete(route(routeName,data) , {
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

    return { isProcessing, postRequest, getRequest, deleteRequest };
};