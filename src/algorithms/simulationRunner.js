// src/algorithms/simulationRunner.js
import FIFO from './FIFO';
import LRU from './LRU';
import Clock from './Clock';
import AdaptiveAlgorithm from './AdaptiveAlgorithm';
import MLPageReplacement from './MLPageReplacement';

// Map algorithm names to their classes
const algorithmsMap = {
    "FIFO": FIFO,
    "LRU": LRU,
    "Clock": Clock,
    "Adaptive": AdaptiveAlgorithm,
    "ML-Based": MLPageReplacement
};

/**
 * Runs a single page replacement algorithm simulation and collects history.
 * @param {string} algorithmName - The name of the algorithm to run.
 * @param {number[]} pages - The page reference string.
 * @param {number} frameSize - The number of frames available.
 * @param {boolean} prefetch - Whether prefetching is enabled.
 * @returns {object} - Simulation history and final statistics.
 */
export const runSingleSimulation = (algorithmName, pages, frameSize, prefetch) => {
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

        // Handle prefetch (if enabled and next page exists)
        // Python's run_algorithm calls algo_obj.step for prefetch, and counts fault if it returns true.
        if (prefetch && i + 1 < pages.length) {
            const nextPage = pages[i + 1];
            if (algoObj.step(nextPage, frames, frameSize)) { // If prefetch causes a fault, count it
                faults++;
            }
        }
    }

    const historyData = algoObj.getHistory();

    // Return comprehensive simulation data for visualization
    return {
        algorithmName,
        pages,
        frameSize,
        prefetch,
        totalFaults: faults,
        history: historyData.history, // Frames state at each step
        faultHistory: historyData.faultHistory, // Page fault status for each original page access
        pointerHistory: historyData.pointerHistory || [], // Clock-specific
        refBitsHistory: historyData.refBitsHistory || [], // Clock-specific
        algoHistory: historyData.algoHistory || [] // Adaptive-specific
    };
};

/**
 * Compares all page replacement algorithms for a given scenario.
 * @param {number[]} pages - The page reference string.
 * @param {number} frameSize - The number of frames available.
 * @param {boolean} prefetch - Whether prefetching is enabled.
 * @returns {object} - An object where keys are algorithm names and values are their results (faults, faultRate).
 */
export const compareAllAlgorithms = (pages, frameSize, prefetch) => {
    const comparisonResults = {};

    for (const algorithmName in algorithmsMap) {
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

            // Handle prefetch (if enabled and next page exists)
            if (prefetch && i + 1 < pages.length) {
                const nextPage = pages[i + 1];
                if (algoObj.step(nextPage, frames, frameSize)) {
                    faults++;
                }
            }
        }

        comparisonResults[algorithmName] = {
            faults: faults,
            faultRate: (faults / pages.length) * 100 // Calculate fault rate
        };
    }
    return comparisonResults;
};