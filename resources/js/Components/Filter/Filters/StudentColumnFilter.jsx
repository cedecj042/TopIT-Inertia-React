
import AllColumn from "../ColumnFilter/AllColumn";
import CreatedAt from "../ColumnFilter/CreatedAt";
import FirstNameColumn from "../ColumnFilter/FirstNameColumn";
import IdColumn from "../ColumnFilter/IdColumn";
import LastNameColumn from "../ColumnFilter/LastNameColumn";
import SchoolColumn from "../ColumnFilter/SchoolColumn";
import YearColumn from "../ColumnFilter/YearColumn";

export default function StudentColumnFilter({visibleColumns,onColumnChange}) {

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
                    <AllColumn
                        visibleColumns={visibleColumns}
                        onColumnChange={onColumnChange}
                    />
                    <IdColumn
                        visibleColumns={visibleColumns}
                        onColumnChange={onColumnChange}
                    />
                    <FirstNameColumn
                        visibleColumns={visibleColumns}
                        onColumnChange={onColumnChange}
                    />
                    <LastNameColumn
                        visibleColumns={visibleColumns}
                        onColumnChange={onColumnChange}
                    />
                    <SchoolColumn
                        visibleColumns={visibleColumns}
                        onColumnChange={onColumnChange}
                    />
                    <YearColumn
                        visibleColumns={visibleColumns}
                        onColumnChange={onColumnChange}
                    />
                    <CreatedAt
                        visibleColumns={visibleColumns}
                        onColumnChange={onColumnChange}
                    />
                </div>
            </div>
        </div>
    );
}
