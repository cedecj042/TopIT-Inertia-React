import "../../../css/admin/dashboard.css";
import "../../../css/chart.css";
import Pagination from "@/Components/Pagination";
import StudentsTable from "@/Components/Tables/StudentsTable";
import { AdminContent } from "@/Components/LayoutContent/AdminContent";
import { INITIAL_STUDENT_STATE } from "@/Library/filterState";
import {
    COURSE_COLUMN,
    STUDENT_COLUMN,
    STUDENT_FILTER_COMPONENT,
} from "@/Library/constants";
import { TableContext } from "@/Components/Context/TableContext";
import StudentFilters from "@/Components/Filter/StudentFilters";
import AverageLineChart from "@/Components/Chart/AverageLineChart";
import MonthlyBarChart from "@/Components/Chart/MonthlyBarChart";
import AverageRadarChart from "@/Components/Chart/AverageRadarChart";
import ThetaScoreBar from "@/Components/Chart/ThetaScoreLine";

function Dashboard({
    students,
    cards,
    chartData,
    thetaScoreData,
    filters,
    queryParams = {},
}) {
    const cardEntries = Object.entries(cards);
    const pastelColors = [
        "rgba(255, 204, 204, 0.6)", // Light pink (new first color)
        "rgba(180, 223, 255, 0.6)", // Pastel blue (unchanged)
        "rgba(191, 235, 193, 0.6)", // Pastel green (unchanged)
        "rgba(255, 223, 186, 0.6)", // Soft peach (new last color)
    ];
    return (
        <>
            <div className="container-fluid p-5">
                <div className="row mb-3">
                    <h3 className="fw-bold">Dashboard</h3>
                    {cardEntries.map(([label, value], index) => (
                    <div className="col-md-3" key={index}>
                        <div className="card" style={{backgroundColor: pastelColors[index % pastelColors.length]}}>
                        <div className="card-body d-flex align-items-center">
                            <div className="flex-grow-1">
                            <label className="card-title">{label}</label>
                            <h3 className="card-value fw-semibold text-end">{value}</h3>
                            </div>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                <div className="row mb-3">
                    <h5 className="fw-semibold">
                        Total Number of Students Registered
                    </h5>
                    <div className="chart-height d-flex justify-content-center">
                        <MonthlyBarChart
                            chartData={chartData} 
                            label={'Number of Students Registered'}
                            caption= {'Students Registered by Month'} 
                        />
                    </div>
                </div>
            </div>
            
        </>
    );
}

export default AdminContent(Dashboard);
