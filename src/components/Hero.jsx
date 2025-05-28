import React, { useState, useEffect } from 'react';
import { Play, Zap, Target, BarChart3, Cpu, Clock, Brain, Layers, ArrowRight, BarChart2, Sparkles, Network } from 'lucide-react';

const Hero = ({ onStartSimulation }) => {
    const [currentAlgorithm, setCurrentAlgorithm] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const algorithms = [
        { name: 'FIFO', color: 'from-blue-500 to-cyan-500', icon: Layers, category: 'Basic' },
        { name: 'LRU', color: 'from-purple-500 to-pink-500', icon: Clock, category: 'Basic' },
        { name: 'Clock', color: 'from-green-500 to-emerald-500', icon: Cpu, category: 'Basic' },
        { name: 'LFU', color: 'from-purple-500 to-pink-500', icon: BarChart2, category: 'Frequency' },
        { name: 'ARC', color: 'from-indigo-500 to-purple-500', icon: Sparkles, category: 'Adaptive' },
        { name: 'LIRS', color: 'from-red-500 to-pink-500', icon: Network, category: 'Advanced' },
        { name: 'Adaptive', color: 'from-orange-500 to-red-500', icon: Zap, category: 'Adaptive' }
    ];

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setCurrentAlgorithm((prev) => (prev + 1) % algorithms.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const features = [
        { icon: BarChart3, title: 'Interactive Visualization', desc: 'Dynamic charts and animations' },
        { icon: Zap, title: 'Real-time Comparison', desc: 'Live performance metrics' },
        { icon: Target, title: 'Algorithm Analysis', desc: 'Deep insights and statistics' }
    ];

    const AlgorithmIcon = algorithms[currentAlgorithm].icon;

    return (
        <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative flex items-center justify-center">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div 
                    className="absolute inset-0 opacity-30 transition-all duration-300"
                    style={{
                        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)`
                    }}
                />
                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full animate-pulse opacity-20"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${2 + Math.random() * 3}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Main Content - Centered and Contained */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col items-center justify-center text-center min-h-0">
                
                {/* Algorithm Badge */}
                <div 
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${algorithms[currentAlgorithm].color} text-white font-semibold shadow-lg mb-4 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    style={{ transitionDelay: '0.2s' }}
                >
                    <AlgorithmIcon size={16} />
                    <span className="text-sm">Now Featuring: {algorithms[currentAlgorithm].name}</span>
                </div>

                {/* Main Title - Controlled sizing */}
                <h1 
                    className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-cyan-200 mb-3 leading-tight transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    style={{ transitionDelay: '0.4s' }}
                >
                    <div>Smart Memory</div>
                    <div className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Management System
                    </div>
                </h1>

                {/* Subtitle - Compact */}
                <p 
                    className={`text-base sm:text-lg md:text-xl text-gray-300 mb-3 max-w-4xl leading-relaxed font-light transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    style={{ transitionDelay: '0.6s' }}
                >
                    Master operating system memory management with stunning visualizations
                </p>

                {/* Description - More compact */}
                <p 
                    className={`text-sm sm:text-base text-gray-400 mb-6 max-w-3xl leading-relaxed transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    style={{ transitionDelay: '0.8s' }}
                >
                    Explore FIFO, LRU, Clock, LFU, ARC, LIRS, and Adaptive, algorithms through interactive visualizations that make complex concepts easy to understand.
                </p>

                {/* CTA Button */}
                <div 
                    className={`mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    style={{ transitionDelay: '1s' }}
                >
                    <button 
                        onClick={onStartSimulation}
                        className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-purple-500/25 hover:scale-105 transform transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Play size={20} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="relative z-10">Start Simulation</span>
                        <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                </div>

                {/* Features Grid - Compact */}
                <div 
                    className={`grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl w-full mb-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    style={{ transitionDelay: '1.2s' }}
                >
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon;
                        return (
                            <div 
                                key={index}
                                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative z-10">
                                    <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                                        <IconComponent size={18} className="text-white" />
                                    </div>
                                    <h3 className="text-base font-bold text-white mb-1">{feature.title}</h3>
                                    <p className="text-sm text-gray-400">{feature.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Stats - Compact */}
                <div 
                    className={`grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl w-full transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    style={{ transitionDelay: '1.4s' }}
                >
                    {[
                        { label: 'Algorithms', value: '8+', icon: '🧠' },
                        { label: 'Interactive', value: '100%', icon: '📊' },
                        { label: 'Real-time', value: 'Live', icon: '⚡' },
                        { label: 'Learning', value: 'Enhanced', icon: '🎓' }
                    ].map((stat, index) => (
                        <div key={index} className="text-center p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300">
                            <div className="text-lg mb-1">{stat.icon}</div>
                            <div className="text-sm font-bold text-white">{stat.value}</div>
                            <div className="text-xs text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Elements - Positioned safely */}
            <div className="absolute top-20 left-8 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse hidden sm:block" />
            <div className="absolute bottom-20 right-8 w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse hidden sm:block" style={{ animationDelay: '1s' }} />
        </div>
    );
};

export default Hero;