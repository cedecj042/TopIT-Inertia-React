import ColumnCheckbox from "./ColumnCheckbox";

export default function ColumnFilter({ onColumnChange, visibleColumns }) {
    return (
        <>
            <div className="dropdown d-flex justify-content-end pe-3">
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
        </>
    );
}
