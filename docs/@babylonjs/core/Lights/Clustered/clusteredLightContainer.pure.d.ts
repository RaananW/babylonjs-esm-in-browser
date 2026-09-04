/** This file must only contain pure code and pure imports */
import { type Camera } from "../../Cameras/camera.pure.js";
import { type Effect } from "../../Materials/effect.pure.js";
import { RenderTargetTexture } from "../../Materials/Textures/renderTargetTexture.pure.js";
import { type Scene } from "../../scene.pure.js";
import { type Nullable } from "../../types.js";
import { Light } from "../light.js";
/**
 * A special light that renders all its associated spot or point lights using a clustered or forward+ system.
 */
export declare class ClusteredLightContainer extends Light {
    private static _GetEngineBatchSize;
    /**
     * Checks if the clustered lighting system supports the given light with its current parameters.
     * This will also check if the light's associated engine supports clustered lighting.
     *
     * @param light The light to test
     * @returns true if the light and its engine is supported
     */
    static IsLightSupported(light: Light): boolean;
    /** @internal */
    static _SceneComponentInitialization: (scene: Scene) => void;
    private readonly _batchSize;
    /**
     * True if clustered lighting is supported.
     */
    get isSupported(): boolean;
    private readonly _lights;
    /**
     * Gets the current list of lights added to this clustering system.
     */
    get lights(): readonly Light[];
    private _camera;
    private readonly _sortedLights;
    private _lightDataBuffer;
    private _lightDataTexture;
    private _lightDataRenderId;
    private _tileMaskBatches;
    private _tileMaskTexture;
    private _tileMaskBuffer;
    private _horizontalTiles;
    /**
     * The number of tiles in the horizontal direction to cluster lights into.
     * A lower value will reduce memory and make the clustering step faster, while a higher value increases memory and makes the rendering step faster.
     */
    get horizontalTiles(): number;
    set horizontalTiles(horizontal: number);
    private _verticalTiles;
    /**
     * The number of tiles in the vertical direction to cluster lights into.
     * A lower value will reduce memory and make the clustering step faster, while a higher value increases memory and makes the rendering step faster.
     */
    get verticalTiles(): number;
    set verticalTiles(vertical: number);
    private _sliceScale;
    private _sliceBias;
    private _sliceRanges;
    private _lastBoundLightIndex;
    private _depthSlices;
    /**
     * The number of slices to split the depth range by and cluster lights into.
     */
    get depthSlices(): number;
    set depthSlices(slices: number);
    private readonly _proxyMaterial;
    private readonly _proxyMesh;
    private _maxRange;
    private _minInverseSquaredRange;
    /**
     * This limits the range of all the added lights, so even lights with extreme ranges will still have bounds for clustering.
     */
    get maxRange(): number;
    set maxRange(range: number);
    /**
     * Creates a new clustered light system with an initial set of lights.
     *
     * @param name The name of the clustered light container
     * @param lights The initial set of lights to add
     * @param scene The scene the clustered light container belongs to
     */
    constructor(name: string, lights?: Light[], scene?: Scene);
    getClassName(): string;
    getTypeID(): number;
    /** @internal */
    _updateBatches(camera?: Nullable<Camera>): RenderTargetTexture;
    private _getSliceIndex;
    private _updateLightData;
    dispose(doNotRecurse?: boolean, disposeMaterialAndTextures?: boolean): void;
    /**
     * Adds a light to the clustering system.
     * @param light The light to add
     */
    addLight(light: Light): void;
    /**
     * Removes a light from the clustering system.
     * @param light The light to remove
     * @returns the index where the light was in the light list
     */
    removeLight(light: Light): number;
    protected _buildUniformLayout(): void;
    transferToEffect(effect: Effect, lightIndex: string): Light;
    transferTexturesToEffect(effect: Effect, lightIndex: string): Light;
    /**
     * Transfers the effect to the node material effect
     * @param _effect the effect to transfer to
     * @returns the light
     */
    transferToNodeMaterialEffect(_effect: Effect): Light;
    prepareLightSpecificDefines(defines: any, lightIndex: number): void;
    /**
     * Returns whether this light is ready to be used
     * @returns true if the light is ready
     */
    _isReady(): boolean;
    /**
     * Serializes the ClusteredLightContainer to a JSON object, including all child lights.
     * @returns the serialized object
     */
    serialize(): any;
    protected _onParsed(parsedLight: any, scene: Scene, rootUrl?: string): void;
}
/**
 * Register side effects for clusteredLightContainer.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterClusteredLightContainer(): void;
