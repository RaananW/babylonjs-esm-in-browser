/** This file must only contain pure code and pure imports */
import { WebXRAbstractFeature } from "./WebXRAbstractFeature.js";
import { type WebXRSessionManager } from "../webXRSessionManager.js";
import { type AbstractMesh } from "../../Meshes/abstractMesh.pure.js";
import { Quaternion } from "../../Maths/math.vector.pure.js";
import { type Nullable } from "../../types.js";
import { type IDisposable, type Scene } from "../../scene.pure.js";
import { Observable } from "../../Misc/observable.pure.js";
import { TransformNode } from "../../Meshes/transformNode.pure.js";
import { type Node } from "../../node.js";
/**
 * All 83 body joint names as defined by the WebXR Body Tracking specification.
 * @see https://immersive-web.github.io/body-tracking/#xrbody-interface
 */
export declare enum WebXRBodyJoint {
    /** The center of the hips / pelvis */
    HIPS = "hips",
    /** Lower spine (lumbar) */
    SPINE_LOWER = "spine-lower",
    /** Middle spine (thoracic) */
    SPINE_MIDDLE = "spine-middle",
    /** Upper spine */
    SPINE_UPPER = "spine-upper",
    /** Chest */
    CHEST = "chest",
    /** Neck */
    NECK = "neck",
    /** Head */
    HEAD = "head",
    /** Left shoulder */
    LEFT_SHOULDER = "left-shoulder",
    /** Left scapula */
    LEFT_SCAPULA = "left-scapula",
    /** Left upper arm */
    LEFT_ARM_UPPER = "left-arm-upper",
    /** Left forearm (lower arm) */
    LEFT_ARM_LOWER = "left-arm-lower",
    /** Left hand wrist twist (forearm twist) */
    LEFT_HAND_WRIST_TWIST = "left-hand-wrist-twist",
    /** Right shoulder */
    RIGHT_SHOULDER = "right-shoulder",
    /** Right scapula */
    RIGHT_SCAPULA = "right-scapula",
    /** Right upper arm */
    RIGHT_ARM_UPPER = "right-arm-upper",
    /** Right forearm (lower arm) */
    RIGHT_ARM_LOWER = "right-arm-lower",
    /** Right hand wrist twist (forearm twist) */
    RIGHT_HAND_WRIST_TWIST = "right-hand-wrist-twist",
    /** Left palm center */
    LEFT_HAND_PALM = "left-hand-palm",
    /** Left wrist */
    LEFT_HAND_WRIST = "left-hand-wrist",
    /** Left thumb metacarpal */
    LEFT_HAND_THUMB_METACARPAL = "left-hand-thumb-metacarpal",
    /** Left thumb proximal phalanx */
    LEFT_HAND_THUMB_PHALANX_PROXIMAL = "left-hand-thumb-phalanx-proximal",
    /** Left thumb distal phalanx */
    LEFT_HAND_THUMB_PHALANX_DISTAL = "left-hand-thumb-phalanx-distal",
    /** Left thumb tip */
    LEFT_HAND_THUMB_TIP = "left-hand-thumb-tip",
    /** Left index finger metacarpal */
    LEFT_HAND_INDEX_METACARPAL = "left-hand-index-metacarpal",
    /** Left index finger proximal phalanx */
    LEFT_HAND_INDEX_PHALANX_PROXIMAL = "left-hand-index-phalanx-proximal",
    /** Left index finger intermediate phalanx */
    LEFT_HAND_INDEX_PHALANX_INTERMEDIATE = "left-hand-index-phalanx-intermediate",
    /** Left index finger distal phalanx */
    LEFT_HAND_INDEX_PHALANX_DISTAL = "left-hand-index-phalanx-distal",
    /** Left index finger tip */
    LEFT_HAND_INDEX_TIP = "left-hand-index-tip",
    /** Left middle finger metacarpal */
    LEFT_HAND_MIDDLE_METACARPAL = "left-hand-middle-metacarpal",
    /** Left middle finger proximal phalanx */
    LEFT_HAND_MIDDLE_PHALANX_PROXIMAL = "left-hand-middle-phalanx-proximal",
    /** Left middle finger intermediate phalanx */
    LEFT_HAND_MIDDLE_PHALANX_INTERMEDIATE = "left-hand-middle-phalanx-intermediate",
    /** Left middle finger distal phalanx */
    LEFT_HAND_MIDDLE_PHALANX_DISTAL = "left-hand-middle-phalanx-distal",
    /** Left middle finger tip */
    LEFT_HAND_MIDDLE_TIP = "left-hand-middle-tip",
    /** Left ring finger metacarpal */
    LEFT_HAND_RING_METACARPAL = "left-hand-ring-metacarpal",
    /** Left ring finger proximal phalanx */
    LEFT_HAND_RING_PHALANX_PROXIMAL = "left-hand-ring-phalanx-proximal",
    /** Left ring finger intermediate phalanx */
    LEFT_HAND_RING_PHALANX_INTERMEDIATE = "left-hand-ring-phalanx-intermediate",
    /** Left ring finger distal phalanx */
    LEFT_HAND_RING_PHALANX_DISTAL = "left-hand-ring-phalanx-distal",
    /** Left ring finger tip */
    LEFT_HAND_RING_TIP = "left-hand-ring-tip",
    /** Left little finger metacarpal */
    LEFT_HAND_LITTLE_METACARPAL = "left-hand-little-metacarpal",
    /** Left little finger proximal phalanx */
    LEFT_HAND_LITTLE_PHALANX_PROXIMAL = "left-hand-little-phalanx-proximal",
    /** Left little finger intermediate phalanx */
    LEFT_HAND_LITTLE_PHALANX_INTERMEDIATE = "left-hand-little-phalanx-intermediate",
    /** Left little finger distal phalanx */
    LEFT_HAND_LITTLE_PHALANX_DISTAL = "left-hand-little-phalanx-distal",
    /** Left little finger tip */
    LEFT_HAND_LITTLE_TIP = "left-hand-little-tip",
    /** Right palm center */
    RIGHT_HAND_PALM = "right-hand-palm",
    /** Right wrist */
    RIGHT_HAND_WRIST = "right-hand-wrist",
    /** Right thumb metacarpal */
    RIGHT_HAND_THUMB_METACARPAL = "right-hand-thumb-metacarpal",
    /** Right thumb proximal phalanx */
    RIGHT_HAND_THUMB_PHALANX_PROXIMAL = "right-hand-thumb-phalanx-proximal",
    /** Right thumb distal phalanx */
    RIGHT_HAND_THUMB_PHALANX_DISTAL = "right-hand-thumb-phalanx-distal",
    /** Right thumb tip */
    RIGHT_HAND_THUMB_TIP = "right-hand-thumb-tip",
    /** Right index finger metacarpal */
    RIGHT_HAND_INDEX_METACARPAL = "right-hand-index-metacarpal",
    /** Right index finger proximal phalanx */
    RIGHT_HAND_INDEX_PHALANX_PROXIMAL = "right-hand-index-phalanx-proximal",
    /** Right index finger intermediate phalanx */
    RIGHT_HAND_INDEX_PHALANX_INTERMEDIATE = "right-hand-index-phalanx-intermediate",
    /** Right index finger distal phalanx */
    RIGHT_HAND_INDEX_PHALANX_DISTAL = "right-hand-index-phalanx-distal",
    /** Right index finger tip */
    RIGHT_HAND_INDEX_TIP = "right-hand-index-tip",
    /** Right middle finger metacarpal */
    RIGHT_HAND_MIDDLE_METACARPAL = "right-hand-middle-metacarpal",
    /** Right middle finger proximal phalanx */
    RIGHT_HAND_MIDDLE_PHALANX_PROXIMAL = "right-hand-middle-phalanx-proximal",
    /** Right middle finger intermediate phalanx */
    RIGHT_HAND_MIDDLE_PHALANX_INTERMEDIATE = "right-hand-middle-phalanx-intermediate",
    /** Right middle finger distal phalanx */
    RIGHT_HAND_MIDDLE_PHALANX_DISTAL = "right-hand-middle-phalanx-distal",
    /** Right middle finger tip */
    RIGHT_HAND_MIDDLE_TIP = "right-hand-middle-tip",
    /** Right ring finger metacarpal */
    RIGHT_HAND_RING_METACARPAL = "right-hand-ring-metacarpal",
    /** Right ring finger proximal phalanx */
    RIGHT_HAND_RING_PHALANX_PROXIMAL = "right-hand-ring-phalanx-proximal",
    /** Right ring finger intermediate phalanx */
    RIGHT_HAND_RING_PHALANX_INTERMEDIATE = "right-hand-ring-phalanx-intermediate",
    /** Right ring finger distal phalanx */
    RIGHT_HAND_RING_PHALANX_DISTAL = "right-hand-ring-phalanx-distal",
    /** Right ring finger tip */
    RIGHT_HAND_RING_TIP = "right-hand-ring-tip",
    /** Right little finger metacarpal */
    RIGHT_HAND_LITTLE_METACARPAL = "right-hand-little-metacarpal",
    /** Right little finger proximal phalanx */
    RIGHT_HAND_LITTLE_PHALANX_PROXIMAL = "right-hand-little-phalanx-proximal",
    /** Right little finger intermediate phalanx */
    RIGHT_HAND_LITTLE_PHALANX_INTERMEDIATE = "right-hand-little-phalanx-intermediate",
    /** Right little finger distal phalanx */
    RIGHT_HAND_LITTLE_PHALANX_DISTAL = "right-hand-little-phalanx-distal",
    /** Right little finger tip */
    RIGHT_HAND_LITTLE_TIP = "right-hand-little-tip",
    /** Left upper leg (thigh) */
    LEFT_UPPER_LEG = "left-upper-leg",
    /** Left lower leg (shin) */
    LEFT_LOWER_LEG = "left-lower-leg",
    /** Left foot ankle twist */
    LEFT_FOOT_ANKLE_TWIST = "left-foot-ankle-twist",
    /** Left foot ankle */
    LEFT_FOOT_ANKLE = "left-foot-ankle",
    /** Left foot subtalar */
    LEFT_FOOT_SUBTALAR = "left-foot-subtalar",
    /** Left foot transverse */
    LEFT_FOOT_TRANSVERSE = "left-foot-transverse",
    /** Left foot ball */
    LEFT_FOOT_BALL = "left-foot-ball",
    /** Right upper leg (thigh) */
    RIGHT_UPPER_LEG = "right-upper-leg",
    /** Right lower leg (shin) */
    RIGHT_LOWER_LEG = "right-lower-leg",
    /** Right foot ankle twist */
    RIGHT_FOOT_ANKLE_TWIST = "right-foot-ankle-twist",
    /** Right foot ankle */
    RIGHT_FOOT_ANKLE = "right-foot-ankle",
    /** Right foot subtalar */
    RIGHT_FOOT_SUBTALAR = "right-foot-subtalar",
    /** Right foot transverse */
    RIGHT_FOOT_TRANSVERSE = "right-foot-transverse",
    /** Right foot ball */
    RIGHT_FOOT_BALL = "right-foot-ball"
}
/**
 * Parent index for each joint in {@link BodyJointReferenceArray} order.
 * -1 means "root" (no parent).  Used to convert world-space XR poses to
 * local-space transforms suitable for skeleton bones.
 *
 * Hierarchy follows the WebXR Body Tracking specification and standard
 * humanoid anatomy.
 */
export declare const BodyJointParentIndex: number[];
/**
 * Logical body parts for convenient grouping of joints.
 */
export declare enum BodyPart {
    /** Torso / spine (hips through head) */
    TORSO = "torso",
    /** Left arm (shoulder through wrist twist) */
    LEFT_ARM = "left-arm",
    /** Right arm (shoulder through wrist twist) */
    RIGHT_ARM = "right-arm",
    /** Left hand (palm through finger tips) */
    LEFT_HAND = "left-hand",
    /** Right hand (palm through finger tips) */
    RIGHT_HAND = "right-hand",
    /** Left leg (upper leg through foot ball) */
    LEFT_LEG = "left-leg",
    /** Right leg (upper leg through foot ball) */
    RIGHT_LEG = "right-leg"
}
/**
 * A dictionary mapping each {@link WebXRBodyJoint} to a bone name in a rigged body mesh.
 *
 * When you supply a rigged mesh to {@link WebXRTrackedBody.setBodyMesh}, provide
 * a mapping so the feature knows which skeleton bone to drive for each joint.
 *
 * @example
 * ```typescript
 * const rigMapping: XRBodyMeshRigMapping = {
 *   "hips": "Bip01_Pelvis",
 *   "spine-lower": "Bip01_Spine",
 *   "head": "Bip01_Head",
 *   // …remaining joints…
 * };
 * ```
 */
export type XRBodyMeshRigMapping = {
    [jointName in WebXRBodyJoint]?: string;
};
/**
 * Configuration options for the WebXR body tracking feature.
 */
export interface IWebXRBodyTrackingOptions {
    /**
     * A pre-existing rigged body mesh to drive with tracked joint poses.
     * If provided, skeleton bones will be linked to tracked joints automatically.
     * The mesh should contain a skeleton whose bones can be mapped via `rigMapping`.
     */
    bodyMesh?: AbstractMesh;
    /**
     * A mapping from {@link WebXRBodyJoint} names to skeleton bone names.
     * Required when the skeleton's bone names do not match the WebXR joint names.
     * If omitted and a body mesh is provided, the feature assumes bones are
     * named identically to the WebXR joint names (e.g. `"hips"`, `"left-arm-upper"`, etc.).
     */
    rigMapping?: XRBodyMeshRigMapping;
    /**
     * Scale factor applied to the local-space position of every joint.
     *
     * This uniformly scales the distances between parent and child joints,
     * allowing you to fit XR body tracking data to meshes that are larger or
     * smaller than the tracked user.
     *
     * - `1.0` (default): no scaling — real-world proportions.
     * - `> 1.0`: stretches the skeleton (makes it taller / wider).
     * - `< 1.0`: compresses the skeleton.
     *
     * Only affects local joint offsets, not the root (hips) position.
     */
    jointScaleFactor?: number;
    /**
     * Preserve bind-pose local translations for mapped bones and only retarget rotations.
     *
     * When `false` (default), mapped bones are translated directly to the tracked joint
     * positions. This reproduces the tracked skeleton exactly, but can distort avatars whose
     * proportions differ from the tracked user.
     *
     * When `true`, mapped child bones keep their bind-pose local translation offsets while
     * still using the tracked joint rotations. This is the typical retargeting mode for
     * driving arbitrary skinned characters without forcing them to the tracked skeleton's
     * segment lengths.
     */
    preserveBindPoseBonePositions?: boolean;
    /**
     * Apply a per-bone orientation offset so the avatar bone basis matches the XR joint basis.
     *
     * When enabled, WebXR joint rotations are corrected using the bone's bind-space child axis.
     * This is useful for rigs whose bone local axes do not match the anatomical axes used by
     * the WebXR body-tracking joint orientations.
     */
    useBoneOrientationOffsets?: boolean;
    /**
     * Rotation applied in each tracked joint's local frame to re-base the
     * XR joint axes. Some runtimes (e.g., some Meta Quest builds) emit body
     * joint poses whose +Z axis points along the bone (parent → child), while
     * most avatar rigs expect +Y along the bone. Setting this to
     * `Quaternion.RotationAxis(Vector3.Right(), -Math.PI / 2)` converts
     * "+Z-along-bone" joint data to "+Y-along-bone" before retargeting.
     *
     * Applied as a pre-multiply on each joint's world matrix:
     * `M' = R × M`, which, under Babylon's row-vector convention
     * (`v_world = v_local × M`), effectively re-bases the joint-local axes.
     *
     * Default `undefined` = identity (no re-basing).
     */
    jointLocalRotationOffset?: Quaternion;
    /**
     * Per–XR-joint override for the "aim child" joint used when
     * {@link useBoneOrientationOffsets} is enabled.
     *
     * By default the aim direction for a mapped bone is computed against its
     * nearest mapped descendant in the skeleton. For rigs whose XR-mapped
     * spine chain has very short segments (e.g. WebXR's `hips`→`spine-lower`
     * is typically only ~1 cm), the aim direction becomes noise-dominated and
     * can produce a large incorrect rotation for the parent bone.
     *
     * Use this map to redirect a specific XR joint's aim target to a farther
     * XR joint whose relative position is stable. Both the source and target
     * joint must be present in {@link rigMapping} (i.e. mapped to a bone on the
     * skeleton).
     *
     * Example for a Mixamo-style rig where hips, spine, spine1, spine2 and
     * neck are all mapped:
     * ```ts
     * aimChildOverrides: {
     *   [WebXRBodyJoint.HIPS]: WebXRBodyJoint.SPINE_UPPER,   // skip spine-lower/middle
     *   [WebXRBodyJoint.SPINE_LOWER]: WebXRBodyJoint.NECK,   // long stable segment
     *   [WebXRBodyJoint.SPINE_MIDDLE]: WebXRBodyJoint.NECK,
     * }
     * ```
     */
    aimChildOverrides?: Partial<Record<WebXRBodyJoint, WebXRBodyJoint>>;
    /**
     * Convenience flag for Mixamo-rigged characters.
     *
     * When set to `true`, the feature automatically applies:
     * - {@link MixamoRigMapping} as the `rigMapping` (skipping any explicit
     *   `rigMapping` you provide).
     * - {@link MixamoAimChildOverrides} as `aimChildOverrides` (skipping any
     *   explicit `aimChildOverrides` you provide).
     * - Turns on {@link useBoneOrientationOffsets} by default (you can still
     *   override to `false`).
     *
     * The Mixamo `mixamorig:` bone-name prefix is detected automatically by
     * inspecting the skeleton, so the same mapping works regardless of whether
     * the bones have been renamed to strip the prefix (common when re-exporting).
     */
    isMixamoModel?: boolean;
}
/**
 * Default rig mapping for Mixamo-rigged humanoid characters.
 *
 * Maps each supported {@link WebXRBodyJoint} to the corresponding Mixamo bone
 * name, **without** the `mixamorig:` prefix. When the feature applies this
 * mapping, it auto-detects whether the skeleton uses the `mixamorig:` prefix
 * and prepends it as needed, so the same table works for both prefixed and
 * unprefixed exports.
 *
 * @example
 * ```ts
 * xr.featuresManager.enableFeature(WebXRFeatureName.BODY_TRACKING, "latest", {
 *     bodyMesh: myMixamoMesh,
 *     isMixamoModel: true,
 * });
 * ```
 *
 * Or, if you want to extend or customize it:
 * ```ts
 * import { MixamoRigMapping } from "@babylonjs/core";
 * const rigMapping: XRBodyMeshRigMapping = { ...MixamoRigMapping, [WebXRBodyJoint.NECK]: "MyNeckBone" };
 * ```
 */
export declare const MixamoRigMapping: XRBodyMeshRigMapping;
/**
 * Default aim-child overrides for Mixamo-rigged humanoids.
 *
 * Redirects the short / noisy XR spine segments to longer, stable ones so that
 * {@link IWebXRBodyTrackingOptions.useBoneOrientationOffsets} produces clean
 * torso rotations. In WebXR data, `hips`→`spine-lower` is typically only ~1 cm
 * apart — too short to give a stable aim direction — so we reroute Mixamo's
 * Hips/Spine/Spine1 bones to aim at `spine-upper` / `neck` instead.
 */
export declare const MixamoAimChildOverrides: Partial<Record<WebXRBodyJoint, WebXRBodyJoint>>;
/**
 * Resolve the Mixamo rig mapping for a given body mesh, auto-detecting the
 * `mixamorig:` bone-name prefix. Falls back to the unprefixed names.
 * @param bodyMesh The rigged Mixamo body mesh.
 * @returns An {@link XRBodyMeshRigMapping} whose bone names include the
 *          detected prefix (if any).
 * @internal
 */
export declare function _ResolveMixamoRigMapping(bodyMesh: AbstractMesh): XRBodyMeshRigMapping;
/**
 * Represents a tracked body during a WebXR session.
 *
 * This class manages the bridge between the WebXR body pose data and the
 * Babylon.js scene graph.  It creates a set of {@link TransformNode}s — one per
 * body joint — whose transforms are updated every frame from the XR runtime.
 * When a rigged body mesh is attached, its skeleton bones are linked to these
 * transform nodes, causing the mesh to follow the user's body automatically.
 *
 * Coordinate-system handling:
 * - WebXR delivers poses in a right-handed system.
 * - By default, Babylon.js uses a left-handed system.
 * - The class converts the data in-place (negating the Z components of every
 *   4 × 4 joint matrix) before decomposing into Babylon transforms.
 * - If the mesh was authored in a right-handed tool (the common case for glTF),
 *   the bone transforms are un-flipped so the skeleton interprets them correctly.
 */
export declare class WebXRTrackedBody implements IDisposable {
    /**
     * Fired when the body mesh is changed via {@link setBodyMesh}.
     */
    readonly onBodyMeshSetObservable: Observable<WebXRTrackedBody>;
    private _scene;
    /**
     * One {@link TransformNode} per joint.  These receive the WebXR matrix data
     * every frame and serve as link targets for skeleton bones.
     */
    private _jointTransforms;
    /**
     * Flat Float32Array that receives transform matrices directly from the
     * WebXR API (via `fillPoses`). 16 floats per joint × 83 joints = 1 328 floats.
     */
    private _jointTransformMatrices;
    /**
     * Copy of the raw RHS XR matrices (before LHS conversion).
     * Used to compute bone-local transforms for glTF skeletons that
     * operate in RHS space.
     */
    private _jointTransformMatricesRHS;
    /**
     * Cached array of XRBodySpace objects extracted from the XRBody, kept in the
     * same order as {@link BodyJointReferenceArray}.
     */
    private _jointSpaces;
    /** Temporary matrix: this joint's XR world-space matrix. */
    private _tempJointMatrix;
    /** Temporary matrix: parent joint's XR world-space matrix. */
    private _tempParentMatrix;
    /** Temporary matrix: computed bone-local matrix. */
    private _tempLocalMatrix;
    /** Temporary vector for scale extracted from decompose. */
    private _tempScaleVector;
    /** Temporary quaternion for decompose. */
    private _tempRotQuat;
    /** Temporary position vector for decompose. */
    private _tempPosVec;
    /** Temporary quaternion for alternate rotation calculations. */
    private _tempRotQuat2;
    /** Temporary vector for desired child direction. */
    private _tempDirection;
    /** Temporary vector for joint-local child direction. */
    private _tempLocalDirection;
    /** Cached desired final positions for mapped joints. */
    private _desiredFinalPositions;
    /**
     * For each joint index, the joint index of the nearest mapped SKELETON
     * ancestor bone.  -1 when the bone has no mapped ancestor (root level).
     * Precomputed in {@link setBodyMesh} by walking the skeleton hierarchy.
     */
    private _jointParentJointIdx;
    /** Tracks which joint indices have a linked bone (for step 4b). */
    private _jointHasBone;
    /** Bone → XR joint index lookup, built in {@link setBodyMesh}. */
    private _boneToJointIdx;
    /** Original bind-pose local matrices for mapped bones. */
    private _mappedBoneBindLocals;
    /** Nearest mapped child bone for each mapped bone. */
    private _mappedChildBones;
    /** Bind-space local child direction for each mapped bone. */
    private _bindLocalAimDirections;
    /** Bind-space local hand-plane normal used to correct wrist/hand twist from tracked finger positions. */
    private _bindLocalTwistNormals;
    /**
     * XR joint index to aim each mapped bone at. This can be a mapped joint
     * (same as `_boneToJointIdx.get(aimChildBone)`) or an **unmapped** XR
     * joint whose tracked position is nonetheless useful for aim correction —
     * e.g. `LEFT_HAND_MIDDLE_METACARPAL` for `mixamorig:LeftHand`, which has
     * no mapped finger descendant but whose tracked position still defines
     * "where the hand is pointing".
     */
    private _boneAimTargetJointIdx;
    /** Per-bone pair of tracked joints that define the hand plane used for twist correction. */
    private _boneTwistReferenceJointIdx;
    /**
     * Per-mapped-bone bind-pose world rotation in mesh-local space
     * (decomposed from `bone.getFinalMatrix()` at bind time). Used by the
     * delta-from-bind retarget path (axis-convention-invariant).
     */
    private _bindBoneWorldRotMeshLocal;
    /**
     * Bind-pose tracked joint rotation in mesh-local space per mapped joint.
     * Captured on the first tracked frame (or on demand via
     * {@link captureTrackedBind}). `null` until captured.
     */
    private _trackedBindDesiredFinalRot;
    /** Bind-pose tracked joint position (mesh-local), captured alongside rotation. */
    private _trackedBindDesiredFinalPos;
    /** True once a tracked-bind snapshot has been taken. */
    private _hasTrackedBind;
    /**
     * When `true` (default), the first tracked frame after the feature
     * attaches is used as the "rest" pose for delta-from-bind retargeting.
     * Set to `false` to require an explicit {@link captureTrackedBind} call.
     */
    autoCaptureBindOnFirstFrame: boolean;
    /** Scratch quaternion for retarget delta composition. */
    private _tempDeltaQuat;
    private _tempBoneWorldRot;
    private _tempParentNewWorldRotInv;
    private _tempTrackedCurRot;
    private _tempTrackedCurPos;
    private _tempBindLocalScale;
    private _tempBindLocalPos;
    /**
     * Per-bone cache of the current frame's computed world rotation.
     * Entries are pooled across frames (values are reused via `copyFrom`)
     * to avoid allocating a fresh Quaternion per mapped bone per frame.
     * A bone is considered "populated this frame" iff it has been visited
     * by the current retarget pass (tracked via `_computedBoneNewWorldRotFrameId`).
     */
    private _computedBoneNewWorldRot;
    /** Per-bone marker: frame id at which the pooled rotation above was last set. */
    private _computedBoneNewWorldRotFrameId;
    private _currentRetargetFrameId;
    /** Scratch quaternion reused for the parent-world accumulation loop. */
    private _tempParentAccumRot;
    /** Scratch quaternion reused for the parent-world intermediate product. */
    private _tempParentAccumTmp;
    /** Scratch vectors reused by hand twist correction. */
    private _tempTwistFirst;
    private _tempTwistSecond;
    private _tempTwistNormal;
    private _tempCurrentTwistNormal;
    private _tempProjectedTwistNormal;
    private _tempProjectedDesiredTwistNormal;
    private _tempTwistAimAxis;
    private _tempTwistCross;
    /** The skeleton reference for iterating bones in parent-first order. */
    private _skeleton;
    /** Cached inverse of the skeleton mesh's world matrix. */
    private _meshWorldMatrixInverse;
    /** Cached inverse of the skeleton mesh pose matrix when initial skinning is used. */
    private _initialSkinMatrixInverse;
    /**
     * Pre-allocated desiredFinal matrices (one per joint slot).
     * `desiredFinal[i] = strip(xrWorld[i] × inv(meshWorld))` — the bone's
     * target skeleton-space final matrix with parasitic scale removed.
     */
    private _desiredFinals;
    /**
     * Standalone TransformNodes created for unmapped skinned bones.
     * These TNs are initialized to the bone's bind-pose local and linked
     * so that `prepare()` reads deterministic values rather than the
     * original glTF scene-graph TNs (which we don't control).
     */
    private _unmappedBoneNodes;
    /** The mesh that owns the skeleton (used for world-matrix inverse). */
    private _skeletonMesh;
    /** The body mesh root (topmost parent), used to parent the mesh to the camera. */
    private _bodyMeshRoot;
    /** The rigged body mesh, if any. */
    private _bodyMesh;
    /** Scale factor for local joint offsets. */
    private _jointScaleFactor;
    /** Whether mapped bones should keep their bind-pose local translations. */
    private readonly _preserveBindPoseBonePositions;
    /** Whether mapped bones should correct WebXR joint rotations using bind-space orientation offsets. */
    private readonly _useBoneOrientationOffsets;
    /** Per–XR-joint override mapping for aim children (used with _useBoneOrientationOffsets). */
    private _aimChildOverrides;
    /**
     * Runtime-mutable rotation applied in each tracked joint's local frame to
     * re-base XR joint axes (e.g., "+Z-along-bone" → "+Y-along-bone").
     * `null` = identity / disabled.
     */
    jointLocalRotationOffset: Nullable<Quaternion>;
    /** Cached 4×4 matrix form of {@link jointLocalRotationOffset} for the fast path. */
    private _jointLocalRotationOffsetMatrix;
    /** Temporary matrix used when applying {@link jointLocalRotationOffset}. */
    private _tempOffsetAppliedMatrix;
    /**
     * When true, bypass skeleton.prepare() and write skin matrices directly.
     * This is a diagnostic flag to help isolate rendering issues. When the
     * standard pipeline (TN → bone → prepare → skin matrices) produces
     * unexpected results, enabling this writes `absInvBind × final` directly
     * into the skeleton's transform matrix buffer.
     * @internal
     */
    _directSkinWrite: boolean;
    /**
     * Debug info string from the last `updateFromXRFrame` call.
     * Useful for diagnosing tracking failures on-device.
     * @internal
     */
    _lastDebugInfo: string;
    /**
     * Get the current body mesh (if any).
     */
    get bodyMesh(): Nullable<AbstractMesh>;
    /**
     * Get or set the scale factor for local joint offsets.
     * @see {@link IWebXRBodyTrackingOptions.jointScaleFactor}
     */
    get jointScaleFactor(): number;
    set jointScaleFactor(value: number);
    /**
     * Returns the array of transform nodes representing each body joint.
     * The order matches {@link WebXRBodyTracking.AllBodyJoints}; use
     * {@link getJointTransform} or {@link getBodyPartTransforms} for
     * name-based lookup.
     *
     * Note: when a body mesh is attached, these transform nodes are also
     * used as the skeleton's link targets for mapped joints. In that case
     * the values held by mapped-joint nodes are skeleton-local (parent bone's
     * frame), not XR world-space. Unmapped-joint nodes always hold world-space
     * pose. If you need world-space poses for every joint regardless of
     * mapping, sample the bone matrices directly via the attached skeleton.
     */
    get jointTransforms(): readonly TransformNode[];
    /**
     * Get the transform node for a specific body joint.
     * @param jointName The name of the body joint (from {@link WebXRBodyJoint}).
     * @returns The transform node corresponding to that joint, or `undefined` if not found.
     */
    getJointTransform(jointName: WebXRBodyJoint): TransformNode | undefined;
    /**
     * Get all joint transform nodes that belong to a given body part.
     * @param part The body part to query.
     * @param result Optional pre-allocated array to fill (avoids per-call allocation).
     *   The array is cleared and populated with the results.
     * @returns An array of TransformNodes for that body part.
     */
    getBodyPartTransforms(part: BodyPart, result?: TransformNode[]): TransformNode[];
    /**
     * Construct a new tracked body instance.
     * @param scene The Babylon.js scene.
     * @param bodyMesh Optional rigged body mesh to attach immediately.
     * @param rigMapping Optional mapping from WebXR joint names to skeleton bone names.
     * @param jointScaleFactor Scale factor for local joint offsets (default 1.0).
     * @param preserveBindPoseBonePositions Whether mapped bones should keep bind-pose local translations.
     * @param useBoneOrientationOffsets Whether mapped bones should correct XR joint rotations using bind-space offsets.
     * @param aimChildOverrides Per–XR-joint override for the aim child used with `useBoneOrientationOffsets`.
     * @param jointLocalRotationOffset Optional rotation re-basing each XR joint's local frame (e.g. Z-along-bone → Y-along-bone).
     */
    constructor(scene: Scene, bodyMesh?: AbstractMesh, rigMapping?: XRBodyMeshRigMapping, jointScaleFactor?: number, preserveBindPoseBonePositions?: boolean, useBoneOrientationOffsets?: boolean, aimChildOverrides?: Partial<Record<WebXRBodyJoint, WebXRBodyJoint>>, jointLocalRotationOffset?: Quaternion);
    /**
     * Attach (or replace) a rigged body mesh.
     *
     * The mesh's skeleton bones are linked to the internal transform nodes
     * that receive WebXR tracking data each frame.  If the mesh has a skeleton,
     * the `rigMapping` (or a direct name match) is used to bind each bone.
     *
     * @param bodyMesh The rigged mesh to drive.
     * @param rigMapping An optional mapping from {@link WebXRBodyJoint} to bone name.
     *   If omitted, bones are expected to be named after the WebXR joint names.
     */
    setBodyMesh(bodyMesh: AbstractMesh, rigMapping?: XRBodyMeshRigMapping): void;
    /**
     * Update joint transforms from the current XR frame.
     *
     * This method is called once per frame by the feature class.  Internally it:
     * 1. Extracts all XRBodySpaces from the XRBody.
     * 2. Fills the transform-matrix buffer via `fillPoses()` (or per-joint fallback).
     * 3. Converts from WebXR right-handed to Babylon left-handed coordinates.
     * 4. Decomposes each matrix into the corresponding TransformNode.
     * 5. Parents the body mesh root to the XR camera so it tracks correctly.
     *
     * @param xrFrame The current XRFrame.
     * @param referenceSpace The XRReferenceSpace to resolve poses against.
     * @param xrCameraParent The parent node of the XR camera (used for parenting).
     * @returns `true` if valid tracking data was processed, `false` otherwise.
     */
    updateFromXRFrame(xrFrame: XRFrame, referenceSpace: XRReferenceSpace, xrCameraParent: Nullable<Node>): boolean;
    /**
     * Replay a pre-captured joint matrix set through the retargeting
     * pipeline as if it had just been delivered by an XR frame.
     *
     * Useful for headset-less testing: call with a snapshot captured via
     * {@link snapshotFrame} (the `jointMatricesRHS` array, or `jointMatricesLHS`
     * already flipped). The matrices are assumed to be RHS unless
     * `isAlreadyLhs=true`, in which case the RHS→LHS flip step is skipped.
     *
     * @param rawMatrices Float32Array of BODY_JOINT_COUNT × 16 (= 1328) floats.
     * @param isAlreadyLhs Set to `true` if matrices are already LHS-converted.
     */
    replayRawJointMatrices(rawMatrices: Float32Array | number[], isAlreadyLhs?: boolean): void;
    /**
     * Run steps 2.5 → 5 of the retargeting pipeline using whatever is
     * currently in `_jointTransformMatrices` (as if the WebXR API just
     * filled it for the current frame).
     * @param xrCameraParent Parent node of the XR camera (used to parent the body mesh root during live XR).
     * @param skipRhsToLhs If true, skip the RHS→LHS flip (matrices are already in the scene's handedness).
     */
    private _processTrackedJointMatrices;
    /**
     * Capture the current tracked-joint desired-final rotations and positions
     * as the "rest pose" for delta-from-bind retargeting.
     *
     * Delta-from-bind is the production retarget path: every subsequent
     * frame is interpreted as a rotation delta from this snapshot, which
     * makes retargeting invariant to the XR-joint axis convention and to
     * any skeletal-proportion differences between the tracked user and the
     * avatar.
     *
     * Call this after the user assumes a known rest pose (e.g. T-pose,
     * A-pose, arms-at-sides). By default the feature auto-captures on the
     * first tracked frame — disable via {@link autoCaptureBindOnFirstFrame}.
     */
    captureTrackedBind(): void;
    /**
     * Clear any captured bind, reverting subsequent frames to the fallback
     * direct-retarget path (or re-triggering auto-capture on the next frame).
     */
    clearTrackedBind(): void;
    private _computeNormalFromJointPositions;
    private _projectOnPlaneToRef;
    private _storeBindLocalTwistNormalFromPositions;
    /** Internal: copy current desiredFinals into the tracked-bind slots. */
    private _captureTrackedBindFromDesiredFinals;
    /**
     * Delta-from-bind retarget: axis-convention-invariant.
     *
     * For each mapped bone in skeleton order (parents first):
     *   let j = joint mapped to this bone
     *   deltaMeshLocalRot  = bindTracked[j]⁻¹ × currentTracked[j]     (right-side in row-vector)
     *   newBoneWorldRot    = bindBoneWorldRot × deltaMeshLocalRot
     *   newBoneLocalRot    = newBoneWorldRot × parentNewBoneWorldRot⁻¹
     *
     * Positions: root bone receives tracked world delta (so the avatar
     * translates with the user). All other mapped bones keep their rig's
     * bind-pose local translation to preserve segment lengths.
     * @param scaleFactor Additional scale applied to joint local positions.
     */
    private _retargetDeltaFromBind;
    /**
     * Legacy direct-retarget path (pre-bind-capture). Kept as fallback.
     * @param useInitialSkinMatrix Skeleton needs initial-skin-matrix chaining for the root.
     * @param useBoneOrientationOffsets Apply aim-direction correction per mapped bone.
     * @param scaleFactor Additional scale applied to joint local positions.
     * @param computedWorldRotations Optional map used by the aim-correction path for parent lookups.
     */
    private _retargetDirect;
    /**
     * Capture a snapshot of the current frame's raw XR joint matrices and
     * skeleton metadata.  Returns a JSON string that can be used offline to
     * replay / debug bone-local computation without a headset.
     *
     * The snapshot includes:
     * - `jointMatricesRHS` – 83 × 16 raw RHS matrices (before LHS conversion)
     * - `jointMatricesLHS` – 83 × 16 LHS-converted matrices (after step 3)
     * - `meshWorldMatrix` – 16 floats, the skeleton mesh's world matrix (if any)
     * - `jointHasBone` – boolean[83], which joints are mapped to bones
     * - `jointParentJointIdx` – number[83], mapped ancestor for each joint
     * - `useRightHandedSystem` – scene handedness setting
     * - `jointNames` – the 83 joint names in order
     *
     * @returns A JSON string with the snapshot data.
     */
    snapshotFrame(): string;
    /**
     * Capture a snapshot and copy it to the system clipboard.
     * Logs to the console on success or failure.
     * @returns A promise that resolves when the copy completes.
     */
    snapshotFrameToClipboardAsync(): Promise<void>;
    /**
     * Dispose of this tracked body and its resources.
     * @param disposeMesh If `true`, the body mesh and its skeleton are disposed as well.
     */
    dispose(disposeMesh?: boolean): void;
}
/**
 * WebXR Body Tracking feature.
 *
 * This feature tracks the user's full-body pose using the
 * [WebXR Body Tracking Module](https://immersive-web.github.io/body-tracking/),
 * which exposes 83 articulated joints covering the torso, arms, hands, legs and feet.
 *
 * ## Quick Start
 *
 * ```typescript
 * // Enable body tracking when creating the default XR experience:
 * const xr = await scene.createDefaultXRExperienceAsync();
 * const bodyTracking = xr.baseExperience.featuresManager.enableFeature(
 *     WebXRFeatureName.BODY_TRACKING,
 *     "latest",
 *     {
 *         bodyMesh: myRiggedBodyMesh,
 *         rigMapping: {
 *             "hips": "Bip01_Pelvis",
 *             "spine-lower": "Bip01_Spine",
 *             // … one entry per joint you want to drive …
 *         },
 *     } as IWebXRBodyTrackingOptions,
 * );
 *
 * // React to tracking changes:
 * bodyTracking.onBodyTrackingStartedObservable.add((trackedBody) => {
 *     console.log("Body tracking started");
 * });
 * bodyTracking.onBodyTrackingFrameUpdateObservable.add((trackedBody) => {
 *     // The tracked body's joint transforms are already up-to-date.
 * });
 * ```
 *
 * ## How It Works
 *
 * 1. The feature requests the `"body-tracking"` native WebXR feature at session start.
 * 2. Each frame, if `XRFrame.body` is available, joint poses are filled into a
 *    flat Float32Array via the batch `fillPoses()` API (with a per-joint fallback).
 * 3. The 4 × 4 matrices are converted from WebXR right-handed coordinates to
 *    Babylon.js left-handed coordinates in-place (unless the scene is RHS).
 * 4. Each matrix is decomposed and written to a TransformNode; skeleton bones
 *    linked to those nodes animate the rigged mesh automatically.
 *
 * ## Coordinate System
 *
 * WebXR data arrives in a **right-handed** coordinate system.  Babylon.js
 * defaults to **left-handed**.  The conversion is handled automatically:
 * - Joint matrices are flipped in-place (Z-negation of specific matrix elements).
 * - For meshes authored in a right-handed tool (glTF, Blender, etc.), the bone
 *   data is un-flipped so the skeleton interprets poses correctly.
 * - If you use `scene.useRightHandedSystem = true`, no conversion is applied.
 *
 * @see https://immersive-web.github.io/body-tracking/
 */
export declare class WebXRBodyTracking extends WebXRAbstractFeature {
    /** Configuration options for the body tracking feature. */
    readonly options: IWebXRBodyTrackingOptions;
    /**
     * The module's name, used when enabling the feature on the features manager.
     * Value: `"xr-body-tracking"`.
     */
    static readonly Name: "xr-body-tracking";
    /**
     * The (Babylon) version of this module.
     * This is an integer representing the implementation version.
     * This number does not correspond to the WebXR specs version.
     */
    static readonly Version = 1;
    /**
     * Observable fired when body tracking starts (i.e. the first frame where
     * `XRFrame.body` returns valid data).
     */
    readonly onBodyTrackingStartedObservable: Observable<WebXRTrackedBody>;
    /**
     * Observable fired when body tracking is lost (i.e. `XRFrame.body` becomes
     * `null` or returns no valid poses after previously tracking).
     */
    readonly onBodyTrackingEndedObservable: Observable<void>;
    /**
     * Observable fired every frame that has valid body tracking data.
     * At the point of notification, all joint transforms are up-to-date.
     */
    readonly onBodyTrackingFrameUpdateObservable: Observable<WebXRTrackedBody>;
    /**
     * Observable fired when the body mesh has been set via {@link setBodyMesh}
     * or during initial configuration.
     */
    readonly onBodyMeshSetObservable: Observable<WebXRTrackedBody>;
    /** The current tracked body, or null when not tracking. */
    private _trackedBody;
    /** True while we have an active body tracking session. */
    private _isTracking;
    /** Observer for world scale changes, so the body mesh can be rescaled. */
    private _worldScaleObserver;
    /**
     * Debug info from the feature-level frame loop.
     * Shows why `_onXRFrame` did or did not call `updateFromXRFrame`.
     * @internal
     */
    _lastFrameDebugInfo: string;
    /**
     * Get the currently tracked body, if any.
     */
    get trackedBody(): Nullable<WebXRTrackedBody>;
    /**
     * Returns `true` while body tracking data is actively being received.
     */
    get isTracking(): boolean;
    /**
     * Construct a new WebXRBodyTracking feature.
     * @param _xrSessionManager The XR session manager.
     * @param options Configuration options.
     */
    constructor(_xrSessionManager: WebXRSessionManager, 
    /** Configuration options for the body tracking feature. */
    options?: IWebXRBodyTrackingOptions);
    /**
     * Attach a rigged body mesh (or replace the current one) at any time.
     *
     * This is a convenience method that forwards to the underlying
     * {@link WebXRTrackedBody.setBodyMesh}.  The body does not need to be
     * already tracking for this to work — the mesh will be applied once
     * tracking begins.
     *
     * @param bodyMesh The rigged mesh to drive.
     * @param rigMapping Optional mapping from {@link WebXRBodyJoint} names to bone names.
     */
    setBodyMesh(bodyMesh: AbstractMesh, rigMapping?: XRBodyMeshRigMapping): void;
    /**
     * Attach the feature.
     * Called by the features manager when the XR session initialises.
     *
     * Body tracking is a draft WebXR spec.  Some UAs (e.g. Meta Quest) provide
     * body data on `XRFrame.body` but do not list `"body-tracking"` in
     * `session.enabledFeatures`.  To handle this, we temporarily clear
     * {@link xrNativeFeatureName} before calling the base `attach()` so the
     * enabled-features check is skipped, then restore it afterwards.
     * @returns `true` if attachment succeeded.
     */
    attach(): boolean;
    /**
     * Detach the feature.
     * Called by the features manager when the XR session ends.
     * @returns `true` if detachment succeeded.
     */
    detach(): boolean;
    /**
     * Dispose this feature and all resources.
     */
    dispose(): void;
    /**
     * Called every XR frame by the base class.
     * Reads body joint data from the XR runtime and updates transforms.
     * @param xrFrame The current XRFrame.
     */
    protected _onXRFrame(xrFrame: XRFrame): void;
    /**
     * Returns the complete ordered list of body joint names tracked by this feature.
     * Useful for iterating over all joints or building UI.
     */
    static get AllBodyJoints(): readonly WebXRBodyJoint[];
    /**
     * Capture a single-frame snapshot of all 83 joints and copy it to the
     * clipboard.  Call this from a playground button or the console while
     * wearing the headset:
     *
     * ```typescript
     * bodyTracking.snapshotFrameToClipboard();
     * ```
     *
     * The JSON can later be loaded offline to replay the bone-local
     * computation without a headset.
     * @returns A promise that resolves when the copy completes, or rejects
     *   if no body is currently tracked.
     */
    snapshotFrameToClipboardAsync(): Promise<void>;
}
/**
 * Register side effects for webXRBodyTracking.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterWebXRBodyTracking(): void;
