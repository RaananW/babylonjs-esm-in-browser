/** This file must only contain pure code and pure imports */
import { type Mesh } from "../../Meshes/mesh.pure.js";
import { type Scene } from "../../scene.pure.js";
import { Texture } from "../../Materials/Textures/texture.pure.js";
import { PostProcessRenderPipeline } from "../../PostProcesses/RenderPipeline/postProcessRenderPipeline.js";
import { type Camera } from "../../Cameras/camera.pure.js";
import { RawTexture } from "../../Materials/Textures/rawTexture.js";
import { type Material } from "../../Materials/material.pure.js";
import { Observable } from "../../Misc/observable.pure.js";
interface IIblShadowsSettings {
    /**
     * The exponent of the resolution of the voxel shadow grid. Higher resolutions will result in sharper
     * shadows but are more expensive to compute and require more memory.
     * The resolution is calculated as 2 to the power of this number.
     */
    resolutionExp?: number;
    /**
     * The number of different directions to sample during the voxel tracing pass. Higher
     * values will result in better quality, more stable shadows but are more expensive to compute.
     */
    sampleDirections?: number;
    /**
     * How dark the shadows are. 1.0 is full opacity, 0.0 is no shadows.
     */
    shadowOpacity?: number;
    /**
     * The global Y-axis rotation of the IBL for shadows. This should match the Y-rotation of the environment map applied to materials, skybox, etc.
     */
    envRotation?: number;
    /**
     * A factor that controls how long the shadows remain in the scene.
     * 0.0 is no persistence, 1.0 is full persistence.
     * This value applies only while the camera is moving. Once stationary, the pipeline
     * increases remanence automatically to help the shadows converge.
     */
    shadowRemanence?: number;
    /**
     * Render the voxel grid from 3 different axis. This will result in better quality shadows with fewer
     * bits of missing geometry.
     */
    triPlanarVoxelization?: boolean;
    /**
     * A size multiplier for the internal shadow render targets (default 1.0). A value of 1.0 represents full-resolution.
     * Scaling this below 1.0 will result in blurry shadows and potentially more artifacts but
     * could help increase performance on less powerful GPU's.
     */
    shadowRenderSizeFactor?: number;
    /**
     * Separate control for the opacity of the voxel shadows.
     */
    voxelShadowOpacity?: number;
    /**
     * Include screen-space shadows in the IBL shadow pipeline. This adds sharp shadows to small details
     * but only applies close to a shadow-casting object.
     */
    ssShadowsEnabled?: boolean;
    /**
     * The number of samples used in the screen space shadow pass.
     */
    ssShadowSampleCount?: number;
    /**
     * The stride of the screen-space shadow pass. This controls the distance between samples
     * in pixels.
     */
    ssShadowStride?: number;
    /**
     * A scale for the maximum distance a screen-space shadow can be cast in world-space.
     * The maximum distance that screen-space shadows cast is derived from the voxel size
     * and this value so shouldn't need to change if you scale your scene.
     */
    ssShadowDistanceScale?: number;
    /**
     * Screen-space shadow thickness scale. This value controls the assumed thickness of
     * on-screen surfaces in world-space. It scales with the size of the shadow-casting
     * region so shouldn't need to change if you scale your scene.
     */
    ssShadowThicknessScale?: number;
    /**
     * Maximum number of translucent voxels a shadow ray roulettes through before it is treated as
     * unoccluded (default 16). Higher values converge more accurately through thick translucent volumes
     * (e.g. dense Gaussian splats) at extra cost. Opaque voxels always block on first contact.
     */
    maxVoxelRouletteTests?: number;
}
/**
 * Voxel-based shadow rendering for IBL's.
 * This should not be instanciated directly, as it is part of a scene component
 */
export declare class IblShadowsRenderPipeline extends PostProcessRenderPipeline {
    /**
     * The scene that this pipeline is attached to
     */
    scene: Scene;
    private _allowDebugPasses;
    private _debugPasses;
    private _geometryBufferRenderer;
    private _shadowCastingMeshes;
    private _voxelRenderer;
    private _voxelTracingPass;
    private _spatialBlurPass;
    private _accumulationPass;
    private _noiseTexture;
    /**
     * Raw texture to be used before final data is available.
     * @internal
     */
    _dummyTexture2d: RawTexture;
    private _dummyTexture3d;
    private _shadowOpacity;
    private _enabled;
    private _coloredShadows;
    private _materialsWithRenderPlugin;
    /**
     * Observable that triggers when the shadow renderer is ready
     */
    onShadowTextureReadyObservable: Observable<void>;
    /**
     * Observable that triggers when a new IBL is set and the importance sampling is ready
     */
    onNewIblReadyObservable: Observable<void>;
    /**
     * Observable that triggers when the voxelization is complete
     */
    onVoxelizationCompleteObservable: Observable<void>;
    /**
     * The current world-space size of that the voxel grid covers in the scene.
     */
    voxelGridSize: number;
    /**
     * Reset the shadow accumulation. This has a similar affect to lowering the remanence for a single frame.
     * This is useful when making a sudden change to the IBL.
     */
    resetAccumulation(): void;
    /**
     * How dark the shadows appear. 1.0 is full opacity, 0.0 is no shadows.
     */
    get shadowOpacity(): number;
    set shadowOpacity(value: number);
    /**
     * Render the shadows in color rather than black and white.
     * This is slightly more expensive than black and white shadows but can be much
     * more accurate when the strongest lights in the IBL are non-white.
     */
    get coloredShadows(): boolean;
    set coloredShadows(value: boolean);
    private _renderSizeFactor;
    /**
     * A multiplier for the render size of the shadows. Used for rendering lower-resolution shadows.
     */
    get shadowRenderSizeFactor(): number;
    set shadowRenderSizeFactor(value: number);
    /**
     * How dark the voxel shadows appear. 1.0 is full opacity, 0.0 is no shadows.
     */
    get voxelShadowOpacity(): number;
    set voxelShadowOpacity(value: number);
    /**
     * Maximum number of translucent voxels a shadow ray roulettes through before it is treated as
     * unoccluded. Higher values converge more accurately at extra cost. Opaque voxels always block.
     */
    get maxVoxelRouletteTests(): number;
    set maxVoxelRouletteTests(value: number);
    /**
     * How dark the screen-space shadows appear. 1.0 is full opacity, 0.0 is no shadows.
     */
    get ssShadowOpacity(): number;
    set ssShadowOpacity(value: number);
    /**
     * The number of samples used in the screen space shadow pass.
     */
    get ssShadowSampleCount(): number;
    set ssShadowSampleCount(value: number);
    /**
     * The stride of the screen-space shadow pass. This controls the distance between samples
     * in pixels.
     */
    get ssShadowStride(): number;
    set ssShadowStride(value: number);
    private _sssMaxDistScale;
    /**
     * A scale for the maximum distance a screen-space shadow can be cast in world-space.
     * The maximum distance that screen-space shadows cast is derived from the voxel size
     * and this value so shouldn't need to change if you scale your scene
     */
    get ssShadowDistanceScale(): number;
    set ssShadowDistanceScale(value: number);
    private _sssThicknessScale;
    /**
     * Screen-space shadow thickness scale. This value controls the assumed thickness of
     * on-screen surfaces in world-space. It scales with the size of the shadow-casting
     * region so shouldn't need to change if you scale your scene.
     */
    get ssShadowThicknessScale(): number;
    set ssShadowThicknessScale(value: number);
    /**
     * Returns the texture containing the voxel grid data
     * @returns The texture containing the voxel grid data
     * @internal
     */
    _getVoxelGridTexture(): Texture;
    /**
     * Returns the noise texture.
     * @returns The noise texture.
     * @internal
     */
    _getNoiseTexture(): Texture;
    /**
     * Returns the voxel-tracing texture.
     * @returns The voxel-tracing texture.
     * @internal
     */
    _getVoxelTracingTexture(): Texture;
    /**
     * Returns the spatial blur texture.
     * @returns The spatial blur texture.
     * @internal
     */
    _getSpatialBlurTexture(): Texture;
    /**
     * Returns the accumulated shadow texture.
     * @returns The accumulated shadow texture.
     * @internal
     */
    _getAccumulatedTexture(): Texture;
    private _gbufferDebugPass;
    private _gbufferDebugEnabled;
    private _gBufferDebugSizeParams;
    /**
     * Turn on or off the debug view of the G-Buffer. This will display only the targets
     * of the g-buffer that are used by the shadow pipeline.
     */
    get gbufferDebugEnabled(): boolean;
    set gbufferDebugEnabled(enabled: boolean);
    /**
     * Turn on or off the debug view of the CDF importance sampling data
     */
    get cdfDebugEnabled(): boolean;
    /**
     * Turn on or off the debug view of the CDF importance sampling data
     */
    set cdfDebugEnabled(enabled: boolean);
    /**
     * Display the debug view for just the shadow samples taken this frame.
     */
    get voxelTracingDebugEnabled(): boolean;
    set voxelTracingDebugEnabled(enabled: boolean);
    /**
     * Display the debug view for the spatial blur pass
     */
    get spatialBlurPassDebugEnabled(): boolean;
    set spatialBlurPassDebugEnabled(enabled: boolean);
    /**
     * Display the debug view for the shadows accumulated over time.
     */
    get accumulationPassDebugEnabled(): boolean;
    set accumulationPassDebugEnabled(enabled: boolean);
    /**
     * Add a mesh to be used for shadow-casting in the IBL shadow pipeline.
     * These meshes will be written to the voxel grid.
     * @param mesh A mesh or list of meshes that you want to cast shadows
     */
    addShadowCastingMesh(mesh: Mesh | Mesh[]): void;
    /**
     * Remove a mesh from the shadow-casting list. The mesh will no longer be written
     * to the voxel grid and will not cast shadows.
     * @param mesh The mesh or list of meshes that you don't want to cast shadows.
     */
    removeShadowCastingMesh(mesh: Mesh | Mesh[]): void;
    /**
     * Clear the list of shadow-casting meshes. This will remove all meshes from the list
     */
    clearShadowCastingMeshes(): void;
    /**
     * The exponent of the resolution of the voxel shadow grid. Higher resolutions will result in sharper
     * shadows but are more expensive to compute and require more memory.
     * The resolution is calculated as 2 to the power of this number.
     */
    get resolutionExp(): number;
    set resolutionExp(newResolution: number);
    /**
     * The number of different directions to sample during the voxel tracing pass
     */
    get sampleDirections(): number;
    /**
     * The number of different directions to sample during the voxel tracing pass
     */
    set sampleDirections(value: number);
    /**
     * The decree to which the shadows persist between frames. 0.0 is no persistence, 1.0 is full persistence.
     **/
    get shadowRemanence(): number;
    /**
     * The decree to which the shadows persist between frames. 0.0 is no persistence, 1.0 is full persistence.
     **/
    set shadowRemanence(value: number);
    /**
     * The global Y-axis rotation of the IBL for shadows. This should match the Y-rotation of the environment map applied to materials, skybox, etc.
     */
    get envRotation(): number;
    /**
     * The global Y-axis rotation of the IBL for shadows. This should match the Y-rotation of the environment map applied to materials, skybox, etc.
     */
    set envRotation(value: number);
    /**
     * Allow debug passes to be enabled. Default is false.
     */
    get allowDebugPasses(): boolean;
    /**
     * Allow debug passes to be enabled. Default is false.
     */
    set allowDebugPasses(value: boolean);
    /**
     *  Support test.
     */
    static get IsSupported(): boolean;
    /**
     * Toggle the shadow tracing on or off
     * @param enabled Toggle the shadow tracing on or off
     */
    toggleShadow(enabled: boolean): void;
    /**
     * Trigger the scene to be re-voxelized. This should be run when any shadow-casters have been added, removed or moved.
     */
    updateVoxelization(): void;
    /**
     * Trigger the scene bounds of shadow-casters to be calculated. This is the world size that the voxel grid will cover and will always be a cube.
     */
    updateSceneBounds(): void;
    /**
     * @param name The rendering pipeline name
     * @param scene The scene linked to this pipeline
     * @param options Options to configure the pipeline
     * @param cameras Cameras to apply the pipeline to.
     */
    constructor(name: string, scene: Scene, options?: Partial<IIblShadowsSettings>, cameras?: Camera[]);
    private _handleResize;
    private _getGBufferDebugPass;
    private _createDebugPasses;
    private _disposeEffectPasses;
    private _disposeDebugPasses;
    private _updateDebugPasses;
    /**
     * Update the SS shadow max distance and thickness based on the voxel grid size and resolution.
     * The max distance should be just a little larger than the world size of a single voxel.
     */
    private _updateSsShadowParams;
    /**
     * Apply the shadows to a material or array of materials. If no material is provided, all
     * materials in the scene will be added.
     * @param material Material that will be affected by the shadows. If not provided, all materials of the scene will be affected.
     */
    addShadowReceivingMaterial(material?: Material | Material[]): void;
    /**
     * Remove a material from the list of materials that receive shadows. If no material
     * is provided, all materials in the scene will be removed.
     * @param material The material or array of materials that will no longer receive shadows
     */
    removeShadowReceivingMaterial(material: Material | Material[]): void;
    /**
     * Clear the list of materials that receive shadows. This will remove all materials from the list
     */
    clearShadowReceivingMaterials(): void;
    protected _addShadowSupportToMaterial(material: Material): void;
    protected _setPluginParameters(): void;
    private _updateBeforeRender;
    private _listenForCameraChanges;
    /**
     * Checks if the IBL shadow pipeline is ready to render shadows
     * @returns true if the IBL shadow pipeline is ready to render the shadows
     */
    isReady(): boolean | null;
    /**
     * Get the class name
     * @returns "IBLShadowsRenderPipeline"
     */
    getClassName(): string;
    /**
     * Disposes the IBL shadow pipeline and associated resources
     */
    dispose(): void;
}
export {};
