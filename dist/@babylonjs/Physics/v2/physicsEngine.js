import { Vector3 } from "../../Maths/math.vector.js";
import { PhysicsRaycastResult } from "../physicsRaycastResult.js";
import { _WarnImport } from "../../Misc/devTools.js";
/**
 * Class used to control physics engine
 * @see https://doc.babylonjs.com/features/featuresDeepDive/physics/usingPhysicsEngine
 */
/** @internal */
export class PhysicsEngine {
    /**
     * Creates a new Physics Engine
     * @param gravity defines the gravity vector used by the simulation
     * @param _physicsPlugin defines the plugin to use (CannonJS by default)
     */
    constructor(gravity, _physicsPlugin = PhysicsEngine.DefaultPluginFactory()) {
        this._physicsPlugin = _physicsPlugin;
        /** @internal */
        this._physicsBodies = [];
        this._subTimeStep = 0;
        gravity = gravity || new Vector3(0, -9.807, 0);
        this.setGravity(gravity);
        this.setTimeStep();
    }
    /**
     *
     * @returns physics plugin version
     */
    getPluginVersion() {
        return this._physicsPlugin.getPluginVersion();
    }
    /**
     * Factory used to create the default physics plugin.
     * @returns The default physics plugin
     */
    static DefaultPluginFactory() {
        throw _WarnImport("");
    }
    /**
     * Sets the gravity vector used by the simulation
     * @param gravity defines the gravity vector to use
     */
    setGravity(gravity) {
        this.gravity = gravity;
        this._physicsPlugin.setGravity(this.gravity);
    }
    /**
     * Set the time step of the physics engine.
     * Default is 1/60.
     * To slow it down, enter 1/600 for example.
     * To speed it up, 1/30
     * @param newTimeStep defines the new timestep to apply to this world.
     */
    setTimeStep(newTimeStep = 1 / 60) {
        this._physicsPlugin.setTimeStep(newTimeStep);
    }
    /**
     * Get the time step of the physics engine.
     * @returns the current time step
     */
    getTimeStep() {
        return this._physicsPlugin.getTimeStep();
    }
    /**
     * Set the sub time step of the physics engine.
     * Default is 0 meaning there is no sub steps
     * To increase physics resolution precision, set a small value (like 1 ms)
     * @param subTimeStep defines the new sub timestep used for physics resolution.
     */
    setSubTimeStep(subTimeStep = 0) {
        this._subTimeStep = subTimeStep;
    }
    /**
     * Get the sub time step of the physics engine.
     * @returns the current sub time step
     */
    getSubTimeStep() {
        return this._subTimeStep;
    }
    /**
     * Release all resources
     */
    dispose() {
        this._physicsPlugin.dispose();
    }
    /**
     * Gets the name of the current physics plugin
     * @returns the name of the plugin
     */
    getPhysicsPluginName() {
        return this._physicsPlugin.name;
    }
    /**
     * Adding a new impostor for the impostor tracking.
     * This will be done by the impostor itself.
     * @param impostor the impostor to add
     */
    /**
     * Called by the scene. No need to call it.
     * @param delta defines the timespan between frames
     */
    _step(delta) {
        //check if any mesh has no body / requires an update
        /*this._impostors.forEach((impostor) => {
            if (impostor.isBodyInitRequired()) {
                this._physicsPlugin.generatePhysicsBody(impostor);
            }
        });
*/
        if (delta > 0.1) {
            delta = 0.1;
        }
        else if (delta <= 0) {
            delta = 1.0 / 60.0;
        }
        this._physicsPlugin.executeStep(delta, this._physicsBodies);
    }
    /**
     *
     * @param body
     */
    addBody(physicsBody) {
        this._physicsBodies.push(physicsBody);
    }
    /**
     *
     */
    removeBody(physicsBody) {
        const index = this._physicsBodies.indexOf(physicsBody);
        if (index > -1) {
            /*const removed =*/ this._physicsBodies.splice(index, 1);
        }
    }
    /**
     * Gets the current plugin used to run the simulation
     * @returns current plugin
     */
    getPhysicsPlugin() {
        return this._physicsPlugin;
    }
    /**
     * Does a raycast in the physics world
     * @param from when should the ray start?
     * @param to when should the ray end?
     * @param result resulting PhysicsRaycastResult
     */
    raycastToRef(from, to, result) {
        this._physicsPlugin.raycast(from, to, result);
    }
    /**
     * Does a raycast in the physics world
     * @param from when should the ray start?
     * @param to when should the ray end?
     * @returns PhysicsRaycastResult
     */
    raycast(from, to) {
        const result = new PhysicsRaycastResult();
        this._physicsPlugin.raycast(from, to, result);
        return result;
    }
}
//# sourceMappingURL=physicsEngine.js.map