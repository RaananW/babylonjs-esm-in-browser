/** This file must only contain pure code and pure imports */
import { Scene } from "../scene.pure.js";
import { type SubMesh } from "../Meshes/subMesh.pure.js";
import { type AbstractMesh } from "../Meshes/abstractMesh.pure.js";
import { type Mesh } from "../Meshes/mesh.pure.js";
import { type Effect } from "../Materials/effect.pure.js";
import { type Material } from "../Materials/material.pure.js";
import { EffectLayer } from "./effectLayer.js";
import { ThinSelectionOutlineLayer, type IThinSelectionOutlineLayerOptions } from "./thinSelectionOutlineLayer.js";
import { type Color3 } from "../Maths/math.color.pure.js";
/**
 * Selection outline layer options. This helps customizing the behaviour
 * of the selection outline layer.
 */
export interface ISelectionOutlineLayerOptions extends IThinSelectionOutlineLayerOptions {
    /**
     * Enable MSAA by choosing the number of samples. Default: 1
     */
    mainTextureSamples?: number;
}
/**
 * The selection outline layer Helps adding a outline effect around a mesh.
 *
 * Once instantiated in a scene, simply use the addMesh or removeMesh method to add or remove
 * outlined meshes to your scene.
 */
export declare class SelectionOutlineLayer extends EffectLayer {
    /**
     * Effect Name of the selection outline layer.
     */
    static get EffectName(): string;
    /**
     * The outline color (default (1, 0.5, 0))
     */
    get outlineColor(): Color3;
    set outlineColor(value: Color3);
    /**
     * The thickness of the edges (default: 2.0)
     */
    get outlineThickness(): number;
    set outlineThickness(value: number);
    /**
     * The strength of the occlusion effect (default: 0.8)
     */
    get occlusionStrength(): number;
    set occlusionStrength(value: number);
    /**
     * The occlusion threshold (default: 0.01)
     */
    get occlusionThreshold(): number;
    set occlusionThreshold(value: number);
    /**
     * Whether to use depth when drawing selection outlines.
     * Disable this to avoid depth renderer usage; selected outlines will not be clipped by scene or selected geometry.
     */
    get useDepthOcclusion(): boolean;
    set useDepthOcclusion(value: boolean);
    private _options;
    protected readonly _thinEffectLayer: ThinSelectionOutlineLayer;
    /**
     * Instantiates a new selection outline Layer and references it to the scene..
     * @param name The name of the layer
     * @param scene The scene to use the layer in
     * @param options Sets of none mandatory options to use with the layer (see ISelectionOutlineLayerOptions for more information)
     */
    constructor(name: string, scene?: Scene, options?: Partial<ISelectionOutlineLayerOptions>);
    private _enableDepthRenderer;
    /**
     * Checks if the layer is ready to render.
     * When selections are active and depth occlusion is enabled, this also
     * lazily creates the depth renderer and checks that its depth map is ready.
     * @returns true if the layer is ready
     */
    isLayerReady(): boolean;
    /**
     * Get the effect name of the layer.
     * @returns The effect name
     */
    getEffectName(): string;
    protected _numInternalDraws(): number;
    /**
     * Create the merge effect. This is the shader use to blit the information back
     * to the main canvas at the end of the scene rendering.
     * @returns The effect created
     */
    protected _createMergeEffect(): Effect;
    /**
     * Creates the render target textures and post processes used in the selection outline layer.
     */
    protected _createTextureAndPostProcesses(): void;
    /**
     * Creates the main texture for the effect layer.
     */
    protected _createMainTexture(): void;
    /**
     * @returns whether or not the layer needs stencil enabled during the mesh rendering.
     */
    needStencil(): boolean;
    /**
     * Checks for the readiness of the element composing the layer.
     * @param subMesh the mesh to check for
     * @param useInstances specify whether or not to use instances to render the mesh
     * @returns true if ready otherwise, false
     */
    isReady(subMesh: SubMesh, useInstances: boolean): boolean;
    /**
     * Implementation specific of rendering the generating effect on the main canvas.
     * @param effect The effect used to render through
     * @param renderIndex
     */
    protected _internalRender(effect: Effect, renderIndex: number): void;
    /**
     * @returns true if the layer contains information to display, otherwise false.
     */
    shouldRender(): boolean;
    /**
     * Returns true if the mesh should render, otherwise false.
     * @param mesh The mesh to render
     * @returns true if it should render otherwise false
     */
    protected _shouldRenderMesh(mesh: Mesh): boolean;
    /**
     * Returns true if the mesh can be rendered, otherwise false.
     * @param mesh The mesh to render
     * @param material The material used on the mesh
     * @returns true if it can be rendered otherwise false
     */
    protected _canRenderMesh(mesh: AbstractMesh, material: Material): boolean;
    /**
     * Adds specific effects defines.
     * @param defines The defines to add specifics to.
     */
    protected _addCustomEffectDefines(defines: string[]): void;
    /**
     * Sets the required values for both the emissive texture and and the main color.
     * @param mesh
     * @param subMesh
     * @param material
     */
    protected _setEmissiveTextureAndColor(mesh: Mesh, subMesh: SubMesh, material: Material): void;
    /**
     * Determine if a given mesh will be highlighted by the current SelectionOutlineLayer
     * @param mesh mesh to test
     * @returns true if the mesh will be highlighted by the current SelectionOutlineLayer
     */
    hasMesh(mesh: AbstractMesh): boolean;
    /**
     * Remove all the meshes currently referenced in the selection outline layer
     */
    clearSelection(): void;
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
     * Gets the class name of the effect layer
     * @returns the string with the class name of the effect layer
     */
    getClassName(): string;
    /**
     * Serializes this SelectionOutline layer
     * @returns a serialized SelectionOutline layer object
     */
    serialize(): any;
    /**
     * Creates a SelectionOutline layer from parsed SelectionOutline layer data
     * @param parsedSelectionOutlineLayer defines the SelectionOutline layer data
     * @param scene defines the current scene
     * @param rootUrl defines the root URL containing the SelectionOutline layer information
     * @returns a parsed SelectionOutline layer
     */
    static Parse(parsedSelectionOutlineLayer: any, scene: Scene, rootUrl: string): SelectionOutlineLayer;
}
/**
 * Register side effects for selectionOutlineLayer.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterSelectionOutlineLayer(): void;
