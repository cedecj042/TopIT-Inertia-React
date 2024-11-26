import "../../../css/filter.css";
import SelectFilter from "./Filters/SelectFilter";
import ClearFunction from "@/Components/Filter/Filters/ClearFunction";
import TextInputFilter from "@/Components/Filter/Filters/TextInputFilter";
import { INITIAL_STUDENT_STATE } from "@/Library/filterState";
import OtherFilter from "@/Components/Filter/Filters/OtherFilter";
import { useFilterState, useOtherState, useSortState } from "@/Library/hooks";
import { useContext } from "react";
import ContextProvider from "../Context/TableContext";

export default function StudentFilters({ filters }) {
    const { state, dispatch, visibleColumns, onColumnChange } =
        useContext(ContextProvider);
    const { handleClearSort } = useSortState(dispatch);
    const { handleClearFilter, handleFilterChange } = useFilterState(dispatch);
    const { handleInputChange, handleOtherChange, onKeyPress } =
        useOtherState(dispatch);
    const { filterState, otherState, sortState } = state;

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
            <div className="col-12">
                <ClearFunction
                    currentState={filterState}
                    initialState={INITIAL_STUDENT_STATE().filterState}
                    handleClearFunction={handleClearFilter}
                    label={"filter"}
                />
                <ClearFunction
                    currentState={sortState}
                    initialState={INITIAL_STUDENT_STATE().sortState}
                    handleClearFunction={handleClearSort}
                    label={"sort"}
                />
            </div>
            <div className="col-12">
                <div className="row justify-content-between">
                    <div className="col">
                        <div className="col-3 input-container">
                            <TextInputFilter
                                onKeyPress={onKeyPress}
                                value={otherState.name}
                                filterKey={"name"}
                                handleInputChange={handleInputChange}
                                handleClearInput={handleOtherChange}
                            />
                        </div>
                        <div className="col-2 dropdown">
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
            </div>
        </div>
    );
}

