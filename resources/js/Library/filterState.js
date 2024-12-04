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
        course: queryParams?.course || "",
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


export const INITIAL_QUESTION_STATE = (queryParams = {}) => ({
    filterState: {
        course: queryParams?.course || "",
        difficulty: queryParams?.difficulty || "",
        detail_types: queryParams?.detail_types || "",
        // test_types: queryParams?.question_types || "",
    },
    otherState: {
        question: queryParams?.question || "",
        items: queryParams?.items || "",
    },
    sortState: (() => {
        const field = queryParams?.field || "";
        const direction = queryParams?.direction || "";
        return `${field}:${direction}`;
    })()
});

export const INITIAL_ADMIN_STATE = (queryParams = {}) => ({
    filterState: {},
    otherState: {
        items: queryParams?.items || "",
    },
    sortState:(() => {
        const field = queryParams?.field || "";
        const direction = queryParams?.direction || "";
        return `${field}:${direction}`;
    })()
});

export const INITIAL_TEST_STATE = (queryParams = {}) => ({
    filterState: {
        course: queryParams?.course || "",
        test_types: queryParams?.question_types || "",
        month:queryParams?.month || "",
    },
    otherState: {
        items: queryParams?.items || "",
    },
    sortState: (() => {
        const field = queryParams?.field || "";
        const direction = queryParams?.direction || "";
        return `${field}:${direction}`;
    })()
});