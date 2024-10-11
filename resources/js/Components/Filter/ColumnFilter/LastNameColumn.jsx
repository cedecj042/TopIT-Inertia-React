export default function LastNameColumn({visibleColumns,onColumnChange}) {
    return (
        <div className="form-check">
            <input
                type="checkbox"
                className="form-check-input"
                id="lastnameCheck"
                name="lastname"
                checked={visibleColumns.lastname}
                onChange={(e) => onColumnChange("lastname", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="lastnameCheck">
                Last Name
            </label>
        </div>
    );
}
