import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { EngineStore } from "../Engines/engineStore.js";
import { Vector2 } from "../Maths/math.vector.pure.js";
/**
 * Postprocess used to apply FXAA (antialiasing) to the scene
 */
export class ThinFXAAPostProcess extends EffectWrapper {
    static _GetDefines(engine) {
        if (!engine) {
            return null;
        }
        const driverInfo = engine.extractDriverInfo();
        if (driverInfo.toLowerCase().indexOf("mali") > -1) {
            return "#define MALI 1\n";
        }
        return null;
    }
    _gatherImports(useWebGPU, list) {
        if (useWebGPU) {
            this._webGPUReady = true;
            list.push(Promise.all([import("../ShadersWGSL/fxaa.fragment.js"), import("../ShadersWGSL/fxaa.vertex.js")]));
        }
        else {
            list.push(Promise.all([import("../Shaders/fxaa.fragment.js"), import("../Shaders/fxaa.vertex.js")]));
        }
    }
    /**
     * Constructs a new FXAA post process
     * @param name Name of the effect
     * @param engine Engine to use to render the effect. If not provided, the last created engine will be used
     * @param options Options to configure the effect
     */
    constructor(name, engine = null, options) {
        const localOptions = {
            ...options,
            name,
            engine: engine || EngineStore.LastCreatedEngine,
            useShaderStore: true,
            useAsPostProcess: true,
            vertexShader: ThinFXAAPostProcess.VertexUrl,
            fragmentShader: ThinFXAAPostProcess.FragmentUrl,
            uniforms: ThinFXAAPostProcess.Uniforms,
        };
        super({
            ...localOptions,
            defines: ThinFXAAPostProcess._GetDefines(localOptions.engine),
        });
        /**
         * The texel size of the texture to apply FXAA on
         */
        this.texelSize = new Vector2(0, 0);
    }
    bind(noDefaultBindings = false) {
        super.bind(noDefaultBindings);
        this._drawWrapper.effect.setFloat2("texelSize", this.texelSize.x, this.texelSize.y);
    }
}
/**
 * The vertex shader url
 */
ThinFXAAPostProcess.VertexUrl = "fxaa";
/**
 * The fragment shader url
 */
ThinFXAAPostProcess.FragmentUrl = "fxaa";
/**
 * The list of uniforms used by the effect
 */
ThinFXAAPostProcess.Uniforms = ["texelSize"];
//# sourceMappingURL=thinFXAAPostProcess.js.map