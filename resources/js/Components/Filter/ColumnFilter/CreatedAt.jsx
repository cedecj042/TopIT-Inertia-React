export default function CreatedAt({visibleColumns,onColumnChange}) {
    return (
        <div className="form-check">
            <input
                type="checkbox"
                className="form-check-input"
                id="createdAtCheck"
                name="created_at"
                checked={visibleColumns.created_at}
                onChange={(e) => onColumnChange("created_at", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="createdAtCheck">
                Created At
            </label>
        </div>
    );
}
