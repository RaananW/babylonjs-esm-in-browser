/** This file must only contain pure code and pure imports */
import { type SubMesh } from "../../Meshes/subMesh.pure.js";
import { type AbstractMesh } from "../../Meshes/abstractMesh.pure.js";
import { type Mesh } from "../../Meshes/mesh.pure.js";
import { type Effect } from "../../Materials/effect.pure.js";
import { type Scene } from "../../scene.pure.js";
import { type Matrix } from "../../Maths/math.vector.pure.js";
import { type GaussianSplattingMesh } from "../../Meshes/GaussianSplatting/gaussianSplattingMesh.pure.js";
import { type AbstractEngine } from "../../Engines/abstractEngine.pure.js";
import { PushMaterial } from "../../Materials/pushMaterial.js";
import { ShadowDepthWrapper } from "../../Materials/shadowDepthWrapper.js";
import { ShaderMaterial } from "../../Materials/shaderMaterial.pure.js";
import { ShaderLanguage } from "../shaderLanguage.js";
/**
 * Computes the maximum number of Gaussian Splatting compound parts supported by the given engine.
 * The limit is derived from the engine's maximum vertex uniform vectors capability.
 * @param engine - The engine to compute the limit for
 * @returns The maximum number of parts supported
 */
export declare function GetGaussianSplattingMaxPartCount(engine: AbstractEngine): number;
/**
 * @deprecated Use {@link GetGaussianSplattingMaxPartCount} with an engine instance instead.
 */
export declare const GaussianSplattingMaxPartCount = 128;
/**
 * GaussianSplattingMaterial material used to render Gaussian Splatting
 * @experimental
 */
export declare class GaussianSplattingMaterial extends PushMaterial {
    /**
     * Instantiates a Gaussian Splatting Material in the given scene
     * @param name The friendly name of the material
     * @param scene The scene to add the material to
     */
    constructor(name: string, scene?: Scene);
    /**
     * Point spread function (default 0.3). Can be overriden per GS material
     */
    static KernelSize: number;
    /**
     * Compensation
     */
    static Compensation: boolean;
    /**
     * Minimum projected splat size, in pixels, below which a splat is discarded (default 0 = disabled).
     * Matches PlayCanvas `minPixelSize`. Applies to all Gaussian Splatting meshes using this material.
     */
    static MinPixelSize: number;
    /**
     * Point spread function (default 0.3). Can be overriden per GS material, otherwise, using default static `KernelSize` value
     */
    kernelSize: number;
    /**
     * Minimum projected splat size, in pixels, below which a splat is discarded (default 0 = disabled).
     */
    minPixelSize: number;
    private _compensation;
    private _isDirty;
    /**
     * Set compensation default value is `GaussianSplattingMaterial.Compensation`
     */
    set compensation(value: boolean);
    /**
     * Get compensation
     */
    get compensation(): boolean;
    /**
     * Gets a boolean indicating that current material needs to register RTT
     */
    get hasRenderTargetTextures(): boolean;
    /**
     * Specifies whether or not this material should be rendered in alpha test mode.
     * @returns false
     */
    needAlphaTesting(): boolean;
    /**
     * Specifies whether or not this material should be rendered in alpha blend mode.
     * @returns true
     */
    needAlphaBlending(): boolean;
    protected static _Attribs: string[];
    protected static _Samplers: string[];
    protected static _UniformBuffers: string[];
    protected static _VoxelUniforms: string[];
    protected static _VoxelSamplers: string[];
    protected static _Uniforms: string[];
    private _sourceMesh;
    /**
     * Checks whether the material is ready to be rendered for a given mesh.
     * @param mesh The mesh to render
     * @param subMesh The submesh to check against
     * @returns true if all the dependencies are ready (Textures, Effects...)
     */
    isReadyForSubMesh(mesh: AbstractMesh, subMesh: SubMesh): boolean;
    /**
     * GaussianSplattingMaterial belongs to a single mesh
     * @param mesh mesh this material belongs to
     */
    setSourceMesh(mesh: GaussianSplattingMesh): void;
    /**
     * Gets the source mesh of this material, which is the Gaussian Splatting mesh that provides the data for rendering
     * @returns The Gaussian Splatting mesh that provides the data for rendering, or null if not set
     */
    getSourceMesh(): GaussianSplattingMesh | null;
    /**
     * Bind material effect for a specific Gaussian Splatting mesh
     * @param mesh Gaussian splatting mesh
     * @param effect Splatting material or node material
     * @param scene scene that contains mesh and camera used for rendering
     */
    static BindEffect(mesh: Mesh, effect: Effect, scene: Scene): void;
    /**
     * Bind SOG dequantization uniforms + raw textures.
     * @internal
     */
    protected static _BindSogUniforms(gsMesh: GaussianSplattingMesh, effect: Effect): void;
    /**
     * Binds the submesh to this material by preparing the effect and shader to draw
     * @param world defines the world transformation matrix
     * @param mesh defines the mesh containing the submesh
     * @param subMesh defines the submesh to bind the material to
     */
    bindForSubMesh(world: Matrix, mesh: Mesh, subMesh: SubMesh): void;
    protected static _BindEffectUniforms(gsMesh: GaussianSplattingMesh, gsMaterial: GaussianSplattingMaterial, shaderMaterial: ShaderMaterial, scene: Scene): void;
    private _voxelMissingTextureWarned;
    private _voxelPartWorldData;
    private readonly _voxelPartVisibilityData;
    protected _bindVoxelEffectUniforms(gsMesh: GaussianSplattingMesh, gsMaterial: GaussianSplattingMaterial, shaderMaterial: ShaderMaterial): boolean;
    /**
     * Create a voxel rendering material for a Gaussian Splatting mesh, for use with IBL shadow voxelization.
     * The returned ShaderMaterial's onBindObservable binds the GS mesh-side uniforms (textures, alpha, dataTextureSize, part data).
     * The caller (e.g. iblShadowsVoxelRenderer) is responsible for setting the per-slab uniforms on the returned material:
     * viewMatrix, invWorldScale, nearPlane, farPlane, stepSize.
     * @param scene scene it belongs to
     * @param shaderLanguage GLSL or WGSL
     * @param maxDrawBuffers number of draw buffers (MRT outputs) per voxelization slab
     * @param compoundMesh whether the mesh is a compound mesh
     * @returns voxel rendering shader material
     */
    makeVoxelRenderingMaterial(scene: Scene, shaderLanguage: ShaderLanguage, maxDrawBuffers: number, compoundMesh?: boolean): ShaderMaterial;
    /**
     * Create a depth rendering material for a Gaussian Splatting mesh
     * @param scene scene it belongs to
     * @param shaderLanguage GLSL or WGSL
     * @param alphaBlendedDepth whether to enable alpha blended depth rendering
     * @param compoundMesh whether the mesh is a compound mesh
     * @returns depth rendering shader material
     */
    makeDepthRenderingMaterial(scene: Scene, shaderLanguage: ShaderLanguage, alphaBlendedDepth?: boolean, compoundMesh?: boolean): ShaderMaterial;
    protected static _MakeGaussianSplattingShadowDepthWrapper(scene: Scene, shaderLanguage: ShaderLanguage): ShadowDepthWrapper;
    /**
     * Clones the material.
     * @param name The cloned name.
     * @returns The cloned material.
     */
    clone(name: string): GaussianSplattingMaterial;
    /**
     * Serializes the current material to its JSON representation.
     * @returns The JSON representation.
     */
    serialize(): any;
    /**
     * Gets the class name of the material
     * @returns "GaussianSplattingMaterial"
     */
    getClassName(): string;
    /**
     * Parse a JSON input to create back a Gaussian Splatting material.
     * @param source The JSON data to parse
     * @param scene The scene to create the parsed material in
     * @param rootUrl The root url of the assets the material depends upon
     * @returns the instantiated GaussianSplattingMaterial.
     */
    static Parse(source: any, scene: Scene, rootUrl: string): GaussianSplattingMaterial;
}
/**
 * Register side effects for gaussianSplattingMaterial.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGaussianSplattingMaterial(): void;
