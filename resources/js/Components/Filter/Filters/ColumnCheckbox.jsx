export default function ColumnCheckbox({ columnKey,label, visible, onColumnChange }) {
    return (
        <div className="form-check">
            <input
                type="checkbox"
                className="form-check-input"
                id={`${columnKey}Check`}
                name={columnKey}
                checked={visible}
                onChange={(e) => onColumnChange(columnKey, e.target.checked)}
            />
            <label className="form-check-label" htmlFor={`${columnKey}Check`}>
                {label}
            </label>
        </div>
    );
}
