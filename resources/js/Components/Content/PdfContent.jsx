import { useRequest } from "@/Library/hooks";
import '../../../css/admin/status.css';
import { getStatusClass } from "@/Library/utils";

export default function PdfContent({ pdf }) {
    const { getRequest, isProcessing } = useRequest();
    const handleClick = (course_id) => {
        getRequest('admin.course.detail', course_id, {});
    }

    const checkStatus = (item) => {
        return ["Pending", "Failed", "Processing"].includes(item.status);
    }
    return (
        <>
            {pdf.length > 0 ? (
                pdf.map((item, index) => (
                    <div key={index} className="col-12">
                        <div className={`card border-0 rounded-4 my-1 py-1 clickable shadow-sm bg-light-subtle ${checkStatus(item) ? " default " : " pointer hover-highlight"}`}
                            onClick={() => handleClick(item.course.course_id, item.status)}
                        >
                            <div className="card-body py-2 fs-6 d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="card-text mb-0">
                                        <small
                                            className="text-muted text-sm"
                                        >
                                            Created At: {item.created_at} | Updated At:{" "}
                                            {item.updated_at}
                                        </small>
                                    </p>
                                    <h6
                                        className="card-title mb-2 mt-2"
                                        style={{ fontSize: "1.2rem" }}
                                    >
                                        {item.file_name}
                                    </h6>
                                    <label className={`badge text-sm fw-medium ${getStatusClass(item.status)}`}>
                                        Status: <span>{item.status}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                ))) : (
                <div className="text-center text-muted text-secondary p-4 border rounded bg-light-subtle">No uploaded PDFs yet.</div>
            )}
        </>
    );
}