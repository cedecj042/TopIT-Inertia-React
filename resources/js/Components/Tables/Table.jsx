import React from "react";
import ColumnSortable from "../Filter/Filters/ColumnSortable";
import "../../../css/admin/tables.css";
import { getColumnValue } from "@/Library/utils";

export default function Table({
    data,
    visibleColumns,
    sortState,
    changeSort,
    renderActions = null, // Function to render custom action buttons based on data
    keyField,
    isRowClickable = false, // Enables row click functionality
    handleClick = null, // Row click handler
    isSelectable = false, // Enables the checkbox column
    renderCheckbox = null, // Function to render checkboxes for selection
    renderSelectAllCheckbox = null
}) {
    return (
        <div className="table-header overflow-x-auto">
            <table className="table students-table">
                <thead>
                    <tr>
                        {/* {isSelectable && <th className="text-left">Select</th>} */}
                        {isSelectable && (
                            <th className="text-left align-middle">
                                {renderSelectAllCheckbox && renderSelectAllCheckbox()}
                            </th>
                        )}
                        {visibleColumns.map((column) => {
                            if (column.visible) {
                                return column.sortable ? (
                                    <ColumnSortable
                                        key={column.key}
                                        fieldName={column.key}
                                        label={column.label}
                                        sortState={sortState}
                                        changeSort={changeSort}
                                    />
                                ) : (
                                    <th key={column.key} className="text-left">
                                        {column.label}
                                    </th>
                                );
                            }
                        })}
                        {renderActions && <th className="text-left">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={
                                    visibleColumns.length +
                                    (isSelectable ? 1 : 0) +
                                    (renderActions ? 1 : 0)
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
                                className={isRowClickable ? "clickable" : ""}
                                onClick={isRowClickable ? (e) => handleClick(e, rowData) : null}
                            >
                                {isSelectable && (
                                    <td className="align-content-center text-center">
                                        {renderCheckbox && renderCheckbox(rowData)}
                                    </td>
                                )}
                                {visibleColumns.map((column) =>
                                    column.visible && (
                                        <td key={column.key} className="align-content-center">
                                            {Array.isArray(getColumnValue(rowData, column.key)) ? (
                                                <ul>
                                                    {getColumnValue(rowData, column.key).map((item, index) => (
                                                        <li key={index}>{item}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                getColumnValue(rowData, column.key)
                                            )}
                                        </td>
                                    )
                                )}
                                {renderActions && (
                                    <td className="align-content-center">{renderActions(rowData)}</td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
