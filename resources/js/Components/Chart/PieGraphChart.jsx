import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const PieChart = ({ correctCount, incorrectCount }) => {
    const total = correctCount + incorrectCount;

    const data = {
        labels: ["Correct Responses", "Incorrect Responses"],
        datasets: [
            {
                data: [correctCount, incorrectCount],
                backgroundColor: ["#36A2EB", "#FF6384"],
                hoverBackgroundColor: ["#2d91d3", "#e04a5e"],
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    font: {
                        size: 14,
                    },
                    generateLabels: (chart) => {
                        return chart.data.labels.map((label, i) => {
                            let value = chart.data.datasets[0].data[i];
                            let percentage = ((value / total) * 100).toFixed(2);
                            return {
                                text: `${label}: ${value} (${percentage}%)`,
                                fillStyle: chart.data.datasets[0].backgroundColor[i],
                                hidden: false,
                            };
                        });
                    },
                },
            },
        },
    };

    return (
        <div className="w-full max-w-sm mx-auto mb-5" style={{ height: "250px" }}>
            <h6 className="text-center text-lg font-semibold mb-2">Response Distribution</h6>
            <Pie data={data} options={options} />
        </div>
    );
};

export default PieChart;
