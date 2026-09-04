/** This file must only contain pure code and pure imports */
import { WebXRAbstractFeature } from "./WebXRAbstractFeature.js";
import { WebXRFeatureName, WebXRFeaturesManager } from "../webXRFeaturesManager.js";
import { Mesh } from "../../Meshes/mesh.pure.js";
import { Matrix, Quaternion } from "../../Maths/math.vector.pure.js";
import { PhysicsImpostor } from "../../Physics/v1/physicsImpostor.pure.js";
import { PhysicsAggregate } from "../../Physics/v2/physicsAggregate.js";
import { Observable } from "../../Misc/observable.pure.js";
import { RegisterInstancedMesh } from "../../Meshes/instancedMesh.pure.js";
import { SceneLoader } from "../../Loading/sceneLoader.js";
import { Color3 } from "../../Maths/math.color.pure.js";
import { NodeMaterialParseFromFileAsync } from "../../Materials/Node/nodeMaterial.pure.js";
import { Material } from "../../Materials/material.pure.js";
import { CreateIcoSphere } from "../../Meshes/Builders/icoSphereBuilder.pure.js";
import { TransformNode } from "../../Meshes/transformNode.pure.js";
import { Axis } from "../../Maths/math.axis.js";

import { Tools } from "../../Misc/tools.pure.js";
/**
 * Parts of the hands divided to writs and finger names
 */
export var HandPart;
(function (HandPart) {
    /**
     * HandPart - Wrist
     */
    HandPart["WRIST"] = "wrist";
    /**
     * HandPart - The thumb
     */
    HandPart["THUMB"] = "thumb";
    /**
     * HandPart - Index finger
     */
    HandPart["INDEX"] = "index";
    /**
     * HandPart - Middle finger
     */
    HandPart["MIDDLE"] = "middle";
    /**
     * HandPart - Ring finger
     */
    HandPart["RING"] = "ring";
    /**
     * HandPart - Little finger
     */
    HandPart["LITTLE"] = "little";
})(HandPart || (HandPart = {}));
/**
 * Joints of the hand as defined by the WebXR specification.
 * https://immersive-web.github.io/webxr-hand-input/#skeleton-joints-section
 */
export var WebXRHandJoint;
(function (WebXRHandJoint) {
    /** Wrist */
    WebXRHandJoint["WRIST"] = "wrist";
    /** Thumb near wrist */
    WebXRHandJoint["THUMB_METACARPAL"] = "thumb-metacarpal";
    /** Thumb first knuckle */
    WebXRHandJoint["THUMB_PHALANX_PROXIMAL"] = "thumb-phalanx-proximal";
    /** Thumb second knuckle */
    WebXRHandJoint["THUMB_PHALANX_DISTAL"] = "thumb-phalanx-distal";
    /** Thumb tip */
    WebXRHandJoint["THUMB_TIP"] = "thumb-tip";
    /** Index finger near wrist */
    WebXRHandJoint["INDEX_FINGER_METACARPAL"] = "index-finger-metacarpal";
    /** Index finger first knuckle */
    WebXRHandJoint["INDEX_FINGER_PHALANX_PROXIMAL"] = "index-finger-phalanx-proximal";
    /** Index finger second knuckle */
    WebXRHandJoint["INDEX_FINGER_PHALANX_INTERMEDIATE"] = "index-finger-phalanx-intermediate";
    /** Index finger third knuckle */
    WebXRHandJoint["INDEX_FINGER_PHALANX_DISTAL"] = "index-finger-phalanx-distal";
    /** Index finger tip */
    WebXRHandJoint["INDEX_FINGER_TIP"] = "index-finger-tip";
    /** Middle finger near wrist */
    WebXRHandJoint["MIDDLE_FINGER_METACARPAL"] = "middle-finger-metacarpal";
    /** Middle finger first knuckle */
    WebXRHandJoint["MIDDLE_FINGER_PHALANX_PROXIMAL"] = "middle-finger-phalanx-proximal";
    /** Middle finger second knuckle */
    WebXRHandJoint["MIDDLE_FINGER_PHALANX_INTERMEDIATE"] = "middle-finger-phalanx-intermediate";
    /** Middle finger third knuckle */
    WebXRHandJoint["MIDDLE_FINGER_PHALANX_DISTAL"] = "middle-finger-phalanx-distal";
    /** Middle finger tip */
    WebXRHandJoint["MIDDLE_FINGER_TIP"] = "middle-finger-tip";
    /** Ring finger near wrist */
    WebXRHandJoint["RING_FINGER_METACARPAL"] = "ring-finger-metacarpal";
    /** Ring finger first knuckle */
    WebXRHandJoint["RING_FINGER_PHALANX_PROXIMAL"] = "ring-finger-phalanx-proximal";
    /** Ring finger second knuckle */
    WebXRHandJoint["RING_FINGER_PHALANX_INTERMEDIATE"] = "ring-finger-phalanx-intermediate";
    /** Ring finger third knuckle */
    WebXRHandJoint["RING_FINGER_PHALANX_DISTAL"] = "ring-finger-phalanx-distal";
    /** Ring finger tip */
    WebXRHandJoint["RING_FINGER_TIP"] = "ring-finger-tip";
    /** Pinky finger near wrist */
    WebXRHandJoint["PINKY_FINGER_METACARPAL"] = "pinky-finger-metacarpal";
    /** Pinky finger first knuckle */
    WebXRHandJoint["PINKY_FINGER_PHALANX_PROXIMAL"] = "pinky-finger-phalanx-proximal";
    /** Pinky finger second knuckle */
    WebXRHandJoint["PINKY_FINGER_PHALANX_INTERMEDIATE"] = "pinky-finger-phalanx-intermediate";
    /** Pinky finger third knuckle */
    WebXRHandJoint["PINKY_FINGER_PHALANX_DISTAL"] = "pinky-finger-phalanx-distal";
    /** Pinky finger tip */
    WebXRHandJoint["PINKY_FINGER_TIP"] = "pinky-finger-tip";
})(WebXRHandJoint || (WebXRHandJoint = {}));
const HandJointReferenceArray = [
    "wrist" /* WebXRHandJoint.WRIST */,
    "thumb-metacarpal" /* WebXRHandJoint.THUMB_METACARPAL */,
    "thumb-phalanx-proximal" /* WebXRHandJoint.THUMB_PHALANX_PROXIMAL */,
    "thumb-phalanx-distal" /* WebXRHandJoint.THUMB_PHALANX_DISTAL */,
    "thumb-tip" /* WebXRHandJoint.THUMB_TIP */,
    "index-finger-metacarpal" /* WebXRHandJoint.INDEX_FINGER_METACARPAL */,
    "index-finger-phalanx-proximal" /* WebXRHandJoint.INDEX_FINGER_PHALANX_PROXIMAL */,
    "index-finger-phalanx-intermediate" /* WebXRHandJoint.INDEX_FINGER_PHALANX_INTERMEDIATE */,
    "index-finger-phalanx-distal" /* WebXRHandJoint.INDEX_FINGER_PHALANX_DISTAL */,
    "index-finger-tip" /* WebXRHandJoint.INDEX_FINGER_TIP */,
    "middle-finger-metacarpal" /* WebXRHandJoint.MIDDLE_FINGER_METACARPAL */,
    "middle-finger-phalanx-proximal" /* WebXRHandJoint.MIDDLE_FINGER_PHALANX_PROXIMAL */,
    "middle-finger-phalanx-intermediate" /* WebXRHandJoint.MIDDLE_FINGER_PHALANX_INTERMEDIATE */,
    "middle-finger-phalanx-distal" /* WebXRHandJoint.MIDDLE_FINGER_PHALANX_DISTAL */,
    "middle-finger-tip" /* WebXRHandJoint.MIDDLE_FINGER_TIP */,
    "ring-finger-metacarpal" /* WebXRHandJoint.RING_FINGER_METACARPAL */,
    "ring-finger-phalanx-proximal" /* WebXRHandJoint.RING_FINGER_PHALANX_PROXIMAL */,
    "ring-finger-phalanx-intermediate" /* WebXRHandJoint.RING_FINGER_PHALANX_INTERMEDIATE */,
    "ring-finger-phalanx-distal" /* WebXRHandJoint.RING_FINGER_PHALANX_DISTAL */,
    "ring-finger-tip" /* WebXRHandJoint.RING_FINGER_TIP */,
    "pinky-finger-metacarpal" /* WebXRHandJoint.PINKY_FINGER_METACARPAL */,
    "pinky-finger-phalanx-proximal" /* WebXRHandJoint.PINKY_FINGER_PHALANX_PROXIMAL */,
    "pinky-finger-phalanx-intermediate" /* WebXRHandJoint.PINKY_FINGER_PHALANX_INTERMEDIATE */,
    "pinky-finger-phalanx-distal" /* WebXRHandJoint.PINKY_FINGER_PHALANX_DISTAL */,
    "pinky-finger-tip" /* WebXRHandJoint.PINKY_FINGER_TIP */,
];
const HandPartsDefinition = {
    ["wrist" /* HandPart.WRIST */]: ["wrist" /* WebXRHandJoint.WRIST */],
    ["thumb" /* HandPart.THUMB */]: ["thumb-metacarpal" /* WebXRHandJoint.THUMB_METACARPAL */, "thumb-phalanx-proximal" /* WebXRHandJoint.THUMB_PHALANX_PROXIMAL */, "thumb-phalanx-distal" /* WebXRHandJoint.THUMB_PHALANX_DISTAL */, "thumb-tip" /* WebXRHandJoint.THUMB_TIP */],
    ["index" /* HandPart.INDEX */]: [
        "index-finger-metacarpal" /* WebXRHandJoint.INDEX_FINGER_METACARPAL */,
        "index-finger-phalanx-proximal" /* WebXRHandJoint.INDEX_FINGER_PHALANX_PROXIMAL */,
        "index-finger-phalanx-intermediate" /* WebXRHandJoint.INDEX_FINGER_PHALANX_INTERMEDIATE */,
        "index-finger-phalanx-distal" /* WebXRHandJoint.INDEX_FINGER_PHALANX_DISTAL */,
        "index-finger-tip" /* WebXRHandJoint.INDEX_FINGER_TIP */,
    ],
    ["middle" /* HandPart.MIDDLE */]: [
        "middle-finger-metacarpal" /* WebXRHandJoint.MIDDLE_FINGER_METACARPAL */,
        "middle-finger-phalanx-proximal" /* WebXRHandJoint.MIDDLE_FINGER_PHALANX_PROXIMAL */,
        "middle-finger-phalanx-intermediate" /* WebXRHandJoint.MIDDLE_FINGER_PHALANX_INTERMEDIATE */,
        "middle-finger-phalanx-distal" /* WebXRHandJoint.MIDDLE_FINGER_PHALANX_DISTAL */,
        "middle-finger-tip" /* WebXRHandJoint.MIDDLE_FINGER_TIP */,
    ],
    ["ring" /* HandPart.RING */]: [
        "ring-finger-metacarpal" /* WebXRHandJoint.RING_FINGER_METACARPAL */,
        "ring-finger-phalanx-proximal" /* WebXRHandJoint.RING_FINGER_PHALANX_PROXIMAL */,
        "ring-finger-phalanx-intermediate" /* WebXRHandJoint.RING_FINGER_PHALANX_INTERMEDIATE */,
        "ring-finger-phalanx-distal" /* WebXRHandJoint.RING_FINGER_PHALANX_DISTAL */,
        "ring-finger-tip" /* WebXRHandJoint.RING_FINGER_TIP */,
    ],
    ["little" /* HandPart.LITTLE */]: [
        "pinky-finger-metacarpal" /* WebXRHandJoint.PINKY_FINGER_METACARPAL */,
        "pinky-finger-phalanx-proximal" /* WebXRHandJoint.PINKY_FINGER_PHALANX_PROXIMAL */,
        "pinky-finger-phalanx-intermediate" /* WebXRHandJoint.PINKY_FINGER_PHALANX_INTERMEDIATE */,
        "pinky-finger-phalanx-distal" /* WebXRHandJoint.PINKY_FINGER_PHALANX_DISTAL */,
        "pinky-finger-tip" /* WebXRHandJoint.PINKY_FINGER_TIP */,
    ],
};
/**
 * Representing a single hand (with its corresponding native XRHand object)
 */
export class WebXRHand {
    /**
     * Get the hand mesh.
     */
    get handMesh() {
        return this._handMesh;
    }
    /**
     * Get meshes of part of the hand.
     * @param part The part of hand to get.
     * @returns An array of meshes that correlate to the hand part requested.
     */
    getHandPartMeshes(part) {
        return HandPartsDefinition[part].map((name) => this._jointMeshes[HandJointReferenceArray.indexOf(name)]);
    }
    /**
     * Retrieves a mesh linked to a named joint in the hand.
     * @param jointName The name of the joint.
     * @returns An AbstractMesh whose position corresponds with the joint position.
     */
    getJointMesh(jointName) {
        return this._jointMeshes[HandJointReferenceArray.indexOf(jointName)];
    }
    /**
     * Construct a new hand object
     * @param xrController The controller to which the hand correlates.
     * @param _jointMeshes The meshes to be used to track the hand joints.
     * @param _handMesh An optional hand mesh.
     * @param rigMapping An optional rig mapping for the hand mesh.
     *                   If not provided (but a hand mesh is provided),
     *                   it will be assumed that the hand mesh's bones are named
     *                   directly after the WebXR bone names.
     * @param _leftHandedMeshes Are the hand meshes left-handed-system meshes
     * @param _jointsInvisible Are the tracked joint meshes visible
     * @param _jointScaleFactor Scale factor for all joint meshes
     */
    constructor(
    /** The controller to which the hand correlates. */
    xrController, _jointMeshes, _handMesh, 
    /** An optional rig mapping for the hand mesh. If not provided (but a hand mesh is provided),
     * it will be assumed that the hand mesh's bones are named directly after the WebXR bone names. */
    rigMapping, _leftHandedMeshes = false, _jointsInvisible = false, _jointScaleFactor = 1) {
        this.xrController = xrController;
        this._jointMeshes = _jointMeshes;
        this._handMesh = _handMesh;
        this.rigMapping = rigMapping;
        this._leftHandedMeshes = _leftHandedMeshes;
        this._jointsInvisible = _jointsInvisible;
        this._jointScaleFactor = _jointScaleFactor;
        /**
         * This observable will notify registered observers when the hand object has been set with a new mesh.
         * you can get the hand mesh using `webxrHand.handMesh`
         */
        this.onHandMeshSetObservable = new Observable();
        /**
         * Transform nodes that will directly receive the transforms from the WebXR matrix data.
         */
        this._jointTransforms = new Array(HandJointReferenceArray.length);
        /**
         * The float array that will directly receive the transform matrix data from WebXR.
         */
        this._jointTransformMatrices = new Float32Array(HandJointReferenceArray.length * 16);
        this._jointSpaces = new Array(HandJointReferenceArray.length);
        this._tempJointMatrix = new Matrix();
        /**
         * The float array that will directly receive the joint radii from WebXR.
         */
        this._jointRadii = new Float32Array(HandJointReferenceArray.length);
        /**
         * The hand mesh's top-most parent, if any.
         */
        this._handMeshRoot = null;
        this._scene = _jointMeshes[0].getScene();
        // Initialize the joint transform quaternions and link the transforms to the bones.
        for (let jointIdx = 0; jointIdx < this._jointTransforms.length; jointIdx++) {
            this._jointTransforms[jointIdx] = new TransformNode(HandJointReferenceArray[jointIdx], this._scene);
            this._jointTransforms[jointIdx].rotationQuaternion = new Quaternion();
            // Set the rotation quaternion so we can use it later for tracking.
            if (!_jointMeshes[jointIdx].rotationQuaternion) {
                _jointMeshes[jointIdx].rotationQuaternion = new Quaternion();
            }
            _jointMeshes[jointIdx].rotationQuaternion.set(0, 0, 0, 1);
        }
        if (_handMesh) {
            // Note that this logic needs to happen after we initialize the joint tracking transform nodes.
            this.setHandMesh(_handMesh, rigMapping);
        }
        // hide the motion controller, if available/loaded
        if (this.xrController.motionController) {
            if (this.xrController.motionController.rootMesh) {
                this.xrController.motionController.rootMesh.dispose(false, true);
            }
        }
        this.xrController.onMotionControllerInitObservable.add((motionController) => {
            motionController._doNotLoadControllerMesh = true;
        });
    }
    /**
     * Sets the current hand mesh to render for the WebXRHand.
     * @param handMesh The rigged hand mesh that will be tracked to the user's hand.
     * @param rigMapping The mapping from XRHandJoint to bone names to use with the mesh.
     * @param _xrSessionManager The XRSessionManager used to initialize the hand mesh.
     */
    setHandMesh(handMesh, rigMapping, _xrSessionManager) {
        this._handMesh = handMesh;
        this._handMeshRoot = this._handMesh;
        while (this._handMeshRoot.parent) {
            this._handMeshRoot = this._handMeshRoot.parent;
        }
        // Avoid any strange frustum culling. We will manually control visibility via attach and detach.
        handMesh.alwaysSelectAsActiveMesh = true;
        const children = handMesh.getChildMeshes();
        for (const mesh of children) {
            mesh.alwaysSelectAsActiveMesh = true;
        }
        // Link the bones in the hand mesh to the transform nodes that will be bound to the WebXR tracked joints.
        if (this._handMesh.skeleton) {
            const handMeshSkeleton = this._handMesh.skeleton;
            for (let jointIdx = 0; jointIdx < HandJointReferenceArray.length; jointIdx++) {
                const jointName = HandJointReferenceArray[jointIdx];
                const jointBoneIdx = handMeshSkeleton.getBoneIndexByName(rigMapping ? rigMapping[jointName] : jointName);
                if (jointBoneIdx !== -1) {
                    handMeshSkeleton.bones[jointBoneIdx].linkTransformNode(this._jointTransforms[jointIdx]);
                }
            }
        }
        this.onHandMeshSetObservable.notifyObservers(this);
    }
    /**
     * Update this hand from the latest xr frame.
     * @param xrFrame The latest frame received from WebXR.
     * @param referenceSpace The current viewer reference space.
     * @param xrCamera the xr camera, used for parenting
     */
    updateFromXRFrame(xrFrame, referenceSpace, xrCamera) {
        const hand = this.xrController.inputSource.hand;
        if (!hand) {
            return;
        }
        // TODO: Modify webxr.d.ts to better match WebXR IDL so we don't need this any cast.
        const anyHand = hand;
        for (let i = 0; i < HandJointReferenceArray.length; ++i) {
            this._jointSpaces[i] = anyHand[HandJointReferenceArray[i]] || hand.get(HandJointReferenceArray[i]);
        }
        let trackingSuccessful = false;
        if (xrFrame.fillPoses && xrFrame.fillJointRadii) {
            trackingSuccessful = xrFrame.fillPoses(this._jointSpaces, referenceSpace, this._jointTransformMatrices) && xrFrame.fillJointRadii(this._jointSpaces, this._jointRadii);
        }
        else if (xrFrame.getJointPose) {
            trackingSuccessful = true;
            // Warning: This codepath is slow by comparison, only here for compat.
            for (let jointIdx = 0; jointIdx < this._jointSpaces.length; jointIdx++) {
                const jointPose = xrFrame.getJointPose(this._jointSpaces[jointIdx], referenceSpace);
                if (jointPose) {
                    this._jointTransformMatrices.set(jointPose.transform.matrix, jointIdx * 16);
                    this._jointRadii[jointIdx] = jointPose.radius || 0.008;
                }
                else {
                    trackingSuccessful = false;
                    break;
                }
            }
        }
        if (!trackingSuccessful) {
            return;
        }
        // L1 Cache Optimization: Invert to LHS in valid Babylon systems IN PLACE
        // This linear loop is much faster than doing it per-object and avoids cache thrashing
        if (!this._scene.useRightHandedSystem) {
            for (let i = 0; i < HandJointReferenceArray.length; ++i) {
                const offset = i * 16;
                this._jointTransformMatrices[offset + 2] *= -1;
                this._jointTransformMatrices[offset + 6] *= -1;
                this._jointTransformMatrices[offset + 8] *= -1;
                this._jointTransformMatrices[offset + 9] *= -1;
                this._jointTransformMatrices[offset + 14] *= -1;
            }
        }
        for (let jointIdx = 0; jointIdx < HandJointReferenceArray.length; jointIdx++) {
            const jointTransform = this._jointTransforms[jointIdx];
            Matrix.FromArrayToRef(this._jointTransformMatrices, jointIdx * 16, this._tempJointMatrix);
            this._tempJointMatrix.decompose(undefined, jointTransform.rotationQuaternion, jointTransform.position);
            // The radius we need to make the joint in order for it to roughly cover the joints of the user's real hand.
            const scaledJointRadius = this._jointRadii[jointIdx] * this._jointScaleFactor;
            const jointMesh = this._jointMeshes[jointIdx];
            jointMesh.isVisible = !this._handMesh && !this._jointsInvisible;
            jointMesh.position.copyFrom(jointTransform.position);
            jointMesh.rotationQuaternion.copyFrom(jointTransform.rotationQuaternion);
            jointMesh.scaling.setAll(scaledJointRadius);
            jointMesh.parent = xrCamera.parent;
            // Restore correct transform for meshes that are NOT left-handed (e.g. default GLTF)
            // The buffer is now LHS, so if the mesh expects RHS, we must un-flip.
            if (!this._leftHandedMeshes && !this._scene.useRightHandedSystem && this._handMesh) {
                jointTransform.position.z *= -1;
                jointTransform.rotationQuaternion.z *= -1;
                jointTransform.rotationQuaternion.w *= -1;
            }
        }
        if (this._handMesh) {
            this._handMesh.isVisible = true;
            if (this._handMeshRoot) {
                this._handMeshRoot.parent = xrCamera.parent;
            }
        }
        this.xrController.pointer.parent = xrCamera.parent;
    }
    /**
     * Dispose this Hand object
     * @param disposeMeshes Should the meshes be disposed as well
     */
    dispose(disposeMeshes = false) {
        if (this._handMesh) {
            if (disposeMeshes) {
                this._handMesh.skeleton?.dispose();
                this._handMesh.dispose(false, true);
            }
            else {
                this._handMesh.isVisible = false;
            }
        }
        for (const transform of this._jointTransforms) {
            transform.dispose();
        }
        this._jointTransforms.length = 0;
        this.onHandMeshSetObservable.clear();
    }
}
/**
 * WebXR Hand Joint tracking feature, available for selected browsers and devices
 */
export class WebXRHandTracking extends WebXRAbstractFeature {
    static _GenerateTrackedJointMeshes(options, originalMesh) {
        const meshes = { left: [], right: [] };
        originalMesh.isVisible = !!options.jointMeshes?.keepOriginalVisible;
        for (const handedness of ["left", "right"]) {
            const h = handedness;
            const trackedMeshes = [];
            for (let i = 0; i < HandJointReferenceArray.length; i++) {
                let newInstance;
                if (originalMesh instanceof Mesh) {
                    newInstance = originalMesh.createInstance(`${handedness}-handJoint-${i}`);
                }
                else {
                    newInstance = originalMesh.clone(`${handedness}-handJoint-${i}`, null);
                }
                if (options.jointMeshes?.onHandJointMeshGenerated) {
                    const returnedMesh = options.jointMeshes.onHandJointMeshGenerated(newInstance, i, h);
                    if (returnedMesh) {
                        if (returnedMesh !== newInstance) {
                            newInstance.dispose();
                            newInstance = returnedMesh;
                        }
                    }
                }
                newInstance.isPickable = false;
                if (options.jointMeshes?.enablePhysics) {
                    const props = options.jointMeshes?.physicsProps;
                    // downscale the instances so that physics will be initialized correctly
                    newInstance.scaling.setAll(0.02);
                    // Detect physics version
                    const scene = newInstance.getScene();
                    const physicsEngine = scene.getPhysicsEngine();
                    const physicsVersion = physicsEngine?.getPluginVersion() || 1;
                    if (physicsVersion === 2) {
                        // V2 physics
                        const impostorType = props?.impostorType !== undefined ? props.impostorType : PhysicsImpostor.SphereImpostor;
                        let shapeType;
                        // Map v1 impostor types to v2 shape types
                        switch (impostorType) {
                            case PhysicsImpostor.SphereImpostor:
                                shapeType = 0 /* PhysicsShapeType.SPHERE */;
                                break;
                            case PhysicsImpostor.BoxImpostor:
                                shapeType = 3 /* PhysicsShapeType.BOX */;
                                break;
                            case PhysicsImpostor.CapsuleImpostor:
                                shapeType = 1 /* PhysicsShapeType.CAPSULE */;
                                break;
                            default:
                                shapeType = 0 /* PhysicsShapeType.SPHERE */;
                        }
                        const aggregate = new PhysicsAggregate(newInstance, shapeType, {
                            mass: 0,
                            friction: props?.friction ?? 0.2,
                            restitution: props?.restitution ?? 0.2,
                        }, scene);
                        aggregate.body.setMotionType(1 /* PhysicsMotionType.ANIMATED */);
                        aggregate.body.disableSync = true;
                    }
                    else {
                        // V1 physics
                        const type = props?.impostorType !== undefined ? props.impostorType : PhysicsImpostor.SphereImpostor;
                        newInstance.physicsImpostor = new PhysicsImpostor(newInstance, type, props ? { mass: 0, ...props } : { mass: 0 });
                    }
                }
                newInstance.isVisible = false;
                newInstance.rotationQuaternion = new Quaternion();
                trackedMeshes.push(newInstance);
            }
            meshes[h] = trackedMeshes;
        }
        return meshes;
    }
    static async _GenerateDefaultHandMeshesAsync(xrSessionManager, options) {
        const scene = xrSessionManager.scene;
        // eslint-disable-next-line no-async-promise-executor
        return await new Promise(async (resolve) => {
            const riggedMeshes = {};
            // check the cache, defensive
            if (WebXRHandTracking._RightHandGLB?.meshes[1]?.isDisposed()) {
                WebXRHandTracking._RightHandGLB = null;
            }
            if (WebXRHandTracking._LeftHandGLB?.meshes[1]?.isDisposed()) {
                WebXRHandTracking._LeftHandGLB = null;
            }
            const handsDefined = !!(WebXRHandTracking._RightHandGLB && WebXRHandTracking._LeftHandGLB);
            // load them in parallel
            const defaulrHandGLBUrl = Tools.GetAssetUrl(WebXRHandTracking.DEFAULT_HAND_MODEL_BASE_URL);
            const handGLBs = await Promise.all([
                WebXRHandTracking._RightHandGLB || SceneLoader.ImportMeshAsync("", defaulrHandGLBUrl, WebXRHandTracking.DEFAULT_HAND_MODEL_RIGHT_FILENAME, scene),
                WebXRHandTracking._LeftHandGLB || SceneLoader.ImportMeshAsync("", defaulrHandGLBUrl, WebXRHandTracking.DEFAULT_HAND_MODEL_LEFT_FILENAME, scene),
            ]);
            // eslint-disable-next-line require-atomic-updates
            WebXRHandTracking._RightHandGLB = handGLBs[0];
            // eslint-disable-next-line require-atomic-updates
            WebXRHandTracking._LeftHandGLB = handGLBs[1];
            const shaderUrl = Tools.GetAssetUrl(WebXRHandTracking.DEFAULT_HAND_MODEL_SHADER_URL);
            const handShader = await NodeMaterialParseFromFileAsync("handShader", shaderUrl, scene, undefined, true);
            // depth prepass and alpha mode
            handShader.needDepthPrePass = true;
            handShader.transparencyMode = Material.MATERIAL_ALPHABLEND;
            handShader.alphaMode = 2;
            // build node materials
            handShader.build(false);
            // shader
            const handColors = {
                base: Color3.FromInts(116, 63, 203),
                fresnel: Color3.FromInts(149, 102, 229),
                fingerColor: Color3.FromInts(177, 130, 255),
                tipFresnel: Color3.FromInts(220, 200, 255),
                ...options?.handMeshes?.customColors,
            };
            const handNodes = {
                base: handShader.getBlockByName("baseColor"),
                fresnel: handShader.getBlockByName("fresnelColor"),
                fingerColor: handShader.getBlockByName("fingerColor"),
                tipFresnel: handShader.getBlockByName("tipFresnelColor"),
            };
            handNodes.base.value = handColors.base;
            handNodes.fresnel.value = handColors.fresnel;
            handNodes.fingerColor.value = handColors.fingerColor;
            handNodes.tipFresnel.value = handColors.tipFresnel;
            const isMultiview = xrSessionManager._getBaseLayerWrapper()?.isMultiview;
            const hd = ["left", "right"];
            for (const handedness of hd) {
                const handGLB = handedness == "left" ? WebXRHandTracking._LeftHandGLB : WebXRHandTracking._RightHandGLB;
                if (!handGLB) {
                    // this should never happen!
                    throw new Error("Could not load hand model");
                }
                const handMesh = handGLB.meshes[1];
                handMesh._internalAbstractMeshDataInfo._computeBonesUsingShaders = true;
                if (handMesh.skeleton) {
                    handMesh.skeleton.useTextureToStoreBoneMatrices = false;
                }
                // if in multiview do not use the material
                if (!isMultiview && !options?.handMeshes?.disableHandShader) {
                    handMesh.material = handShader.clone(`${handedness}HandShaderClone`, true);
                    handMesh.material.freeze();
                }
                handMesh.isVisible = false;
                riggedMeshes[handedness] = handMesh;
                // single change for left handed systems
                if (!handsDefined && !scene.useRightHandedSystem) {
                    handGLB.meshes[1].rotate(Axis.Y, Math.PI);
                }
            }
            handShader.dispose();
            resolve({ left: riggedMeshes.left, right: riggedMeshes.right });
        });
    }
    /**
     * Generates a mapping from XRHandJoint to bone name for the default hand mesh.
     * @param handedness The handedness being mapped for.
     * @returns A mapping from XRHandJoint to bone name.
     */
    static _GenerateDefaultHandMeshRigMapping(handedness) {
        const h = handedness == "right" ? "R" : "L";
        return {
            ["wrist" /* WebXRHandJoint.WRIST */]: `wrist_${h}`,
            ["thumb-metacarpal" /* WebXRHandJoint.THUMB_METACARPAL */]: `thumb_metacarpal_${h}`,
            ["thumb-phalanx-proximal" /* WebXRHandJoint.THUMB_PHALANX_PROXIMAL */]: `thumb_proxPhalanx_${h}`,
            ["thumb-phalanx-distal" /* WebXRHandJoint.THUMB_PHALANX_DISTAL */]: `thumb_distPhalanx_${h}`,
            ["thumb-tip" /* WebXRHandJoint.THUMB_TIP */]: `thumb_tip_${h}`,
            ["index-finger-metacarpal" /* WebXRHandJoint.INDEX_FINGER_METACARPAL */]: `index_metacarpal_${h}`,
            ["index-finger-phalanx-proximal" /* WebXRHandJoint.INDEX_FINGER_PHALANX_PROXIMAL */]: `index_proxPhalanx_${h}`,
            ["index-finger-phalanx-intermediate" /* WebXRHandJoint.INDEX_FINGER_PHALANX_INTERMEDIATE */]: `index_intPhalanx_${h}`,
            ["index-finger-phalanx-distal" /* WebXRHandJoint.INDEX_FINGER_PHALANX_DISTAL */]: `index_distPhalanx_${h}`,
            ["index-finger-tip" /* WebXRHandJoint.INDEX_FINGER_TIP */]: `index_tip_${h}`,
            ["middle-finger-metacarpal" /* WebXRHandJoint.MIDDLE_FINGER_METACARPAL */]: `middle_metacarpal_${h}`,
            ["middle-finger-phalanx-proximal" /* WebXRHandJoint.MIDDLE_FINGER_PHALANX_PROXIMAL */]: `middle_proxPhalanx_${h}`,
            ["middle-finger-phalanx-intermediate" /* WebXRHandJoint.MIDDLE_FINGER_PHALANX_INTERMEDIATE */]: `middle_intPhalanx_${h}`,
            ["middle-finger-phalanx-distal" /* WebXRHandJoint.MIDDLE_FINGER_PHALANX_DISTAL */]: `middle_distPhalanx_${h}`,
            ["middle-finger-tip" /* WebXRHandJoint.MIDDLE_FINGER_TIP */]: `middle_tip_${h}`,
            ["ring-finger-metacarpal" /* WebXRHandJoint.RING_FINGER_METACARPAL */]: `ring_metacarpal_${h}`,
            ["ring-finger-phalanx-proximal" /* WebXRHandJoint.RING_FINGER_PHALANX_PROXIMAL */]: `ring_proxPhalanx_${h}`,
            ["ring-finger-phalanx-intermediate" /* WebXRHandJoint.RING_FINGER_PHALANX_INTERMEDIATE */]: `ring_intPhalanx_${h}`,
            ["ring-finger-phalanx-distal" /* WebXRHandJoint.RING_FINGER_PHALANX_DISTAL */]: `ring_distPhalanx_${h}`,
            ["ring-finger-tip" /* WebXRHandJoint.RING_FINGER_TIP */]: `ring_tip_${h}`,
            ["pinky-finger-metacarpal" /* WebXRHandJoint.PINKY_FINGER_METACARPAL */]: `little_metacarpal_${h}`,
            ["pinky-finger-phalanx-proximal" /* WebXRHandJoint.PINKY_FINGER_PHALANX_PROXIMAL */]: `little_proxPhalanx_${h}`,
            ["pinky-finger-phalanx-intermediate" /* WebXRHandJoint.PINKY_FINGER_PHALANX_INTERMEDIATE */]: `little_intPhalanx_${h}`,
            ["pinky-finger-phalanx-distal" /* WebXRHandJoint.PINKY_FINGER_PHALANX_DISTAL */]: `little_distPhalanx_${h}`,
            ["pinky-finger-tip" /* WebXRHandJoint.PINKY_FINGER_TIP */]: `little_tip_${h}`,
        };
    }
    /**
     * Check if the needed objects are defined.
     * This does not mean that the feature is enabled, but that the objects needed are well defined.
     * @returns true if the needed objects for this feature are defined
     */
    isCompatible() {
        return typeof XRHand !== "undefined";
    }
    /**
     * Get the hand object according to the controller id
     * @param controllerId the controller id to which we want to get the hand
     * @returns null if not found or the WebXRHand object if found
     */
    getHandByControllerId(controllerId) {
        return this._attachedHands[controllerId];
    }
    /**
     * Get a hand object according to the requested handedness
     * @param handedness the handedness to request
     * @returns null if not found or the WebXRHand object if found
     */
    getHandByHandedness(handedness) {
        if (handedness == "none") {
            return null;
        }
        return this._trackingHands[handedness];
    }
    /**
     * Creates a new instance of the XR hand tracking feature.
     * @param _xrSessionManager An instance of WebXRSessionManager.
     * @param options Options to use when constructing this feature.
     */
    constructor(_xrSessionManager, 
    /** Options to use when constructing this feature. */
    options) {
        super(_xrSessionManager);
        this.options = options;
        this._attachedHands = {};
        this._trackingHands = { left: null, right: null };
        this._handResources = { jointMeshes: null, handMeshes: null, rigMappings: null };
        this._worldScaleObserver = null;
        /**
         * This observable will notify registered observers when a new hand object was added and initialized
         */
        this.onHandAddedObservable = new Observable();
        /**
         * This observable will notify its observers right before the hand object is disposed
         */
        this.onHandRemovedObservable = new Observable();
        this._attachHand = (xrController) => {
            if (!xrController.inputSource.hand || xrController.inputSource.handedness == "none" || !this._handResources.jointMeshes) {
                return;
            }
            const handedness = xrController.inputSource.handedness;
            const webxrHand = new WebXRHand(xrController, this._handResources.jointMeshes && this._handResources.jointMeshes[handedness], this._handResources.handMeshes && this._handResources.handMeshes[handedness], this._handResources.rigMappings && this._handResources.rigMappings[handedness], this.options.handMeshes?.meshesUseLeftHandedCoordinates, this.options.jointMeshes?.invisible, this.options.jointMeshes?.scaleFactor);
            this._attachedHands[xrController.uniqueId] = webxrHand;
            this._trackingHands[handedness] = webxrHand;
            this.onHandAddedObservable.notifyObservers(webxrHand);
        };
        this._detachHand = (xrController) => {
            this._detachHandById(xrController.uniqueId);
        };
        this.xrNativeFeatureName = "hand-tracking";
        // Support legacy versions of the options object by copying over joint mesh properties
        const anyOptions = options;
        const anyJointMeshOptions = anyOptions.jointMeshes;
        if (anyJointMeshOptions) {
            if (typeof anyJointMeshOptions.disableDefaultHandMesh !== "undefined") {
                options.handMeshes = options.handMeshes || {};
                options.handMeshes.disableDefaultMeshes = anyJointMeshOptions.disableDefaultHandMesh;
            }
            if (typeof anyJointMeshOptions.handMeshes !== "undefined") {
                options.handMeshes = options.handMeshes || {};
                options.handMeshes.customMeshes = anyJointMeshOptions.handMeshes;
            }
            if (typeof anyJointMeshOptions.leftHandedSystemMeshes !== "undefined") {
                options.handMeshes = options.handMeshes || {};
                options.handMeshes.meshesUseLeftHandedCoordinates = anyJointMeshOptions.leftHandedSystemMeshes;
            }
            if (typeof anyJointMeshOptions.rigMapping !== "undefined") {
                options.handMeshes = options.handMeshes || {};
                const leftRigMapping = {};
                const rightRigMapping = {};
                const rigMappingTuples = [
                    [anyJointMeshOptions.rigMapping.left, leftRigMapping],
                    [anyJointMeshOptions.rigMapping.right, rightRigMapping],
                ];
                for (const rigMappingTuple of rigMappingTuples) {
                    const legacyRigMapping = rigMappingTuple[0];
                    const rigMapping = rigMappingTuple[1];
                    for (let index = 0; index < legacyRigMapping.length; index++) {
                        const modelJointName = legacyRigMapping[index];
                        rigMapping[HandJointReferenceArray[index]] = modelJointName;
                    }
                }
                options.handMeshes.customRigMappings = {
                    left: leftRigMapping,
                    right: rightRigMapping,
                };
            }
        }
    }
    /**
     * Attach this feature.
     * Will usually be called by the features manager.
     *
     * @returns true if successful.
     */
    attach() {
        if (!super.attach()) {
            return false;
        }
        if (!this._handResources.jointMeshes) {
            this._originalMesh =
                this._originalMesh || this.options.jointMeshes?.sourceMesh || CreateIcoSphere("jointParent", WebXRHandTracking._ICOSPHERE_PARAMS, this._xrSessionManager.scene);
            this._originalMesh.isVisible = false;
            this._handResources.jointMeshes = WebXRHandTracking._GenerateTrackedJointMeshes(this.options, this._originalMesh);
        }
        this._handResources.handMeshes = this.options.handMeshes?.customMeshes || null;
        this._handResources.rigMappings = this.options.handMeshes?.customRigMappings || null;
        // If they didn't supply custom meshes and are not disabling the default meshes...
        if (!this.options.handMeshes?.customMeshes && !this.options.handMeshes?.disableDefaultMeshes) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises, github/no-then
            WebXRHandTracking._GenerateDefaultHandMeshesAsync(this._xrSessionManager, this.options).then((defaultHandMeshes) => {
                this._handResources.handMeshes = defaultHandMeshes;
                this._handResources.rigMappings = {
                    left: WebXRHandTracking._GenerateDefaultHandMeshRigMapping("left"),
                    right: WebXRHandTracking._GenerateDefaultHandMeshRigMapping("right"),
                };
                // Apply meshes to existing hands if already tracking.
                this._trackingHands.left?.setHandMesh(this._handResources.handMeshes.left, this._handResources.rigMappings.left, this._xrSessionManager);
                this._trackingHands.right?.setHandMesh(this._handResources.handMeshes.right, this._handResources.rigMappings.right, this._xrSessionManager);
                this._handResources.handMeshes.left.scaling.setAll(this._xrSessionManager.worldScalingFactor);
                this._handResources.handMeshes.right.scaling.setAll(this._xrSessionManager.worldScalingFactor);
            });
            this._worldScaleObserver = this._xrSessionManager.onWorldScaleFactorChangedObservable.add((scalingFactors) => {
                if (this._handResources.handMeshes) {
                    this._handResources.handMeshes.left.scaling.scaleInPlace(scalingFactors.newScaleFactor / scalingFactors.previousScaleFactor);
                    this._handResources.handMeshes.right.scaling.scaleInPlace(scalingFactors.newScaleFactor / scalingFactors.previousScaleFactor);
                }
            });
        }
        for (const controller of this.options.xrInput.controllers) {
            this._attachHand(controller);
        }
        this._addNewAttachObserver(this.options.xrInput.onControllerAddedObservable, this._attachHand);
        this._addNewAttachObserver(this.options.xrInput.onControllerRemovedObservable, this._detachHand);
        return true;
    }
    _onXRFrame(_xrFrame) {
        this._trackingHands.left?.updateFromXRFrame(_xrFrame, this._xrSessionManager.referenceSpace, this.options.xrInput.xrCamera);
        this._trackingHands.right?.updateFromXRFrame(_xrFrame, this._xrSessionManager.referenceSpace, this.options.xrInput.xrCamera);
    }
    _detachHandById(controllerId, disposeMesh) {
        const hand = this.getHandByControllerId(controllerId);
        if (hand) {
            const handedness = hand.xrController.inputSource.handedness == "left" ? "left" : "right";
            if (this._trackingHands[handedness]?.xrController.uniqueId === controllerId) {
                this._trackingHands[handedness] = null;
            }
            this.onHandRemovedObservable.notifyObservers(hand);
            hand.dispose(disposeMesh);
            delete this._attachedHands[controllerId];
        }
    }
    /**
     * Detach this feature.
     * Will usually be called by the features manager.
     *
     * @returns true if successful.
     */
    detach() {
        if (!super.detach()) {
            return false;
        }
        const keys = Object.keys(this._attachedHands);
        for (const uniqueId of keys) {
            this._detachHandById(uniqueId, this.options.handMeshes?.disposeOnSessionEnd);
        }
        if (this.options.handMeshes?.disposeOnSessionEnd) {
            if (this._handResources.jointMeshes) {
                for (const trackedMesh of this._handResources.jointMeshes.left) {
                    trackedMesh.dispose();
                }
                for (const trackedMesh of this._handResources.jointMeshes.right) {
                    trackedMesh.dispose();
                }
                this._handResources.jointMeshes = null;
            }
            if (this._handResources.handMeshes) {
                this._handResources.handMeshes.left.dispose();
                this._handResources.handMeshes.right.dispose();
                this._handResources.handMeshes = null;
            }
            if (WebXRHandTracking._RightHandGLB) {
                for (const mesh of WebXRHandTracking._RightHandGLB.meshes) {
                    mesh.dispose();
                }
            }
            if (WebXRHandTracking._LeftHandGLB) {
                for (const mesh of WebXRHandTracking._LeftHandGLB.meshes) {
                    mesh.dispose();
                }
            }
            WebXRHandTracking._RightHandGLB = null;
            WebXRHandTracking._LeftHandGLB = null;
            this._originalMesh?.dispose();
            this._originalMesh = undefined;
        }
        // remove world scale observer
        if (this._worldScaleObserver) {
            this._xrSessionManager.onWorldScaleFactorChangedObservable.remove(this._worldScaleObserver);
        }
        return true;
    }
    /**
     * Dispose this feature and all of the resources attached.
     */
    dispose() {
        super.dispose();
        this.onHandAddedObservable.clear();
        this.onHandRemovedObservable.clear();
        if (this._handResources.handMeshes && !this.options.handMeshes?.customMeshes) {
            // this will dispose the cached meshes
            this._handResources.handMeshes.left.dispose();
            this._handResources.handMeshes.right.dispose();
            // remove the cached meshes
            if (WebXRHandTracking._RightHandGLB) {
                for (const mesh of WebXRHandTracking._RightHandGLB.meshes) {
                    mesh.dispose();
                }
            }
            if (WebXRHandTracking._LeftHandGLB) {
                for (const mesh of WebXRHandTracking._LeftHandGLB.meshes) {
                    mesh.dispose();
                }
            }
            WebXRHandTracking._RightHandGLB = null;
            WebXRHandTracking._LeftHandGLB = null;
        }
        if (this._handResources.jointMeshes) {
            for (const trackedMesh of this._handResources.jointMeshes.left) {
                trackedMesh.dispose();
            }
            for (const trackedMesh of this._handResources.jointMeshes.right) {
                trackedMesh.dispose();
            }
        }
    }
}
/**
 * The module's name
 */
WebXRHandTracking.Name = WebXRFeatureName.HAND_TRACKING;
/**
 * The (Babylon) version of this module.
 * This is an integer representing the implementation version.
 * This number does not correspond to the WebXR specs version
 */
WebXRHandTracking.Version = 1;
/** The base URL for the default hand model. */
WebXRHandTracking.DEFAULT_HAND_MODEL_BASE_URL = "https://assets.babylonjs.com/core/HandMeshes/";
/** The filename to use for the default right hand model. */
WebXRHandTracking.DEFAULT_HAND_MODEL_RIGHT_FILENAME = "r_hand_rhs.glb";
/** The filename to use for the default left hand model. */
WebXRHandTracking.DEFAULT_HAND_MODEL_LEFT_FILENAME = "l_hand_rhs.glb";
/** The URL pointing to the default hand model NodeMaterial shader. */
WebXRHandTracking.DEFAULT_HAND_MODEL_SHADER_URL = "https://assets.babylonjs.com/core/HandMeshes/handsShader.json";
// We want to use lightweight models, diameter will initially be 1 but scaled to the values returned from WebXR.
WebXRHandTracking._ICOSPHERE_PARAMS = { radius: 0.5, flat: false, subdivisions: 2 };
WebXRHandTracking._RightHandGLB = null;
WebXRHandTracking._LeftHandGLB = null;
let _Registered = false;
/**
 * Register side effects for webXRHandTracking.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterWebXRHandTracking() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterInstancedMesh();
    //register the plugin
    WebXRFeaturesManager.AddWebXRFeature(WebXRHandTracking.Name, (xrSessionManager, options) => {
        return () => new WebXRHandTracking(xrSessionManager, options);
    }, WebXRHandTracking.Version, false);
}
//# sourceMappingURL=WebXRHandTracking.pure.js.map