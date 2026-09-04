import { Vector3, Matrix } from "../../../Maths/math.vector.pure.js";

import { ThinPassPostProcess } from "../../../PostProcesses/thinPassPostProcess.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
/**
 * @internal
 */
class VolumetricLightingBlendVolumeThinPostProcess extends ThinPassPostProcess {
    _gatherImports(useWebGPU, list) {
        if (useWebGPU) {
            this._webGPUReady = true;
            list.push(Promise.all([import("../../../ShadersWGSL/pass.fragment.js"), import("../../../ShadersWGSL/volumetricLightingBlendVolume.fragment.js")]));
        }
        else {
            list.push(Promise.all([import("../../../Shaders/pass.fragment.js"), import("../../../Shaders/volumetricLightingBlendVolume.fragment.js")]));
        }
        super._gatherImports(useWebGPU, list);
    }
    constructor(name, engine = null, enableExtinction = false, options) {
        super(name, engine, {
            ...options,
            fragmentShader: "volumetricLightingBlendVolume",
            samplers: ["depthSampler"],
            uniforms: ["invProjection", "outputTextureSize", "extinction"],
            defines: enableExtinction ? ["#define DUAL_SOURCE_BLENDING", "#define USE_EXTINCTION"] : undefined,
        });
        this.outputTextureWidth = 0;
        this.outputTextureHeight = 0;
        this.extinction = new Vector3(0, 0, 0);
        this.enableExtinction = false;
        this._invProjection = new Matrix();
        this.alphaMode = enableExtinction ? 20 : 1;
    }
    bind(noDefaultBindings = false) {
        super.bind(noDefaultBindings);
        const effect = this.drawWrapper.effect;
        this._invProjection.copyFrom(this.camera.getProjectionMatrix());
        this._invProjection.invert();
        effect.setMatrix("invProjection", this._invProjection);
        effect.setFloat2("outputTextureSize", this.outputTextureWidth, this.outputTextureHeight);
        effect.setVector3("extinction", this.extinction);
    }
}
/**
 * @internal
 */
export class FrameGraphVolumetricLightingBlendVolumeTask extends FrameGraphPostProcessTask {
    constructor(name, frameGraph, enableExtinction = false) {
        super(name, frameGraph, new VolumetricLightingBlendVolumeThinPostProcess(name, frameGraph.engine, enableExtinction));
    }
    getClassName() {
        return "FrameGraphVolumetricLightingBlendVolumeTask";
    }
    record(skipCreationOfDisabledPasses = false) {
        if (this.sourceTexture === undefined || this.depthTexture === undefined || this.camera === undefined) {
            throw new Error(`FrameGraphVolumetricLightingBlendVolumeTask "${this.name}": sourceTexture, depthTexture and camera are required`);
        }
        const pass = super.record(skipCreationOfDisabledPasses, undefined, (context) => {
            this.postProcess.camera = this.camera;
            context.bindTextureHandle(this._postProcessDrawWrapper.effect, "depthSampler", this.depthTexture);
        });
        pass.addDependencies(this.depthTexture);
        this.postProcess.outputTextureWidth = this._outputWidth;
        this.postProcess.outputTextureHeight = this._outputHeight;
        return pass;
    }
}
//# sourceMappingURL=volumetricLightingBlendVolumeTask.js.map