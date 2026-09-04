/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type BaseTexture } from "../../../Textures/baseTexture.pure.js";
import { type NodeMaterialDefines, NodeMaterial } from "../../nodeMaterial.pure.js";
import { type Effect } from "../../../effect.pure.js";
import { type Mesh } from "../../../../Meshes/mesh.pure.js";
import { type Nullable } from "../../../../types.js";
import { type Scene } from "../../../../scene.pure.js";
import { type SubMesh } from "../../../..//Meshes/subMesh.pure.js";
/**
 * Base block used to read a reflection texture from a sampler
 */
export declare abstract class ReflectionTextureBaseBlock extends NodeMaterialBlock {
    /** @internal */
    _define3DName: string;
    /** @internal */
    _defineCubicName: string;
    /** @internal */
    _defineExplicitName: string;
    /** @internal */
    _defineProjectionName: string;
    /** @internal */
    _defineLocalCubicName: string;
    /** @internal */
    _defineSphericalName: string;
    /** @internal */
    _definePlanarName: string;
    /** @internal */
    _defineEquirectangularName: string;
    /** @internal */
    _defineMirroredEquirectangularFixedName: string;
    /** @internal */
    _defineEquirectangularFixedName: string;
    /** @internal */
    _defineSkyboxName: string;
    /** @internal */
    _defineOppositeZ: string;
    /** @internal */
    _cubeSamplerName: string;
    /** @internal */
    _2DSamplerName: string;
    /** @internal */
    _reflectionPositionName: string;
    /** @internal */
    _reflectionSizeName: string;
    protected _positionUVWName: string;
    protected _directionWname: string;
    protected _reflectionVectorName: string;
    /** @internal */
    _reflectionCoordsName: string;
    /** @internal */
    _reflectionMatrixName: string;
    protected _reflectionColorName: string;
    protected _worldPositionNameInFragmentOnlyMode: string;
    protected _texture: Nullable<BaseTexture>;
    /**
     * Gets or sets the texture associated with the node
     */
    get texture(): Nullable<BaseTexture>;
    set texture(texture: Nullable<BaseTexture>);
    /** Indicates that no code should be generated in the vertex shader. Can be useful in some specific circumstances (like when doing ray marching for eg) */
    generateOnlyFragmentCode: boolean;
    protected static _OnGenerateOnlyFragmentCodeChanged(block: NodeMaterialBlock, _propertyName: string): boolean;
    protected _onGenerateOnlyFragmentCodeChanged(): boolean;
    protected _setTarget(): void;
    /**
     * Create a new ReflectionTextureBaseBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the world position input component
     */
    abstract get position(): NodeMaterialConnectionPoint;
    /**
     * Gets the world position input component
     */
    abstract get worldPosition(): NodeMaterialConnectionPoint;
    /**
     * Gets the world normal input component
     */
    abstract get worldNormal(): NodeMaterialConnectionPoint;
    /**
     * Gets the world input component
     */
    abstract get world(): NodeMaterialConnectionPoint;
    /**
     * Gets the camera (or eye) position component
     */
    abstract get cameraPosition(): NodeMaterialConnectionPoint;
    /**
     * Gets the view input component
     */
    abstract get view(): NodeMaterialConnectionPoint;
    protected _getTexture(): Nullable<BaseTexture>;
    /**
     * Initialize the block
     * @param state - the build state
     */
    initialize(state: NodeMaterialBuildState): void;
    private _initShaderSourceAsync;
    /**
     * Auto configure the node based on the existing material
     * @param material defines the material to configure
     * @param additionalFilteringInfo defines additional info to be used when filtering inputs (we might want to skip some non relevant blocks)
     */
    autoConfigure(material: NodeMaterial, additionalFilteringInfo?: (node: NodeMaterialBlock) => boolean): void;
    /**
     * Prepare the list of defines
     * @param defines - the material defines
     */
    prepareDefines(defines: NodeMaterialDefines): void;
    /**
     * Checks if the block is ready
     * @returns true if ready
     */
    isReady(): boolean;
    /**
     * Bind data to effect
     * @param effect - the effect to bind to
     * @param nodeMaterial - the node material
     * @param mesh - the mesh to bind for
     * @param _subMesh - the submesh
     */
    bind(effect: Effect, nodeMaterial: NodeMaterial, mesh?: Mesh, _subMesh?: SubMesh): void;
    /**
     * Gets the code to inject in the vertex shader
     * @param state current state of the node material building
     * @returns the shader code
     */
    handleVertexSide(state: NodeMaterialBuildState): string;
    /**
     * Handles the inits for the fragment code path
     * @param state node material build state
     */
    handleFragmentSideInits(state: NodeMaterialBuildState): void;
    /**
     * Generates the reflection coords code for the fragment code path
     * @param state defines the build state
     * @param worldNormalVarName name of the world normal variable
     * @param worldPos name of the world position variable. If not provided, will use the world position connected to this block
     * @param onlyReflectionVector if true, generates code only for the reflection vector computation, not for the reflection coordinates
     * @param doNotEmitInvertZ if true, does not emit the invertZ code
     * @returns the shader code
     */
    handleFragmentSideCodeReflectionCoords(state: NodeMaterialBuildState, worldNormalVarName: string, worldPos?: string, onlyReflectionVector?: boolean, doNotEmitInvertZ?: boolean): string;
    /**
     * Generates the reflection color code for the fragment code path
     * @param state defines the build state
     * @param lodVarName name of the lod variable
     * @param swizzleLookupTexture swizzle to use for the final color variable
     * @returns the shader code
     */
    handleFragmentSideCodeReflectionColor(state: NodeMaterialBuildState, lodVarName?: string, swizzleLookupTexture?: string): string;
    /**
     * Generates the code corresponding to the connected output points
     * @param state node material build state
     * @param varName name of the variable to output
     * @returns the shader code
     */
    writeOutputs(state: NodeMaterialBuildState, varName: string): string;
    protected _buildBlock(state: NodeMaterialBuildState): this;
    protected _dumpPropertiesCode(): string;
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
 * Register side effects for reflectionTextureBaseBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterReflectionTextureBaseBlock(): void;
