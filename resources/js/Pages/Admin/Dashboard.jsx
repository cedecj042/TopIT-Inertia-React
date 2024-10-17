import AdminLayout from "@/Layouts/AdminLayout";
import "../../../css/admin/dashboard.css";
import { usePage } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import StudentsTable from "@/Components/Tables/StudentsTable";
import StudentsLineChart from "@/Components/Chart/StudentsLineChart";
import ThetaScoreBar from "@/Components/Chart/ThetaScoreBar";
import StudentFilters from "@/Components/Filter/StudentFilters";
import { AdminContent } from "@/Components/AdminContent";
import { STUDENT_COLUMN, STUDENT_FILTER_COMPONENT } from "@/Library/constants";
import { useColumnVisibility, useCombinedState } from "@/Library/hooks";
import {
    INITIAL_STUDENT_FILTER_STATE,
    INITIAL_STUDENT_OTHER_STATE,
    INITIAL_STUDENT_SORT_STATE,
} from "@/Library/filterState";

function Dashboard({
    students,
    chartData,
    thetaScoreData,
    filters,
    queryParams = {},
}) {
    const { visibleColumns, onColumnChange } =
        useColumnVisibility(STUDENT_COLUMN);

    const {
        filterState,
        sortState,
        otherState,
        handleFilterChange,
        handleClearFilter,
        changeSort,
        handleClearSort,
        handleOtherChange,
        handleInputChange,
        onKeyPress,
    } = useCombinedState(
        INITIAL_STUDENT_FILTER_STATE(queryParams),
        INITIAL_STUDENT_SORT_STATE(queryParams),
        INITIAL_STUDENT_OTHER_STATE(queryParams),
        "admin.dashboard",
        STUDENT_FILTER_COMPONENT
    );

    return (
        <>
            <div className="row p-3">
                <div className="row justify-content-center mt-5 px-5">
                    <h3 className="fw-bold">Dashboard</h3>
                    <div className="row mt-2 p-0">
                        <div className="d-flex flex-column col-12">
                            <h5 className="fw-bolder mb-3">List of Students</h5>
                            <StudentFilters
                                filterState={filterState}
                                sortState={sortState}
                                handleClearFilter={handleClearFilter}
                                handleClearSort={handleClearSort}
                                filters={filters}
                                handleFilterChange={handleFilterChange}
                                otherState={otherState}
                                handleOtherChange={handleOtherChange}
                                handleInputChange={handleInputChange}
                                onKeyPress={onKeyPress}
                                visibleColumns={visibleColumns}
                                onColumnChange={onColumnChange}
                            />
                            <StudentsTable
                                data={students.data}
                                sortState={sortState}
                                visibleColumns={visibleColumns}
                                changeSort={changeSort}
                                keyField={"student_id"}
                                queryParams={queryParams}
                            />
                            <Pagination links={students.meta.links} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row w-100 px-5 mb-3">
                <h5 className="fw-semibold">Average Theta Scores</h5>
                <div className="chart-container">
                    <ThetaScoreBar thetaScoreData={thetaScoreData} />
                </div>
            </div>
            <div className="row w-100 px-5 mb-3">
                <h5 className="fw-semibold">
                    Total Number of Students Registered
                </h5>
                <div className="chart-container d-flex justify-content-center">
                    <StudentsLineChart chartData={chartData} />
                </div>
            </div>
        </>
    );
}

export default AdminContent(Dashboard);