import "../../../css/filter.css";
import SelectFilter from "./Filters/SelectFilter";
import ClearFunction from "@/Components/Filter/Filters/ClearFunction";
import TextInputFilter from "@/Components/Filter/Filters/TextInputFilter";
import { INITIAL_MODULE_STATE } from "@/Library/filterState";
import OtherFilter from "@/Components/Filter/Filters/OtherFilter";
import { useContext } from "react";
import ContextProvider from "../Context/TableContext";
import { useFilterState, useOtherState, useSortState } from "@/Library/hooks";

export default function ModuleFilters({ filters }) {
    const { state, dispatch, visibleColumns, onColumnChange } =
        useContext(ContextProvider);
    const { handleClearFilter, handleFilterChange } = useFilterState(dispatch);
    const { handleInputChange, handleOtherChange, onKeyPress } =
        useOtherState(dispatch);
    const { handleClearSort } = useSortState(dispatch);
    const { filterState,sortState, otherState } = state;

    const FILTER_DATA = [
        {
            data: filters.courses,
            filterKey: "course",
            keyValue: filterState.course,
        },
        {
            data: filters.vectorized,
            filterKey: "vectorized",
            keyValue: filterState.vectorized,
        },
    ];

    return (
        <>
            <ClearFunction
                currentState={filterState}
                initialState={INITIAL_MODULE_STATE().filterState}
                handleClearFunction={handleClearFilter}
                label={"filter"}
            />
            <ClearFunction
                currentState={sortState}
                initialState={INITIAL_MODULE_STATE().sortState}
                handleClearFunction={handleClearSort}
                label={"sort"}
            />
            <div className="row g-0 w-100">
                <div className="col-lg-5 col-md-12 input-container mb-3">
                    <TextInputFilter
                        onKeyPress={onKeyPress}
                        value={otherState.title}
                        filterKey={"title"}
                        handleInputChange={handleInputChange}
                        handleClearInput={handleOtherChange}
                    />
                </div>
                <div className="col-md-4 col-lg-2 px-2 dropdown mb-3">
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
                                    handleClearFilter(["course"])
                                }
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 col-lg-3 offset-md-4 offset-lg-2 mb-3">
                    <div className="d-grid grid-template-2">
                        <OtherFilter
                            visibleColumns={visibleColumns}
                            onColumnChange={onColumnChange}
                            handleOtherChange={handleOtherChange}
                            otherState={otherState}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
