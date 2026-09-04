import { type Effect } from "../Materials/effect.js";
import { Material } from "../Materials/material.js";
import { type BaseTexture } from "../Materials/Textures/baseTexture.js";
import { Color3 } from "../Maths/math.color.pure.js";
import { type AbstractMesh } from "../Meshes/abstractMesh.js";
import { type Mesh } from "../Meshes/mesh.js";
import { type SubMesh } from "../Meshes/subMesh.js";
import { type Scene } from "../scene.js";
import { type Nullable } from "../types.js";
import { type IThinEffectLayerOptions, ThinEffectLayer } from "./thinEffectLayer.js";
/**
 * Selection outline layer options. This helps customizing the behaviour
 * of the selection outline layer.
 */
export interface IThinSelectionOutlineLayerOptions extends IThinEffectLayerOptions {
    /**
     * Use the GLSL code generation for the shader (even on WebGPU). Default is false
     */
    forceGLSL?: boolean;
    /**
     * Specifies whether the depth stored is the Z coordinate in camera space.
     */
    storeCameraSpaceZ?: boolean;
    /**
     * Outline method to use (default: Constants.OUTLINELAYER_SAMPLING_TRIDIRECTIONAL)
     *
     * @see {@link Constants.OUTLINELAYER_SAMPLING_TRIDIRECTIONAL}
     */
    outlineMethod?: number;
    /**
     * Whether to use depth when drawing selection outlines. Disable this to avoid depth renderer usage and draw selected outlines without depth clipping.
     */
    useDepthOcclusion?: boolean;
}
/**
 * @internal
 */
export declare class ThinSelectionOutlineLayer extends ThinEffectLayer {
    /**
     * Effect Name of the layer.
     */
    static readonly EffectName = "SelectionOutlineLayer";
    /**
     * Name of the instance selection ID attribute
     * @internal
     */
    static readonly InstanceSelectionIdAttributeName = "instanceSelectionId";
    /**
     * The outline color
     */
    outlineColor: Color3;
    /**
     * The thickness of the edges
     */
    outlineThickness: number;
    /**
     * The occlusion threshold (default: 0.0001)
     */
    occlusionThreshold: number;
    private _occlusionStrength;
    private _useDepthOcclusion;
    /**
     * The strength of the occlusion effect (default: 0.8)
     */
    get occlusionStrength(): number;
    set occlusionStrength(value: number);
    /**
     * Whether to use depth when drawing selection outlines.
     * Disable this to avoid depth renderer usage; selected outlines will not be clipped by scene or selected geometry.
     */
    get useDepthOcclusion(): boolean;
    set useDepthOcclusion(value: boolean);
    private get _shouldUseComposeDepthOcclusion();
    /**
     * The width of the source texture
     */
    textureWidth: number;
    /**
     * The height of the source texture
     */
    textureHeight: number;
    /** @internal */
    _options: Required<IThinSelectionOutlineLayerOptions>;
    /** @internal */
    readonly _meshUniqueIdToSelectionId: number[];
    /** @internal */
    _selection: Nullable<AbstractMesh[]>;
    private _instancedBufferSources;
    private _nextSelectionId;
    /**
     * Instantiates a new selection outline Layer and references it to the scene..
     * @param name The name of the layer
     * @param scene The scene to use the layer in
     * @param options Sets of none mandatory options to use with the layer (see IThinSelectionOutlineLayerOptions for more information)
     * @param dontCheckIfReady Specifies if the layer should disable checking whether all the post processes are ready (default: false). To save performance, this should be set to true and you should call `isReady` manually before rendering to the layer.
     */
    constructor(name: string, scene?: Scene, options?: Partial<IThinSelectionOutlineLayerOptions>, dontCheckIfReady?: boolean);
    /**
     * Gets the class name of the effect layer
     * @returns the string with the class name of the effect layer
     */
    getClassName(): string;
    /** @internal */
    _internalIsSubMeshReady(subMesh: SubMesh, useInstances: boolean, _emissiveTexture: Nullable<BaseTexture>): boolean;
    protected _importShadersAsync(): Promise<void>;
    /**
     * Get the effect name of the layer.
     * @returns The effect name
     */
    getEffectName(): string;
    /** @internal */
    _createMergeEffect(): Effect;
    /** @internal */
    _createTextureAndPostProcesses(): void;
    /**
     * Checks for the readiness of the element composing the layer.
     * @param subMesh the mesh to check for
     * @param useInstances specify whether or not to use instances to render the mesh
     * @returns true if ready otherwise, false
     */
    isReady(subMesh: SubMesh, useInstances: boolean): boolean;
    /** @internal */
    _canRenderMesh(_mesh: AbstractMesh, _material: Material): boolean;
    protected _renderSubMesh(subMesh: SubMesh, enableAlphaMode?: boolean): void;
    /** @internal */
    _internalCompose(effect: Effect, _renderIndex: number): void;
    /** @internal */
    _setEmissiveTextureAndColor(_mesh: Mesh, _subMesh: SubMesh, _material: Material): void;
    /**
     * Returns true if the layer contains information to display, otherwise false.
     * @returns true if the glow layer should be rendered
     */
    shouldRender(): boolean;
    /** @internal */
    _shouldRenderMesh(mesh: Mesh): boolean;
    /** @internal */
    _addCustomEffectDefines(defines: string[]): void;
    /**
     * Determine if a given mesh will be used in the current effect.
     * @param mesh mesh to test
     * @returns true if the mesh will be used
     */
    hasMesh(mesh: AbstractMesh): boolean;
    /** @internal */
    _useMeshMaterial(_mesh: AbstractMesh): boolean;
    /**
     * Remove all the meshes currently referenced in the selection outline layer
     */
    clearSelection(): void;
    /**
     * Remove instanceSelectionId instanced buffer registration from a mesh,
     * including GPU resources (per-pass VBOs, vertex buffers, VAOs).
     * @param mesh - The mesh to clean up
     */
    private _cleanUpInstanceSelectionId;
    /**
     * Adds mesh or group of mesh to the current selection
     *
     * If a group of meshes is provided, they will outline as a single unit
     * @param meshOrGroup Meshes to add to the selection
     */
    addSelection(meshOrGroup: AbstractMesh | AbstractMesh[]): void;
    /**
     * Free any resources and references associated to a mesh.
     * Internal use
     * @param mesh The mesh to free.
     * @internal
     */
    _disposeMesh(mesh: Mesh): void;
    /**
     * Dispose the effect layer and free resources.
     */
    dispose(): void;
}
