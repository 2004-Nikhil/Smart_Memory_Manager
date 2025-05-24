// src/App.js
import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import SetupForm from './components/SetupForm';
import VisualizationDisplay from './components/VisualizationDisplay';
import ComparisonChart from './components/ComparisonChart';
import { runSingleSimulation, compareAllAlgorithms } from './algorithms/simulationRunner';
import './App.css'; // Global App CSS, including tab styles

const App = () => {
    const [activeTab, setActiveTab] = useState('hero'); // Start with hero
    const [showNavigation, setShowNavigation] = useState(false); // Control navigation visibility
    const [isTransitioning, setIsTransitioning] = useState(false);

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

    // Navigation handler with smooth transition
    const handleStartSimulation = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setShowNavigation(true);
            setActiveTab('setup');
            setIsTransitioning(false);
        }, 300);
    };

    const handleBackToHome = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setShowNavigation(false);
            setActiveTab('hero');
            setIsTransitioning(false);
        }, 300);
    };

    // Simplified tab switching without complex transitions
    const switchTab = (newTab) => {
        if (newTab === activeTab) return;
        console.log('Switching from', activeTab, 'to', newTab); // Debug log
        setActiveTab(newTab);
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
            switchTab('visualization');
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
            switchTab('comparison');
        } catch (error) {
            alert(`Comparison Error: ${error.message}`);
            console.error(error);
        }
    };

    // Navigation tabs configuration
    const navigationTabs = [
        { id: 'setup', label: 'Setup', icon: '⚙️', description: 'Configure simulation parameters' },
        { id: 'visualization', label: 'Simulation', icon: '🎯', description: 'Watch algorithm execution' },
        { id: 'comparison', label: 'Analysis', icon: '📊', description: 'Compare performance' }
    ];

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!showNavigation) return;
            
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        switchTab('setup');
                        break;
                    case '2':
                        e.preventDefault();
                        switchTab('visualization');
                        break;
                    case '3':
                        e.preventDefault();
                        switchTab('comparison');
                        break;
                    case 'h':
                        e.preventDefault();
                        handleBackToHome();
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [showNavigation, activeTab]);

    // If we're showing hero, render only hero with full screen
    if (!showNavigation) {
        return (
            <div className="fixed inset-0">
                <Hero onStartSimulation={handleStartSimulation} />
            </div>
        );
    }

    // Full app layout with simplified rendering
    return (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 overflow-hidden">
            {/* Enhanced Navigation Header - Fixed and Full Width */}
            <div className="absolute top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
                <div className="max-w-full mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo/Brand - Enhanced */}
                        <button 
                            onClick={handleBackToHome}
                            className="flex items-center gap-4 text-white hover:text-purple-400 transition-all duration-300 group"
                        >
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:scale-105">
                                <span className="text-xl font-bold">S</span>
                            </div>
                            <div className="hidden sm:block">
                                <div className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                    Smart Memory Manager
                                </div>
                                <div className="text-sm text-gray-400 font-medium">Operating Systems Laboratory</div>
                            </div>
                        </button>

                        {/* Enhanced Navigation Tabs */}
                        <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-3xl p-2 border border-white/10 shadow-lg">
                            {navigationTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => switchTab(tab.id)}
                                    className={`
                                        relative px-6 py-3 rounded-2xl transition-all duration-300 flex items-center gap-3 group
                                        ${activeTab === tab.id 
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25' 
                                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                                        }
                                    `}
                                >
                                    <span className="text-lg">{tab.icon}</span>
                                    <div className="hidden md:block text-left">
                                        <div className="font-semibold text-sm">{tab.label}</div>
                                        <div className={`text-xs ${activeTab === tab.id ? 'text-purple-100' : 'text-gray-500'}`}>
                                            {tab.description}
                                        </div>
                                    </div>
                                    {activeTab === tab.id && (
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 animate-pulse"></div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Enhanced Action Controls */}
                        <div className="flex items-center gap-3">
                            {/* Quick Stats Display */}
                            <div className="hidden lg:flex items-center gap-4 text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                                <div className="flex items-center gap-2">
                                    <span>📄</span>
                                    <span>{pageString.split(',').length} pages</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>🗂️</span>
                                    <span>{frameSize} frames</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>⚡</span>
                                    <span>{selectedAlgorithm}</span>
                                </div>
                            </div>
                            
                            {/* Home Button */}
                            <button 
                                onClick={handleBackToHome}
                                className="px-5 py-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                <span className="text-lg">🏠</span>
                                <span className="hidden sm:inline font-medium">Home</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Full Screen Coverage */}
            <div className="absolute inset-0 pt-24">
                {/* Simplified Tab Content Rendering - Full Coverage */}
                <div className="w-full h-full overflow-auto">
                    {activeTab === 'setup' && (
                        <div className="w-full min-h-full">
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
                    )}

                    {activeTab === 'visualization' && (
                        <div className="w-full min-h-full">
                            <VisualizationDisplay
                                simulationData={simulationData}
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                                autoPlay={autoPlay}
                                setAutoPlay={setAutoPlay}
                            />
                        </div>
                    )}

                    {activeTab === 'comparison' && (
                        <div className="w-full min-h-full">
                            <ComparisonChart
                                comparisonResults={comparisonResults}
                                pageString={pageString}
                                frameSize={frameSize}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Action Button for Quick Navigation */}
            <div className="fixed bottom-8 right-8 z-40">
                <div className="flex flex-col gap-3">
                    {/* Quick Action Buttons */}
                    {activeTab === 'setup' && (
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleRunSimulation}
                                className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
                                title="Run Simulation (Ctrl+Enter)"
                            >
                                <span className="text-xl">▶️</span>
                            </button>
                            <button
                                onClick={handleCompareAll}
                                className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
                                title="Compare All Algorithms"
                            >
                                <span className="text-xl">📊</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Keyboard Shortcuts Indicator */}
            <div className="fixed bottom-4 left-4 z-30 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg border border-white/10 opacity-75 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2">
                    <span>⌨️</span>
                    <span>Ctrl+1,2,3 for tabs • Ctrl+H for home</span>
                </div>
            </div>
        </div>
    );
};

export default App;