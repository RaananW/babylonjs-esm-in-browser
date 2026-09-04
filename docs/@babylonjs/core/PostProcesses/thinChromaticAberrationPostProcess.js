import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { EngineStore } from "../Engines/engineStore.js";
import { Vector2 } from "../Maths/math.vector.pure.js";
/**
 * The ChromaticAberrationPostProcess separates the rgb channels in an image to produce chromatic distortion around the edges of the screen
 */
export class ThinChromaticAberrationPostProcess extends EffectWrapper {
    _gatherImports(useWebGPU, list) {
        if (useWebGPU) {
            this._webGPUReady = true;
            list.push(import("../ShadersWGSL/chromaticAberration.fragment.js"));
        }
        else {
            list.push(import("../Shaders/chromaticAberration.fragment.js"));
        }
    }
    /**
     * Constructs a new chromatic aberration post process
     * @param name Name of the effect
     * @param engine Engine to use to render the effect. If not provided, the last created engine will be used
     * @param options Options to configure the effect
     */
    constructor(name, engine = null, options) {
        super({
            ...options,
            name,
            engine: engine || EngineStore.LastCreatedEngine,
            useShaderStore: true,
            useAsPostProcess: true,
            fragmentShader: ThinChromaticAberrationPostProcess.FragmentUrl,
            uniforms: ThinChromaticAberrationPostProcess.Uniforms,
        });
        /**
         * The amount of separation of rgb channels (default: 30)
         */
        this.aberrationAmount = 30;
        /**
         * The amount the effect will increase for pixels closer to the edge of the screen. (default: 0)
         */
        this.radialIntensity = 0;
        /**
         * The normalized direction in which the rgb channels should be separated. If set to 0,0 radial direction will be used. (default: Vector2(0.707,0.707))
         */
        this.direction = new Vector2(0.707, 0.707);
        /**
         * The center position where the radialIntensity should be around. [0.5,0.5 is center of screen, 1,1 is top right corner] (default: Vector2(0.5 ,0.5))
         */
        this.centerPosition = new Vector2(0.5, 0.5);
    }
    bind(noDefaultBindings = false) {
        super.bind(noDefaultBindings);
        const effect = this._drawWrapper.effect;
        effect.setFloat("chromatic_aberration", this.aberrationAmount);
        effect.setFloat("screen_width", this.screenWidth);
        effect.setFloat("screen_height", this.screenHeight);
        effect.setFloat("radialIntensity", this.radialIntensity);
        effect.setFloat2("direction", this.direction.x, this.direction.y);
        effect.setFloat2("centerPosition", this.centerPosition.x, this.centerPosition.y);
    }
}
/**
 * The fragment shader url
 */
ThinChromaticAberrationPostProcess.FragmentUrl = "chromaticAberration";
/**
 * The list of uniforms used by the effect
 */
ThinChromaticAberrationPostProcess.Uniforms = ["chromatic_aberration", "screen_width", "screen_height", "direction", "radialIntensity", "centerPosition"];
//# sourceMappingURL=thinChromaticAberrationPostProcess.js.map