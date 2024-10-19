import { INITIAL_COURSE_STATE } from "@/Library/filterState";
import { useCombinedState, useOtherState } from "@/Library/hooks";
import TextInputFilter from "./Filters/TextInputFilter";
import "../../../css/filter.css";
import OtherFilter from "./Filters/otherFilter";
import { COURSE_FILTER_COMPONENT } from "@/Library/constants";

export default function CourseFilters({
    visibleColumns,
    onColumnChange,
    queryParams = {},
}){  

    const {state, setState,updateUrlWithAllStates} = useCombinedState(INITIAL_COURSE_STATE(queryParams),"admin.course.index",COURSE_FILTER_COMPONENT);
    const{otherState,handleClearInput,handleInputChange,handleOtherChange,onKeyPress} = useOtherState(state.otherState,setState,updateUrlWithAllStates);
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