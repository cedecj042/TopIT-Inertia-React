export const INITIAL_STUDENT_STATE = (queryParams = {}) => ({
    filterState: {
        year: queryParams?.year || "",
        school: queryParams?.school || "",
    },
    otherState: {
        name: queryParams?.name || "",
        items: queryParams?.items || "",
    },
    sortState: (() => {
        const field = queryParams?.field || "";
        const direction = queryParams?.direction || "";
        return `${field}:${direction}`;
    })()
});


export const INITIAL_COURSE_STATE = (queryParams = {}) => ({
    filterState: {},
    otherState: {
        title: queryParams?.title || "",
        items: queryParams?.items || "",
    },
    sortState:(() => {
        const field = queryParams?.field || "";
        const direction = queryParams?.direction || "";
        return `${field}:${direction}`;
    })()
});

export const INITIAL_MODULE_STATE = (queryParams = {}) => ({
    filterState: {
        year: queryParams?.course || "",
    },
    otherState: {
        title: queryParams?.title || "",
        items: queryParams?.items || "",
    },
    sortState:(() => {
        const field = queryParams?.field || "";
        const direction = queryParams?.direction || "";
        return `${field}:${direction}`;
    })()
});




export const INITIAL_MODULE_FILTER_STATE = (queryParams = {}) => ({
    course: queryParams?.course || "",
});

export const INITIAL_MODULE_OTHER_STATE = (queryParams= {}) =>({
    name: queryParams?.title || "",
    items: queryParams?.items || "",
})
