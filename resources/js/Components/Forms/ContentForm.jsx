import { AttachmentTypes } from "@/Library/constants";
import { useRequest } from "@/Library/hooks";
import { closestCorners, DndContext } from "@dnd-kit/core";
import { useState } from "react";
import AttachmentList from "../Content/AttachmentList";
import Modal from "../Modal";
import AttachmentForm from "./AttachmentForm";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "sonner";


export default function ContentForm({ content, attachmentableId, attachmentableType }) {
    const { isProcessing, postRequest, deleteRequest } = useRequest();
    const [title, setTitle] = useState(content.title);
    const [attachments, setAttachments] = useState(
        content.attachments.map((attachment, index) => ({
            ...attachment,
            order: index + 1, // initialize order based on current position
        }))
    );
    const [selectedAttachment, setSelectedAttachment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, attachmentId: null });

    const openModal = (attachment = null) => {
        setSelectedAttachment(attachment);
        setShowModal(true);
    };
    const closeModal = () => {
        setSelectedAttachment(null);
        setShowModal(false);
    };

    const openDeleteConfirmation = (attachmentId) => {
        setDeleteConfirmation({ show: true, attachmentId });
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({ show: false, attachmentId: null });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            const oldIndex = attachments.findIndex(
                (attachment) => attachment.attachment_id === active.id
            );
            const newIndex = attachments.findIndex(
                (attachment) => attachment.attachment_id === over.id
            );
            const reorderedAttachments = arrayMove(
                attachments,
                oldIndex,
                newIndex
            ).map((attachment, index) => ({
                ...attachment,
                order: index + 1, // update order based on new index
            }));
           setAttachments(reorderedAttachments);
        }
    };
    const editAttachment = async (data) => {
        const attachmentData = {
            ...data,
            attachmentable_id: attachmentableId,
            attachmentable_type: attachmentableType,
        };

        postRequest("admin.attachment.update", attachmentData, {
            onSuccess: () => {
                toast.success("Updated the attachment.", { duration: 3000 });
            },
            onError: () => {
                toast.error("Failed to update the attachment.", { duration: 3000 });
            },
        });
        closeModal();
    };

    const addAttachment = async (data) => {
        const attachmentData = {
            ...data,
            attachmentable_id: attachmentableId,
            attachmentable_type: attachmentableType,
        };
        postRequest("admin.attachment.create", attachmentData, {
            onSuccess: (id) => {
                console.log(id)
                toast.success("Attachment added successfully.");
                closeModal();
            },
            onError: () => {
                toast.error("Failed to add new attachment.");
            },
        });
    };
    
    
    
    const deleteAttachment = async (attachmentId) => {
        deleteRequest("admin.attachment.delete", attachmentId, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            onSuccess: () => {
                toast.success("Attachment deleted successfully.");
                setAttachments((prevAttachments) =>
                    prevAttachments.filter((attachment) => attachment.attachment_id !== attachmentId)
                );
                closeDeleteConfirmation();
            },
            onError: () => {
                toast.error("Failed to delete the attachment.");
            },
        });
    };

    return (
        <>
            <form>
                <div className="mb-3">
                    <label htmlFor="moduleTitle" className="form-label">
                        {attachmentableType} Title
                    </label>
                    <input
                        type="text"
                        id="moduleTitle"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="d-inline-flex justify-content-between w-100">
                    <div>
                        <h5 className="m-0 fw-semibold">Attachments</h5>
                        <label htmlFor="fw-light">Drag the attachment to sort them</label>
                    </div>
                    <button type="button" onClick={() => openModal()} className="btn btn-outline-secondary">
                        Add Attachment
                    </button>
                </div>
                <DndContext
                    collisionDetection={closestCorners}
                    onDragEnd={handleDragEnd}
                >
                    <AttachmentList
                        attachments={attachments}
                        openModal={openModal} // Pass click handler
                        openDeleteConfirmation={openDeleteConfirmation} // Pass delete confirmation handler
                    />
                </DndContext>

                <button type="submit" className="btn btn-primary">
                    Save {attachmentableType}
                </button>
            </form>

            {/* Add/Edit Modal */}
            <Modal
                show={showModal}
                modalTitle={selectedAttachment ? "Edit Attachment" : "Add Attachment"}
                onClose={closeModal}
                modalSize={"modal-lg"}
            >
                <AttachmentForm
                    attachmentData={
                        selectedAttachment || {
                            caption: "",
                            description: "",
                            file_name: "",
                            file_path: "",
                            order: attachments.length + 1, 
                            type: AttachmentTypes.TEXT,
                        }
                    }
                    onClose={closeModal}
                    handleFormSubmit={selectedAttachment ? editAttachment : addAttachment}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                show={deleteConfirmation.show}
                modalTitle="Confirm Delete"
                onClose={closeDeleteConfirmation}
                modalSize={"modal-sm"}
            >
                <div className="p-3">
                    <p>Are you sure you want to delete this attachment?</p>
                    <div className="d-flex justify-content-end gap-2">
                        <button className="btn btn-secondary" onClick={closeDeleteConfirmation}>
                            Cancel
                        </button>
                        <button className="btn btn-danger" onClick={() => deleteAttachment(deleteConfirmation.attachmentId)}>
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>

        </>
    );
}
