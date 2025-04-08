import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale, // x axis
    LinearScale, // y axis
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import PropTypes from 'prop-types';

// Register the components needed for the Line chart
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const ThetaScoreChart = ({ logs = [], items = [] }) => {
    // Prepare data for the chart using useMemo to avoid recalculation on every render
    const chartData = useMemo(() => {
        if (!logs || logs.length === 0 || !items || items.length === 0) {
            return null; // Return null if data is insufficient
        }

        // Create a quick lookup map: assessment_item_id -> item index (question number)
        const itemIdToQuestionNumberMap = new Map(
            items.map((item, index) => [item.assessment_item_id, index + 1])
        );

        // Sort logs just in case, though they likely come ordered
        // If ordering isn't guaranteed by ID/timestamp, you might need a more robust sort
        const sortedLogs = [...logs].sort((a, b) => a.theta_score_log_id - b.theta_score_log_id); // Example sort by log ID

        const labels = [];
        const scores = [];

        sortedLogs.forEach((log, index) => {
            const questionNumber = itemIdToQuestionNumberMap.get(log.assessment_item_id);
            // Use question number if found, otherwise fallback to log index + 1
            labels.push(`Q${questionNumber !== undefined ? questionNumber : index + 1}`);
            // Use the *new* theta score after this item was processed
            scores.push(log.new_theta_score !== null ? Number(log.new_theta_score).toFixed(4) : null);
        });

         // Add the very first 'previous' score as the starting point (Q0) if desired and available
         // This requires knowing the initial theta before the first item, which isn't directly in the logs.
         // If you have the initial theta score stored elsewhere (e.g., on assessment_course), you could prepend it.
         // For simplicity here, we'll start plotting from the result of the first item.

        return {
            labels,
            datasets: [
                {
                    label: 'Theta Score Progression',
                    data: scores,
                    fill: false, // Don't fill area under the line
                    borderColor: 'rgb(75, 192, 192)', // Teal color
                    tension: 0.1, // Slight curve to the line
                    pointBackgroundColor: 'rgb(75, 192, 192)',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                },
            ],
        };
    }, [logs, items]); // Recalculate only if logs or items change

    // Chart configuration options
    const chartOptions = {
        responsive: true, // Make it responsive
        maintainAspectRatio: false, // Allow height/width control via container
        plugins: {
            legend: {
                position: 'top', // Position the legend at the top
            },
            title: {
                display: true,
                text: 'Theta Score Change Per Item', // Chart title
                font: {
                    size: 16
                }
            },
            tooltip: {
                callbacks: {
                    // Custom tooltip label
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            // Format score in tooltip
                            label += parseFloat(context.parsed.y).toFixed(4);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: { // Y-axis configuration
                beginAtZero: false, // Might start below zero
                title: {
                    display: true,
                    text: 'Theta Score', // Y-axis label
                },
            },
            x: { // X-axis configuration
                title: {
                    display: true,
                    text: 'Question Number in Sequence', // X-axis label
                },
            },
        },
    };

    // Don't render anything if data isn't ready
    if (!chartData) {
        return <p className="text-muted text-center small my-3">Theta score progression data not available.</p>;
    }

    // Render the Line chart
    return (
        // Set a container with defined height for maintainAspectRatio: false to work
        <div style={{ position: 'relative', height: '300px', width: '100%' }}>
            <Line options={chartOptions} data={chartData} />
        </div>
    );
};

export default ThetaScoreChart;