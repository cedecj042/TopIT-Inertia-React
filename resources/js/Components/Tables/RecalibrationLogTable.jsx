import { useContext, useState } from "react";
import ContextProvider from "../Context/TableContext";
import Table from "./Table";
import { useRequest, useSortState } from "@/Library/hooks";
import Modal from "../Modal/Modal";
import ColumnSortable from "../Filter/Filters/ColumnSortable";
import { getColumnValue } from "@/Library/utils";
import ViewLogModal from "../Modal/ViewLogModal";


export default function RecalibrationLogTable({
    data,
    filters,
    queryParams,
}) {
    const { state, dispatch, visibleColumns } = useContext(ContextProvider);
    const keyField = "question_id";
    const { toggleTableSort } = useSortState(dispatch);
    const { isProcessing, postRequest, deleteRequest } = useRequest();
    const [selectedLog, setSelectedLog] = useState();
    const [activeModal, setActiveModal] = useState(null);

    const openModal = (modalType, log) => {
        setSelectedLog(log);
        setActiveModal(modalType);
    };
    const closeModal = () => {
        setActiveModal(null);
        setSelectedLog(null);
    };

    const viewQuestion = (e, rowData) => {
        e.preventDefault();
        openModal("view", rowData);
    };

    return (
        <>
            <div className="table-header overflow-x-auto">
                <table className="table students-table">
                    <thead>
                        <tr>
                            {visibleColumns.map((column) => {
                                if (column.visible) {
                                    return column.sortable ? (
                                        <ColumnSortable
                                            key={column.key}
                                            fieldName={column.key}
                                            label={column.label}
                                            sortState={state.sortState}
                                            changeSort={toggleTableSort}
                                        />
                                    ) : (
                                        <th key={column.key} className="text-left">
                                            {column.label}
                                        </th>
                                    );
                                }
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={
                                        visibleColumns.length
                                    }
                                    className="text-center"
                                >
                                    <div className="alert alert-light p-5 no-data d-flex flex-column" role="alert">
                                        <img src="/assets/sad-cloud.svg" alt="sad cloud" />
                                        <label htmlFor="" className="text-secondary mt-3">
                                            It seems like there is no data available.
                                        </label>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((rowData) => (
                                <tr
                                    key={rowData[keyField]}
                                    className="clickable"
                                    onClick={(e) => viewQuestion(e, rowData)}
                                >
                                    {visibleColumns.map((column) => (
                                        column.visible && (
                                            <td key={column.key} className="align-content-center">
                                                {["discrimination_index", "difficulty_type", "difficulty_value"].includes(column.key) ? (
                                                    (() => {
                                                        const prevValue = getColumnValue(rowData, "previous_" + column.key);
                                                        const newValue = getColumnValue(rowData, "new_" + column.key);

                                                        return prevValue === newValue ? (
                                                            <span className="fw-medium">{prevValue}</span>
                                                        ) : (
                                                            <>
                                                                <span className="text-danger fw-semibold">{prevValue}</span>
                                                                {" → "}
                                                                <span className="text-success fw-semibold">{newValue}</span>
                                                            </>
                                                        );
                                                    })()
                                                ) : (
                                                    getColumnValue(rowData, column.key)
                                                )}
                                            </td>
                                        )
                                    )
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Modal for View, Edit, and Delete */}
            <Modal
                show={Boolean(activeModal)}
                onClose={closeModal}
                modalTitle={`${activeModal?.charAt(0).toUpperCase() + activeModal?.slice(1)} Question`}
                modalSize={'modal-lg'}
            >
                {activeModal === "view" && selectedLog && (
                    <ViewLogModal onClose={closeModal} log={selectedLog} />
                )}

            </Modal>
        </>
    );
}