
export default function AssessmentTypeModal({ types = [],close,openEditModal}) {
    return (
        <>
            <div className="modal-body">
                {types.length > 0 ? (
                    types.map((type, index) => (
                        <div key={index} className="col-12">
                            <div className="card rounded-4 my-1 py-1 shadow-sm bg-light-subtle border default">
                                <div className="card-body py-2 fs-6 d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6
                                            className="card-title mb-2 mt-2"
                                            style={{ fontSize: "1.2rem" }}
                                        >
                                            {type.type}
                                        </h6>
                                        <label className="badge text-dark text-md fw-normal px-0">
                                            Total Questions per Course: <span className="fw-bold fs-6 py-2">{type.total_questions}</span>
                                        </label>
                                    </div>
                                    <div>
                                        <h5 className={`text-center ${!type.evenly_distributed ? "text-danger" : "text-success"}`}>{!type.evenly_distributed ? `No` : `Yes`}</h5>
                                        <label htmlFor="" className="badge text-dark fw-normal">Evenly Distributed <br/>across difficulty</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) :
                    (
                        <p>Missing types</p>
                    )}
            </div>
            <div className="modal-footer">
                <button className='btn btn-secondary' onClick={close}>Cancel</button>
                <button className='btn btn-primary' onClick={openEditModal}>Edit</button>
            </div>
        </>
    );
}