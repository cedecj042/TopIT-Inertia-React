export default function AllColumn({ visibleColumns, onColumnChange }) {
    const allColumnsVisible = visibleColumns && Object.values(visibleColumns).every(Boolean);

    return (
        <div className="form-check">
            <input
                type="checkbox"
                className="form-check-input"
                id="student_idCheck"
                name="student_idCheck"
                checked={allColumnsVisible}
                onChange={(e) => onColumnChange("all", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="student_idCheck">
                All
            </label>
        </div>
    );
}