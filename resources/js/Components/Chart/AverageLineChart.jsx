import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function AverageLineChart({ chartData, label, caption }) {
    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: label,
                data: chartData.data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Line background color
                borderColor: 'rgba(75, 192, 192, 1)', // Line border color
                borderWidth: 2, // Line thickness
                tension: 0.4, // Smooth curve for line chart
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top', // Legend position
            },
            title: {
                display: true, // Display chart title
                text: caption, // Chart caption
            },
        },
        scales: {
            y: {
                beginAtZero: false, // Start at -5 instead of 0
                min: -5, // Minimum value on the y-axis
                max: 5, // Maximum value on the y-axis
                ticks: {
                    stepSize: 1, // Increment steps by 1
                },
            },
        },
    };

    return <Line data={data} options={options} />;
}
