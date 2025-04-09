import "../../../css/admin/dashboard.css";
import "../../../css/chart.css";
import { AdminContent } from "@/Components/LayoutContent/AdminContent";
import MonthlyBarChart from "@/Components/Chart/MonthlyBarChart";
import PdfContent from "@/Components/Content/PdfContent";
import { useState } from "react";
import { router } from "@inertiajs/react";

function Dashboard({ pdfs, cards, chartData: initialChartData }) {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [chartData, setChartData] = useState(initialChartData);
    const [isLoading, setIsLoading] = useState(false);

    const cardEntries = Object.entries(cards);
    const pastelColors = [
        "rgba(255, 204, 204, 0.6)",
        "rgba(180, 223, 255, 0.6)",
        "rgba(191, 235, 193, 0.6)",
        "rgba(255, 223, 186, 0.6)",
    ];

    const handleYearChange = (newYear) => {
        if (newYear > currentYear) return;

        setIsLoading(true);
        setSelectedYear(newYear);

        router.get(
            route("admin.dashboard"),
            { year: newYear },
            {
                preserveState: true,
                preserveScroll: true,
                only: ["chartData"],
                onSuccess: (page) => {
                    setChartData(page.props.chartData);
                    setIsLoading(false);
                },
            }
        );
    };

    return (
        <div className="container-fluid p-5">
            <div className="row mb-5">
                <h3 className="fw-bold">Dashboard</h3>
                {cardEntries.map(([label, value], index) => (
                    <div className="col-md-3" key={index}>
                        <div
                            className="card"
                            style={{
                                backgroundColor:
                                    pastelColors[index % pastelColors.length],
                            }}
                        >
                            <div className="card-body d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <label className="card-title">
                                        {label}
                                    </label>
                                    <h3 className="card-value fw-semibold text-end">
                                        {value}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="row mb-5">
                <h5 className="fw-semibold">Recent PDF Uploads</h5>
                <div className="col-12">
                    <div className="row g-1">
                        <PdfContent pdf={pdfs.data} />
                    </div>
                </div>
            </div>
            <div className="row mb-5">
                <h5 className="fw-semibold">
                    Total Number of Students Registered
                </h5>
                <div className="chart-container">
                    <div className="chart-height d-flex justify-content-center">
                        {isLoading ? (
                            <div
                                className="d-flex justify-content-center align-items-center"
                                style={{ height: "300px" }}
                            >
                                <div
                                    className="spinner-border text-primary"
                                    role="status"
                                >
                                    <span className="visually-hidden">
                                        Loading...
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <MonthlyBarChart
                                chartData={chartData}
                                label={"Number of Students Registered"}
                                caption={`Students Registered by Month (${selectedYear})`}
                            />
                        )}
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => handleYearChange(selectedYear - 1)}
                            disabled={isLoading}
                        >
                            <i className="bi bi-chevron-left"></i> Previous
                        </button>
                        <h6 className="fw-semibold mb-0">{selectedYear}</h6>
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => handleYearChange(selectedYear + 1)}
                            disabled={isLoading || selectedYear >= currentYear}
                        >
                            Next <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminContent(Dashboard);
