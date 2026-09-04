import { type Observer, Observable } from "../Misc/observable.js";
import { type Nullable } from "../types.js";
import { type Quaternion } from "../Maths/math.vector.pure.js";
import { Color3 } from "../Maths/math.color.pure.js";
import { type AbstractMesh } from "../Meshes/abstractMesh.js";
import { type Mesh } from "../Meshes/mesh.js";
import { type GizmoAnchorPoint, type GizmoCoordinatesMode, type GizmoAxisCache, type IGizmo, Gizmo } from "./gizmo.js";
import { type IPlaneRotationGizmo } from "./planeRotationGizmo.pure.js";
import { UtilityLayerRenderer } from "../Rendering/utilityLayerRenderer.js";
import { type Node } from "../node.js";
import { type PointerInfo } from "../Events/pointerEvents.js";
import { type TransformNode } from "../Meshes/transformNode.js";
import { type GizmoManager } from "./gizmoManager.js";
import { type DragEvent, type DragStartEndEvent } from "../Behaviors/Meshes/pointerDragEvents.js";
/**
 * Interface for rotation gizmo
 */
export interface IRotationGizmo extends IGizmo {
    /** True when the mouse pointer is dragging a gizmo mesh */
    readonly isDragging: boolean;
    /** Internal gizmo used for interactions on the x axis */
    xGizmo: IPlaneRotationGizmo;
    /** Internal gizmo used for interactions on the y axis */
    yGizmo: IPlaneRotationGizmo;
    /** Internal gizmo used for interactions on the z axis */
    zGizmo: IPlaneRotationGizmo;
    /** Fires an event when any of it's sub gizmos are dragged */
    onDragStartObservable: Observable<DragStartEndEvent>;
    /** Fires an event when any of it's sub gizmos are being dragged */
    onDragObservable: Observable<DragEvent>;
    /** Fires an event when any of it's sub gizmos are released from dragging */
    onDragEndObservable: Observable<DragStartEndEvent>;
    /** Drag distance in babylon units that the gizmo will snap to when dragged */
    snapDistance: number;
    /** Custom sensitivity value for the drag strength */
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
}
/**
 * Options for each individual plane rotation gizmo contained within RotationGizmo
 * @since 5.0.0
 */
export interface PlaneRotationGizmoOptions {
    /**
     * Color to use for the plane rotation gizmo
     */
    color?: Color3;
}
/**
 * Additional options for each rotation gizmo
 */
export interface RotationGizmoOptions {
    /**
     * When set, the gizmo will always appear the same size no matter where the camera is (default: true)
     */
    updateScale?: boolean;
    /**
     * Specific options for xGizmo
     */
    xOptions?: PlaneRotationGizmoOptions;
    /**
     * Specific options for yGizmo
     */
    yOptions?: PlaneRotationGizmoOptions;
    /**
     * Specific options for zGizmo
     */
    zOptions?: PlaneRotationGizmoOptions;
    /**
     * Additional transform applied to the gizmo.
     * @See Gizmo.additionalTransformNode for more detail
     */
    additionalTransformNode?: TransformNode;
}
/**
 * Gizmo that enables rotating a mesh along 3 axis
 */
export declare class RotationGizmo extends Gizmo implements IRotationGizmo {
    /**
     * Internal gizmo used for interactions on the x axis
     */
    xGizmo: IPlaneRotationGizmo;
    /**
     * Internal gizmo used for interactions on the y axis
     */
    yGizmo: IPlaneRotationGizmo;
    /**
     * Internal gizmo used for interactions on the z axis
     */
    zGizmo: IPlaneRotationGizmo;
    /** Fires an event when any of it's sub gizmos are dragged */
    onDragStartObservable: Observable<DragStartEndEvent>;
    /** Fires an event when any of it's sub gizmos are being dragged */
    onDragObservable: Observable<DragEvent>;
    /** Fires an event when any of it's sub gizmos are released from dragging */
    onDragEndObservable: Observable<DragStartEndEvent>;
    protected _meshAttached: Nullable<AbstractMesh>;
    protected _nodeAttached: Nullable<Node>;
    protected _observables: Observer<PointerInfo>[];
    protected _sensitivity: number;
    /** Node Caching for quick lookup */
    protected _gizmoAxisCache: Map<Mesh, GizmoAxisCache>;
    get attachedMesh(): Nullable<AbstractMesh>;
    set attachedMesh(mesh: Nullable<AbstractMesh>);
    get attachedNode(): Nullable<Node>;
    set attachedNode(node: Nullable<Node>);
    protected _checkBillboardTransform(): void;
    /**
     * Sensitivity factor for dragging (Default: 1)
     */
    set sensitivity(value: number);
    get sensitivity(): number;
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
     * Creates a RotationGizmo
     * @param gizmoLayer The utility layer the gizmo will be added to
     * @param tessellation Amount of tessellation to be used when creating rotation circles
     * @param useEulerRotation Use and update Euler angle instead of quaternion
     * @param thickness display gizmo axis thickness
     * @param gizmoManager Gizmo manager
     * @param options More options
     */
    constructor(gizmoLayer?: UtilityLayerRenderer, tessellation?: number, useEulerRotation?: boolean, thickness?: number, gizmoManager?: GizmoManager, options?: RotationGizmoOptions);
    /**
     * If set the gizmo's rotation will be updated to match the attached mesh each frame (Default: true)
     * NOTE: This is only possible for meshes with uniform scaling, as otherwise it's not possible to decompose the rotation
     */
    set updateGizmoRotationToMatchAttachedMesh(value: boolean);
    get updateGizmoRotationToMatchAttachedMesh(): boolean;
    set updateGizmoPositionToMatchAttachedMesh(value: boolean);
    get updateGizmoPositionToMatchAttachedMesh(): boolean;
    set anchorPoint(value: GizmoAnchorPoint);
    get anchorPoint(): GizmoAnchorPoint;
    /**
     * Set the coordinate system to use. By default it's local.
     * But it's possible for a user to tweak so its local for translation and world for rotation.
     * In that case, setting the coordinate system will change `updateGizmoRotationToMatchAttachedMesh` and `updateGizmoPositionToMatchAttachedMesh`
     */
    set coordinatesMode(coordinatesMode: GizmoCoordinatesMode);
    set updateScale(value: boolean);
    get updateScale(): boolean;
    /**
     * Drag distance in babylon units that the gizmo will snap to when dragged (Default: 0)
     */
    set snapDistance(value: number);
    get snapDistance(): number;
    /**
     * Ratio for the scale of the gizmo (Default: 1)
     */
    set scaleRatio(value: number);
    get scaleRatio(): number;
    /**
     * Orientation that the gizmo will be displayed with.
     * When set null, default value will be used (Quaternion(0, 0, 0, 1))
     */
    get customRotationQuaternion(): Nullable<Quaternion>;
    set customRotationQuaternion(customRotationQuaternion: Nullable<Quaternion>);
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
    /**
     * Disposes of the gizmo
     */
    dispose(): void;
    /**
     * CustomMeshes are not supported by this gizmo
     */
    setCustomMesh(): void;
}
