import { router } from "@inertiajs/react";
import "../../../css/admin/tables.css";
import { toast } from "sonner";
import Table from "./Table";
import { useContext, useState } from "react";
import ContextProvider from "./TableContext";
import { useRequest } from "@/Library/hooks";

export default function CourseTable({
    data
}) {

    const { visibleColumns} = useContext(ContextProvider);
    const {isProcessing,deleteRequest,getRequest} = useRequest();
    const deleteCourse = async (event, course_id) => {
        event.stopPropagation();
        deleteRequest("admin.course.delete",course_id,{});
    };
    const renderActions = (rowData) => {
        return (
            <button
                type="button"
                onClick={(e) => deleteCourse(e, rowData.course_id)}
                className="btn btn-outline-danger d-flex justify-content-center align-items-left"
                disabled={isProcessing}
            >
                <span className="material-symbols-outlined">delete</span> Delete
            </button>
        );
    };
    
    const viewCourse = (e,course_id) =>{
        e.preventDefault();
        getRequest("admin.course.detail",course_id,{
            onSuccess:(success)=>{
                console.log(success);
            },
            onError: (error) => {
                console.log(error)
                // toast.error(error, { duration: 3000 });
            },
        })
    }

    return (
        <Table
            data={data}
            visibleColumns={visibleColumns}
            renderActions={renderActions}
            keyField="course_id"
            isRowClickable={true}
            handleClick={viewCourse}
        />
    );
}
