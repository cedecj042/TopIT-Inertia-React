import { router } from "@inertiajs/react";
import Table from "./Table";

export default function PdfTable({
    data,
    visibleColumns
}){
    const deletePdf = (event, pdf_id) => {
        event.stopPropagation();

        router.delete(route("admin.pdf.delete", pdf_id), {
            onSuccess: () => {
                toast.success("Pdf deleted successfully", {
                    duration: 3000,
                });
            },
            onError: (error) => {
                toast.error(error, { duration: 3000 });
            },
        });
    };
    
    const renderActions = (rowData) => {
        return (
            <button
                type="button"
                onClick={(e) => deletePdf(e, rowData.pdf_id)}
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