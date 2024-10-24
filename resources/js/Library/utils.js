import { router } from "@inertiajs/react";

export const capitalizeFirstLetter = (string) => {
    return string
        .replace(/_/g, ' ')          // Replace underscores with spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
};

export const areFiltersApplied = (initialState, currentState) => {
    return Object.keys(initialState).some((key) => initialState[key] !== currentState[key]);
};

export const splitSortState = (sortState) => {
    if (!sortState || typeof sortState !== 'string') {
        // If sortState is null, undefined, or not a string, return default values
        return { field: null, direction: null };
    }

    const [field = null, direction = null] = sortState.split(':');

    return { field, direction };
};
