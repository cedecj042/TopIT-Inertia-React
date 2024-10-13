import { Link } from "@inertiajs/react";
import '../../../css/admin/tables.css';

export default function StudentsTable({ students, visibleColumns, queryParams,changeSort }) {

    return (
        <div className="table-header mt-3">
            <table className="table students-table">
                <thead>
                    <tr>
                        {visibleColumns.student_id && <th>ID</th>}
                        {visibleColumns.name && <th className=" clickable" onClick={(e) => changeSort('name')}>
                            <div className="d-flex flex-row justify-content-start">
                                <span className="align-content-center">Name</span>
                                <div className="d-flex row justify-content-center align-items-center icon-container">
                                    <span className="material-symbols-outlined icon-up">keyboard_arrow_up</span>
                                    <span className="material-symbols-outlined icon-down">keyboard_arrow_down</span>
                                </div>
                            </div>    
                        </th>}
                        {visibleColumns.school && <th>School</th>}
                        {visibleColumns.year && <th className="text-center w-6 clickable" onClick={(e) => changeSort('year')}>
                                <div className="d-flex flex-row">
                                    <span className="align-content-center">Year</span>
                                    <div className="d-flex row justify-content-center align-items-center icon-container">
                                        <span className="material-symbols-outlined icon-up">keyboard_arrow_up</span>
                                        <span className="material-symbols-outlined icon-down">keyboard_arrow_down</span>
                                    </div>
                                </div>
                            </th>}
                        {visibleColumns.created_at && <th>Created At</th>}
                        <th className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((data) => (
                        <tr key={data.userable.student_id}>
                            {visibleColumns.student_id && (
                                <td className="align-content-center text-center">
                                    {data.userable.student_id}
                                </td>
                            )}
                            {visibleColumns.name && (
                                <td className="align-content-center">
                                    {data.userable.firstname} {data.userable.lastname}
                                </td>
                            )}
                            {visibleColumns.school && (
                                <td className="align-content-center">
                                    {data.userable.school}
                                </td>
                            )}
                            {visibleColumns.year && (
                                <td className="align-content-center text-center">
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