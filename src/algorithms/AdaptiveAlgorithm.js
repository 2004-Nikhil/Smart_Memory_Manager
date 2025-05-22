// src/algorithms/AdaptiveAlgorithm.js
import FIFO from './FIFO';
import LRU from './LRU';

class AdaptiveAlgorithm {
    constructor() {
        this.fifo = new FIFO();
        this.lru = new LRU();
        this.useLru = false; // Corresponds to use_lru in Python
        this.recentFaults = []; // Corresponds to recent_faults
        this.history = []; // Frames history
        this.faultHistory = [];
        this.algoHistory = []; // Track which algorithm was used at each step
    }

    step(page, frames, frameSize) {
        // Save current state for history (before current step's changes)
        this.history.push([...frames]);
        this.algoHistory.push(this.useLru ? "LRU" : "FIFO"); // Track which algo is chosen

        const algo = this.useLru ? this.lru : this.fifo;
        // Pass 'frames' by reference, allowing sub-algorithm to modify it directly
        const pageFault = algo.step(page, frames, frameSize);

        this.recentFaults.push(pageFault);
        if (this.recentFaults.length > 5) {
            this.recentFaults.shift(); // Remove the oldest fault status (pop(0) in Python)
        }

        if (this.recentFaults.length === 5) {
            const faultCount = this.recentFaults.filter(f => f).length; // Count true values (sum in Python)
            if (!this.useLru && faultCount >= 3) {
                this.useLru = true;
            } else if (this.useLru && faultCount < 3) {
                this.useLru = false;
            }
        }

        this.faultHistory.push(pageFault);
        return pageFault;
    }

    getHistory() {
        return {
            history: this.history,
            faultHistory: this.faultHistory,
            algoHistory: this.algoHistory
        };
    }
}

export default AdaptiveAlgorithm;