// src/algorithms/simulationRunner.js
import FIFO from './FIFO';
import LRU from './LRU';
import Clock from './Clock';
import AdaptiveAlgorithm from './AdaptiveAlgorithm';
import LFU from './LFU';
import ARC from './ARC';
import LIRS from './LIRS';

// Map algorithm names to their classes
const algorithmsMap = {
    "FIFO": FIFO,
    "LRU": LRU,
    "Clock": Clock,
    "Adaptive": AdaptiveAlgorithm,
    "LFU": LFU,
    "ARC": ARC,
    "LIRS": LIRS
};

/**
 * Runs a single page replacement algorithm simulation and collects history.
 * @param {string} algorithmName - The name of the algorithm to run.
 * @param {number[]} pages - The page reference string.
 * @param {number} frameSize - The number of frames available.
// Prefetching removed
 * @returns {object} - Simulation history and final statistics.
 */
export const runSingleSimulation = (algorithmName, pages, frameSize) => {
    const AlgoClass = algorithmsMap[algorithmName];
    if (!AlgoClass) {
        throw new Error(`Algorithm '${algorithmName}' not found.`);
    }

    const algoObj = new AlgoClass();
    const frames = []; // Represents the physical memory frames, modified in-place by algoObj.step
    let faults = 0; // Total page faults

    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];

        // Simulate current page access
        let faultOccurred = algoObj.step(page, frames, frameSize);
        if (faultOccurred) {
            faults++;
        }

        // Prefetching logic removed
    }

    const historyData = algoObj.getHistory();

    // Return comprehensive simulation data for visualization
    return {
        algorithmName,
        pages,
        frameSize,
        // prefetch removed
        totalFaults: faults,
        history: historyData.history, // Frames state at each step
        faultHistory: historyData.faultHistory, // Page fault status for each original page access
        pointerHistory: historyData.pointerHistory || [], // Clock-specific
        refBitsHistory: historyData.refBitsHistory || [], // Clock-specific
        algoHistory: historyData.algoHistory || [], // Adaptive-specific
        frequencies: historyData.frequencies || [], // LFU-specific
        adaptiveParameter: historyData.adaptiveParameter || 0, // ARC-specific
        T1Size: historyData.T1Size || 0, // ARC-specific
        T2Size: historyData.T2Size || 0, // ARC-specific
        B1Size: historyData.B1Size || 0, // ARC-specific
        B2Size: historyData.B2Size || 0, // ARC-specific
        LIRCount: historyData.LIRCount || 0, // LIRS-specific
        HIRCount: historyData.HIRCount || 0, // LIRS-specific
        stackSize: historyData.stackSize || 0 // LIRS-specific
    };
};

/**
 * Compares all page replacement algorithms for a given scenario.
 * @param {number[]} pages - The page reference string.
 * @param {number} frameSize - The number of frames available.
// Prefetching removed
 * @returns {object} - An object where keys are algorithm names and values are their results (faults, faultRate).
 */
export const compareAllAlgorithms = (pages, frameSize) => {
    const comparisonResults = {};

    for (const algorithmName in algorithmsMap) {
        try {
            // Re-initialize frames and algorithm object for each simulation run
            const AlgoClass = algorithmsMap[algorithmName];
            const algoObj = new AlgoClass();
            const frames = [];
            let faults = 0;

            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];

                // Simulate current page access
                let faultOccurred = algoObj.step(page, frames, frameSize);
                if (faultOccurred) {
                    faults++;
                }

                // Prefetching logic removed
            }

            comparisonResults[algorithmName] = {
                faults: faults,
                faultRate: (faults / pages.length) * 100 // Calculate fault rate
            };
        } catch (error) {
            // Handle any algorithm-specific errors
            console.warn(`Error running ${algorithmName}:`, error);
            comparisonResults[algorithmName] = {
                faults: -1,
                faultRate: -1,
                error: error.message
            };
        }
    }
    return comparisonResults;
};

/**
 * Get list of available algorithms
 * @returns {string[]} - Array of algorithm names
 */
export const getAvailableAlgorithms = () => {
    return Object.keys(algorithmsMap);
};

/**
 * Get algorithm description
 * @param {string} algorithmName - The name of the algorithm
 * @returns {string} - Description of the algorithm
 */
export const getAlgorithmDescription = (algorithmName) => {
    const descriptions = {
        "FIFO": "First In, First Out - Replaces the oldest page in memory",
        "LRU": "Least Recently Used - Replaces the page that hasn't been used for the longest time",
        "Clock": "Clock/Second Chance - Uses reference bits in a circular buffer approach",
        "Adaptive": "Adaptive Algorithm - Dynamically adjusts between different strategies",
        "LFU": "Least Frequently Used - Replaces the page with the lowest access frequency",
        "ARC": "Adaptive Replacement Cache - IBM's algorithm balancing recency and frequency",
        "LIRS": "Low Inter-reference Recency Set - Advanced algorithm using inter-reference recency"
    };
    
    return descriptions[algorithmName] || "No description available";
};