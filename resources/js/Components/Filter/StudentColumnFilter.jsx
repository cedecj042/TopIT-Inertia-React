
import AllColumn from "./StudentColumnFilter/AllColumn";
import CreatedAt from "./StudentColumnFilter/CreatedAt";
import FirstNameColumn from "./StudentColumnFilter/FirstNameColumn";
import IdColumn from "./StudentColumnFilter/IdColumn";
import LastNameColumn from "./StudentColumnFilter/LastNameColumn";
import SchoolColumn from "./StudentColumnFilter/SchoolColumn";
import YearColumn from "./StudentColumnFilter/YearColumn";

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
