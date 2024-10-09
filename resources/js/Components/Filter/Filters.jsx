import { router } from "@inertiajs/react";
import StudentColumnFilter from "./StudentColumnFilter";
import NameFilter from "./NameFilter";
import { useState, useEffect } from "react";
import YearFilter from "./YearFilter";
import SchoolFilter from "./SchoolFilter";
import SelectInput from "../SelectInput";
import "../../../css/filter.css";

export default function Filters({
    visibleColumns,
    onColumnChange,
    filters,
    queryParams,
}) {
    const urlParams = new URLSearchParams(window.location.search);

    const [filterState, setFilterState] = useState({
        year: urlParams.get('year') || "",
        school: urlParams.get('school') || "",
        name: urlParams.get('name') || "",
        items: urlParams.get('items') || "", 
    });

    const updateUrlWithFilters = (filters) => {
        const filteredParams = Object.fromEntries(
            Object.entries(filters).filter(([k, v]) => v !== "")
        );

        router.get(route("admin.dashboard"), filteredParams, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            only: ["students", "filters", "students.meta"], // Only re-render specific components
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

    const handleClearInput = () => {
        handleFilterChange("name", "");
    };

    const handleInputChange = (e) => {
        handleFilterChange("name", e.target.value);
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
                <NameFilter
                    onKeyPress={onKeyPress}
                    value={filterState.name}
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
                        <YearFilter
                            filters={filters}
                            yearValue={filterState.year}
                            handleFilterChange={handleFilterChange}
                        />
                        <SchoolFilter
                            filters={filters}
                            schoolValue={filterState.school}
                            handleFilterChange={handleFilterChange}
                        />
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
            <div className="col-4 input-container">
                <div className="row justify-content-end">
                    <StudentColumnFilter
                        visibleColumns={visibleColumns} // Ensure visibleColumns is passed
                        onColumnChange={onColumnChange}
                    />
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
