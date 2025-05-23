// src/components/VisualizationDisplay.js
import React, { useEffect, useRef } from 'react';
import './VisualizationDisplay.css'; // Dedicated CSS for visualization grid structure

const VisualizationDisplay = ({ simulationData, currentStep, setCurrentStep, autoPlay, setAutoPlay }) => {
    if (!simulationData || simulationData.history.length === 0) {
        return (
            <div className="visualization-container">
                <div className="vis-header">
                    <h2>Algorithm Visualization</h2>
                    <p>Run a simulation on the "Setup" tab to see visualization.</p>
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

    // Use useRef to keep track of autoPlay state across renders for setTimeout
    const autoPlayRef = useRef(autoPlay);
    autoPlayRef.current = autoPlay;

    useEffect(() => {
        let timeoutId;
        if (autoPlayRef.current && currentStep < totalSteps - 1) {
            timeoutId = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 1000); // 1 second delay
        } else if (autoPlayRef.current && currentStep === totalSteps - 1) {
            // Stop autoplay when it reaches the end
            setAutoPlay(false);
        }
        return () => clearTimeout(timeoutId); // Cleanup on component unmount or state change
    }, [currentStep, totalSteps, setAutoPlay]);

    const handlePrev = () => {
        if (currentStep > 0) {
            setAutoPlay(false); // Stop autoplay on manual navigation
            setCurrentStep(currentStep - 1);
        }
    };

    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            setAutoPlay(false); // Stop autoplay on manual navigation
            setCurrentStep(currentStep + 1);
        }
    };

    // Calculate number of columns needed for the grid: 1 for frame labels + N for pages
    const numCols = pages.length;

    return (
        <div className="visualization-container">
            <div className="vis-header">
                <h2>{algorithmName} Algorithm Visualization</h2>
                <p>Frame Size: {frameSize}</p>
                {isAdaptive && <p>Algorithm in use: {currentAlgo}</p>}
            </div>

            <div className="control-buttons">
                <button onClick={handlePrev} disabled={currentStep === 0}>&lt; Previous</button>
                <span className="step-label">{currentStep + 1} / {totalSteps}</span>
                <button onClick={handleNext} disabled={currentStep === totalSteps - 1}>Next &gt;</button>
                <label className="autoplay-checkbox">
                    <input
                        type="checkbox"
                        checked={autoPlay}
                        onChange={(e) => setAutoPlay(e.target.checked)}
                        disabled={currentStep === totalSteps - 1} // Disable if at last step
                    />
                    Auto Play
                </label>
            </div>

            <div className="frames-grid-container" style={{ '--num-pages': numCols }}>
                <div className="frames-grid" >
                    {/* Top-left empty corner cell */}
                    <div className="grid-header-cell empty-corner" style={{ gridColumn: 1, gridRow: 1 }}></div>

                    {/* Page Reference String Header (Row 1, after the empty corner) */}
                    {Array.from({ length: numCols }).map((_, colIdx) => (
                        <div key={`header-${colIdx}`} className="grid-header-cell"
                            style={{ gridColumn: colIdx + 2, gridRow: 1 }}> {/* +2 because col 1 is for frame labels */}
                            {pages[colIdx]}
                        </div>
                    ))}

                    {/* Highlight Current Page Being Referenced */}
                    <div className="grid-header-cell current-page-cell"
                         style={{ gridColumn: currentStep + 2, gridRow: 1 }}> {/* +2 for same reason */}
                        {pages[currentStep]}
                    </div>

                    {/* Frame labels (Column 1, starting from Row 2) */}
                    {Array.from({ length: frameSize }).map((_, rowIdx) => (
                        <div key={`frame-label-${rowIdx}`} className="grid-header-cell frame-label-col"
                            style={{ gridColumn: 1, gridRow: rowIdx + 2 }}> {/* +2 because row 1 is header */}
                            Frame {rowIdx}
                        </div>
                    ))}

                    {/* Frame Contents - This is where the actual visualization happens */}
                    {/* Iterate through each step to draw all past states up to currentStep */}
                    {history.slice(0, currentStep + 1).map((framesAtStep, stepIdx) => (
                        Array.from({ length: frameSize }).map((_, frameIdx) => {
                            const pageInFrame = framesAtStep[frameIdx];
                            const isCurrentStep = stepIdx === currentStep;
                            const isFaultAtThisStep = faultHistory[stepIdx];

                            let cellClass = 'grid-cell';
                            if (isCurrentStep) {
                                if (isFaultAtThisStep) {
                                    cellClass += ' fault';
                                } else {
                                    cellClass += ' hit';
                                }
                            }

                            // Generate a consistent color for each page number
                            const pageColorHue = (pageInFrame * 137) % 360; // Use a prime number for better distribution
                            const backgroundColor = pageInFrame !== undefined
                                ? `hsl(${pageColorHue}, 70%, 85%)` // Light background for pages
                                : '#f0f0f0'; // Default for empty frame

                            const borderColor = pageInFrame !== undefined
                                ? `hsl(${pageColorHue}, 70%, 65%)` // Darker border for pages
                                : '#ccc';

                            return (
                                <div
                                    key={`${stepIdx}-${frameIdx}`}
                                    className={cellClass}
                                    style={{
                                        gridColumn: stepIdx + 2, // Corresponds to the step index + 2 (1 for frame label, 1 for 0-index)
                                        gridRow: frameIdx + 2, // Corresponds to the frame index + 2 (1 for header, 1 for 0-index)
                                        backgroundColor: backgroundColor,
                                        borderColor: borderColor
                                    }}
                                >
                                    {pageInFrame !== undefined && (
                                        <span>{pageInFrame}</span>
                                    )}

                                    {/* Clock specific: Pointer and Ref Bit */}
                                    {isClock && isCurrentStep && frameIdx === currentPointer && (
                                        <div className="pointer-indicator">
                                            ↺ {/* Unicode for anti-clockwise arrow (refresh) */}
                                        </div>
                                    )}
                                    {isClock && isCurrentStep && pageInFrame !== undefined && (
                                        <div className="ref-bit">
                                            {currentRefBitsAtStep && currentRefBitsAtStep[frameIdx] !== undefined ? currentRefBitsAtStep[frameIdx] : 'N/A'}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ))}
                </div>
            </div>

            <div className="status-info">
                <span>Status: {currentPageFault ? `Page Fault (Page ${currentPage} not in frames)` : `Page Hit (Page ${currentPage} already in frames)`}</span>
                <span>Page Faults: {totalFaultsUpToStep}</span>
            </div>
        </div>
    );
};

export default VisualizationDisplay;