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
        if (queryParams?.sort) {
            const [field, direction] = queryParams.sort.split(":"); // Split sort into field and direction
            return `${field || ""}:${direction || ""}`;
        }
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
        if (queryParams?.sort) {
            const [field, direction] = queryParams.sort.split(":"); // Split sort into field and direction
            return `${field || ""}:${direction || ""}`;
        }
        const field = queryParams?.field || "";
        const direction = queryParams?.direction || "";
        return `${field}:${direction}`;
    })()
});

export const INITIAL_MODULE_STATE = (queryParams = {}) => ({
    
    filterState: {
        course: queryParams?.course || "",
        vectorized: queryParams?.vectorized || "",
    },
    otherState: {
        title: queryParams?.title || "",
        items: queryParams?.items || "",
    },
    sortState:(() => {
        if (queryParams?.sort) {
            const [field, direction] = queryParams.sort.split(":"); // Split sort into field and direction
            return `${field || ""}:${direction || ""}`; // Ensure fallback to empty strings
        }
        const field = queryParams?.field || "";
        const direction = queryParams?.direction || "";
        return `${field}:${direction}`;
    })()
});


export const INITIAL_QUESTION_STATE = (queryParams = {}) => ({
    filterState: {
        course: queryParams?.course || "",
        difficulty: queryParams?.difficulty || "",
        question_type: queryParams?.question_type || "",
        // test_types: queryParams?.question_types || "",
    },
    otherState: {
        question: queryParams?.question || "",
        items: queryParams?.items || "",
    },
    sortState: (() => {
        if (queryParams?.sort) {
            const [field, direction] = queryParams.sort.split(":"); // Split sort into field and direction
            return `${field || ""}:${direction || ""}`;
        }
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
        if (queryParams?.sort) {
            const [field, direction] = queryParams.sort.split(":"); 
            return `${field || ""}:${direction || ""}`;
        }
        const field = queryParams?.field || "";
        const direction = queryParams?.direction || "";
        return `${field}:${direction}`;
    })()
});

export const INITIAL_TEST_STATE = (queryParams = {}) => ({
    filterState: {
        course: queryParams?.course || "",
        test_types: queryParams?.test_types || "",
        status:queryParams?.status || "",
    },
    dateState : {
        from: queryParams?.from || "",
        to: queryParams?.to || "",
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

export const INITIAL_RECALIBRATION_LOG_STATE = (queryParams = {}) => ({
    filterState: {
        course: queryParams?.course || "",
        difficulty: queryParams?.difficulty || "",
        question_type: queryParams?.question_type || "",
        // test_type: queryParams?.test_type || "",
    },
    otherState: {
        question: queryParams?.question || "",
        items: queryParams?.items || "",
    },
    sortState: (() => {
        if (queryParams?.sort) {
            const [field, direction] = queryParams.sort.split(":"); 
            return `${field || ""}:${direction || ""}`;
        }
        const field = queryParams?.field || "";
        const direction = queryParams?.direction || "";
        return `${field}:${direction}`;
    })()
});

export const INITIAL_RECALIBRATION_STATE = (queryParams = {}) => ({
    filterState: {
        status: queryParams?.status || "",
    },
    dateState : {
        from: queryParams?.from || "",
        to: queryParams?.to || "",
    },
    otherState: {
        admin: queryParams?.admin || "",
        items: queryParams?.items || "",
    },
    sortState: (() => {
        const field = queryParams?.field || "";
        const direction = queryParams?.direction || "";
        return `${field}:${direction}`;
    })()
});