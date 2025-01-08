import { useRequest } from "@/Library/hooks";
import '../../../css/admin/status.css';
import { getStatusClass } from "@/Library/utils";

export default function PdfContent({ pdf }) {
    console.log(pdf);
    const { getRequest, isProcessing } = useRequest();
    const handleClick = (course_id) => {
        getRequest('admin.course.detail', course_id, {});
    }
    if (pdf.length === 0) {
        return (
            <div className="text-center text-muted text-secondary p-4 border rounded bg-light-subtle">No uploaded PDFs yet.</div>
        );
    }

    return (
        <>
            {pdf.map((item, index) => (
                <div key={index} className="col-12">
                    <div className="card border-0 rounded-4 my-1 py-1 clickable shadow-sm bg-light-subtle"
                        onClick={() => handleClick(item.course.course_id)}
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
            ))}
        </>
    );
}