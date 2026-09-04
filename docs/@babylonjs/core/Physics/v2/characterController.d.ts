import { Vector3, Matrix } from "../../Maths/math.vector.pure.js";
import { type Scene } from "../../scene.js";
import { type DeepImmutableObject } from "../../types.js";
import { PhysicsBody } from "./physicsBody.js";
import { type PhysicsShape } from "./physicsShape.js";
import { Observable } from "../../Misc/observable.js";
/**
 * Shape properties for the character controller
 */
export interface CharacterShapeOptions {
    /**
     * optional shape used for collision detection
     */
    shape?: PhysicsShape;
    /**
     * capsule height for the capsule shape if no shape is provided
     */
    capsuleHeight?: number;
    /**
     * capsule radius for the capsule shape if no shape is provided
     */
    capsuleRadius?: number;
}
/**
 * Collision event data for the character controller
 */
export interface ICharacterControllerCollisionEvent {
    /**
     * The collider physics body
     */
    collider: PhysicsBody;
    /**
     * Index of the collider in instances
     */
    colliderIndex: number;
    /**
     * Separation force applied to the collider
     */
    impulse: Vector3;
    /**
     * Position where the impulse is applied
     */
    impulsePosition: Vector3;
}
/**
 * State of the character on the surface
 */
export declare enum CharacterSupportedState {
    UNSUPPORTED = 0,
    SLIDING = 1,
    SUPPORTED = 2
}
/**
 * Surface information computed by checkSupport method
 */
export interface CharacterSurfaceInfo {
    /**
     * Indicates whether the surface is dynamic.
     * A dynamic surface is one that can change its properties over time,
     * such as moving platforms or surfaces that can be affected by external forces.
     * surfaceInfo.supportedState is always CharacterSupportedState.SUPPORTED when isSurfaceDynamic is true.
     */
    isSurfaceDynamic: boolean;
    /**
     * The supported state of the character on the surface.
     */
    supportedState: CharacterSupportedState;
    /**
     * The average normal vector of the surface.
     * This vector is perpendicular to the surface and points outwards.
     */
    averageSurfaceNormal: Vector3;
    /**
     * The average velocity of the surface.
     * This vector represents the speed and direction in which the surface is moving.
     */
    averageSurfaceVelocity: Vector3;
    /**
     * The average angular velocity of the surface.
     */
    averageAngularSurfaceVelocity: Vector3;
}
interface IContact {
    /** @internal */
    position: Vector3;
    /** @internal */
    normal: Vector3;
    /** @internal */
    distance: number;
    /** @internal */
    fraction: number;
    /** @internal */
    bodyB: {
        body: PhysicsBody;
        index: number;
    };
    /** @internal */
    allowedPenetration: number;
}
interface ISurfaceConstraintInfo {
    /** @internal */
    planeNormal: Vector3;
    /** @internal */
    planeDistance: number;
    /** @internal */
    velocity: Vector3;
    /** @internal */
    angularVelocity: Vector3;
    /** @internal */
    staticFriction: number;
    /** @internal */
    extraUpStaticFriction: number;
    /** @internal */
    extraDownStaticFriction: number;
    /** @internal */
    dynamicFriction: number;
    /** @internal */
    priority: number;
}
declare enum SurfaceConstraintInteractionStatus {
    OK = 0,
    FAILURE_3D = 1,
    FAILURE_2D = 2
}
interface ISurfaceConstraintInteraction {
    /** @internal */
    touched: boolean;
    /** @internal */
    stopped: boolean;
    /** @internal */
    surfaceTime: number;
    /** @internal */
    penaltyDistance: number;
    /** @internal */
    status: SurfaceConstraintInteractionStatus;
}
/** @internal */
declare class SimplexSolverOutput {
    /** @internal */
    position: Vector3;
    /** @internal */
    velocity: Vector3;
    /** @internal */
    deltaTime: number;
    /** @internal */
    planeInteractions: ISurfaceConstraintInteraction[];
}
/** @internal */
declare class SimplexSolverActivePlanes {
    /** @internal */
    index: number;
    /** @internal */
    constraint: ISurfaceConstraintInfo;
    /** @internal */
    interaction: ISurfaceConstraintInteraction;
    /** @internal */
    copyFrom(other: SimplexSolverActivePlanes): void;
}
/** @internal */
declare class SimplexSolverInfo {
    /** @internal */
    supportPlanes: Array<SimplexSolverActivePlanes>;
    /** @internal */
    numSupportPlanes: number;
    /** @internal */
    currentTime: number;
    /** @internal */
    inputConstraints: ISurfaceConstraintInfo[];
    /** @internal */
    outputInteractions: ISurfaceConstraintInteraction[];
    /** @internal */
    getOutput(constraint: ISurfaceConstraintInfo): ISurfaceConstraintInteraction;
}
/**
 * Character controller using physics
 */
export declare class PhysicsCharacterController {
    private _position;
    private _orientation;
    private _velocity;
    private _lastVelocity;
    private _shape;
    private _body;
    private _transformNode;
    private _ownShape;
    private _shapeOptions;
    private _manifold;
    private _stepUpSavedManifold;
    private _lastDisplacement;
    private _contactAngleSensitivity;
    private _lastInvDeltaTime;
    private _scene;
    private _tmpMatrix;
    private _tmpVecs;
    /**
     * minimum distance to make contact
     * default 0.05
     */
    keepDistance: number;
    /**
     * maximum distance to keep contact
     * default 0.1
     */
    keepContactTolerance: number;
    /**
     * maximum number of raycast per integration starp
     * default 10
     */
    maxCastIterations: number;
    /**
     * speed when recovery from penetration
     * default 1.0
     */
    penetrationRecoverySpeed: number;
    /**
     * friction with static surfaces
     * default 0
     */
    staticFriction: number;
    /**
     * friction with dynamic surfaces
     * default 1
     */
    dynamicFriction: number;
    /**
     * cosine value of slope angle that can be climbed
     * computed as `Math.cos(Math.PI * (angleInDegree / 180.0));`
     * default 0.5 (value for a 60deg angle)
     */
    maxSlopeCosine: number;
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
    maxStepHeight: number;
    /**
     * Distance from the body's `position` to the character's foot along `up`.
     * Used by `maxStepHeight` to measure how high a contact sits above the foot.
     * Defaults to half the capsule height passed at construction. Override when
     * supplying a custom collision shape whose center is not at half-height.
     */
    footOffset: number;
    /**
     * character maximum speed
     * default 10
     */
    maxCharacterSpeedForSolver: number;
    /**
     * up vector
     */
    up: Vector3;
    /**
     * Strength when pushing other bodies
     * default 1e38
     */
    characterStrength: number;
    /**
     * Acceleration factor. A value of 1 means reaching max velocity immediately
     */
    acceleration: number;
    /**
     * maximum acceleration in world space coordinate
     */
    maxAcceleration: number;
    /**
     * character mass
     * default 0
     */
    characterMass: number;
    /**
     * Observable for trigger entered and trigger exited events
     */
    onTriggerCollisionObservable: Observable<ICharacterControllerCollisionEvent>;
    private _startCollector;
    private _castCollector;
    private _displacementEps;
    /**
     * instanciate a new characterController
     * @param position Initial position
     * @param characterShapeOptions character physics shape options
     * @param scene Scene
     */
    constructor(position: Vector3, characterShapeOptions: CharacterShapeOptions, scene: Scene);
    /**
     * Dispose the character controller
     */
    dispose(): void;
    /**
     * Get shape used for collision
     */
    get shape(): PhysicsShape;
    /**
     * Set shape used for collision
     */
    set shape(value: PhysicsShape);
    /**
     * Get the shape options used to build the collision shape
     */
    get shapeOptions(): CharacterShapeOptions;
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
    setShapeOptions(characterShapeOptions: CharacterShapeOptions, preserveFootPosition?: boolean): void;
    /**
     * Character position
     * @returns Character position
     */
    getPosition(): Vector3;
    /**
     * Teleport character to a new position
     * @param position new position
     */
    setPosition(position: Vector3): void;
    /**
     * Character velocity
     * @returns Character velocity vector
     */
    getVelocity(): Vector3;
    /**
     * Set velocity vector
     * @param velocity vector
     */
    setVelocity(velocity: Vector3): void;
    protected _validateManifold(): void;
    private _getPointVelocityToRef;
    protected _compareContacts(contactA: IContact, contactB: IContact): number;
    protected _findContact(referenceContact: IContact, contactList: IContact[], threshold: number): number;
    protected _updateManifold(startCollector: any, castCollector: any, castPath: Vector3): number;
    protected _bodyPositionTracking: Map<any, any>;
    protected _createSurfaceConstraint(dt: number, contact: IContact, timeTravelled: number): ISurfaceConstraintInfo;
    protected _addMaxSlopePlane(maxSlopeCos: number, up: Vector3, index: number, constraints: ISurfaceConstraintInfo[], allowedPenetration: number): boolean;
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
    protected _addStepHeightWallPlane(constraints: ISurfaceConstraintInfo[], contact: IContact, index: number, allowedPenetration: number): boolean;
    protected _resolveConstraintPenetration(constraint: ISurfaceConstraintInfo, penetrationRecoverySpeed: number): void;
    protected _createConstraintsFromManifold(dt: number, timeTravelled: number): ISurfaceConstraintInfo[];
    protected _simplexSolverSortInfo(info: SimplexSolverInfo): void;
    protected _simplexSolverSolve1d(info: SimplexSolverInfo, sci: ISurfaceConstraintInfo, velocityIn: Vector3, velocityOut: Vector3): void;
    protected _simplexSolverSolveTest1d(sci: ISurfaceConstraintInfo, velocityIn: Vector3): boolean;
    protected _simplexSolverSolve2d(info: SimplexSolverInfo, maxSurfaceVelocity: Vector3, sci0: ISurfaceConstraintInfo, sci1: ISurfaceConstraintInfo, velocityIn: Vector3, velocityOut: Vector3): void;
    protected _simplexSolverSolve3d(info: SimplexSolverInfo, maxSurfaceVelocity: Vector3, sci0: ISurfaceConstraintInfo, sci1: ISurfaceConstraintInfo, sci2: ISurfaceConstraintInfo, allowResort: boolean, velocityIn: Vector3, velocityOut: Vector3): void;
    protected _simplexSolverExamineActivePlanes(info: SimplexSolverInfo, maxSurfaceVelocity: Vector3, velocityIn: Vector3, velocityOut: Vector3): void;
    protected _simplexSolverSolve(constraints: ISurfaceConstraintInfo[], velocity: Vector3, deltaTime: number, minDeltaTime: number, up: Vector3, maxSurfaceVelocity: Vector3): SimplexSolverOutput;
    /**
     * Compute a CharacterSurfaceInfo from current state and a direction
     * @param deltaTime frame delta time in seconds. When using scene.deltaTime divide by 1000.0
     * @param direction direction to check, usually gravity direction
     * @returns a CharacterSurfaceInfo object
     */
    checkSupport(deltaTime: number, direction: Vector3): CharacterSurfaceInfo;
    /**
     * Compute a CharacterSurfaceInfo from current state and a direction
     * @param deltaTime frame delta time in seconds. When using scene.deltaTime divide by 1000.0
     * @param direction direction to check, usually gravity direction
     * @param surfaceInfo output for surface info
     */
    checkSupportToRef(deltaTime: number, direction: Vector3, surfaceInfo: CharacterSurfaceInfo): void;
    protected _castWithCollectors(startPos: Vector3, endPos: Vector3, castCollector: any, startCollector?: any): void;
    /**
     * Rebuild the contact manifold from a proximity query at the given position.
     * Used by step-up to validate a candidate landing without the merging logic of `_updateManifold`,
     * which is not suited to a zero-length cast.
     * @param position position at which to run the proximity query
     */
    protected _refreshManifoldAtPosition(position: Vector3): void;
    /**
     * Search the simplex solver output for a constraint that blocks horizontal motion:
     * touched by the solver, non-walkable along `up`, and opposing the requested horizontal direction.
     * @param simplexOutput output of `_simplexSolverSolve`
     * @param constraints constraint array passed to the solver
     * @param horizDir normalized horizontal direction of intent
     * @returns the index of the first matching constraint, or -1
     */
    protected _findBlockingConstraintIndex(simplexOutput: SimplexSolverOutput, constraints: ISurfaceConstraintInfo[], horizDir: Vector3): number;
    /**
     * Iterate hits in the cast collector to find the closest one.
     * @returns object with fraction, normal, body and index of the closest hit; null if there were no hits
     */
    protected _getClosestCastHit(): {
        fraction: number;
        normal: Vector3;
        body: {
            body: PhysicsBody;
            index: number;
        } | null;
    } | null;
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
    protected _tryStepUp(remainingTime: number, inputVelocity: Vector3, simplexOutput: SimplexSolverOutput, constraints: ISurfaceConstraintInfo[]): number;
    protected _resolveContacts(deltaTime: number, gravity: Vector3): void;
    protected _getInverseInertiaWorld(body: {
        body: PhysicsBody;
        index: number;
    }): DeepImmutableObject<Matrix>;
    protected _getComWorldToRef(body: {
        body: PhysicsBody;
        index: number;
    }, result: Vector3): void;
    protected _getInvMass(body: {
        body: PhysicsBody;
        index: number;
    }): number;
    protected _integrateManifolds(deltaTime: number, gravity: Vector3): void;
    /**
     * Move the character with collisions
     * @param displacement defines the requested displacement vector
     */
    moveWithCollisions(displacement: Vector3): void;
    /**
     * Update internal state. Must be called once per frame
     * @param deltaTime frame delta time in seconds. When using scene.deltaTime divide by 1000.0
     * @param surfaceInfo surface information returned by checkSupport
     * @param gravity gravity applied to the character. Can be different that world gravity
     */
    integrate(deltaTime: number, surfaceInfo: CharacterSurfaceInfo, gravity: Vector3): void;
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
    calculateMovementToRef(deltaTime: number, forwardWorld: Vector3, surfaceNormal: Vector3, currentVelocity: Vector3, surfaceVelocity: Vector3, desiredVelocity: Vector3, upWorld: Vector3, result: Vector3): boolean;
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
    calculateMovement(deltaTime: number, forwardWorld: Vector3, surfaceNormal: Vector3, currentVelocity: Vector3, surfaceVelocity: Vector3, desiredVelocity: Vector3, upWorld: Vector3): Vector3;
}
export {};
