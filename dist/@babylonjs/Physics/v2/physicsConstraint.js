import { ConstraintType } from "./IPhysicsEnginePlugin.js";
/**
 * This is a holder class for the physics constraint created by the physics plugin
 * It holds a set of functions to control the underlying constraint
 * @see https://doc.babylonjs.com/features/featuresDeepDive/physics/usingPhysicsEngine
 */
/** @internal */
export class PhysicsConstraint {
    /**
     *
     */
    constructor(type, options, scene) {
        /** @internal */
        /**
         *
         */
        this._pluginData = undefined;
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
        this._physicsPlugin.initConstraint(this, type, options);
    }
    /**
     *
     * @param body
     */
    setParentBody(body) {
        this._physicsPlugin.setParentBody(this, body);
    }
    /**
     *
     * @returns
     */
    getParentBody() {
        return this._physicsPlugin.getParentBody(this);
    }
    /**
     *
     * @param body
     */
    setChildBody(body) {
        this._physicsPlugin.setChildBody(this, body);
    }
    /**
     *
     * @returns
     */
    getChildBody() {
        return this._physicsPlugin.getChildBody(this);
    }
    /**
     *
     * @param pivot +
     * @param axisX
     * @param axisY
     */
    setAnchorInParent(pivot, axisX, axisY) {
        this._physicsPlugin.setAnchorInParent(this, pivot, axisX, axisY);
    }
    /**
     *
     * @param pivot
     * @param axisX
     * @param axisY
     */
    setAnchorInChild(pivot, axisX, axisY) {
        this._physicsPlugin.setAnchorInChild(this, pivot, axisX, axisY);
    }
    /**
     *
     * @param isEnabled
     */
    setEnabled(isEnabled) {
        this._physicsPlugin.setEnabled(this, isEnabled);
    }
    /**
     *
     * @returns
     */
    getEnabled() {
        return this._physicsPlugin.getEnabled(this);
    }
    /**
     *
     * @param isEnabled
     */
    setCollisionsEnabled(isEnabled) {
        this._physicsPlugin.setCollisionsEnabled(this, isEnabled);
    }
    /**
     *
     * @returns
     */
    getCollisionsEnabled() {
        return this._physicsPlugin.getCollisionsEnabled(this);
    }
    /**
     *
     * @param axis
     * @param friction
     */
    setAxisFriction(axis, friction) {
        this._physicsPlugin.setAxisFriction(this, axis, friction);
    }
    /**
     *
     * @param axis
     * @returns
     */
    getAxisFriction(axis) {
        return this._physicsPlugin.getAxisFriction(this, axis);
    }
    /**
     *
     * @param axis
     * @param limitMode
     */
    setAxisMode(axis, limitMode) {
        this._physicsPlugin.setAxisMode(this, axis, limitMode);
    }
    /**
     *
     * @param axis
     */
    getAxisMode(axis) {
        return this._physicsPlugin.getAxisMode(this, axis);
    }
    /**
     *
     */
    setAxisMinLimit(axis, minLimit) {
        this._physicsPlugin.setAxisMinLimit(this, axis, minLimit);
    }
    /**
     *
     */
    getAxisMinLimit(axis) {
        return this._physicsPlugin.getAxisMinLimit(this, axis);
    }
    /**
     *
     */
    setAxisMaxLimit(axis, limit) {
        this._physicsPlugin.setAxisMaxLimit(this, axis, limit);
    }
    /**
     *
     */
    getAxisMaxLimit(axis) {
        return this._physicsPlugin.getAxisMaxLimit(this, axis);
    }
    /**
     *
     */
    setAxisMotorType(axis, motorType) {
        this._physicsPlugin.setAxisMotorType(this, axis, motorType);
    }
    /**
     *
     */
    getAxisMotorType(axis) {
        return this._physicsPlugin.getAxisMotorType(this, axis);
    }
    /**
     *
     */
    setAxisMotorTarget(axis, target) {
        this._physicsPlugin.setAxisMotorTarget(this, axis, target);
    }
    /**
     *
     */
    getAxisMotorTarget(axis) {
        return this._physicsPlugin.getAxisMotorTarget(this, axis);
    }
    /**
     *
     */
    setAxisMotorMaxForce(axis, maxForce) {
        this._physicsPlugin.setAxisMotorMaxForce(this, axis, maxForce);
    }
    /**
     *
     */
    getAxisMotorMaxForce(axis) {
        return this._physicsPlugin.getAxisMotorMaxForce(this, axis);
    }
    /**
     *
     */
    dispose() {
        this._physicsPlugin.disposeConstraint(this);
    }
}
/**
 *
 */
/** @internal */
export class PhysicsConstraintBallAndSocket extends PhysicsConstraint {
    /** @internal */
    constructor(pivotA, pivotB, axisA, axisB, scene) {
        super(ConstraintType.BALL_AND_SOCKET, { pivotA: pivotA, pivotB: pivotB, axisA: axisA, axisB: axisB }, scene);
    }
}
/**
 *
 */
/** @internal */
export class PhysicsConstraintDistance extends PhysicsConstraint {
    /** @internal */
    constructor(pivotA, pivotB, axisA, axisB, scene) {
        super(ConstraintType.DISTANCE, { pivotA: pivotA, pivotB: pivotB, axisA: axisA, axisB: axisB }, scene);
    }
}
/**
 *
 */
/** @internal */
export class PhysicsConstraintHinge extends PhysicsConstraint {
    /** @internal */
    constructor(pivotA, pivotB, axisA, axisB, scene) {
        super(ConstraintType.HINGE, { pivotA: pivotA, pivotB: pivotB, axisA: axisA, axisB: axisB }, scene);
    }
}
/**
 *
 */
/** @internal */
export class PhysicsConstraintSlider extends PhysicsConstraint {
    /** @internal */
    constructor(pivotA, pivotB, axisA, axisB, scene) {
        super(ConstraintType.SLIDER, { pivotA: pivotA, pivotB: pivotB, axisA: axisA, axisB: axisB }, scene);
    }
}
/**
 *
 */
/** @internal */
export class PhysicsConstraintLock extends PhysicsConstraint {
    /** @internal */
    constructor(pivotA, pivotB, axisA, axisB, scene) {
        super(ConstraintType.LOCK, { pivotA: pivotA, pivotB: pivotB, axisA: axisA, axisB: axisB }, scene);
    }
}
//# sourceMappingURL=physicsConstraint.js.map