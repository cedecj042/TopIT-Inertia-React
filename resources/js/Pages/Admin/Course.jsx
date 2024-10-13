import CourseFilters from "@/Components/Filter/CourseFilters";
import AddCourse from "@/Components/Forms/AddCourse";
import Pagination from "@/Components/Pagination";
import CourseTable from "@/Components/Tables/CourseTable";
import AdminLayout from "@/Layouts/AdminLayout";
import { COURSE_COLUMN } from "@/Library/constants";
import { useColumnVisibility } from "@/Library/hooks";
import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Course({ title,courses,queryParams }) {

    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const { visibleColumns, onColumnChange } = useColumnVisibility(COURSE_COLUMN);
    const { props } = usePage();
    const flash = props.flash || {};
    const { success, error } = flash;
    return (
        <AdminLayout title={title}>
            <Head title={title} />
            <div className="row p-3">
                <div className="row justify-content-between  mt-5 px-5">
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3 p-0">
                        <h1 className="h3 fw-semibold m-0 ">Courses</h1>
                        <div className="btn-toolbar mb-2 mb-md-0">
                            <button
                                type="button"
                                className="btn btn-primary btn-md"
                                style={{
                                    fontSize: "0.9rem",
                                    padding: "0.8em 1em",
                                }}
                                onClick={openModal}
                            >
                                Add Course
                            </button>
                        </div>
                    </div>
                    {/* Display Success or Error Messages */}
                    {success && <div className="alert alert-success">{success}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="row px-0">
                        <h5 className="fw-semibold">List of Courses</h5>
                        <CourseFilters 
                            queryParams={queryParams}
                            visibleColumns={visibleColumns}
                            onColumnChange={onColumnChange}
                        />
                        <CourseTable courses={courses.data} visibleColumns={visibleColumns}/>
                        <Pagination links={courses.meta.links} />
                    </div>

                    <AddCourse show={showModal} onClose={closeModal} />
                </div>
            </div>
        </AdminLayout>
    );
}

