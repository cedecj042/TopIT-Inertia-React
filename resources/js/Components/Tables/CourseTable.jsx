import "../../../css/admin/tables.css";
import { toast } from "sonner";
import Table from "./Table";
import { useContext, useState } from "react";
import ContextProvider from "../Context/TableContext";
import { useRequest } from "@/Library/hooks";
import Modal from "../Modal/Modal";
import DeleteForm from "../Forms/DeleteForm";

export default function CourseTable({ data }) {
    const { visibleColumns } = useContext(ContextProvider);
    const { isProcessing, deleteRequest, getRequest } = useRequest();
    const [modal, setModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const openModal = (course) => {
        setSelectedCourse(course);
        setModal(true);
    };

    const closeModal = () => {
        setSelectedCourse(null);
        setModal(false);
    };

    const deleteCourse = async (event, course_id) => {
        deleteRequest("admin.course.delete", course_id, {
            onSuccess: () => {
                toast.success("Course deleted successfully", { duration: 3000 });
                closeModal();
            },
            onError: () => {
                toast.error("Failed to delete course", { duration: 3000 });
            },
        });
    };

    const renderActions = (rowData) => {
        return (
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
        );
    };

    const viewCourse = (e, course) => {
        e.preventDefault();
        getRequest("admin.course.detail", course.course_id, {
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
                renderActions={renderActions}
                keyField="course_id"
                isRowClickable={true}
                handleClick={viewCourse}
            />
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
