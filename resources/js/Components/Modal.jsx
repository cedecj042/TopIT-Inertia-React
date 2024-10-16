export default function Modal({modalTitle,onClose,show,children}) {
    if (!show) return null;
    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            aria-labelledby="modalLabel"
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalLabel">
                            {modalTitle}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}