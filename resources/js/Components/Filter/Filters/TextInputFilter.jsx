import TextInput from "../../TextInput";

export default function TextInputFilter({value,filterKey,handleInputChange,handleClearInput,onKeyPress}) {
    return (
        <div className="col input-container">
            <TextInput
                type="text"
                className="form-control"
                placeholder={`Search by ${filterKey}`}
                value={value}
                name={filterKey}
                onChange={handleInputChange}
                onKeyPress={(e) => onKeyPress(filterKey, e)}
            />
            {value ? (
                <span
                    className="material-symbols-outlined input-icon"
                    onClick={() => handleClearInput(filterKey)}
                    style={{ cursor: "pointer" }}
                >
                    close
                </span>
            ) : (
                <span className="material-symbols-outlined input-icon">
                    search
                </span>
            )}
        </div>
    );
}
