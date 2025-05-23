// src/App.js
import React, { useState } from 'react';
import Hero from './components/Hero';
import SetupForm from './components/SetupForm';
import VisualizationDisplay from './components/VisualizationDisplay';
import ComparisonChart from './components/ComparisonChart';
import { runSingleSimulation, compareAllAlgorithms } from './algorithms/simulationRunner';
import './App.css'; // Global App CSS, including tab styles

const App = () => {
    const [activeTab, setActiveTab] = useState('setup');

    // Setup Form States (controlled components)
    const [pageString, setPageString] = useState("1,2,3,4,1,2,5,1,2,3,4,5");
    const [frameSize, setFrameSize] = useState(3);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState("FIFO");
    // Prefetching removed
    const [numRandomPages, setNumRandomPages] = useState(12);
    const [pageRange, setPageRange] = useState(10);

    // Visualization States
    const [simulationData, setSimulationData] = useState(null); // Stores history etc. for visualization
    const [currentStep, setCurrentStep] = useState(0); // Current step in visualization
    const [autoPlay, setAutoPlay] = useState(false); // Autoplay toggle

    // Comparison States
    const [comparisonResults, setComparisonResults] = useState(null);

    // Helper to parse page string input
    const parsePageString = (str) => {
        const pages = str.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        if (pages.length === 0) {
            throw new Error("Page reference string is empty or contains only invalid entries. Please enter comma-separated numbers (e.g., '1,2,3').");
        }
        return pages;
    };

    const handleRunSimulation = () => {
        try {
            const pages = parsePageString(pageString);
            if (frameSize <= 0) {
                alert("Frame size must be a positive number.");
                return;
            }

            const result = runSingleSimulation(selectedAlgorithm, pages, frameSize);
            setSimulationData(result);
            setCurrentStep(0); // Reset visualization to start
            setAutoPlay(false); // Ensure autoplay is off initially or when new simulation starts
            setActiveTab('visualization'); // Switch to visualization tab
        } catch (error) {
            alert(`Simulation Error: ${error.message}`);
            console.error(error);
        }
    };

    const handleCompareAll = () => {
        try {
            const pages = parsePageString(pageString);
            if (frameSize <= 0) {
                alert("Frame size must be a positive number.");
                return;
            }

            const results = compareAllAlgorithms(pages, frameSize);
            setComparisonResults(results);
            setActiveTab('comparison'); // Switch to comparison tab
        } catch (error) {
            alert(`Comparison Error: ${error.message}`);
            console.error(error);
        }
    };

    return (
        <div className="app-container">
            <Hero />
            <div className="tabs">
                <button
                    className={`tab-button ${activeTab === 'setup' ? 'active' : ''}`}
                    onClick={() => setActiveTab('setup')}
                >
                    Setup
                </button>
                <button
                    className={`tab-button ${activeTab === 'visualization' ? 'active' : ''}`}
                    onClick={() => setActiveTab('visualization')}
                >
                    Visualization
                </button>
                <button
                    className={`tab-button ${activeTab === 'comparison' ? 'active' : ''}`}
                    onClick={() => setActiveTab('comparison')}
                >
                    Comparison
                </button>
            </div>

            <div className={`tab-content ${activeTab === 'setup' ? '' : 'hidden'}`}>
                <SetupForm
                    pageString={pageString} setPageString={setPageString}
                    frameSize={frameSize} setFrameSize={setFrameSize}
                    selectedAlgorithm={selectedAlgorithm} setSelectedAlgorithm={setSelectedAlgorithm}
                    numRandomPages={numRandomPages} setNumRandomPages={setNumRandomPages}
                    pageRange={pageRange} setPageRange={setPageRange}
                    onRunSimulation={handleRunSimulation}
                    onCompareAll={handleCompareAll}
                />
            </div>

            <div className="tab-content-wrapper"> {/* Wrapper for flex column layout if needed */}
                <div className={`tab-content ${activeTab === 'visualization' ? '' : 'hidden'}`}>
                    <VisualizationDisplay
                        simulationData={simulationData}
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                        autoPlay={autoPlay}
                        setAutoPlay={setAutoPlay}
                    />
                </div>

                <div className={`tab-content ${activeTab === 'comparison' ? '' : 'hidden'}`}>
                    <ComparisonChart
                        comparisonResults={comparisonResults}
                        pageString={pageString}
                        frameSize={frameSize}
                    />
                </div>
            </div>
        </div>
    );
};

export default App;