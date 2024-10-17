import { router } from "@inertiajs/react";
import Table from "./Table";

export default function StudentsTable({ 
    data, 
    keyField, 
    visibleColumns,
    sortState,
    changeSort,
    queryParams
}) {
    const renderActions = (rowData) => {
        return (
            <button
                onClick={(e) => onClick(e, rowData)} 
                className="btn btn-outline-primary d-flex justify-content-center align-items-left"
            >
                <span className="material-symbols-outlined align-self-center">person</span>{" "} View Student
            </button>
        );
    };
    
    const onClick = (e, rowData) => {
        e.preventDefault();
        router.get(
            route("admin.student", { student_id: rowData[keyField], ...queryParams }), 
            { preserveState: true } 
        );
    };
    return (
        <Table
            data={data}
            visibleColumns={visibleColumns}
            sortState={sortState}
            changeSort={changeSort} 
            renderActions={renderActions}
            keyField={keyField}
        />
    );
}
