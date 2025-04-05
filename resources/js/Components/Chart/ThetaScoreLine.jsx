import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function ThetaScoreLine({ thetaScoreData }) {
    const colors = 'rgba(75, 192, 192, 1)'; // Line color

    const data = {
        labels: thetaScoreData.labels.map((label) =>
            label.length > 20 ? label.slice(0, 20) + '...' : label
        ), 
        datasets: [
            {
                label: 'Ability Score per Course',
                data: thetaScoreData.data, 
                borderColor: colors,
                backgroundColor: 'rgba(75, 192, 192, 0.2)', 
                borderWidth: 2, 
                pointBackgroundColor: colors, 
                tension: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Ability Score per Course',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                min: -5,
                max: 5, // Customize as needed
                ticks: {
                    stepSize: 1, // Increment by 1 on the y-axis
                },
            },
        },
    };

    return <Line data={data} options={options} />;
}
