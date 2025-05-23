import React, { useState, useEffect } from 'react';
import { ChevronDown, Play, Zap, Target, BarChart3, Cpu, Clock, Brain, Layers } from 'lucide-react';

const Hero = () => {
    const [currentAlgorithm, setCurrentAlgorithm] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const algorithms = [
        { name: 'FIFO', color: 'from-blue-500 to-cyan-500', icon: Layers },
        { name: 'LRU', color: 'from-purple-500 to-pink-500', icon: Clock },
        { name: 'Clock', color: 'from-green-500 to-emerald-500', icon: Cpu },
        { name: 'Adaptive', color: 'from-orange-500 to-red-500', icon: Zap },
        { name: 'ML-based', color: 'from-indigo-500 to-purple-500', icon: Brain }
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
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div 
                    className="absolute inset-0 opacity-30"
                    style={{
                        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)`
                    }}
                />
                <div className="absolute inset-0">
                    {[...Array(50)].map((_, i) => (
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

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-screen text-center">
                {/* Algorithm Badge */}
                <div 
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${algorithms[currentAlgorithm].color} text-white font-semibold mb-8 shadow-2xl transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    style={{ transitionDelay: '0.2s' }}
                >
                    <AlgorithmIcon size={16} />
                    <span>Now Featuring: {algorithms[currentAlgorithm].name} Algorithm</span>
                </div>

                {/* Main Title */}
                <h1 
                    className={`text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-cyan-200 mb-6 leading-tight transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    style={{ transitionDelay: '0.4s' }}
                >
                    Page Replacement
                    <br />
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Algorithm Simulator
                    </span>
                </h1>

                {/* Subtitle */}
                <p 
                    className={`text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl leading-relaxed font-light transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    style={{ transitionDelay: '0.6s' }}
                >
                    Master operating system memory management with stunning visualizations and real-time performance analytics
                </p>

                {/* Description */}
                <p 
                    className={`text-lg text-gray-400 mb-12 max-w-4xl leading-relaxed transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    style={{ transitionDelay: '0.8s' }}
                >
                    Dive deep into FIFO, LRU, Clock, Adaptive, and cutting-edge ML-based algorithms. 
                    Our interactive platform transforms complex memory management concepts into 
                    intuitive visual experiences that accelerate learning and understanding.
                </p>

                {/* CTA Button */}
                <button 
                    className={`group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-purple-500/25 hover:scale-105 transform transition-all duration-300 mb-16 overflow-hidden ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    style={{ transitionDelay: '1s' }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Play size={20} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="relative z-10">Start Simulation</span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 group-active:opacity-30 transition-opacity duration-150" />
                </button>

                {/* Features Grid */}
                <div 
                    className={`grid md:grid-cols-3 gap-8 max-w-5xl transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    style={{ transitionDelay: '1.2s' }}
                >
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon;
                        return (
                            <div 
                                key={index}
                                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative z-10">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                                        <IconComponent size={24} className="text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Scroll Indicator */}
                <div 
                    className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    style={{ transitionDelay: '1.4s' }}
                >
                    <div className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">
                        <span className="text-sm font-medium">Explore More</span>
                        <ChevronDown size={24} className="animate-bounce" />
                    </div>
                </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 right-20 w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
        </section>
    );
};

export default Hero;