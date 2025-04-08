export const STUDENT_COLUMN = [
    { key: 'student_id', label: 'ID', sortable: false, visible: true },
    { key: 'name', label: 'Name', sortable: true, visible: true },
    { key: 'school', label: 'School', sortable: true, visible: true },
    { key: 'year', label: 'Year', sortable: true, visible: true },
    { key: 'created_at', label: 'Created At', sortable: true, visible: true },
];

export const COURSE_COLUMN = [
    { key: 'course_id', label: 'ID', sortable: false, visible: true },
    { key: 'title', label: 'Title', sortable: true, visible: true },
    { key: 'description', label: 'Description', sortable: false, visible: true },
    { key: 'created_at', label: 'Created At', sortable: true, visible: true }
]
export const MODULE_COLUMN = [
    { key: 'module_id', label: 'ID', sortable: false, visible: true },
    { key: 'title', label: 'Title', sortable: true, visible: true },
    { key: 'course.title', label: 'Course', sortable: false, visible: true },
    { key: 'vectorized', label: 'Vectorized', sortable: false, visible: false },
    { key: 'created_at', label: 'Created At', sortable: true, visible: true }
]

export const PDF_COLUMN = [
    { key: 'pdf_id', label: 'ID', sortable: false, visible: true },
    { key: 'file_name', label: 'File Name', sortable: false, visible: true },
    { key: 'status', label: 'Status', sortable: false, visible: true },
    { key: 'uploaded_by', label: 'Uploaded By', sortable: false, visible: true },
    { key: 'created_at', label: 'Created At', sortable: false, visible: true }
]

export const QUESTION_COLUMN = [
    // {key:'question_id',label:'ID', sortable:false,visible:true},
    { key: 'course.title', label: 'Course', sortable: false, visible: true },
    { key: 'question', label: 'Question', sortable: false, visible: true },
    { key: 'question_type', label: 'Type', sortable: false, visible: true },
    { key: 'choices', label: 'Choices', sortable: false, visible: true },
    { key: 'answer', label: 'Answer', sortable: false, visible: true },
    { key: 'difficulty_type', label: 'Difficulty', sortable: false, visible: true },
    { key: 'difficulty_value', label: 'Difficulty Value', sortable: true, visible: false },
    { key: 'discrimination_index', label: 'Discrimination', sortable: true, visible: false },
    { key: 'total_count', label: 'No. of Responses', sortable: true, visible: true }

]

export const RECALIBRATION_LOG_COLUMN = [
    // {key:'question_id',label:'ID', sortable:false,visible:true},
    { key: 'question', label: 'Question', sortable: false, visible: true },
    { key: 'difficulty_type', label: 'Difficulty', sortable: false, visible: true },
    { key: 'difficulty_value', label: 'Difficulty Value', sortable: false, visible: true },
    { key: 'discrimination_index', label: 'Discrimination', sortable: true, visible: true },
    { key: 'total_count', label: 'No. of Responses', sortable: true, visible: true },
    { key: 'updated_at', label: 'Updated At', sortable: true, visible: true }
]

export const PRETEST_COLUMN = [
    // {key:'question_id',label:'ID', sortable:false,visible:true},
    { key: 'course.title', label: 'Course', sortable: false, visible: true },
    { key: 'question', label: 'Question', sortable: false, visible: true },
    { key: 'difficulty_type', label: 'Difficulty', sortable: false, visible: true },
    { key: 'question_type', label: 'Type', sortable: false, visible: true },
    { key: 'difficulty_value', label: 'Difficulty Value', sortable: true, visible: false },
    { key: 'discrimination_index', label: 'Discrimination', sortable: true, visible: false },
    // {key:'choices',label:'Choices', sortable:false,visible:true},
    { key: 'answer', label: 'Answer', sortable: false, visible: true },
]

export const ADMIN_COLUMN = [
    { key: 'admin_id', label: 'ID', sortable: false, visible: true },
    { key: 'firstname', label: 'First Name', sortable: false, visible: true },
    { key: 'lastname', label: 'Last Name', sortable: false, visible: true },
    { key: 'last_login', label: 'Last Login', sortable: false, visible: true },
    { key: 'created_at', label: 'Created At', sortable: false, visible: true }
]

export const STUDENT_THETA_SCORE_COLUMN = [
    {key:'course.title',label:'Course', sortable:false,visible:true},
    {key:'theta_score',label:'Ability Score', sortable:false,visible:true},
    {key:'created_at',label:'Created At', sortable:false,visible:true},
    {key:'updated_at',label:'Updated At', sortable:false,visible:true}
]


export const STUDENT_FILTER_COMPONENT = ["students", "students.meta", "filters", "queryParams"]
export const COURSE_FILTER_COMPONENT = ["courses", "courses.meta", "queryParams"]
export const MODULE_FILTER_COMPONENT = ["modules", "modules.meta", "filters", "queryParams"]
export const QUESTION_FILTER_COMPONENT = ["questions", "questions.meta", "filters", "queryParams"]
export const RECALIBRATION_FILTER_COMPONENT = ["questions", "questions.meta", "filters", "queryParams"]
export const ADMIN_FILTER_COMPONENT = ["admins", "admins.meta", "queryParams"]


export const ContentTypes = {
    TABLE: "Tables",
    CODE: "Code",
    FIGURE: "Figures",
    TEXT: "Text",
    HEADER: "Header",
};


export const TEST_SORTING_OPTIONS = [
    { value: "created_at:asc", label: "Date (Oldest)" },
    { value: "created_at:desc", label: "Date (Latest)" },
    { value: "total_score:asc", label: "Total Score (Lowest)" },
    { value: "total_score:desc", label: "Total Score (Highest)" },
    { value: "total_items:asc", label: "Total Items (Lowest)" },
    { value: "total_items:desc", label: "Total Items (Highest)" },

];
export const RECALIBRATION_SORTING_OPTIONS = [
    { value: "created_at:asc", label: "Date (Latest)" },
    { value: "created_at:desc", label: "Date (Oldest)" },
    { value: "total_question_logs:asc", label: "Total Questions (Highest)" },
    { value: "total_question_logs:desc", label: "Total Questions (Lowest)" },
];