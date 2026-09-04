/** This file must only contain pure code and pure imports */
import { PostProcess } from "./postProcess.pure.js";
import { ThinAnaglyphPostProcess } from "./thinAnaglyphPostProcess.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * Postprocess used to generate anaglyphic rendering
 */
export class AnaglyphPostProcess extends PostProcess {
    /**
     * Gets a string identifying the name of the class
     * @returns "AnaglyphPostProcess" string
     */
    getClassName() {
        return "AnaglyphPostProcess";
    }
    /**
     * Creates a new AnaglyphPostProcess
     * @param name defines postprocess name
     * @param options defines creation options or target ratio scale
     * @param rigCameras defines cameras using this postprocess
     * @param samplingMode defines required sampling mode (BABYLON.Texture.NEAREST_SAMPLINGMODE by default)
     * @param engine defines hosting engine
     * @param reusable defines if the postprocess will be reused multiple times per frame
     */
    constructor(name, options, rigCameras, samplingMode, engine, reusable) {
        const localOptions = {
            samplers: ThinAnaglyphPostProcess.Samplers,
            size: typeof options === "number" ? options : undefined,
            camera: rigCameras[1],
            samplingMode,
            engine,
            reusable,
            ...options,
        };
        super(name, ThinAnaglyphPostProcess.FragmentUrl, {
            effectWrapper: typeof options === "number" || !options.effectWrapper ? new ThinAnaglyphPostProcess(name, engine, localOptions) : undefined,
            ...localOptions,
        });
        this._passedProcess = rigCameras[0]._rigPostProcess;
        this.onApplyObservable.add((effect) => {
            effect.setTextureFromPostProcess("leftSampler", this._passedProcess);
        });
    }
}
let _Registered = false;
/**
 * Register side effects for anaglyphPostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterAnaglyphPostProcess() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.AnaglyphPostProcess", AnaglyphPostProcess);
}
//# sourceMappingURL=anaglyphPostProcess.pure.js.map