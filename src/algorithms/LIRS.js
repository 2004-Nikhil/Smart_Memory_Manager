// src/algorithms/LIRS.js
class LIRS {
    constructor() {
        this.history = [];
        this.faultHistory = [];
        this.LIRStack = []; // Stack containing LIR pages and some HIR pages
        this.HIRList = []; // FIFO list for resident HIR pages
        this.pageStatus = new Map(); // Track page status: 'LIR', 'HIR-resident', 'HIR-non-resident'
        this.pageRecency = new Map(); // Track recency for each page
        this.LIRSize = 0; // Number of LIR pages
        this.HIRSize = 0; // Maximum HIR resident pages (typically 1% of cache)
        this.totalSize = 0; // Total cache size
        this.timestamp = 0; // Global timestamp for recency tracking
    }

    step(page, frames, frameSize) {
        if (this.totalSize === 0) {
            this.totalSize = frameSize;
            this.LIRSize = Math.max(1, Math.floor(frameSize * 0.99)); // 99% for LIR
            this.HIRSize = frameSize - this.LIRSize; // Remaining for HIR
        }

        this.timestamp++;
        let faultOccurred = false;
        const currentStatus = this.pageStatus.get(page);

        if (currentStatus === 'LIR') {
            // LIR page hit
            this.updateLIRAccess(page);
        } else if (currentStatus === 'HIR-resident') {
            // HIR resident page hit
            this.updateHIRResidentAccess(page);
            faultOccurred = false; // No fault for resident page
        } else {
            // Page fault (new page or HIR non-resident)
            faultOccurred = true;
            this.handlePageFault(page, frames);
        }

        // Update frames for visualization
        this.updateFrames(frames);
        
        // Record history
        this.history.push([...frames]);
        this.faultHistory.push(faultOccurred);

        return faultOccurred;
    }

    updateLIRAccess(page) {
        // Move page to top of LIR stack
        this.LIRStack = this.LIRStack.filter(p => p !== page);
        this.LIRStack.push(page);
        this.pageRecency.set(page, this.timestamp);
        
        // Prune stack
        this.pruneStack();
    }

    updateHIRResidentAccess(page) {
        // Check if page should be promoted to LIR
        if (this.shouldPromoteToLIR(page)) {
            this.promoteToLIR(page);
        } else {
            // Move to end of HIR list
            this.HIRList = this.HIRList.filter(p => p !== page);
            this.HIRList.push(page);
        }
        this.pageRecency.set(page, this.timestamp);
    }

    handlePageFault(page, frames) {
        const wasInStack = this.LIRStack.includes(page);
        
        if (wasInStack || this.shouldStartAsLIR()) {
            // Add as LIR page
            if (this.getLIRResidentCount() >= this.LIRSize) {
                // Need to evict LIR page
                this.evictLIRPage();
            }
            this.addLIRPage(page);
        } else {
            // Add as HIR page
            if (this.HIRList.length >= this.HIRSize) {
                // Need to evict HIR page
                this.evictHIRPage();
            }
            this.addHIRPage(page);
        }
    }

    shouldPromoteToLIR(page) {
        // Promote if page is in LIR stack (has been accessed before with low IRR)
        return this.LIRStack.includes(page);
    }

    shouldStartAsLIR() {
        // Start as LIR if we have space or in initial phase
        return this.getLIRResidentCount() < this.LIRSize;
    }

    addLIRPage(page) {
        this.pageStatus.set(page, 'LIR');
        this.LIRStack.push(page);
        this.pageRecency.set(page, this.timestamp);
        this.pruneStack();
    }

    addHIRPage(page) {
        this.pageStatus.set(page, 'HIR-resident');
        this.HIRList.push(page);
        this.pageRecency.set(page, this.timestamp);
    }

    evictLIRPage() {
        // Find bottom LIR page in stack
        let bottomLIR = null;
        for (let i = 0; i < this.LIRStack.length; i++) {
            const p = this.LIRStack[i];
            if (this.pageStatus.get(p) === 'LIR') {
                bottomLIR = p;
                break;
            }
        }
        
        if (bottomLIR) {
            this.pageStatus.set(bottomLIR, 'HIR-non-resident');
            this.LIRStack = this.LIRStack.filter(p => p !== bottomLIR);
        }
    }

    evictHIRPage() {
        if (this.HIRList.length > 0) {
            const victim = this.HIRList.shift();
            this.pageStatus.set(victim, 'HIR-non-resident');
        }
    }

    promoteToLIR(page) {
        // Remove from HIR list
        this.HIRList = this.HIRList.filter(p => p !== page);
        
        // Check if we need to evict an LIR page
        if (this.getLIRResidentCount() >= this.LIRSize) {
            this.evictLIRPage();
        }
        
        // Promote to LIR
        this.pageStatus.set(page, 'LIR');
        this.LIRStack = this.LIRStack.filter(p => p !== page);
        this.LIRStack.push(page);
        this.pruneStack();
    }

    pruneStack() {
        // Remove non-LIR pages from bottom of stack
        while (this.LIRStack.length > 0) {
            const bottom = this.LIRStack[0];
            if (this.pageStatus.get(bottom) !== 'LIR') {
                this.LIRStack.shift();
            } else {
                break;
            }
        }
    }

    getLIRResidentCount() {
        let count = 0;
        for (const [page, status] of this.pageStatus) {
            if (status === 'LIR') {
                count++;
            }
        }
        return count;
    }

    updateFrames(frames) {
        frames.length = 0;
        
        // Add LIR pages
        for (const [page, status] of this.pageStatus) {
            if (status === 'LIR') {
                frames.push(page);
            }
        }
        
        // Add HIR resident pages
        for (const page of this.HIRList) {
            if (this.pageStatus.get(page) === 'HIR-resident') {
                frames.push(page);
            }
        }
    }

    getHistory() {
        return {
            history: this.history,
            faultHistory: this.faultHistory,
            LIRCount: this.getLIRResidentCount(),
            HIRCount: this.HIRList.length,
            stackSize: this.LIRStack.length
        };
    }
}

export default LIRS;