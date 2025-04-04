import Table from "./Table";
import { useContext, useEffect } from "react";
import ContextProvider from "../Context/TableContext";
import { useRequest, useSortState } from "@/Library/hooks";

export default function StudentsTable({
    data,
    queryParams,
}) {
    const keyField="student_id";
    const { state, dispatch,visibleColumns} = useContext(ContextProvider);
    const { toggleTableSort} = useSortState(dispatch);
    const {getRequest,isProcessing} = useRequest();
    const onClick = (e, rowData) => {
        e.preventDefault();
        getRequest("admin.student",{ id: rowData[keyField], ...queryParams },{});
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
