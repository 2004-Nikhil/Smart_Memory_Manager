// src/components/ComparisonTextResults.js
import React from 'react';

const ComparisonTextResults = ({ comparisonResults, pageString, frameSize }) => {
    if (!comparisonResults || Object.keys(comparisonResults).length === 0) {
        return null; // Don't render if no results
    }

    const algorithms = Object.keys(comparisonResults);
    // Sort algorithms by performance (lowest faults first)
    const sortedAlgos = [...algorithms].sort((a, b) => comparisonResults[a].faults - comparisonResults[b].faults);

    const pages = pageString.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    const displayedPageString = pages.length > 20 ? pages.slice(0, 20).join(', ') + '...' : pages.join(', ');

    const bestAlgo = sortedAlgos[0];
    const bestAlgoFaults = comparisonResults[bestAlgo].faults;
    const bestAlgoFaultRate = comparisonResults[bestAlgo].faultRate;

    const resultsText = `Simulation Parameters:
- Page Reference String: [${displayedPageString}]
- Number of Pages: ${pages.length}
- Frame Size: ${frameSize}

Results:
${'Algorithm'.padEnd(15)} ${'Page Faults'.padEnd(15)} ${'Fault Rate'.padEnd(15)}
---------------------------------------------
${sortedAlgos.map(algo => {
    const faults = comparisonResults[algo].faults;
    const rate = comparisonResults[algo].faultRate;
    return `${algo.padEnd(15)} ${String(faults).padEnd(15)} ${rate.toFixed(2)}%`;
}).join('\n')}

Best Algorithm: ${bestAlgo} with ${bestAlgoFaults} page faults (${bestAlgoFaultRate.toFixed(2)}% fault rate)

Algorithm Descriptions:
FIFO: First-In-First-Out - Replaces the page that has been in memory the longest
LRU: Least Recently Used - Replaces the page that has not been used for the longest time
Clock: Second-Chance - Uses a reference bit and a circular queue to give pages a second chance
Adaptive: Dynamically switches between FIFO and LRU based on recent fault patterns
ML-Based: A simplified machine learning approach based on recent access patterns (Note: Currently identical to LRU in this simulation)
`;

    return (
        <div className="results-text-area">
            <h3>Detailed Results</h3>
            <pre>{resultsText}</pre>
        </div>
    );
};

export default ComparisonTextResults;