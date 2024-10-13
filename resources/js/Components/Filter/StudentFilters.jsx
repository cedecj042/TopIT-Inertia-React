import { useState, useEffect } from "react";
import SelectInput from "../SelectInput";
import "../../../css/filter.css";
import SelectFilter from "./Filters/SelectFilter";
import TextInputFilter from "./Filters/TextInputFilter";
import {  STUDENT_COLUMN, STUDENT_FILTER_COMPONENT } from "@/Library/constants";
import { INITIAL_STUDENT_FILTER_STATE } from "@/Library/filterState";
import ColumnFilter from "./Filters/ColumnFilter";
import { useFilters } from "@/Library/hooks";

export default function StudentFilters({
    visibleColumns,
    onColumnChange,
    filters,
    filterState,
    queryParams,
    handleFilterChange,
    handleInputChange,
    handleClearInput,
    handleClearFilter,
    onKeyPress,
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
    ]
 

    return (
        <div className="row justify-content-between">
            <div className="filter col-6 row">
                <TextInputFilter
                    onKeyPress={onKeyPress}
                    value={filterState.name}
                    filterKey={"name"}
                    handleInputChange={handleInputChange}
                    handleClearInput={handleClearInput}
                />
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
                                onClick={() =>handleClearFilter(['year','school'])}
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="row justify-content-end">
                    <div className="col">
                        <ColumnFilter
                            columnData={STUDENT_COLUMN}
                            visibleColumns={visibleColumns}
                            onColumnChange={onColumnChange}
                        />
                    </div>
                    <div className="col-3">
                        <SelectInput
                            className=" form-select"
                            onChange={(e) =>
                                handleFilterChange("items", e.target.value)
                            }
                            defaultValue={filterState.items}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </SelectInput>
                    </div>
                </div>
            </div>
        </div>
    );
}
