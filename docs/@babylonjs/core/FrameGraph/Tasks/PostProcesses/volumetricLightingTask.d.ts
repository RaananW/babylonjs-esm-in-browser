import { type AbstractEngine, type Camera, type DirectionalLight, type FrameGraph, type FrameGraphObjectList, type FrameGraphTextureHandle } from "../../../index.js";
import { Vector3 } from "../../../Maths/math.vector.pure.js";
import { Color3 } from "../../../Maths/math.color.pure.js";
import { FrameGraphTask } from "../../frameGraphTask.js";
/**
 * A frame graph task that performs volumetric lighting.
 */
export declare class FrameGraphVolumetricLightingTask extends FrameGraphTask {
    /**
     * Returns whether volumetric lighting is supported by the engine.
     * @param engine The engine to check for volumetric lighting support.
     * @param enableExtinction Whether the extinction/dual-source blending path will be used.
     * @returns True if volumetric lighting is supported, false otherwise.
     */
    static IsSupported(engine: AbstractEngine, enableExtinction?: boolean): boolean;
    /**
     * The target texture to which the volumetric lighting will be applied.
     */
    targetTexture: FrameGraphTextureHandle;
    /**
     * The sampling mode to use when blending the volumetric lighting texture with targetTexture.
     */
    sourceSamplingMode: number;
    /**
     * The depth texture used for volumetric lighting calculations.
     * It must be the depth texture used to generate targetTexture.
     */
    depthTexture: FrameGraphTextureHandle;
    private _camera;
    /**
     * The camera used for volumetric lighting calculations.
     */
    get camera(): Camera;
    set camera(value: Camera);
    /**
     * The mesh representing the lighting volume.
     * This is the mesh that will be rendered to create the volumetric lighting effect.
     */
    lightingVolumeMesh: FrameGraphObjectList;
    /**
     * The directional light used for volumetric lighting.
     */
    light: DirectionalLight;
    /**
     * The lighting volume texture (optional).
     * If not provided, a new texture will be created, with the same size, format and type as targetTexture.
     * This is the texture that will store the volumetric lighting information, before being blended to targetTexture.
     */
    lightingVolumeTexture?: FrameGraphTextureHandle;
    private _extinctionPhaseG;
    /**
     * The phase G parameter for the volumetric lighting effect (default: 0).
     * This parameter controls the anisotropy of the scattering.
     * A value of 0 means isotropic scattering, while a value of 1 means forward scattering and -1 means backward scattering.
     */
    get phaseG(): number;
    set phaseG(value: number);
    /**
     * Whether to enable extinction in the volumetric lighting effect (default: false).
     * Read-only property set in the constructor.
     */
    readonly enableExtinction: boolean;
    /**
     * The extinction coefficient for the volumetric lighting effect (default: (0, 0, 0) - no extinction).
     * This parameter controls how much light is absorbed and scattered as it travels through the medium.
     * Will only have an effect if enableExtinction is set to true in the constructor!
     */
    get extinction(): Vector3;
    set extinction(value: Vector3);
    private _lightPower;
    /**
     * The light power/color for the volumetric lighting effect (default: (1, 1, 1)).
     * This parameter controls the intensity and color of the light used for volumetric lighting.
     */
    get lightPower(): Color3;
    set lightPower(value: Color3);
    get name(): string;
    set name(name: string);
    /**
     * The output texture of the task. It will be the same as targetTexture.
     */
    readonly outputTexture: FrameGraphTextureHandle;
    private readonly _clearLightingVolumeTextureTask;
    private readonly _renderLightingVolumeTask;
    private readonly _blendLightingVolumeTask;
    private _renderLightingVolumeMaterial;
    /**
     * Creates a new FrameGraphVolumetricLightingTask.
     * @param name The name of the task.
     * @param frameGraph The frame graph to which the task belongs.
     * @param enableExtinction Whether to enable extinction in the volumetric lighting effect (default: false). If you don't plan to set extinction to something different than (0, 0, 0), you can disable this to save some performance.
     */
    constructor(name: string, frameGraph: FrameGraph, enableExtinction?: boolean);
    initAsync(): Promise<unknown>;
    isReady(): boolean;
    getClassName(): string;
    record(skipCreationOfDisabledPasses?: boolean): void;
    dispose(): void;
}
