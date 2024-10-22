import { AdminContent } from "@/Components/Content/AdminContent";
import CourseFilters from "@/Components/Filter/CourseFilters";
import CourseForm from "@/Components/Forms/CourseForm";
import Modal from "@/Components/Modal";
import Pagination from "@/Components/Pagination";
import CourseTable from "@/Components/Tables/CourseTable";
import { TableContext } from "@/Components/Tables/TableContext";
import { COURSE_COLUMN, COURSE_FILTER_COMPONENT } from "@/Library/constants";
import { INITIAL_COURSE_STATE } from "@/Library/filterState";
import { useState } from "react";

function Course({ title, courses, queryParams}) {
    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
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
                        
                        <TableContext 
                            initialState={INITIAL_COURSE_STATE(queryParams)}
                            routeName={"admin.course.index"}
                            components={COURSE_FILTER_COMPONENT}
                            column={COURSE_COLUMN}
                            >
                            <CourseFilters queryParams={queryParams}/>
                            <CourseTable data={courses.data}/>
                        </TableContext>
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
            