export default function SchoolColumn({visibleColumns,onColumnChange}) {
    return (
        <div className="form-check">
            <input
                type="checkbox"
                className="form-check-input"
                id="schoolCheck"
                name="school"
                checked={visibleColumns.school}
                onChange={(e) => onColumnChange("school", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="schoolCheck">
                School
            </label>
        </div>
    );
}
