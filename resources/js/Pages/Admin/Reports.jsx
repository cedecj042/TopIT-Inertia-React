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
import ProgressIndexChart from "@/Components/Chart/ProgressIndexChart";
import { Link, router } from "@inertiajs/react";
import AssessmentCourseBarChart from "@/Components/Chart/AssessmentCourseBarChart";
import { useEffect, useState } from "react";
import SelectInput from "@/Components/SelectInput";

function Reports({
    highlowData,
    difficultyDistribution,
    questionLogsData,
    totalAssessmentCourses,
    students,
    queryParams = {},
    filters,
    courses
}) {
    const [courseState, setCourseState] = useState();

    useEffect(() => {
        if (courseState) {
            handleChangeFilter();
        }
    }, [courseState]);
    useEffect(() => {
        if (queryParams?.question_course) {
            setCourseState(queryParams.question_course);
        }
    }, [queryParams?.question_course]);
    const handleChangeFilter = () => {
        router.get(route('admin.report'), { ...queryParams, question_course: courseState }, { preserveState: true, preserveScroll: true, replace: true })
    }

    return (
        <>
            <div className="container-fluid p-5">
                <h3 className="fw-bold mb-3">Reports</h3>
                <div className="row justify-content-center mt-3 g-0">
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
                        <Pagination links={students.meta.links} queryParams={queryParams}  />

                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col-12">
                        <div className="d-flex justify-content-between">
                            <h5 className="fw-bold">Assessment Report</h5>
                            <Link href={route('admin.assessments.index')} className="btn btn-outline-primary">View Assessment History</Link>
                        </div>

                    </div>
                    <div className="col-12 chart-height p-4">
                        <h6 className="text-center fw-semibold">Total Courses Taken Per Assessment</h6>
                        <AssessmentCourseBarChart chartData={totalAssessmentCourses} title="Total Courses Taken Per Assessment" />;
                    </div>
                    <div className="col-12 chart-height p-4 mt-5">
                        <h6 className="text-center fw-semibold">Ability Scores per Course (High, Low, and Average)</h6>
                        <HighLowChart chartData={highlowData} />
                    </div>

                </div>
                <div className="row justify-content-center mt-5 g-0">
                    <h5 className="fw-bold mb-0 align-content-center mb-3">Question Report</h5>
                    <div className="d-flex justify-content-between">
                        <div className="d-flex flex-row align-items-center gap-3">
                            <label htmlFor="">Course</label>
                            <SelectInput
                                onChange={(e) => setCourseState(e.target.value)}
                                value={courseState}
                                className={`form-select ${courseState === "" ? 'text-secondary' : ''}`}
                                id="courseSelect"
                            >
                                <option value="">All Courses</option>
                                {courses.map((item) => (
                                    <option key={item.course_id} value={item.course_id}>
                                        {item.title}
                                    </option>
                                ))}
                            </SelectInput>
                        </div>
                        <Link href={route('admin.question.index')} className="btn btn-outline-primary">View Question Bank</Link>
                    </div>
                    <div className="col-12 chart-height p-4">
                        <h6 className="text-center fw-semibold">Difficulty Distribution</h6>
                        <BarChart chartData={difficultyDistribution} />
                    </div>
                </div>
                {/* <div className="row justify-content-center mt-5 g-0">
                    <div className="d-flex justify-content-between">
                        <h5 className="fw-bold mb-0 align-content-center">Recalibration Report</h5>
                        <Link href={route('admin.recalibration.index')} className="btn btn-outline-primary">View Recalibration Logs</Link>
                    </div>
                    <div className="row mt-5">
                        <div className="col-6 chart-height p-4">
                            <h6 className="text-center fw-semibold">Recent Discrimination Changes</h6>
                            <ProgressIndexChart
                                data={questionLogsData}
                                title="Discrimination Index"
                                metricKeys={{ previous: "previous_discrimination_index", new: "new_discrimination_index" }}
                                yAxisRange={{ min: 0, max: 5 }}
                            />
                        </div>
                        <div className="col-6 chart-height p-4">
                            <h6 className="text-center fw-semibold">Recent Difficulty Value Changes</h6>
                            <ProgressIndexChart
                                data={questionLogsData}
                                title="Difficulty Value"
                                metricKeys={{ previous: "previous_difficulty_value", new: "new_difficulty_value" }}
                                yAxisRange={{ min: -5, max: 5 }}
                            />
                        </div>
                    </div>
                </div> */}
            </div>
        </>
    )
}

export default AdminContent(Reports);