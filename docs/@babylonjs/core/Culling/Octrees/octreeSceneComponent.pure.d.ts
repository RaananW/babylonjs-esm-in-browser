/** This file must only contain pure code and pure imports */
import { type ISmartArrayLike } from "../../Misc/smartArray.js";
import { Scene } from "../../scene.pure.js";
import { AbstractMesh } from "../../Meshes/abstractMesh.pure.js";
import { Ray } from "../../Culling/ray.pure.js";
import { type Collider } from "../../Collisions/collider.js";
import { type SubMesh } from "../../Meshes/subMesh.pure.js";
/**
 * Defines the octree scene component responsible to manage any octrees
 * in a given scene.
 */
export declare class OctreeSceneComponent {
    /**
     * The component name help to identify the component in the list of scene components.
     */
    readonly name = "Octree";
    /**
     * The scene the component belongs to.
     */
    scene: Scene;
    /**
     * Indicates if the meshes have been checked to make sure they are isEnabled()
     */
    readonly checksIsEnabled = true;
    /**
     * Creates a new instance of the component for the given scene
     * @param scene Defines the scene to register the component in
     */
    constructor(scene?: Scene);
    /**
     * Registers the component in a given scene
     */
    register(): void;
    /**
     * Return the list of active meshes
     * @returns the list of active meshes
     */
    getActiveMeshCandidates(): ISmartArrayLike<AbstractMesh>;
    /**
     * Return the list of active sub meshes
     * @param mesh The mesh to get the candidates sub meshes from
     * @returns the list of active sub meshes
     */
    getActiveSubMeshCandidates(mesh: AbstractMesh): ISmartArrayLike<SubMesh>;
    private _tempRay;
    /**
     * Return the list of sub meshes intersecting with a given local ray
     * @param mesh defines the mesh to find the submesh for
     * @param localRay defines the ray in local space
     * @returns the list of intersecting sub meshes
     */
    getIntersectingSubMeshCandidates(mesh: AbstractMesh, localRay: Ray): ISmartArrayLike<SubMesh>;
    /**
     * Return the list of sub meshes colliding with a collider
     * @param mesh defines the mesh to find the submesh for
     * @param collider defines the collider to evaluate the collision against
     * @returns the list of colliding sub meshes
     */
    getCollidingSubMeshCandidates(mesh: AbstractMesh, collider: Collider): ISmartArrayLike<SubMesh>;
    /**
     * Rebuilds the elements related to this component in case of
     * context lost for instance.
     */
    rebuild(): void;
    /**
     * Disposes the component and the associated resources.
     */
    dispose(): void;
}
/**
 * Register side effects for octreeSceneComponent.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterOctreeSceneComponent(): void;
