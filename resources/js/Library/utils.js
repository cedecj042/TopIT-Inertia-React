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


export const getColumnValue = (obj, key) => {
    return key.split('.').reduce((nestedObj, keyPart) => {
        return nestedObj && nestedObj[keyPart] !== 'undefined' ? nestedObj[keyPart] : null;
    }, obj);
};

export const dissectContent = (jsonString) => {
    try {
        const contentArray = JSON.parse(jsonString);

        // Map through each item in the array and extract the relevant data
        return contentArray.map((item, index) => {
            return {
                order: item.order || index + 1, // Ensure there's always an order, fallback to index + 1 if missing
                type: item.type || 'Unknown',   // Provide a default type if missing
                text: item.text || 'No text provided', // Provide a default text if missing
            };
        });
    } catch (error) {
        console.error('Invalid JSON format:', error);
        return [];
    }
};

export const extractList = (text) => {
    // Regex to split based on numbers followed by a period or space (e.g., "1.", "2", "3.")
    const regex = /(?=\d+\.\s*|\b\d+\b\s*)/g;

    // Split the text based on the regex and trim each item
    const objectivesArray = text.split(regex).map(item => item.trim());

    // Filter out any empty strings from the array
    return objectivesArray.filter(item => item.length > 0);
};


export const replaceSemicolonsWithCommas = (text) => {
    // Use the replace() function with a global regex to replace all semicolons with commas
    return text.replace(/;/g, ',');
};

export const textToArray = (text) => {
    // First, replace semicolons with commas
    const modifiedText = text.replace(/;/g, ',');

    // Then split the modified text by commas and trim each item
    return modifiedText.split(',').map(item => item.trim());
};

export const formatFilterKey = (filterKey) => {
    return filterKey
        .split('_') // Split the string by underscores
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(' '); // Join the words with spaces
}

export const getStatusClass = (status) => {
    switch (status) {
        case 'Success':
            return 'status-success';
        case 'Processing':
            return 'status-processing';
        case 'Uploading':
            return 'status-uploading';
        case 'Pending':
            return 'status-pending';
        case 'Failed':
            return 'status-failed';
        default:
            return '';
    }
}