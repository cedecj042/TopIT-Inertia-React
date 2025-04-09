import { useState, useEffect } from "react";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import "../../../../css/date.css";

export default function DateRangeFilter({ from, to, onDateChange, onDateClear }) {
    const createLocalDate = (dateString) => {
        if (!dateString) return null;
        const [year, month, day] = dateString.split('-');
        return new Date(year, month - 1, day);
    };

    const formatDate = (date) => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [dateRange, setDateRange] = useState([
        createLocalDate(from),
        createLocalDate(to),
    ]);

    useEffect(() => {
        setDateRange([
            createLocalDate(from),
            createLocalDate(to),
        ]);
    }, [from, to]);

    const handleDateChange = (value) => {
        if (value) {
            const [selectedFrom, selectedTo] = value;
            setDateRange([selectedFrom, selectedTo]);
            if (onDateChange) {
                onDateChange(
                    selectedFrom ? formatDate(selectedFrom) : "",
                    selectedTo ? formatDate(selectedTo) : ""
                ); 
            }
        }
    };

    return (
        <DateRangePicker
            value={dateRange}
            onChange={handleDateChange}
            format="yyyy-MM-dd"
            placeholder="Select Date Range"
            className="w-100"
            ranges={[]} 
            cleanable
            onClean={() => {
                if (onDateClear) {
                    onDateClear();
                }
                setDateRange([null, null]);
            }}
        />
    );
}