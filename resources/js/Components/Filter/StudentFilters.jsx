import { router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import SelectInput from "../SelectInput";
import "../../../css/filter.css";
import StudentColumnFilter from "./Filters/ColumnFilter";
import SelectFilter from "./Filters/SelectFilter";
import TextInputFilter from "./Filters/TextInputFilter";
import { INITIAL_STUDENT_FILTER_STATE, STUDENT_COLUMN } from "@/Library/constants";
import ColumnFilter from "./Filters/ColumnFilter";

export default function StudentFilters({
    visibleColumns,
    onColumnChange,
    filters,
    queryParams = {},
}) {
    const [filterState, setFilterState] = useState(INITIAL_STUDENT_FILTER_STATE(queryParams));
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

    const updateUrlWithFilters = (filters) => {
        const filteredParams = Object.fromEntries(
            Object.entries(filters).filter(([k, v]) => v !== "")
        );

        router.get(route("admin.dashboard"), filteredParams, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            only: ["students", "filters", "students.meta", "queryParams"], // Only re-render specific components
        });
    };

    const handleFilterChange = (key, value) => {
        const updatedFilters = {
            ...filterState,
            [key]: value || "",
        };

        // Update the state and synchronize the URL
        setFilterState(updatedFilters);
        updateUrlWithFilters(updatedFilters);
    };

    const handleClearInput = (key) => {
        handleFilterChange(key, "");
    };

    const handleInputChange = (e) => {
        handleFilterChange(e.target.name, e.target.value);
    };
    const onKeyPress = (key, e) => {
        if (e.key === "Enter") {
            handleFilterChange(key, e.target.value);
        }
    };

    const handleClearFilter = () => {
        // Clear 'year' and 'school' filters while keeping other filters intact
        const clearedFilters = {
            ...filterState,
            year: "",
            school: "",
        };

        // Update the state and synchronize the URL
        setFilterState(clearedFilters);
        updateUrlWithFilters(clearedFilters);
    };

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
                                onClick={handleClearFilter}
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
