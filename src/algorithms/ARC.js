// src/algorithms/ARC.js
class ARC {
    constructor() {
        this.history = [];
        this.faultHistory = [];
        this.T1 = []; // Recent pages (first access)
        this.T2 = []; // Frequent pages (multiple accesses)
        this.B1 = []; // Ghost entries for evicted T1 pages
        this.B2 = []; // Ghost entries for evicted T2 pages
        this.p = 0; // Adaptive parameter (0 to c)
        this.c = 0; // Cache size (will be set to frameSize)
    }

    step(page, frames, frameSize) {
        if (this.c === 0) {
            this.c = frameSize;
        }

        let faultOccurred = false;
        
        // Check if page is in T1 or T2 (cache hit)
        if (this.T1.includes(page)) {
            // Move from T1 to T2 (promote to frequent)
            this.T1 = this.T1.filter(p => p !== page);
            this.T2.push(page);
        } else if (this.T2.includes(page)) {
            // Move to end of T2 (most recently used)
            this.T2 = this.T2.filter(p => p !== page);
            this.T2.push(page);
        } else {
            // Cache miss - page fault
            faultOccurred = true;
            
            if (this.B1.includes(page)) {
                // Hit in B1 - adapt towards recency
                this.p = Math.min(this.c, this.p + Math.max(1, Math.floor(this.B2.length / this.B1.length)));
                this.replace(page, true);
                this.B1 = this.B1.filter(p => p !== page);
                this.T2.push(page);
            } else if (this.B2.includes(page)) {
                // Hit in B2 - adapt towards frequency
                this.p = Math.max(0, this.p - Math.max(1, Math.floor(this.B1.length / this.B2.length)));
                this.replace(page, false);
                this.B2 = this.B2.filter(p => p !== page);
                this.T2.push(page);
            } else {
                // Complete miss
                if (this.T1.length + this.B1.length === this.c) {
                    if (this.T1.length < this.c) {
                        // Remove oldest from B1 and replace
                        this.B1.shift();
                        this.replace(page, false);
                    } else {
                        // Remove oldest from T1
                        this.T1.shift();
                    }
                } else if (this.T1.length + this.B1.length < this.c) {
                    const total = this.T1.length + this.T2.length + this.B1.length + this.B2.length;
                    if (total >= this.c) {
                        if (total === 2 * this.c) {
                            // Remove oldest from B2
                            this.B2.shift();
                        }
                        this.replace(page, false);
                    }
                }
                this.T1.push(page);
            }
        }

        // Update frames array for visualization
        this.updateFrames(frames);
        
        // Record history
        this.history.push([...frames]);
        this.faultHistory.push(faultOccurred);

        return faultOccurred;
    }

    replace(page, hitInB1) {
        if (this.T1.length !== 0 && 
            ((this.T1.length > this.p) || (hitInB1 && this.T1.length === this.p))) {
            // Replace from T1
            const victim = this.T1.shift();
            this.B1.push(victim);
        } else {
            // Replace from T2
            const victim = this.T2.shift();
            this.B2.push(victim);
        }

        // Maintain B1 and B2 size limits
        if (this.B1.length > this.c) {
            this.B1.shift();
        }
        if (this.B2.length > this.c) {
            this.B2.shift();
        }
    }

    updateFrames(frames) {
        // Update frames array to reflect current cache state
        frames.length = 0;
        frames.push(...this.T1, ...this.T2);
    }

    getHistory() {
        return {
            history: this.history,
            faultHistory: this.faultHistory,
            adaptiveParameter: this.p,
            T1Size: this.T1.length,
            T2Size: this.T2.length,
            B1Size: this.B1.length,
            B2Size: this.B2.length
        };
    }
}

export default ARC;