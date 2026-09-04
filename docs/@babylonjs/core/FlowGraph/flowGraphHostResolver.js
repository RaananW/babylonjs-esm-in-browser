/** This file must only contain pure code and pure imports */
/**
 * Prefix used by the default event-reference format.
 *
 * A host that maps behavior graphs onto its own object model (for example the glTF
 * `KHR_interactivity` loader) supplies its own format through {@link IFlowGraphHostResolver}.
 */
export const FlowGraphDefaultEventReferencePrefix = "flowgraph://events/";
/**
 * Builds the default reference for an event source key.
 * @param key the event source key (e.g. `"sceneReady"`, `"sceneTick"`, or a custom event id)
 * @returns the event reference
 */
export function GetDefaultEventReference(key) {
    return FlowGraphDefaultEventReferencePrefix + key;
}
/**
 * Extracts the event source key from a default-format event reference.
 * @param reference the value to decode
 * @returns the event source key, or `undefined` when the value is not an event reference
 */
export function GetDefaultEventReferenceKey(reference) {
    return reference.startsWith(FlowGraphDefaultEventReferencePrefix) ? reference.substring(FlowGraphDefaultEventReferencePrefix.length) : undefined;
}
//# sourceMappingURL=flowGraphHostResolver.js.map