import { TableContext } from "@/Components/Context/TableContext";
import { AdminContent } from "@/Components/LayoutContent/AdminContent";
import Pagination from "@/Components/Pagination";
import RecalibrationLogFilters from "@/Components/Filter/RecalibrationLogFilters";
import RecalibrationLogTable from "@/Components/Tables/RecalibrationLogTable";
import { INITIAL_RECALIBRATION_LOG_STATE } from "@/Library/filterState";
import { useRequest } from "@/Library/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { RECALIBRATION_FILTER_COMPONENT, RECALIBRATION_LOG_COLUMN } from "@/Library/constants";

function Logs({recalibration_id,questions,filters, queryParams = {} }) {
    const { isProcessing, getRequest } = useRequest();
    const handleBackClick = async () => {
        getRequest('admin.recalibration.index',{},{});
    };
    return (
        <>
            <div className="container-fluid p-5">
                <div className="row justify-content-center">
                    <div className="col-12 btn-toolbar mb-3">
                        <button
                            className="btn btn-transparent"
                            disabled={isProcessing}
                            onClick={handleBackClick}
                        >
                            <i className="bi bi-arrow-left"></i>
                        </button>
                        <h4 className="fw-semibold mb-0 align-content-center">
                            Log History
                        </h4>
                    </div>
                    <div className="row mt-2 p-0">
                        <div className="d-flex flex-column col-12">
                            <TableContext
                                initialState={INITIAL_RECALIBRATION_LOG_STATE(queryParams)}
                                routeName={"admin.recalibration.logs"}
                                routeId={recalibration_id}
                                components={RECALIBRATION_FILTER_COMPONENT}
                                column={RECALIBRATION_LOG_COLUMN}
                            >
                                <RecalibrationLogFilters filters={filters} />
                                <RecalibrationLogTable
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
        </>
    );
}


export default AdminContent(Logs);