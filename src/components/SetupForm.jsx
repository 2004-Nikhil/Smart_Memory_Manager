// src/components/SetupForm.js
import React from 'react';

const SetupForm = ({
    pageString, setPageString,
    frameSize, setFrameSize,
    selectedAlgorithm, setSelectedAlgorithm,
    // Prefetching removed
    numRandomPages, setNumRandomPages,
    pageRange, setPageRange,
    onRunSimulation, onCompareAll
}) => {
    const algorithms = ["FIFO", "LRU", "Clock", "Adaptive", "ML-Based"];

    const handleGenerateRandomPages = () => {
        try {
            if (numRandomPages <= 0 || pageRange <= 0) {
                alert("Number of pages and page range must be positive.");
                return;
            }
            const pages = [];
            for (let i = 0; i < numRandomPages; i++) {
                pages.push(Math.floor(Math.random() * pageRange));
            }
            setPageString(pages.join(','));
        } catch (e) {
            alert(`Error generating random pages: ${e.message}`);
        }
    };

    return (
        <div className="setup-form">
            <div className="form-section">
                <h3>Simulation Configuration</h3>
                <div className="form-row">
                    <label>Page Reference String:</label>
                    <input
                        type="text"
                        value={pageString}
                        onChange={(e) => setPageString(e.target.value)}
                        placeholder="e.g., 1,2,3,4,1,2,5,1,2,3,4,5"
                    />
                </div>
                <div className="form-row">
                    <label>Frame Size:</label>
                    <input
                        type="number"
                        value={frameSize}
                        onChange={(e) => setFrameSize(Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                        max="10"
                    />
                </div>
                <div className="form-row">
                    <label>Algorithm:</label>
                    <select
                        value={selectedAlgorithm}
                        onChange={(e) => setSelectedAlgorithm(e.target.value)}
                    >
                        {algorithms.map(algo => (
                            <option key={algo} value={algo}>{algo}</option>
                        ))}
                    </select>
                </div>
                {/* Enable Prefetching removed */}
            </div>

            <div className="form-section">
                <h3>Random Page Generation</h3>
                <div className="form-row">
                    <label>Number of Pages:</label>
                    <input
                        type="number"
                        value={numRandomPages}
                        onChange={(e) => setNumRandomPages(Math.max(5, parseInt(e.target.value) || 5))}
                        min="5"
                        max="30"
                    />
                </div>
                <div className="form-row">
                    <label>Page Value Range (0 to N-1):</label>
                    <input
                        type="number"
                        value={pageRange}
                        onChange={(e) => setPageRange(Math.max(1, parseInt(e.target.value) || 10))}
                        min="1"
                        max="50"
                    />
                </div>
                <div className="button-group">
                    <button onClick={handleGenerateRandomPages}>Generate Random Pages</button>
                </div>
            </div>

            <div className="button-group">
                <button onClick={onRunSimulation}>Run Simulation</button>
                <button onClick={onCompareAll}>Compare All Algorithms</button>
            </div>
        </div>
    );
};

export default SetupForm;