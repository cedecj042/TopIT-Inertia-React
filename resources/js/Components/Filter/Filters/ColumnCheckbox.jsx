import { capitalizeFirstLetter } from "@/Library/utils";

export default function ColumnCheckbox({ columnKey, visibleColumns, onColumnChange }) {
    return (
        <div className="form-check">
            <input
                type="checkbox"
                className="form-check-input"
                id={`${columnKey}Check`}
                name={columnKey}
                checked={visibleColumns[columnKey]}
                onChange={(e) => onColumnChange(columnKey, e.target.checked)}
            />
            <label className="form-check-label" htmlFor={`${columnKey}Check`}>
                {capitalizeFirstLetter(columnKey)}
            </label>
        </div>
    );
}
