import { SortableContext } from "@dnd-kit/sortable";
import Attachment from "./Attachment";

export default function AttachmentList({ attachments, openModal,openDeleteConfirmation }) {
    const itemIds = attachments.map((att) => att.attachment_id);

    return (
        <>
            <SortableContext items={itemIds}>
                {attachments.map((attachment) => (
                    <Attachment
                        key={attachment.attachment_id}
                        id={attachment.attachment_id}
                        attachment={attachment}
                        openModal={openModal}
                        openDeleteConfirmation={openDeleteConfirmation}
                    />
                ))}
            </SortableContext>
        </>
    );
}
