export const INITIAL_STUDENT_FILTER_STATE = (queryParams = {}) => ({
    year: queryParams?.year || "",
    school: queryParams?.school || "",
    name: queryParams?.name || "",
    items: queryParams?.items || "",
    field: queryParams?.sort_field || "name", 
    direction: queryParams?.sort_direction || "desc", 
});

export const INITIAL_COURSE_FILTER_STATE = (queryParams = {}) => ({
    title: queryParams?.title || "",
    items: queryParams?.items || "",
});
