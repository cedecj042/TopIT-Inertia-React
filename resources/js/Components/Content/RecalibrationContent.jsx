import { useRequest } from "@/Library/hooks";
import '../../../css/admin/status.css';
import { getStatusClass } from "@/Library/utils";

export default function RecalibrationContent({ recalibration }) {
    const { getRequest, isProcessing } = useRequest();
    const handleClick = (recalibration_id,status) => {
        if (status=== 'Success') {
            getRequest('admin.recalibration.logs', recalibration_id, {});
        }
    }
    const checkStatus = (item) =>{
        return ["Pending", "Failed", "Processing"].includes(item.status);
    }
    return (
        <>
            {recalibration.length > 0 ? (
                recalibration.map((item, index) => (
                    <div key={index} className="col-12">
                        <div className={`card border-0 rounded-4 my-1 py-1 clickable shadow-sm bg-light-subtle ${checkStatus(item) ?  " default " : " pointer hover-highlight"}`}
                            onClick={() => handleClick(item.recalibration_id, item.status)}
                        >
                            <div className="card-body py-3 px-4 fs-6 d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="card-text mb-0">
                                        <small
                                            className="text-muted text-sm "
                                        >
                                            Created At: {item.created_at} | Updated At:{" "}
                                            {item.updated_at}
                                        </small>
                                    </p>
                                    <h6
                                        className="card-title mb-2 mt-2"
                                        style={{ fontSize: "1.2rem" }}
                                    >
                                        Recalibration #{item.recalibration_id} - Total of {item.total_question_logs}
                                    </h6>
                                    <p className={`badge text-sm fw-medium text-secondary p-0`}>
                                        Recalibrated by: <span>{item.recalibrated_by}</span>
                                    </p>
                                </div>
                                <div>
                                    <h5 className={`badge !text-lg fw-medium ${getStatusClass(item.status)}`}>
                                        <span>{item.status}</span>
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center text-muted text-secondary p-4 border rounded bg-light-subtle">
                    <img src="" alt="" />
                    <p>No recalibrated questions yet.</p>
                </div>
            )}
        </>
    );
}