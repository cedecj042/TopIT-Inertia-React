import React from "react";
import ColumnSortable from "../Filter/Filters/ColumnSortable";
import '../../../css/admin/tables.css';

export default function Table({
    data, // Array of table data
    visibleColumns, // Array of columns with visibility and sort options
    sortState, // State used for sorting
    changeSort, // Function to change the sort
    renderActions, // Function to render custom action buttons based on data
    keyField, // The field name used as the key (e.g., 'student_id', 'question_id')
    isRowClickable = false, //Indicates whether the table row is clickable or not
    handleClick = null, //Clickable row function
}) {
    return (
        <div className="table-header mt-3">
            <table className="table students-table">
                <thead>
                    <tr>
                        {visibleColumns.map((column) => {
                            if(column.visible){
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
                        <th className="text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={visibleColumns.length + 1} className="text-center">
                                <div className="alert alert-light p-5 no-data d-flex flex-column" role="alert">
                                    <img src="/assets/sad-cloud.svg" alt="sad cloud"/>
                                    <label htmlFor="" className="text-secondary mt-3">It seems like there is no data available.</label>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        data.map((rowData) => (
                            <tr
                                key={rowData[keyField]}
                                className={isRowClickable ? "clickable" : ""}
                                onClick={isRowClickable ? (e) => handleClick(e, rowData[keyField]) : null}
                            >
                                {visibleColumns.map(
                                    (column) =>
                                        column.visible && (
                                            <td key={column.key} className="align-content-center">
                                                {rowData[column.key]}
                                            </td>
                                        )
                                )}
                                <td className="align-content-center">{renderActions(rowData)}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
