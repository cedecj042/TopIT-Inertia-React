export const INITIAL_STUDENT_STATE = (queryParams = {}) => ({
    filter: {
        year: queryParams?.year || "",
        school: queryParams?.school || "",
    },
    other: {
        name: queryParams?.name || "",
        items: queryParams?.items || "",
    },
    sort: (() => {
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
    sortState:null
});



export const INITIAL_COURSE_OTHER_STATE = (queryParams = {}) => ({
    title: queryParams?.title || "",
    items: queryParams?.items || "",
});


export const INITIAL_MODULE_FILTER_STATE = (queryParams = {}) => ({
    course: queryParams?.course || "",
});

export const INITIAL_MODULE_OTHER_STATE = (queryParams= {}) =>({
    name: queryParams?.title || "",
    items: queryParams?.items || "",
})
