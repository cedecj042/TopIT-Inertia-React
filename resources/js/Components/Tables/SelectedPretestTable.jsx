import { useColumnVisibility, useRequest } from "@/Library/hooks";
import { useSelectedQuestions } from "../Context/SelectedQuestionsProvider"
import Table from "./Table";
import { PRETEST_COLUMN, QUESTION_COLUMN } from "@/Library/constants";
import { toast } from "sonner";

export default function SelectedPretestTable(){
    const keyField = 'question_id';
    const {selectedQuestions, setSelectedQuestions} = useSelectedQuestions();
    const  {visibleColumns,onColumnChange} =  useColumnVisibility(PRETEST_COLUMN); 
    const  {isProcessing,postRequest} = useRequest();
    const addToPretest = () => {

        const questions = selectedQuestions.map((question) => question.question_id);
        console.log({questions:questions})
        postRequest("admin.pretest.add", {questions:questions}, {
            onSuccess: (success) => {
                console.log(success);
                toast.success("Questions added to Pretest successfully.", { duration: 3000 });
                setSelectedQuestions([]);
            },
            onError: () => {
                toast.error("Error saving the questions.", { duration: 3000 });
            },
        });
    };
    return(
        <>
            <div className="d-inline-flex justify-content-between mt-3">
                <h5 className="fw-semibold mb-3">Selected Questions</h5>
                <button className="btn btn-primary" onClick={addToPretest}>
                    Submit
                </button>
            </div>
            <Table
                data={selectedQuestions}
                visibleColumns={visibleColumns}
                keyField={keyField}
            />

        </>
    )
}