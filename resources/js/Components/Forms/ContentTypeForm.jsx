import { ContentTypes } from "@/Library/constants";
import { useRequest } from "@/Library/hooks";
import { closestCorners, DndContext } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "sonner";
import ContentList from "../Content/ContentList";
import DeleteForm from "./DeleteForm";
import { useForm } from "react-hook-form";
import ContentForm from "./ContentForm";

export default function ContentTypeForm({
    content,
    contentableId,
    contentableType,
    onOrderChange,
}) {
    // Initialize react-hook-form
    const { register, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            title: content.title,
            contents: content.contents.map((content, index) => ({
                ...content,
                order: index + 1,
            })),
            contentableId: contentableId,
        },
    });

    const contents = watch("contents"); // Watch the contents array
    const [initialContents, setInitialContents] = useState(contents);

    const { isProcessing, putRequest, postRequest, deleteRequest } = useRequest();
    
    useEffect(() => {
        // Update form values when content changes
        setValue("title", content.title);
        setValue(
            "contents",
            content.contents.map((content, index) => ({
                ...content,
                order: index + 1,
            }))
        );
        setInitialContents(
            content.contents.map((content, index) => ({
                ...content,
                order: index + 1,
            }))
        );
        onOrderChange(false); // Reset unsaved changes status
    }, [content, contentableId, contentableType, setValue]);


    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            const oldIndex = contents.findIndex(
                (c) => c.content_id === active.id
            );
            const newIndex = contents.findIndex(
                (c) => c.content_id === over.id
            );
            const reorderedContents = arrayMove(
                contents,
                oldIndex,
                newIndex
            ).map((content, index) => ({
                ...content,
                order: index + 1,
            }));
            setValue("contents", reorderedContents);

            const hasChanged =
                JSON.stringify(reorderedContents) !==
                JSON.stringify(initialContents);
            onOrderChange(hasChanged);
        }
    };

    const onSubmit = (data) => {
        const { title, contents } = data;

        // Prepare data for update
        const payload = {
            title,
            contents: contents.map(({ content_id, order }) => ({
                content_id,
                order,
            })),
            contentable_id: contentableId,
            contentable_type: contentableType,
        };

        // Save the data using a request (putRequest)
        putRequest(
            "admin.module.update",
            contentableId,
            payload,
            {
                onSuccess: () => {
                    toast.success(`${contentableType} saved successfully`);
                },
                onError: (error) => {
                    toast.error("Failed to save module.");
                },
            }
        );
    };

    const [selectedContent, setSelectedContent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        show: false,
        contentId: null,
    });
    const [deleteModal, setDeleteModal] = useState(false);

    const openModal = (content = null) => {
        setSelectedContent(content);
        setShowModal(true);
    };
    const closeModal = () => {
        setSelectedContent(null);
        setShowModal(false);
    };
    const showDeleteModal = () => {
        setDeleteModal(true);
    };
    const closeDeleteModal = () => {
        setDeleteModal(false);
    };

    const openDeleteConfirmation = (contentId) => {
        setDeleteConfirmation({ show: true, contentId });
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({ show: false, contentId: null });
    };

    
    const editContent = async (data) => {
        const contentData = {
            ...data,
            contentable_id: contentableId,
            contentable_type: contentableType,
        };
        console.log(contentData)
        putRequest(
            "admin.content.update",
            data.content_id,
            contentData,
            {
                onSuccess: () => {
                    toast.success("Updated the Content.", { duration: 3000 });
                },
                onError: (error) => {
                    toast.error("Failed to update the content.", {
                        duration: 3000,
                    });
                },
            }
        );
        closeModal();
    };

    const addContent = async (data) => {
        const contentData = {
            ...data,
            contentable_id: contentableId,
            contentable_type: contentableType,
        };
        postRequest(
            "admin.content.create",
            contentData,
            {
                onSuccess: () => {
                    toast.success("Content added successfully.");
                    closeModal();
                },
                onError: (error) => {
                    console.log(error);
                    toast.error("Failed to add new content.");
                },
            }
        );
    };

    const deleteContent = async (contentId) => {
        deleteRequest(
            "admin.content.delete",
            contentId,
            {
                onSuccess: () => {
                    toast.success("Content deleted successfully.");
                    closeDeleteConfirmation();
                },
                onError: () => {
                    toast.error("Failed to deleted content.");
                },
            }
        );
    };
    const deleteTypes = async (contentId) => {
        let routeName;
    
        switch (contentableType) {
            case 'Module':
                routeName = 'admin.module.delete';
                break;
            case 'Lesson':
                routeName = 'admin.module.delete.lesson';
                break;
            case 'Section':
                routeName = 'admin.module.delete.section';
                break;
            case 'Subsection':
                routeName = 'admin.module.delete.subsection';
                break;
            default:
                toast.error("Invalid content type.");
                return;
        }
        deleteRequest(routeName, contentId, {
            onSuccess: () => {
                toast.success("Content deleted successfully.");
            },
            onError: () => {
                toast.error("Failed to delete content.");
            },
        });
    };
    

    return (
        <>
            <h4 className="px-3 fw-semibold">{contentableType} Form</h4>

            <form className="px-3" onSubmit={handleSubmit(onSubmit)}>
            <input
                    type="hidden"
                    id="contentableId"
                    {...register("id")}
                    value={contentableId}
                />
                <div className="mb-3">
                    <label
                        htmlFor="moduleTitle"
                        className="form-label text-dark"
                    >
                        {contentableType} Title
                    </label>
                    <input
                        type="text"
                        id="moduleTitle"
                        className="form-control"
                        {...register("title")} // Register title in react-hook-form
                    />
                </div>

                <div className="d-inline-flex justify-content-between align-items-center w-100">
                    <h5 className="m-0 fw-semibold text-dark">Contents</h5>

                    <button
                        type="button"
                        onClick={() => openModal()}
                        className="btn btn-outline-secondary"
                    >
                        Add Content
                    </button>
                    
                </div>
                <label className="fw-regular text-dark">
                            Drag the content to sort them
                        </label>
                <div className="content-list-wrapper overflow-auto my-2 bg-light-subtle">
                    <DndContext
                        collisionDetection={closestCorners}
                        onDragEnd={handleDragEnd}
                    >
                        <ContentList
                            contents={contents}
                            openModal={openModal} // Pass click handler
                            openDeleteConfirmation={openDeleteConfirmation} // Pass delete confirmation handler
                        />
                    </DndContext>
                </div>

                <div className="d-inline-flex w-100 justify-content-end gap-3">
                    <button type="button" className="btn btn-danger my-2" onClick={() => showDeleteModal()} disabled={isProcessing}>
                        Delete {contentableType}
                    </button>
                    <button type="submit" className="btn btn-primary my-2" disabled={isProcessing}>
                        Save {contentableType}
                    </button>
                </div>
            </form>

            {/* Add/Edit Modal */}
            <Modal
                show={showModal}
                modalTitle={
                    selectedContent ? "Edit Attachment" : "Add Attachment"
                }
                onClose={closeModal}
                modalSize={"modal-lg"}
            >
                <ContentForm
                    contentData={
                        selectedContent || {
                            caption: "",
                            description: "",
                            file_name: "",
                            file_path: "",
                            order: contents.length + 1,
                            type: ContentTypes.TEXT,
                        }
                    }
                    isProcessing={isProcessing}
                    onClose={closeModal}
                    handleFormSubmit={
                        selectedContent ? editContent : addContent
                    }
                />
            </Modal>

            {/* Delete Confirmation for contents Modal */}
            <Modal
                show={deleteConfirmation.show}
                modalTitle="Confirm Delete"
                onClose={closeDeleteConfirmation}
                modalSize={"modal-sm"}
            >
                <DeleteForm
                    onClose={closeDeleteConfirmation}
                    onDelete={() => deleteContent(deleteConfirmation.contentId)}
                    isProcessing={isProcessing}
                />
            </Modal>

            {/* Delete Confirmation for types Modal */}
            {/* <Modal
                show={deleteModal}
                modalTitle="Confirm Delete"
                onClose={closeDeleteModal}
                modalSize={"modal-sm"}
            >
                <DeleteForm
                    onClose={closeDeleteModal}
                    onDelete={() => deleteTypes(contentableId)}
                    isProcessing={isProcessing}
                />
            </Modal> */}

            
        </>
    );
}
