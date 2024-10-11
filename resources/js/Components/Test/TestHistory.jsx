import React from "react";

const TestHistory = ({ tests = [] }) => { 

    if (!Array.isArray(tests) || tests.length === 0) {
        console.log('No tests to display');
        return <p>No test history available.</p>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-semibold fs-5">Test History</h5>
                <a href="#" className="text-decoration-none">View all attempts</a>
            </div>
            <div className="row">
                {tests.map((test, index) => {
                    console.log('Rendering test:', test);
                    return (
                        <div key={index} className="col-12 mb-3">
                            <div className="card border-1 rounded-4 my-1 py-1">
                                <div className="card-body py-2 fs-6 d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="card-text mb-0">
                                            <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                                                Started: {test.start_time} | Ended: {test.end_time}
                                            </small>
                                        </p>
                                        <h6 className="card-title mb-2 mt-2" style={{ fontSize: '1.2rem' }}>
                                            {test.updated_at}
                                        </h6>
                                        <span className="badge bg-light text-dark" 
                                              style={{ fontSize: '0.8rem', fontWeight: 'normal', padding: '0.6em 1em' }}>
                                            Score: {test.total_score} / {test.total_items} ({test.percentage}%)
                                        </span>
                                    </div>
                                    <div className="ms-3">
                                        <button className="btn btn-link p-3">
                                            <i className="h3 bi bi-play-circle-fill"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TestHistory;