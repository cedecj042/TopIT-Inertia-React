import { useRequest } from "@/Library/hooks";
import '../../../css/student/test.css';
import Modal from "../Modal/Modal";
import { useState } from "react";
import AssessmentDetailsModal from "./AssessmentDetails";

export default function AssessmentList({ tests = [] }) {
    const isEmpty = !Array.isArray(tests) || tests.length === 0;;
    const { isProcessing, getRequest } = useRequest();
    // const handleClick = (id) => { getRequest('admin.assessments.show', id, {}) }

    const [openModal, setOpenModal]= useState(false);
    const [selectedTest, setSelectedTest] = useState(null);
    const handleClick = (test) =>{
        setOpenModal(true);
        setSelectedTest(test);
    }
    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedTest(null); 
    };
    return (
        <div>
            {!isEmpty ? (
                <div className="row g-1">
                    {tests.map((test, index) => (
                        <div key={index} className="col-12">
                            <div className="card border-1 rounded-4 my-1 py-1 clickable w-100"
                                onClick={() => handleClick(test)}
                            >
                                <div className="card-body px-4 py-2 d-flex align-items-center w-100">
                                    <div className="row  flex-grow-1">
                                        <div className="d-flex flex-row justify-content-between w-100">
                                            <div>
                                                <p className="mb-0">
                                                    <small
                                                        className="text-muted text-sm"
                                                    >
                                                        {test.created_at}: {test.start_time} - {test.end_time}
                                                    </small>
                                                </p>
                                                <h6
                                                    className="card-title my-2 align-content-center"
                                                >
                                                    Assessment #{test.assessment_id}
                                                </h6>
                                                <div
                                                    className="d-flex flex-row flex-wrap gap-2"
                                                >
                                                    {test.courses.length > 0 && (
                                                        test.courses.map((course, index) => (
                                                            <span
                                                                key={course + "_" + index}
                                                                className="badge align-content-center text-secondary fw-semibold rounded-pill bg-light"
                                                            >
                                                                {course.length > 25 ? course.slice(0, 25) + '...' : course}
                                                            </span>
                                                        ))
                                                    )}

                                                </div>
                                            </div>
                                            <div className="d-flex flex-column justify-content-center gap-1 list-status">
                                                <small
                                                    className="text-muted text-sm"
                                                >
                                                    {test.type}
                                                </small>
                                                <h6
                                                    className="align-content-center fw-semibold text-success p-0"
                                                >
                                                    {Math.floor(test.percentage)}%
                                                </h6>
                                                <span
                                                    className="badge align-content-center text-start text-dark text-muted p-0"
                                                >
                                                    {test.total_score} /{" "}
                                                    {test.total_items}
                                                </span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
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
            <Modal
                show={openModal}
                onClose={handleCloseModal}
                modalTitle={`Assessment Details - ID #${selectedTest?.assessment_id ?? ''}`}
                modalSize="modal-xl" 
            >
                {/* Render the details component only when a test is selected */}
                {selectedTest && <AssessmentDetailsModal test={selectedTest} />}
            </Modal>

        </div>
    );
};
