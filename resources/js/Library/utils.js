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
    if (!sortState) {
        return { field: null, direction: null }; // Default values if sortState is null
    }
    const [field, direction] = sortState.split(':');
    return { field, direction };
};
