import { type FrameGraph, type FrameGraphTextureHandle, type Camera } from "../../../index.js";
import { FrameGraphTask } from "../../frameGraphTask.js";
import { ThinSSAO2RenderingPipeline } from "../../../PostProcesses/RenderPipeline/Pipelines/thinSSAO2RenderingPipeline.js";
/**
 * Task which applies a SSAO2 post process.
 */
export declare class FrameGraphSSAO2RenderingPipelineTask extends FrameGraphTask {
    /**
     * The source texture to apply the SSAO2 effect on.
     */
    sourceTexture: FrameGraphTextureHandle;
    /**
     * The sampling mode to use for the source texture.
     */
    sourceSamplingMode: number;
    /**
     * The alpha mode to use when applying the SSAO2 effect.
     */
    get alphaMode(): number;
    set alphaMode(mode: number);
    /**
     * The depth texture used by the SSAO2 effect (Z coordinate in camera view space).
     */
    depthTexture: FrameGraphTextureHandle;
    /**
     * The normal texture used by the SSAO2 effect (normal vector in camera view space).
     */
    normalTexture: FrameGraphTextureHandle;
    private _camera;
    /**
     * The camera used to render the scene.
     */
    get camera(): Camera;
    set camera(camera: Camera);
    /**
     * The target texture to render the SSAO2 effect to.
     */
    targetTexture?: FrameGraphTextureHandle;
    /**
     * The output texture of the SSAO2 effect.
     */
    readonly outputTexture: FrameGraphTextureHandle;
    /**
     * The SSAO2 Rendering pipeline.
     */
    readonly ssao: ThinSSAO2RenderingPipeline;
    /**
     * The name of the task.
     */
    get name(): string;
    set name(name: string);
    /**
     * The ratio between the SSAO texture size and the source texture size
     */
    readonly ratioSSAO: number;
    /**
     * The ratio between the SSAO blur texture size and the source texture size
     */
    readonly ratioBlur: number;
    /**
     * The texture type used by the different post processes created by SSAO2.
     * It's a read-only property. If you want to change it, you must recreate the task and pass the appropriate texture type to the constructor.
     */
    readonly textureType: number;
    private readonly _ssao;
    private readonly _ssaoBlurX;
    private readonly _ssaoBlurY;
    private readonly _ssaoCombine;
    /**
     * Constructs a SSAO2 rendering pipeline task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task belongs to.
     * @param ratioSSAO The ratio between the SSAO texture size and the source texture size
     * @param ratioBlur The ratio between the SSAO blur texture size and the source texture size
     * @param textureType The texture type used by the different post processes created by SSAO2 (default: Constants.TEXTURETYPE_UNSIGNED_BYTE)
     */
    constructor(name: string, frameGraph: FrameGraph, ratioSSAO: number, ratioBlur: number, textureType?: number);
    isReady(): boolean;
    getClassName(): string;
    record(): void;
    dispose(): void;
}
