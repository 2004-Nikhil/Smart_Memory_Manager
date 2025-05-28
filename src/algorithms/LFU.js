// src/algorithms/LFU.js
class LFU {
    constructor() {
        this.history = [];
        this.faultHistory = [];
        this.frequencies = new Map(); // Track frequency of each page
        this.accessOrder = []; // Track order for tie-breaking (FIFO among equal frequencies)
    }

    step(page, frames, frameSize) {
        let faultOccurred = false;
        const frameIndex = frames.indexOf(page);

        if (frameIndex !== -1) {
            // Page hit - increment frequency
            this.frequencies.set(page, (this.frequencies.get(page) || 0) + 1);
        } else {
            // Page fault
            faultOccurred = true;
            
            if (frames.length < frameSize) {
                // Frame available - add page
                frames.push(page);
                this.frequencies.set(page, 1);
                this.accessOrder.push(page);
            } else {
                // Frame full - find LFU page to replace
                const victim = this.findLFUPage(frames);
                const victimIndex = frames.indexOf(victim);
                
                // Replace victim with new page
                frames[victimIndex] = page;
                
                // Update frequency and access order
                this.frequencies.delete(victim);
                this.frequencies.set(page, 1);
                
                // Update access order
                this.accessOrder = this.accessOrder.filter(p => p !== victim);
                this.accessOrder.push(page);
            }
        }

        // Record history
        this.history.push([...frames]);
        this.faultHistory.push(faultOccurred);

        return faultOccurred;
    }

    findLFUPage(frames) {
        let minFreq = Infinity;
        let victim = null;
        let oldestIndex = Infinity;

        // Find minimum frequency
        for (const page of frames) {
            const freq = this.frequencies.get(page) || 0;
            if (freq < minFreq) {
                minFreq = freq;
            }
        }

        // Among pages with minimum frequency, choose the oldest (FIFO tie-breaking)
        for (const page of frames) {
            const freq = this.frequencies.get(page) || 0;
            if (freq === minFreq) {
                const orderIndex = this.accessOrder.indexOf(page);
                if (orderIndex < oldestIndex) {
                    oldestIndex = orderIndex;
                    victim = page;
                }
            }
        }

        return victim;
    }

    getHistory() {
        return {
            history: this.history,
            faultHistory: this.faultHistory,
            frequencies: Array.from(this.frequencies.entries()) // For debugging
        };
    }
}

export default LFU;