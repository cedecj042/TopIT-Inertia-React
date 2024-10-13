import { router } from "@inertiajs/react";
import "../../../css/admin/tables.css";
import { toast } from "sonner";

export default function CourseTable({ courses, visibleColumns }) {
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
    return (
        <div className="table-header mt-3">
            <table className="table table-hover students-table">
                <thead>
                    <tr>
                        {visibleColumns.course_id && <th>ID</th>}
                        {visibleColumns.title && <th>Course Title</th>}
                        {visibleColumns.description && <th>Description</th>}
                        {visibleColumns.created_at && <th>Created At</th>}
                        <th className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((data) => (
                        <tr
                            key={data.course_id}
                            className="clickable"
                            onClick={() =>
                                router.get(
                                    route("admin.course.detail", {
                                        course_id: data.course_id,
                                    })
                                )
                            }
                        >
                            {visibleColumns.course_id && (
                                <td className="align-content-center">
                                    {data.course_id}
                                </td>
                            )}
                            {visibleColumns.title && (
                                <td className="align-content-center">
                                    {data.title}
                                </td>
                            )}
                            {visibleColumns.description && (
                                <td className="align-content-center">
                                    {data.description}
                                </td>
                            )}
                            {visibleColumns.created_at && (
                                <td className="align-content-center">
                                    {data.created_at}
                                </td>
                            )}
                            <td>
                                <button
                                    type="button"
                                    onClick={(e) =>
                                        deleteCourse(e, data.course_id)
                                    }
                                    className="btn btn-outline-danger d-flex justify-content-center"
                                >
                                    <span className="material-symbols-outlined">
                                        delete
                                    </span>{" "}
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
