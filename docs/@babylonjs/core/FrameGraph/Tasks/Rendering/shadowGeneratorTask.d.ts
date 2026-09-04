import { type FrameGraph, type FrameGraphObjectList, type IShadowLight, type FrameGraphTextureHandle, type Camera } from "../../../index.js";
import { FrameGraphTask } from "../../frameGraphTask.js";
import { ShadowGenerator } from "../../../Lights/Shadows/shadowGenerator.js";
/**
 * Task used to generate shadows from a list of objects.
 */
export declare class FrameGraphShadowGeneratorTask extends FrameGraphTask {
    /**
     * The object list that generates shadows.
     */
    objectList: FrameGraphObjectList;
    private _light;
    /**
     * The light to generate shadows from.
     */
    get light(): IShadowLight;
    set light(value: IShadowLight);
    private _camera;
    /**
     * Gets or sets the camera used to generate the shadow generator.
     */
    get camera(): Camera;
    set camera(camera: Camera);
    private _mapSize;
    /**
     * The size of the shadow map.
     */
    get mapSize(): number;
    set mapSize(value: number);
    private _useFloat32TextureType;
    /**
     * If true, the shadow map will use a 32 bits float texture type (else, 16 bits float is used if supported).
     */
    get useFloat32TextureType(): boolean;
    set useFloat32TextureType(value: boolean);
    private _useRedTextureFormat;
    /**
     * If true, the shadow map will use a red texture format (else, a RGBA format is used).
     */
    get useRedTextureFormat(): boolean;
    set useRedTextureFormat(value: boolean);
    private _bias;
    /**
     * The bias to apply to the shadow map.
     */
    get bias(): number;
    set bias(value: number);
    private _normalBias;
    /**
     * The normal bias to apply to the shadow map.
     */
    get normalBias(): number;
    set normalBias(value: number);
    private _darkness;
    /**
     * The darkness of the shadows.
     */
    get darkness(): number;
    set darkness(value: number);
    private _transparencyShadow;
    /**
     * Gets or sets the ability to have transparent shadow
     */
    get transparencyShadow(): boolean;
    set transparencyShadow(value: boolean);
    private _enableSoftTransparentShadow;
    /**
     * Enables or disables shadows with varying strength based on the transparency
     */
    get enableSoftTransparentShadow(): boolean;
    set enableSoftTransparentShadow(value: boolean);
    private _useOpacityTextureForTransparentShadow;
    /**
     * If this is true, use the opacity texture's alpha channel for transparent shadows instead of the diffuse one
     */
    get useOpacityTextureForTransparentShadow(): boolean;
    set useOpacityTextureForTransparentShadow(value: boolean);
    private _filter;
    /**
     * The filter to apply to the shadow map.
     */
    get filter(): number;
    set filter(value: number);
    private _filteringQuality;
    /**
     * The filtering quality to apply to the filter.
     */
    get filteringQuality(): number;
    set filteringQuality(value: number);
    /**
     * The shadow generator.
     */
    readonly shadowGenerator: ShadowGenerator;
    /**
     * The shadow map texture.
     */
    readonly outputTexture: FrameGraphTextureHandle;
    protected _shadowGenerator: ShadowGenerator | undefined;
    protected _updateShadowMap(): void;
    protected _createShadowGeneratorInstance(): void;
    protected _createShadowGenerator(): boolean | undefined;
    isReady(): boolean;
    /**
     * Creates a new shadow generator task.
     * @param name The name of the task.
     * @param frameGraph The frame graph the task belongs to.
     */
    constructor(name: string, frameGraph: FrameGraph);
    getClassName(): string;
    record(): void;
    dispose(): void;
}
