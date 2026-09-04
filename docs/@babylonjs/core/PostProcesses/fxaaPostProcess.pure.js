/** This file must only contain pure code and pure imports */
import { Texture } from "../Materials/Textures/texture.pure.js";
import { PostProcess } from "./postProcess.pure.js";

import { SerializationHelper } from "../Misc/decorators.serialization.js";
import { ThinFXAAPostProcess } from "./thinFXAAPostProcess.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * Fxaa post process
 * @see https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/usePostProcesses#fxaa
 */
export class FxaaPostProcess extends PostProcess {
    /**
     * Gets a string identifying the name of the class
     * @returns "FxaaPostProcess" string
     */
    getClassName() {
        return "FxaaPostProcess";
    }
    constructor(name, options, camera = null, samplingMode, engine, reusable, textureType = 0) {
        const localOptions = {
            uniforms: ThinFXAAPostProcess.Uniforms,
            size: typeof options === "number" ? options : undefined,
            camera,
            samplingMode: samplingMode || Texture.BILINEAR_SAMPLINGMODE,
            engine,
            reusable,
            textureType,
            ...options,
        };
        super(name, ThinFXAAPostProcess.FragmentUrl, {
            effectWrapper: typeof options === "number" || !options.effectWrapper ? new ThinFXAAPostProcess(name, engine, localOptions) : undefined,
            ...localOptions,
        });
        this.onApplyObservable.add((_effect) => {
            this._effectWrapper.texelSize = this.texelSize;
        });
    }
    /**
     * @internal
     */
    static _Parse(parsedPostProcess, targetCamera, scene, rootUrl) {
        return SerializationHelper.Parse(() => {
            return new FxaaPostProcess(parsedPostProcess.name, parsedPostProcess.options, targetCamera, parsedPostProcess.renderTargetSamplingMode, scene.getEngine(), parsedPostProcess.reusable);
        }, parsedPostProcess, scene, rootUrl);
    }
}
let _Registered = false;
/**
 * Register side effects for fxaaPostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFxaaPostProcess() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.FxaaPostProcess", FxaaPostProcess);
}
//# sourceMappingURL=fxaaPostProcess.pure.js.map