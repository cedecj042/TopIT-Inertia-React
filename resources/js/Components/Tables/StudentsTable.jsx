import { router } from "@inertiajs/react";
import Table from "./Table";
import { useContext, useEffect } from "react";
import ContextProvider from "../Context/TableContext";
import { useSortState } from "@/Library/hooks";

export default function StudentsTable({
    data,
    queryParams,
}) {
    const keyField="student_id";
    const { state, dispatch,visibleColumns} = useContext(ContextProvider);
    const { toggleTableSort} = useSortState(dispatch);

    const onClick = (e, rowData) => {
        e.preventDefault();
        router.get(
            route("admin.student", {
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
                sortState={state.sortState}
                changeSort={toggleTableSort}
                isRowClickable={true}
                handleClick={onClick}
                keyField={keyField}
            />
        </>
    );
}
