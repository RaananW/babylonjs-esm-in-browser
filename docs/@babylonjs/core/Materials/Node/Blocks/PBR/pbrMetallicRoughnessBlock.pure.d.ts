/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type NodeMaterial, type NodeMaterialDefines } from "../../nodeMaterial.pure.js";
import { type Light } from "../../../../Lights/light.js";
import { type Nullable } from "../../../../types.js";
import { type AbstractMesh } from "../../../../Meshes/abstractMesh.pure.js";
import { type Effect } from "../../../effect.pure.js";
import { type Mesh } from "../../../../Meshes/mesh.pure.js";
import { type Scene } from "../../../../scene.pure.js";
/**
 * Block used to implement the PBR metallic/roughness model
 * @see https://playground.babylonjs.com/#D8AK3Z#80
 */
export declare class PBRMetallicRoughnessBlock extends NodeMaterialBlock {
    /**
     * Gets or sets the light associated with this block
     */
    light: Nullable<Light>;
    private static _OnGenerateOnlyFragmentCodeChanged;
    private _setTarget;
    private _lightId;
    private _scene;
    private _environmentBRDFTexture;
    private _environmentBrdfSamplerName;
    private _vNormalWName;
    private _invertNormalName;
    private _metallicReflectanceColor;
    private _metallicF0Factor;
    private _vMetallicReflectanceFactorsName;
    private _baseDiffuseRoughnessName;
    /**
     * Create a new ReflectionBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Intensity of the direct lights e.g. the four lights available in your scene.
     * This impacts both the direct diffuse and specular highlights.
     */
    directIntensity: number;
    /**
     * Intensity of the environment e.g. how much the environment will light the object
     * either through harmonics for rough material or through the reflection for shiny ones.
     */
    environmentIntensity: number;
    /**
     * This is a special control allowing the reduction of the specular highlights coming from the
     * four lights of the scene. Those highlights may not be needed in full environment lighting.
     */
    specularIntensity: number;
    /**
     * Defines the  falloff type used in this material.
     * It by default is Physical.
     */
    lightFalloff: number;
    /**
     * Specifies that alpha test should be used
     */
    useAlphaTest: boolean;
    /**
     * Defines the alpha limits in alpha test mode.
     */
    alphaTestCutoff: number;
    /**
     * Specifies that alpha blending should be used
     */
    useAlphaBlending: boolean;
    /**
     * Specifies that the material will keeps the reflection highlights over a transparent surface (only the most luminous ones).
     * A car glass is a good example of that. When the street lights reflects on it you can not see what is behind.
     */
    useRadianceOverAlpha: boolean;
    /**
     * Specifies that the material will keeps the specular highlights over a transparent surface (only the most luminous ones).
     * A car glass is a good example of that. When sun reflects on it you can not see what is behind.
     */
    useSpecularOverAlpha: boolean;
    /**
     * Enables specular anti aliasing in the PBR shader.
     * It will both interacts on the Geometry for analytical and IBL lighting.
     * It also prefilter the roughness map based on the bump values.
     */
    enableSpecularAntiAliasing: boolean;
    /**
     * Enables realtime filtering on the texture.
     */
    realTimeFiltering: boolean;
    /**
     * Quality switch for realtime filtering
     */
    realTimeFilteringQuality: number;
    /**
     * Base Diffuse Model
     */
    baseDiffuseModel: number;
    /**
     * Defines if the material uses energy conservation.
     */
    useEnergyConservation: boolean;
    /**
     * This parameters will enable/disable radiance occlusion by preventing the radiance to lit
     * too much the area relying on ambient texture to define their ambient occlusion.
     */
    useRadianceOcclusion: boolean;
    /**
     * This parameters will enable/disable Horizon occlusion to prevent normal maps to look shiny when the normal
     * makes the reflect vector face the model (under horizon).
     */
    useHorizonOcclusion: boolean;
    /**
     * If set to true, no lighting calculations will be applied.
     */
    unlit: boolean;
    /**
     * Force normal to face away from face.
     */
    forceNormalForward: boolean;
    /** Indicates that no code should be generated in the vertex shader. Can be useful in some specific circumstances (like when doing ray marching for eg) */
    generateOnlyFragmentCode: boolean;
    /**
     * Defines the material debug mode.
     * It helps seeing only some components of the material while troubleshooting.
     */
    debugMode: number;
    /**
     * Specify from where on screen the debug mode should start.
     * The value goes from -1 (full screen) to 1 (not visible)
     * It helps with side by side comparison against the final render
     * This defaults to 0
     */
    debugLimit: number;
    /**
     * As the default viewing range might not be enough (if the ambient is really small for instance)
     * You can use the factor to better multiply the final value.
     */
    debugFactor: number;
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state: NodeMaterialBuildState): void;
    private _initShaderSourceAsync;
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the world position input component
     */
    get worldPosition(): NodeMaterialConnectionPoint;
    /**
     * Gets the world normal input component
     */
    get worldNormal(): NodeMaterialConnectionPoint;
    /**
     * Gets the view matrix parameter
     */
    get view(): NodeMaterialConnectionPoint;
    /**
     * Gets the camera position input component
     */
    get cameraPosition(): NodeMaterialConnectionPoint;
    /**
     * Gets the perturbed normal input component
     */
    get perturbedNormal(): NodeMaterialConnectionPoint;
    /**
     * Gets the base color input component
     */
    get baseColor(): NodeMaterialConnectionPoint;
    /**
     * Gets the metallic input component
     */
    get metallic(): NodeMaterialConnectionPoint;
    /**
     * Gets the roughness input component
     */
    get roughness(): NodeMaterialConnectionPoint;
    /**
     * Gets the ambient occlusion input component
     */
    get ambientOcc(): NodeMaterialConnectionPoint;
    /**
     * Gets the opacity input component
     */
    get opacity(): NodeMaterialConnectionPoint;
    /**
     * Gets the index of refraction input component
     */
    get indexOfRefraction(): NodeMaterialConnectionPoint;
    /**
     * Gets the ambient color input component
     */
    get ambientColor(): NodeMaterialConnectionPoint;
    /**
     * Gets the reflection object parameters
     */
    get reflection(): NodeMaterialConnectionPoint;
    /**
     * Gets the clear coat object parameters
     */
    get clearcoat(): NodeMaterialConnectionPoint;
    /**
     * Gets the sheen object parameters
     */
    get sheen(): NodeMaterialConnectionPoint;
    /**
     * Gets the sub surface object parameters
     */
    get subsurface(): NodeMaterialConnectionPoint;
    /**
     * Gets the anisotropy object parameters
     */
    get anisotropy(): NodeMaterialConnectionPoint;
    /**
     * Gets the iridescence object parameters
     */
    get iridescence(): NodeMaterialConnectionPoint;
    /**
     * Gets the ambient output component
     */
    get ambientClr(): NodeMaterialConnectionPoint;
    /**
     * Gets the diffuse output component
     */
    get diffuseDir(): NodeMaterialConnectionPoint;
    /**
     * Gets the specular output component
     */
    get specularDir(): NodeMaterialConnectionPoint;
    /**
     * Gets the clear coat output component
     */
    get clearcoatDir(): NodeMaterialConnectionPoint;
    /**
     * Gets the sheen output component
     */
    get sheenDir(): NodeMaterialConnectionPoint;
    /**
     * Gets the indirect diffuse output component
     */
    get diffuseInd(): NodeMaterialConnectionPoint;
    /**
     * Gets the indirect specular output component
     */
    get specularInd(): NodeMaterialConnectionPoint;
    /**
     * Gets the indirect clear coat output component
     */
    get clearcoatInd(): NodeMaterialConnectionPoint;
    /**
     * Gets the indirect sheen output component
     */
    get sheenInd(): NodeMaterialConnectionPoint;
    /**
     * Gets the refraction output component
     */
    get refraction(): NodeMaterialConnectionPoint;
    /**
     * Gets the global lighting output component
     */
    get lighting(): NodeMaterialConnectionPoint;
    /**
     * Gets the shadow output component
     */
    get shadow(): NodeMaterialConnectionPoint;
    /**
     * Gets the alpha output component
     */
    get alpha(): NodeMaterialConnectionPoint;
    /**
     * Auto configure the block based on the material
     * @param material - the node material
     * @param additionalFilteringInfo - additional filtering info
     */
    autoConfigure(material: NodeMaterial, additionalFilteringInfo?: (node: NodeMaterialBlock) => boolean): void;
    /**
     * Prepare the list of defines
     * @param defines - the list of defines to update
     * @param nodeMaterial - the node material
     * @param mesh - the mesh to prepare defines for
     */
    prepareDefines(defines: NodeMaterialDefines, nodeMaterial: NodeMaterial, mesh?: AbstractMesh): void;
    /**
     * Update the uniforms and samples
     * @param state - the build state
     * @param nodeMaterial - the node material
     * @param defines - the list of defines
     * @param uniformBuffers - the uniform buffers
     */
    updateUniformsAndSamples(state: NodeMaterialBuildState, nodeMaterial: NodeMaterial, defines: NodeMaterialDefines, uniformBuffers: string[]): void;
    /**
     * Checks if the block is ready
     * @param mesh - the mesh to check
     * @param nodeMaterial - the node material
     * @param defines - the list of defines
     * @returns true if ready
     */
    isReady(mesh: AbstractMesh, nodeMaterial: NodeMaterial, defines: NodeMaterialDefines): boolean;
    /**
     * Bind data to effect
     * @param effect - the effect to bind data to
     * @param nodeMaterial - the node material
     * @param mesh - the mesh to bind data for
     */
    bind(effect: Effect, nodeMaterial: NodeMaterial, mesh?: Mesh): void;
    private _injectVertexCode;
    private _getAlbedoOpacityCode;
    private _getAmbientOcclusionCode;
    private _getReflectivityCode;
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
 * Register side effects for pbrMetallicRoughnessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterPbrMetallicRoughnessBlock(): void;
