import { useOtherState } from "@/Library/hooks";
import TextInputFilter from "./Filters/TextInputFilter";
import "../../../css/filter.css";
import OtherFilter from "./Filters/otherFilter";
import { useContext, useEffect } from "react";
import ContextProvider from "../Tables/TableContext";

export default function CourseFilters({}){  

    const {state,dispatch,visibleColumns,onColumnChange} = useContext(ContextProvider);
    const { handleInputChange,handleOtherChange,onKeyPress } = useOtherState(dispatch);
    const {otherState} = state;
    
    return(
        <>
            <div className="filter col-lg-4 col-md-6 col-xs-4 px-0">
                <div className="col w-100 input-container">
                    <TextInputFilter
                        onKeyPress={onKeyPress}
                        value={otherState.title}
                        filterKey={'title'}
                        handleInputChange={handleInputChange}
                        handleClearInput={handleOtherChange}
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