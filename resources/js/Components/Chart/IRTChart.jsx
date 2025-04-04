import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const IRTChart = ({ discrimination, difficulty, discriminationPrev, difficultyPrev }) => {

    const calculateICC = (theta, discrimination, difficulty) => {
        const exponent = -1 * discrimination * (theta - difficulty);
        return 1 / (1 + Math.exp(exponent));
    };

    const thetaValues = Array.from({ length: 34 }, (_, i) => parseFloat((-5 + i * 0.3).toFixed(2)));
    const probabilityValuesCurrent = thetaValues.map((theta) => calculateICC(theta, discrimination, difficulty));
    const probabilityValuesPrev = thetaValues.map((theta) => calculateICC(theta, discriminationPrev, difficultyPrev));

    const data = {
        labels: thetaValues,
        datasets: [
            {
                label: `Current Model - Discrimination: ${discrimination}, Difficulty: ${difficulty}`,
                data: probabilityValuesCurrent,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
            {
                label: `Previous Model - Discrimination: ${discriminationPrev}, Difficulty: ${difficultyPrev}`,
                data: probabilityValuesPrev,
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: false,
                text: 'IRT ICC Comparison',
            },
            tooltip: {
                enabled: false,
                // callbacks: {
                //     title: (tooltipItem) => `Theta: ${tooltipItem[0].label}`,
                //     label: (tooltipItem) => `P(θ): ${tooltipItem.raw.toFixed(2)}`,
                // },
            },
        },
        scales: {
            x: {
                title: {
                    display: false,
                    text: 'Theta (Ability)',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Probability of Correct Response',
                },
                min: 0,
                max: 1,
            },
        },
    };

    return (
        <Line data={data} options={options} />
    );
};

export default IRTChart;
