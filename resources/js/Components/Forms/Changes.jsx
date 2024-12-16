export default function Changes({handleDiscardChanges,setShowUnsavedChangesModal}) {
    return (
        <div className="p-3">
            <p className="text-dark">
                There are unsaved changes. Do you want to discard these changes?
            </p>
            <div className="d-flex justify-content-end gap-2">
                <button
                    className="btn btn-secondary"
                    onClick={() => setShowUnsavedChangesModal()}
                >
                    Cancel
                </button>
                <button
                    className="btn btn-danger"
                    onClick={handleDiscardChanges}
                >
                    Discard Changes
                </button>
            </div>
        </div>
    );
}
