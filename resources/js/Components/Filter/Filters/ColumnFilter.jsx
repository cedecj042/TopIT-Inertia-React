import ColumnCheckbox from "./ColumnCheckbox";

export default function ColumnFilter({ onColumnChange, visibleColumns }) {
    return (
        <div className="col d-flex flex-row justify-content-end input-container">
            <div className="dropdown">
                <button
                    className="btn btn-transparent dropdown-toggle"
                    type="button"
                    id="columnDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    Columns
                </button>
                <div
                    className="dropdown-menu p-3"
                    aria-labelledby="columnDropdown"
                >
                    <div>
                        {visibleColumns.map((column) => (
                            <ColumnCheckbox
                                key={column.key}
                                columnKey={column.key}
                                visible={column.visible}
                                label={column.label}
                                onColumnChange={onColumnChange}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
