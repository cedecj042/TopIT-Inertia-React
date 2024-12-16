import SelectInput from "../../SelectInput";
import { formatFilterKey } from "../../../Library/utils";

export default function SortFilter({ currentSort, filterKey, onSortChange }) {
    const sortingOptions = [
        { value: "created_at:asc", label: "Date (A-Z)" },
        { value: "created_at:desc", label: "Date (Z-A)" },
        { value: "total_score:asc", label: "Total Score (A-Z)" },
        { value: "total_score:desc", label: "Total Score (Z-A)" },
        { value: "total_items:asc", label: "Total Items (A-Z)" },
        { value: "total_items:desc", label: "Total Items (Z-A)" },
    ];

    const handleSortChange = (e) => {
        const selectedOption = sortingOptions.find(
            (option) => option.label === e.target.value
        );
        if (selectedOption) {
            const [field, direction] = selectedOption.value.split(":");
            onSortChange(field, direction); // Callback to parent with field and direction
        }
    };

    return (
        <div className="mb-3">
            <SelectInput
                onChange={(e)=>handleSortChange(e)}
                value={sortingOptions.find((opt) => opt.value === currentSort)?.label || ""} 
                className={`form-select ${currentSort === "" ? "text-secondary" : ""}`}
                id={`${filterKey}Select`}
            >
                <option value="" disabled>
                    Select {formatFilterKey(filterKey)}
                </option>
                {sortingOptions.map((option) => (
                    <option key={option.value} value={option.label}>
                        {option.label}
                    </option>
                ))}
            </SelectInput>
        </div>
    );
}
