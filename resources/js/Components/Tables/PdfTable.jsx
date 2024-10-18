import { router } from "@inertiajs/react";
import Table from "./Table";
import { toast } from "sonner";
import { useState } from "react";

export default function PdfTable({
    data,
    visibleColumns
}){
    const [isProcessing,setIsProcessing] = useState(false);

    const deletePdf = async (event, pdf_id) => {
        setIsProcessing(true);
        event.stopPropagation();

        await router.delete(route("admin.course.pdf.delete", pdf_id), {
            onSuccess: () => {
                toast.success("Pdf deleted successfully", {
                    duration: 3000,
                });
            },
            onError: (error) => {
                toast.error(error, { duration: 3000 });
            },
            onFinish: () => {
                setIsProcessing(false)
            }
        });
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