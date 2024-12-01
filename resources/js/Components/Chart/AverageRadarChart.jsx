import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function AverageRadarChart({ chartData, label, caption }) {
  const data = {
    labels: chartData.labels.map(label =>
      label.length > 20 ? label.slice(0, 20) + '...' : label
    ), 
    datasets: [
      {
        label: label,
        data: chartData.data, 
        backgroundColor: 'rgba(75, 192, 192, 0.2)', 
        borderColor: 'rgba(75, 192, 192, 1)', 
        borderWidth: 2,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)', 
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
        text: caption, 
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        min: -5,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return <Radar data={data} options={options} />;
}
