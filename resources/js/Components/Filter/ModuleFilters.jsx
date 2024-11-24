import "../../../css/filter.css";
import SelectFilter from "./Filters/SelectFilter";
import ClearFunction from "@/Components/Filter/Filters/ClearFunction";
import TextInputFilter from "@/Components/Filter/Filters/TextInputFilter";
import { INITIAL_MODULE_STATE } from "@/Library/filterState";
import OtherFilter from "@/Components/Filter/Filters/OtherFilter";
import { useContext } from "react";
import ContextProvider from "../Context/TableContext";
import { useFilterState, useOtherState } from "@/Library/hooks";

export default function ModuleFilters({ filters }) {
    const { state, dispatch, visibleColumns, onColumnChange } =
        useContext(ContextProvider);
    const { handleClearFilter, handleFilterChange } = useFilterState(dispatch);
    const { handleInputChange, handleOtherChange, onKeyPress } =
        useOtherState(dispatch);
    const { filterState, otherState } = state;

    const FILTER_DATA = [
        {
            data: filters.courses,
            filterKey: "course",
            keyValue: filterState.course,
        },
    ];

    return (
        <div className="row m-0 p-0 justify-content-between">
            <ClearFunction
                currentState={filterState}
                initialState={INITIAL_MODULE_STATE().filterState}
                handleClearFunction={handleClearFilter}
                label={"filter"}
            />
            <div className="filter col-6">
                <div className="row">
                    <div className="col-8 px-0 input-container">
                        <TextInputFilter
                            onKeyPress={onKeyPress}
                            value={otherState.title}
                            filterKey={"title"}
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
                                        handleClearFilter(["course"])
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
