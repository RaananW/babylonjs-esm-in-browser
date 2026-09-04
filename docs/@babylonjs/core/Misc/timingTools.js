let ImmediateQueue = [];
/**
 * Class used to provide helper for timing
 */
export class TimingTools {
    /**
     * Execute a function after the current execution block
     * @param action defines the action to execute after the current execution block
     */
    static SetImmediate(action) {
        if (ImmediateQueue.length === 0) {
            setTimeout(() => {
                // Execute all immediate functions
                const functionsToCall = ImmediateQueue;
                ImmediateQueue = [];
                for (const func of functionsToCall) {
                    func();
                }
            }, 1);
        }
        ImmediateQueue.push(action);
    }
}
function RunWithCondition(condition, onSuccess, onError) {
    try {
        if (condition()) {
            onSuccess();
            return true;
        }
    }
    catch (e) {
        onError?.(e);
        return true;
    }
    return false;
}
/**
 * @internal
 */
export const _RetryWithInterval = (condition, onSuccess, onError, step = 16, maxTimeout = 30000, checkConditionOnCall = true, additionalStringOnTimeout) => {
    // if checkConditionOnCall is true, we check the condition immediately. If it is true, run everything synchronously
    if (checkConditionOnCall) {
        // that means that one of the two happened - either the condition is true or an exception was thrown when checking the condition
        if (RunWithCondition(condition, onSuccess, onError)) {
            // don't schedule the interval, no reason to check it again.
            return null;
        }
    }
    const int = setInterval(() => {
        if (RunWithCondition(condition, onSuccess, onError)) {
            clearInterval(int);
        }
        else {
            maxTimeout -= step;
            if (maxTimeout < 0) {
                clearInterval(int);
                onError?.(new Error("Operation timed out after maximum retries. " + (additionalStringOnTimeout || "")), true);
            }
        }
    }, step);
    return () => clearInterval(int);
};
//# sourceMappingURL=timingTools.js.map