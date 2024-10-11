import AddCourseModal from "@/Components/Admin/AddCourseModal";
import CourseFilters from "@/Components/Filter/CourseFilters";
import CourseTable from "@/Components/Tables/CourseTable";
import AdminLayout from "@/Layouts/AdminLayout";
import { COURSE_COLUMN } from "@/Library/constants";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function Course({ auth, title,courses }) {

    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const [visibleColumns, setVisibleColumns] = useState(COURSE_COLUMN);
    
    const onColumnChange = (columnName, isVisible) => {
        if (columnName === "all") {
            const updatedColumns = Object.keys(visibleColumns).reduce((columns, key) => {
                columns[key] = isVisible;
                return columns;
            }, {});
            setVisibleColumns(updatedColumns);
        } else {
            setVisibleColumns((prev) => ({
                ...prev,
                [columnName]: isVisible,
            }));
        }
    };
    return (
        <AdminLayout title={title}>
            <Head title={title} />
            <div className="row p-3">
                <div className="row justify-content-center mt-4 px-5">
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-5 pb-2 mt-3 mb-3 w-100">
                        <h1 className="h3 fw-semibold m-0">Courses</h1>
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
                    <div className="row px-0">
                        <h5 className="fw-semibold">List of Courses</h5>
                        <CourseFilters 
                            queryParams={queryParams}
                            filters={filters}
                            visibleColumns={visibleColumns}
                            onColumnChange={onColumnChange}
                        />
                        <CourseTable courses={courses.data} visibleColumns={visibleColumns}/>
                    </div>

                    <AddCourseModal show={showModal} onClose={closeModal} />
                </div>
            </div>
        </AdminLayout>
    );
}

