// src/algorithms/FIFO.js
class FIFO {
    constructor() {
        this.queue = [];
        this.history = []; // Stores frames state at each step
        this.faultHistory = []; // Stores true/false for page fault at each step
    }

    step(page, frames, frameSize) {
        // Save current state for history (shallow copy of frames)
        this.history.push([...frames]);

        let pageFault = false;
        if (!frames.includes(page)) { // Page not in frames (fault)
            pageFault = true;
            if (frames.length >= frameSize) {
                const removed = this.queue.shift(); // FIFO: remove the oldest page (front of queue)
                const indexToRemove = frames.indexOf(removed);
                if (indexToRemove > -1) { // Ensure it's actually in frames (e.g., if prefetch adds it)
                    frames.splice(indexToRemove, 1); // Remove from frames array
                }
            }
            frames.push(page); // Add new page to the end of frames
            this.queue.push(page); // Add new page to the end of the FIFO queue
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

export default FIFO;