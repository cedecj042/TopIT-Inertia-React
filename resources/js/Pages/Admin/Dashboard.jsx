import AdminLayout from "@/Layouts/AdminLayout";
import "../../../css/admin/dashboard.css";
import { Head, router, usePage } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import StudentsTable from "@/Components/Tables/StudentsTable";
import StudentsLineChart from "@/Components/Chart/StudentsLineChart";
import ThetaScoreBar from "@/Components/Chart/ThetaScoreBar";
import StudentFilters from "@/Components/Filter/StudentFilters";
import { STUDENT_COLUMN } from "@/Library/constants";
import { useColumnVisibility } from "@/Library/hooks";
import { useEffect } from "react";
import { toast } from "sonner";
export default function Dashboard({
    students,
    chartData,
    title,
    thetaScoreData,
    filters,
    queryParams
}) {
    const { visibleColumns, onColumnChange } = useColumnVisibility(STUDENT_COLUMN);

    const { props } = usePage();
    useEffect(() => {
        if (props.flash.success) {
            toast.success(props.flash.success, { duration: 3000 });
        }
    }, [props.flash.success]);
    return (
        
        <AdminLayout title={title}> 
            <Head title={title}/>
            <div className="row p-3">
                <div className="row justify-content-center mt-5 px-5">
                    <h3 className="fw-bold">Dashboard</h3>
                    <div className="row mt-2 p-0">
                        <div className="d-flex flex-column col-12">
                            <h5 className="fw-bolder mb-3">List of Students</h5>
                            <StudentFilters
                                queryParams={queryParams}
                                filters={filters}
                                visibleColumns={visibleColumns}
                                onColumnChange={onColumnChange}
                            />
                            <StudentsTable
                                students={students.data}
                                visibleColumns={visibleColumns}
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
                <h5 className="fw-semibold">Total Number of Students Registered</h5>
                <div className="chart-container">
                    <StudentsLineChart chartData={chartData} />
                </div>
            </div>
        </AdminLayout>
    );
}
