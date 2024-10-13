import { Link, router } from "@inertiajs/react";
import "../../../css/admin/tables.css";

export default function CourseTable({ courses, visibleColumns, queryParams }) {
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
                                <Link href={route("admin.course.delete", {
                                        course_id: data.course_id,
                                    })}
                                    method="post"
                                    as="button"
                                    onClick={(e) => e.stopPropagation()}
                                    className="btn text-danger fw-semibold d-flex justify-content-center"
                                >
                                    <span className="material-symbols-outlined">
                                        delete
                                    </span>{" "}
                                    Delete
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
