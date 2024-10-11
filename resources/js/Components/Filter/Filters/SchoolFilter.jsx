import SelectInput from "../../SelectInput";

export default function SchoolFilter({schoolValue,filters,handleFilterChange}) {
    return (
        <div className="mb-3">
            <label htmlFor="schoolSelect" className="form-label">
                School
            </label>
            <SelectInput
                onChange={(e) => handleFilterChange("school", e.target.value)}
                value={schoolValue}
                className={` form-select ${schoolValue === "" ? 'text-secondary' : ''}`}
                id="schoolSelect"
            >
                <option value="" disabled>Select school</option>
                {filters.schools.map((school) => (
                    <option key={school} value={school}>
                        {school}
                    </option>
                    
                ))}
            </SelectInput>
        </div>
    );
}
