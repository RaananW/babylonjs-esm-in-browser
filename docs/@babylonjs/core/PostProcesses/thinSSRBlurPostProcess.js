import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { EngineStore } from "../Engines/engineStore.js";
import { Vector2 } from "../Maths/math.vector.pure.js";
/**
 * @internal
 */
export class ThinSSRBlurPostProcess extends EffectWrapper {
    _gatherImports(useWebGPU, list) {
        if (useWebGPU) {
            this._webGPUReady = true;
            list.push(import("../ShadersWGSL/screenSpaceReflection2Blur.fragment.js"));
        }
        else {
            list.push(import("../Shaders/screenSpaceReflection2Blur.fragment.js"));
        }
    }
    constructor(name, engine = null, direction, blurStrength, options) {
        super({
            ...options,
            name,
            engine: engine || EngineStore.LastCreatedEngine,
            useShaderStore: true,
            useAsPostProcess: true,
            fragmentShader: ThinSSRBlurPostProcess.FragmentUrl,
            uniforms: ThinSSRBlurPostProcess.Uniforms,
            samplers: ThinSSRBlurPostProcess.Samplers,
        });
        this.textureWidth = 0;
        this.textureHeight = 0;
        this.direction = new Vector2(1, 0);
        this.blurStrength = 0.03;
        if (direction !== undefined) {
            this.direction = direction;
        }
        if (blurStrength !== undefined) {
            this.blurStrength = blurStrength;
        }
    }
    bind(noDefaultBindings = false) {
        super.bind(noDefaultBindings);
        this._drawWrapper.effect.setFloat2("texelOffsetScale", (1 / this.textureWidth) * this.direction.x * this.blurStrength, (1 / this.textureHeight) * this.direction.y * this.blurStrength);
    }
}
ThinSSRBlurPostProcess.FragmentUrl = "screenSpaceReflection2Blur";
ThinSSRBlurPostProcess.Uniforms = ["texelOffsetScale"];
ThinSSRBlurPostProcess.Samplers = ["textureSampler"];
//# sourceMappingURL=thinSSRBlurPostProcess.js.map