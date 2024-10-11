import { Link } from "@inertiajs/react";

export default function StudentsTable({ students, visibleColumns, queryParams}) {
    return (
        <div className="table-header mt-3">
            <table className="table table-hover students-table">
                <thead>
                    <tr>
                        {visibleColumns.student_id && <td>ID</td>}
                        {visibleColumns.firstname && <th>First Name</th>}
                        {visibleColumns.lastname && <th>Last Name</th>}
                        {visibleColumns.school && <th>School</th>}
                        {visibleColumns.year && <th>Year</th>}
                        {visibleColumns.created_at && <th>Created At</th>}
                        <th className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((data) => (
                        <tr key={data.userable.student_id}>
                            {visibleColumns.student_id && (
                                <td className="align-content-center">
                                    {data.userable.student_id}
                                </td>
                            )}
                            {visibleColumns.firstname && (
                                <td className="align-content-center">
                                    {data.userable.firstname}
                                </td>
                            )}
                            {visibleColumns.lastname && (
                                <td className="align-content-center">
                                    {data.userable.lastname}
                                </td>
                            )}
                            {visibleColumns.school && (
                                <td className="align-content-center">
                                    {data.userable.school}
                                </td>
                            )}
                            {visibleColumns.year && (
                                <td className="align-content-center">
                                    {data.userable.year}
                                </td>
                            )}
                            {visibleColumns.created_at && (
                                <td className="align-content-center">
                                    {data.created_at}
                                </td>
                            )}
                            <td>
                            <Link
                                href={route("admin.student", { student_id: data.userable.student_id, ...queryParams })} 
                                preserveState
                                className="btn text-primary fw-semibold d-flex justify-content-center"
                            >
                                    <span className="material-symbols-outlined">
                                        person
                                    </span>{" "}
                                    View Student
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}