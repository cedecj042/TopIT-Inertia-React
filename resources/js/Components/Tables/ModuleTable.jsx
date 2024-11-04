import { router } from "@inertiajs/react";
import Table from "./Table";
import { useContext, useEffect } from "react";
import ContextProvider from "./TableContext";
import { useRequest, useSortState } from "@/Library/hooks";

export default function ModuleTable({ data, queryParams }) {
    const keyField = "module_id";
    const { state, dispatch, visibleColumns } = useContext(ContextProvider);
    const { changeSort } = useSortState(dispatch);
    const { isProcessing, getRequest,deleteRequest } = useRequest();

    const renderActions = (rowData) => {
        return (
            <>
                <div className="d-inline-flex gap-2">
                    <button
                        onClick={(e) => editModule(e, rowData.module_id)}
                        className="btn btn-outline-primary d-flex justify-content-center align-items-left"
                    >
                        <span className="material-symbols-outlined align-self-center">
                            edit_square
                        </span>{" "}
                        Edit
                    </button>
                    <button
                        onClick={(e) => deleteModule(e, rowData.module_id)}
                        className="btn btn-outline-danger d-flex justify-content-center align-items-left"
                    >
                        <span className="material-symbols-outlined align-self-center">
                            delete
                        </span>{" "}
                        Delete
                    </button>
                </div>
            </>
        );
    };

    const editModule = (e,module_id) =>{
        e.stopPropagation();
        getRequest("admin.module.edit",module_id,{ 
            onSuccess: (success) => {
                console.log(success);
            },
            onError: (error) => {
                console.log(error);
            },
        });
    }

    const deleteModule = (event, module_id) => {
        event.stopPropagation();
        deleteRequest("admin.module.delete",module_id,{});
    };

    
    const viewModule = (e, module_id) => {
        e.preventDefault();
        getRequest("admin.module.detail", module_id, {
            onSuccess: (success) => {
                console.log(success);
            },
            onError: (error) => {
                console.log(error);
                // toast.error(error, { duration: 3000 });
            },
        });
    };

    return (
        <>
            <Table
                data={data}
                isRowClickable={true}
                handleClick={viewModule}
                visibleColumns={visibleColumns}
                renderActions={renderActions}
                keyField={keyField}
            />
        </>
    );
}
