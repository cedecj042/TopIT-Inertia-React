

import { createContext, useCallback, useEffect, useReducer, useRef } from "react";
import { router } from "@inertiajs/react";
import { useColumnVisibility, useRequest } from "@/Library/hooks";

const ContextProvider = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case "SET_FILTER":
            return {
                ...state,
                filterState: {
                    ...state.filterState,
                    ...action.payload, 
                },
            };
        case "SET_SORT":
            const newSortState =
                typeof action.payload === 'function'
                    ? action.payload(state.sortState) 
                    : action.payload; 

            return {
                ...state,
                sortState: newSortState, // Update the state with the computed sort string
            };
        case "SET_OTHER":
            return {
                ...state,
                otherState: {
                    ...state.otherState,
                    ...action.payload, // Merging the new payload with the existing otherState
                },
            };
        case "SET_DATE":
            return {
                ...state,
                dateState: {
                    ...state.dateState,
                    ...action.payload,
                },
            };
        default:
            return state;
    }
};

export const TableContext = ({
    children,
    initialState,
    routeName,
    routeId = null,
    components,
    column = []
}) => {
    const {visibleColumns, onColumnChange} = useColumnVisibility(column);
    const [state, dispatch] = useReducer(reducer, initialState);
    const prevStateRef = useRef(state);
    const updateUrl = useCallback(() => {
        const combinedState = {
            ...state.filterState,
            ...state.otherState,
            ...state.dateState,
        };
    
        if (state.sortState !== ":") {
            combinedState.sort = state.sortState;
        }
    
        if (JSON.stringify(state) !== JSON.stringify(prevStateRef.current)) {
            const filteredParams = Object.fromEntries(
                Object.entries(combinedState).filter(([key, value]) => value !== "")
            );
    
            router.get(route(routeName, routeId ? { id:routeId } : {}), filteredParams, {
                preserveScroll: true,
                preserveState: true,
                replace: true,
                only: components,
            });
    
            prevStateRef.current = state;
        }
    }, [state, routeName, components]);
    

    useEffect(() => {
        updateUrl();
    }, [state.filterState,state.sortState,state.otherState,state.dateState]); 

    return (
        <ContextProvider.Provider
            value={{ state, dispatch, visibleColumns, onColumnChange }}
        >
            {children}
        </ContextProvider.Provider>
    );
};

export default ContextProvider;