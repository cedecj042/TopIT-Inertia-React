import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, 
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function MonthlyBarChart({ chartData, label, caption }) {
    const data = {
        labels: chartData.labels, // X-axis labels
        datasets: [
            {
                label: label, // Label for the bar dataset
                data: chartData.data, // Y-axis data points
                backgroundColor: '#ed623c', // Bar color
                borderColor: '#ed623c', // Border color for bars
                borderWidth: 1, // Border thickness
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top', // Position of the legend
            },
            title: {
                display: true,
                text: caption, // Title text
            },
        },
        scales: {
            y: {
                beginAtZero: true, // Start y-axis at 0
                min: 0, // Set minimum value
                max: 200, // Set maximum value (adjust as needed)
                ticks: {
                    stepSize: 25, // Increment tick marks by 50
                },
            },
        },
    };

    return <Bar data={data} options={options} />;
}
