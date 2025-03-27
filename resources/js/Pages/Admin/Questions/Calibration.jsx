import { TableContext } from "@/Components/Context/TableContext";
import CalibrationFilters from "@/Components/Filter/CalibrationFilters";
import { AdminContent } from "@/Components/LayoutContent/AdminContent";
import Modal from "@/Components/Modal/Modal";
import Pagination from "@/Components/Pagination";
import CalibrationLogTable from "@/Components/Tables/CalibrationLogTable";
import { CALIBRATION_COLUMN, CALIBRATION_FILTER_COMPONENT } from "@/Library/constants";
import { INITIAL_CALIBRATION_STATE } from "@/Library/filterState";
import { useRequest } from "@/Library/hooks";
import { useState } from "react";
import { toast } from "sonner";

function Calibration({ questions, filters, queryParams = {} }) {
    const [openModal, setOpenModal] = useState(false);

    const {isProcessing,postRequest} = useRequest();
    const recalibrate = () =>{
        postRequest('admin.question.calibrate',{},{
            onSuccess: () =>{
                toast.success('Processing recalibration of questions...',{duration:3000});
                setOpenModal(false);
            },
            onError: (error) => {
                toast.error(error.message ?? "Unable to recalibrate questions.",{duration:3000});
            }
        });
    }
    return (
        <>
            <div className="container-fluid p-5">
                <div className="row justify-content-center">
                    <div className="col mb-3 btn-toolbar justify-content-between">
                        <h2 className="fw-bolder m-0">Question Recalibration</h2>
                        <button
                            type="button"
                            className="btn btn-primary btn-md btn-size btn-toolbar gap-2"
                            onClick={() => setOpenModal(true)}
                        >
                            <span className="material-symbols-outlined">question_exchange</span>
                            <span className="fs-6">Recalibrate Question</span>
                        </button>
                    </div>
                    <div className="row mt-2 p-0">
                        <div className="d-flex flex-column col-12">
                            <h5 className="fw-semibold mb-3">Log History</h5>
                            <TableContext
                                initialState={INITIAL_CALIBRATION_STATE(queryParams)}
                                routeName={"admin.question.calibration"}
                                components={CALIBRATION_FILTER_COMPONENT}
                                column={CALIBRATION_COLUMN}
                            >
                                <CalibrationFilters filters={filters} />
                                <CalibrationLogTable
                                    data={questions.data}
                                    filters={filters}
                                    queryParams={queryParams}
                                />
                            </TableContext>
                            <Pagination links={questions.meta.links} queryParams={queryParams} />
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                show={openModal}
                onClose={() => setOpenModal(false)}
                modalTitle={"Recalibrate Questions"}
            >
                <div className="p-3">
                    <p className="text-dark">
                        You are about to recalibrate questions.
                        Are you sure you want to proceed with this?
                    </p>
                    <div className="d-flex justify-content-end gap-2">
                        <button
                            className="btn btn-secondary"
                            onClick={()=>setOpenModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={() => recalibrate()}
                            disabled={isProcessing}
                        >
                            Proceed
                        </button>
                    </div>
                </div>


            </Modal>
        </>
    );
}


export default AdminContent(Calibration);