import React, { useEffect, useRef, useState } from 'react';
import { 
    Play, 
    Pause, 
    SkipBack, 
    SkipForward, 
    RotateCcw, 
    Zap, 
    Target, 
    Clock, 
    Cpu,
    Activity,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    BarChart2,
    Sparkles,
    Network,
    Layers,
    Brain
} from 'lucide-react';

const VisualizationDisplay = ({ simulationData, currentStep, setCurrentStep, autoPlay, setAutoPlay }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [showStats, setShowStats] = useState(false);
    
    // Move useRef to top - before any conditional returns
    const autoPlayRef = useRef(autoPlay);
    const timeoutRef = useRef(null);

    // Update ref when autoPlay changes
    useEffect(() => {
        autoPlayRef.current = autoPlay;
    }, [autoPlay]);

    // Simplified useEffect for autoplay - remove problematic dependencies
    useEffect(() => {
        if (!simulationData || simulationData.history.length === 0) {
            return;
        }
        
        const totalSteps = simulationData.pages.length;
        
        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        
        // Only proceed if autoplay is on and we haven't reached the end
        if (autoPlay && currentStep < totalSteps - 1) {
            timeoutRef.current = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 1200);
        } else if (autoPlay && currentStep === totalSteps - 1) {
            // Auto-stop when we reach the end
            setAutoPlay(false);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [simulationData, currentStep, autoPlay, setCurrentStep, setAutoPlay]);

    if (!simulationData || simulationData.history.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center border border-purple-500/30">
                        <Activity size={32} className="text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Memory Algorithm Visualization</h2>
                    <p className="text-gray-400 leading-relaxed">
                        Configure and run a simulation in the Setup tab to see the interactive memory management visualization in action.
                    </p>
                </div>
            </div>
        );
    }

    const {
        algorithmName, pages, frameSize,
        history, faultHistory, pointerHistory, refBitsHistory, algoHistory
    } = simulationData;

    const totalSteps = pages.length;
    const isClock = algorithmName === "Clock";
    const isAdaptive = algorithmName === "Adaptive";

    const currentFrames = history[currentStep] || [];
    const currentPage = pages[currentStep];
    const currentPageFault = faultHistory[currentStep];
    const currentPointer = isClock ? pointerHistory[currentStep] : undefined;
    const currentRefBitsAtStep = isClock ? refBitsHistory[currentStep] : undefined;
    const currentAlgo = isAdaptive ? algoHistory[currentStep] : undefined;

    const totalFaultsUpToStep = faultHistory.slice(0, currentStep + 1).filter(f => f).length;
    const faultRate = ((totalFaultsUpToStep / (currentStep + 1)) * 100).toFixed(1);
    const hitRate = (100 - faultRate).toFixed(1);

    const handlePrev = () => {
        if (currentStep > 0) {
            setAutoPlay(false);
            setCurrentStep(currentStep - 1);
        }
    };

    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            setAutoPlay(false);
            setCurrentStep(currentStep + 1);
        }
    };

    const handleAutoPlayToggle = () => {
        console.log('Autoplay toggle clicked, current state:', autoPlay); // Debug log
        setAutoPlay(prev => !prev);
    };

    const getAlgorithmIcon = () => {
        switch (algorithmName) {
            case 'FIFO': return Layers;
            case 'LRU': return Clock;
            case 'Clock': return Target;
            case 'LFU': return BarChart2;
            case 'ARC': return Sparkles;
            case 'LIRS': return Network;
            case 'Adaptive': return Cpu;
            default: return Activity;
        }
    };

    const getAlgorithmColor = () => {
        switch (algorithmName) {
            case 'FIFO': return 'from-blue-500 to-cyan-500';
            case 'LRU': return 'from-purple-500 to-pink-500';
            case 'Clock': return 'from-green-500 to-emerald-500';
            case 'LFU': return 'from-purple-500 to-pink-500';
            case 'ARC': return 'from-indigo-500 to-purple-500';
            case 'LIRS': return 'from-red-500 to-pink-500';
            case 'Adaptive': return 'from-orange-500 to-red-500';
            default: return 'from-indigo-500 to-purple-500';
        }
    };

    const AlgorithmIcon = getAlgorithmIcon();

    return (
        <div className="w-full h-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto h-full">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-2xl bg-gradient-to-r ${getAlgorithmColor()} shadow-2xl`}>
                            <AlgorithmIcon size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                {algorithmName} Algorithm Visualization
                            </h1>
                            <p className="text-gray-400">Frame Size: {frameSize} | Simulating {totalSteps} page references</p>
                        </div>
                    </div>
                    
                    {isAdaptive && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-300">
                            <Cpu size={16} />
                            <span>Current Algorithm: {currentAlgo}</span>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={handlePrev} 
                                disabled={currentStep === 0}
                                className="p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                            >
                                <SkipBack size={20} />
                            </button>
                            
                            <button
                                onClick={handleAutoPlayToggle}
                                disabled={currentStep === totalSteps - 1}
                                className={`p-3 ${autoPlay ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} disabled:bg-gray-600 disabled:opacity-50 text-white rounded-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100`}
                                title={autoPlay ? 'Pause autoplay' : 'Start autoplay'}
                            >
                                {autoPlay ? <Pause size={20} /> : <Play size={20} />}
                            </button>
                            
                            <button 
                                onClick={handleNext} 
                                disabled={currentStep === totalSteps - 1}
                                className="p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                            >
                                <SkipForward size={20} />
                            </button>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-white">
                                <span className="text-2xl font-bold">{currentStep + 1}</span>
                                <span className="text-gray-400 mx-2">/</span>
                                <span className="text-gray-400">{totalSteps}</span>
                            </div>
                            
                            <button
                                onClick={() => setShowStats(!showStats)}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all duration-200 hover:scale-105"
                            >
                                <TrendingUp size={16} />
                                Stats
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div 
                                className={`h-full bg-gradient-to-r ${getAlgorithmColor()} transition-all duration-300 ease-out`}
                                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Panel */}
                {showStats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle size={20} className="text-red-400" />
                                <span className="text-red-400 font-semibold">Page Faults</span>
                            </div>
                            <div className="text-2xl font-bold text-white">{totalFaultsUpToStep}</div>
                            <div className="text-red-300 text-sm">{faultRate}% rate</div>
                        </div>
                        
                        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 size={20} className="text-green-400" />
                                <span className="text-green-400 font-semibold">Page Hits</span>
                            </div>
                            <div className="text-2xl font-bold text-white">{currentStep + 1 - totalFaultsUpToStep}</div>
                            <div className="text-green-300 text-sm">{hitRate}% rate</div>
                        </div>
                        
                        <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Activity size={20} className="text-blue-400" />
                                <span className="text-blue-400 font-semibold">Current Page</span>
                            </div>
                            <div className="text-2xl font-bold text-white">{currentPage}</div>
                            <div className="text-blue-300 text-sm">Step {currentStep + 1}</div>
                        </div>
                        
                        <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap size={20} className="text-purple-400" />
                                <span className="text-purple-400 font-semibold">Efficiency</span>
                            </div>
                            <div className="text-2xl font-bold text-white">{hitRate}%</div>
                            <div className="text-purple-300 text-sm">Hit ratio</div>
                        </div>
                    </div>
                )}

                {/* Visualization Grid */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 overflow-x-auto">
                    <div className="min-w-max">
                        {/* Page Reference Header */}
                        <div className="flex items-center mb-4">
                            <div className="w-20 h-12 flex items-center justify-center text-gray-400 font-semibold">
                                Pages
                            </div>
                            {pages.map((page, idx) => (
                                <div 
                                    key={idx}
                                    className={`w-16 h-12 flex items-center justify-center mx-1 rounded-lg font-bold transition-all duration-300 ${
                                        idx === currentStep 
                                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white scale-110 shadow-lg' 
                                            : idx < currentStep 
                                                ? 'bg-gray-600 text-gray-300' 
                                                : 'bg-gray-700 text-gray-500'
                                    }`}
                                >
                                    {page}
                                </div>
                            ))}
                        </div>

                        {/* Frame Visualization */}
                        {Array.from({ length: frameSize }).map((_, frameIdx) => (
                            <div key={frameIdx} className="flex items-center mb-3">
                                <div className="w-20 h-12 flex items-center justify-center bg-gray-700 text-gray-300 font-semibold rounded-lg mr-1">
                                    F{frameIdx}
                                </div>
                                
                                {pages.map((_, stepIdx) => {
                                    const framesAtStep = history[stepIdx];
                                    const pageInFrame = framesAtStep ? framesAtStep[frameIdx] : undefined;
                                    const isCurrentStep = stepIdx === currentStep;
                                    const isFaultAtThisStep = faultHistory[stepIdx];
                                    const isVisible = stepIdx <= currentStep;

                                    if (!isVisible) {
                                        return (
                                            <div 
                                                key={stepIdx}
                                                className="w-16 h-12 mx-1 bg-gray-800 border border-gray-600 rounded-lg"
                                            />
                                        );
                                    }

                                    const pageColorHue = pageInFrame !== undefined ? (pageInFrame * 137) % 360 : 0;
                                    const backgroundColor = pageInFrame !== undefined
                                        ? `hsl(${pageColorHue}, 70%, 60%)`
                                        : 'transparent';

                                    return (
                                        <div 
                                            key={stepIdx}
                                            className={`w-16 h-12 mx-1 rounded-lg border-2 flex items-center justify-center font-bold text-white relative transition-all duration-500 ${
                                                isCurrentStep 
                                                    ? isFaultAtThisStep 
                                                        ? 'border-red-500 shadow-lg shadow-red-500/30 scale-105' 
                                                        : 'border-green-500 shadow-lg shadow-green-500/30 scale-105'
                                                    : 'border-gray-600'
                                            } ${isAnimating && isCurrentStep ? 'animate-pulse' : ''}`}
                                            style={{ backgroundColor }}
                                        >
                                            {pageInFrame !== undefined && (
                                                <span className="relative z-10">{pageInFrame}</span>
                                            )}

                                            {/* Clock Algorithm Indicators */}
                                            {isClock && isCurrentStep && frameIdx === currentPointer && (
                                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs animate-spin">
                                                    <RotateCcw size={12} />
                                                </div>
                                            )}
                                            
                                            {isClock && isCurrentStep && pageInFrame !== undefined && currentRefBitsAtStep && (
                                                <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                                                    {currentRefBitsAtStep[frameIdx] || '0'}
                                                </div>
                                            )}

                                            {/* Animation overlay for current step */}
                                            {isCurrentStep && (
                                                <div className={`absolute inset-0 rounded-lg animate-pulse ${
                                                    isFaultAtThisStep ? 'bg-red-500/20' : 'bg-green-500/20'
                                                }`} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Display */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <div className={`flex items-center gap-3 px-6 py-3 rounded-xl ${
                        currentPageFault 
                            ? 'bg-red-500/20 border border-red-500/30' 
                            : 'bg-green-500/20 border border-green-500/30'
                    }`}>
                        {currentPageFault ? (
                            <AlertCircle size={20} className="text-red-400" />
                        ) : (
                            <CheckCircle2 size={20} className="text-green-400" />
                        )}
                        <span className={`font-semibold ${currentPageFault ? 'text-red-300' : 'text-green-300'}`}>
                            {currentPageFault 
                                ? `Page Fault - Page ${currentPage} not in memory` 
                                : `Page Hit - Page ${currentPage} found in memory`
                            }
                        </span>
                    </div>

                    <div className="text-gray-400">
                        Total Faults: <span className="text-red-400 font-bold">{totalFaultsUpToStep}</span> | 
                        Fault Rate: <span className="text-red-400 font-bold">{faultRate}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisualizationDisplay;