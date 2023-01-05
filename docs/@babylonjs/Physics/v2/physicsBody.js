import { Quaternion } from "../../Maths/math.vector.js";
/**
 *
 */
/** @internal */
export class PhysicsBody {
    /**
     *
     * @param scene
     * @returns
     */
    constructor(node, scene) {
        /** @internal */
        this._pluginData = undefined;
        /**
         *
         */
        this._pluginDataInstances = [];
        if (!scene) {
            return;
        }
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
        if (!node.rotationQuaternion) {
            node.rotationQuaternion = Quaternion.FromEulerAngles(node.rotation.x, node.rotation.y, node.rotation.z);
        }
        // instances?
        const m = node;
        if (m.hasThinInstances) {
            this._physicsPlugin.initBodyInstances(this, m);
        }
        else {
            // single instance
            this._physicsPlugin.initBody(this, node.position, node.rotationQuaternion);
        }
        this.node = node;
        physicsEngine.addBody(this);
    }
    /**
     *
     * @param shape
     */
    setShape(shape) {
        this._physicsPlugin.setShape(this, shape);
    }
    /**
     *
     * @returns
     */
    getShape() {
        return this._physicsPlugin.getShape(this);
    }
    /**
     *
     * @param group
     */
    setFilterGroup(group) {
        this._physicsPlugin.setFilterGroup(this, group);
    }
    /**
     *
     * @returns
     */
    getFilterGroup() {
        return this._physicsPlugin.getFilterGroup(this);
    }
    /**
     *
     * @param eventMask
     */
    setEventMask(eventMask) {
        this._physicsPlugin.setEventMask(this, eventMask);
    }
    /**
     *
     * @returns
     */
    getEventMask() {
        return this._physicsPlugin.getEventMask(this);
    }
    /**
     *
     * @param massProps
     */
    setMassProperties(massProps) {
        this._physicsPlugin.setMassProperties(this, massProps);
    }
    /**
     *
     * @returns
     */
    getMassProperties() {
        return this._physicsPlugin.getMassProperties(this);
    }
    /**
     *
     * @param damping
     */
    setLinearDamping(damping) {
        this._physicsPlugin.setLinearDamping(this, damping);
    }
    /**
     *
     * @returns
     */
    getLinearDamping() {
        return this._physicsPlugin.getLinearDamping(this);
    }
    /**
     *
     * @param damping
     */
    setAngularDamping(damping) {
        this._physicsPlugin.setAngularDamping(this, damping);
    }
    /**
     *
     * @returns
     */
    getAngularDamping() {
        return this._physicsPlugin.getAngularDamping(this);
    }
    /**
     *
     * @param linVel
     */
    setLinearVelocity(linVel) {
        this._physicsPlugin.setLinearVelocity(this, linVel);
    }
    /**
     *
     * @returns
     */
    getLinearVelocityToRef(linVel) {
        return this._physicsPlugin.getLinearVelocityToRef(this, linVel);
    }
    /**
     *
     * @param angVel
     */
    setAngularVelocity(angVel) {
        this._physicsPlugin.setAngularVelocity(this, angVel);
    }
    /**
     *
     * @returns
     */
    getAngularVelocityToRef(angVel) {
        return this._physicsPlugin.getAngularVelocityToRef(this, angVel);
    }
    /**
     *
     * @param location
     * @param impulse
     */
    applyImpulse(location, impulse) {
        this._physicsPlugin.applyImpulse(this, location, impulse);
    }
    getGeometry() {
        return this._physicsPlugin.getBodyGeometry(this);
    }
    /**
     *
     */
    dispose() {
        this._physicsPlugin.disposeBody(this);
    }
}
//# sourceMappingURL=physicsBody.js.map