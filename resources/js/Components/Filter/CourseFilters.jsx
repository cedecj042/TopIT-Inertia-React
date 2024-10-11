import { COURSE_COLUMN, COURSE_FILTER_COMPONENT } from "@/Library/constants";
import { INITIAL_COURSE_FILTER_STATE } from "@/Library/filterState";
import { useFilters } from "@/Library/hooks";
import { useState } from "react";
import TextInputFilter from "./Filters/TextInputFilter";
import SelectInput from "../SelectInput";
import ColumnFilter from "./Filters/ColumnFilter";
import "../../../css/filter.css";

export default function CourseFilters({
    visibleColumns,
    onColumnChange,
    queryParams = {},
}){  
    const [filterState, setFilterState] = useState(INITIAL_COURSE_FILTER_STATE(queryParams));
    const {
        handleFilterChange,
        handleInputChange,
        handleClearInput,
        onKeyPress,
    } = useFilters(filterState,setFilterState, "admin.course.index", COURSE_FILTER_COMPONENT);

    return(
        <div className="row justify-content-between">
            <div className="filter col-6 row">
                <TextInputFilter
                    onKeyPress={onKeyPress}
                    value={filterState.name}
                    filterKey={'course title'}
                    handleInputChange={handleInputChange}
                    handleClearInput={handleClearInput}
                />
            </div>
            <div className="col">
                <div className="row justify-content-end">
                    <div className="col">
                    <ColumnFilter
                            columnData={COURSE_COLUMN}
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
    )
}