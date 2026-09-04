import { type BaseTexture } from "../../../Materials/Textures/baseTexture.js";
import { Mesh } from "../../../Meshes/mesh.pure.js";
import { type TransformNode } from "../../../Meshes/transformNode.pure.js";
import { type Scene } from "../../../scene.js";
import { type WebXRSpatialLayerType } from "./WebXRCompositionLayer.js";
/**
 * Physical dimensions used to approximate a native composition layer with a Babylon mesh.
 */
export interface IWebXRFallbackLayerDimensions {
    /** The quad width in meters. */
    width?: number;
    /** The quad height in meters. */
    height?: number;
    /** The cylinder or sphere radius in meters. */
    radius?: number;
    /** The cylinder central angle in radians. */
    centralAngle?: number;
    /** The cylinder width-to-height aspect ratio. */
    aspectRatio?: number;
    /** The equirectangular horizontal angle in radians. */
    centralHorizontalAngle?: number;
    /** The equirectangular upper vertical angle in radians. */
    upperVerticalAngle?: number;
    /** The equirectangular lower vertical angle in radians. */
    lowerVerticalAngle?: number;
}
/**
 * Wraps a mesh used when a requested native WebXR composition layer is unavailable.
 */
export declare class WebXRFallbackLayerWrapper {
    /**
     * The requested WebXR composition layer type.
     */
    readonly layerType: WebXRSpatialLayerType;
    /**
     * The Babylon node whose world position and rotation control the fallback mesh.
     */
    readonly transformNode: TransformNode;
    private readonly _ownsTransformNode;
    private readonly _currentPosition;
    private readonly _currentRotation;
    private readonly _meshRotationOffset;
    private readonly _material;
    private readonly _ownsTexture;
    /**
     * The native layer is always `null` for a fallback wrapper.
     */
    readonly layer: null;
    /**
     * Whether this wrapper is backed by a native WebXR composition layer.
     */
    readonly isNative = false;
    /**
     * The Babylon mesh that approximates the requested composition layer.
     */
    readonly mesh: Mesh;
    /**
     * The texture displayed by the fallback mesh.
     */
    readonly texture: BaseTexture;
    constructor(scene: Scene, 
    /**
     * The requested WebXR composition layer type.
     */
    layerType: WebXRSpatialLayerType, 
    /**
     * The texture displayed by the fallback mesh.
     */
    texture: BaseTexture, 
    /**
     * The Babylon node whose world position and rotation control the fallback mesh.
     */
    transformNode: TransformNode, _ownsTransformNode: boolean, ownsTexture: boolean, dimensions: IWebXRFallbackLayerDimensions, worldScalingFactor: number);
    private _createMesh;
    /**
     * Copies the transform node's world position and rotation to the fallback mesh without applying the node's scaling.
     * @param worldScalingFactor the number of Babylon scene units represented by one meter
     */
    updateFromTransformNode(worldScalingFactor?: number): void;
    /**
     * Disposes the fallback mesh, material, and any resources owned by this wrapper.
     */
    dispose(): void;
}
