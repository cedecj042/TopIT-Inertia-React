import { router } from "@inertiajs/react";
import Table from "./Table";
import { useContext, useEffect } from "react";
import ContextProvider from "./TableContext";
import { useSortState } from "@/Library/hooks";

export default function ModuleTable({
    data,
    queryParams,
}) {
    const keyField="module_id";
    const { state, dispatch,visibleColumns} = useContext(ContextProvider);
    const { changeSort} = useSortState(dispatch);

    const renderActions = (rowData) => {
        return (
            <button
                onClick={(e) => onClick(e, rowData)}
                className="btn btn-outline-primary d-flex justify-content-center align-items-left"
            >
                {/* <span className="material-symbols-outlined align-self-center">
                    person
                </span>{" "}
                View Student */}
            </button>
        );
    };

    const onClick = (e, rowData) => {
        e.preventDefault();
        router.get(
            route("admin.module.detail", {
                student_id: rowData[keyField],
                ...queryParams,
            }),
            { preserveState: true }
        );
    };
    
    return (
        <>
            
            <Table
                data={data}
                visibleColumns={visibleColumns}
                renderActions={renderActions}
                keyField={keyField}
            />
            
        </>
    );
}
