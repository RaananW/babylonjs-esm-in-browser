/**
 *
 */
/** @internal */
export class PhysicsMaterial {
    /**
     *
     * @param friction
     * @param restitution
     * @param scene
     */
    constructor(friction, restitution, scene) {
        /** @internal */
        /**
         *
         */
        this._pluginData = undefined;
        const physicsEngine = scene.getPhysicsEngine();
        if (!physicsEngine) {
            throw new Error("No Physics Engine available.");
        }
        if (physicsEngine.getPluginVersion() != 2) {
            throw new Error("Plugin version is incorrect. Expected version 2.");
        }
        const physicsPlugin = physicsEngine.getPhysicsPlugin();
        if (!physicsPlugin) {
            throw new Error("No Physics Plugin available.");
        }
        this._physicsPlugin = physicsPlugin;
        this._physicsPlugin.initMaterial(this);
    }
    /**
     *
     * @param friction
     */
    setFriction(friction) {
        this._physicsPlugin.setFriction(this, friction);
    }
    /**
     *
     * @returns
     */
    getFriction() {
        return this._physicsPlugin.getFriction(this);
    }
    /**
     *
     * @param restitution
     */
    setRestitution(restitution) {
        this._physicsPlugin.setRestitution(this, restitution);
    }
    /**
     *
     * @returns
     */
    getRestitution() {
        return this._physicsPlugin.getRestitution(this);
    }
    /**
     *
     */
    dispose() {
        this._physicsPlugin.disposeMaterial(this);
    }
}
//# sourceMappingURL=physicsMaterial.js.map