
import {Bar} from 'react-chartjs-2';
import {Chart as ChartJS, 
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'

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
export default function ThetaScoreBar({ thetaScoreData }) {
    const colors = [
        'rgba(255, 99, 132, 0.2)', // Color for Course 1
        'rgba(54, 162, 235, 0.2)', // Color for Course 2
        'rgba(255, 206, 86, 0.2)', // Color for Course 3
        'rgba(75, 192, 192, 0.2)', // Color for Course 4
        'rgba(153, 102, 255, 0.2)', // Color for Course 5
        'rgba(255, 159, 64, 0.2)',  // Color for Course 6
    ];

    const borderColors = [
        'rgba(255, 99, 132, 1)',   // Border color for Course 1
        'rgba(54, 162, 235, 1)',   // Border color for Course 2
        'rgba(255, 206, 86, 1)',   // Border color for Course 3
        'rgba(75, 192, 192, 1)',   // Border color for Course 4
        'rgba(153, 102, 255, 1)',  // Border color for Course 5
        'rgba(255, 159, 64, 1)',   // Border color for Course 6
    ];

    const data = {
        labels: thetaScoreData.labels.map(label =>
            label.length > 20 ? label.slice(0, 20) + '...' : label
        ),  // Course labels (e.g., Course 1, Course 2)
        datasets: [
            {
                label: 'Average Theta Score per Course',
                data: thetaScoreData.data,  // Average theta scores for each course
                backgroundColor: colors.slice(0, thetaScoreData.labels.length),  // Assign different colors to each bar
                borderColor: borderColors.slice(0, thetaScoreData.labels.length), // Assign different border colors to each bar
                borderWidth: 1,
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
                text: 'Average Theta Score per Course',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                min: -5,
                max: 5,
            },
        },
    };

    return <Bar data={data} options={options} />;
}