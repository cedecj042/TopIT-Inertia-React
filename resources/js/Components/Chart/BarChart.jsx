import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChart({ chartData, title }) {
    const labels = chartData.labels;
    const datasets = [
        {
            label: 'Total Questions',
            data: chartData.totalCounts,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        },
        {
            label: 'Identification',
            data: chartData.questionTypeData['Identification'],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        },
        {
            label: 'Multiple Choice - Single',
            data: chartData.questionTypeData['Multiple Choice - Single'],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        },
        {
            label: 'Multiple Choice - Many',
            data: chartData.questionTypeData['Multiple Choice - Many'],
            backgroundColor: 'rgba(255, 206, 86, 0.5)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
        }
    ];

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "top" },
            title: { display: false, text: title },
        },
        scales: {
            x: { stacked: false },
            y: { stacked: false }
        }
    };

    return <Bar data={{ labels, datasets }} options={options} />;
}
