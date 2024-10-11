import { router } from "@inertiajs/react";

export default function CourseTable({ courses, visibleColumns, queryParams}) {
    
    return (
        <div className="table-header mt-3">
            <table className="table table-hover students-table">
                <thead>
                    <tr>
                        {visibleColumns.course_id && <td>ID</td>}
                        {visibleColumns.title && <th>Course Title</th>}
                        {visibleColumns.description && <th>Description</th>}
                        {visibleColumns.created_at && <th>Created At</th>}
                    </tr>
                </thead>
                <tbody>
                    {courses.map((data) => (
                        <tr 
                            key={data.course_id}
                            onClick={() => router.get(route("admin.course.detail", { course_id: data.course_id }))}>
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}