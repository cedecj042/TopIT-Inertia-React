import Table from "./Table";
import { useRequest } from "@/Library/hooks";

export default function PdfTable({
    data,
    visibleColumns
}){
    const {isProcessing,deleteRequest} = useRequest();

    const deletePdf = async (event, pdf_id) => {
        event.stopPropagation();

        await deleteRequest("admin.course.pdf.delete", pdf_id, {});
    };
    
    
    const renderActions = (rowData) => {
        return (
            <button
                type="button"
                onClick={(e) => deletePdf(e, rowData.pdf_id)}
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