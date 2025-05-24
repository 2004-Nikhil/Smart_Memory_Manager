import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { 
    Trophy, 
    TrendingDown, 
    TrendingUp, 
    BarChart3, 
    PieChart, 
    Activity,
    Award,
    Target,
    Zap,
    Clock,
    Layers,
    Cpu,
    Brain,
    Download,
    Share2,
    FileText,
    Code,
    Eye,
    Copy,
    Check,
    Terminal,
    Info,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ComparisonChart = ({ comparisonResults, pageString, frameSize }) => {
    const [selectedMetric, setSelectedMetric] = useState('faults');
    const [animationComplete, setAnimationComplete] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [showTextResults, setShowTextResults] = useState(false);
    const [textResultsExpanded, setTextResultsExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimationComplete(true), 1000);
        return () => clearTimeout(timer);
    }, [comparisonResults]);

    if (!comparisonResults || Object.keys(comparisonResults).length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center p-6">
                <div className="text-center max-w-lg">
                    <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                        <BarChart3 size={48} className="text-blue-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-6">Algorithm Comparison</h2>
                    <p className="text-gray-400 text-lg leading-relaxed mb-8">
                        Execute "Compare All Algorithms" in the Setup tab to generate comprehensive performance analytics and visualizations.
                    </p>
                    <div className="flex justify-center">
                        <div className="px-6 py-3 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 flex items-center gap-2">
                            <Activity size={16} />
                            <span>Waiting for comparison data...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const algorithms = Object.keys(comparisonResults);
    const faultCounts = algorithms.map(algo => comparisonResults[algo].faults);
    const faultRates = algorithms.map(algo => comparisonResults[algo].faultRate);
    const hitRates = algorithms.map(algo => 100 - comparisonResults[algo].faultRate);

    // Find best and worst performers
    const minFaults = Math.min(...faultCounts);
    const maxFaults = Math.max(...faultCounts);
    const bestAlgoIndex = faultCounts.indexOf(minFaults);
    const worstAlgoIndex = faultCounts.indexOf(maxFaults);
    const bestAlgorithm = algorithms[bestAlgoIndex];
    const worstAlgorithm = algorithms[worstAlgoIndex];

    // Generate text results
    const generateTextResults = () => {
        if (!pageString || !frameSize) return null;

        const pages = pageString
            .split(',')
            .map(s => parseInt(s.trim()))
            .filter(n => !isNaN(n));
        const displayed = pages.length > 20 ? pages.slice(0, 20).join(', ') + '...' : pages.join(', ');

        const sorted = Object.entries(comparisonResults).sort(([, a], [, b]) => a.faults - b.faults);
        const [bestAlgo, bestData] = sorted[0];

        const resultLines = sorted.map(([name, data]) =>
            `${name.padEnd(15)} ${String(data.faults).padEnd(15)} ${data.faultRate.toFixed(2)}%`
        ).join('\n');

        const descriptions = `
FIFO        - Replaces oldest page
LRU         - Replaces least recently used page
Clock       - Second-chance via reference bits
Adaptive    - Switches between FIFO/LRU based on pattern
ML-Based    - Simulates machine learning (LRU-like behavior)
        `.trim();

        return `
═══════════════════════════════════════════════════════════
                PAGE REPLACEMENT ALGORITHM COMPARISON
═══════════════════════════════════════════════════════════

Simulation Parameters:
├── Page String: [${displayed}]
├── Total Pages: ${pages.length}
└── Frame Size: ${frameSize}

Performance Results:
${'Algorithm'.padEnd(15)} ${'Page Faults'.padEnd(15)} ${'Fault Rate'}
${'─'.repeat(45)}
${resultLines}

🏆 Best Performance: ${bestAlgo} (${bestData.faults} faults, ${bestData.faultRate.toFixed(2)}%)

Algorithm Descriptions:
${descriptions}

Generated on: ${new Date().toLocaleString()}
        `.trim();
    };

    const handleCopyResults = async () => {
        const textResults = generateTextResults();
        if (textResults) {
            try {
                await navigator.clipboard.writeText(textResults);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    // Algorithm icons and colors
    const getAlgorithmIcon = (algo) => {
        switch (algo) {
            case 'FIFO': return Layers;
            case 'LRU': return Clock;
            case 'Clock': return Target;
            case 'Adaptive': return Cpu;
            case 'ML-based': return Brain;
            default: return Activity;
        }
    };

    const getAlgorithmColor = (algo, index) => {
        const colors = [
            'from-blue-500 to-cyan-500',
            'from-purple-500 to-pink-500',
            'from-green-500 to-emerald-500',
            'from-orange-500 to-red-500',
            'from-indigo-500 to-violet-500'
        ];
        return colors[index % colors.length];
    };

    const getAlgorithmBgColor = (algo, index, isWinner = false) => {
        if (isWinner) return 'rgba(34, 197, 94, 0.8)';
        const bgColors = [
            'rgba(59, 130, 246, 0.8)',
            'rgba(147, 51, 234, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(249, 115, 22, 0.8)',
            'rgba(99, 102, 241, 0.8)'
        ];
        return bgColors[index % bgColors.length];
    };

    const getBorderColor = (algo, index, isWinner = false) => {
        if (isWinner) return 'rgba(34, 197, 94, 1)';
        const borderColors = [
            'rgba(59, 130, 246, 1)',
            'rgba(147, 51, 234, 1)',
            'rgba(34, 197, 94, 1)',
            'rgba(249, 115, 22, 1)',
            'rgba(99, 102, 241, 1)'
        ];
        return borderColors[index % borderColors.length];
    };

    const chartData = {
        labels: algorithms,
        datasets: [
            {
                label: selectedMetric === 'faults' ? 'Page Faults' : selectedMetric === 'faultRate' ? 'Fault Rate (%)' : 'Hit Rate (%)',
                data: selectedMetric === 'faults' ? faultCounts : selectedMetric === 'faultRate' ? faultRates : hitRates,
                backgroundColor: algorithms.map((algo, idx) => getAlgorithmBgColor(algo, idx, idx === bestAlgoIndex)),
                borderColor: algorithms.map((algo, idx) => getBorderColor(algo, idx, idx === bestAlgoIndex)),
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1500,
            easing: 'easeInOutQuart',
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                titleColor: '#ffffff',
                bodyColor: '#e2e8f0',
                borderColor: 'rgba(147, 51, 234, 0.5)',
                borderWidth: 1,
                cornerRadius: 12,
                displayColors: false,
                callbacks: {
                    title: function(context) {
                        return `${context[0].label} Algorithm`;
                    },
                    label: function(context) {
                        const value = context.parsed.y;
                        const suffix = selectedMetric === 'faults' ? ' faults' : '%';
                        return `${context.dataset.label}: ${value.toFixed(1)}${suffix}`;
                    },
                    afterLabel: function(context) {
                        const index = context.dataIndex;
                        if (index === bestAlgoIndex) {
                            return '🏆 Best Performance';
                        } else if (index === worstAlgoIndex) {
                            return '⚠ Needs Improvement';
                        }
                        return '';
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(148, 163, 184, 0.1)',
                },
                ticks: {
                    color: '#94a3b8',
                    font: {
                        size: 12,
                    },
                    callback: function(value) {
                        return selectedMetric === 'faults' ? value : value + '%';
                    }
                },
                title: {
                    display: true,
                    text: selectedMetric === 'faults' ? 'Page Faults' : 'Percentage (%)',
                    color: '#e2e8f0',
                    font: {
                        size: 14,
                        weight: 'bold',
                    }
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#94a3b8',
                    font: {
                        size: 12,
                        weight: 'bold',
                    }
                },
                title: {
                    display: true,
                    text: 'Algorithms',
                    color: '#e2e8f0',
                    font: {
                        size: 14,
                        weight: 'bold',
                    }
                }
            }
        }
    };

    return (
        <div className="w-full h-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto h-full">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-2xl">
                                <BarChart3 size={24} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Algorithm Performance Comparison</h1>
                                <p className="text-gray-400">Comprehensive analysis of {algorithms.length} page replacement algorithms</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setShowDetails(!showDetails)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all duration-200 hover:scale-105 flex items-center gap-2"
                            >
                                <PieChart size={16} />
                                Details
                            </button>
                            <button 
                                onClick={() => setShowTextResults(!showTextResults)}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-200 hover:scale-105 flex items-center gap-2"
                            >
                                <FileText size={16} />
                                Text Report
                            </button>
                            <button 
                                onClick={handleCopyResults}
                                className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-all duration-200 hover:scale-105"
                                title="Copy Results"
                            >
                                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                            </button>
                            <button className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-all duration-200 hover:scale-105">
                                <Download size={16} />
                            </button>
                            <button className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-all duration-200 hover:scale-105">
                                <Share2 size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Metric Selector */}
                    <div className="flex gap-3 mb-6">
                        {[
                            { key: 'faults', label: 'Page Faults', icon: TrendingDown },
                            { key: 'faultRate', label: 'Fault Rate', icon: TrendingUp },
                            { key: 'hitRate', label: 'Hit Rate', icon: Target }
                        ].map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setSelectedMetric(key)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                                    selectedMetric === key
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                <Icon size={16} />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Text Results Section */}
                {showTextResults && (
                    <div className="mb-8">
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                            <div 
                                className="flex items-center justify-between p-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-b border-white/10 cursor-pointer hover:from-green-600/30 hover:to-emerald-600/30 transition-all duration-200"
                                onClick={() => setTextResultsExpanded(!textResultsExpanded)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-600 rounded-lg">
                                        <Terminal size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Detailed Text Results</h3>
                                        <p className="text-sm text-gray-300">Command-line style performance report</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCopyResults();
                                        }}
                                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
                                        title="Copy to clipboard"
                                    >
                                        {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-gray-300" />}
                                    </button>
                                    {textResultsExpanded ? 
                                        <ChevronUp size={20} className="text-gray-400" /> : 
                                        <ChevronDown size={20} className="text-gray-400" />
                                    }
                                </div>
                            </div>
                            
                            {textResultsExpanded && (
                                <div className="p-6">
                                    <div className="bg-black/50 rounded-xl p-6 font-mono text-sm overflow-x-auto">
                                        <pre className="text-green-400 whitespace-pre-wrap leading-relaxed">
                                            {generateTextResults()}
                                        </pre>
                                    </div>
                                    
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <Info size={14} />
                                            <span>This report can be copied and saved for documentation</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={handleCopyResults}
                                                className="px-3 py-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg text-sm transition-all duration-200 flex items-center gap-1.5"
                                            >
                                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                                {copied ? 'Copied!' : 'Copy Report'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Winner/Loser Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Winner Card */}
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-green-500 rounded-xl">
                                <Trophy size={24} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-green-400">Best Performer</h3>
                                <p className="text-green-300">Lowest fault count</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {React.createElement(getAlgorithmIcon(bestAlgorithm), { 
                                size: 20, 
                                className: "text-green-400" 
                            })}
                            <span className="text-2xl font-bold text-white">{bestAlgorithm}</span>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm text-green-300">Page Faults</div>
                                <div className="text-lg font-bold text-white">{faultCounts[bestAlgoIndex]}</div>
                            </div>
                            <div>
                                <div className="text-sm text-green-300">Fault Rate</div>
                                <div className="text-lg font-bold text-white">{faultRates[bestAlgoIndex].toFixed(1)}%</div>
                            </div>
                        </div>
                    </div>

                    {/* Needs Improvement Card */}
                    <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-red-500 rounded-xl">
                                <TrendingUp size={24} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-red-400">Needs Improvement</h3>
                                <p className="text-red-300">Highest fault count</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {React.createElement(getAlgorithmIcon(worstAlgorithm), { 
                                size: 20, 
                                className: "text-red-400" 
                            })}
                            <span className="text-2xl font-bold text-white">{worstAlgorithm}</span>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm text-red-300">Page Faults</div>
                                <div className="text-lg font-bold text-white">{faultCounts[worstAlgoIndex]}</div>
                            </div>
                            <div>
                                <div className="text-sm text-red-300">Fault Rate</div>
                                <div className="text-lg font-bold text-white">{faultRates[worstAlgoIndex].toFixed(1)}%</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
                    <div className="h-96">
                        <Bar data={chartData} options={options} />
                    </div>
                </div>

                {/* Detailed Statistics */}
                {showDetails && (
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Award size={20} />
                            Detailed Performance Metrics
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {algorithms.map((algorithm, index) => {
                                const AlgorithmIcon = getAlgorithmIcon(algorithm);
                                const isWinner = index === bestAlgoIndex;
                                const isLoser = index === worstAlgoIndex;
                                
                                return (
                                    <div 
                                        key={algorithm}
                                        className={`relative bg-white/5 border rounded-xl p-6 transition-all duration-300 hover:scale-105 ${
                                            isWinner ? 'border-green-500/50 shadow-lg shadow-green-500/20' :
                                            isLoser ? 'border-red-500/50 shadow-lg shadow-red-500/20' :
                                            'border-white/10 hover:border-purple-500/50'
                                        }`}
                                    >
                                        {isWinner && (
                                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                <Trophy size={16} className="text-white" />
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`p-2 rounded-lg bg-gradient-to-r ${getAlgorithmColor(algorithm, index)}`}>
                                                <AlgorithmIcon size={20} className="text-white" />
                                            </div>
                                            <h4 className="text-lg font-semibold text-white">{algorithm}</h4>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Page Faults:</span>
                                                <span className="text-white font-bold">{faultCounts[index]}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Fault Rate:</span>
                                                <span className="text-white font-bold">{faultRates[index].toFixed(1)}%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Hit Rate:</span>
                                                <span className="text-white font-bold">{hitRates[index].toFixed(1)}%</span>
                                            </div>
                                            
                                            {/* Performance bar */}
                                            <div className="mt-4">
                                                <div className="flex justify-between text-sm text-gray-400 mb-1">
                                                    <span>Performance</span>
                                                    <span>{hitRates[index].toFixed(1)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-700 rounded-full h-2">
                                                    <div 
                                                        className={`h-2 rounded-full bg-gradient-to-r ${getAlgorithmColor(algorithm, index)} transition-all duration-1000`}
                                                        style={{ 
                                                            width: animationComplete ? `${hitRates[index]}%` : '0%',
                                                            transitionDelay: `${index * 200}ms`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComparisonChart;