import SelectInput from "@/Components/SelectInput";
import ColumnFilter from "./ColumnFilter";

export default function OtherFilter({
    visibleColumns,
    onColumnChange,
    handleOtherChange,
    otherState
}) {
    return (
        <>
            <div className="d-grid grid-template-2">
                <ColumnFilter
                    visibleColumns={visibleColumns}
                    onColumnChange={onColumnChange}
                />
                <SelectInput
                    className=" form-select"
                    onChange={(e) => handleOtherChange("items", e.target.value)}
                    defaultValue={otherState.items}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                </SelectInput>
            </div>
        </>
    );
}
