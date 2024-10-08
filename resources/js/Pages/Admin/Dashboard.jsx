import AdminLayout from "@/Layouts/AdminLayout";
import "../../../css/admin/dashboard.css";
import "../../../css/filter.css";
import { Head, router } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import StudentsTable from "@/Components/StudentsTable";
import StudentsLineChart from "@/Components/Chart/StudentsLineChart";
import ThetaScoreBar from "@/Components/Chart/ThetaScoreBar";
import Filters from "@/Components/Filters";
import { useState } from "react";

export default function Dashboard({
    students,
    chartData,
    title,
    thetaScoreData,
    filters,
    queryParams = null,
}) {
    queryParams = queryParams || {};
    const [thetaScores] = useState(() => thetaScoreData);
    const [inputValue, setInputValue] = useState(queryParams.name || "");
    const [yearValue, setYearValue] = useState(queryParams.year || "");
    const [schoolValue, setSchoolValue] = useState(queryParams.school || "");
    const [visibleColumns, setVisibleColumns] = useState({
        student_id: true,
        firstname: true,
        lastname: true,
        school: true,
        year: true,
        created_at: true,
    });

    const searchFieldChange = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }
        router.get(route("admin.dashboard"), queryParams, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const handleColumnChange = (columnName, isVisible) => {
        if (columnName === "all") {
            // Set all columns to visible/hidden based on the "All" checkbox
            setVisibleColumns({
                student_id: isVisible,
                firstname: isVisible,
                lastname: isVisible,
                school: isVisible,
                year: isVisible,
                created_at: isVisible,
            });
        } else {
            // Update individual column visibility
            setVisibleColumns((prev) => ({
                ...prev,
                [columnName]: isVisible,
            }));
        }
    };

    const onKeyPress = (name, e) => {
        if (e.key !== "Enter") return;

        searchFieldChange(name, e.target.value);
    };

    const handleClearFilter = () => {
        setYearValue("");
        setSchoolValue("");
        searchFieldChange("year", "");
        searchFieldChange("school", "");
    };

    const handleClearInput = () => {
        setInputValue("");
        searchFieldChange("name", "");
    };
    const onChange = (e) => {
        setItemsValue(e.target.value);
    };

    return (
        <AdminLayout>
            <Head title={title} />
            <div className="row p-3">
                <div className="row mt-4 px-5">
                    <h3 className="fw-bold">Dashboard</h3>
                    <div className="row mt-3 pt-4">
                        <div className="d-flex flex-column col-12">
                            <h5 className="fw-bolder mb-3">List of Students</h5>
                            <Filters
                                inputValue={inputValue}
                                setInputValue={setInputValue}
                                yearValue={yearValue}
                                setYearValue={setYearValue}
                                schoolValue={schoolValue}
                                setSchoolValue={setSchoolValue}
                                filters={filters}
                                searchFieldChange={searchFieldChange}
                                onKeyPress={onKeyPress}
                                onChange={onChange}
                                visibleColumns={visibleColumns}
                                onColumnChange={handleColumnChange}
                                handleClearFilter={handleClearFilter}
                                handleClearInput={handleClearInput}
                                queryParams={queryParams}
                            />
                            <StudentsTable
                                students={students.data}
                                visibleColumns={visibleColumns}
                            />
                            <Pagination links={students.meta.links} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row w-100 px-5 mb-3">
                <h5 className="fw-semibold">Average Theta Scores</h5>
                <div className="chart-container">
                    <ThetaScoreBar thetaScoreData={thetaScores} />
                </div>
            </div>
        </AdminLayout>
    );
}
