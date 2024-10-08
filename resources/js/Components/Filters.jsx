import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";

export default function Filters({
    inputValue,
    setInputValue,
    yearValue,
    schoolValue,
    filters,
    searchFieldChange,
    onKeyPress,
    handleClearFilter,
    handleClearInput,
    visibleColumns,
    onColumnChange,
    queryParams,
}) {
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    return (
        <div className="row justify-content-between">
            <div className="filter col-6 row">
                <div className="col input-container">
                    <TextInput
                        type="text"
                        className="form-control"
                        placeholder="Search by name or school"
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={(e) =>
                            searchFieldChange("name", e.target.value)
                        }
                        onKeyPress={(e) => onKeyPress("name", e)}
                    />
                    {inputValue ? (
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
                <div className="col-5 dropdown">
                    <button
                        className="btn btn-transparent dropdown-toggle"
                        type="button"
                        id="filterDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        Filters{" "}
                    </button>
                    <div
                        className="dropdown-menu p-3"
                        aria-labelledby="filterDropdown"
                    >
                        <div className="mb-3">
                            <label htmlFor="yearSelect" className="form-label">
                                Year
                            </label>
                            <SelectInput
                                onChange={(e) =>
                                    searchFieldChange("year", e.target.value)
                                }
                                value={yearValue}
                                className=" form-select"
                                id="schoolYearSelect"
                            >
                                <option disabled>Year</option>
                                {filters.years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </SelectInput>
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="schoolSelect"
                                className="form-label"
                            >
                                School
                            </label>
                            <SelectInput
                                onChange={(e) =>
                                    searchFieldChange("school", e.target.value)
                                }
                                value={schoolValue}
                                className=" form-select"
                                id="schoolSelect"
                            >
                                <option disabled>School</option>
                                {filters.schools.map((school) => (
                                    <option key={school} value={school}>
                                        {school}
                                    </option>
                                ))}
                            </SelectInput>
                        </div>
                        <div className="mb-3">
                            <button
                                className="btn btn-light w-100"
                                onClick={handleClearFilter}
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-4 input-container">
                <div className="row justify-content-end">
                    <div className="col d-flex flex-row justify-content-end input-container">
                        <div className="dropdown">
                            <button
                                className="btn btn-transparent dropdown-toggle"
                                type="button"
                                id="columnDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Columns
                            </button>
                            <div
                                className="dropdown-menu p-3"
                                aria-labelledby="columnDropdown"
                            >
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="student_idCheck"
                                        name="student_idCheck"
                                        checked={Object.values(
                                            visibleColumns
                                        ).every(Boolean)} // Check if all columns are true
                                        onChange={(e) =>
                                            onColumnChange(
                                                "all",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="student_idCheck"
                                    >
                                        All
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="student_idCheck"
                                        name="student_idCheck"
                                        checked={visibleColumns.student_id}
                                        onChange={(e) =>
                                            onColumnChange(
                                                "student_id",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="idCheck"
                                    >
                                        ID
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="firstnameCheck"
                                        name="firstname"
                                        checked={visibleColumns.firstname}
                                        onChange={(e) =>
                                            onColumnChange(
                                                "firstname",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="firstnameCheck"
                                    >
                                        First Name
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="lastnameCheck"
                                        name="lastname"
                                        checked={visibleColumns.lastname}
                                        onChange={(e) =>
                                            onColumnChange(
                                                "lastname",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="lastnameCheck"
                                    >
                                        Last Name
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="schoolCheck"
                                        name="school"
                                        checked={visibleColumns.school}
                                        onChange={(e) =>
                                            onColumnChange(
                                                "school",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="schoolCheck"
                                    >
                                        School
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="yearCheck"
                                        name="year"
                                        checked={visibleColumns.year}
                                        onChange={(e) =>
                                            onColumnChange(
                                                "year",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="yearCheck"
                                    >
                                        Year
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="createdAtCheck"
                                        name="created_at"
                                        checked={visibleColumns.created_at}
                                        onChange={(e) =>
                                            onColumnChange(
                                                "created_at",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="createdAtCheck"
                                    >
                                        Created At
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-3">

                        <SelectInput
                            className=" form-select"
                            onChange={(e) =>
                                searchFieldChange("items", e.target.value)
                            }
                            defaultValue={queryParams.items}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </SelectInput>
                    </div>
                </div>
            </div>
        </div>
    );
}
