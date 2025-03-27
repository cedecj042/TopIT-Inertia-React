import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const DiscriminationIndexChart = ({ data }) => {
    const chartData = {
        labels: data.map((q) => q.question), // X-axis: Question labels
        datasets: [
            {
                label: "Previous Discrimination Index",
                data: data.map((q) => q.previous), // Y-axis: Previous values
                borderColor: "rgba(255, 99, 132, 1)", // Red color
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                fill: false,
                tension: 0.3,
            },
            {
                label: "New Discrimination Index",
                data: data.map((q) => q.new), // Y-axis: New values
                borderColor: "rgba(54, 162, 235, 1)", // Blue color
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                fill: false,
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            tooltip: { enabled: true },
        },
        scales: {
            y: { beginAtZero: true },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default DiscriminationIndexChart;
