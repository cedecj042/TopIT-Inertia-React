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
        ), // Course labels (e.g., Course 1, Course 2)
        datasets: [
            {
                label: 'Theta Score per Course',
                data: thetaScoreData.data, // Average theta scores for each course
                borderColor: colors, // Line color
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Point background color
                borderWidth: 2, // Line thickness
                pointBackgroundColor: colors, // Point color
                tension: 0.4, // Smooth curve
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
                text: 'Theta Score per Course',
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
