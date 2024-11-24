import { useContext } from "react";
import "../../../css/filter.css";
import ContextProvider from "../Tables/TableContext";
import { useFilterState, useOtherState, useSortState } from "@/Library/hooks";
import ClearFunction from "./Filters/ClearFunction";
import { INITIAL_QUESTION_STATE } from "@/Library/filterState";
import TextInputFilter from "./Filters/TextInputFilter";
import SelectFilter from "./Filters/SelectFilter";
import OtherFilter from "./Filters/OtherFilter";

export default function QuestionFilters({filters}){
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
            data: filters.detail_types,
            filterKey: "detail_types",
            keyValue: filterState.detail_types,
        },
        // {
        //     data: filters.test_types,
        //     filterKey: "test_types",
        //     keyValue: filterState.test_types,
        // },
    ];
    return (
        <div className="row m-0 p-0 justify-content-between">
            <ClearFunction
                currentState={filterState}
                initialState={INITIAL_QUESTION_STATE().filterState}
                handleClearFunction={handleClearFilter}
                label={"filter"}
            />
            <div className="filter col-6">
                <div className="row">
                    <div className="col-8 px-0 input-container">
                        <TextInputFilter
                            onKeyPress={onKeyPress}
                            value={otherState.question}
                            filterKey={"question"}
                            handleInputChange={handleInputChange}
                            handleClearInput={handleOtherChange}
                        />
                    </div>
                    <div className="col-4 dropdown">
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
                                        handleClearFilter(["course","difficulty","detail_types"])
                                    }
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-5">
                <OtherFilter
                    visibleColumns={visibleColumns}
                    onColumnChange={onColumnChange}
                    handleOtherChange={handleOtherChange}
                    otherState={otherState}
                />
            </div>
        </div>
    );
}