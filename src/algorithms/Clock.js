// src/algorithms/Clock.js
class Clock {
    constructor() {
        this.pointer = 0;
        this.refBits = []; // Reference bits for each frame
        this.history = []; // Frames history
        this.faultHistory = [];
        this.pointerHistory = []; // To visualize pointer movement
        this.refBitsHistory = []; // To store refBits state at each step for visualization
    }

    step(page, frames, frameSize) {
        // Save current state for history before modification
        this.history.push([...frames]);
        this.pointerHistory.push(this.pointer);
        this.refBitsHistory.push([...this.refBits]); // Save current refBits state

        let pageFault = false;

        const pageIndexInFrames = frames.indexOf(page);
        if (pageIndexInFrames !== -1) {
            // Page hit
            this.refBits[pageIndexInFrames] = 1; // Set reference bit to 1
        } else {
            // Page fault
            pageFault = true;

            if (frames.length < frameSize) {
                // Frames are not full, add page directly
                frames.push(page);
                this.refBits.push(0); // New page gets ref bit 0
            } else {
                // Frames are full, find a page to replace
                let replaced = false;
                while (!replaced) {
                    if (this.refBits[this.pointer] === 0) {
                        // Found a page with ref bit 0, replace it
                        frames[this.pointer] = page;
                        this.refBits[this.pointer] = 0; // New page gets ref bit 0
                        this.pointer = (this.pointer + 1) % frameSize; // Move pointer after replacement
                        replaced = true;
                    } else {
                        // Reference bit is 1, set to 0 and move pointer
                        this.refBits[this.pointer] = 0;
                        this.pointer = (this.pointer + 1) % frameSize;
                    }
                }
            }
        }

        this.faultHistory.push(pageFault);
        return pageFault;
    }

    getHistory() {
        return {
            history: this.history,
            faultHistory: this.faultHistory,
            pointerHistory: this.pointerHistory,
            refBitsHistory: this.refBitsHistory
        };
    }
}

export default Clock;