import { Logger } from "../../Misc/logger.js";
import { Vector3 } from "../../Maths/math.vector.js";
import { CreateSphere } from "../../Meshes/Builders/sphereBuilder.js";
import { CreateCylinder } from "../../Meshes/Builders/cylinderBuilder.js";
import { Ray } from "../../Culling/ray.js";
/**
 * A helper for physics simulations
 * @see https://doc.babylonjs.com/features/featuresDeepDive/physics/usingPhysicsEngine#further-functionality-of-the-impostor-class
 */
export class PhysicsHelper {
    /**
     * Initializes the Physics helper
     * @param scene Babylon.js scene
     */
    constructor(scene) {
        this._scene = scene;
        this._physicsEngine = this._scene.getPhysicsEngine();
        if (!this._physicsEngine) {
            Logger.Warn("Physics engine not enabled. Please enable the physics before you can use the methods.");
            return;
        }
    }
    /**
     * Applies a radial explosion impulse
     * @param origin the origin of the explosion
     * @param radiusOrEventOptions the radius or the options of radial explosion
     * @param strength the explosion strength
     * @param falloff possible options: Constant & Linear. Defaults to Constant
     * @returns A physics radial explosion event, or null
     */
    applyRadialExplosionImpulse(origin, radiusOrEventOptions, strength, falloff) {
        if (!this._physicsEngine) {
            Logger.Warn("Physics engine not enabled. Please enable the physics before you call this method.");
            return null;
        }
        const impostors = this._physicsEngine.getImpostors();
        if (impostors.length === 0) {
            return null;
        }
        if (typeof radiusOrEventOptions === "number") {
            radiusOrEventOptions = new PhysicsRadialExplosionEventOptions();
            radiusOrEventOptions.radius = radiusOrEventOptions;
            radiusOrEventOptions.strength = strength || radiusOrEventOptions.strength;
            radiusOrEventOptions.falloff = falloff || radiusOrEventOptions.falloff;
        }
        const event = new PhysicsRadialExplosionEvent(this._scene, radiusOrEventOptions);
        const affectedImpostorsWithData = Array();
        impostors.forEach((impostor) => {
            const impostorHitData = event.getImpostorHitData(impostor, origin);
            if (!impostorHitData) {
                return;
            }
            impostor.applyImpulse(impostorHitData.force, impostorHitData.contactPoint);
            affectedImpostorsWithData.push({
                impostor: impostor,
                hitData: impostorHitData,
            });
        });
        event.triggerAffectedImpostorsCallback(affectedImpostorsWithData);
        event.dispose(false);
        return event;
    }
    /**
     * Applies a radial explosion force
     * @param origin the origin of the explosion
     * @param radiusOrEventOptions the radius or the options of radial explosion
     * @param strength the explosion strength
     * @param falloff possible options: Constant & Linear. Defaults to Constant
     * @returns A physics radial explosion event, or null
     */
    applyRadialExplosionForce(origin, radiusOrEventOptions, strength, falloff) {
        if (!this._physicsEngine) {
            Logger.Warn("Physics engine not enabled. Please enable the physics before you call the PhysicsHelper.");
            return null;
        }
        const impostors = this._physicsEngine.getImpostors();
        if (impostors.length === 0) {
            return null;
        }
        if (typeof radiusOrEventOptions === "number") {
            radiusOrEventOptions = new PhysicsRadialExplosionEventOptions();
            radiusOrEventOptions.radius = radiusOrEventOptions;
            radiusOrEventOptions.strength = strength || radiusOrEventOptions.strength;
            radiusOrEventOptions.falloff = falloff || radiusOrEventOptions.falloff;
        }
        const event = new PhysicsRadialExplosionEvent(this._scene, radiusOrEventOptions);
        const affectedImpostorsWithData = Array();
        impostors.forEach((impostor) => {
            const impostorHitData = event.getImpostorHitData(impostor, origin);
            if (!impostorHitData) {
                return;
            }
            impostor.applyForce(impostorHitData.force, impostorHitData.contactPoint);
            affectedImpostorsWithData.push({
                impostor: impostor,
                hitData: impostorHitData,
            });
        });
        event.triggerAffectedImpostorsCallback(affectedImpostorsWithData);
        event.dispose(false);
        return event;
    }
    /**
     * Creates a gravitational field
     * @param origin the origin of the explosion
     * @param radiusOrEventOptions the radius or the options of radial explosion
     * @param strength the explosion strength
     * @param falloff possible options: Constant & Linear. Defaults to Constant
     * @returns A physics gravitational field event, or null
     */
    gravitationalField(origin, radiusOrEventOptions, strength, falloff) {
        if (!this._physicsEngine) {
            Logger.Warn("Physics engine not enabled. Please enable the physics before you call the PhysicsHelper.");
            return null;
        }
        const impostors = this._physicsEngine.getImpostors();
        if (impostors.length === 0) {
            return null;
        }
        if (typeof radiusOrEventOptions === "number") {
            radiusOrEventOptions = new PhysicsRadialExplosionEventOptions();
            radiusOrEventOptions.radius = radiusOrEventOptions;
            radiusOrEventOptions.strength = strength || radiusOrEventOptions.strength;
            radiusOrEventOptions.falloff = falloff || radiusOrEventOptions.falloff;
        }
        const event = new PhysicsGravitationalFieldEvent(this, this._scene, origin, radiusOrEventOptions);
        event.dispose(false);
        return event;
    }
    /**
     * Creates a physics updraft event
     * @param origin the origin of the updraft
     * @param radiusOrEventOptions the radius or the options of the updraft
     * @param strength the strength of the updraft
     * @param height the height of the updraft
     * @param updraftMode possible options: Center & Perpendicular. Defaults to Center
     * @returns A physics updraft event, or null
     */
    updraft(origin, radiusOrEventOptions, strength, height, updraftMode) {
        if (!this._physicsEngine) {
            Logger.Warn("Physics engine not enabled. Please enable the physics before you call the PhysicsHelper.");
            return null;
        }
        if (this._physicsEngine.getImpostors().length === 0) {
            return null;
        }
        if (typeof radiusOrEventOptions === "number") {
            radiusOrEventOptions = new PhysicsUpdraftEventOptions();
            radiusOrEventOptions.radius = radiusOrEventOptions;
            radiusOrEventOptions.strength = strength || radiusOrEventOptions.strength;
            radiusOrEventOptions.height = height || radiusOrEventOptions.height;
            radiusOrEventOptions.updraftMode = updraftMode || radiusOrEventOptions.updraftMode;
        }
        const event = new PhysicsUpdraftEvent(this._scene, origin, radiusOrEventOptions);
        event.dispose(false);
        return event;
    }
    /**
     * Creates a physics vortex event
     * @param origin the of the vortex
     * @param radiusOrEventOptions the radius or the options of the vortex
     * @param strength the strength of the vortex
     * @param height   the height of the vortex
     * @returns a Physics vortex event, or null
     * A physics vortex event or null
     */
    vortex(origin, radiusOrEventOptions, strength, height) {
        if (!this._physicsEngine) {
            Logger.Warn("Physics engine not enabled. Please enable the physics before you call the PhysicsHelper.");
            return null;
        }
        if (this._physicsEngine.getImpostors().length === 0) {
            return null;
        }
        if (typeof radiusOrEventOptions === "number") {
            radiusOrEventOptions = new PhysicsVortexEventOptions();
            radiusOrEventOptions.radius = radiusOrEventOptions;
            radiusOrEventOptions.strength = strength || radiusOrEventOptions.strength;
            radiusOrEventOptions.height = height || radiusOrEventOptions.height;
        }
        const event = new PhysicsVortexEvent(this._scene, origin, radiusOrEventOptions);
        event.dispose(false);
        return event;
    }
}
/**
 * Represents a physics radial explosion event
 */
class PhysicsRadialExplosionEvent {
    /**
     * Initializes a radial explosion event
     * @param _scene BabylonJS scene
     * @param _options The options for the vortex event
     */
    constructor(_scene, _options) {
        this._scene = _scene;
        this._options = _options;
        this._dataFetched = false; // check if the data has been fetched. If not, do cleanup
        this._options = { ...new PhysicsRadialExplosionEventOptions(), ...this._options };
    }
    /**
     * Returns the data related to the radial explosion event (sphere).
     * @returns The radial explosion event data
     */
    getData() {
        this._dataFetched = true;
        return {
            sphere: this._sphere,
        };
    }
    /**
     * Returns the force and contact point of the impostor or false, if the impostor is not affected by the force/impulse.
     * @param impostor A physics imposter
     * @param origin the origin of the explosion
     * @returns {Nullable<PhysicsHitData>} A physics force and contact point, or null
     */
    getImpostorHitData(impostor, origin) {
        if (impostor.mass === 0) {
            return null;
        }
        if (!this._intersectsWithSphere(impostor, origin, this._options.radius)) {
            return null;
        }
        if (impostor.object.getClassName() !== "Mesh" && impostor.object.getClassName() !== "InstancedMesh") {
            return null;
        }
        const impostorObjectCenter = impostor.getObjectCenter();
        const direction = impostorObjectCenter.subtract(origin);
        const ray = new Ray(origin, direction, this._options.radius);
        const hit = ray.intersectsMesh(impostor.object);
        const contactPoint = hit.pickedPoint;
        if (!contactPoint) {
            return null;
        }
        const distanceFromOrigin = Vector3.Distance(origin, contactPoint);
        if (distanceFromOrigin > this._options.radius) {
            return null;
        }
        const multiplier = this._options.falloff === PhysicsRadialImpulseFalloff.Constant ? this._options.strength : this._options.strength * (1 - distanceFromOrigin / this._options.radius);
        const force = direction.multiplyByFloats(multiplier, multiplier, multiplier);
        return { force: force, contactPoint: contactPoint, distanceFromOrigin: distanceFromOrigin };
    }
    /**
     * Triggers affected impostors callbacks
     * @param affectedImpostorsWithData defines the list of affected impostors (including associated data)
     */
    triggerAffectedImpostorsCallback(affectedImpostorsWithData) {
        if (this._options.affectedImpostorsCallback) {
            this._options.affectedImpostorsCallback(affectedImpostorsWithData);
        }
    }
    /**
     * Disposes the sphere.
     * @param force Specifies if the sphere should be disposed by force
     */
    dispose(force = true) {
        if (force) {
            this._sphere.dispose();
        }
        else {
            setTimeout(() => {
                if (!this._dataFetched) {
                    this._sphere.dispose();
                }
            }, 0);
        }
    }
    /*** Helpers ***/
    _prepareSphere() {
        if (!this._sphere) {
            this._sphere = CreateSphere("radialExplosionEventSphere", this._options.sphere, this._scene);
            this._sphere.isVisible = false;
        }
    }
    _intersectsWithSphere(impostor, origin, radius) {
        const impostorObject = impostor.object;
        this._prepareSphere();
        this._sphere.position = origin;
        this._sphere.scaling = new Vector3(radius * 2, radius * 2, radius * 2);
        this._sphere._updateBoundingInfo();
        this._sphere.computeWorldMatrix(true);
        return this._sphere.intersectsMesh(impostorObject, true);
    }
}
/**
 * Represents a gravitational field event
 */
class PhysicsGravitationalFieldEvent {
    /**
     * Initializes the physics gravitational field event
     * @param _physicsHelper A physics helper
     * @param _scene BabylonJS scene
     * @param _origin The origin position of the gravitational field event
     * @param _options The options for the vortex event
     */
    constructor(_physicsHelper, _scene, _origin, _options) {
        this._physicsHelper = _physicsHelper;
        this._scene = _scene;
        this._origin = _origin;
        this._options = _options;
        this._dataFetched = false; // check if the has been fetched the data. If not, do cleanup
        this._options = { ...new PhysicsRadialExplosionEventOptions(), ...this._options };
        this._tickCallback = this._tick.bind(this);
        this._options.strength = this._options.strength * -1;
    }
    /**
     * Returns the data related to the gravitational field event (sphere).
     * @returns A gravitational field event
     */
    getData() {
        this._dataFetched = true;
        return {
            sphere: this._sphere,
        };
    }
    /**
     * Enables the gravitational field.
     */
    enable() {
        this._tickCallback.call(this);
        this._scene.registerBeforeRender(this._tickCallback);
    }
    /**
     * Disables the gravitational field.
     */
    disable() {
        this._scene.unregisterBeforeRender(this._tickCallback);
    }
    /**
     * Disposes the sphere.
     * @param force The force to dispose from the gravitational field event
     */
    dispose(force = true) {
        if (force) {
            this._sphere.dispose();
        }
        else {
            setTimeout(() => {
                if (!this._dataFetched) {
                    this._sphere.dispose();
                }
            }, 0);
        }
    }
    _tick() {
        // Since the params won't change, we fetch the event only once
        if (this._sphere) {
            this._physicsHelper.applyRadialExplosionForce(this._origin, this._options);
        }
        else {
            const radialExplosionEvent = this._physicsHelper.applyRadialExplosionForce(this._origin, this._options);
            if (radialExplosionEvent) {
                this._sphere = radialExplosionEvent.getData().sphere.clone("radialExplosionEventSphereClone");
            }
        }
    }
}
/**
 * Represents a physics updraft event
 */
class PhysicsUpdraftEvent {
    /**
     * Initializes the physics updraft event
     * @param _scene BabylonJS scene
     * @param _origin The origin position of the updraft
     * @param _options The options for the updraft event
     */
    constructor(_scene, _origin, _options) {
        this._scene = _scene;
        this._origin = _origin;
        this._options = _options;
        this._originTop = Vector3.Zero(); // the most upper part of the cylinder
        this._originDirection = Vector3.Zero(); // used if the updraftMode is perpendicular
        this._cylinderPosition = Vector3.Zero(); // to keep the cylinders position, because normally the origin is in the center and not on the bottom
        this._dataFetched = false; // check if the has been fetched the data. If not, do cleanup
        this._physicsEngine = this._scene.getPhysicsEngine();
        this._options = { ...new PhysicsUpdraftEventOptions(), ...this._options };
        this._origin.addToRef(new Vector3(0, this._options.height / 2, 0), this._cylinderPosition);
        this._origin.addToRef(new Vector3(0, this._options.height, 0), this._originTop);
        if (this._options.updraftMode === PhysicsUpdraftMode.Perpendicular) {
            this._originDirection = this._origin.subtract(this._originTop).normalize();
        }
        this._tickCallback = this._tick.bind(this);
        this._prepareCylinder();
    }
    /**
     * Returns the data related to the updraft event (cylinder).
     * @returns A physics updraft event
     */
    getData() {
        this._dataFetched = true;
        return {
            cylinder: this._cylinder,
        };
    }
    /**
     * Enables the updraft.
     */
    enable() {
        this._tickCallback.call(this);
        this._scene.registerBeforeRender(this._tickCallback);
    }
    /**
     * Disables the updraft.
     */
    disable() {
        this._scene.unregisterBeforeRender(this._tickCallback);
    }
    /**
     * Disposes the cylinder.
     * @param force Specifies if the updraft should be disposed by force
     */
    dispose(force = true) {
        if (!this._cylinder) {
            return;
        }
        if (force) {
            this._cylinder.dispose();
        }
        else {
            setTimeout(() => {
                if (!this._dataFetched) {
                    this._cylinder.dispose();
                }
            }, 0);
        }
    }
    _getImpostorHitData(impostor) {
        if (impostor.mass === 0) {
            return null;
        }
        if (!this._intersectsWithCylinder(impostor)) {
            return null;
        }
        const impostorObjectCenter = impostor.getObjectCenter();
        let direction;
        if (this._options.updraftMode === PhysicsUpdraftMode.Perpendicular) {
            direction = this._originDirection;
        }
        else {
            direction = impostorObjectCenter.subtract(this._originTop);
        }
        const distanceFromOrigin = Vector3.Distance(this._origin, impostorObjectCenter);
        const multiplier = this._options.strength * -1;
        const force = direction.multiplyByFloats(multiplier, multiplier, multiplier);
        return { force: force, contactPoint: impostorObjectCenter, distanceFromOrigin: distanceFromOrigin };
    }
    _tick() {
        this._physicsEngine.getImpostors().forEach((impostor) => {
            const impostorHitData = this._getImpostorHitData(impostor);
            if (!impostorHitData) {
                return;
            }
            impostor.applyForce(impostorHitData.force, impostorHitData.contactPoint);
        });
    }
    /*** Helpers ***/
    _prepareCylinder() {
        if (!this._cylinder) {
            this._cylinder = CreateCylinder("updraftEventCylinder", {
                height: this._options.height,
                diameter: this._options.radius * 2,
            }, this._scene);
            this._cylinder.isVisible = false;
        }
    }
    _intersectsWithCylinder(impostor) {
        const impostorObject = impostor.object;
        this._cylinder.position = this._cylinderPosition;
        return this._cylinder.intersectsMesh(impostorObject, true);
    }
}
/**
 * Represents a physics vortex event
 */
class PhysicsVortexEvent {
    /**
     * Initializes the physics vortex event
     * @param _scene The BabylonJS scene
     * @param _origin The origin position of the vortex
     * @param _options The options for the vortex event
     */
    constructor(_scene, _origin, _options) {
        this._scene = _scene;
        this._origin = _origin;
        this._options = _options;
        this._originTop = Vector3.Zero(); // the most upper part of the cylinder
        this._cylinderPosition = Vector3.Zero(); // to keep the cylinders position, because normally the origin is in the center and not on the bottom
        this._dataFetched = false; // check if the has been fetched the data. If not, do cleanup
        this._physicsEngine = this._scene.getPhysicsEngine();
        this._options = { ...new PhysicsVortexEventOptions(), ...this._options };
        this._origin.addToRef(new Vector3(0, this._options.height / 2, 0), this._cylinderPosition);
        this._origin.addToRef(new Vector3(0, this._options.height, 0), this._originTop);
        this._tickCallback = this._tick.bind(this);
        this._prepareCylinder();
    }
    /**
     * Returns the data related to the vortex event (cylinder).
     * @returns The physics vortex event data
     */
    getData() {
        this._dataFetched = true;
        return {
            cylinder: this._cylinder,
        };
    }
    /**
     * Enables the vortex.
     */
    enable() {
        this._tickCallback.call(this);
        this._scene.registerBeforeRender(this._tickCallback);
    }
    /**
     * Disables the cortex.
     */
    disable() {
        this._scene.unregisterBeforeRender(this._tickCallback);
    }
    /**
     * Disposes the sphere.
     * @param force
     */
    dispose(force = true) {
        if (force) {
            this._cylinder.dispose();
        }
        else {
            setTimeout(() => {
                if (!this._dataFetched) {
                    this._cylinder.dispose();
                }
            }, 0);
        }
    }
    _getImpostorHitData(impostor) {
        if (impostor.mass === 0) {
            return null;
        }
        if (!this._intersectsWithCylinder(impostor)) {
            return null;
        }
        if (impostor.object.getClassName() !== "Mesh" && impostor.object.getClassName() !== "InstancedMesh") {
            return null;
        }
        const impostorObjectCenter = impostor.getObjectCenter();
        const originOnPlane = new Vector3(this._origin.x, impostorObjectCenter.y, this._origin.z); // the distance to the origin as if both objects were on a plane (Y-axis)
        const originToImpostorDirection = impostorObjectCenter.subtract(originOnPlane);
        const ray = new Ray(originOnPlane, originToImpostorDirection, this._options.radius);
        const hit = ray.intersectsMesh(impostor.object);
        const contactPoint = hit.pickedPoint;
        if (!contactPoint) {
            return null;
        }
        const absoluteDistanceFromOrigin = hit.distance / this._options.radius;
        let directionToOrigin = contactPoint.normalize();
        if (absoluteDistanceFromOrigin > this._options.centripetalForceThreshold) {
            directionToOrigin = directionToOrigin.negate();
        }
        let forceX;
        let forceY;
        let forceZ;
        if (absoluteDistanceFromOrigin > this._options.centripetalForceThreshold) {
            forceX = directionToOrigin.x * this._options.centripetalForceMultiplier;
            forceY = directionToOrigin.y * this._options.updraftForceMultiplier;
            forceZ = directionToOrigin.z * this._options.centripetalForceMultiplier;
        }
        else {
            const perpendicularDirection = Vector3.Cross(originOnPlane, impostorObjectCenter).normalize();
            forceX = (perpendicularDirection.x + directionToOrigin.x) * this._options.centrifugalForceMultiplier;
            forceY = this._originTop.y * this._options.updraftForceMultiplier;
            forceZ = (perpendicularDirection.z + directionToOrigin.z) * this._options.centrifugalForceMultiplier;
        }
        let force = new Vector3(forceX, forceY, forceZ);
        force = force.multiplyByFloats(this._options.strength, this._options.strength, this._options.strength);
        return { force: force, contactPoint: impostorObjectCenter, distanceFromOrigin: absoluteDistanceFromOrigin };
    }
    _tick() {
        this._physicsEngine.getImpostors().forEach((impostor) => {
            const impostorHitData = this._getImpostorHitData(impostor);
            if (!impostorHitData) {
                return;
            }
            impostor.applyForce(impostorHitData.force, impostorHitData.contactPoint);
        });
    }
    /*** Helpers ***/
    _prepareCylinder() {
        if (!this._cylinder) {
            this._cylinder = CreateCylinder("vortexEventCylinder", {
                height: this._options.height,
                diameter: this._options.radius * 2,
            }, this._scene);
            this._cylinder.isVisible = false;
        }
    }
    _intersectsWithCylinder(impostor) {
        const impostorObject = impostor.object;
        this._cylinder.position = this._cylinderPosition;
        return this._cylinder.intersectsMesh(impostorObject, true);
    }
}
/**
 * Options fot the radial explosion event
 * @see https://doc.babylonjs.com/features/featuresDeepDive/physics/usingPhysicsEngine#further-functionality-of-the-impostor-class
 */
export class PhysicsRadialExplosionEventOptions {
    constructor() {
        /**
         * The radius of the sphere for the radial explosion.
         */
        this.radius = 5;
        /**
         * The strength of the explosion.
         */
        this.strength = 10;
        /**
         * The strength of the force in correspondence to the distance of the affected object
         */
        this.falloff = PhysicsRadialImpulseFalloff.Constant;
        /**
         * Sphere options for the radial explosion.
         */
        this.sphere = { segments: 32, diameter: 1 };
    }
}
/**
 * Options fot the updraft event
 * @see https://doc.babylonjs.com/features/featuresDeepDive/physics/usingPhysicsEngine#further-functionality-of-the-impostor-class
 */
export class PhysicsUpdraftEventOptions {
    constructor() {
        /**
         * The radius of the cylinder for the vortex
         */
        this.radius = 5;
        /**
         * The strength of the updraft.
         */
        this.strength = 10;
        /**
         * The height of the cylinder for the updraft.
         */
        this.height = 10;
        /**
         * The mode for the the updraft.
         */
        this.updraftMode = PhysicsUpdraftMode.Center;
    }
}
/**
 * Options fot the vortex event
 * @see https://doc.babylonjs.com/features/featuresDeepDive/physics/usingPhysicsEngine#further-functionality-of-the-impostor-class
 */
export class PhysicsVortexEventOptions {
    constructor() {
        /**
         * The radius of the cylinder for the vortex
         */
        this.radius = 5;
        /**
         * The strength of the vortex.
         */
        this.strength = 10;
        /**
         * The height of the cylinder for the vortex.
         */
        this.height = 10;
        /**
         * At which distance, relative to the radius the centripetal forces should kick in? Range: 0-1
         */
        this.centripetalForceThreshold = 0.7;
        /**
         * This multiplier determines with how much force the objects will be pushed sideways/around the vortex, when below the threshold.
         */
        this.centripetalForceMultiplier = 5;
        /**
         * This multiplier determines with how much force the objects will be pushed sideways/around the vortex, when above the threshold.
         */
        this.centrifugalForceMultiplier = 0.5;
        /**
         * This multiplier determines with how much force the objects will be pushed upwards, when in the vortex.
         */
        this.updraftForceMultiplier = 0.02;
    }
}
/**
 * The strength of the force in correspondence to the distance of the affected object
 * @see https://doc.babylonjs.com/features/featuresDeepDive/physics/usingPhysicsEngine#further-functionality-of-the-impostor-class
 */
export var PhysicsRadialImpulseFalloff;
(function (PhysicsRadialImpulseFalloff) {
    /** Defines that impulse is constant in strength across it's whole radius */
    PhysicsRadialImpulseFalloff[PhysicsRadialImpulseFalloff["Constant"] = 0] = "Constant";
    /** Defines that impulse gets weaker if it's further from the origin */
    PhysicsRadialImpulseFalloff[PhysicsRadialImpulseFalloff["Linear"] = 1] = "Linear";
})(PhysicsRadialImpulseFalloff || (PhysicsRadialImpulseFalloff = {}));
/**
 * The strength of the force in correspondence to the distance of the affected object
 * @see https://doc.babylonjs.com/features/featuresDeepDive/physics/usingPhysicsEngine#further-functionality-of-the-impostor-class
 */
export var PhysicsUpdraftMode;
(function (PhysicsUpdraftMode) {
    /** Defines that the upstream forces will pull towards the top center of the cylinder */
    PhysicsUpdraftMode[PhysicsUpdraftMode["Center"] = 0] = "Center";
    /** Defines that once a impostor is inside the cylinder, it will shoot out perpendicular from the ground of the cylinder */
    PhysicsUpdraftMode[PhysicsUpdraftMode["Perpendicular"] = 1] = "Perpendicular";
})(PhysicsUpdraftMode || (PhysicsUpdraftMode = {}));
//# sourceMappingURL=physicsHelper.js.map