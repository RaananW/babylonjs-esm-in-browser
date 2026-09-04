import { FrameGraphTask } from "../../frameGraphTask.js";
import { ComputeShader } from "../../../Compute/computeShader.pure.js";
import { Vector3 } from "../../../Maths/math.vector.pure.js";
import { UniformBuffer } from "../../../Materials/uniformBuffer.js";
import { Logger } from "../../../Misc/logger.js";
/**
 * Task used to execute a compute shader (WebGPU only)
 */
export class FrameGraphComputeShaderTask extends FrameGraphTask {
    /**
     * Gets the compute shader used by the task
     */
    get computeShader() {
        return this._cs;
    }
    /**
     * Gets a uniform buffer created by a call to createUniformBuffer()
     * @param name Name of the uniform buffer
     * @returns The uniform buffer
     */
    getUniformBuffer(name) {
        return this._ubo[name]?.ubo;
    }
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
    constructor(name, frameGraph, shaderPath, options = {}) {
        super(name, frameGraph);
        /**
         * Defines the dispatch size for the compute shader
         */
        this.dispatchSize = new Vector3(1, 1, 1);
        if (!frameGraph.engine.getCaps().supportComputeShaders) {
            this._notSupported = true;
            Logger.Error("This engine does not support compute shaders!");
            return;
        }
        this._notSupported = false;
        this._cs = new ComputeShader(name + "_cs", frameGraph.engine, shaderPath, options);
        this._ubo = {};
    }
    isReady() {
        return this._notSupported ? true : this._cs.isReady();
    }
    /**
     * Creates a uniform buffer and binds it to the shader
     * @param name Name of the uniform buffer
     * @param description Description of the uniform buffer: names and sizes (in floats) of the uniforms
     * @param autoUpdate If the UBO must be updated automatically before each dispatch (default: true)
     * @returns The created uniform buffer
     */
    createUniformBuffer(name, description, autoUpdate = true) {
        const uBuffer = new UniformBuffer(this._frameGraph.engine);
        this._ubo[name] = { ubo: uBuffer, autoUpdate };
        for (const key in description) {
            uBuffer.addUniform(key, description[key]);
        }
        this._cs.setUniformBuffer(name, uBuffer);
        return uBuffer;
    }
    /**
     * Binds a texture to the shader
     * @param name Binding name of the texture
     * @param texture Texture to bind
     * @param bindSampler Bind the sampler corresponding to the texture (default: true). The sampler will be bound just before the binding index of the texture
     */
    setTexture(name, texture, bindSampler = true) {
        this._cs.setTexture(name, texture, bindSampler);
    }
    /**
     * Binds an internal texture to the shader
     * @param name Binding name of the texture
     * @param texture Texture to bind
     */
    setInternalTexture(name, texture) {
        this._cs.setInternalTexture(name, texture);
    }
    /**
     * Binds a storage texture to the shader
     * @param name Binding name of the texture
     * @param texture Texture to bind
     */
    setStorageTexture(name, texture) {
        this._cs.setStorageTexture(name, texture);
    }
    /**
     * Binds an external texture to the shader
     * @param name Binding name of the texture
     * @param texture Texture to bind
     */
    setExternalTexture(name, texture) {
        this._cs.setExternalTexture(name, texture);
    }
    /**
     * Binds a video texture to the shader (by binding the external texture attached to this video)
     * @param name Binding name of the texture
     * @param texture Texture to bind
     * @returns true if the video texture was successfully bound, else false. false will be returned if the current engine does not support external textures
     */
    setVideoTexture(name, texture) {
        return this._cs.setVideoTexture(name, texture);
    }
    /**
     * Binds a uniform buffer to the shader
     * @param name Binding name of the buffer
     * @param buffer Buffer to bind
     */
    setUniformBuffer(name, buffer) {
        this._cs.setUniformBuffer(name, buffer);
    }
    /**
     * Binds a storage buffer to the shader
     * @param name Binding name of the buffer
     * @param buffer Buffer to bind
     */
    setStorageBuffer(name, buffer) {
        this._cs.setStorageBuffer(name, buffer);
    }
    /**
     * Binds a texture sampler to the shader
     * @param name Binding name of the sampler
     * @param sampler Sampler to bind
     */
    setTextureSampler(name, sampler) {
        this._cs.setTextureSampler(name, sampler);
    }
    getClassName() {
        return "FrameGraphComputeShaderTask";
    }
    record(skipCreationOfDisabledPasses) {
        const pass = this._frameGraph.addPass(this.name);
        if (this._notSupported) {
            pass.setExecuteFunc(() => { });
        }
        else {
            pass.setExecuteFunc((context) => {
                this.execute?.(context);
                for (const key in this._ubo) {
                    const uboEntry = this._ubo[key];
                    if (uboEntry.autoUpdate) {
                        uboEntry.ubo.update();
                    }
                }
                if (this.indirectDispatch) {
                    context.pushDebugGroup(`Indirect dispatch compute shader (${this.name})`);
                    this._cs.dispatchIndirect(this.indirectDispatch.buffer, this.indirectDispatch.offset);
                    context.popDebugGroup();
                }
                else {
                    context.pushDebugGroup(`Dispatch compute shader (${this.name})`);
                    this._cs.dispatch(this.dispatchSize.x, this.dispatchSize.y, this.dispatchSize.z);
                    context.popDebugGroup();
                }
            });
        }
        if (!skipCreationOfDisabledPasses) {
            const passDisabled = this._frameGraph.addPass(this.name + "_disabled", true);
            passDisabled.setExecuteFunc(() => { });
        }
        return pass;
    }
    dispose() {
        for (const key in this._ubo) {
            this._ubo[key].ubo.dispose();
        }
        super.dispose();
    }
}
//# sourceMappingURL=computeShaderTask.js.map