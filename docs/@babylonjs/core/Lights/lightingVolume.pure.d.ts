/** This file must only contain pure code and pure imports */
import { type Scene, type ShadowGenerator } from "../index.js";
import { Mesh } from "../Meshes/mesh.pure.js";
/**
 * Class used to create a lighting volume from a directional light's shadow generator.
 */
export declare class LightingVolume {
    private readonly _engine;
    private readonly _scene;
    private readonly _mesh;
    private readonly _copyTexture?;
    private readonly _uBuffer?;
    private readonly _buildFullVolume;
    private _name;
    private _cs?;
    private _cs2?;
    private _light?;
    private _fallbackTexture?;
    private _storageBuffer?;
    private _depthCopy?;
    private _readPixelPromise;
    private _readPixelAbortController;
    private _numFrames;
    private _firstUpdate;
    private _currentLightDirection;
    private _positions;
    private _indices;
    private _needFullUpdateUBO;
    private _currentShadowDepthTexture;
    private _shadowGenerator?;
    /**
     * The shadow generator used to create the lighting volume.
     */
    get shadowGenerator(): ShadowGenerator;
    set shadowGenerator(sg: ShadowGenerator);
    private _tesselation;
    /**
     * The tesselation level of the lighting volume.
     */
    get tesselation(): number;
    set tesselation(n: number);
    /**
     * The mesh used as a support for the lighting volume.
     * Note that this mesh is not automatically added to the scene's mesh array.
     * If you want to render it, you need to add it manually.
     */
    get mesh(): Mesh;
    private _frequency;
    /**
     * The frequency (in number of times you call updateMesh) at which the lighting volume is updated.
     */
    get frequency(): number;
    set frequency(value: number);
    /**
     * The name of the lighting volume.
     */
    get name(): string;
    set name(name: string);
    /**
     * Indicates whether this is the first update of the lighting volume.
     * If true, the volume has not yet been updated for the first time.
     */
    get firstUpdate(): boolean;
    /** @internal */
    _setComputeShaderFastMode(enabled: boolean): void;
    /**
     * Creates a new LightingVolume.
     * @param name The name of the lighting volume.
     * @param scene The scene the lighting volume belongs to.
     * @param shadowGenerator The shadow generator used to create the lighting volume. This is optional in the constructor, but must be set before calling updateMesh.
     * @param tesselation The tesselation level of the lighting volume (default: 64).
     */
    constructor(name: string, scene: Scene, shadowGenerator?: ShadowGenerator, tesselation?: number);
    /**
     * Checks if the lighting volume is ready to be updated.
     * @returns True if the volume is ready to be updated.
     */
    isReady(): boolean;
    /**
     * Updates the lighting volume mesh.
     * @param forceUpdate If true, forces the update even if the frequency condition is not met.
     */
    update(forceUpdate?: boolean): void;
    /**
     * Disposes the lighting volume and associated resources.
     */
    dispose(): void;
    private _needUpdateGeometry;
    private _createComputeShader;
    private _setComputeShaderInputs;
    private _createFallbackTextures;
    private _fallbackReadPixelAsync;
    private _fullUpdateUBO;
    private _createGeometry;
    private _updateGeometry;
    private _createIndices;
}
