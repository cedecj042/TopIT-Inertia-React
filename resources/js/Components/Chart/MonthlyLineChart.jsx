import {Bar, Line} from 'react-chartjs-2';
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


export default function MonthlyLineChart({ chartData,label,caption }) {
    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: label,
                data: chartData.data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio:true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: caption,
            },
        },
    };

    return <Line data={data} options={options}/>;
}