import { useOtherState } from "@/Library/hooks";
import TextInputFilter from "./Filters/TextInputFilter";
import "../../../css/filter.css";
import OtherFilter from "./Filters/otherFilter";
import { useContext, useEffect } from "react";
import ContextProvider from "../Context/TableContext";

export default function CourseFilters({}){  

    const {state,dispatch,visibleColumns,onColumnChange} = useContext(ContextProvider);
    const { handleInputChange,handleOtherChange,onKeyPress } = useOtherState(dispatch);
    const {otherState} = state;
    
    return(
        <>
            <div className="row g-0 w-100">
                <div className="col-md-8 col-lg-5 input-container mb-3">
                    <TextInputFilter
                        onKeyPress={onKeyPress}
                        value={otherState.title}
                        filterKey={'title'}
                        handleInputChange={handleInputChange}
                        handleClearInput={handleOtherChange}
                    />
                </div>
                <div className="col-md-4 col-lg-3 offset-md-0 offset-lg-4 ps-2">
                    <div className="d-grid grid-template-2">
                        <OtherFilter
                            visibleColumns={visibleColumns}
                            onColumnChange={onColumnChange}
                            handleOtherChange={handleOtherChange}
                            otherState={otherState}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}