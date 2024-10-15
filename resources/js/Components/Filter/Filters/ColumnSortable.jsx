import { capitalizeFirstLetter, splitSortState } from "@/Library/utils";

export default function ColumnSortable({fieldName,sortState = null, changeSort }) {
    const { field, direction } = splitSortState(sortState);
    return (
        <th className="clickable" onClick={() => changeSort(fieldName)}>
            <div className="d-flex flex-row justify-content-start">
                <span className="align-content-center">{capitalizeFirstLetter(fieldName)}</span>
                {sortState !== null && (
                    <div className="d-flex flex-column justify-content-center align-items-center icon-container">
                        <span
                            className={`material-symbols-outlined icon-up ${
                                field === fieldName && direction === 'desc' ? 'd-none' : ' icon-down'
                            }`}
                        >
                            keyboard_arrow_up
                        </span>
                        <span
                            className={`material-symbols-outlined icon-down ${
                                field === fieldName && direction === 'asc' ? 'd-none' : ' icon-up'
                            }`}
                        >
                            keyboard_arrow_down
                        </span>
                    </div>
                )}
            </div>
        </th>
    );
}