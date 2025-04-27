import "../../../css/filter.css";
import { useContext } from "react";
import { useDateState, useFilterState, useOtherState, useSortState } from "@/Library/hooks";
import OtherFilter from "./Filters/OtherFilter";
import SelectFilter from "./Filters/SelectFilter";
import FilterProvider from "../Context/FilterContext";
import ClearFunction from "./Filters/ClearFunction";
import { INITIAL_ASSESSMENT_STATE, INITIAL_TEST_STATE } from "@/Library/filterState";
import DateRangeFilter from "./Filters/DateRangeFilter";
import SortFilter from "./Filters/SortFilter";
import { TEST_SORTING_OPTIONS } from "@/Library/constants";
import TextInputFilter from "./Filters/TextInputFilter";

export default function AssessmentFilters({ filters }) {
    const { state, dispatch } = useContext(FilterProvider);
    const { handleClearFilter, handleFilterChange } = useFilterState(dispatch);
    const { handleInputChange, handleOtherChange, onKeyPress } = useOtherState(dispatch);
    const { handleDateChange, onDateClear } = useDateState(dispatch);
    const { handleClearSort, changeDropdownSort } = useSortState(dispatch);
    const { filterState, otherState, dateState, sortState } = state;
    console.log(filters);
    const FILTER_DATA = [
        {
            data: filters.course,
            filterKey: "course",
            keyValue: filterState.course,
        },
        {
            data: filters.test_types,
            filterKey: "test_types",
            keyValue: filterState.test_types,
        },
        {
            data: filters.status,
            filterKey: "status",
            keyValue: filterState.status,
        },
    ];
    const STUDENT_FILTER = [
        {
            data: filters.school,
            filterKey: "school",
            keyValue: filterState.school,
        },
        {
            data: filters.year,
            filterKey: "year",
            keyValue: filterState.year,
        },
    ]

    return (
        <>
            <ClearFunction
                currentState={filterState}
                initialState={INITIAL_ASSESSMENT_STATE().filterState}
                handleClearFunction={handleClearFilter}
                label={"filter"}
            />
            <ClearFunction
                currentState={dateState}
                initialState={INITIAL_ASSESSMENT_STATE().dateState}
                handleClearFunction={onDateClear}
                label={"date"}
            />
            <ClearFunction
                currentState={sortState}
                initialState={INITIAL_ASSESSMENT_STATE().sortState}
                handleClearFunction={handleClearSort}
                label={"sort"}
            />
            <div className="col-12">
                <div className="row g-3">
                    <div className="col-lg-3 col-md-3 input-container">
                        <TextInputFilter
                            onKeyPress={onKeyPress}
                            value={otherState.name}
                            filterKey={"name"}
                            handleInputChange={handleInputChange}
                            handleClearInput={handleOtherChange}
                        />
                    </div>
                    <div className="col-md-2 col-lg-2">
                        <DateRangeFilter
                            from={dateState.from}
                            to={dateState.to}
                            onDateChange={handleDateChange}
                            onClear={onDateClear}
                        />
                    </div>
                    <div className="col-lg-2 col-md-3 input-container mb-3">
                        <div className="d-flex flex-row gap-2">
                            <div>
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
                                                handleClearFilter(["course", "test_types", "status"])
                                            }
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button
                                    className="btn bg-white btn-outline-secondary-subtle dropdown-toggle"
                                    type="button"
                                    id="filterDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Student Filter{" "}
                                </button>
                                <div
                                    className="dropdown-menu p-3"
                                    aria-labelledby="filterDropdown"
                                >
                                    {STUDENT_FILTER.map((filter, index) => (
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
                                                handleClearFilter(["school", "year"])
                                            }
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-lg-2 offset-md-2 offset-lg-2 ">
                        <SortFilter
                            onSortChange={(field, direction) => changeDropdownSort(field, direction)}
                            filterKey={"sort"}
                            currentSort={sortState}
                            sortingOptions={TEST_SORTING_OPTIONS}
                        />
                    </div>
                    <div className="col-md-3 col-lg-1">
                        <OtherFilter
                            handleOtherChange={handleOtherChange}
                            otherState={otherState}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}