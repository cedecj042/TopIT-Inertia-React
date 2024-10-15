import { router } from "@inertiajs/react";
import "../../../css/admin/tables.css";
import { toast } from "sonner";
import Table from "./Table";

export default function CourseTable({
    data,
    visibleColumns
}) {
    const deleteCourse = (event, course_id) => {
        event.stopPropagation();

        router.delete(route("admin.course.delete", course_id), {
            onSuccess: () => {
                toast.success("Course deleted successfully", {
                    duration: 3000,
                });
            },
            onError: (error) => {
                toast.error(error, { duration: 3000 });
            },
        });
    };

    const renderActions = (rowData) => {
        return (
            <button
                type="button"
                onClick={(e) => deleteCourse(e, rowData.course_id)}
                className="btn btn-outline-danger d-flex justify-content-center align-items-left"
            >
                <span className="material-symbols-outlined">delete</span> Delete
            </button>
        );
    };
    
    const viewCourse = (e,course_id) =>{
        e.preventDefault();
        router.get(route("admin.course.detail",course_id),{
            onError: (error) => {
                toast.error(error, { duration: 3000 });
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
