import { Vector3, Quaternion, Matrix, TmpVectors } from "../../Maths/math.vector.pure.js";
import { PhysicsBody } from "./physicsBody.js";
import { PhysicsShapeCapsule } from "./physicsShape.js";
import { BuildArray } from "../../Misc/arrayTools.js";
import { TransformNode } from "../../Meshes/transformNode.pure.js";
import { Observable } from "../../Misc/observable.js";
/**
 * State of the character on the surface
 */
export var CharacterSupportedState;
(function (CharacterSupportedState) {
    CharacterSupportedState[CharacterSupportedState["UNSUPPORTED"] = 0] = "UNSUPPORTED";
    CharacterSupportedState[CharacterSupportedState["SLIDING"] = 1] = "SLIDING";
    CharacterSupportedState[CharacterSupportedState["SUPPORTED"] = 2] = "SUPPORTED";
})(CharacterSupportedState || (CharacterSupportedState = {}));
var SurfaceConstraintInteractionStatus;
(function (SurfaceConstraintInteractionStatus) {
    SurfaceConstraintInteractionStatus[SurfaceConstraintInteractionStatus["OK"] = 0] = "OK";
    SurfaceConstraintInteractionStatus[SurfaceConstraintInteractionStatus["FAILURE_3D"] = 1] = "FAILURE_3D";
    SurfaceConstraintInteractionStatus[SurfaceConstraintInteractionStatus["FAILURE_2D"] = 2] = "FAILURE_2D";
})(SurfaceConstraintInteractionStatus || (SurfaceConstraintInteractionStatus = {}));
/** @internal */
class SimplexSolverOutput {
}
/** @internal */
class SimplexSolverActivePlanes {
    /** @internal */
    copyFrom(other) {
        this.index = other.index;
        this.constraint = other.constraint;
        this.interaction = other.interaction;
    }
}
/** @internal */
class SimplexSolverInfo {
    constructor() {
        /** @internal */
        this.supportPlanes = new Array(4);
        /** @internal */
        this.numSupportPlanes = 0;
        /** @internal */
        this.currentTime = 0;
    }
    /** @internal */
    getOutput(constraint) {
        return this.outputInteractions[this.inputConstraints.indexOf(constraint)]; //<todo.eoin This is O(1) in C++! Equivalent in TS?
    }
}
/** @internal */
function ContactFromCast(hp, cp /*ContactPoint*/, castPath, hitFraction, keepDistance) {
    const bodyMap = hp._bodies;
    const normal = Vector3.FromArray(cp[4]);
    const dist = -hitFraction * castPath.dot(normal);
    return {
        position: Vector3.FromArray(cp[3]),
        normal: normal,
        distance: dist,
        fraction: hitFraction,
        bodyB: bodyMap.get(cp[0][0]),
        allowedPenetration: Math.min(Math.max(keepDistance - dist, 0.0), keepDistance),
    };
}
/**
 * Character controller using physics
 */
export class PhysicsCharacterController {
    /**
     * instanciate a new characterController
     * @param position Initial position
     * @param characterShapeOptions character physics shape options
     * @param scene Scene
     */
    constructor(position, characterShapeOptions, scene) {
        this._orientation = Quaternion.Identity();
        this._manifold = [];
        this._stepUpSavedManifold = [];
        this._contactAngleSensitivity = 10.0;
        this._tmpMatrix = new Matrix();
        this._tmpVecs = BuildArray(32, Vector3.Zero);
        /**
         * minimum distance to make contact
         * default 0.05
         */
        this.keepDistance = 0.05;
        /**
         * maximum distance to keep contact
         * default 0.1
         */
        this.keepContactTolerance = 0.1;
        /**
         * maximum number of raycast per integration starp
         * default 10
         */
        this.maxCastIterations = 10;
        /**
         * speed when recovery from penetration
         * default 1.0
         */
        this.penetrationRecoverySpeed = 1.0;
        /**
         * friction with static surfaces
         * default 0
         */
        this.staticFriction = 0;
        /**
         * friction with dynamic surfaces
         * default 1
         */
        this.dynamicFriction = 1;
        /**
         * cosine value of slope angle that can be climbed
         * computed as `Math.cos(Math.PI * (angleInDegree / 180.0));`
         * default 0.5 (value for a 60deg angle)
         */
        this.maxSlopeCosine = 0.5;
        /**
         * Maximum height the character can automatically step up onto a walkable surface.
         * When greater than 0 the controller enforces this as a strict cap on step climbing,
         * independent of the collision shape's geometry:
         *
         *  - Obstacles whose top is at most maxStepHeight above the character's foot are
         *    climbed (either rolled over naturally by the capsule, or snapped up via the
         *    step-up sweep when the simplex would otherwise be blocked).
         *  - Obstacles taller than maxStepHeight are blocked, even ones the capsule's
         *    rounded bottom would otherwise glide over.
         *
         * This is enforced by demoting any "walkable" contact that sits more than
         * maxStepHeight above the foot into an extra horizontal wall constraint, so the
         * step-height limit does not depend on the capsule radius. As a documented side
         * effect, slopes whose contact rises above maxStepHeight (roughly when
         * `capsuleRadius * (1 - cos(slopeAngle)) > maxStepHeight`) are also treated as
         * walls. Pick maxStepHeight large enough to clear the slope angles you want to
         * remain walkable, or rely on `maxSlopeCosine` alone (with maxStepHeight = 0)
         * when the rounded-capsule riding behavior is acceptable.
         *
         * Step-up only triggers against STATIC and ANIMATED bodies. Dynamic bodies fall
         * through to normal contact resolution and pushing behavior.
         *
         * Thin walls / fences with floor behind them are not considered steppable: the
         * landing must be measurably higher than the starting position along `up`.
         *
         * The foot is computed as `position - up * footOffset`. Override `footOffset` if
         * you supply a custom collision shape whose center is not at half-height.
         *
         * Assumes `up` is a unit vector.
         *
         * default 0 (disabled)
         */
        this.maxStepHeight = 0;
        /**
         * character maximum speed
         * default 10
         */
        this.maxCharacterSpeedForSolver = 10.0;
        /**
         * up vector
         */
        this.up = new Vector3(0, 1, 0);
        /**
         * Strength when pushing other bodies
         * default 1e38
         */
        this.characterStrength = 1e38;
        /**
         * Acceleration factor. A value of 1 means reaching max velocity immediately
         */
        this.acceleration = 0.05;
        /**
         * maximum acceleration in world space coordinate
         */
        this.maxAcceleration = 50;
        /**
         * character mass
         * default 0
         */
        this.characterMass = 0;
        /**
         * Observable for trigger entered and trigger exited events
         */
        this.onTriggerCollisionObservable = new Observable();
        // If the difference between the cast displacement and the simplex solver output position is less than this
        // value (per component), do not do a second cast to check if it's possible to reach the output position.
        this._displacementEps = 1e-4;
        // Store previous positions per body for velocity calculation
        this._bodyPositionTracking = new Map();
        this._position = position.clone();
        this._velocity = Vector3.Zero();
        this._lastVelocity = Vector3.Zero();
        const r = characterShapeOptions.capsuleRadius ?? 0.6;
        const h = characterShapeOptions.capsuleHeight ?? 1.8;
        this.footOffset = h * 0.5;
        this._tmpVecs[0].set(0, h * 0.5 - r, 0);
        this._tmpVecs[1].set(0, -h * 0.5 + r, 0);
        this._ownShape = !characterShapeOptions.shape;
        this._shapeOptions = characterShapeOptions;
        this._shape = characterShapeOptions.shape ?? new PhysicsShapeCapsule(this._tmpVecs[0], this._tmpVecs[1], r, scene);
        this._transformNode = new TransformNode("CCTransformNode", scene);
        this._transformNode.position.copyFrom(this._position);
        this._body = new PhysicsBody(this._transformNode, 1 /* PhysicsMotionType.ANIMATED */, false, scene);
        this._body.setMassProperties({ inertia: Vector3.ZeroReadOnly });
        this._body.shape = this._shape;
        this._body.disablePreStep = false;
        this._lastInvDeltaTime = 1.0 / 60.0;
        this._lastDisplacement = Vector3.Zero();
        this._scene = scene;
        const hk = this._scene.getPhysicsEngine().getPhysicsPlugin();
        const hknp = hk._hknp;
        this._startCollector = hknp.HP_QueryCollector_Create(16)[1];
        this._castCollector = hknp.HP_QueryCollector_Create(16)[1];
    }
    /**
     * Dispose the character controller
     */
    dispose() {
        if (this._ownShape) {
            this._shape.dispose();
        }
        this._body.dispose();
        this._transformNode.dispose();
        const hk = this._scene.getPhysicsEngine().getPhysicsPlugin();
        const hknp = hk._hknp;
        hknp.HP_QueryCollector_Release(this._startCollector);
        hknp.HP_QueryCollector_Release(this._castCollector);
    }
    /**
     * Get shape used for collision
     */
    get shape() {
        return this._shape;
    }
    /**
     * Set shape used for collision
     */
    set shape(value) {
        this._body.shape = value;
        if (this._ownShape) {
            this._shape.dispose();
        }
        this._shape = value;
        this._ownShape = false;
    }
    /**
     * Get the shape options used to build the collision shape
     */
    get shapeOptions() {
        return this._shapeOptions;
    }
    /**
     * Set new shape options and rebuild the collision shape accordingly.
     * When the options provide an explicit `shape`, it is used directly; otherwise
     * a capsule is created from the `capsuleHeight` / `capsuleRadius` values. The
     * resulting shape is assigned through the shape setter, which releases the
     * previously owned shape.
     * @param characterShapeOptions character physics shape options
     * @param preserveFootPosition when true (default), the controller position is adapted so the
     * world-space foot position (center - up * footOffset) is kept fixed as the height changes; when
     * false, the position is left unchanged.
     */
    setShapeOptions(characterShapeOptions, preserveFootPosition = true) {
        this._shapeOptions = characterShapeOptions;
        const r = characterShapeOptions.capsuleRadius ?? 0.6;
        const h = characterShapeOptions.capsuleHeight ?? 1.8;
        const newFootOffset = h * 0.5;
        if (preserveFootPosition) {
            // Compute the current world-space foot position (center - up * footOffset), then move the
            // center so the feet stay fixed for the new half-height: center = foot + up * newFootOffset.
            const foot = this._tmpVecs[2];
            this.up.scaleToRef(this.footOffset, foot);
            this._position.subtractToRef(foot, foot);
            this.up.scaleToRef(newFootOffset, this._tmpVecs[3]);
            foot.addToRef(this._tmpVecs[3], this._position);
            this._transformNode.position.copyFrom(this._position);
        }
        this.footOffset = newFootOffset;
        this._tmpVecs[0].set(0, h * 0.5 - r, 0);
        this._tmpVecs[1].set(0, -h * 0.5 + r, 0);
        const ownShape = !characterShapeOptions.shape;
        this.shape = characterShapeOptions.shape ?? new PhysicsShapeCapsule(this._tmpVecs[0], this._tmpVecs[1], r, this._scene);
        this._ownShape = ownShape;
    }
    /**
     * Character position
     * @returns Character position
     */
    getPosition() {
        return this._position;
    }
    /**
     * Teleport character to a new position
     * @param position new position
     */
    setPosition(position) {
        this._position.copyFrom(position);
        this._transformNode.position.copyFrom(this._position);
    }
    /**
     * Character velocity
     * @returns Character velocity vector
     */
    getVelocity() {
        return this._velocity;
    }
    /**
     * Set velocity vector
     * @param velocity vector
     */
    setVelocity(velocity) {
        this._velocity.copyFrom(velocity);
    }
    _validateManifold() {
        const newManifold = [];
        for (let i = 0; i < this._manifold.length; i++) {
            if (!this._manifold[i].bodyB.body.isDisposed) {
                newManifold.push(this._manifold[i]);
            }
        }
        this._manifold = newManifold;
    }
    _getPointVelocityToRef(body, pointWorld, result) {
        //<todo does this really not exist in body interface?
        const comWorld = this._tmpVecs[10];
        this._getComWorldToRef(body, comWorld);
        const relPos = this._tmpVecs[11];
        pointWorld.subtractToRef(comWorld, relPos);
        const av = this._tmpVecs[12];
        body.body.getAngularVelocityToRef(av, body.index);
        const arm = this._tmpVecs[13];
        Vector3.CrossToRef(av, relPos, arm);
        arm.addToRef(body.body.getLinearVelocity(body.index), result);
    }
    _compareContacts(contactA, contactB) {
        const angSquared = (1.0 - contactA.normal.dot(contactB.normal)) * this._contactAngleSensitivity * this._contactAngleSensitivity;
        const planeDistSquared = (contactA.distance - contactB.distance) * (contactA.distance * contactB.distance);
        const p1Vel = this._tmpVecs[7];
        this._getPointVelocityToRef(contactA.bodyB, contactA.position, p1Vel);
        const p2Vel = this._tmpVecs[8];
        this._getPointVelocityToRef(contactB.bodyB, contactB.position, p2Vel);
        const velocityDiff = this._tmpVecs[9];
        p1Vel.subtractToRef(p2Vel, velocityDiff);
        const velocityDiffSquared = velocityDiff.lengthSquared();
        const fitness = angSquared * 10.0 + velocityDiffSquared * 0.1 + planeDistSquared;
        return fitness;
    }
    _findContact(referenceContact, contactList, threshold) {
        let bestIdx = -1;
        let bestFitness = threshold;
        for (let i = 0; i < contactList.length; i++) {
            const fitness = this._compareContacts(referenceContact, contactList[i]);
            if (fitness < bestFitness) {
                bestFitness = fitness;
                bestIdx = i;
            }
        }
        return bestIdx;
    }
    _updateManifold(startCollector /*HP_CollectorId*/, castCollector /*HP_CollectorId*/, castPath) {
        const hk = this._scene.getPhysicsEngine().getPhysicsPlugin();
        const hknp = hk._hknp;
        const numProximityHits = hknp.HP_QueryCollector_GetNumHits(startCollector)[1];
        if (numProximityHits > 0) {
            const newContacts = [];
            let minDistance = 1e38;
            const bodyMap = hk._bodies;
            for (let i = 0; i < numProximityHits; i++) {
                const [distance, , contactWorld] = hknp.HP_QueryCollector_GetShapeProximityResult(startCollector, i)[1];
                minDistance = Math.min(minDistance, distance);
                newContacts.push({
                    position: Vector3.FromArray(contactWorld[3]),
                    normal: Vector3.FromArray(contactWorld[4]),
                    distance: distance,
                    fraction: 0,
                    bodyB: bodyMap.get(contactWorld[0][0]),
                    allowedPenetration: Math.min(Math.max(this.keepDistance - distance, 0.0), this.keepDistance),
                });
            }
            for (let i = this._manifold.length - 1; i >= 0; i--) {
                const currentContact = this._manifold[i];
                const bestMatch = this._findContact(currentContact, newContacts, 1.1);
                if (bestMatch >= 0) {
                    const newAllowedPenetration = Math.min(Math.max(this.keepDistance - newContacts[bestMatch].distance, 0.0), currentContact.allowedPenetration);
                    this._manifold[i] = newContacts[bestMatch];
                    this._manifold[i].allowedPenetration = newAllowedPenetration;
                    newContacts.splice(bestMatch, 1);
                }
                else {
                    this._manifold.splice(i, 1);
                }
            }
            const closestContactIndex = newContacts.findIndex((c) => c.distance == minDistance);
            if (closestContactIndex >= 0) {
                const bestMatch = this._findContact(newContacts[closestContactIndex], this._manifold, 0.1);
                if (bestMatch >= 0) {
                    const newAllowedPenetration = Math.min(Math.max(this.keepDistance - newContacts[closestContactIndex].distance, 0.0), this._manifold[bestMatch].allowedPenetration);
                    this._manifold[bestMatch] = newContacts[closestContactIndex];
                    this._manifold[bestMatch].allowedPenetration = newAllowedPenetration;
                }
                else {
                    this._manifold.push(newContacts[closestContactIndex]);
                }
            }
        }
        else {
            // No start hits; clear manifold completely
            this._manifold.length = 0;
        }
        let numHitBodies = 0; //< == CASTCOLLECTOR_HIT_SINGLE_BODY
        // Process shape cast results if any
        const numCastHits = hknp.HP_QueryCollector_GetNumHits(castCollector)[1];
        if (numCastHits > 0) {
            let closestHitBody = null;
            for (let i = 0; i < numCastHits; i++) {
                const [fraction, , hitWorld] = hknp.HP_QueryCollector_GetShapeCastResult(castCollector, i)[1];
                if (closestHitBody == null) {
                    const contact = ContactFromCast(hk, hitWorld, castPath, fraction, this.keepDistance);
                    closestHitBody = hitWorld[0][0];
                    const bestMatch = this._findContact(contact, this._manifold, 0.1);
                    if (bestMatch == -1) {
                        this._manifold.push(contact);
                    }
                    if (contact.bodyB.body.getMotionType(contact.bodyB.index) == 0 /* PhysicsMotionType.STATIC */) {
                        // The closest body is static, so it cannot move away from CC and we don't need to look any further.
                        break;
                    }
                }
                else if (closestHitBody._pluginData && hitWorld[0] != closestHitBody._pluginData.hpBodyId) {
                    numHitBodies++;
                    break;
                }
            }
        }
        // Remove from the manifold contacts that are too similar as the simplex does not handle parallel planes
        for (let e1 = this._manifold.length - 1; e1 >= 0; e1--) {
            let e2 = e1 - 1;
            for (; e2 >= 0; e2--) {
                const fitness = this._compareContacts(this._manifold[e1], this._manifold[e2]);
                if (fitness < 0.1) {
                    break;
                }
            }
            if (e2 >= 0) {
                this._manifold.slice(e1, 1);
            }
        }
        return numHitBodies;
    }
    _createSurfaceConstraint(dt, contact, timeTravelled) {
        const constraint = {
            //let distance = contact.distance - this.keepDistance;
            planeNormal: contact.normal.clone(),
            planeDistance: contact.distance,
            staticFriction: this.staticFriction,
            dynamicFriction: this.dynamicFriction,
            extraUpStaticFriction: 0,
            extraDownStaticFriction: 0,
            velocity: Vector3.Zero(),
            angularVelocity: Vector3.Zero(),
            priority: 0,
        };
        const maxSlopeCosEps = 0.1;
        const maxSlopeCosine = Math.max(this.maxSlopeCosine, maxSlopeCosEps);
        const normalDotUp = contact.normal.dot(this.up);
        const contactPosition = contact.position.clone();
        if (normalDotUp > maxSlopeCosine) {
            const com = this.getPosition();
            const contactArm = this._tmpVecs[20];
            contact.position.subtractToRef(com, contactArm);
            const scale = contact.normal.dot(contactArm);
            contactPosition.x = com.x + this.up.x * scale;
            contactPosition.y = com.y + this.up.y * scale;
            contactPosition.z = com.z + this.up.z * scale;
        }
        const motionType = contact.bodyB.body.getMotionType(contact.bodyB.index);
        if (motionType != 0 /* PhysicsMotionType.STATIC */) {
            //<todo Need hknpMotionUtil::predictPontVelocity
        }
        const shift = constraint.velocity.dot(constraint.planeNormal) * timeTravelled;
        constraint.planeDistance -= shift;
        if (motionType == 0 /* PhysicsMotionType.STATIC */) {
            constraint.priority = 2;
        }
        else if (motionType == 1 /* PhysicsMotionType.ANIMATED */) {
            const bodyTransformNode = contact.bodyB.body.transformNode;
            const bodyId = bodyTransformNode.uniqueId;
            // Retrieve tracking data
            let tracking = this._bodyPositionTracking.get(bodyId);
            const currentFrameWorldMatrix = contact.bodyB.body.transformNode.getWorldMatrix();
            const frameId = this._scene.getFrameId();
            if (!tracking) {
                // Initialize tracking
                tracking = {
                    prevWorldMatrix: currentFrameWorldMatrix.clone(),
                    frameId: frameId,
                };
                this._bodyPositionTracking.set(bodyId, tracking);
            }
            else {
                // Only calculate velocity if this contact existed in the previous frame
                // This avoids huge delta spikes when first making contact or after gaps
                if (tracking.frameId + 1 === frameId) {
                    const previousFrameWorldMatrix = tracking.prevWorldMatrix;
                    const currentFrameWorldMatrixInverse = TmpVectors.Matrix[1];
                    currentFrameWorldMatrix.invertToRef(currentFrameWorldMatrixInverse);
                    const characterPosition = this.getPosition();
                    // compute characterPosition in body local space at previous frame
                    const characterLocalPosition = this._tmpVecs[21];
                    Vector3.TransformCoordinatesToRef(characterPosition, currentFrameWorldMatrixInverse, characterLocalPosition);
                    const characterWorldPosition = this._tmpVecs[22];
                    Vector3.TransformCoordinatesToRef(characterLocalPosition, previousFrameWorldMatrix, characterWorldPosition);
                    const playerDeltaPosition = this._tmpVecs[23];
                    characterPosition.subtractToRef(characterWorldPosition, playerDeltaPosition);
                    constraint.velocity.copyFrom(playerDeltaPosition);
                    constraint.velocity.scaleInPlace(1 / dt);
                    constraint.priority = 1;
                }
                tracking.prevWorldMatrix.copyFrom(currentFrameWorldMatrix);
                tracking.frameId = frameId;
            }
        }
        return constraint;
    }
    _addMaxSlopePlane(maxSlopeCos, up, index, constraints, allowedPenetration) {
        const verticalComponent = constraints[index].planeNormal.dot(up);
        if (verticalComponent > 0.01 && verticalComponent < maxSlopeCos) {
            const newConstraint = {
                planeNormal: constraints[index].planeNormal.clone(),
                planeDistance: constraints[index].planeDistance,
                velocity: constraints[index].velocity.clone(),
                angularVelocity: constraints[index].angularVelocity.clone(),
                priority: constraints[index].priority,
                dynamicFriction: constraints[index].dynamicFriction,
                staticFriction: constraints[index].staticFriction,
                extraDownStaticFriction: constraints[index].extraDownStaticFriction,
                extraUpStaticFriction: constraints[index].extraUpStaticFriction,
            };
            const distance = newConstraint.planeDistance;
            newConstraint.planeNormal.subtractInPlace(up.scale(verticalComponent));
            newConstraint.planeNormal.normalize();
            if (distance >= 0) {
                newConstraint.planeDistance = distance * newConstraint.planeNormal.dot(constraints[index].planeNormal);
            }
            else {
                const penetrationToResolve = Math.min(0, distance + allowedPenetration);
                newConstraint.planeDistance = penetrationToResolve / newConstraint.planeNormal.dot(constraints[index].planeNormal);
                constraints[index].planeDistance = 0;
                this._resolveConstraintPenetration(newConstraint, this.penetrationRecoverySpeed);
            }
            constraints.push(newConstraint);
            return true;
        }
        return false;
    }
    /**
     * Adds an extra horizontal wall constraint when a "walkable" contact sits more than
     * `maxStepHeight` above the character's foot along `up`. Mirrors the structure of
     * `_addMaxSlopePlane` but gates on contact height rather than slope steepness.
     *
     * This makes `maxStepHeight` a strict cap on step climbing independent of the
     * capsule's curved bottom: without this, the rounded hemisphere produces an up-tilted
     * (walkable) contact normal for any obstacle shorter than the capsule radius, and
     * the simplex rides over it regardless of `maxStepHeight`.
     * @param constraints constraint list being assembled for the current manifold
     * @param contact source manifold contact backing `constraints[index]`
     * @param index index of the constraint in `constraints` whose contact is under test
     * @param allowedPenetration allowed penetration distance for this contact
     * @returns true if an extra wall constraint was appended
     */
    _addStepHeightWallPlane(constraints, contact, index, allowedPenetration) {
        const verticalComponent = constraints[index].planeNormal.dot(this.up);
        // Skip near-flat (≈1) contacts (don't demote plain ground) and near-horizontal
        // contacts (already wall-like — the regular constraint handles them).
        if (verticalComponent <= 0.01 || verticalComponent >= 1 - 1e-3) {
            return false;
        }
        // Height of the contact point above the character's foot, projected onto `up`.
        const contactDelta = this._tmpVecs[24];
        contact.position.subtractToRef(this._position, contactDelta);
        const stepHeight = contactDelta.dot(this.up) + this.footOffset;
        if (stepHeight <= this.maxStepHeight) {
            return false;
        }
        const newConstraint = {
            planeNormal: constraints[index].planeNormal.clone(),
            planeDistance: constraints[index].planeDistance,
            velocity: constraints[index].velocity.clone(),
            angularVelocity: constraints[index].angularVelocity.clone(),
            priority: constraints[index].priority,
            dynamicFriction: constraints[index].dynamicFriction,
            staticFriction: constraints[index].staticFriction,
            extraDownStaticFriction: constraints[index].extraDownStaticFriction,
            extraUpStaticFriction: constraints[index].extraUpStaticFriction,
        };
        const distance = newConstraint.planeDistance;
        const stepWallVerticalProjection = TmpVectors.Vector3[0];
        this.up.scaleToRef(verticalComponent, stepWallVerticalProjection);
        newConstraint.planeNormal.subtractInPlace(stepWallVerticalProjection);
        newConstraint.planeNormal.normalize();
        if (distance >= 0) {
            newConstraint.planeDistance = distance * newConstraint.planeNormal.dot(constraints[index].planeNormal);
        }
        else {
            const penetrationToResolve = Math.min(0, distance + allowedPenetration);
            newConstraint.planeDistance = penetrationToResolve / newConstraint.planeNormal.dot(constraints[index].planeNormal);
            constraints[index].planeDistance = 0;
            this._resolveConstraintPenetration(newConstraint, this.penetrationRecoverySpeed);
        }
        constraints.push(newConstraint);
        return true;
    }
    _resolveConstraintPenetration(constraint, penetrationRecoverySpeed) {
        // If penetrating we add extra velocity to push the character back out
        const eps = 1e-6;
        if (constraint.planeDistance < -eps) {
            constraint.planeNormal.scaleToRef(constraint.planeDistance * penetrationRecoverySpeed, this._tmpVecs[6]);
            constraint.velocity.subtractInPlace(this._tmpVecs[6]);
        }
    }
    _createConstraintsFromManifold(dt, timeTravelled) {
        const constraints = [];
        for (let i = 0; i < this._manifold.length; i++) {
            const surfaceConstraint = this._createSurfaceConstraint(dt, this._manifold[i], timeTravelled);
            constraints.push(surfaceConstraint);
            const slopeDemoted = this._addMaxSlopePlane(this.maxSlopeCosine, this.up, i, constraints, this._manifold[i].allowedPenetration);
            // Step-height filter: when the contact sits above the foot by more than
            // `maxStepHeight`, add an extra horizontal wall constraint so the simplex
            // cannot ride over the contact via the capsule's rounded bottom. Skip when
            // the slope check already added a wall for the same contact.
            if (!slopeDemoted && this.maxStepHeight > 0) {
                this._addStepHeightWallPlane(constraints, this._manifold[i], i, this._manifold[i].allowedPenetration);
            }
            this._resolveConstraintPenetration(surfaceConstraint, this.penetrationRecoverySpeed);
        }
        return constraints;
    }
    _simplexSolverSortInfo(info) {
        // simple bubble sort by (priority,velocity)
        for (let i = 0; i < info.numSupportPlanes - 1; i++) {
            for (let j = i + 1; j < info.numSupportPlanes; j++) {
                const p0 = info.supportPlanes[i];
                const p1 = info.supportPlanes[j];
                if (p0.constraint.priority < p1.constraint.priority) {
                    continue;
                }
                if (p0.constraint.priority == p1.constraint.priority) {
                    const vel0 = p0.constraint.velocity.lengthSquared();
                    const vel1 = p1.constraint.velocity.lengthSquared();
                    if (vel0 < vel1) {
                        continue;
                    }
                }
                info.supportPlanes[i] = p1;
                info.supportPlanes[j] = p0;
            }
        }
    }
    _simplexSolverSolve1d(info, sci, velocityIn, velocityOut) {
        const eps = 1e-5;
        const groundVelocity = sci.velocity;
        const relativeVelocity = this._tmpVecs[22];
        velocityIn.subtractToRef(groundVelocity, relativeVelocity);
        const planeVel = relativeVelocity.dot(sci.planeNormal);
        const origVelocity2 = relativeVelocity.lengthSquared();
        relativeVelocity.subtractInPlace(sci.planeNormal.scale(planeVel));
        {
            const vp2 = planeVel * planeVel;
            // static friction is active if
            //  velProjPlane * friction > |(velParallel)|
            //      vplane   *     f    >         vpar
            //      vp       *     f    >         vpar
            //      vp2      *     f2   >         vpar2
            const extraStaticFriction = relativeVelocity.dot(this.up) > 0 ? sci.extraUpStaticFriction : sci.extraDownStaticFriction;
            if (extraStaticFriction > 0) {
                const horizontal = this.up.cross(sci.planeNormal);
                const hor2 = horizontal.lengthSquared();
                let horVel = 0.0;
                if (hor2 > eps) {
                    horizontal.scaleInPlace(1 / Math.sqrt(hor2));
                    horVel = relativeVelocity.dot(horizontal);
                    // horizontal component
                    {
                        const horVel2 = horVel * horVel;
                        const f2 = sci.staticFriction * sci.staticFriction;
                        if (vp2 * f2 >= horVel2) {
                            relativeVelocity.subtractInPlace(horizontal.scale(horVel));
                            horVel = 0;
                        }
                    }
                }
                // vert component
                {
                    const vertVel2 = origVelocity2 - horVel * horVel - vp2;
                    const f2 = (sci.staticFriction + extraStaticFriction) * (sci.staticFriction + extraStaticFriction);
                    if (vp2 * f2 >= vertVel2) {
                        if (horVel == 0.0) {
                            velocityOut.copyFrom(groundVelocity);
                            return;
                        }
                    }
                }
            }
            else {
                // static friction is active if
                //  velProjPlane * friction > |(vel-velProjPlane)|
                //      vp       *     f    >         rvProj
                //
                //  -> vp * f >= rvProj
                //  -> vp * f >= sqrt( vel^2 - vp^2 )
                //  -> vp^2 ( f^2 + 1 ) >= vel^2
                const f2 = sci.staticFriction * sci.staticFriction;
                if (vp2 * (1 + f2) >= origVelocity2) {
                    velocityOut.copyFrom(groundVelocity);
                    return;
                }
            }
        }
        if (sci.dynamicFriction < 1) {
            //  apply dynamic friction 0 = conserve input velocity 1 = clip against normal
            const velOut2 = relativeVelocity.lengthSquared();
            if (velOut2 >= eps) {
                if (velOut2 > 1e-4 * origVelocity2) {
                    let f = Math.sqrt(origVelocity2 / velOut2);
                    f = sci.dynamicFriction + (1 - sci.dynamicFriction) * f;
                    relativeVelocity.scaleInPlace(f);
                    const p = sci.planeNormal.dot(relativeVelocity);
                    relativeVelocity.subtractInPlace(sci.planeNormal.scale(p));
                }
            }
        }
        velocityOut.copyFrom(relativeVelocity);
        velocityOut.addInPlace(groundVelocity);
    }
    _simplexSolverSolveTest1d(sci, velocityIn) {
        const eps = 1e-3;
        const relativeVelocity = this._tmpVecs[23];
        velocityIn.subtractToRef(sci.velocity, relativeVelocity);
        return relativeVelocity.dot(sci.planeNormal) < -eps;
    }
    _simplexSolverSolve2d(info, maxSurfaceVelocity, sci0, sci1, velocityIn, velocityOut) {
        const eps = 1e-5;
        const axis = sci0.planeNormal.cross(sci1.planeNormal);
        const axisLen2 = axis.lengthSquared();
        let solveSequentially = false;
        let axisVel;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            // Check for parallel planes
            if (axisLen2 <= eps || solveSequentially) {
                info.getOutput(sci0).status = 2 /* SurfaceConstraintInteractionStatus.FAILURE_2D */;
                info.getOutput(sci1).status = 2 /* SurfaceConstraintInteractionStatus.FAILURE_2D */;
                if (sci0.priority > sci1.priority) {
                    this._simplexSolverSolve1d(info, sci1, velocityIn, velocityOut);
                    this._simplexSolverSolve1d(info, sci0, velocityIn, velocityOut);
                }
                else {
                    this._simplexSolverSolve1d(info, sci0, velocityIn, velocityOut);
                    this._simplexSolverSolve1d(info, sci1, velocityIn, velocityOut);
                }
                return;
            }
            const invAxisLen = 1.0 / Math.sqrt(axisLen2);
            axis.scaleInPlace(invAxisLen);
            //  Calculate the velocity of the free axis
            {
                const r0 = sci0.planeNormal.cross(sci1.planeNormal);
                const r1 = sci1.planeNormal.cross(axis);
                const r2 = axis.cross(sci0.planeNormal);
                const sVel = sci0.velocity.add(sci1.velocity);
                const t = this._tmpVecs[2];
                t.set(0.5 * axis.dot(sVel), sci0.planeNormal.dot(sci0.velocity), sci1.planeNormal.dot(sci1.velocity));
                const m = Matrix.FromValues(r0.x, r1.x, r2.x, 0, r0.y, r1.y, r2.y, 0, r0.z, r1.z, r2.z, 0, 0, 0, 0, 1);
                axisVel = Vector3.TransformNormal(t, m);
                axisVel.scaleInPlace(invAxisLen);
                if (Math.abs(axisVel.x) > maxSurfaceVelocity.x || Math.abs(axisVel.y) > maxSurfaceVelocity.y || Math.abs(axisVel.z) > maxSurfaceVelocity.z) {
                    solveSequentially = true;
                }
                else {
                    break;
                }
            }
        }
        const groundVelocity = axisVel;
        const relativeVelocity = this._tmpVecs[24];
        velocityIn.subtractToRef(groundVelocity, relativeVelocity);
        const vel2 = relativeVelocity.lengthSquared();
        const axisVert = this.up.dot(axis);
        let axisProjVelocity = relativeVelocity.dot(axis);
        let staticFriction = sci0.staticFriction + sci1.staticFriction;
        if (axisVert * axisProjVelocity > 0) {
            staticFriction += (sci0.extraUpStaticFriction + sci1.extraUpStaticFriction) * axisVert;
        }
        else {
            staticFriction += (sci0.extraDownStaticFriction + sci1.extraDownStaticFriction) * axisVert;
        }
        staticFriction *= 0.5;
        const dynamicFriction = (sci0.dynamicFriction + sci1.dynamicFriction) * 0.5;
        // static friction is active if
        //  |vel-axisProjVelocity|(rv) * friction(f) > axisProjVelocity(av)
        //  -> sqrt( vel2 - av2 ) * f > av
        //  -> (vel2 - av2) * f2  > av2
        const f2 = staticFriction * staticFriction;
        const av2 = axisProjVelocity * axisProjVelocity;
        if ((vel2 - av2) * f2 >= av2) {
            // static friction kicks in
            velocityOut.copyFrom(groundVelocity);
            return;
        }
        if (dynamicFriction < 1) {
            //  apply dynamic friction
            if (axisProjVelocity * axisProjVelocity > 1e-4 * vel2) {
                const tmp = 1.0 / axisProjVelocity;
                const f = Math.abs(tmp) * Math.sqrt(vel2) * (1.0 - dynamicFriction) + dynamicFriction;
                axisProjVelocity *= f;
            }
        }
        velocityOut.copyFrom(groundVelocity);
        velocityOut.addInPlace(axis.scale(axisProjVelocity));
    }
    _simplexSolverSolve3d(info, maxSurfaceVelocity, sci0, sci1, sci2, allowResort, velocityIn, velocityOut) {
        const eps = 1e-5;
        //  Calculate the velocity of the point axis
        let pointVel;
        {
            const r0 = sci1.planeNormal.cross(sci2.planeNormal);
            const r1 = sci2.planeNormal.cross(sci0.planeNormal);
            const r2 = sci0.planeNormal.cross(sci1.planeNormal);
            const det = r0.dot(sci0.planeNormal);
            let solveSequentially = false;
            // eslint-disable-next-line no-constant-condition
            while (true) {
                if (Math.abs(det) < eps || solveSequentially) {
                    if (allowResort) {
                        this._simplexSolverSortInfo(info);
                        sci0 = info.supportPlanes[0].constraint;
                        sci1 = info.supportPlanes[1].constraint;
                        sci2 = info.supportPlanes[2].constraint;
                    }
                    info.getOutput(sci0).status = 1 /* SurfaceConstraintInteractionStatus.FAILURE_3D */;
                    info.getOutput(sci1).status = 1 /* SurfaceConstraintInteractionStatus.FAILURE_3D */;
                    info.getOutput(sci2).status = 1 /* SurfaceConstraintInteractionStatus.FAILURE_3D */;
                    const oldNum = info.numSupportPlanes;
                    this._simplexSolverSolve2d(info, maxSurfaceVelocity, sci0, sci1, velocityIn, velocityOut);
                    if (oldNum == info.numSupportPlanes) {
                        this._simplexSolverSolve2d(info, maxSurfaceVelocity, sci0, sci2, velocityIn, velocityOut);
                    }
                    if (oldNum == info.numSupportPlanes) {
                        this._simplexSolverSolve2d(info, maxSurfaceVelocity, sci1, sci2, velocityIn, velocityOut);
                    }
                    return;
                }
                const t = this._tmpVecs[2];
                t.set(sci0.planeNormal.dot(sci0.velocity), sci1.planeNormal.dot(sci1.velocity), sci2.planeNormal.dot(sci2.velocity));
                const m = Matrix.FromValues(r0.x, r0.y, r0.z, 0, r1.x, r1.y, r1.z, 0, r2.x, r2.y, r2.z, 0, 0, 0, 0, 1);
                pointVel = Vector3.TransformNormal(t, m);
                pointVel.scaleInPlace(1 / det);
                if (Math.abs(pointVel.x) > maxSurfaceVelocity.x || Math.abs(pointVel.y) > maxSurfaceVelocity.y || Math.abs(pointVel.z) > maxSurfaceVelocity.z) {
                    solveSequentially = true;
                }
                else {
                    break;
                }
            }
        }
        velocityOut.copyFrom(pointVel);
    }
    _simplexSolverExamineActivePlanes(info, maxSurfaceVelocity, velocityIn, velocityOut) {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            switch (info.numSupportPlanes) {
                case 1: {
                    const sci = info.supportPlanes[0].constraint;
                    this._simplexSolverSolve1d(info, sci, velocityIn, velocityOut);
                    return;
                }
                case 2: {
                    const velocity = Vector3.Zero();
                    this._simplexSolverSolve1d(info, info.supportPlanes[1].constraint, velocityIn, velocity);
                    const plane0Used = this._simplexSolverSolveTest1d(info.supportPlanes[0].constraint, velocity);
                    if (!plane0Used) {
                        // Only need plane 1, so remove plane 0
                        info.supportPlanes[0].copyFrom(info.supportPlanes[1]);
                        info.numSupportPlanes = 1;
                        velocityOut.copyFrom(velocity);
                    }
                    else {
                        this._simplexSolverSolve2d(info, maxSurfaceVelocity, info.supportPlanes[0].constraint, info.supportPlanes[1].constraint, velocityIn, velocityOut);
                    }
                    return;
                }
                case 3: {
                    // Try to drop both planes
                    {
                        const velocity = Vector3.Zero();
                        this._simplexSolverSolve1d(info, info.supportPlanes[2].constraint, velocityIn, velocityOut);
                        const plane0Used = this._simplexSolverSolveTest1d(info.supportPlanes[0].constraint, velocity);
                        if (!plane0Used) {
                            const plane1Used = this._simplexSolverSolveTest1d(info.supportPlanes[1].constraint, velocity);
                            if (!plane1Used) {
                                velocityOut.copyFrom(velocity);
                                info.supportPlanes[0].copyFrom(info.supportPlanes[2]);
                                info.numSupportPlanes = 1;
                                continue;
                            }
                        }
                    }
                    //  Try to drop plane 0 or 1
                    {
                        let droppedAPlane = false;
                        for (let testPlane = 0; testPlane < 2; testPlane++) {
                            const velocity = Vector3.Zero();
                            this._simplexSolverSolve2d(info, maxSurfaceVelocity, info.supportPlanes[testPlane].constraint, info.supportPlanes[2].constraint, velocityIn, velocityOut);
                            const planeUsed = this._simplexSolverSolveTest1d(info.supportPlanes[1 - testPlane].constraint, velocity);
                            if (!planeUsed) {
                                info.supportPlanes[0].copyFrom(info.supportPlanes[testPlane]);
                                info.supportPlanes[1].copyFrom(info.supportPlanes[2]);
                                info.numSupportPlanes--;
                                droppedAPlane = true;
                                break;
                            }
                        }
                        if (droppedAPlane) {
                            continue;
                        }
                    }
                    // Otherwise, try and solve all three planes:
                    this._simplexSolverSolve3d(info, maxSurfaceVelocity, info.supportPlanes[0].constraint, info.supportPlanes[1].constraint, info.supportPlanes[2].constraint, true, velocityIn, velocityOut);
                    return;
                }
                case 4: {
                    this._simplexSolverSortInfo(info);
                    let droppedAPlane = false;
                    for (let i = 0; i < 3; i++) {
                        const velocity = Vector3.Zero();
                        this._simplexSolverSolve3d(info, maxSurfaceVelocity, info.supportPlanes[(i + 1) % 3].constraint, info.supportPlanes[(i + 2) % 3].constraint, info.supportPlanes[3].constraint, false, velocityIn, velocity);
                        const planeUsed = this._simplexSolverSolveTest1d(info.supportPlanes[i].constraint, velocity);
                        if (!planeUsed) {
                            info.supportPlanes[i].copyFrom(info.supportPlanes[2]);
                            info.supportPlanes[2].copyFrom(info.supportPlanes[3]);
                            info.numSupportPlanes = 3;
                            droppedAPlane = true;
                            break;
                        }
                    }
                    if (droppedAPlane) {
                        continue;
                    }
                    // Nothing can be dropped so we've failed to solve
                    // Now we try all 3d combinations
                    {
                        const velocity = velocityIn.clone();
                        const sci0 = info.supportPlanes[0].constraint;
                        const sci1 = info.supportPlanes[1].constraint;
                        const sci2 = info.supportPlanes[2].constraint;
                        const sci3 = info.supportPlanes[3].constraint;
                        const oldNum = info.numSupportPlanes;
                        if (oldNum == info.numSupportPlanes) {
                            this._simplexSolverSolve3d(info, maxSurfaceVelocity, sci0, sci1, sci2, false, velocity, velocity);
                            // eslint-disable-next-line no-dupe-else-if
                        }
                        else if (oldNum == info.numSupportPlanes) {
                            this._simplexSolverSolve3d(info, maxSurfaceVelocity, sci0, sci1, sci3, false, velocity, velocity);
                            // eslint-disable-next-line no-dupe-else-if
                        }
                        else if (oldNum == info.numSupportPlanes) {
                            this._simplexSolverSolve3d(info, maxSurfaceVelocity, sci0, sci2, sci3, false, velocity, velocity);
                            // eslint-disable-next-line no-dupe-else-if
                        }
                        else if (oldNum == info.numSupportPlanes) {
                            this._simplexSolverSolve3d(info, maxSurfaceVelocity, sci1, sci2, sci3, false, velocity, velocity);
                        }
                        velocityOut.copyFrom(velocity);
                    }
                    //  Search a plane to drop
                    {
                        //  Search the highest penalty value
                        let maxStatus = 0 /* SurfaceConstraintInteractionStatus.OK */;
                        for (let i = 0; i < 4; i++) {
                            maxStatus = Math.max(maxStatus, info.supportPlanes[i].interaction.status);
                        }
                        // Remove the place with the lowest priority and the highest penalty
                        let i = 0;
                        for (; i < 4; i++) {
                            if (maxStatus == info.supportPlanes[i].interaction.status) {
                                info.supportPlanes[i].copyFrom(info.supportPlanes[3]);
                                break;
                            }
                            info.numSupportPlanes--;
                        }
                    }
                    //  Clear penalty flags for the other planes
                    for (let i = 0; i < 3; i++) {
                        info.supportPlanes[i].interaction.status = 0 /* SurfaceConstraintInteractionStatus.OK */;
                    }
                    continue;
                }
            }
        }
    }
    _simplexSolverSolve(constraints, velocity, deltaTime, minDeltaTime, up, maxSurfaceVelocity) {
        const eps = 1e-6;
        const output = new SimplexSolverOutput();
        output.position = Vector3.Zero();
        output.velocity = velocity.clone();
        output.planeInteractions = [];
        let remainingTime = deltaTime;
        for (let i = 0; i < constraints.length; i++) {
            output.planeInteractions.push({
                touched: false,
                stopped: false,
                surfaceTime: 0,
                penaltyDistance: 0,
                status: 0 /* SurfaceConstraintInteractionStatus.OK */,
            });
        }
        const info = new SimplexSolverInfo();
        info.inputConstraints = constraints;
        info.outputInteractions = output.planeInteractions;
        info.supportPlanes[0] = new SimplexSolverActivePlanes();
        info.supportPlanes[1] = new SimplexSolverActivePlanes();
        info.supportPlanes[2] = new SimplexSolverActivePlanes();
        info.supportPlanes[3] = new SimplexSolverActivePlanes();
        while (remainingTime > 0) {
            // search for a plane which collides our current direction
            let hitIndex = -1;
            let minCollisionTime = remainingTime;
            for (let i = 0; i < constraints.length; i++) {
                //  Do not search existing active planes
                if (info.numSupportPlanes >= 1 && info.supportPlanes[0].index == i) {
                    continue;
                }
                if (info.numSupportPlanes >= 2 && info.supportPlanes[1].index == i) {
                    continue;
                }
                if (info.numSupportPlanes >= 3 && info.supportPlanes[2].index == i) {
                    continue;
                }
                if (output.planeInteractions[i].status != 0 /* SurfaceConstraintInteractionStatus.OK */) {
                    continue;
                }
                // Try to find the plane with the shortest time to move
                const sci = constraints[i];
                const relativeVel = this._tmpVecs[25];
                output.velocity.subtractToRef(sci.velocity, relativeVel);
                const relativeProjectedVel = -relativeVel.dot(sci.planeNormal);
                // if projected velocity is pointing away skip it
                if (relativeProjectedVel <= 0) {
                    continue;
                }
                //  Calculate the time of impact
                const relativePos = this._tmpVecs[26];
                sci.velocity.scaleToRef(info.currentTime, this._tmpVecs[27]);
                output.position.subtractToRef(this._tmpVecs[27], relativePos);
                let projectedPos = sci.planeNormal.dot(relativePos);
                // treat penetrations
                const penaltyDist = output.planeInteractions[i].penaltyDistance;
                if (penaltyDist < eps) {
                    projectedPos = 0;
                }
                projectedPos += penaltyDist;
                // check for new hit
                if (projectedPos < minCollisionTime * relativeProjectedVel) {
                    minCollisionTime = projectedPos / relativeProjectedVel;
                    hitIndex = i;
                }
            }
            //  integrate: Walk to our hitPosition we must walk more than 10 microseconds into the future to consider it valid.
            const minAcceptableCollisionTime = 1e-4;
            if (minCollisionTime > minAcceptableCollisionTime) {
                info.currentTime += minCollisionTime;
                remainingTime -= minCollisionTime;
                output.position.addInPlace(output.velocity.scale(minCollisionTime));
                for (let i = 0; i < info.numSupportPlanes; i++) {
                    info.supportPlanes[i].interaction.surfaceTime += minCollisionTime;
                    info.supportPlanes[i].interaction.touched = true;
                }
                output.deltaTime = info.currentTime;
                if (info.currentTime > minDeltaTime) {
                    return output;
                }
            }
            //  If we have no hit than we are done
            if (hitIndex < 0) {
                output.deltaTime = deltaTime;
                break;
            }
            //  Add our hit to our current list of active planes
            const supportPlane = info.supportPlanes[info.numSupportPlanes++];
            supportPlane.constraint = constraints[hitIndex];
            supportPlane.interaction = output.planeInteractions[hitIndex];
            supportPlane.interaction.penaltyDistance = (supportPlane.interaction.penaltyDistance + eps) * 2.0;
            supportPlane.index = hitIndex;
            // Move our character along the current set of active planes
            this._simplexSolverExamineActivePlanes(info, maxSurfaceVelocity, velocity, output.velocity);
        }
        return output;
    }
    /**
     * Compute a CharacterSurfaceInfo from current state and a direction
     * @param deltaTime frame delta time in seconds. When using scene.deltaTime divide by 1000.0
     * @param direction direction to check, usually gravity direction
     * @returns a CharacterSurfaceInfo object
     */
    checkSupport(deltaTime, direction) {
        const surfaceInfo = {
            isSurfaceDynamic: false,
            supportedState: 0 /* CharacterSupportedState.UNSUPPORTED */,
            averageSurfaceNormal: Vector3.Zero(),
            averageSurfaceVelocity: Vector3.Zero(),
            averageAngularSurfaceVelocity: Vector3.Zero(),
        };
        this.checkSupportToRef(deltaTime, direction, surfaceInfo);
        return surfaceInfo;
    }
    /**
     * Compute a CharacterSurfaceInfo from current state and a direction
     * @param deltaTime frame delta time in seconds. When using scene.deltaTime divide by 1000.0
     * @param direction direction to check, usually gravity direction
     * @param surfaceInfo output for surface info
     */
    checkSupportToRef(deltaTime, direction, surfaceInfo) {
        const eps = 1e-4;
        this._validateManifold();
        const constraints = this._createConstraintsFromManifold(deltaTime, 0.0);
        const storedVelocities = [];
        // Remove velocities and friction to make this a query of the static geometry
        for (let i = 0; i < constraints.length; i++) {
            storedVelocities.push(constraints[i].velocity.clone());
            constraints[i].velocity.setAll(0);
        }
        const maxSurfaceVelocity = this._tmpVecs[3];
        maxSurfaceVelocity.set(this.maxCharacterSpeedForSolver, this.maxCharacterSpeedForSolver, this.maxCharacterSpeedForSolver);
        const output = this._simplexSolverSolve(constraints, direction, deltaTime, deltaTime, this.up, maxSurfaceVelocity);
        surfaceInfo.averageSurfaceVelocity.setAll(0);
        surfaceInfo.averageAngularSurfaceVelocity.setAll(0);
        surfaceInfo.averageSurfaceNormal.setAll(0);
        surfaceInfo.isSurfaceDynamic = false;
        // If the constraints did not affect the character movement then it is unsupported and we can finish
        if (output.velocity.equalsWithEpsilon(direction, eps)) {
            surfaceInfo.supportedState = 0 /* CharacterSupportedState.UNSUPPORTED */;
            return;
        }
        // Check how was the input velocity modified to determine if the character is supported or sliding
        if (output.velocity.lengthSquared() < eps) {
            surfaceInfo.supportedState = 2 /* CharacterSupportedState.SUPPORTED */;
        }
        else {
            output.velocity.normalize();
            const angleSin = output.velocity.dot(direction);
            const cosSqr = 1 - angleSin * angleSin;
            if (cosSqr < this.maxSlopeCosine * this.maxSlopeCosine) {
                surfaceInfo.supportedState = 1 /* CharacterSupportedState.SLIDING */;
            }
            else {
                surfaceInfo.supportedState = 2 /* CharacterSupportedState.SUPPORTED */;
            }
        }
        // Add all supporting constraints to the ground information
        let numTouching = 0;
        for (let i = -0; i < constraints.length; i++) {
            if (output.planeInteractions[i].touched && constraints[i].planeNormal.dot(direction) < -0.08) {
                surfaceInfo.averageSurfaceNormal.addInPlace(constraints[i].planeNormal);
                surfaceInfo.averageSurfaceVelocity.addInPlace(storedVelocities[i]);
                surfaceInfo.averageAngularSurfaceVelocity.addInPlace(constraints[i].angularVelocity);
                numTouching++;
            }
        }
        if (numTouching > 0) {
            surfaceInfo.averageSurfaceNormal.normalize();
            surfaceInfo.averageSurfaceVelocity.scaleInPlace(1 / numTouching);
            surfaceInfo.averageAngularSurfaceVelocity.scaleInPlace(1 / numTouching);
        }
        // isSurfaceDynamic update
        if (surfaceInfo.supportedState == 2 /* CharacterSupportedState.SUPPORTED */) {
            for (let i = 0; i < this._manifold.length; i++) {
                const manifold = this._manifold[i];
                const bodyB = manifold.bodyB;
                if (this._manifold[i].normal.dot(direction) < -0.08 && bodyB.body.getMotionType(0) == 2 /* PhysicsMotionType.DYNAMIC */) {
                    surfaceInfo.isSurfaceDynamic = true;
                    break;
                }
            }
        }
    }
    _castWithCollectors(startPos, endPos, castCollector /*HP_CollectorId*/, startCollector /*HP_CollectorId*/) {
        const hk = this._scene.getPhysicsEngine().getPhysicsPlugin();
        const hknp = hk._hknp;
        const startNative = [startPos.x, startPos.y, startPos.z];
        const orientation = [this._orientation.x, this._orientation.y, this._orientation.z, this._orientation.w];
        if (startCollector != null) {
            const query /*: ShapeProximityInput*/ = [
                this._shape._pluginData,
                startNative,
                orientation,
                this.keepDistance + this.keepContactTolerance, // max distance
                false, // should hit triggers
                [this._body._pluginData.hpBodyId[0]],
            ];
            hknp.HP_World_ShapeProximityWithCollector(hk.world, startCollector, query);
        }
        {
            const query /*: ShapeCastInput*/ = [
                this._shape._pluginData,
                orientation,
                startNative,
                [endPos.x, endPos.y, endPos.z],
                false, // should hit triggers
                [this._body._pluginData.hpBodyId[0]],
            ];
            hknp.HP_World_ShapeCastWithCollector(hk.world, castCollector, query);
        }
    }
    /**
     * Rebuild the contact manifold from a proximity query at the given position.
     * Used by step-up to validate a candidate landing without the merging logic of `_updateManifold`,
     * which is not suited to a zero-length cast.
     * @param position position at which to run the proximity query
     */
    _refreshManifoldAtPosition(position) {
        const hk = this._scene.getPhysicsEngine().getPhysicsPlugin();
        const hknp = hk._hknp;
        const bodyMap = hk._bodies;
        const startNative = [position.x, position.y, position.z];
        const orientation = [this._orientation.x, this._orientation.y, this._orientation.z, this._orientation.w];
        const query /*: ShapeProximityInput*/ = [
            this._shape._pluginData,
            startNative,
            orientation,
            this.keepDistance + this.keepContactTolerance,
            false,
            [this._body._pluginData.hpBodyId[0]],
        ];
        hknp.HP_World_ShapeProximityWithCollector(hk.world, this._startCollector, query);
        this._manifold.length = 0;
        const numHits = hknp.HP_QueryCollector_GetNumHits(this._startCollector)[1];
        for (let i = 0; i < numHits; i++) {
            const [distance, , contactWorld] = hknp.HP_QueryCollector_GetShapeProximityResult(this._startCollector, i)[1];
            this._manifold.push({
                position: Vector3.FromArray(contactWorld[3]),
                normal: Vector3.FromArray(contactWorld[4]),
                distance: distance,
                fraction: 0,
                bodyB: bodyMap.get(contactWorld[0][0]),
                allowedPenetration: Math.min(Math.max(this.keepDistance - distance, 0.0), this.keepDistance),
            });
        }
    }
    /**
     * Search the simplex solver output for a constraint that blocks horizontal motion:
     * touched by the solver, non-walkable along `up`, and opposing the requested horizontal direction.
     * @param simplexOutput output of `_simplexSolverSolve`
     * @param constraints constraint array passed to the solver
     * @param horizDir normalized horizontal direction of intent
     * @returns the index of the first matching constraint, or -1
     */
    _findBlockingConstraintIndex(simplexOutput, constraints, horizDir) {
        const oppositionEps = 1e-3;
        const ceilingThreshold = -0.5;
        const maxSlopeCosEps = 0.1;
        const maxSlope = Math.max(this.maxSlopeCosine, maxSlopeCosEps);
        for (let i = 0; i < constraints.length; i++) {
            if (!simplexOutput.planeInteractions[i].touched) {
                continue;
            }
            const n = constraints[i].planeNormal;
            const normalDotUp = n.dot(this.up);
            if (normalDotUp >= maxSlope) {
                continue;
            }
            if (normalDotUp <= ceilingThreshold) {
                continue;
            }
            if (n.dot(horizDir) > -oppositionEps) {
                continue;
            }
            return i;
        }
        return -1;
    }
    /**
     * Iterate hits in the cast collector to find the closest one.
     * @returns object with fraction, normal, body and index of the closest hit; null if there were no hits
     */
    _getClosestCastHit() {
        const hk = this._scene.getPhysicsEngine().getPhysicsPlugin();
        const hknp = hk._hknp;
        const bodyMap = hk._bodies;
        const numHits = hknp.HP_QueryCollector_GetNumHits(this._castCollector)[1];
        if (numHits <= 0) {
            return null;
        }
        let bestFrac = Number.POSITIVE_INFINITY;
        const bestNormal = TmpVectors.Vector3[0];
        let hasBestNormal = false;
        let bestBody = null;
        for (let i = 0; i < numHits; i++) {
            const [frac, , hitWorld] = hknp.HP_QueryCollector_GetShapeCastResult(this._castCollector, i)[1];
            if (frac < bestFrac) {
                bestFrac = frac;
                Vector3.FromArrayToRef(hitWorld[4], 0, bestNormal);
                hasBestNormal = true;
                bestBody = bodyMap.get(hitWorld[0][0]) ?? null;
            }
        }
        if (!hasBestNormal) {
            return null;
        }
        return { fraction: bestFrac, normal: bestNormal.clone(), body: bestBody };
    }
    /**
     * Attempt a step-up sweep when the character is blocked by a vertical-ish obstacle.
     * Runs three shape casts (up, forward, down) and, if a valid walkable landing is found,
     * commits a new position, refreshes the manifold and updates `_lastDisplacement`.
     *
     * Caller responsibilities on success:
     * - subtract the returned time from `remainingTime`
     * - skip `_resolveContacts`, the recast block and the position update for the iteration
     *   (the step is a teleport, not a contact-resolution motion)
     *
     * @param remainingTime time budget left in the current `_integrateManifolds` iteration
     * @param inputVelocity character velocity at the start of the integration call
     * @param simplexOutput output of the iteration's simplex solve
     * @param constraints constraint array passed to the solver
     * @returns time consumed by the step on success, -1 on failure (no state mutated)
     */
    _tryStepUp(remainingTime, inputVelocity, simplexOutput, constraints) {
        const eps = 1e-4;
        const stepHeight = this.maxStepHeight;
        if (stepHeight <= 0 || remainingTime <= 0) {
            return -1;
        }
        // 1. Intended horizontal displacement (assumes `up` is unit-length)
        const upUnit = this.up;
        const upDotVel = inputVelocity.dot(upUnit);
        const horizVel = this._tmpVecs[28];
        upUnit.scaleToRef(upDotVel, this._tmpVecs[29]);
        inputVelocity.subtractToRef(this._tmpVecs[29], horizVel);
        const horizVelLenSqr = horizVel.lengthSquared();
        if (horizVelLenSqr < eps * eps) {
            return -1;
        }
        const horizVelLen = Math.sqrt(horizVelLenSqr);
        const horizDir = this._tmpVecs[30];
        horizVel.scaleToRef(1 / horizVelLen, horizDir);
        const horizDist = horizVelLen * remainingTime;
        if (horizDist <= eps) {
            return -1;
        }
        // 2. Solver must have hit a blocking, non-walkable, opposing constraint
        if (this._findBlockingConstraintIndex(simplexOutput, constraints, horizDir) < 0) {
            return -1;
        }
        // 3. Up-cast: find available head-room up to stepHeight
        const upEnd = this._tmpVecs[31];
        upUnit.scaleToRef(stepHeight, upEnd);
        upEnd.addInPlace(this._position);
        this._castWithCollectors(this._position, upEnd, this._castCollector);
        const upHit = this._getClosestCastHit();
        let stepClear = stepHeight;
        if (upHit != null) {
            if (upHit.body && upHit.body.body.getMotionType(upHit.body.index) === 2 /* PhysicsMotionType.DYNAMIC */) {
                return -1;
            }
            stepClear = Math.max(0, upHit.fraction * stepHeight - this.keepDistance);
        }
        if (stepClear <= eps) {
            return -1;
        }
        // 4. Forward-cast: sweep from the elevated position by the requested horizontal distance
        const elevated = upUnit.scale(stepClear);
        elevated.addInPlace(this._position);
        const fwdEnd = horizDir.scale(horizDist);
        fwdEnd.addInPlace(elevated);
        this._castWithCollectors(elevated, fwdEnd, this._castCollector);
        let fwdFrac = 1.0;
        const fwdHit = this._getClosestCastHit();
        if (fwdHit != null) {
            if (fwdHit.body && fwdHit.body.body.getMotionType(fwdHit.body.index) === 2 /* PhysicsMotionType.DYNAMIC */) {
                return -1;
            }
            fwdFrac = fwdHit.fraction;
        }
        // Backoff by keepDistance along horizDir
        const fwdFracAdjusted = Math.max(0, Math.min(1, fwdFrac - this.keepDistance / horizDist));
        if (fwdFracAdjusted <= eps) {
            return -1;
        }
        const fwdEndAdjusted = horizDir.scale(horizDist * fwdFracAdjusted);
        fwdEndAdjusted.addInPlace(elevated);
        // 5. Down-cast: drop from forward position to find walkable landing
        const downDist = stepClear + 2 * this.keepDistance;
        const downEnd = upUnit.scale(-downDist);
        downEnd.addInPlace(fwdEndAdjusted);
        this._castWithCollectors(fwdEndAdjusted, downEnd, this._castCollector);
        const downHit = this._getClosestCastHit();
        if (downHit == null) {
            // No ground found within reach: stepping into the void (e.g., over a fence). Reject.
            return -1;
        }
        if (downHit.body == null) {
            return -1;
        }
        const landingMotion = downHit.body.body.getMotionType(downHit.body.index);
        if (landingMotion === 2 /* PhysicsMotionType.DYNAMIC */) {
            return -1;
        }
        const maxSlopeCosEps = 0.1;
        const landingNormalDotUp = downHit.normal.dot(upUnit);
        if (landingNormalDotUp < Math.max(this.maxSlopeCosine, maxSlopeCosEps)) {
            return -1;
        }
        // Landing position = downStart - upUnit * (downFrac * downDist - keepDistance)
        const landingDrop = downHit.fraction * downDist - this.keepDistance;
        const landingPos = TmpVectors.Vector3[0];
        upUnit.scaleToRef(-landingDrop, landingPos);
        landingPos.addInPlace(fwdEndAdjusted);
        // Thin-wall guard: landing must be measurably higher than where we started.
        const landingDelta = TmpVectors.Vector3[1];
        landingPos.subtractToRef(this._position, landingDelta);
        const heightDelta = landingDelta.dot(upUnit);
        if (heightDelta < eps) {
            return -1;
        }
        // 6. Snapshot manifold, refresh at landing, validate no unacceptable penetration
        const savedManifold = this._stepUpSavedManifold;
        savedManifold.length = this._manifold.length;
        for (let i = 0; i < this._manifold.length; i++) {
            savedManifold[i] = this._manifold[i];
        }
        this._refreshManifoldAtPosition(landingPos);
        const maxSlope = Math.max(this.maxSlopeCosine, maxSlopeCosEps);
        for (let i = 0; i < this._manifold.length; i++) {
            const c = this._manifold[i];
            if (c.normal.dot(upUnit) < maxSlope && c.distance < -this.keepDistance) {
                // Penetrating a non-walkable surface at landing — reject and restore manifold
                this._manifold.length = savedManifold.length;
                for (let j = 0; j < savedManifold.length; j++) {
                    this._manifold[j] = savedManifold[j];
                }
                return -1;
            }
        }
        // 7. Commit
        const displacement = landingPos.subtract(this._position);
        this._lastDisplacement.copyFrom(displacement);
        this._position.copyFrom(landingPos);
        return remainingTime * fwdFracAdjusted;
    }
    _resolveContacts(deltaTime, gravity) {
        const eps = 1e-12;
        //<todo object interactions out
        for (let i = 0; i < this._manifold.length; i++) {
            const contact = this._manifold[i];
            const bodyB = this._manifold[i].bodyB;
            //<todo test if bodyB is another character with a proxy body
            // Skip fixed or keyframed bodies as we won't apply impulses to them
            if (bodyB.body.getMotionType(bodyB.index) != 2 /* PhysicsMotionType.DYNAMIC */) {
                continue;
            }
            // Calculate and apply impulse on contacted body
            {
                //<todo input/output for callbacks
                let inputObjectMassInv;
                let inputObjectImpulse;
                let outputObjectImpulse = Vector3.Zero();
                const outputImpulsePosition = contact.position;
                // Calculate relative normal velocity of the contact point in the contacted body
                const pointRelVel = this._tmpVecs[19];
                this._getPointVelocityToRef(bodyB, contact.position, pointRelVel);
                pointRelVel.subtractInPlace(this._velocity);
                const inputProjectedVelocity = pointRelVel.dot(contact.normal);
                const dampFactor = 0.9;
                // Change velocity
                let deltaVelocity = -inputProjectedVelocity * dampFactor;
                // Apply an extra impulse if the collision is actually penetrating
                if (contact.distance < 0) {
                    const recoveryTau = 0.4;
                    deltaVelocity += (contact.distance * recoveryTau) / deltaTime;
                }
                // Apply impulse if required to keep bodies apart
                if (deltaVelocity < 0) {
                    //  Calculate the impulse magnitude
                    const invInertia = this._getInverseInertiaWorld(bodyB);
                    const comWorld = this._tmpVecs[15];
                    this._getComWorldToRef(bodyB, comWorld);
                    const r = this._tmpVecs[16];
                    contact.position.subtractToRef(comWorld, r);
                    const jacAng = this._tmpVecs[17];
                    Vector3.CrossToRef(r, contact.normal, jacAng);
                    const rc = this._tmpVecs[18];
                    Vector3.TransformNormalToRef(jacAng, invInertia, rc);
                    inputObjectMassInv = rc.dot(jacAng) + this._getInvMass(bodyB);
                    inputObjectImpulse = deltaVelocity / inputObjectMassInv;
                    // Clamp impulse magnitude if required and apply it to the normal direction
                    const maxPushImpulse = -this.characterStrength * deltaTime;
                    if (inputObjectImpulse < maxPushImpulse) {
                        inputObjectImpulse = maxPushImpulse;
                    }
                    outputObjectImpulse = contact.normal.scale(inputObjectImpulse);
                }
                // Add gravity
                {
                    // Calculate effect of gravity on the velocity of the character in the contact normal direction
                    let relVelN = contact.normal.dot(gravity.scale(deltaTime));
                    // If it is a separating contact subtract the separation velocity
                    if (inputProjectedVelocity < 0) {
                        relVelN -= inputProjectedVelocity;
                    }
                    // If the resulting velocity is negative an impulse is applied to stop the character from falling into
                    // the contacted body
                    if (relVelN < -eps) {
                        outputObjectImpulse.addInPlace(contact.normal.scale(this.characterMass * relVelN));
                    }
                }
                //<todo Fire callback to allow user to change impulse + use the info / play sounds
                const triggerCollisionInfo = {
                    collider: bodyB.body,
                    colliderIndex: bodyB.index,
                    impulse: outputObjectImpulse,
                    impulsePosition: outputImpulsePosition,
                };
                this.onTriggerCollisionObservable.notifyObservers(triggerCollisionInfo);
                bodyB.body.applyImpulse(outputObjectImpulse, outputImpulsePosition, bodyB.index);
            }
        }
    }
    _getInverseInertiaWorld(body) {
        const mp = body.body.getMassProperties(body.index);
        if (!mp.inertia || !mp.inertiaOrientation) {
            return Matrix.IdentityReadOnly;
        }
        const invOrientation = Matrix.FromQuaternionToRef(mp.inertiaOrientation, TmpVectors.Matrix[0]).invert();
        const it = TmpVectors.Matrix[1];
        const ir = invOrientation.getRowToRef(0, TmpVectors.Vector4[0]);
        it.setRowFromFloats(0, mp.inertia.x * ir.x, mp.inertia.x * ir.y, mp.inertia.x * ir.z, 0);
        invOrientation.getRowToRef(1, ir);
        it.setRowFromFloats(1, mp.inertia.y * ir.x, mp.inertia.y * ir.y, mp.inertia.y * ir.z, 0);
        invOrientation.getRowToRef(2, ir);
        it.setRowFromFloats(2, mp.inertia.z * ir.x, mp.inertia.z * ir.y, mp.inertia.z * ir.z, 0);
        invOrientation.multiplyToRef(it, this._tmpMatrix);
        return this._tmpMatrix;
    }
    _getComWorldToRef(body, result) {
        const mp = body.body.getMassProperties(body.index);
        Vector3.TransformCoordinatesToRef(mp.centerOfMass, body.body.transformNode.getWorldMatrix(), result);
    }
    _getInvMass(body) {
        return 1 / body.body.getMassProperties(body.index).mass;
    }
    _integrateManifolds(deltaTime, gravity) {
        const hk = this._scene.getPhysicsEngine().getPhysicsPlugin();
        const epsSqrd = 1e-8;
        let newVelocity = Vector3.Zero();
        let remainingTime = deltaTime;
        // Snapshot of the input velocity, used to preserve user intent if a step-up succeeds
        // and the loop exits without running another full solver pass.
        const inputVelocity = this._velocity;
        let didStepUp = false;
        // Make sure that contact with bodies that have been removed since the call to checkSupport() are removed from the
        // manifold
        this._validateManifold();
        for (let iter = 0; iter < this.maxCastIterations && remainingTime > 1e-5; iter++) {
            this._castWithCollectors(this._position, this._position.add(this._lastDisplacement), this._castCollector, this._startCollector);
            const updateResult = this._updateManifold(this._startCollector, this._castCollector, this._lastDisplacement);
            // Create surface constraints from the manifold contacts.
            const constraints = this._createConstraintsFromManifold(deltaTime, deltaTime - remainingTime);
            const maxSurfaceVelocity = this._tmpVecs[3];
            maxSurfaceVelocity.set(this.maxCharacterSpeedForSolver, this.maxCharacterSpeedForSolver, this.maxCharacterSpeedForSolver);
            const minDeltaTime = this._velocity.lengthSquared() == 0 ? 0.0 : (0.5 * this.keepDistance) / this._velocity.length();
            const solveResults = this._simplexSolverSolve(constraints, this._velocity, remainingTime, minDeltaTime, this.up, maxSurfaceVelocity);
            const newDisplacement = solveResults.position;
            const solverDeltaTime = solveResults.deltaTime;
            newVelocity = solveResults.velocity;
            // Attempt step-up at most once per integrate() call when blocked by a vertical-ish obstacle.
            if (!didStepUp && this.maxStepHeight > 0) {
                const timeConsumed = this._tryStepUp(remainingTime, inputVelocity, solveResults, constraints);
                if (timeConsumed >= 0) {
                    remainingTime -= timeConsumed;
                    // Preserve original input velocity so the final `_velocity` reflects user intent
                    // even if the loop exits without another solver pass.
                    newVelocity = inputVelocity;
                    didStepUp = true;
                    // Skip the normal contact resolution / recast / integrate-position block:
                    // step-up is a teleport that already updated position, manifold and lastDisplacement.
                    continue;
                }
            }
            this._resolveContacts(deltaTime, gravity);
            let newContactIndex = -1;
            // todo if (updateResult == hit multiple bodies) ... cast again
            // If castCollector had hits on different bodies (so we're not sure if some non-closest body could be in our way) OR
            // the simplex has given an output direction different from the cast guess
            // we re-cast to check we can move there. There is no need to get the start points again.
            if (updateResult != 0 || (newDisplacement.lengthSquared() > epsSqrd && !this._lastDisplacement.equalsWithEpsilon(newDisplacement, this._displacementEps))) {
                this._castWithCollectors(this._position, this._position.add(newDisplacement), this._castCollector, this._startCollector);
                const hknp = hk._hknp;
                const numCastHits = hknp.HP_QueryCollector_GetNumHits(this._castCollector)[1];
                // Find the first contact that isn't already in the manifold
                if (numCastHits > 0) {
                    //<todo sortHits()
                    for (let i = 0; i < numCastHits; i++) {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const [fraction, _hitLocal, hitWorld] = hknp.HP_QueryCollector_GetShapeCastResult(this._castCollector, i)[1];
                        const newContact = ContactFromCast(hk, hitWorld, newDisplacement, fraction, this.keepDistance);
                        if (this._findContact(newContact, this._manifold, 0.1) == -1) {
                            //<todo fireContactAdded
                            newContactIndex = this._manifold.length;
                            this._manifold.push(newContact);
                            //<todo updateTriggersSeen()
                            break;
                        }
                    }
                }
            }
            if (newContactIndex >= 0) {
                const newContact = this._manifold[newContactIndex];
                const displacementLengthInv = 1.0 / newDisplacement.length();
                const angleBetweenMovementAndSurface = newDisplacement.dot(newContact.normal) * displacementLengthInv;
                const keepDistanceAlongMovement = this.keepDistance / -angleBetweenMovementAndSurface;
                const distance = newContact.fraction;
                let fraction = distance - keepDistanceAlongMovement * displacementLengthInv;
                fraction = Math.min(Math.max(fraction, 0.0), 1.0);
                const displacement = newDisplacement.scale(fraction);
                this._position.addInPlace(displacement);
                remainingTime -= solverDeltaTime * fraction;
            }
            else {
                this._position.addInPlace(newDisplacement);
                remainingTime -= solverDeltaTime;
            }
            this._lastDisplacement.copyFrom(newDisplacement);
        }
        this._velocity.copyFrom(newVelocity);
        this._transformNode.position.copyFrom(this._position);
    }
    /**
     * Move the character with collisions
     * @param displacement defines the requested displacement vector
     */
    moveWithCollisions(displacement) {
        if (this._scene.deltaTime == undefined) {
            return;
        }
        const deltaTime = this._scene.deltaTime / 1000.0;
        const invDeltaTime = 1 / deltaTime;
        displacement.scaleToRef(1 / deltaTime, this._velocity);
        this._lastDisplacement.copyFrom(displacement);
        this._lastVelocity.copyFrom(this._velocity);
        this._lastInvDeltaTime = invDeltaTime;
        this._integrateManifolds(deltaTime, Vector3.ZeroReadOnly);
    }
    /**
     * Update internal state. Must be called once per frame
     * @param deltaTime frame delta time in seconds. When using scene.deltaTime divide by 1000.0
     * @param surfaceInfo surface information returned by checkSupport
     * @param gravity gravity applied to the character. Can be different that world gravity
     */
    integrate(deltaTime, surfaceInfo, gravity) {
        const invDeltaTime = 1 / deltaTime;
        const remainingTime = deltaTime;
        // Choose the first cast direction.  If velocity hasn't changed from the previous integrate, guess that the
        // displacement will be the same as last integrate, scaled by relative step length.  Otherwise, guess based
        // on current velocity.
        {
            const tolerance = this._displacementEps * invDeltaTime;
            if (this._velocity.equalsWithEpsilon(this._lastVelocity, tolerance)) {
                this._lastDisplacement.scaleInPlace(remainingTime * this._lastInvDeltaTime);
            }
            else {
                const displacementVelocity = this._velocity;
                if (surfaceInfo.supportedState == 2 /* CharacterSupportedState.SUPPORTED */) {
                    const relativeVelocity = this._tmpVecs[28];
                    this._velocity.subtractToRef(surfaceInfo.averageSurfaceVelocity, relativeVelocity);
                    const normalDotVelocity = surfaceInfo.averageSurfaceNormal.dot(relativeVelocity);
                    if (normalDotVelocity < 0) {
                        relativeVelocity.subtractInPlace(surfaceInfo.averageSurfaceNormal.scale(normalDotVelocity));
                        displacementVelocity.copyFrom(relativeVelocity);
                        displacementVelocity.addInPlace(surfaceInfo.averageSurfaceVelocity);
                    }
                }
                this._lastDisplacement.copyFrom(displacementVelocity);
                this._lastDisplacement.scaleInPlace(remainingTime);
            }
            this._lastVelocity.copyFrom(this._velocity);
            this._lastInvDeltaTime = invDeltaTime;
        }
        this._integrateManifolds(deltaTime, gravity);
    }
    /**
     * Helper function to calculate velocity based on surface informations and current velocity state and target
     * @param deltaTime frame delta time in seconds. When using scene.deltaTime divide by 1000.0
     * @param forwardWorld character forward in world coordinates
     * @param surfaceNormal surface normal direction
     * @param currentVelocity current velocity
     * @param surfaceVelocity velocity induced by the surface
     * @param desiredVelocity desired character velocity
     * @param upWorld up vector in world space
     * @param result resulting velocity vector
     * @returns boolean true if result has been computed
     */
    calculateMovementToRef(deltaTime, forwardWorld, surfaceNormal, currentVelocity, surfaceVelocity, desiredVelocity, upWorld, result) {
        const eps = 1e-5;
        let binorm = forwardWorld.cross(upWorld);
        if (binorm.lengthSquared() < eps) {
            return false;
        }
        binorm.normalize();
        const tangent = binorm.cross(surfaceNormal);
        tangent.normalize();
        binorm = tangent.cross(surfaceNormal);
        binorm.normalize();
        const surfaceFrame = Matrix.FromValues(tangent.x, tangent.y, tangent.z, 0, binorm.x, binorm.y, binorm.z, 0, surfaceNormal.x, surfaceNormal.y, surfaceNormal.z, 0, 0, 0, 0, 1);
        const invSurfaceFrame = surfaceFrame.clone().invert();
        currentVelocity.subtractToRef(surfaceVelocity, this._tmpVecs[29]);
        const relative = this._tmpVecs[30];
        Vector3.TransformNormalToRef(this._tmpVecs[29], invSurfaceFrame, relative);
        const sideVec = upWorld.cross(forwardWorld);
        const fwd = desiredVelocity.dot(forwardWorld);
        const side = desiredVelocity.dot(sideVec);
        const len = desiredVelocity.length();
        const desiredVelocitySF = this._tmpVecs[4];
        desiredVelocitySF.set(-fwd, side, 0);
        desiredVelocitySF.normalize();
        desiredVelocitySF.scaleInPlace(len);
        const diff = this._tmpVecs[5];
        desiredVelocitySF.subtractToRef(relative, diff);
        // Clamp it by maxAcceleration and limit it by gain.
        {
            const lenSq = diff.lengthSquared();
            const maxVelocityDelta = this.maxAcceleration * deltaTime;
            let tmp;
            if (lenSq * this.acceleration * this.acceleration > maxVelocityDelta * maxVelocityDelta) {
                tmp = maxVelocityDelta / Math.sqrt(lenSq);
            }
            else {
                tmp = this.acceleration;
            }
            diff.scaleInPlace(tmp);
        }
        relative.addInPlace(diff);
        // Transform back to world space and apply
        Vector3.TransformNormalToRef(relative, surfaceFrame, result);
        // Add back in the surface velocity
        result.addInPlace(surfaceVelocity);
        return true;
    }
    /**
     * Helper function to calculate velocity based on surface informations and current velocity state and target
     * @param deltaTime frame delta time in seconds. When using scene.deltaTime divide by 1000.0
     * @param forwardWorld character forward in world coordinates
     * @param surfaceNormal surface normal direction
     * @param currentVelocity current velocity
     * @param surfaceVelocity velocity induced by the surface
     * @param desiredVelocity desired character velocity
     * @param upWorld up vector in world space
     * @returns a new velocity vector
     */
    calculateMovement(deltaTime, forwardWorld, surfaceNormal, currentVelocity, surfaceVelocity, desiredVelocity, upWorld) {
        const result = new Vector3(0, 0, 0);
        this.calculateMovementToRef(deltaTime, forwardWorld, surfaceNormal, currentVelocity, surfaceVelocity, desiredVelocity, upWorld, result);
        return result;
    }
}
//# sourceMappingURL=characterController.js.map