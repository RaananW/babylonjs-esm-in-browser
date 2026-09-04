import { type Scene } from "../scene.js";
import { type TransformNode } from "../Meshes/transformNode.js";
import { Mesh } from "../Meshes/mesh.pure.js";
import { Skeleton } from "./skeleton.js";
/**
 * Creates a skeleton from a hierarchy of transform nodes by converting each node into a bone.
 * Each transform node in the hierarchy will be linked to its corresponding bone, allowing the skeleton
 * to be driven by the transform node transformations.
 * @param rootNode The root transform node of the hierarchy to convert into a skeleton
 * @param scene The scene in which to create the skeleton
 * @param options Optional parameters for skeleton creation
 *    - name: The name for the created skeleton (defaults to rootNode.name + "_skeleton")
 *    - boneMeshSize: The diameter of the sphere mesh created for each bone (defaults to 1, only used if createMesh is true)
 *    - createMesh: If true, creates a mesh with spheres at each bone location for visualization purposes.
 *       The mesh will be parented to the rootNode's parent and returned through options.mesh
 *    - mesh: An existing mesh to attach the skeleton to. If provided, the skeleton will be assigned to this mesh
 * @returns A new skeleton with bones corresponding to the transform node hierarchy
 * @remarks
 * - Only transform nodes with a rotationQuaternion property will be converted into bones
 */
export declare function CreateSkeletonFromTransformNodeHierarchy(rootNode: TransformNode, scene: Scene, options?: {
    name?: string;
    boneMeshSize?: number;
    createMesh?: boolean;
    mesh?: Mesh;
}): Skeleton;
