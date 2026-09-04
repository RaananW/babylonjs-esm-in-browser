import { type BaseTexture, type DataBuffer, type ExternalTexture, type FrameGraph, type FrameGraphContext, type FrameGraphPass, type IComputeShaderOptions, type IComputeShaderPath, type InternalTexture, type StorageBuffer, type TextureSampler, type VideoTexture } from "../../../index.js";
import { FrameGraphTask } from "../../frameGraphTask.js";
import { ComputeShader } from "../../../Compute/computeShader.pure.js";
import { Vector3 } from "../../../Maths/math.vector.pure.js";
import { UniformBuffer } from "../../../Materials/uniformBuffer.js";
/**
 * Task used to execute a compute shader (WebGPU only)
 */
export declare class FrameGraphComputeShaderTask extends FrameGraphTask {
    private readonly _notSupported;
    private readonly _cs;
    private readonly _ubo;
    /**
     * Defines the dispatch size for the compute shader
     */
    dispatchSize: Vector3;
    /**
     * Defines an indirect dispatch buffer and offset.
     * If set, this will be used instead of the dispatchSize property and an indirect dispatch will be performed.
     * "offset" is the offset in the buffer where the workgroup counts are stored (default: 0)
     */
    indirectDispatch?: {
        buffer: StorageBuffer | DataBuffer;
        offset?: number;
    };
    /**
     * An optional execute function that will be called at the beginning of the task execution
     */
    execute?: (context: FrameGraphContext) => void;
    /**
     * Gets the compute shader used by the task
     */
    get computeShader(): ComputeShader;
    /**
     * Gets a uniform buffer created by a call to createUniformBuffer()
     * @param name Name of the uniform buffer
     * @returns The uniform buffer
     */
    getUniformBuffer(name: string): UniformBuffer;
    /**
     * Creates a new compute shader task.
     * @param name The name of the task.
     * @param frameGraph The frame graph the task belongs to.
     * @param shaderPath Defines the route to the shader code in one of three ways:
     *  * object: \{ compute: "custom" \}, used with ShaderStore.ShadersStoreWGSL["customComputeShader"]
     *  * object: \{ computeElement: "HTMLElementId" \}, used with shader code in script tags
     *  * object: \{ computeSource: "compute shader code string" \}, where the string contains the shader code
     *  * string: try first to find the code in ShaderStore.ShadersStoreWGSL[shaderPath + "ComputeShader"]. If not, assumes it is a file with name shaderPath.compute.fx in index.html folder.
     * @param options Define the options used to create the shader
     */
    constructor(name: string, frameGraph: FrameGraph, shaderPath: IComputeShaderPath | string, options?: Partial<IComputeShaderOptions>);
    isReady(): boolean;
    /**
     * Creates a uniform buffer and binds it to the shader
     * @param name Name of the uniform buffer
     * @param description Description of the uniform buffer: names and sizes (in floats) of the uniforms
     * @param autoUpdate If the UBO must be updated automatically before each dispatch (default: true)
     * @returns The created uniform buffer
     */
    createUniformBuffer(name: string, description: {
        [name: string]: number;
    }, autoUpdate?: boolean): UniformBuffer;
    /**
     * Binds a texture to the shader
     * @param name Binding name of the texture
     * @param texture Texture to bind
     * @param bindSampler Bind the sampler corresponding to the texture (default: true). The sampler will be bound just before the binding index of the texture
     */
    setTexture(name: string, texture: BaseTexture, bindSampler?: boolean): void;
    /**
     * Binds an internal texture to the shader
     * @param name Binding name of the texture
     * @param texture Texture to bind
     */
    setInternalTexture(name: string, texture: InternalTexture): void;
    /**
     * Binds a storage texture to the shader
     * @param name Binding name of the texture
     * @param texture Texture to bind
     */
    setStorageTexture(name: string, texture: BaseTexture): void;
    /**
     * Binds an external texture to the shader
     * @param name Binding name of the texture
     * @param texture Texture to bind
     */
    setExternalTexture(name: string, texture: ExternalTexture): void;
    /**
     * Binds a video texture to the shader (by binding the external texture attached to this video)
     * @param name Binding name of the texture
     * @param texture Texture to bind
     * @returns true if the video texture was successfully bound, else false. false will be returned if the current engine does not support external textures
     */
    setVideoTexture(name: string, texture: VideoTexture): boolean;
    /**
     * Binds a uniform buffer to the shader
     * @param name Binding name of the buffer
     * @param buffer Buffer to bind
     */
    setUniformBuffer(name: string, buffer: UniformBuffer | DataBuffer): void;
    /**
     * Binds a storage buffer to the shader
     * @param name Binding name of the buffer
     * @param buffer Buffer to bind
     */
    setStorageBuffer(name: string, buffer: StorageBuffer | DataBuffer): void;
    /**
     * Binds a texture sampler to the shader
     * @param name Binding name of the sampler
     * @param sampler Sampler to bind
     */
    setTextureSampler(name: string, sampler: TextureSampler): void;
    getClassName(): string;
    record(skipCreationOfDisabledPasses?: boolean): FrameGraphPass<FrameGraphContext>;
    dispose(): void;
}
