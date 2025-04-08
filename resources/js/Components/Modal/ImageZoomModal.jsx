import { useEffect } from "react";

export default function ImageZoomModal({ imageSrc, isOpen, onClose }) {
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="modal show fade d-block"
            tabIndex="-1"
            style={{
                backgroundColor: "rgba(0,0,0,0.4)",
                zIndex: 1055,
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
            }}
        >
            <div
                className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen"
                onClick={(e) => {e.stopPropagation();onClose();}}
            >
                <div className="modal-content bg-transparent border-0 d-flex justify-content-center align-items-center">
                    <div className="rounded-3"onClick={(e) => e.stopPropagation()}>
                        <img
                            src={imageSrc}
                            alt="Zoomed preview"
                            className="img-fluid"
                            style={{ maxHeight: "90vh", objectFit: "contain" }}
                        />
                    </div>
                    <button
                        type="button"
                        className="btn btn-light position-absolute top-0 end-0 m-3"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>
            </div>
        </div>
    );
}
