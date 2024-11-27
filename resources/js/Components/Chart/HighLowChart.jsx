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

export default function HighLowChart({ data }) {
  const colors = [
    'rgba(75, 192, 192, 0.5)', // Color for low segment
    'rgba(255, 99, 132, 0.5)', // Color for high segment
  ];

  const borderColors = [
    'rgba(75, 192, 192, 1)', // Border for low segment
    'rgba(255, 99, 132, 1)', // Border for high segment
  ];

  const data = {
    labels: data.labels.map(label =>
      label.length > 20 ? label.slice(0, 20) + '...' : label
    ), // Course labels
    datasets: [
      {
        label: 'Low Score',
        data: data.low, // Low score per course
        backgroundColor: colors[0],
        borderColor: borderColors[0],
        borderWidth: 1,
      },
      {
        label: 'High Score',
        data: data.high.map((high, idx) => high - data.low[idx]), // Difference between high and low score
        backgroundColor: colors[1],
        borderColor: borderColors[1],
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
        text: 'Theta Scores per Course (High and Low)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: -5,
        max: 5,
      },
      x: {
        stacked: true, // Enable stacking
      },
      y: {
        stacked: true, // Enable stacking
      },
    },
  };

  return <Bar data={data} options={options} />;
}
