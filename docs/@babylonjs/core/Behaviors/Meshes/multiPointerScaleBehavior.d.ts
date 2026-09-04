import { type Mesh } from "../../Meshes/mesh.js";
import { type Behavior } from "../behavior.js";
import { type Nullable } from "../../types.js";
/**
 * A behavior that when attached to a mesh will allow the mesh to be scaled
 */
export declare class MultiPointerScaleBehavior implements Behavior<Mesh> {
    private _dragBehaviorA;
    private _dragBehaviorB;
    private _startDistance;
    private _initialScale;
    private _targetScale;
    private _ownerNode;
    private _sceneRenderObserver;
    /**
     * Attached node of this behavior
     */
    get attachedNode(): Nullable<Mesh>;
    /**
     * Instantiate a new behavior that when attached to a mesh will allow the mesh to be scaled
     */
    constructor();
    /**
     *  The name of the behavior
     */
    get name(): string;
    /**
     *  Initializes the behavior
     */
    init(): void;
    private _getCurrentDistance;
    /**
     * Attaches the scale behavior the passed in mesh
     * @param ownerNode The mesh that will be scaled around once attached
     */
    attach(ownerNode: Mesh): void;
    /**
     *  Detaches the behavior from the mesh
     */
    detach(): void;
}
