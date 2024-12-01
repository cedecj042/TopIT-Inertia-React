import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function HighLowChart({ chartData }) {
  const colors = [
    'rgba(54, 162, 235, 0.4)', // Color for low segment
    'rgba(255, 99, 132, 0.4)', // Color for high segment
  ];

  const borderColors = [
    'rgba(54, 162, 235, 1)', // Border for low segment
    'rgba(255, 99, 132, 1)', // Border for high segment
  ];

  const lineColor = 'rgba(48, 180, 160, 1)'; // Line color for average

  const data = {
    labels: chartData.labels.map(label =>
      label.length > 15 ? label.slice(0, 15) + '...' : label
    ), 
    datasets: [
      {
        label: 'Average Score',
        data: chartData.avg, // Average score per course
        borderColor: lineColor,
        borderWidth: 2,
        pointBackgroundColor: lineColor,
        tension: 0, 
        type: 'line', 
        fill: false,
      },
      {
        label: 'Low Score',
        data: chartData.low, // Low score per course
        backgroundColor: colors[0],
        borderColor: borderColors[0],
        borderWidth: 1,
        type: 'bar', // Explicitly specify bar type
      },
      {
        label: 'High Score',
        data: chartData.high.map((high, idx) => high - chartData.low[idx]), // Difference between high and low score
        backgroundColor: colors[1],
        borderColor: borderColors[1],
        borderWidth: 1,
        type: 'bar', // Explicitly specify bar type
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
        text: 'Theta Scores per Course (High, Low, and Average)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: -5,
        max: 5,
        ticks: {
          stepSize: 1, 
        },
      },
      x: {
        stacked: true, 
      },
    },
  };

  return <Bar data={data} options={options} />;
}
