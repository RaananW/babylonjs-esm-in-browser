import { PostProcess } from "./postProcess.js";

import "../Shaders/depthOfFieldMerge.fragment.js";
/**
 * Options to be set when merging outputs from the default pipeline.
 */
export class DepthOfFieldMergePostProcessOptions {
}
/**
 * The DepthOfFieldMergePostProcess merges blurred images with the original based on the values of the circle of confusion.
 */
export class DepthOfFieldMergePostProcess extends PostProcess {
    /**
     * Creates a new instance of DepthOfFieldMergePostProcess
     * @param name The name of the effect.
     * @param originalFromInput Post process which's input will be used for the merge.
     * @param circleOfConfusion Circle of confusion post process which's output will be used to blur each pixel.
     * @param _blurSteps Blur post processes from low to high which will be mixed with the original image.
     * @param options The required width/height ratio to downsize to before computing the render pass.
     * @param camera The camera to apply the render pass to.
     * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
     * @param engine The engine which the post process will be applied. (default: current engine)
     * @param reusable If the post process can be reused on the same frame. (default: false)
     * @param textureType Type of textures used when performing the post process. (default: 0)
     * @param blockCompilation If compilation of the shader should not be done in the constructor. The updateEffect method can be used to compile the shader at a later time. (default: false)
     */
    constructor(name, originalFromInput, circleOfConfusion, _blurSteps, options, camera, samplingMode, engine, reusable, textureType = 0, blockCompilation = false) {
        super(name, "depthOfFieldMerge", [], ["circleOfConfusionSampler", "blurStep0", "blurStep1", "blurStep2"], options, camera, samplingMode, engine, reusable, null, textureType, undefined, null, true);
        this._blurSteps = _blurSteps;
        this.externalTextureSamplerBinding = true;
        this.onApplyObservable.add((effect) => {
            effect.setTextureFromPostProcess("textureSampler", originalFromInput);
            effect.setTextureFromPostProcessOutput("circleOfConfusionSampler", circleOfConfusion);
            _blurSteps.forEach((step, index) => {
                effect.setTextureFromPostProcessOutput("blurStep" + (_blurSteps.length - index - 1), step);
            });
        });
        if (!blockCompilation) {
            this.updateEffect();
        }
    }
    /**
     * Gets a string identifying the name of the class
     * @returns "DepthOfFieldMergePostProcess" string
     */
    getClassName() {
        return "DepthOfFieldMergePostProcess";
    }
    /**
     * Updates the effect with the current post process compile time values and recompiles the shader.
     * @param defines Define statements that should be added at the beginning of the shader. (default: null)
     * @param uniforms Set of uniform variables that will be passed to the shader. (default: null)
     * @param samplers Set of Texture2D variables that will be passed to the shader. (default: null)
     * @param indexParameters The index parameters to be used for babylons include syntax "#include<kernelBlurVaryingDeclaration>[0..varyingCount]". (default: undefined) See usage in babylon.blurPostProcess.ts and kernelBlur.vertex.fx
     * @param onCompiled Called when the shader has been compiled.
     * @param onError Called if there is an error when compiling a shader.
     */
    updateEffect(defines = null, uniforms = null, samplers = null, indexParameters, onCompiled, onError) {
        if (!defines) {
            defines = "";
            defines += "#define BLUR_LEVEL " + (this._blurSteps.length - 1) + "\n";
        }
        super.updateEffect(defines, uniforms, samplers, indexParameters, onCompiled, onError);
    }
}
//# sourceMappingURL=depthOfFieldMergePostProcess.js.map