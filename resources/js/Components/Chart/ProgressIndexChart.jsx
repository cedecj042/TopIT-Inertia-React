import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ProgressIndexChart({ 
    data, 
    title, 
    metricKeys,
    yAxisRange 
}){
    const chartData = {
        labels: data.map((_, index) => `Q${index + 1}`), 
        datasets: [
            {
                label: `Previous ${title}`,
                data: data.map(q => q[metricKeys.previous]),
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                fill: false,
                tension: 0.3,
            },
            {
                label: `New ${title}`,
                data: data.map(q => q[metricKeys.new]),
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                fill: false,
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "top" },
            tooltip: { enabled: true },
            title: { display: false, text: title },
        },
        scales: {
            y: {
                min: yAxisRange.min,
                max: yAxisRange.max,
            },
            x: {
                ticks: { display: false },
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

