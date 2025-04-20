import Table from "./Table";
import { useRequest } from "@/Library/hooks";

export default function PdfTable({
    data,
    visibleColumns
}){
    const {isProcessing,deleteRequest} = useRequest();

    const deletePdf = (pdf_id) => {
        // e.stopPropagation();

        deleteRequest("admin.course.pdf.delete", pdf_id, {
            onError: (error) => {
                toast.error(error.error ?? "Failed to delete the PDF. Please try again.", { duration: 3000 });
            },
        });
    };
    
    
    const renderActions = (rowData) => {
        return (
            <button
                type="button"
                onClick={(e) => deletePdf(rowData.pdf_id)}
                disabled={isProcessing}
                className="btn btn-outline-danger d-flex justify-content-center"
            >
                <span className="material-symbols-outlined">delete</span> Delete Pdf
            </button>
        );
    };

    return(
        <Table
            data={data}
            visibleColumns={visibleColumns}
            renderActions={renderActions}
            keyField="pdf_id"
        />
    )
}