import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    scales,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AssessmentCourseBarChart({ chartData, title }) {
    const data = {
        labels: chartData.labels.map((label) =>
            label.length > 15 ? label.slice(0, 15) + '...' : label
        ),
        datasets: [
            {
                label: "Total Assessment Courses Taken",
                data: chartData.data, // Y-axis: Total assessment courses taken
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "top" },
            title: { display: false, text: title },
        },
        scales: {
            x: {
                type: "category", // Ensure categorical X-axis
                title: { display: false, text: "Courses" },
            },
            y: {
                title: { display: false, text: "Total Assessment Courses Taken" },
                beginAtZero: true,
            },
        },
    };

    return <Bar data={data} options={options} />;
}
