import { useColumnVisibility, useRequest } from "@/Library/hooks";
import { useSelectedQuestions } from "../Context/SelectedQuestionsProvider"
import Table from "./Table";
import { PRETEST_COLUMN, QUESTION_COLUMN } from "@/Library/constants";
import { toast } from "sonner";

export default function DeleteQuestionTable(
    { closeModal }
) {
    const keyField = 'question_id';
    const { selectedQuestions, setSelectedQuestions } = useSelectedQuestions();
    const { visibleColumns, onColumnChange } = useColumnVisibility(PRETEST_COLUMN);
    const { isProcessing, postRequest } = useRequest();
    const deleteQuestions = () => {
        const questions = selectedQuestions.map((question) => question.question_id);
        postRequest("admin.question.bulkDelete", { questions: questions }, {
            onSuccess: (success) => {
                toast.success("Questions deleted successfully.", { duration: 3000 });
                setSelectedQuestions([]);
            },
            onError: () => {
                toast.error("Error deleting questions.", { duration: 3000 });
            }
        },{
            preserveState:false,
            preserveQueryParams:false,
        });
    };

    const handleRowClick = (e, rowData) => {
        e.preventDefault();

        const isSelected = selectedQuestions.some(
            (question) => question[keyField] === rowData[keyField]
        );

        const updatedSelection = isSelected
            ? selectedQuestions.filter(
                (question) => question[keyField] !== rowData[keyField]
            )
            : [...selectedQuestions, rowData]; 

        setSelectedQuestions(updatedSelection);
    };

    // Render checkbox state
    const renderCheckbox = (rowData) => (
        <input
            type="checkbox"
            className="form-check-input align-content-center"
            checked={selectedQuestions.some(
                (question) => question[keyField] === rowData[keyField]
            )}
            onChange={(e) => handleRowClick(e, rowData)}
        />
    );

    const allSelected = selectedQuestions.length > 0 && selectedQuestions.every((row) =>
        selectedQuestions.some((q) => q[keyField] === row[keyField])
    );

    const toggleSelectAll = () => {
        if (allSelected) {
            const remaining = selectedQuestions.filter(
                (q) => !selectedQuestions.some((d) => d[keyField] === q[keyField])
            );
            setSelectedQuestions(remaining);
        } else {
            const newSelections = selectedQuestions.filter(
                (row) => !selectedQuestions.some((q) => q[keyField] === row[keyField])
            );
            setSelectedQuestions([...selectedQuestions, ...newSelections]);
        }
    };

    const renderSelectAllCheckbox = () => (
        <>
            <input
                type="checkbox"
                className="form-check-input align-content-center"
                checked={allSelected}
                onChange={toggleSelectAll}
                id="selectAllCheckbox"
            />
        </>
    );

    return (
        <>
            <div className="modal-body">
                <div className="accordion" id="accordianSummary">
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                Summary
                            </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordianSummary">
                            <div className="accordion-body row">
                                <div className="col-12 px-3">
                                    {/* <h5>Selected Question Details</h5> */}
                                    <label>Total per Course:</label>
                                    <div className="d-grid grid-3 mb-3">
                                        {Array.from(new Set(selectedQuestions.map(q => q.course.title))).map((courseTitle, index) => (
                                            <div className="px-3 py-2 bg-light rounded" key={index}>
                                                <label className="text-secondary" style={{ fontSize: '.8rem' }}>{courseTitle}</label>
                                                <p className="m-0">{selectedQuestions.filter(q => q.course.title === courseTitle).length}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <label>Total per Type:</label>
                                    <div className="d-grid grid-3 mb-3">
                                        {Array.from(new Set(selectedQuestions.map(q => q.question_type))).map((type, index) => (
                                            <div className="px-3 py-2 bg-light rounded" key={index}>
                                                <label className="text-secondary" style={{ fontSize: '.8rem' }}>{type}</label>
                                                <p className="m-0">{selectedQuestions.filter(q => q.question_type === type).length > 0 ?
                                                    selectedQuestions.filter(q => q.question_type === type).length :
                                                    null
                                                }</p>
                                            </div>
                                        ))}
                                    </div>
                                    <label>Total per Difficulty:</label>
                                    <div className="d-grid grid-5 mb-3">
                                        {Array.from(new Set(selectedQuestions.map(q => q.difficulty_type))).map((difficulty, index) => (
                                            <div className="px-3 py-2 bg-light rounded" key={index}>
                                                <label className="text-secondary" style={{ fontSize: '.8rem' }}>{difficulty}</label>
                                                <p className="m-0">{selectedQuestions.filter(q => q.difficulty_type === difficulty).length > 0 ?
                                                    selectedQuestions.filter(q => q.difficulty_type === difficulty).length :
                                                    null
                                                }</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Table
                    isSelectable={true}
                    handleClick={handleRowClick}
                    data={selectedQuestions}
                    visibleColumns={visibleColumns}
                    keyField={keyField}
                    isRowClickable={true}
                    renderCheckbox={renderCheckbox}
                    renderSelectAllCheckbox={renderSelectAllCheckbox}
                />
            </div>
            <div className="modal-footer">
                <div className="d-inline-flex justify-content-end gap-2 mt-3">
                    <button className="btn btn-secondary" onClick={closeModal}>
                        Cancel
                    </button>
                    <button className="btn btn-danger" onClick={deleteQuestions} disabled={isProcessing}>
                        Delete Questions
                    </button>
                </div>
            </div>

        </>
    )
}