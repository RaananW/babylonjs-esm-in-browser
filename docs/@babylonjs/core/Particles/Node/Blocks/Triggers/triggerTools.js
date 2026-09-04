import { NodeParticleBuildState } from "../../nodeParticleBuildState.js";
/**
 * @internal
 * Tools for managing particle triggers and sub-emitter systems.
 */
export function _TriggerSubEmitter(template, scene, location) {
    const newState = new NodeParticleBuildState();
    newState.scene = scene;
    const clone = template.createSystem(newState);
    clone.canStart = () => true; // Allow the cloned system to start
    clone.emitter = location.clone(); // Set the emitter to the particle's position
    clone.disposeOnStop = true; // Clean up the system when it stops
    clone.start();
    return clone;
}
//# sourceMappingURL=triggerTools.js.map