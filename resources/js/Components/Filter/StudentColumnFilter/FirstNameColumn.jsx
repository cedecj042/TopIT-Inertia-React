export default function FirstNameColumn({visibleColumns,onColumnChange}) {
    return (
        <div className="form-check">
            <input
                type="checkbox"
                className="form-check-input"
                id="firstnameCheck"
                name="firstname"
                checked={visibleColumns.firstname}
                onChange={(e) => onColumnChange("firstname", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="firstnameCheck">
                First Name
            </label>
        </div>
    );
}
