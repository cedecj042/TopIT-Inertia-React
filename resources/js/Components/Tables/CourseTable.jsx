import "../../../css/admin/tables.css";
import { toast } from "sonner";
import Table from "./Table";
import { useContext, useState } from "react";
import ContextProvider from "../Context/TableContext";
import { useRequest, useSortState } from "@/Library/hooks";
import Modal from "../Modal/Modal";
import DeleteForm from "../Forms/DeleteForm";
import EditcourseForm from "../Forms/EditCourseForm";

export default function CourseTable({ data,queryParams }) {
    const { state,dispatch,visibleColumns } = useContext(ContextProvider);
    const { isProcessing, deleteRequest, getRequest } = useRequest();
    const { toggleTableSort} = useSortState(dispatch);
    const [modal, setModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const openModal = (course) => {
        setSelectedCourse(course);
        setModal(true);
    };

    const closeModal = () => {
        setSelectedCourse(null);
        setModal(false);
    };
    const openEditModal = (course) => {
        setSelectedCourse(course);
        setEditModal(true);
    };

    const closeEditModal = () => {
        setSelectedCourse(null);
        setEditModal(false);
    };

    const deleteCourse = async (event, course_id) => {
        deleteRequest("admin.course.delete", course_id, {
            onSuccess: (data) => {
                if (data.props.flash.error) {
                    toast.error(data.props.flash.error, { duration: 3000 });
                } else {
                    toast.success("Course deleted successfully", { duration: 3000 });
                }
                closeModal();
            },
            onError: () => {
                toast.error("Failed to delete course", { duration: 3000 });
            },
        }); 
    };

    const renderActions = (rowData) => {
        return (
            <div className="d-inline-flex gap-2">
                <button
                    onClick={(e) =>{
                        e.stopPropagation();
                        openEditModal(rowData)
                    }}
                    className="btn btn-outline-primary d-flex justify-content-center align-items-left"
                >
                    <span className="material-symbols-outlined align-self-center">
                        edit_square
                    </span>{" "}
                    Edit
                </button>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        openModal(rowData);
                    }}
                    className="btn btn-outline-danger d-flex justify-content-center align-items-left"
                    disabled={isProcessing}
                >
                    <span className="material-symbols-outlined">delete</span> Delete
                </button>
            </div>
        );
    };

    const viewCourse = (e, course) => {
        e.preventDefault();
        getRequest("admin.course.detail", {id:course.course_id }, {
            onSuccess: (success) => {
                console.log(success);
            },
            onError: (error) => {
                console.log(error);
            },
        });
    };

    return (
        <>
            <Table
                data={data}
                visibleColumns={visibleColumns}
                sortState={state.sortState}
                changeSort={toggleTableSort}
                renderActions={renderActions}
                keyField="course_id"
                isRowClickable={true}
                handleClick={viewCourse}
            />
            <Modal show={editModal} onClose={closeEditModal} modalTitle={"Edit Course"}>
                {selectedCourse && (
                    <EditcourseForm
                        onClose={closeEditModal}
                        course= {selectedCourse}
                    />
                )}
            </Modal>
            <Modal show={modal} onClose={closeModal} modalTitle={"Delete Course"}>
                {selectedCourse && (
                    <DeleteForm
                        onClose={closeModal}
                        onDelete={(e) => deleteCourse(e, selectedCourse.course_id)}
                        isProcessing={isProcessing}
                        title={selectedCourse.title}
                    />
                )}
            </Modal>
        </>
    );
}
