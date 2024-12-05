import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function ProgressLineChart({ progressData }) {
    console.log("Progress Data Received:", progressData);
    const originalData = progressData?.original;
    if (!originalData || !originalData.labels || !originalData.datasets || originalData.labels.length === 0) {
        return <p>Loading chart data...</p>;
    }

    const data = {
        labels: originalData.labels.map((label) =>
            label.length > 20 ? label.slice(0, 20) + "..." : label
        ),
        datasets: originalData.datasets,
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Progress per Course",
            },
        },
        scales: {
            x: {
                type: "category",
                title: {
                    display: true,
                    text: "Date",
                },
            },
            y: {
                beginAtZero: true,
                suggestedMin: -5,
                suggestedMax: 5,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    console.log("Chart Data Prepared:", data);
    return <Line data={data} options={options} />;
}
