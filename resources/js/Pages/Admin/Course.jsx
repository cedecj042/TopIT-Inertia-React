import { AdminContent } from "@/Components/Content/AdminContent";
import CourseFilters from "@/Components/Filter/CourseFilters";
import CourseForm from "@/Components/Forms/CourseForm";
import Modal from "@/Components/Modal";
import Pagination from "@/Components/Pagination";
import CourseTable from "@/Components/Tables/CourseTable";
import AdminLayout from "@/Layouts/AdminLayout";
import AdminListener from "@/Components/Content/AdminListener";
import MainLayout from "@/Layouts/MainLayout";
import { COURSE_COLUMN } from "@/Library/constants";
import { useColumnVisibility } from "@/Library/hooks";
import { useState } from "react";

function Course({ title, courses, queryParams }) {
    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const { visibleColumns, onColumnChange } =
        useColumnVisibility(COURSE_COLUMN);
    return (
        <>
            <div className="container-fluid p-5">
                <div className="row justify-content-center">
                    <div className="col mb-4 btn-toolbar justify-content-between">
                        <h2 className="fw-bolder m-0">Courses</h2>
                        <button
                            type="button"
                            className="btn btn-primary btn-md btn-size"
                            onClick={openModal}
                        >
                            Add Course
                        </button>
                    </div>
                    <div className="row justify-content-between">
                        <h5 className="fw-semibold mb-3 px-0 ">
                            List of Courses
                        </h5>
                        <CourseFilters
                            queryParams={queryParams}
                            visibleColumns={visibleColumns}
                            onColumnChange={onColumnChange}
                        />
                        <CourseTable
                            data={courses.data}
                            visibleColumns={visibleColumns}
                        />
                        <Pagination links={courses.meta.links} />
                    </div>
                </div>

                <Modal
                    show={showModal}
                    onClose={closeModal}
                    modalTitle={"Add Course"}
                >
                    <CourseForm onClose={closeModal} />
                </Modal>
            </div>
        </>
    );
}

export default AdminContent(Course);
            