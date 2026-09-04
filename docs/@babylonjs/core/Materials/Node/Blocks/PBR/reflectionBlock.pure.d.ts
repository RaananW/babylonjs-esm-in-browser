/** This file must only contain pure code and pure imports */
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type NodeMaterial, type NodeMaterialDefines } from "../../nodeMaterial.pure.js";
import { ReflectionTextureBaseBlock } from "../Dual/reflectionTextureBaseBlock.pure.js";
import { type Nullable } from "../../../../types.js";
import { type BaseTexture } from "../../../Textures/baseTexture.pure.js";
import { type Mesh } from "../../../../Meshes/mesh.pure.js";
import { type SubMesh } from "../../../../Meshes/subMesh.pure.js";
import { type Effect } from "../../../effect.pure.js";
import { type Scene } from "../../../../scene.pure.js";
/**
 * Block used to implement the reflection module of the PBR material
 */
export declare class ReflectionBlock extends ReflectionTextureBaseBlock {
    /** @internal */
    _defineLODReflectionAlpha: string;
    /** @internal */
    _defineLinearSpecularReflection: string;
    private _vEnvironmentIrradianceName;
    /** @internal */
    _vReflectionMicrosurfaceInfosName: string;
    /** @internal */
    _vReflectionInfosName: string;
    /** @internal */
    _vReflectionFilteringInfoName: string;
    private _scene;
    private _iblIntensityName;
    /**
     * The properties below are set by the main PBR block prior to calling methods of this class.
     * This is to avoid having to add them as inputs here whereas they are already inputs of the main block, so already known.
     * It's less burden on the user side in the editor part.
     */
    /** @internal */
    worldPositionConnectionPoint: NodeMaterialConnectionPoint;
    /** @internal */
    worldNormalConnectionPoint: NodeMaterialConnectionPoint;
    /** @internal */
    cameraPositionConnectionPoint: NodeMaterialConnectionPoint;
    /** @internal */
    viewConnectionPoint: NodeMaterialConnectionPoint;
    /**
     * Defines if the material uses spherical harmonics vs spherical polynomials for the
     * diffuse part of the IBL.
     */
    useSphericalHarmonics: boolean;
    /**
     * Force the shader to compute irradiance in the fragment shader in order to take bump in account.
     */
    forceIrradianceInFragment: boolean;
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state: NodeMaterialBuildState): void;
    private _initReflectionBlockShaderSourceAsync;
    protected _onGenerateOnlyFragmentCodeChanged(): boolean;
    protected _setTarget(): void;
    /**
     * Create a new ReflectionBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the position input component
     */
    get position(): NodeMaterialConnectionPoint;
    /**
     * Gets the world position input component
     */
    get worldPosition(): NodeMaterialConnectionPoint;
    /**
     * Gets the world normal input component
     */
    get worldNormal(): NodeMaterialConnectionPoint;
    /**
     * Gets the world input component
     */
    get world(): NodeMaterialConnectionPoint;
    /**
     * Gets the camera (or eye) position component
     */
    get cameraPosition(): NodeMaterialConnectionPoint;
    /**
     * Gets the view input component
     */
    get view(): NodeMaterialConnectionPoint;
    /**
     * Gets the color input component
     */
    get color(): NodeMaterialConnectionPoint;
    /**
     * Gets the reflection object output component
     */
    get reflection(): NodeMaterialConnectionPoint;
    /**
     * Returns true if the block has a texture (either its own texture or the environment texture from the scene, if set)
     */
    get hasTexture(): boolean;
    /**
     * Gets the reflection color (either the name of the variable if the color input is connected, else a default value)
     */
    get reflectionColor(): string;
    protected _getTexture(): Nullable<BaseTexture>;
    /**
     * Prepare the list of defines
     * @param defines - the list of defines to update
     */
    prepareDefines(defines: NodeMaterialDefines): void;
    /**
     * Bind data to effect
     * @param effect - the effect to bind data to
     * @param nodeMaterial - the node material
     * @param mesh - the mesh to bind data for
     * @param subMesh - the submesh to bind data for
     */
    bind(effect: Effect, nodeMaterial: NodeMaterial, mesh?: Mesh, subMesh?: SubMesh): void;
    /**
     * Gets the code to inject in the vertex shader
     * @param state current state of the node material building
     * @returns the shader code
     */
    handleVertexSide(state: NodeMaterialBuildState): string;
    /**
     * Gets the main code of the block (fragment side)
     * @param state current state of the node material building
     * @param normalVarName name of the existing variable corresponding to the normal
     * @returns the shader code
     */
    getCode(state: NodeMaterialBuildState, normalVarName: string): string;
    protected _buildBlock(state: NodeMaterialBuildState): this;
    protected _dumpPropertiesCode(): string;
    /**
     * Serializes the block
     * @returns the serialized object
     */
    serialize(): any;
    /**
     * Deserializes the block
     * @param serializationObject - the object to deserialize from
     * @param scene - the scene to deserialize in
     * @param rootUrl - the root URL for assets
     */
    _deserialize(serializationObject: any, scene: Scene, rootUrl: string): void;
}
/**
 * Register side effects for reflectionBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterReflectionBlock(): void;
