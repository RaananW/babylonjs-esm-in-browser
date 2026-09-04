/** This file must only contain pure code and pure imports */
import { type NodeMaterialBlock } from "./nodeMaterialBlock.js";
import { PushMaterial } from "../pushMaterial.js";
import { type Scene } from "../../scene.pure.js";
import { type AbstractMesh } from "../../Meshes/abstractMesh.pure.js";
import { Matrix } from "../../Maths/math.vector.pure.js";
import { Color4 } from "../../Maths/math.color.pure.js";
import { type Mesh } from "../../Meshes/mesh.pure.js";
import { Effect } from "../effect.pure.js";
import { type BaseTexture } from "../../Materials/Textures/baseTexture.pure.js";
import { Observable } from "../../Misc/observable.pure.js";
import { type SubMesh } from "../../Meshes/subMesh.pure.js";
import { MaterialDefines } from "../../Materials/materialDefines.js";
import { type NodeMaterialOptimizer } from "./Optimizers/nodeMaterialOptimizer.js";
import { type Nullable } from "../../types.js";
import { InputBlock } from "./Blocks/Input/inputBlock.pure.js";
import { type TextureBlock } from "./Blocks/Dual/textureBlock.pure.js";
import { type ReflectionTextureBaseBlock } from "./Blocks/Dual/reflectionTextureBaseBlock.pure.js";
import { type RefractionBlock } from "./Blocks/PBR/refractionBlock.pure.js";
import { CurrentScreenBlock } from "./Blocks/Dual/currentScreenBlock.pure.js";
import { ParticleTextureBlock } from "./Blocks/Particle/particleTextureBlock.pure.js";
import { type PostProcessOptions, PostProcess } from "../../PostProcesses/postProcess.pure.js";
import { type Camera } from "../../Cameras/camera.pure.js";
import { NodeMaterialModes } from "./Enums/nodeMaterialModes.js";
import { type IParticleSystem } from "../../Particles/IParticleSystem.js";
import { ProceduralTexture } from "../Textures/Procedurals/proceduralTexture.pure.js";
import { type ImageSourceBlock } from "./Blocks/Dual/imageSourceBlock.pure.js";
import { Material } from "../material.pure.js";
import { type TriPlanarBlock } from "./Blocks/triPlanarBlock.pure.js";
import { type BiPlanarBlock } from "./Blocks/biPlanarBlock.pure.js";
import { type PrePassRenderer } from "../../Rendering/prePassRenderer.pure.js";
import { type PrePassTextureBlock } from "./Blocks/Input/prePassTextureBlock.pure.js";
import { ImageProcessingConfiguration } from "../imageProcessingConfiguration.pure.js";
import { ShaderLanguage } from "../shaderLanguage.js";
import { AbstractEngine } from "../../Engines/abstractEngine.pure.js";
/**
 * Interface used to configure the node material editor
 */
export interface INodeMaterialEditorOptions {
    /** Define the URL to load node editor script from */
    editorURL?: string;
    /** Additional configuration for the NME */
    nodeEditorConfig?: {
        backgroundColor?: Color4;
    };
}
declare const NodeMaterialDefinesBase_base: {
    new (...args: any[]): {
        MAINUV1: boolean;
        MAINUV2: boolean;
        MAINUV3: boolean;
        MAINUV4: boolean;
        MAINUV5: boolean;
        MAINUV6: boolean;
        UV1: boolean;
        UV2: boolean;
        UV3: boolean;
        UV4: boolean;
        UV5: boolean;
        UV6: boolean;
    };
} & typeof MaterialDefines;
declare class NodeMaterialDefinesBase extends NodeMaterialDefinesBase_base {
}
declare const NodeMaterialDefines_base: {
    new (...args: any[]): {
        IMAGEPROCESSING: boolean;
        WHITEBALANCE: boolean;
        VIGNETTE: boolean;
        VIGNETTEBLENDMODEMULTIPLY: boolean;
        VIGNETTEBLENDMODEOPAQUE: boolean;
        TONEMAPPING: number;
        CONTRAST: boolean;
        COLORCURVES: boolean;
        COLORGRADING: boolean;
        COLORGRADING3D: boolean;
        SAMPLER3DGREENDEPTH: boolean;
        SAMPLER3DBGRMAP: boolean;
        DITHER: boolean;
        IMAGEPROCESSINGPOSTPROCESS: boolean;
        SKIPFINALCOLORCLAMP: boolean;
        EXPOSURE: boolean;
    };
} & typeof NodeMaterialDefinesBase;
/** @internal */
export declare class NodeMaterialDefines extends NodeMaterialDefines_base {
    /** Normal */
    NORMAL: boolean;
    /** Tangent */
    TANGENT: boolean;
    /** Vertex color */
    VERTEXCOLOR_NME: boolean;
    /** Prepass **/
    PREPASS: boolean;
    /** Prepass normal */
    PREPASS_NORMAL: boolean;
    /** Prepass normal index */
    PREPASS_NORMAL_INDEX: number;
    /** Prepass world normal */
    PREPASS_WORLD_NORMAL: boolean;
    /** Prepass world normal index */
    PREPASS_WORLD_NORMAL_INDEX: number;
    /** Prepass position */
    PREPASS_POSITION: boolean;
    /** Prepass position index */
    PREPASS_POSITION_INDEX: number;
    /** Prepass local position */
    PREPASS_LOCAL_POSITION: boolean;
    /** Prepass local position index */
    PREPASS_LOCAL_POSITION_INDEX: number;
    /** Prepass depth */
    PREPASS_DEPTH: boolean;
    /** Prepass depth index */
    PREPASS_DEPTH_INDEX: number;
    /** Clip-space depth */
    PREPASS_SCREENSPACE_DEPTH: boolean;
    /** Clip-space depth index */
    PREPASS_SCREENSPACE_DEPTH_INDEX: number;
    /** Reflectivity */
    PREPASS_REFLECTIVITY: boolean;
    /** Reflectivity index */
    PREPASS_REFLECTIVITY_INDEX: number;
    /** Velocity */
    PREPASS_VELOCITY: boolean;
    /** Velocity index */
    PREPASS_VELOCITY_INDEX: number;
    /** Velocity linear */
    PREPASS_VELOCITY_LINEAR: boolean;
    /** Velocity linear index */
    PREPASS_VELOCITY_LINEAR_INDEX: number;
    /** Scene MRT count */
    SCENE_MRT_COUNT: number;
    /** BONES */
    NUM_BONE_INFLUENCERS: number;
    /** Bones per mesh */
    BonesPerMesh: number;
    /** Using texture for bone storage */
    BONETEXTURE: boolean;
    /** MORPH TARGETS */
    MORPHTARGETS: boolean;
    /** Morph target position */
    MORPHTARGETS_POSITION: boolean;
    /** Morph target normal */
    MORPHTARGETS_NORMAL: boolean;
    /** Morph target tangent */
    MORPHTARGETS_TANGENT: boolean;
    /** Morph target uv */
    MORPHTARGETS_UV: boolean;
    /** Morph target uv2 */
    MORPHTARGETS_UV2: boolean;
    /** Morph target color support */
    MORPHTARGETS_COLOR: boolean;
    /** Morph target support positions */
    MORPHTARGETTEXTURE_HASPOSITIONS: boolean;
    /** Morph target support normals */
    MORPHTARGETTEXTURE_HASNORMALS: boolean;
    /** Morph target support tangents */
    MORPHTARGETTEXTURE_HASTANGENTS: boolean;
    /** Morph target support uvs */
    MORPHTARGETTEXTURE_HASUVS: boolean;
    /** Morph target support uv2s */
    MORPHTARGETTEXTURE_HASUV2S: boolean;
    /** Morph target texture has colors */
    MORPHTARGETTEXTURE_HASCOLORS: boolean;
    /** Number of morph influencers */
    NUM_MORPH_INFLUENCERS: number;
    /** Using a texture to store morph target data */
    MORPHTARGETS_TEXTURE: boolean;
    /** MISC. */
    BUMPDIRECTUV: number;
    /** Camera is orthographic */
    CAMERA_ORTHOGRAPHIC: boolean;
    /** Camera is perspective */
    CAMERA_PERSPECTIVE: boolean;
    /** Area light support */
    AREALIGHTSUPPORTED: boolean;
    /** Area light no roughness */
    AREALIGHTNOROUGHTNESS: boolean;
    /** Position W as varying */
    POSITIONW_AS_VARYING: boolean;
    /**
     * Creates a new NodeMaterialDefines
     */
    constructor();
    /**
     * Set the value of a specific key
     * @param name defines the name of the key to set
     * @param value defines the value to set
     * @param markAsUnprocessedIfDirty Flag to indicate to the cache that this value needs processing
     */
    setValue(name: string, value: any, markAsUnprocessedIfDirty?: boolean): void;
}
/**
 * Class used to configure NodeMaterial
 */
export interface INodeMaterialOptions {
    /**
     * Defines if blocks should emit comments
     */
    emitComments: boolean;
    /** Defines shader language to use (default to GLSL) */
    shaderLanguage: ShaderLanguage;
}
/**
 * Blocks that manage a texture
 */
export type NodeMaterialTextureBlocks = TextureBlock | ReflectionTextureBaseBlock | RefractionBlock | CurrentScreenBlock | ParticleTextureBlock | ImageSourceBlock | TriPlanarBlock | BiPlanarBlock | PrePassTextureBlock;
declare const NodeMaterialBase_base: {
    new (...args: any[]): {
        _imageProcessingConfiguration: ImageProcessingConfiguration;
        get imageProcessingConfiguration(): ImageProcessingConfiguration;
        set imageProcessingConfiguration(value: ImageProcessingConfiguration);
        _imageProcessingObserver: Nullable<import("../../index.js").Observer<ImageProcessingConfiguration>>;
        _attachImageProcessingConfiguration(configuration: Nullable<ImageProcessingConfiguration>): void;
        get cameraColorCurvesEnabled(): boolean;
        set cameraColorCurvesEnabled(value: boolean);
        get cameraColorGradingEnabled(): boolean;
        set cameraColorGradingEnabled(value: boolean);
        get cameraToneMappingEnabled(): boolean;
        set cameraToneMappingEnabled(value: boolean);
        get cameraExposure(): number;
        set cameraExposure(value: number);
        get cameraContrast(): number;
        set cameraContrast(value: number);
        get cameraColorGradingTexture(): Nullable<BaseTexture>;
        set cameraColorGradingTexture(value: Nullable<BaseTexture>);
        get cameraColorCurves(): Nullable<import("../index.js").ColorCurves>;
        set cameraColorCurves(value: Nullable<import("../index.js").ColorCurves>);
    };
} & typeof PushMaterial;
declare class NodeMaterialBase extends NodeMaterialBase_base {
}
/**
 * Class used to create a node based material built by assembling shader blocks
 */
export declare class NodeMaterial extends NodeMaterialBase {
    private static _BuildIdGenerator;
    private _options;
    private _vertexCompilationState;
    private _fragmentCompilationState;
    private _sharedData;
    private _buildId;
    private _buildWasSuccessful;
    private _cachedWorldViewMatrix;
    private _cachedWorldViewProjectionMatrix;
    private _optimizers;
    private _animationFrame;
    private _buildIsInProgress;
    /** Define the Url to load node editor script */
    static EditorURL: string;
    /** Define the Url to load snippets */
    static SnippetUrl: string;
    /** Gets or sets a boolean indicating that node materials should not deserialize textures from json / snippet content */
    static IgnoreTexturesAtLoadTime: boolean;
    /** Gets or sets a boolean indicating that render target textures can be serialized */
    static AllowSerializationOfRenderTargetTextures: boolean;
    /** Defines default shader language when no option is defined */
    static DefaultShaderLanguage: ShaderLanguage;
    /** If true, the node material will use GLSL if the engine is WebGL and WGSL if it's WebGPU. It takes priority over DefaultShaderLanguage if it's true */
    static UseNativeShaderLanguageOfEngine: boolean;
    private BJSNODEMATERIALEDITOR;
    /** Gets whether the node material is currently building */
    get buildIsInProgress(): boolean;
    /** @internal */
    _useAdditionalColor: boolean;
    /**
     * Sets whether glow mode is enabled
     * @param value - the value to set
     */
    set _glowModeEnabled(value: boolean);
    /** Get the inspector from bundle or global
     * @returns the global NME
     */
    private _getGlobalNodeMaterialEditor;
    /** Gets or sets the active shader language */
    get shaderLanguage(): ShaderLanguage;
    set shaderLanguage(value: ShaderLanguage);
    /**
     * Snippet ID if the material was created from the snippet server
     */
    snippetId: string;
    /**
     * Gets or sets data used by visual editor
     * @see https://nme.babylonjs.com
     */
    editorData: any;
    /**
     * Gets or sets a boolean indicating that alpha value must be ignored (This will turn alpha blending off even if an alpha value is produced by the material)
     */
    ignoreAlpha: boolean;
    /**
     * Defines the maximum number of lights that can be used in the material
     */
    maxSimultaneousLights: number;
    /**
     * Observable raised when the material is built
     */
    onBuildObservable: Observable<NodeMaterial>;
    /**
     * Observable raised when an error is detected
     */
    onBuildErrorObservable: Observable<string>;
    /**
     * Gets or sets the root nodes of the material vertex shader
     */
    _vertexOutputNodes: NodeMaterialBlock[];
    /**
     * Gets or sets the root nodes of the material fragment (pixel) shader
     */
    _fragmentOutputNodes: NodeMaterialBlock[];
    /** Gets or sets options to control the node material overall behavior */
    get options(): INodeMaterialOptions;
    set options(options: INodeMaterialOptions);
    /**
     * Gets an array of blocks that needs to be serialized even if they are not yet connected
     */
    attachedBlocks: NodeMaterialBlock[];
    /**
     * Specifies the mode of the node material
     * @internal
     */
    _mode: NodeMaterialModes;
    /**
     * Gets or sets the mode property
     */
    get mode(): NodeMaterialModes;
    set mode(value: NodeMaterialModes);
    /** Gets or sets the unique identifier used to identified the effect associated with the material */
    get buildId(): number;
    set buildId(value: number);
    /**
     * A free comment about the material
     */
    comment: string;
    /**
     * Create a new node based material
     * @param name defines the material name
     * @param scene defines the hosting scene
     * @param options defines creation option
     */
    constructor(name: string, scene?: Scene, options?: Partial<INodeMaterialOptions>);
    /**
     * Gets the current class name of the material e.g. "NodeMaterial"
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Get a block by its name
     * @param name defines the name of the block to retrieve
     * @returns the required block or null if not found
     */
    getBlockByName(name: string): NodeMaterialBlock | null;
    /**
     * Get a block using a predicate
     * @param predicate defines the predicate used to find the good candidate
     * @returns the required block or null if not found
     */
    getBlockByPredicate(predicate: (block: NodeMaterialBlock) => boolean): NodeMaterialBlock | null;
    /**
     * Get an input block using a predicate
     * @param predicate defines the predicate used to find the good candidate
     * @returns the required input block or null if not found
     */
    getInputBlockByPredicate(predicate: (block: InputBlock) => boolean): Nullable<InputBlock>;
    /**
     * Gets the list of input blocks attached to this material
     * @returns an array of InputBlocks
     */
    getInputBlocks(): InputBlock[];
    /**
     * Adds a new optimizer to the list of optimizers
     * @param optimizer defines the optimizers to add
     * @returns the current material
     */
    registerOptimizer(optimizer: NodeMaterialOptimizer): this | undefined;
    /**
     * Remove an optimizer from the list of optimizers
     * @param optimizer defines the optimizers to remove
     * @returns the current material
     */
    unregisterOptimizer(optimizer: NodeMaterialOptimizer): this | undefined;
    /**
     * Add a new block to the list of output nodes
     * @param node defines the node to add
     * @returns the current material
     */
    addOutputNode(node: NodeMaterialBlock): this;
    /**
     * Remove a block from the list of root nodes
     * @param node defines the node to remove
     * @returns the current material
     */
    removeOutputNode(node: NodeMaterialBlock): this;
    private _addVertexOutputNode;
    private _removeVertexOutputNode;
    private _addFragmentOutputNode;
    private _removeFragmentOutputNode;
    /**
     * Gets or sets a boolean indicating that alpha blending must be enabled no matter what alpha value or alpha channel of the FragmentBlock are
     */
    forceAlphaBlending: boolean;
    /**
     * Gets whether the glow layer is supported
     * @returns true if the glow layer is supported
     */
    get _supportGlowLayer(): boolean;
    /**
     * Specifies if the material will require alpha blending
     * @returns a boolean specifying if alpha blending is needed
     */
    needAlphaBlending(): boolean;
    /**
     * Specifies if this material should be rendered in alpha test mode
     * @returns a boolean specifying if an alpha test is needed.
     */
    needAlphaTesting(): boolean;
    private _processInitializeOnLink;
    private _attachBlock;
    private _initializeBlock;
    private _resetDualBlocks;
    /**
     * Remove a block from the current node material
     * @param block defines the block to remove
     */
    removeBlock(block: NodeMaterialBlock): void;
    /**
     * Build the material and generates the inner effect
     * @param verbose defines if the build should log activity
     * @param updateBuildId defines if the internal build Id should be updated (default is true)
     * @param autoConfigure defines if the autoConfigure method should be called when initializing blocks (default is false)
     */
    build(verbose?: boolean, updateBuildId?: boolean, autoConfigure?: boolean): void;
    private _finishBuildProcess;
    /**
     * Runs an optimization phase to try to improve the shader code
     */
    optimize(): void;
    private _prepareDefinesForAttributes;
    /**
     * Can this material render to prepass
     */
    get isPrePassCapable(): boolean;
    /**
     * Outputs written to the prepass
     */
    get prePassTextureOutputs(): number[];
    /**
     * Gets the list of prepass texture required
     */
    get prePassTextureInputs(): number[];
    /**
     * Sets the required values to the prepass renderer.
     * @param prePassRenderer defines the prepass renderer to set
     * @returns true if the pre pass is needed
     */
    setPrePassRenderer(prePassRenderer: PrePassRenderer): boolean;
    /**
     * Create a post process from the material
     * @param camera The camera to apply the render pass to.
     * @param options The required width/height ratio to downsize to before computing the render pass. (Use 1.0 for full size)
     * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
     * @param engine The engine which the post process will be applied. (default: current engine)
     * @param reusable If the post process can be reused on the same frame. (default: false)
     * @param textureType Type of textures used when performing the post process. (default: 0)
     * @param textureFormat Format of textures used when performing the post process. (default: TEXTUREFORMAT_RGBA)
     * @returns the post process created
     */
    createPostProcess(camera: Nullable<Camera>, options?: number | PostProcessOptions, samplingMode?: number, engine?: AbstractEngine, reusable?: boolean, textureType?: number, textureFormat?: number): Nullable<PostProcess>;
    /**
     * Create the post process effect from the material
     * @param postProcess The post process to create the effect for
     */
    createEffectForPostProcess(postProcess: PostProcess): void;
    private _createEffectForPostProcess;
    /**
     * Create a new procedural texture based on this node material
     * @param size defines the size of the texture
     * @param scene defines the hosting scene
     * @returns the new procedural texture attached to this node material
     */
    createProceduralTexture(size: number | {
        width: number;
        height: number;
        layers?: number;
    }, scene: Scene): Nullable<ProceduralTexture>;
    private _createEffectForParticles;
    private _checkInternals;
    /**
     * Create the effect to be used as the custom effect for a particle system.
     * If the material has not been built successfully yet, the build is started when needed and the effect is only
     * created once it completes, so the effect may not be set on the particle system when this method returns.
     * @param particleSystem Particle system to create the effect for
     * @param onCompiled defines a function to call when the effect creation is successful
     * @param onError defines a function to call when the effect creation has failed
     */
    createEffectForParticles(particleSystem: IParticleSystem, onCompiled?: (effect: Effect) => void, onError?: (effect: Effect, errors: string) => void): void;
    /**
     * Use this material as the shadow depth wrapper of a target material
     * @param targetMaterial defines the target material
     */
    createAsShadowDepthWrapper(targetMaterial: Material): void;
    private _processDefines;
    /**
     * Get if the submesh is ready to be used and all its information available.
     * Child classes can use it to update shaders
     * @param mesh defines the mesh to check
     * @param subMesh defines which submesh to check
     * @param useInstances specifies that instances should be used
     * @returns a boolean indicating that the submesh is ready or not
     */
    isReadyForSubMesh(mesh: AbstractMesh, subMesh: SubMesh, useInstances?: boolean): boolean;
    /**
     * Get a string representing the shaders built by the current node graph
     */
    get compiledShaders(): string;
    /**
     * Get a string representing the fragment shader used by the engine for the current node graph
     * @internal
     */
    _getProcessedFragmentAsync(): Promise<string>;
    /**
     * Binds the world matrix to the material
     * @param world defines the world transformation matrix
     */
    bindOnlyWorldMatrix(world: Matrix): void;
    /**
     * Binds the submesh to this material by preparing the effect and shader to draw
     * @param world defines the world transformation matrix
     * @param mesh defines the mesh containing the submesh
     * @param subMesh defines the submesh to bind the material to
     */
    bindForSubMesh(world: Matrix, mesh: Mesh, subMesh: SubMesh): void;
    /**
     * Gets the active textures from the material
     * @returns an array of textures
     */
    getActiveTextures(): BaseTexture[];
    /**
     * Gets the list of texture blocks
     * Note that this method will only return blocks that are reachable from the final block(s) and only after the material has been built!
     * @returns an array of texture blocks
     */
    getTextureBlocks(): NodeMaterialTextureBlocks[];
    /**
     * Gets the list of all texture blocks
     * Note that this method will scan all attachedBlocks and return blocks that are texture blocks
     * @returns
     */
    getAllTextureBlocks(): NodeMaterialTextureBlocks[];
    /**
     * Specifies if the material uses a texture
     * @param texture defines the texture to check against the material
     * @returns a boolean specifying if the material uses the texture
     */
    hasTexture(texture: BaseTexture): boolean;
    /**
     * Disposes the material
     * @param forceDisposeEffect specifies if effects should be forcefully disposed
     * @param forceDisposeTextures specifies if textures should be forcefully disposed
     * @param notBoundToMesh specifies if the material that is being disposed is known to be not bound to any mesh
     */
    dispose(forceDisposeEffect?: boolean, forceDisposeTextures?: boolean, notBoundToMesh?: boolean): void;
    /** Creates the node editor window.
     * @param additionalConfig Define the configuration of the editor
     */
    private _createNodeEditor;
    /**
     * Launch the node material editor
     * @param config Define the configuration of the editor
     * @returns a promise fulfilled when the node editor is visible
     */
    edit(config?: INodeMaterialEditorOptions): Promise<void>;
    /**
     * Clear the current material
     */
    clear(): void;
    /**
     * Clear the current material and set it to a default state
     */
    setToDefault(): void;
    /**
     * Clear the current material and set it to a default state for post process
     */
    setToDefaultPostProcess(): void;
    /**
     * Clear the current material and set it to a default state for procedural texture
     */
    setToDefaultProceduralTexture(): void;
    /**
     * Clear the current material and set it to a default state for particle
     */
    setToDefaultParticle(): void;
    /**
     * Loads the current Node Material from a url pointing to a file save by the Node Material Editor
     * @deprecated Please use NodeMaterial.ParseFromFileAsync instead
     * @param url defines the url to load from
     * @param rootUrl defines the root URL for nested url in the node material
     * @returns a promise that will fulfil when the material is fully loaded
     */
    loadAsync(url: string, rootUrl?: string): Promise<NodeMaterial>;
    private _gatherBlocks;
    /**
     * Generate a string containing the code declaration required to create an equivalent of this material
     * @returns a string
     */
    generateCode(): string;
    /**
     * Serializes this material in a JSON representation
     * @param selectedBlocks defines an optional list of blocks to serialize
     * @returns the serialized material object
     */
    serialize(selectedBlocks?: NodeMaterialBlock[]): any;
    private _restoreConnections;
    private static _DefaultImageProcessingConfigurationSerialized?;
    /**
     * Determines whether a parsed image processing configuration only holds default values.
     * @param configuration the configuration to test
     * @returns true if the configuration matches a freshly created default configuration
     */
    private static _IsDefaultImageProcessingConfiguration;
    /**
     * Clear the current graph and load a new one from a serialization object
     * @param source defines the JSON representation of the material
     * @param rootUrl defines the root URL to use to load textures and relative dependencies
     * @param merge defines whether or not the source must be merged or replace the current content
     * @param urlRewriter defines a function used to rewrite urls
     */
    parseSerializedObject(source: any, rootUrl?: string, merge?: boolean, urlRewriter?: (url: string) => string): void;
    /**
     * Clear the current graph and load a new one from a serialization object
     * @param source defines the JSON representation of the material
     * @param rootUrl defines the root URL to use to load textures and relative dependencies
     * @param merge defines whether or not the source must be merged or replace the current content
     * @deprecated Please use the parseSerializedObject method instead
     */
    loadFromSerialization(source: any, rootUrl?: string, merge?: boolean): void;
    /**
     * Makes a duplicate of the current material.
     * @param name defines the name to use for the new material
     * @param shareEffect defines if the clone material should share the same effect (default is false)
     * @returns the cloned material
     */
    clone(name: string, shareEffect?: boolean): NodeMaterial;
    /**
     * Awaits for all the material textures to be ready before resolving the returned promise.
     * @returns A promise that resolves when the textures are ready.
     */
    whenTexturesReadyAsync(): Promise<void[]>;
}
/**
 * Checks if a block is a texture block
 * @param block The block to check
 * @returns True if the block is a texture block
 */
export declare function NodeMaterialBlockIsTextureBlock(block: NodeMaterialBlock): block is NodeMaterialTextureBlocks;
/**
 * Creates a node material from parsed material data
 * @param source defines the JSON representation of the material
 * @param scene defines the hosting scene
 * @param rootUrl defines the root URL to use to load textures and relative dependencies
 * @param shaderLanguage defines the language to use (GLSL by default)
 * @returns a new node material
 */
export declare function NodeMaterialParse(source: any, scene: Scene, rootUrl?: string, shaderLanguage?: ShaderLanguage): NodeMaterial;
/**
 * Creates a node material from a snippet saved in a remote file
 * @param name defines the name of the material to create
 * @param url defines the url to load from
 * @param scene defines the hosting scene
 * @param rootUrl defines the root URL for nested url in the node material
 * @param skipBuild defines whether to build the node material
 * @param targetMaterial defines a material to use instead of creating a new one
 * @param urlRewriter defines a function used to rewrite urls
 * @param options defines options to be used with the node material
 * @returns a promise that will resolve to the new node material
 */
export declare function NodeMaterialParseFromFileAsync(name: string, url: string, scene: Scene, rootUrl?: string, skipBuild?: boolean, targetMaterial?: NodeMaterial, urlRewriter?: (url: string) => string, options?: Partial<INodeMaterialOptions>): Promise<NodeMaterial>;
/**
 * Creates a node material from a snippet saved by the node material editor
 * @param snippetId defines the snippet to load
 * @param scene defines the hosting scene
 * @param rootUrl defines the root URL to use to load textures and relative dependencies
 * @param nodeMaterial defines a node material to update (instead of creating a new one)
 * @param skipBuild defines whether to build the node material
 * @param waitForTextureReadyness defines whether to wait for texture readiness resolving the promise (default: false)
 * @param urlRewriter defines a function used to rewrite urls
 * @param options defines options to be used with the node material
 * @returns a promise that will resolve to the new node material
 */
export declare function NodeMaterialParseFromSnippetAsync(this: typeof NodeMaterial | void, snippetId: string, scene?: Scene, rootUrl?: string, nodeMaterial?: NodeMaterial, skipBuild?: boolean, waitForTextureReadyness?: boolean, urlRewriter?: (url: string) => string, options?: Partial<INodeMaterialOptions>): Promise<NodeMaterial>;
/**
 * Creates a new node material set to default basic configuration
 * @param name defines the name of the material
 * @param scene defines the hosting scene
 * @returns a new NodeMaterial
 */
export declare function NodeMaterialCreateDefault(name: string, scene?: Scene): NodeMaterial;
/**
 * Register side effects for nodeMaterial.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterNodeMaterial(): void;
export {};
