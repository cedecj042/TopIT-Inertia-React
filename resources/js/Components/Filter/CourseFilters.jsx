import { COURSE_COLUMN, COURSE_FILTER_COMPONENT } from "@/Library/constants";
import { INITIAL_COURSE_OTHER_STATE } from "@/Library/filterState";
import { useCombinedState } from "@/Library/hooks";
import TextInputFilter from "./Filters/TextInputFilter";
import SelectInput from "../SelectInput";
import ColumnFilter from "./Filters/ColumnFilter";
import "../../../css/filter.css";
import OtherFilter from "./Filters/otherFilter";

export default function CourseFilters({
    visibleColumns,
    onColumnChange,
    queryParams = {},
}){  

    const {
        otherState,
        handleFilterChange,
        handleInputChange,
        handleOtherChange,
        handleClearInput,
        onKeyPress,
    } = useCombinedState(
        null,
        null,
        INITIAL_COURSE_OTHER_STATE(queryParams), 
        "admin.course.index", 
        COURSE_FILTER_COMPONENT
    );
    console.log(otherState)

    return(
        <>
            <div className="filter col-lg-4 col-md-6 col-xs-4 px-0">
                <div className="col w-100 input-container">
                    <TextInputFilter
                        onKeyPress={onKeyPress}
                        value={otherState.title}
                        filterKey={'title'}
                        handleInputChange={handleInputChange}
                        handleClearInput={handleClearInput}
                    />
                </div>
            </div>
            <OtherFilter
                visibleColumns={visibleColumns}
                onColumnChange={onColumnChange}
                handleOtherChange={handleOtherChange}
                otherState={otherState}
            />
        </>
    )
}