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
    TestTube,
    BarChart2,
    Network
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
        { id: "FIFO", name: "FIFO (First In, First Out)", icon: Layers, description: "Replaces the oldest page in memory", color: "from-blue-500 to-cyan-500", category: "Basic" },
        { id: "LRU", name: "LRU (Least Recently Used)", icon: Clock, description: "Replaces the least recently accessed page", color: "from-purple-500 to-pink-500", category: "Basic" },
        { id: "Clock", name: "Clock (Second Chance)", icon: Target, description: "Circular queue with reference bits", color: "from-green-500 to-emerald-500", category: "Basic" },
        { id: "LFU", name: "LFU (Least Frequently Used)", icon: BarChart2, description: "Replaces the least frequently used page", color: "from-purple-500 to-pink-500", category: "Frequency" },
        { id: "ARC", name: "ARC (Adaptive Replacement Cache)", icon: Sparkles, description: "Adaptive replacement cache", color: "from-indigo-500 to-purple-500", category: "Adaptive" },
        { id: "LIRS", name: "LIRS (Low Inter-reference Recency Set)", icon: Network, description: "Low inter-reference recency set", color: "from-red-500 to-pink-500", category: "Advanced" },
        { id: "Adaptive", name: "Adaptive Algorithm", icon: Cpu, description: "Switches between FIFO and LRU dynamically", color: "from-orange-500 to-red-500", category: "Adaptive" }
    ];

    const commonPresets = {
        "Small Test": { pageString: "1,2,3,4,1,2,5,1,2,3,4,5", frameSize: 3 },
        "Medium Load": { pageString: "7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1", frameSize: 4 },
        "Heavy Traffic": { pageString: "1,2,3,4,5,1,2,3,6,7,8,1,2,3,4,5,6,7,8,9,1,2,3", frameSize: 5 },
        "Locality Pattern": { pageString: "1,1,1,2,2,2,3,3,3,1,1,1,4,4,4,2,2,2", frameSize: 3 },
        "Random Access": { pageString: "9,3,7,1,5,8,2,6,4,9,1,3,7,5,2,8,6,4", frameSize: 4 }
    };

    useEffect(() => {
        setPresets(commonPresets);
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
        return algorithms.find(a => a.id === algo) || {
            id: algo,
            name: algo,
            icon: Activity,
            description: "Unknown algorithm",
            color: "from-gray-500 to-gray-600",
            category: "Other"
        };
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
                            <h1 className="text-3xl font-bold text-white">Memory Management Setup</h1>
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

                    {/* Right Column Container */}
                    <div className="space-y-8">
                        {/* Random Page Generator */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-purple-600 rounded-lg">
                                    <Shuffle size={20} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Random Page Generator</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Number of Pages */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Number of Pages</label>
                                    <input
                                        type="number"
                                        value={numRandomPages}
                                        onChange={(e) => setNumRandomPages(Math.max(5, parseInt(e.target.value) || 5))}
                                        min="5"
                                        max="100"
                                        className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 transition-all ${
                                            validationErrors.numRandomPages 
                                                ? 'border-red-500 focus:ring-red-500/50' 
                                                : 'border-white/20 focus:ring-purple-500/50'
                                        }`}
                                    />
                                    {validationErrors.numRandomPages && (
                                        <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                                            <AlertCircle size={14} />
                                            <span>{validationErrors.numRandomPages}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Page Range */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Page Range (0 to N)</label>
                                    <input
                                        type="number"
                                        value={pageRange}
                                        onChange={(e) => setPageRange(Math.max(1, parseInt(e.target.value) || 1))}
                                        min="1"
                                        max="50"
                                        className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 transition-all ${
                                            validationErrors.pageRange 
                                                ? 'border-red-500 focus:ring-red-500/50' 
                                                : 'border-white/20 focus:ring-purple-500/50'
                                        }`}
                                    />
                                    {validationErrors.pageRange && (
                                        <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                                            <AlertCircle size={14} />
                                            <span>{validationErrors.pageRange}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Generate Button */}
                                <button
                                    onClick={handleGenerateRandomPages}
                                    disabled={isGenerating || validationErrors.numRandomPages || validationErrors.pageRange}
                                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                                        isGenerating || validationErrors.numRandomPages || validationErrors.pageRange
                                            ? 'bg-gray-600 cursor-not-allowed'
                                            : 'bg-purple-600 hover:bg-purple-700 hover:scale-105'
                                    } text-white`}
                                >
                                    {isGenerating ? (
                                        <>
                                            <RefreshCw size={16} className="animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Shuffle size={16} />
                                            Generate Random Pages
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Generation Stats */}
                            {generationStats && (
                                <div className="mt-6 bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Info size={16} className="text-purple-400" />
                                        <span className="text-sm font-semibold text-purple-300">Generation Stats</span>
                                    </div>
                                    <div className="text-sm text-gray-300 space-y-1">
                                        <p>Total Pages: {generationStats.totalPages}</p>
                                        <p>Unique Pages: {generationStats.uniquePages}</p>
                                        <p>Average Frequency: {generationStats.avgFrequency}</p>
                                        <p>Most Frequent: {generationStats.mostFrequent}</p>
                                        <p>Diversity: {generationStats.diversity}%</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Presets */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                            <button
                                onClick={() => setShowPresets(!showPresets)}
                                className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-600 rounded-lg">
                                        <TestTube size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Common Test Presets</h3>
                                        <p className="text-sm text-gray-400">Pre-configured scenarios for quick testing</p>
                                    </div>
                                </div>
                                <ChevronRight size={20} className={`text-gray-400 transition-transform ${showPresets ? 'rotate-90' : ''}`} />
                            </button>

                            {showPresets && (
                                <div className="mt-4 grid grid-cols-1 gap-4">
                                    {Object.entries(presets).map(([name, preset]) => (
                                        <button
                                            key={name}
                                            onClick={() => applyPreset(preset)}
                                            className="p-4 bg-white/5 border border-white/10 rounded-xl text-left hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                                        >
                                            <div className="font-semibold text-white">{name}</div>
                                            <div className="text-sm text-gray-400 mt-1">
                                                Pages: {preset.pageString.split(',').length} | Frames: {preset.frameSize}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={onRunSimulation}
                        disabled={!isValid}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                            isValid
                                ? 'bg-green-600 hover:bg-green-700 hover:scale-105'
                                : 'bg-gray-600 cursor-not-allowed'
                        } text-white`}
                    >
                        <Play size={16} />
                        Run Simulation
                    </button>

                    <button
                        onClick={onCompareAll}
                        disabled={!isValid}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                            isValid
                                ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
                                : 'bg-gray-600 cursor-not-allowed'
                        } text-white`}
                    >
                        <BarChart3 size={16} />
                        Compare All Algorithms
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SetupForm;