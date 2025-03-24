import { useOtherState, useSortState } from "@/Library/hooks";
import TextInputFilter from "./Filters/TextInputFilter";
import "../../../css/filter.css";
import OtherFilter from "./Filters/OtherFilter";
import { useContext, useEffect } from "react";
import ContextProvider from "../Context/TableContext";
import ClearFunction from "./Filters/ClearFunction";
import { INITIAL_COURSE_STATE } from "@/Library/filterState";

export default function CourseFilters({ }) {

    const { state, dispatch, visibleColumns, onColumnChange } = useContext(ContextProvider);
    const { handleInputChange, handleOtherChange, onKeyPress } = useOtherState(dispatch);
    const { otherState } = state;
    const {handleClearSort} = useSortState(dispatch);

    return (
        <>
            <ClearFunction
                currentState={state.sortState}
                initialState={INITIAL_COURSE_STATE().sortState}
                handleClearFunction={handleClearSort}
                label={"sort"}
            />
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