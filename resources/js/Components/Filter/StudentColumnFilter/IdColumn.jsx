export default function IdColumn({visibleColumns,onColumnChange}) {
    return (
        <div className="form-check">
            <input
                type="checkbox"
                className="form-check-input"
                id="student_idCheck"
                name="student_idCheck"
                checked={visibleColumns.student_id}
                onChange={(e) => onColumnChange("student_id", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="idCheck">
                ID
            </label>
        </div>
    );
}
