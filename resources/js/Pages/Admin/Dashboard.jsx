import AdminLayout from "@/Layouts/AdminLayout";
import "../../../css/admin/dashboard.css";
import { Head, router } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import StudentsTable from "@/Components/StudentsTable";
import StudentsLineChart from "@/Components/Chart/StudentsLineChart";
import ThetaScoreBar from "@/Components/Chart/ThetaScoreBar";
import Filters from "@/Components/Filter/Filters";
import {useState } from 'react';
export default function Dashboard({
    students,
    chartData,
    title,
    thetaScoreData,
    filters,
    queryParams
}) {
    const [visibleColumns, setVisibleColumns] = useState({
        student_id: true,
        firstname: true,
        lastname: true,
        school: true,
        year: true,
        created_at: true,
    });

    const onColumnChange = (columnName, isVisible) => {
        if (columnName === "all") {
            setVisibleColumns({
                student_id: isVisible,
                firstname: isVisible,
                lastname: isVisible,
                school: isVisible,
                year: isVisible,
                created_at: isVisible,
            });
        } else {
            setVisibleColumns((prev) => ({
                ...prev,
                [columnName]: isVisible,
            }));
        }
    };

    return (
        <AdminLayout title={title}> 
            <Head title={title}/>
            <div className="row p-3">
                <div className="row justify-content-center mt-4 px-5">
                    <h3 className="fw-bold">Dashboard</h3>
                    <div className="row mt-3 pt-4">
                        <div className="d-flex flex-column col-12">
                            <h5 className="fw-bolder mb-3">List of Students</h5>
                            <Filters
                                queryParams={queryParams}
                                filters={filters}
                                visibleColumns={visibleColumns}
                                onColumnChange={onColumnChange}
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
