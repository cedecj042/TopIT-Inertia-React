export const INITIAL_STUDENT_FILTER_STATE = (queryParams = {}) => ({
    year: queryParams?.year || "",
    school: queryParams?.school || "",
});

export const INITIAL_STUDENT_OTHER_STATE = (queryParams= {}) =>({
    name: queryParams?.name || "",
    items: queryParams?.items || "",
})
export const INITIAL_STUDENT_SORT_STATE = (queryParams = {}) => {
    const field = queryParams?.field || "";
    const direction = queryParams?.direction || "";
    return `${field}:${direction}`;
};


export const INITIAL_COURSE_OTHER_STATE = (queryParams = {}) => ({
    title: queryParams?.title || "",
    items: queryParams?.items || "",
});

