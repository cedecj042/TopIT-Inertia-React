import TextInput from "../../TextInput";

export default function NameFilter({value,handleInputChange,handleClearInput,onKeyPress}) {
    return (
        <div className="col input-container">
            <TextInput
                type="text"
                className="form-control"
                placeholder="Search by name"
                value={value}
                onChange={handleInputChange}
                onKeyPress={(e) => onKeyPress("name", e)}
            />
            {value ? (
                <span
                    className="material-symbols-outlined input-icon"
                    onClick={handleClearInput}
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
