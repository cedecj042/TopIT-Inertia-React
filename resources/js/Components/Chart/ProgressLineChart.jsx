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
    if (!progressData || !progressData.labels || progressData.labels.length === 0) {
        return;
    }

    const formatDateLabel = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}`;
    };

    const data = {
        labels: progressData.labels.map(formatDateLabel),
        datasets: progressData.datasets.map(dataset => ({
            ...dataset,
            data: dataset.data
        })),
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
                text: "Course",
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

    return <Line data={data} options={options} />;
}