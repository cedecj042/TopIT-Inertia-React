import SelectInput from "@/Components/SelectInput";
import ColumnFilter from "./ColumnFilter";

export default function OtherFilter({
    visibleColumns = [],
    onColumnChange = null,
    handleOtherChange,
    otherState
}) {
    return (
        <>
            <>
                {Array.isArray(visibleColumns) && visibleColumns.length > 0 && (
                    <ColumnFilter
                        visibleColumns={visibleColumns}
                        onColumnChange={onColumnChange}
                    />
                )}
                <SelectInput
                    className=" form-select"
                    onChange={(e) => handleOtherChange("items", e.target.value)}
                    defaultValue={otherState.items}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                </SelectInput>
            </>
        </>
    );
}
