import React, { useState, useEffect } from 'react';
import {
    Settings,
    Play,
    BarChart3,
    Shuffle,
    Cpu,
    Clock,
    Layers,
    Target,
    Brain,
    Zap,
    RefreshCw,
    Info,
    ChevronRight,
    Check,
    AlertCircle,
    Sparkles,
    Database,
    Activity,
    TrendingUp,
    Copy,
    FileText,
    Download,
    Share2,
    Code,
    TestTube
} from 'lucide-react';

const SetupForm = ({
    pageString, setPageString,
    frameSize, setFrameSize,
    selectedAlgorithm, setSelectedAlgorithm,
    numRandomPages, setNumRandomPages,
    pageRange, setPageRange,
    onRunSimulation, onCompareAll
}) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [presets, setPresets] = useState({});
    const [showPresets, setShowPresets] = useState(false);
    const [generationStats, setGenerationStats] = useState(null);

    const algorithms = [
        { id: "FIFO", name: "FIFO (First In, First Out)", icon: Layers, description: "Replaces the oldest page in memory", color: "from-blue-500 to-cyan-500" },
        { id: "LRU", name: "LRU (Least Recently Used)", icon: Clock, description: "Replaces the least recently accessed page", color: "from-purple-500 to-pink-500" },
        { id: "Clock", name: "Clock (Second Chance)", icon: Target, description: "Circular queue with reference bits", color: "from-green-500 to-emerald-500" },
        { id: "Adaptive", name: "Adaptive Algorithm", icon: Cpu, description: "Switches between FIFO and LRU dynamically", color: "from-orange-500 to-red-500" },
        { id: "ML-Based", name: "ML-Based Prediction", icon: Brain, description: "Machine learning inspired replacement", color: "from-indigo-500 to-violet-500" }
    ];

    const commonPresets = {
        "Small Test": { pageString: "1,2,3,4,1,2,5,1,2,3,4,5", frameSize: 3 },
        "Medium Load": { pageString: "7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1", frameSize: 4 },
        "Heavy Traffic": { pageString: "1,2,3,4,5,1,2,3,6,7,8,1,2,3,4,5,6,7,8,9,1,2,3", frameSize: 5 },
        "Locality Pattern": { pageString: "1,1,1,2,2,2,3,3,3,1,1,1,4,4,4,2,2,2", frameSize: 3 },
        "Random Access": { pageString: "9,3,7,1,5,8,2,6,4,9,1,3,7,5,2,8,6,4", frameSize: 4 }
    };

    useEffect(() => {
        validateInputs();
    }, [pageString, frameSize, numRandomPages, pageRange]);

    const validateInputs = () => {
        const errors = {};
        
        // Validate page string
        if (!pageString.trim()) {
            errors.pageString = "Page reference string is required";
        } else {
            const pages = pageString.split(',').map(s => s.trim()).filter(s => s);
            if (pages.some(p => isNaN(parseInt(p)) || parseInt(p) < 0)) {
                errors.pageString = "Page string must contain only non-negative integers";
            }
            if (pages.length < 3) {
                errors.pageString = "Page string must contain at least 3 pages";
            }
            if (pages.length > 100) {
                errors.pageString = "Page string is too long (max 100 pages)";
            }
        }

        // Validate frame size
        if (frameSize < 1 || frameSize > 10) {
            errors.frameSize = "Frame size must be between 1 and 10";
        }

        // Validate random generation parameters
        if (numRandomPages < 5 || numRandomPages > 100) {
            errors.numRandomPages = "Number of pages must be between 5 and 100";
        }

        if (pageRange < 1 || pageRange > 50) {
            errors.pageRange = "Page range must be between 1 and 50";
        }

        setValidationErrors(errors);
    };

    const handleGenerateRandomPages = async () => {
        try {
            if (numRandomPages <= 0 || pageRange <= 0) {
                alert("Number of pages and page range must be positive.");
                return;
            }

            setIsGenerating(true);
            
            // Simulate generation delay for better UX
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const pages = [];
            const pageFrequency = {};
            
            for (let i = 0; i < numRandomPages; i++) {
                const page = Math.floor(Math.random() * pageRange);
                pages.push(page);
                pageFrequency[page] = (pageFrequency[page] || 0) + 1;
            }
            
            const uniquePages = Object.keys(pageFrequency).length;
            const avgFrequency = numRandomPages / uniquePages;
            const mostFrequent = Object.entries(pageFrequency)
                .sort(([,a], [,b]) => b - a)[0];

            setGenerationStats({
                totalPages: numRandomPages,
                uniquePages,
                avgFrequency: avgFrequency.toFixed(1),
                mostFrequent: mostFrequent ? `Page ${mostFrequent[0]} (${mostFrequent[1]} times)` : 'N/A',
                diversity: ((uniquePages / pageRange) * 100).toFixed(1)
            });

            setPageString(pages.join(','));
            setIsGenerating(false);
        } catch (e) {
            setIsGenerating(false);
            alert(`Error generating random pages: ${e.message}`);
        }
    };

    const applyPreset = (preset) => {
        setPageString(preset.pageString);
        setFrameSize(preset.frameSize);
        setShowPresets(false);
    };

    const getAlgorithmIcon = (algo) => {
        const algorithm = algorithms.find(a => a.id === algo);
        return algorithm ? algorithm.icon : Activity;
    };

    const getAlgorithmInfo = (algo) => {
        return algorithms.find(a => a.id === algo);
    };

    const copyPageString = async () => {
        try {
            await navigator.clipboard.writeText(pageString);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const isValid = Object.keys(validationErrors).length === 0 && pageString.trim();

    return (
        <div className="w-full h-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-6 overflow-auto">
            <div className="max-w-4xl mx-auto h-full">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-2xl">
                            <Settings size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Simulation Setup</h1>
                            <p className="text-gray-400">Configure page replacement algorithm parameters</p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Database size={16} className="text-blue-400" />
                                <span className="text-sm text-gray-400">Pages</span>
                            </div>
                            <div className="text-xl font-bold text-white">
                                {pageString ? pageString.split(',').filter(s => s.trim()).length : 0}
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Layers size={16} className="text-green-400" />
                                <span className="text-sm text-gray-400">Frames</span>
                            </div>
                            <div className="text-xl font-bold text-white">{frameSize}</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                {React.createElement(getAlgorithmIcon(selectedAlgorithm), { 
                                    size: 16, 
                                    className: "text-purple-400" 
                                })}
                                <span className="text-sm text-gray-400">Algorithm</span>
                            </div>
                            <div className="text-lg font-bold text-white">{selectedAlgorithm}</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp size={16} className="text-orange-400" />
                                <span className="text-sm text-gray-400">Status</span>
                            </div>
                            <div className={`text-lg font-bold ${isValid ? 'text-green-400' : 'text-red-400'}`}>
                                {isValid ? 'Ready' : 'Invalid'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Configuration */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Simulation Configuration */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <Settings size={20} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Simulation Configuration</h3>
                        </div>

                        <div className="space-y-6">
                            {/* Page Reference String */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-semibold text-gray-300">Page Reference String</label>
                                    <button
                                        onClick={copyPageString}
                                        className="p-1 text-gray-400 hover:text-white transition-colors"
                                        title="Copy page string"
                                    >
                                        <Copy size={14} />
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={pageString}
                                        onChange={(e) => setPageString(e.target.value)}
                                        placeholder="e.g., 1,2,3,4,1,2,5,1,2,3,4,5"
                                        className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                                            validationErrors.pageString 
                                                ? 'border-red-500 focus:ring-red-500/50' 
                                                : 'border-white/20 focus:ring-purple-500/50'
                                        }`}
                                    />
                                    {validationErrors.pageString && (
                                        <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                                            <AlertCircle size={14} />
                                            <span>{validationErrors.pageString}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Frame Size */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Frame Size</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={frameSize}
                                        onChange={(e) => setFrameSize(Math.max(1, parseInt(e.target.value) || 1))}
                                        min="1"
                                        max="10"
                                        className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 transition-all ${
                                            validationErrors.frameSize 
                                                ? 'border-red-500 focus:ring-red-500/50' 
                                                : 'border-white/20 focus:ring-purple-500/50'
                                        }`}
                                    />
                                    {validationErrors.frameSize && (
                                        <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                                            <AlertCircle size={14} />
                                            <span>{validationErrors.frameSize}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Algorithm Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Algorithm</label>
                                <div className="space-y-2">
                                    {algorithms.map(algo => {
                                        const Icon = algo.icon;
                                        return (
                                            <button
                                                key={algo.id}
                                                onClick={() => setSelectedAlgorithm(algo.id)}
                                                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                                                    selectedAlgorithm === algo.id
                                                        ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/25'
                                                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg bg-gradient-to-r ${algo.color}`}>
                                                        <Icon size={16} className="text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-white">{algo.name}</div>
                                                        <div className="text-sm text-gray-400">{algo.description}</div>
                                                    </div>
                                                    {selectedAlgorithm === algo.id && (
                                                        <Check size={16} className="text-purple-400" />
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Random Generation & Presets */}
                    <div className="space-y-6">
                        {/* Random Page Generation */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-600 rounded-lg">
                                    <Shuffle size={20} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Random Page Generation</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Number of Pages</label>
                                    <input
                                        type="number"
                                        value={numRandomPages}
                                        onChange={(e) => setNumRandomPages(Math.max(5, parseInt(e.target.value) || 5))}
                                        min="5"
                                        max="100"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Page Value Range (0 to N-1)</label>
                                    <input
                                        type="number"
                                        value={pageRange}
                                        onChange={(e) => setPageRange(Math.max(1, parseInt(e.target.value) || 10))}
                                        min="1"
                                        max="50"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                                    />
                                </div>

                                <button
                                    onClick={handleGenerateRandomPages}
                                    disabled={isGenerating}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 disabled:scale-100"
                                >
                                    {isGenerating ? (
                                        <>
                                            <RefreshCw size={16} className="animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={16} />
                                            Generate Random Pages
                                        </>
                                    )}
                                </button>

                                {generationStats && (
                                    <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                                        <h4 className="font-semibold text-green-400 mb-2">Generation Statistics</h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="text-gray-300">Total Pages: <span className="text-white font-semibold">{generationStats.totalPages}</span></div>
                                            <div className="text-gray-300">Unique Pages: <span className="text-white font-semibold">{generationStats.uniquePages}</span></div>
                                            <div className="text-gray-300">Avg Frequency: <span className="text-white font-semibold">{generationStats.avgFrequency}</span></div>
                                            <div className="text-gray-300">Diversity: <span className="text-white font-semibold">{generationStats.diversity}%</span></div>
                                            <div className="col-span-2 text-gray-300">Most Frequent: <span className="text-white font-semibold">{generationStats.mostFrequent}</span></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Presets */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-orange-600 rounded-lg">
                                    <TestTube size={20} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Quick Presets</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                {Object.entries(commonPresets).map(([name, preset]) => (
                                    <button
                                        key={name}
                                        onClick={() => applyPreset(preset)}
                                        className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/50 rounded-xl text-left transition-all duration-200 group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-semibold text-white group-hover:text-orange-400 transition-colors">{name}</div>
                                                <div className="text-sm text-gray-400">
                                                    {preset.pageString.length > 30 
                                                        ? `${preset.pageString.substring(0, 30)}...` 
                                                        : preset.pageString
                                                    } • {preset.frameSize} frames
                                                </div>
                                            </div>
                                            <ChevronRight size={16} className="text-gray-400 group-hover:text-orange-400 transition-colors" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={onRunSimulation}
                        disabled={!isValid}
                        className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold text-lg rounded-2xl transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
                    >
                        <Play size={20} />
                        Run Simulation
                        {!isValid && <AlertCircle size={16} />}
                    </button>

                    <button
                        onClick={onCompareAll}
                        disabled={!isValid}
                        className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold text-lg rounded-2xl transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
                    >
                        <BarChart3 size={20} />
                        Compare All Algorithms
                        {!isValid && <AlertCircle size={16} />}
                    </button>
                </div>

                {/* Help Section */}
                <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Info size={20} className="text-blue-400" />
                        <h3 className="text-lg font-semibold text-blue-400">Quick Start Guide</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                            <div>
                                <div className="font-semibold text-white">Enter Page String</div>
                                <div className="text-gray-400">Comma-separated page numbers or use presets</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                            <div>
                                <div className="font-semibold text-white">Set Frame Size</div>
                                <div className="text-gray-400">Number of memory frames (1-10)</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                            <div>
                                <div className="font-semibold text-white">Choose Algorithm</div>
                                <div className="text-gray-400">Select replacement strategy</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetupForm;