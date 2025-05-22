// src/algorithms/MLPageReplacement.js
// Its name suggests potential for future machine learning integration,
// but its current implementation is a standard LRU.
class MLPageReplacement {
    constructor() {
        this.recent = [];
        this.history = [];
        this.faultHistory = [];
    }

    step(page, frames, frameSize) {
        // Save current state for history (shallow copy of frames)
        this.history.push([...frames]);

        let pageFault = false;
        if (frames.includes(page)) {
            // Page hit: update its recency
            const recentIndex = this.recent.indexOf(page);
            if (recentIndex > -1) {
                this.recent.splice(recentIndex, 1); // Remove from its current position
            }
            this.recent.push(page); // Add to the end (most recently used)
        } else {
            // Page fault
            pageFault = true;
            if (frames.length >= frameSize) {
                if (this.recent.length > 0) { // Prevent popping from empty list
                    const removed = this.recent.shift(); // LRU: remove least recently used (front of recent array)
                    const indexToRemove = frames.indexOf(removed);
                    if (indexToRemove > -1) {
                        frames.splice(indexToRemove, 1); // Remove from frames array
                    }
                }
            }
            frames.push(page); // Add new page to frames
            this.recent.push(page); // Add new page to recent (most recently used)
        }
        this.faultHistory.push(pageFault);
        return pageFault;
    }

    getHistory() {
        return {
            history: this.history,
            faultHistory: this.faultHistory
        };
    }
}

export default MLPageReplacement;