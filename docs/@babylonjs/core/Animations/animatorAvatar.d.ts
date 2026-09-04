import { type MorphTargetManager, type Immutable, type Bone, type Nullable, type MorphTarget, type AnimationGroup, type Skeleton } from "../index.js";
import { TransformNode } from "../Meshes/transformNode.pure.js";
import { AbstractMesh } from "../Meshes/abstractMesh.pure.js";
/**
 * Options for retargeting an animation group to an avatar.
 */
export interface IRetargetOptions {
    /**
     * The name to assign to the (cloned) retargeted animation group.
     * If not specified, the same name as the original animation group will be used.
     */
    animationGroupName?: string;
    /**
     * If true, the retargeted animations will be fixed to correct common issues like orthogonal quaternions.
     * Default is false.
     */
    fixAnimations?: boolean;
    /**
     * If true, the parent hierarchy of bones and transform nodes will be checked during retargeting.
     * Animations will be removed if the hierarchies don't match.
     * Default is false.
     */
    checkHierarchy?: boolean;
    /**
     * If true, the frame values in the animation keyframes will be adjusted during retargeting to account for differences
     * between the source and target bone transforms.
     * Default is true.
     */
    retargetAnimationKeys?: boolean;
    /**
     * If true, scales and adjusts the root position animation to account for size differences between the source and target avatars.
     * This helps maintain the relative motion of the character when retargeting between avatars of different proportions.
     * Default is true.
     */
    fixRootPosition?: boolean;
    /**
     * If true, adjusts the root position animation to correct for ground reference height differences between the source and target avatars.
     * This ensures that the animated character maintains proper contact with the ground during retargeting.
     * Requires groundReferenceNodeName to be specified to determine the ground reference point in the source animation.
     * Default is false.
     */
    fixGroundReference?: boolean;
    /**
     * If true, adjusts the ground reference dynamically during retargeting. fixGroundReference must be true for this to work.
     * When enabled, the system will continuously adjust the ground reference point throughout the retargeting process to make sure it's the lowest point of the character.
     * This allows for more accurate ground contact correction, especially in animations where groundReferenceNodeName is not always the lowest point (e.g., walking, running).
     * Default is false.
     */
    fixGroundReferenceDynamicRefNode?: boolean;
    /**
     * The name of the root transform node in the source animation group (typically "Hips" or similar).
     * If not specified, the system will attempt to automatically find the first bone without a parent.
     * This bone is used as a reference point for fixing root position during retargeting.
     * It's also used by the ground reference fixing processing.
     */
    rootNodeName?: string;
    /**
     * The name of the transform node in the source animation group used as a ground reference point (typically a foot bone like "LeftFoot" or "RightFoot").
     * This bone is used to determine the vertical offset needed to maintain proper ground contact during retargeting.
     * Required when fixGroundReference or fixRootPosition is enabled.
     */
    groundReferenceNodeName?: string;
    /**
     * Specifies which axis represents the vertical/up direction in the animation space.
     * Use "X", "Y", or "Z" to explicitly set the vertical axis, or "" (empty string) / undefined to auto-detect.
     * If not specified or empty, the system will automatically determine the vertical axis based on the difference
     * between the root node and ground reference node positions.
     * Default is undefined (auto-detect).
     */
    groundReferenceVerticalAxis?: "" | "X" | "Y" | "Z";
    /**
     * A map for renaming nodes during retargeting when the source transform node hierarchy and target skeleton use different naming conventions.
     * The map keys are the original node names from the source animation group, and the values are the corresponding
     * node names in the target skeleton. This is useful when bone names don't match between avatars.
     */
    mapNodeNames?: Map<string, string>;
}
/**
 * Represents an animator avatar that manages meshes, skeletons and morph target managers for a hierarchical transform node and mesh structure.
 * This class is used to group and manage animation-related resources (meshes, skeletons and morph targets) associated with a root transform node and its descendants.
 */
export declare class AnimatorAvatar {
    readonly name: string;
    readonly rootNode?: TransformNode | undefined;
    private _disposeResources;
    /**
     * List of meshes found in the hierarchy of the root node. Only meshes with at least one vertex are included.
     */
    meshes: AbstractMesh[];
    /**
     * Set of skeletons found in the mesh hierarchy.
     */
    skeletons: Set<Skeleton>;
    /**
     * Set of morph target managers found in the mesh hierarchy.
     * Each morph target manager is configured with the appropriate mesh name and influencer count.
     */
    morphTargetManagers: Set<MorphTargetManager>;
    private _mapMorphTargetNameToMorphTarget;
    /**
     * Map of morph target names to their corresponding MorphTarget instances.
     * The keys are constructed using the format "meshName_morphTargetName".
     */
    get mapMorphTargetNameToMorphTarget(): Immutable<Map<string, MorphTarget>>;
    /**
     * Indicates whether to show warnings during retargeting operations.
     */
    showWarnings: boolean;
    /**
     * Creates an instance of AnimatorAvatar.
     * @param name - The name to assign to this avatar and its root node
     * @param rootNode - The root node of the avatar hierarchy. This node and its descendants will be scanned for meshes, skeletons and morph target managers. If not provided, you are expected to manually manage meshes, skeletons and morph target managers.
     * @param _disposeResources - Indicates whether to dispose of resources (meshes, skeletons, morph target managers, root node and descendants + materials and textures) when the avatar is disposed (true by default)
     * @param setAvatarName - Indicates whether to set the name of the root node to the avatar name. Default is true. Set this to false if you don't want the root node to be renamed, or if you want to set it to a different name after creating the avatar.
     */
    constructor(name: string, rootNode?: TransformNode | undefined, _disposeResources?: boolean, setAvatarName?: boolean);
    private _collectMesh;
    /**
     * Finds a bone in the avatar's skeletons by its linked transform node or the name of the linked transform node.
     * @param nameOrTransformNode The linked transform node or the name of the linked transform node
     * @returns The found bone or null if not found
     */
    findBoneByTransformNode(nameOrTransformNode: string | TransformNode): Nullable<Bone>;
    /**
     * Finds a bone in the avatar's skeletons by its name.
     * @param name The name of the bone
     * @returns The found bone or null if not found
     */
    findBoneByName(name: string): Nullable<Bone>;
    /**
     * Make sures that the animation group passed as the first parameter will animate the bones in the skeleton(s) / the morphs in the morph target manager(s) of the avatar.
     * Retargeting is based on the names of the targets (TransformNode or MorphTarget) in the animation and the names of the bones in the skeleton / morph targets in the morph target manager.
     * Note that you can use the mapNodeNames option to specify a mapping between source transform node names and target bone names in case they are different.
     * If no bones with the same name as a target (TransformNode) of a targeted animation are found, the targeted animation is removed from the animation group.
     * Same for morph targets.
     * Note that for the time being, we only support a source animation group which animates transform nodes, not bones!
     * That's typically the case when the source animation group is created from a glTF file, as glTF animations always target transform nodes.
     * @param sourceAnimationGroup The animation group to retarget
     * @param options Options for retargeting the animation group (optional)
     * @returns The retargeted (new) animation group
     */
    retargetAnimationGroup(sourceAnimationGroup: AnimationGroup, options?: IRetargetOptions): AnimationGroup;
    /**
     * Disposes of the avatar and releases all associated resources.
     * This will dispose all skeletons, morph target managers, and the root mesh with its descendants (including materials and textures).
     * If disposeResources was set to false in the constructor, this method does nothing.
     */
    dispose(): void;
    private _computeBoneWorldMatrices;
    private _isTransformNode;
    private _buildMorphTargetMap;
    private _retargetMorphTarget;
    private _retargetTransformNodeToBone;
    private _retargetAnimationKeys;
    /**
     * This method corrects quaternion animations when two consecutive quaternions are orthogonal to each other. When this happens, in 99.99% of
     * cases it's an error in the animation data, as two consecutive rotations should normally be close to each other and not have a large gap.
     * The fix is to copy the first quaternion into the second.
     * @param animationGroup The animation group to fix
     * @internal
     */
    private _fixAnimationGroup;
    private _getRootNode;
    /**
     * Checks whether the parent hierarchy of a bone matches that of a given transform node. Checks are performed by name.
     * It works by first finding the transform node in the descendants of the root transform node that matches the bone's linked transform node.
     * Then it traverses up the hierarchy of both the bone and the transform node, comparing their names at each level.
     * @param bone The bone to check
     * @param rootTransformNode The root transform node to check against
     * @returns True if the hierarchies match, false otherwise
     * @internal
     */
    private _checkParentHierarchy;
    private _getRootNodeName;
    private _findVerticalAxis;
    private _captureAvatarSkeletonStates;
    private _restoreAvatarSkeletonStates;
    private _resetStates;
    private _fixRootPosition;
    private _fixGroundReference;
}
