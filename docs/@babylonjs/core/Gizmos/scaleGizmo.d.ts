import { type Observer, Observable } from "../Misc/observable.js";
import { type Nullable } from "../types.js";
import { type Quaternion } from "../Maths/math.vector.pure.js";
import { type AbstractMesh } from "../Meshes/abstractMesh.js";
import { type GizmoAnchorPoint, type GizmoAxisCache, type IGizmo, GizmoCoordinatesMode, Gizmo } from "./gizmo.js";
import { type IAxisScaleGizmo, AxisScaleGizmo } from "./axisScaleGizmo.js";
import { UtilityLayerRenderer } from "../Rendering/utilityLayerRenderer.js";
import { type Mesh } from "../Meshes/mesh.js";
import { type Node } from "../node.js";
import { type PointerInfo } from "../Events/pointerEvents.js";
import { StandardMaterial } from "../Materials/standardMaterial.pure.js";
import { type GizmoManager } from "./gizmoManager.js";
import { type TransformNode } from "../Meshes/transformNode.js";
import { type DragEvent, type DragStartEndEvent } from "../Behaviors/Meshes/pointerDragEvents.js";
/**
 * Interface for scale gizmo
 */
export interface IScaleGizmo extends IGizmo {
    /** True when the mouse pointer is dragging a gizmo mesh */
    readonly isDragging: boolean;
    /** Internal gizmo used for interactions on the x axis */
    xGizmo: IAxisScaleGizmo;
    /** Internal gizmo used for interactions on the y axis */
    yGizmo: IAxisScaleGizmo;
    /** Internal gizmo used for interactions on the z axis */
    zGizmo: IAxisScaleGizmo;
    /** Internal gizmo used to scale all axis equally*/
    uniformScaleGizmo: IAxisScaleGizmo;
    /** Fires an event when any of it's sub gizmos are dragged */
    onDragStartObservable: Observable<DragStartEndEvent>;
    /** Fires an event when any of it's sub gizmos are being dragged */
    onDragObservable: Observable<DragEvent>;
    /** Fires an event when any of it's sub gizmos are released from dragging */
    onDragEndObservable: Observable<DragStartEndEvent>;
    /** Drag distance in babylon units that the gizmo will snap to when dragged */
    snapDistance: number;
    /** Incremental snap scaling. When true, with a snapDistance of 0.1, scaling will be 1.1,1.2,1.3 instead of, when false: 1.1,1.21,1.33,... */
    incrementalSnap: boolean;
    /** Sensitivity factor for dragging */
    sensitivity: number;
    /**
     * Builds Gizmo Axis Cache to enable features such as hover state preservation and graying out other axis during manipulation
     * @param mesh Axis gizmo mesh
     * @param cache Gizmo axis definition used for reactive gizmo UI
     */
    addToAxisCache(mesh: Mesh, cache: GizmoAxisCache): void;
    /**
     * Force release the drag action by code
     */
    releaseDrag(): void;
    /** Default material used to render when gizmo is not disabled or hovered */
    coloredMaterial: StandardMaterial;
    /** Material used to render when gizmo is hovered with mouse*/
    hoverMaterial: StandardMaterial;
    /** Material used to render when gizmo is disabled. typically grey.*/
    disableMaterial: StandardMaterial;
}
/**
 * Additional options for the scale gizmo
 */
export interface ScaleGizmoOptions {
    /**
     * Additional transform applied to the gizmo.
     * @See Gizmo.additionalTransformNode for more detail
     */
    additionalTransformNode?: TransformNode;
}
/**
 * Gizmo that enables scaling a mesh along 3 axis
 */
export declare class ScaleGizmo extends Gizmo implements IScaleGizmo {
    /**
     * Internal gizmo used for interactions on the x axis
     */
    xGizmo: IAxisScaleGizmo;
    /**
     * Internal gizmo used for interactions on the y axis
     */
    yGizmo: IAxisScaleGizmo;
    /**
     * Internal gizmo used for interactions on the z axis
     */
    zGizmo: IAxisScaleGizmo;
    /**
     * Internal gizmo used to scale all axis equally
     */
    uniformScaleGizmo: IAxisScaleGizmo;
    protected _meshAttached: Nullable<AbstractMesh>;
    protected _nodeAttached: Nullable<Node>;
    protected _snapDistance: number;
    protected _incrementalSnap: boolean;
    protected _uniformScalingMesh: Mesh;
    protected _octahedron: Mesh;
    protected _sensitivity: number;
    protected _coloredMaterial: StandardMaterial;
    protected _hoverMaterial: StandardMaterial;
    protected _disableMaterial: StandardMaterial;
    protected _observables: Observer<PointerInfo>[];
    /** Node Caching for quick lookup */
    protected _gizmoAxisCache: Map<Mesh, GizmoAxisCache>;
    /** Default material used to render when gizmo is not disabled or hovered */
    get coloredMaterial(): StandardMaterial;
    /** Material used to render when gizmo is hovered with mouse*/
    get hoverMaterial(): StandardMaterial;
    /** Material used to render when gizmo is disabled. typically grey.*/
    get disableMaterial(): StandardMaterial;
    /** Fires an event when any of it's sub gizmos are dragged */
    onDragStartObservable: Observable<DragStartEndEvent>;
    /** Fires an event when any of it's sub gizmos are being dragged */
    onDragObservable: Observable<DragEvent>;
    /** Fires an event when any of it's sub gizmos are released from dragging */
    onDragEndObservable: Observable<DragStartEndEvent>;
    get attachedMesh(): Nullable<AbstractMesh>;
    set attachedMesh(mesh: Nullable<AbstractMesh>);
    get attachedNode(): Nullable<Node>;
    set attachedNode(node: Nullable<Node>);
    set updateScale(value: boolean);
    get updateScale(): boolean;
    /**
     * True when the mouse pointer is hovering a gizmo mesh
     */
    get isHovered(): boolean;
    /**
     * True when the mouse pointer is dragging a gizmo mesh
     */
    get isDragging(): boolean;
    get additionalTransformNode(): TransformNode | undefined;
    set additionalTransformNode(transformNode: TransformNode | undefined);
    /**
     * Creates a ScaleGizmo
     * @param gizmoLayer The utility layer the gizmo will be added to
     * @param thickness display gizmo axis thickness
     * @param gizmoManager
     * @param options More options
     */
    constructor(gizmoLayer?: UtilityLayerRenderer, thickness?: number, gizmoManager?: GizmoManager, options?: ScaleGizmoOptions);
    /**
     * @internal
     * Create Geometry for Gizmo
     */
    protected _createUniformScaleMesh(): AxisScaleGizmo;
    set updateGizmoRotationToMatchAttachedMesh(value: boolean);
    get updateGizmoRotationToMatchAttachedMesh(): boolean;
    set anchorPoint(value: GizmoAnchorPoint);
    get anchorPoint(): GizmoAnchorPoint;
    /**
     * Orientation that the gizmo will be displayed with.
     * When set null, default value will be used (Quaternion(0, 0, 0, 1))
     */
    get customRotationQuaternion(): Nullable<Quaternion>;
    set customRotationQuaternion(customRotationQuaternion: Nullable<Quaternion>);
    /**
     * Set the coordinate system to use. By default it's local.
     * But it's possible for a user to tweak so its local for translation and world for rotation.
     * In that case, setting the coordinate system will change `updateGizmoRotationToMatchAttachedMesh` and `updateGizmoPositionToMatchAttachedMesh`
     */
    set coordinatesMode(coordinatesMode: GizmoCoordinatesMode);
    /**
     * Drag distance in babylon units that the gizmo will snap to when dragged (Default: 0)
     */
    set snapDistance(value: number);
    get snapDistance(): number;
    /**
     * Incremental snap scaling (default is false). When true, with a snapDistance of 0.1, scaling will be 1.1,1.2,1.3 instead of, when false: 1.1,1.21,1.33,...
     */
    set incrementalSnap(value: boolean);
    get incrementalSnap(): boolean;
    /**
     * Ratio for the scale of the gizmo (Default: 1)
     */
    set scaleRatio(value: number);
    get scaleRatio(): number;
    /**
     * Sensitivity factor for dragging (Default: 1)
     */
    set sensitivity(value: number);
    get sensitivity(): number;
    /**
     * Builds Gizmo Axis Cache to enable features such as hover state preservation and graying out other axis during manipulation
     * @param mesh Axis gizmo mesh
     * @param cache Gizmo axis definition used for reactive gizmo UI
     */
    addToAxisCache(mesh: Mesh, cache: GizmoAxisCache): void;
    /**
     * Get the cache set with addToAxisCache for a specific mesh
     * @param mesh Axis gizmo mesh
     * @returns Gizmo axis definition used for reactive gizmo UI
     */
    getAxisCache(mesh: Mesh): GizmoAxisCache | undefined;
    /**
     * Force release the drag action by code
     */
    releaseDrag(): void;
    /**
     * Disposes of the gizmo
     */
    dispose(): void;
}
