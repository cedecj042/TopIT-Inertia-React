import { useContext } from "react";
import "../../../css/filter.css";
import ContextProvider from "../Context/TableContext";
import { useFilterState, useOtherState, useSortState } from "@/Library/hooks";
import ClearFunction from "./Filters/ClearFunction";
import { INITIAL_QUESTION_STATE } from "@/Library/filterState";
import TextInputFilter from "./Filters/TextInputFilter";
import SelectFilter from "./Filters/SelectFilter";
import OtherFilter from "./Filters/OtherFilter";

export default function RecalibrationLogFilters({filters}){
    const { state, dispatch, visibleColumns, onColumnChange } =
        useContext(ContextProvider);
    const { handleClearSort } = useSortState(dispatch);
    const { handleClearFilter, handleFilterChange } = useFilterState(dispatch);
    const { handleInputChange, handleOtherChange, onKeyPress } = useOtherState(dispatch);
    const { filterState, otherState, sortState } = state;

    const FILTER_DATA = [
        {
            data: filters.courses,
            filterKey: "course",
            keyValue: filterState.course,
        },
        {
            data: filters.difficulty,
            filterKey: "difficulty",
            keyValue: filterState.difficulty,
        },
        {
            data: filters.question_type,
            filterKey: "question_type",
            keyValue: filterState.question_type,
        },
    ];
    return (
        <>
            <ClearFunction
                currentState={filterState}
                initialState={INITIAL_QUESTION_STATE().filterState}
                handleClearFunction={handleClearFilter}
                label={"filter"}
            />
            <div className="row g-0 w-100">
                <div className="col-lg-5 col-md-12 input-container mb-3">
                <TextInputFilter
                    onKeyPress={onKeyPress}
                    value={otherState.question}
                    filterKey={"question"}
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
                        onClick={(e)=>e.stopPropagation()}
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
                                    handleClearFilter(["course","difficulty","question_type"])
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