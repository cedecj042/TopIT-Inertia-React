import { COURSE_COLUMN } from "@/Library/constants";
import CourseColumnFilter from "./Filters/CourseColumnFilter";

export default function CourseFilters(){
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

    return(
        <div className="row justify-content-between">
            <div className="filter col-6 row">
                <NameFilter
                    onKeyPress={onKeyPress}
                    value={filterState.name}
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