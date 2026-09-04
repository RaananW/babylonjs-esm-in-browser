import { type Nullable } from "../types.js";
import { Vector3 } from "../Maths/math.vector.pure.js";
import { Mesh } from "../Meshes/mesh.pure.js";
import { type IGizmo, Gizmo } from "./gizmo.js";
import { UtilityLayerRenderer } from "../Rendering/utilityLayerRenderer.js";
import { type Node } from "../node.js";
import { StandardMaterial } from "../Materials/standardMaterial.pure.js";
import { type Light } from "../Lights/light.js";
import { TransformNode } from "../Meshes/transformNode.pure.js";
import { type PointerInfo } from "../Events/pointerEvents.js";
import { type Observer, Observable } from "../Misc/observable.js";
/**
 * Interface for light gizmo
 */
export interface ILightGizmo extends IGizmo {
    /** Event that fires each time the gizmo is clicked */
    onClickedObservable: Observable<Light>;
    /** The light that the gizmo is attached to */
    light: Nullable<Light>;
    /** The material used to render the light gizmo */
    readonly material: StandardMaterial;
}
/**
 * Gizmo that enables viewing a light
 */
export declare class LightGizmo extends Gizmo implements ILightGizmo {
    protected _lightMesh: Mesh;
    protected _material: StandardMaterial;
    protected _cachedPosition: Vector3;
    protected _cachedForward: Vector3;
    protected _attachedMeshParent: TransformNode;
    protected _pointerObserver: Nullable<Observer<PointerInfo>>;
    /**
     * Event that fires each time the gizmo is clicked
     */
    onClickedObservable: Observable<Light>;
    /**
     * Creates a LightGizmo
     * @param gizmoLayer The utility layer the gizmo will be added to
     */
    constructor(gizmoLayer?: UtilityLayerRenderer);
    protected _light: Nullable<Light>;
    /**
     * Override attachedNode because lightgizmo only support attached mesh
     * It will return the attached mesh (if any) and setting an attached node will log
     * a warning
     */
    get attachedNode(): Nullable<Node>;
    set attachedNode(value: Nullable<Node>);
    /**
     * The light that the gizmo is attached to
     */
    set light(light: Nullable<Light>);
    get light(): Nullable<Light>;
    /**
     * Gets the material used to render the light gizmo
     */
    get material(): StandardMaterial;
    /**
     * @internal
     * returns mesh forward
     */
    protected _getMeshForward(): Vector3;
    /**
     * @internal
     * Updates the gizmo to match the attached mesh's position/rotation
     */
    protected _update(): void;
    private static _Scale;
    /**
     * Creates the lines for a light mesh
     * @param levels
     * @param scene
     * @returns the light lines mesh
     */
    private static _CreateLightLines;
    /**
     * Disposes of the light gizmo
     */
    dispose(): void;
    private static _CreateHemisphericLightMesh;
    private static _CreatePointLightMesh;
    private static _CreateSpotLightMesh;
    private static _CreateDirectionalLightMesh;
}
