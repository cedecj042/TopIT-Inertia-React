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
            <div className="col">
                <div className="row justify-content-end">
                    <div className="col">
                        <ColumnFilter
                            visibleColumns={visibleColumns}
                            onColumnChange={onColumnChange}
                        />
                    </div>
                    <div className="col-3">
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
                </div>
            </div>
        </>
    );
}
