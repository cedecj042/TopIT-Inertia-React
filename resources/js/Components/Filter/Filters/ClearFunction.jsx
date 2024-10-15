import { areFiltersApplied, capitalizeFirstLetter } from "@/Library/utils";

export default function ClearFunction({
    currentState,
    initialState,
    handleClearFunction,
    label,
}) {
    const resetFilters = () => {
        if (label === "filter") {
            handleClearFunction(Object.keys(initialState));
        }
        else if (label === "sort") {
            handleClearFunction();
        }
    };
    const filtersApplied = areFiltersApplied(initialState, currentState);
    // Handling sortState which is a combined string (field:direction)
    const sortApplied = label === "sort" && currentState !== initialState;
    return (
        <>
             {filtersApplied || sortApplied ? (
                <div className="btn-toolbar d-flex gap-1 mb-3">
                    <small>Applied {capitalizeFirstLetter(label)}: </small>

                    {/* Display applied filters */}
                    {label === "filter" &&
                        Object.keys(currentState).map(
                            (key) =>
                                currentState[key] !== initialState[key] && (
                                    <span
                                        key={key}
                                        className="badge rounded-pill bg-info d-inline-flex align-items-center"
                                    >
                                        {capitalizeFirstLetter(key)}:{" "}
                                        {currentState[key]}
                                    </span>
                                )
                        )}

                    {/* Display applied sorting */}
                    {label === "sort" && (
                        <span className="badge rounded-pill bg-info d-inline-flex align-items-center">
                            {capitalizeFirstLetter(currentState.split(":")[0])}:{" "}
                            {currentState.split(":")[1] === "asc"
                                ? "A-Z"
                                : "Z-A"}
                        </span>
                    )}

                    <a
                        onClick={resetFilters}
                        className="badge rounded-pill bg-light text-dark text-decoration-none clickable"
                    >
                        Clear {capitalizeFirstLetter(label)}
                    </a>
                </div>
            ) : null}
        </>
    );
}
