import { useOtherState } from "@/Library/hooks";
import "../../../css/filter.css";
import OtherFilter from "./Filters/otherFilter";
import { useContext } from "react";
import ContextProvider from "../Context/TableContext";

export default function AdminFilters({ }) {

    const { state, dispatch, visibleColumns, onColumnChange } = useContext(ContextProvider);
    const { handleOtherChange } = useOtherState(dispatch);
    const { otherState } = state;

    return (
        <>
            <OtherFilter
                visibleColumns={visibleColumns}
                onColumnChange={onColumnChange}
                handleOtherChange={handleOtherChange}
                otherState={otherState}
            />
        </>
    )
}