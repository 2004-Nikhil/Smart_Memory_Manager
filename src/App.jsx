// src/App.js
import React, { useState } from 'react';
import Hero from './components/Hero';
import SetupForm from './components/SetupForm';
import VisualizationDisplay from './components/VisualizationDisplay';
import ComparisonChart from './components/ComparisonChart';
import { runSingleSimulation, compareAllAlgorithms } from './algorithms/simulationRunner';
import './App.css'; // Global App CSS, including tab styles

const App = () => {
    const [activeTab, setActiveTab] = useState('hero'); // Start with hero
    const [showNavigation, setShowNavigation] = useState(false); // Control navigation visibility

    // Setup Form States (controlled components)
    const [pageString, setPageString] = useState("1,2,3,4,1,2,5,1,2,3,4,5");
    const [frameSize, setFrameSize] = useState(3);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState("FIFO");
    const [numRandomPages, setNumRandomPages] = useState(12);
    const [pageRange, setPageRange] = useState(10);

    // Visualization States
    const [simulationData, setSimulationData] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [autoPlay, setAutoPlay] = useState(false);

    // Comparison States
    const [comparisonResults, setComparisonResults] = useState(null);

    // Navigation handler
    const handleStartSimulation = () => {
        setShowNavigation(true);
        setActiveTab('setup');
    };

    const handleBackToHome = () => {
        setShowNavigation(false);
        setActiveTab('hero');
    };

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
            setCurrentStep(0);
            setAutoPlay(false);
            setActiveTab('visualization');
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
            setActiveTab('comparison');
        } catch (error) {
            alert(`Comparison Error: ${error.message}`);
            console.error(error);
        }
    };

    // If we're showing hero, render only hero
    if (!showNavigation) {
        return (
            <div className="min-h-screen">
                <Hero onStartSimulation={handleStartSimulation} />
            </div>
        );
    }

    // Otherwise render the full app with navigation
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
            {/* Enhanced Navigation Header */}
            <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo/Brand */}
                        <button 
                            onClick={handleBackToHome}
                            className="flex items-center gap-3 text-white hover:text-purple-400 transition-colors duration-200"
                        >
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <span className="text-lg font-bold">P</span>
                            </div>
                            <div className="hidden sm:block">
                                <div className="text-lg font-bold">Page Replacement Simulator</div>
                                <div className="text-xs text-gray-400">Operating Systems Lab</div>
                            </div>
                        </button>

                        {/* Navigation Tabs */}
                        <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-2xl p-1 border border-white/10">
                            {/*
                                { id: 'setup', label: 'Setup', icon: '⚙️' },
                                { id: 'visualization', label: 'Visualization', icon: '📊' },
                                { id: 'comparison', label: 'Comparison', icon: '📈' }
                            */}
                            {/*
                            <div className="flex items-center gap-2">
                                <span className="text-sm">⚙️</span>
                                <span className="hidden sm:inline">Setup</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm">📊</span>
                                <span className="hidden sm:inline">Visualization</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm">📈</span>
                                <span className="hidden sm:inline">Comparison</span>
                            </div>
                            */}
                        </div>

                        {/* Action Button */}
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={handleBackToHome}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-xl transition-all duration-200 flex items-center gap-2"
                            >
                                <span>🏠</span>
                                <span className="hidden sm:inline">Home</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Content with Enhanced Transitions */}
            <div className="relative">
                <div className={`transition-all duration-500 ${activeTab === 'setup' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'}`}>
                    {activeTab === 'setup' && (
                        <SetupForm
                            pageString={pageString} setPageString={setPageString}
                            frameSize={frameSize} setFrameSize={setFrameSize}
                            selectedAlgorithm={selectedAlgorithm} setSelectedAlgorithm={setSelectedAlgorithm}
                            numRandomPages={numRandomPages} setNumRandomPages={setNumRandomPages}
                            pageRange={pageRange} setPageRange={setPageRange}
                            onRunSimulation={handleRunSimulation}
                            onCompareAll={handleCompareAll}
                        />
                    )}
                </div>

                <div className={`transition-all duration-500 ${activeTab === 'visualization' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'}`}>
                    {activeTab === 'visualization' && (
                        <VisualizationDisplay
                            simulationData={simulationData}
                            currentStep={currentStep}
                            setCurrentStep={setCurrentStep}
                            autoPlay={autoPlay}
                            setAutoPlay={setAutoPlay}
                        />
                    )}
                </div>

                <div className={`transition-all duration-500 ${activeTab === 'comparison' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'}`}>
                    {activeTab === 'comparison' && (
                        <ComparisonChart
                            comparisonResults={comparisonResults}
                            pageString={pageString}
                            frameSize={frameSize}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;