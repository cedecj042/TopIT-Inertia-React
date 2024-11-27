import { Bar } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Colors,
} from 'chart.js';

// Register Chart.js modules
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Colors
);

export default function BarChart({data}) {
    const data = {
        labels: data.courses, // X-axis labels
        datasets: [
            {
                label: data.labels,
                data: data.data, // Y-axis values
                backgroundColor: 'rgba(75, 192, 192, 0.5)', // Bar color
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }
        ],
    };

    // Options for the chart
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top', // Legend position
            },
            title: {
                display: true,
                text: 'Monthly Data', // Chart title
            },
        },
    };

    return <Bar data={data} options={options} />
}