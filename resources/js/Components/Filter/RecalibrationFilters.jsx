import "../../../css/filter.css";
import { useContext } from "react";
import { useDateState, useFilterState, useOtherState, useSortState } from "@/Library/hooks";
import OtherFilter from "./Filters/OtherFilter";
import SelectFilter from "./Filters/SelectFilter";
import FilterProvider from "../Context/FilterContext";
import ClearFunction from "./Filters/ClearFunction";
import { INITIAL_RECALIBRATION_STATE } from "@/Library/filterState";
import DateRangeFilter from "./Filters/DateRangeFilter";
import SortFilter from "./Filters/SortFilter";
import { RECALIBRATION_SORTING_OPTIONS } from "@/Library/constants";

export default function RecalibrationFilters({ filters }) {
    const { state, dispatch } = useContext(FilterProvider);
    const { handleClearFilter, handleFilterChange } = useFilterState(dispatch);
    const { handleInputChange, handleOtherChange, onKeyPress } = useOtherState(dispatch);
    const { handleDateChange, onDateClear } = useDateState(dispatch);
    const { handleClearSort, changeDropdownSort } = useSortState(dispatch);
    const { filterState, otherState, dateState, sortState } = state;

    const FILTER_DATA = [
        {
            data: filters.status,
            filterKey: "status",
            keyValue: filterState.status,
        },
    ];

    return (
        <>
            <ClearFunction
                currentState={filterState}
                initialState={INITIAL_RECALIBRATION_STATE().filterState}
                handleClearFunction={handleClearFilter}
                label={"filter"}
            />
            <ClearFunction
                currentState={dateState}
                initialState={INITIAL_RECALIBRATION_STATE().dateState}
                handleClearFunction={onDateClear}
                label={"date"}
            />
            <ClearFunction
                currentState={sortState}
                initialState={INITIAL_RECALIBRATION_STATE().sortState}
                handleClearFunction={handleClearSort}
                label={"sort"}
            />
            <div className="col-12">
                <div className="row g-3">
                    <div className="col-6">
                        <div className="row">
                            <div className="col">
                                <DateRangeFilter
                                    from={dateState.from}
                                    to={dateState.to}
                                    onDateChange={handleDateChange}
                                    onClear={onDateClear}
                                />
                            </div>
                            <div className="col">
                                <button
                                    className="btn bg-white btn-outline-secondary-subtle dropdown-toggle"
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
                                                handleClearFilter(["status"])
                                            }
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="row">
                            <div className="col-md-4 col-sm-6 offset-md-4 offset-xs-0">
                                <SortFilter
                                    onSortChange={(field, direction) => changeDropdownSort(field, direction)}
                                    filterKey={"sort"}
                                    currentSort={sortState}
                                    sortingOptions={RECALIBRATION_SORTING_OPTIONS}
                                />
                            </div>
                            <div className="col-md-4 col-sm-6">
                                <OtherFilter
                                    handleOtherChange={handleOtherChange}
                                    otherState={otherState}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}