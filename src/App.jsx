// src/App.js
import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import SetupForm from './components/SetupForm';
import VisualizationDisplay from './components/VisualizationDisplay';
import ComparisonChart from './components/ComparisonChart';
import { runSingleSimulation, compareAllAlgorithms, getAvailableAlgorithms, getAlgorithmDescription } from './algorithms/simulationRunner';
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

    // Get available algorithms dynamically
    const [availableAlgorithms, setAvailableAlgorithms] = useState([]);

    // Visualization States
    const [simulationData, setSimulationData] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [autoPlay, setAutoPlay] = useState(false);

    // Comparison States
    const [comparisonResults, setComparisonResults] = useState(null);

    // Load available algorithms on component mount
    useEffect(() => {
        try {
            const algorithms = getAvailableAlgorithms();
            setAvailableAlgorithms(algorithms);
        } catch (error) {
            console.error('Error loading algorithms:', error);
            // Fallback to basic algorithms
            setAvailableAlgorithms(['FIFO', 'LRU', 'Clock']);
        }
    }, []);

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

    // Get algorithm display info
    const getAlgorithmInfo = (algoName) => {
        const algorithmStyles = {
            'FIFO': { icon: '📥', color: 'from-blue-500 to-cyan-500', category: 'Basic' },
            'LRU': { icon: '🕒', color: 'from-green-500 to-emerald-500', category: 'Basic' },
            'Clock': { icon: '⏰', color: 'from-yellow-500 to-orange-500', category: 'Basic' },
            'LFU': { icon: '📊', color: 'from-purple-500 to-pink-500', category: 'Frequency' },
            'ARC': { icon: '🎯', color: 'from-indigo-500 to-purple-500', category: 'Adaptive' },
            'LIRS': { icon: '🧠', color: 'from-red-500 to-pink-500', category: 'Advanced' },
            'Adaptive': { icon: '🔄', color: 'from-teal-500 to-cyan-500', category: 'Adaptive' }
        };
        
        return algorithmStyles[algoName] || { icon: '⚙️', color: 'from-gray-500 to-gray-600', category: 'Other' };
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
                    case 'Enter':
                        if (activeTab === 'setup') {
                            e.preventDefault();
                            handleRunSimulation();
                        }
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
                            {/* Enhanced Quick Stats Display */}
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
                                    <span>{getAlgorithmInfo(selectedAlgorithm).icon}</span>
                                    <span className="font-medium">{selectedAlgorithm}</span>
                                    <span className="text-xs px-2 py-1 bg-white/10 rounded-full">
                                        {getAlgorithmInfo(selectedAlgorithm).category}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Algorithm Quick Selector */}
                            <div className="hidden xl:flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                                <span className="text-sm text-gray-400">Algorithm:</span>
                                <select
                                    value={selectedAlgorithm}
                                    onChange={(e) => setSelectedAlgorithm(e.target.value)}
                                    className="bg-transparent text-white text-sm border-none outline-none cursor-pointer"
                                >
                                    {availableAlgorithms.map(algo => (
                                        <option key={algo} value={algo} className="bg-slate-800 text-white">
                                            {getAlgorithmInfo(algo).icon} {algo}
                                        </option>
                                    ))}
                                </select>
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
                                availableAlgorithms={availableAlgorithms}
                                getAlgorithmInfo={getAlgorithmInfo}
                                getAlgorithmDescription={getAlgorithmDescription}
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
                                getAlgorithmInfo={getAlgorithmInfo}
                            />
                        </div>
                    )}

                    {activeTab === 'comparison' && (
                        <div className="w-full min-h-full">
                            <ComparisonChart
                                comparisonResults={comparisonResults}
                                pageString={pageString}
                                frameSize={frameSize}
                                getAlgorithmInfo={getAlgorithmInfo}
                                availableAlgorithms={availableAlgorithms}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Action Button for Quick Navigation - Fixed positioning */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
                {/* Quick Action Buttons */}
                {activeTab === 'setup' && (
                    <div className="flex flex-col items-end gap-3">
                        <button
                            onClick={handleRunSimulation}
                            className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center hover:scale-110 border-2 border-white/20"
                            title="Run Simulation (Ctrl+Enter)"
                        >
                            <span className="text-2xl">▶️</span>
                        </button>
                        <button
                            onClick={handleCompareAll}
                            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center hover:scale-110 border-2 border-white/20"
                            title="Compare All Algorithms"
                        >
                            <span className="text-2xl">📊</span>
                        </button>
                    </div>
                )}

                {/* Algorithm Quick Switch Tooltip - Positioned relative to buttons */}
                {activeTab === 'setup' && (
                    <div className="bg-black/80 backdrop-blur-sm text-white text-sm px-4 py-3 rounded-xl border border-white/20 shadow-xl max-w-xs mr-20 relative">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{getAlgorithmInfo(selectedAlgorithm).icon}</span>
                            <span className="font-semibold">{selectedAlgorithm}</span>
                        </div>
                        <div className="text-gray-300 text-xs leading-relaxed">
                            {getAlgorithmDescription(selectedAlgorithm)}
                        </div>
                        {/* Arrow pointing to buttons */}
                        <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-black/80 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                    </div>
                )}
            </div>

            {/* Enhanced Keyboard Shortcuts Indicator - Fixed positioning */}
            <div className="fixed bottom-6 left-6 z-40 bg-black/80 backdrop-blur-sm text-white text-sm px-4 py-3 rounded-xl border border-white/20 shadow-xl opacity-90 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2">
                    <span className="text-lg">⌨️</span>
                    <span className="font-medium">Ctrl+1,2,3 for tabs • Ctrl+H for home • Ctrl+Enter to run</span>
                </div>
            </div>

            {/* Algorithm Count Badge - Fixed positioning */}
            <div className="fixed top-28 right-6 z-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full border border-purple-400/30 shadow-lg">
                <div className="flex items-center gap-2">
                    <span className="text-lg">🧮</span>
                    <span className="font-medium">{availableAlgorithms.length} algorithms available</span>
                </div>
            </div>
        </div>
    );
};

export default App;