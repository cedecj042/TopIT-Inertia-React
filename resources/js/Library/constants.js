export const STUDENT_COLUMN = {
    all:true,
    student_id: true,
    firstname: true,
    lastname: true,
    school: true,
    year: true,
    created_at: true,
}

export const COURSE_COLUMN = {
    course_id: true,
    title: true,
    description: true,
    created_at: true,
}

export const INITIAL_STUDENT_FILTER_STATE = (queryParams = {}) => ({
    year: queryParams?.year || "",
    school: queryParams?.school || "",
    name: queryParams?.name || "",
    items: queryParams?.items || "",
});