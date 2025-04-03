import '../../../css/student/test.css';
import { useRequest } from "@/Library/hooks";

export default function TestHistoryList ({ tests = [] }) {
    const isEmpty = !Array.isArray(tests) || tests.length === 0;;
    const {isProcessing,getRequest} = useRequest();
    const handleClick = (id)=>{
        getRequest('test.finish',id,{})
    }
    return (
        <div>
            <div className="row g-1">
                {tests.map((test, index) => (
                    <div key={index} className="col-12">
                        <div className="card border-1 rounded-4 my-1 py-1 clickable"
                            onClick={() => handleClick(test.assessment_id)}
                        >
                            <div className="card-body py-2 fs-6 d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="card-text mb-0">
                                        <small
                                            className="text-muted text-sm"
                                        >
                                            Started: {test.start_time} | Ended:{" "}
                                            {test.end_time}
                                        </small>
                                    </p>
                                    <h6
                                        className="card-title mb-2 mt-2 fw-semibold"
                                        style={{ fontSize: "1.2rem" }}
                                    >
                                        {test.updated_at}
                                    </h6>
                                    <span
                                        className="badge bg-secondary text-light text-sm fw-medium"
                                    >
                                        Score: {test.total_score} /{" "}
                                        {test.total_items} ({test.percentage}%)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {isEmpty && (
                <div
                    className="alert alert-light p-5 no-data d-flex flex-column"
                    role="alert"
                >
                    <img src="/assets/sad-cloud.svg" alt="sad cloud" />
                    <label htmlFor="" className="text-secondary mt-3 text-center">
                        It seems like there is no data available.
                    </label>
                </div>
            )}
        </div>
    );
};
