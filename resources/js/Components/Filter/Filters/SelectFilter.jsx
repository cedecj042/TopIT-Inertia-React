import SelectInput from "../../SelectInput";
import {formatFilterKey} from '../../../Library/utils';

export default function SelectFilter({keyValue,filterKey,data,handleFilterChange}) {
    return (
        <div className="mb-3">
            <label htmlFor={`${filterKey}Select`} className="form-label">
                {formatFilterKey(filterKey)}
            </label>
            <SelectInput
                onChange={(e) => handleFilterChange(filterKey, e.target.value)}
                value={keyValue}
                
                className={` form-select ${keyValue === "" ? 'text-secondary' : ''}`}
                id={`${filterKey}Select`}
            >
                <option value="" disabled >Select {formatFilterKey(filterKey)}</option>
                {data.map((item) => (
                    <option key={item} value={item}>
                        {item}
                    </option>
                ))}
            </SelectInput>
        </div>
    );
}
