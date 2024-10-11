import ColumnCheckbox from "./ColumnCheckbox";

export default function ColumnFilter({
    visibleColumns,
    onColumnChange,
    columnData
}) {
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
                        {Object.keys(columnData).map((columnKey) => (
                            <ColumnCheckbox
                                key={columnKey}
                                columnKey={columnKey}
                                visibleColumns={visibleColumns}
                                onColumnChange={onColumnChange}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
