import "../../../css/filter.css";
import SelectFilter from "./Filters/SelectFilter";
import ClearFunction from "@/Components/Filter/Filters/ClearFunction";
import TextInputFilter from "@/Components/Filter/Filters/TextInputFilter";
import { INITIAL_STUDENT_FILTER_STATE, INITIAL_STUDENT_SORT_STATE } from "@/Library/filterState";
import OtherFilter from "@/Components/Filter/Filters/OtherFilter";

export default function StudentFilters({
    filters,
    filterState,
    sortState,
    handleClearFilter,
    handleClearSort,
    handleFilterChange,
    otherState,
    handleOtherChange,
    handleInputChange,
    onKeyPress,
    visibleColumns,
    onColumnChange
}) {
    const FILTER_DATA = [
        {
            data: filters.years,
            filterKey: "year",
            keyValue: filterState.year,
        },
        {
            data: filters.schools,
            filterKey: "school",
            keyValue: filterState.school,
        },
    ];

    return (
        <div className="row justify-content-between">
            <ClearFunction
                currentState={filterState}
                initialState={INITIAL_STUDENT_FILTER_STATE()}
                handleClearFunction={handleClearFilter}
                label={"filter"}
            />
            <br />
            <ClearFunction
                currentState={sortState}
                initialState={INITIAL_STUDENT_SORT_STATE()}
                handleClearFunction={handleClearSort}
                label={"sort"}
            />
            <div className="filter col-6 row">
                <div className="col w-100 input-container">
                    <TextInputFilter
                        onKeyPress={onKeyPress}
                        value={otherState.name}
                        filterKey={"name"}
                        handleInputChange={handleInputChange}
                        handleClearInput={handleOtherChange}
                    />
                </div>
                <div className="col-5 dropdown">
                    <button
                        className="btn btn-transparent dropdown-toggle"
                        type="button"
                        id="filterDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        Filters{" "}
                    </button>
                    <div
                        className="dropdown-menu p-3"
                        aria-labelledby="filterDropdown"
                    >
                        {FILTER_DATA.map((filter, index) => (
                            <SelectFilter
                                key={index} // Use index as key
                                data={filter.data}
                                filterKey={filter.filterKey}
                                keyValue={filter.keyValue}
                                handleFilterChange={handleFilterChange}
                            />
                        ))}
                        <div className="mb-3">
                            <button
                                className="btn btn-light w-100"
                                onClick={() =>
                                    handleClearFilter(["year", "school"])
                                }
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <OtherFilter
                visibleColumns={visibleColumns}
                onColumnChange={onColumnChange}
                handleOtherChange={handleOtherChange}
                otherState={otherState}
            />
        </div>
    );
}
