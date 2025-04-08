import { SortableContext } from "@dnd-kit/sortable";
import Attachment from "./Content";

export default function ContentList({ contents, openModal,openDeleteConfirmation }) {
    const itemIds = contents.map((att) => att.content_id);

    return (
        <>
            <SortableContext items={itemIds}>
                {contents.length >0 ? (
                    contents.map((content) => (
                        <Attachment
                            key={content.content_id}
                            id={content.content_id}
                            content={content}
                            openModal={openModal}
                            openDeleteConfirmation={openDeleteConfirmation}
                        />
                    ))
                ) : (
                    <div className="text-center p-3">
                        <p className="text-muted">No content available.</p>
                    </div>
                )}
            </SortableContext>
        </>
    );
}
