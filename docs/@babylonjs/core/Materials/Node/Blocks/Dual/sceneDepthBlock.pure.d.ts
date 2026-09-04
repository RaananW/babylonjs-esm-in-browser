/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type Scene } from "../../../../scene.pure.js";
import { type Effect } from "../../../effect.pure.js";
import { type NodeMaterial } from "../../nodeMaterial.pure.js";
/**
 * Block used to retrieve the depth (zbuffer) of the scene
 * @since 5.0.0
 */
export declare class SceneDepthBlock extends NodeMaterialBlock {
    private _samplerName;
    private _mainUVName;
    private _tempTextureRead;
    /**
     * Defines if the depth renderer should be setup in non linear mode
     */
    useNonLinearDepth: boolean;
    /**
     * Defines if the depth renderer should be setup in camera space Z mode (if set, useNonLinearDepth has no effect)
     */
    storeCameraSpaceZ: boolean;
    /**
     * Defines if the depth renderer should be setup in full 32 bits float mode
     */
    force32itsFloat: boolean;
    /**
     * Create a new SceneDepthBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the uv input component
     */
    get uv(): NodeMaterialConnectionPoint;
    /**
     * Gets the depth output component
     */
    get depth(): NodeMaterialConnectionPoint;
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state: NodeMaterialBuildState): void;
    /** {@inheritDoc} */
    get target(): NodeMaterialBlockTargets.Fragment | NodeMaterialBlockTargets.VertexAndFragment;
    private _getTexture;
    /**
     * Bind data to effect
     * @param effect - the effect to bind to
     * @param nodeMaterial - the node material
     */
    bind(effect: Effect, nodeMaterial: NodeMaterial): void;
    private _injectVertexCode;
    private _writeTextureRead;
    private _writeOutput;
    protected _buildBlock(state: NodeMaterialBuildState): this | undefined;
    /**
     * Serializes the block
     * @returns the serialized object
     */
    serialize(): any;
    /**
     * Deserializes the block
     * @param serializationObject - the serialization object
     * @param scene - the scene
     * @param rootUrl - the root url
     */
    _deserialize(serializationObject: any, scene: Scene, rootUrl: string): void;
}
/**
 * Register side effects for sceneDepthBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterSceneDepthBlock(): void;
