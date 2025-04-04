import { useState } from "react";
import Table from "./Table";
import { useRequest } from "@/Library/hooks";
import Modal from "../Modal/Modal";
import DeleteForm from "../Forms/DeleteForm";
import { toast } from "sonner";

export default function AdminUsersTable({ data, visibleColumns }) {
    const { isProcessing, deleteRequest } = useRequest();
    const [modal, setModal] = useState(false);
    const [selectedCoordinator, setSelectedCoordinator] = useState(null);

    // Open modal and set selected coordinator
    const openModal = (coordinator) => {
        setSelectedCoordinator(coordinator);
        setModal(true);
    };

    // Close modal and clear selected coordinator
    const closeModal = () => {
        setSelectedCoordinator(null);
        setModal(false);
    };

    // Handle deletion
    const deleteAdmin = async (admin_id) => {
        deleteRequest('admin.users.delete',admin_id, {
            onSuccess: () => {
                toast.success("Coordinator deleted successfully", { duration: 3000 });
                closeModal();
            },
            onError: (error) => {
                toast.error("Failed to delete coordinator", { duration: 3000 });
            },
        });
    };

    // Render actions for each row
    const renderActions = (rowData) => {
        return (
            <button
                type="button"
                onClick={() => openModal(rowData)}
                disabled={isProcessing}
                className="btn btn-outline-danger d-flex justify-content-center align-items-center"
            >
                <span className="material-symbols-outlined">lock</span>Delete Admin
            </button>
        );
    };

    return (
        <>
            <Table
                data={data}
                visibleColumns={visibleColumns}
                renderActions={renderActions}
                keyField="admin_id"
            />

            <Modal
                modalTitle={"Remove Coordinator"}
                onClose={closeModal}
                show={modal}
            >
                {selectedCoordinator && (
                    <DeleteForm
                        onClose={closeModal}
                        onDelete={(event) => deleteAdmin(selectedCoordinator.admin_id)}
                        isProcessing={isProcessing}
                        title={`${selectedCoordinator.firstname} ${selectedCoordinator.lastname}?`}
                    />
                )}
            </Modal>
        </>
    );
}
