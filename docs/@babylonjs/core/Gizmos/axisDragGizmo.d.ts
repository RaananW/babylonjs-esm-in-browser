import { type Observer, Observable } from "../Misc/observable.js";
import { type Nullable } from "../types.js";
import { type PointerInfo } from "../Events/pointerEvents.js";
import { TransformNode } from "../Meshes/transformNode.pure.js";
import { type Node } from "../node.js";
import { Mesh } from "../Meshes/mesh.pure.js";
import { PointerDragBehavior } from "../Behaviors/Meshes/pointerDragBehavior.js";
import { type IGizmo, Gizmo } from "./gizmo.js";
import { UtilityLayerRenderer } from "../Rendering/utilityLayerRenderer.js";
import { StandardMaterial } from "../Materials/standardMaterial.pure.js";
import { type Scene } from "../scene.js";
import { type PositionGizmo } from "./positionGizmo.js";
import { Color3 } from "../Maths/math.color.pure.js";
import { Vector3 } from "../Maths/math.vector.pure.js";
/**
 * Interface for axis drag gizmo
 */
export interface IAxisDragGizmo extends IGizmo {
    /** Drag behavior responsible for the gizmos dragging interactions */
    dragBehavior: PointerDragBehavior;
    /** Drag distance in babylon units that the gizmo will snap to when dragged */
    snapDistance: number;
    /**
     * Event that fires each time the gizmo snaps to a new location.
     * * snapDistance is the change in distance
     */
    onSnapObservable: Observable<{
        snapDistance: number;
    }>;
    /** If the gizmo is enabled */
    isEnabled: boolean;
    /** Default material used to render when gizmo is not disabled or hovered */
    coloredMaterial: StandardMaterial;
    /** Material used to render when gizmo is hovered with mouse*/
    hoverMaterial: StandardMaterial;
    /** Material used to render when gizmo is disabled. typically grey.*/
    disableMaterial: StandardMaterial;
}
/**
 * Single axis drag gizmo
 */
export declare class AxisDragGizmo extends Gizmo implements IAxisDragGizmo {
    /**
     * Drag behavior responsible for the gizmos dragging interactions
     */
    dragBehavior: PointerDragBehavior;
    protected _pointerObserver: Nullable<Observer<PointerInfo>>;
    /**
     * Drag distance in babylon units that the gizmo will snap to when dragged (Default: 0)
     */
    snapDistance: number;
    /**
     * Event that fires each time the gizmo snaps to a new location.
     * * snapDistance is the change in distance
     */
    onSnapObservable: Observable<{
        snapDistance: number;
    }>;
    protected _isEnabled: boolean;
    protected _parent: Nullable<PositionGizmo>;
    protected _gizmoMesh: Mesh;
    protected _coloredMaterial: StandardMaterial;
    protected _hoverMaterial: StandardMaterial;
    protected _disableMaterial: StandardMaterial;
    protected _dragging: boolean;
    /** Default material used to render when gizmo is not disabled or hovered */
    get coloredMaterial(): StandardMaterial;
    /** Material used to render when gizmo is hovered with mouse*/
    get hoverMaterial(): StandardMaterial;
    /** Material used to render when gizmo is disabled. typically grey.*/
    get disableMaterial(): StandardMaterial;
    /**
     * @internal
     */
    static _CreateArrow(scene: Scene, material: StandardMaterial, thickness?: number, isCollider?: boolean): TransformNode;
    /**
     * @internal
     */
    static _CreateArrowInstance(scene: Scene, arrow: TransformNode): TransformNode;
    /**
     * Creates an AxisDragGizmo
     * @param dragAxis The axis which the gizmo will be able to drag on
     * @param color The color of the gizmo
     * @param gizmoLayer The utility layer the gizmo will be added to
     * @param parent
     * @param thickness display gizmo axis thickness
     * @param hoverColor The color of the gizmo when hovering over and dragging
     * @param disableColor The Color of the gizmo when its disabled
     */
    constructor(dragAxis: Vector3, color?: Color3, gizmoLayer?: UtilityLayerRenderer, parent?: Nullable<PositionGizmo>, thickness?: number, hoverColor?: Color3, disableColor?: Color3);
    protected _attachedNodeChanged(value: Nullable<Node>): void;
    /**
     * If the gizmo is enabled
     */
    set isEnabled(value: boolean);
    get isEnabled(): boolean;
    /**
     * Disposes of the gizmo
     */
    dispose(): void;
}
