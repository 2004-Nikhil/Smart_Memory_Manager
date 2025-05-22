// src/components/ComparisonChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ComparisonChart = ({ comparisonResults }) => {
    if (!comparisonResults || Object.keys(comparisonResults).length === 0) {
        return (
            <div className="comparison-container">
                <h2>Algorithm Comparison</h2>
                <p style={{textAlign: 'center'}}>Run "Compare All Algorithms" on the "Setup" tab to see results.</p>
            </div>
        );
    }

    const algorithms = Object.keys(comparisonResults);
    const faultCounts = algorithms.map(algo => comparisonResults[algo].faults);
    const faultRates = algorithms.map(algo => comparisonResults[algo].faultRate);

    // Find the best algorithm (lowest fault count) to highlight
    const minFaults = Math.min(...faultCounts);
    const bestAlgoIndex = faultCounts.indexOf(minFaults);

    const chartData = {
        labels: algorithms,
        datasets: [
            {
                label: 'Page Faults',
                data: faultCounts,
                backgroundColor: algorithms.map((_, idx) => idx === bestAlgoIndex ? 'rgba(75, 192, 192, 0.7)' : 'rgba(54, 162, 235, 0.6)'),
                borderColor: algorithms.map((_, idx) => idx === bestAlgoIndex ? 'rgba(75, 192, 192, 1)' : 'rgba(54, 162, 235, 1)'),
                borderWidth: 1,
            },
            {
                label: 'Fault Rate (%)',
                data: faultRates,
                backgroundColor: algorithms.map((_, idx) => idx === bestAlgoIndex ? 'rgba(153, 102, 255, 0.7)' : 'rgba(255, 159, 64, 0.6)'),
                borderColor: algorithms.map((_, idx) => idx === bestAlgoIndex ? 'rgba(153, 102, 255, 1)' : 'rgba(255, 159, 64, 1)'),
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Allow aspect ratio to be controlled by parent container
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Page Replacement Algorithm Comparison',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.dataset.label === 'Fault Rate (%)' ? `${context.parsed.y.toFixed(2)}%` : context.parsed.y;
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Count / Percentage'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Algorithm'
                }
            }
        }
    };

    return (
        <div className="comparison-container">
            <div className="chart-wrapper">
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
};

export default ComparisonChart;