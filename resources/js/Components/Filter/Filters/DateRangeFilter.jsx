import { useState, useEffect } from "react";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import "../../../../css/date.css";

export default function DateRangeFilter({ from, to, onDateChange, onDateClear }) {
    // Ensure initial values are formatted as yyyy-MM-dd
    const formatDate = (date) => (date ? date.toISOString().split('T')[0] : "");

    const [dateRange, setDateRange] = useState([
        from ? new Date(from) : null,
        to ? new Date(to) : null,
    ]);

    useEffect(() => {
        setDateRange([
            from ? new Date(from) : null,
            to ? new Date(to) : null,
        ]);
    }, [from, to]);

    const handleDateChange = (value) => {
        if (value) {
            const [selectedFrom, selectedTo] = value;

            const formattedFrom = formatDate(selectedFrom);
            const formattedTo = formatDate(selectedTo);

            setDateRange([selectedFrom, selectedTo]);

            if (onDateChange) {
                onDateChange("from", formattedFrom);
                onDateChange("to", formattedTo);
            }
        } else {
            setDateRange([null, null]);

            if (onDateClear) {
                onDateClear();
            }
        }
    };

    return (
        <DateRangePicker
            value={dateRange}
            onChange={handleDateChange}
            format="yyyy-MM-dd" // Display format in DateRangePicker
            placeholder="Select Date Range"
            className="w-100"
        />
    );
}
