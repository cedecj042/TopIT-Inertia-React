export default function YearColumn({visibleColumns,onColumnChange}) {
    return (
        <div className="form-check">
            <input
                type="checkbox"
                className="form-check-input"
                id="yearCheck"
                name="year"
                checked={visibleColumns.year}
                onChange={(e) => onColumnChange("year", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="yearCheck">
                Year
            </label>
        </div>
    );
}
