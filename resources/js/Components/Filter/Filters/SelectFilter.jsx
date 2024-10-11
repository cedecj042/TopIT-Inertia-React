import SelectInput from "../../SelectInput";
import {capitalizeFirstLetter} from '../../../Library/utils';

export default function SelectFilter({keyValue,filterKey,data,handleFilterChange}) {
    return (
        <div className="mb-3">
            <label htmlFor={`${filterKey}Select`} className="form-label">
                {capitalizeFirstLetter(filterKey)}
            </label>
            <SelectInput
                onChange={(e) => handleFilterChange(filterKey, e.target.value)}
                value={keyValue}
                
                className={` form-select ${keyValue === "" ? 'text-secondary' : ''}`}
                id={`${filterKey}Select`}
            >
                <option value="" disabled >Select {filterKey}</option>
                {data.map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </SelectInput>
        </div>
    );
}
