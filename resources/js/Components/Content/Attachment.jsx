import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Attachment({ id, attachment, openModal,openDeleteConfirmation }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
        padding: "16px",
        border: "1px solid #ddd",
        borderRadius: "1rem",
        backgroundColor: "#fff",
        // width: "200px",
        height: "80px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer", // Add cursor pointer to indicate clickable
    };

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className="card p-0 my-2 w-100"
            key={id}
        >
            <div className="card-body d-inline-flex gap-2 align-items-center w-100">
                <span className="material-symbols-outlined">
                    drag_indicator
                </span>
                <div className="d-flex flex-column w-100">
                    <div className="d-inline-flex justify-content-between">
                        <h5 className="card-title m-0 fw-semibold">{attachment.type}</h5>
                        <div className="form-group d-flex flex-row gap-2">
                        <button
                            className="btn btn-outline-light badge text-dark"
                            onPointerDown={() => openModal(attachment)}
                        >
                            Edit
                        </button>
                        <button
                            className="btn badge btn-outline-danger text-danger btn-hover"
                            onPointerDown={() => openDeleteConfirmation(id)}
                        >
                            Delete
                        </button>
                        </div>
                    </div>
                    <p
                        className="card-text text-secondary"
                        style={{
                            maxHeight: "30px", // Set a max height to limit the text area
                            overflow: "hidden", // Hide overflow content
                            textOverflow: "ellipsis", // Add ellipsis for overflow
                            whiteSpace: "wrap", // Prevent text from wrapping to the next line
                        }}
                    >
                        {attachment.description}
                    </p>
                </div>
            </div>
        </div>
    );
}
