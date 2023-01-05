import type { Observer } from "../Misc/observable";
import { Observable } from "../Misc/observable";
import type { Nullable } from "../types";
import type { AbstractMesh } from "../Meshes/abstractMesh";
import type { GizmoAxisCache, IGizmo } from "./gizmo";
import { Gizmo } from "./gizmo";
import type { IAxisScaleGizmo } from "./axisScaleGizmo";
import { AxisScaleGizmo } from "./axisScaleGizmo";
import { UtilityLayerRenderer } from "../Rendering/utilityLayerRenderer";
import type { Mesh } from "../Meshes/mesh";
import type { Node } from "../node";
import type { PointerInfo } from "../Events/pointerEvents";
import { StandardMaterial } from "../Materials/standardMaterial";
import type { GizmoManager } from "./gizmoManager";
/**
 * Interface for scale gizmo
 */
export interface IScaleGizmo extends IGizmo {
    /** Internal gizmo used for interactions on the x axis */
    xGizmo: IAxisScaleGizmo;
    /** Internal gizmo used for interactions on the y axis */
    yGizmo: IAxisScaleGizmo;
    /** Internal gizmo used for interactions on the z axis */
    zGizmo: IAxisScaleGizmo;
    /** Internal gizmo used to scale all axis equally*/
    uniformScaleGizmo: IAxisScaleGizmo;
    /** Fires an event when any of it's sub gizmos are dragged */
    onDragStartObservable: Observable<unknown>;
    /** Fires an event when any of it's sub gizmos are released from dragging */
    onDragEndObservable: Observable<unknown>;
    /** Drag distance in babylon units that the gizmo will snap to when dragged */
    snapDistance: number;
    /** Sensitivity factor for dragging */
    sensitivity: number;
    /**
     * Builds Gizmo Axis Cache to enable features such as hover state preservation and graying out other axis during manipulation
     * @param mesh Axis gizmo mesh
     * @param cache Gizmo axis definition used for reactive gizmo UI
     */
    addToAxisCache(mesh: Mesh, cache: GizmoAxisCache): void;
    /** Default material used to render when gizmo is not disabled or hovered */
    coloredMaterial: StandardMaterial;
    /** Material used to render when gizmo is hovered with mouse*/
    hoverMaterial: StandardMaterial;
    /** Material used to render when gizmo is disabled. typically grey.*/
    disableMaterial: StandardMaterial;
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
    onDragStartObservable: Observable<unknown>;
    /** Fires an event when any of it's sub gizmos are released from dragging */
    onDragEndObservable: Observable<unknown>;
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
     * Creates a ScaleGizmo
     * @param gizmoLayer The utility layer the gizmo will be added to
     * @param thickness display gizmo axis thickness
     * @param gizmoManager
     */
    constructor(gizmoLayer?: UtilityLayerRenderer, thickness?: number, gizmoManager?: GizmoManager);
    /** Create Geometry for Gizmo */
    protected _createUniformScaleMesh(): AxisScaleGizmo;
    set updateGizmoRotationToMatchAttachedMesh(value: boolean);
    get updateGizmoRotationToMatchAttachedMesh(): boolean;
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
     * Disposes of the gizmo
     */
    dispose(): void;
}
