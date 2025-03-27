import HighLowChart from "@/Components/Chart/HighLowChart";
import { AdminContent } from "@/Components/LayoutContent/AdminContent";
import '../../../css/chart.css';
import Pagination from "@/Components/Pagination";
import { TableContext } from "@/Components/Context/TableContext";
import StudentFilters from "@/Components/Filter/StudentFilters";
import StudentsTable from "@/Components/Tables/StudentsTable";
import { INITIAL_STUDENT_STATE } from "@/Library/filterState";
import { STUDENT_COLUMN, STUDENT_FILTER_COMPONENT } from "@/Library/constants";
import BarChart from "@/Components/Chart/BarChart";

function Reports({
    highlowData,
    difficultyDistribution,
    discriminationIndex,
    students,
    queryParams,
    filters
}){
    console.log(discriminationIndex);
    return(
        <>
            <div className="container-fluid p-5">
                <div className="row justify-content-center">
                    <h3 className="fw-bold mb-3">Reports</h3>
                    <div className="col-12 mt-2">
                        <h5 className="fw-semibold mb-3">List of Students</h5>
                        <TableContext
                            initialState={INITIAL_STUDENT_STATE(queryParams)}
                            routeName={"admin.report"}
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
                    <div className="col-12 chart-height p-2">
                        <HighLowChart chartData={highlowData}/>
                    </div>
                </div>
                <div className="row justify-content-center mt-5 g-0">
                    <h3 className="fw-bold mb-3">Question Report</h3>
                    <div className="col-6 chart-height p-4">
                        <BarChart chartData={difficultyDistribution} title={'Difficulty Distribution'}/>
                    </div>
                    <div className="col-6 chart-height p-4">
                        <BarChart chartData={difficultyDistribution} title={'Difficulty Distribution'}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminContent(Reports);