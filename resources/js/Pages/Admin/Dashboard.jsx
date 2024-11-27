import "../../../css/admin/dashboard.css";
import Pagination from "@/Components/Pagination";
import StudentsTable from "@/Components/Tables/StudentsTable";
import StudentsLineChart from "@/Components/Chart/StudentsLineChart";
import ThetaScoreBar from "@/Components/Chart/ThetaScoreBar";
import { AdminContent } from "@/Components/LayoutContent/AdminContent";
import { INITIAL_STUDENT_STATE } from "@/Library/filterState";
import {
    COURSE_COLUMN,
    STUDENT_COLUMN,
    STUDENT_FILTER_COMPONENT,
} from "@/Library/constants";
import { TableContext } from "@/Components/Context/TableContext";
import StudentFilters from "@/Components/Filter/StudentFilters";

function Dashboard({
    students,
    chartData,
    thetaScoreData,
    filters,
    queryParams = {},
}) {
    return (
        <>
            <div className="container-fluid p-5">
                <div className="row justify-content-center">
                    <h3 className="fw-bold">Dashboard</h3>
                    <div className="col-12 mt-2">
                        <h5 className="fw-semibold mb-3">List of Students</h5>
                        <TableContext
                            initialState={INITIAL_STUDENT_STATE(queryParams)}
                            routeName={"admin.dashboard"}
                            components={STUDENT_FILTER_COMPONENT}
                            column={STUDENT_COLUMN}
                        >
                            <StudentFilters filters={filters} />
                            <StudentsTable
                                data={students.data}
                                filters={filters}
                                queryParams={queryParams}
                            />
                        </TableContext>
                        <Pagination links={students.meta.links} />
                            
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
