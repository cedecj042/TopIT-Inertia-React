import SelectInput from "../../SelectInput";

export default function YearFilter({yearValue,filters,handleFilterChange}) {
    return (
        <div className="mb-3">
            <label htmlFor="yearSelect" className="form-label">
                Year
            </label>
            <SelectInput
                onChange={(e) => handleFilterChange("year", e.target.value)}
                value={yearValue}
                className={` form-select ${yearValue === "" ? 'text-secondary' : ''}`}
                id="schoolYearSelect"
            >
                <option value="" disabled >Select year</option>
                {filters.years.map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </SelectInput>
        </div>
    );
}
