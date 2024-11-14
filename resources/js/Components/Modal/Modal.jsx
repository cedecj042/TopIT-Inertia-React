import '../../../css/modal.css';

export default function Modal({modalTitle,modalSize=null,onClose,show,children}) {
    if (!show) return null;
    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            aria-labelledby="modalLabel"
            role="dialog"
        >
            <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${modalSize}`}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-dark" id="modalLabel">
                            {modalTitle}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}