/**
 * Tracking of the delays that are currently scheduled in a flow graph context.
 *
 * `flow/setDelay` produces a unique integer handle for every delayed activation it schedules.
 * This module records which of those handles are still pending — i.e. scheduled and not yet fired
 * or cancelled — per {@link FlowGraphContext}, so that a host can answer "is this delay handle
 * still valid?" for a reference it was handed earlier.
 */
/**
 * Name of the global context variable holding the set of active delay handles.
 * @internal
 */
const ActiveDelayIndicesKey = "activeDelayIndices";
function GetActiveDelaySet(context) {
    let set = context._getGlobalContextVariable(ActiveDelayIndicesKey, null);
    if (!set) {
        set = new Set();
        context._setGlobalContextVariable(ActiveDelayIndicesKey, set);
    }
    return set;
}
/**
 * Marks the given delay handle as active (scheduled and pending) in the context.
 * Called by `flow/setDelay` when it schedules a new delayed activation.
 * @param context the flow graph context owning the delay.
 * @param index the unique delay handle produced by `flow/setDelay`.
 */
export function MarkDelayActive(context, index) {
    GetActiveDelaySet(context).add(index);
}
/**
 * Marks the given delay handle as no longer active. Called when a delay fires, is cancelled via
 * the `cancel` input, or is cancelled by `flow/cancelDelay`.
 * @param context the flow graph context owning the delay.
 * @param index the unique delay handle to clear.
 */
export function MarkDelayInactive(context, index) {
    context._getGlobalContextVariable(ActiveDelayIndicesKey, null)?.delete(index);
}
/**
 * Returns whether the given delay handle is currently active, i.e. scheduled and not yet fired or
 * cancelled.
 * @param context the flow graph context to query.
 * @param index the delay handle to test.
 * @returns true if the delay is currently scheduled and has not yet fired or been cancelled.
 */
export function IsDelayActive(context, index) {
    return context._getGlobalContextVariable(ActiveDelayIndicesKey, null)?.has(index) ?? false;
}
//# sourceMappingURL=flowGraphDelayRegistry.js.map