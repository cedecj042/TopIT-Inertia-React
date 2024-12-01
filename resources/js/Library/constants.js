export const STUDENT_COLUMN = [
    { key: 'student_id', label: 'ID', sortable: false, visible: true },
    { key: 'name', label: 'Name', sortable: true, visible: true },
    { key: 'school', label: 'School', sortable: true, visible: true },
    { key: 'year', label: 'Year', sortable: true, visible: true },
    { key: 'created_at', label: 'Created At', sortable: true, visible: true },
];

export const COURSE_COLUMN = [
    {key:'course_id',label:'ID', sortable:false,visible:true},
    {key:'title',label:'Title', sortable:false,visible:true},
    {key:'description',label:'Description', sortable:false,visible:true},
    {key:'created_at',label:'Created At', sortable:false,visible:true}
]
export const MODULE_COLUMN = [
    {key:'module_id',label:'ID', sortable:false,visible:true},
    {key:'title',label:'Title', sortable:false,visible:true},
    {key:'course.title',label:'Course', sortable:false,visible:true},
    {key:'created_at',label:'Created At', sortable:false,visible:true}
]

export const PDF_COLUMN = [
    {key:'pdf_id',label:'ID', sortable:false,visible:true},
    {key:'file_name',label:'File Name', sortable:false,visible:true},
    {key:'status',label:'Status', sortable:false,visible:true},
    {key:'uploaded_by',label:'Uploaded By', sortable:false,visible:true},
    {key:'created_at',label:'Created At', sortable:false,visible:true}
]

export const QUESTION_COLUMN = [
    // {key:'question_id',label:'ID', sortable:false,visible:true},
    // {key:'course.title',label:'Course', sortable:false,visible:true},
    {key:'question',label:'Question', sortable:false,visible:true},
    {key:'difficulty.name',label:'Difficulty', sortable:false,visible:true},
    {key:'question_detail.type',label:'Type', sortable:false,visible:true},
    {key:'question_detail.choices',label:'Choices', sortable:false,visible:true},
    {key:'question_detail.answer',label:'Answer', sortable:false,visible:true}
]

export const PRETEST_COLUMN = [
    // {key:'question_id',label:'ID', sortable:false,visible:true},
    {key:'question',label:'Question', sortable:false,visible:true},
    {key:'difficulty.name',label:'Difficulty', sortable:false,visible:true},
    {key:'question_detail.type',label:'Type', sortable:false,visible:true},
    // {key:'question_detail.choices',label:'Choices', sortable:false,visible:true},
    {key:'question_detail.answer',label:'Answer', sortable:false,visible:true},
    {key:'course.title',label:'Course', sortable:false,visible:true},
]

export const ADMIN_COLUMN = [
    {key:'admin_id',label:'ID', sortable:false,visible:true},
    {key:'firstname',label:'First Name', sortable:false,visible:true},
    {key:'lastname',label:'Last Name', sortable:false,visible:true},
    {key:'last_login',label:'Last Login', sortable:false,visible:true},
    {key:'created_at',label:'Created At', sortable:false,visible:true}
]

export const STUDENT_THETA_SCORE_COLUMN = [
    {key:'course.title',label:'Course', sortable:false,visible:true},
    {key:'theta_score',label:'Theta Score', sortable:false,visible:true},
    {key:'created_at',label:'Created At', sortable:false,visible:true},
    {key:'updated_at',label:'Updated At', sortable:false,visible:true}
]


export const STUDENT_FILTER_COMPONENT = ["students","filters","queryParams"]
export const COURSE_FILTER_COMPONENT = ["courses","courses.meta","queryParams"]
export const MODULE_FILTER_COMPONENT = ["modules","modules.meta","filters","queryParams"]
export const QUESTION_FILTER_COMPONENT = ["questions","questions.meta","filters","queryParams"]
export const ADMIN_FILTER_COMPONENT = ["admins","admins.meta","queryParams"]


export const ContentTypes = {
    TABLE: "Tables",
    CODE: "Code",
    FIGURE: "Figures",
    TEXT: "Text",
    HEADER: "Header",
};
