import { Observable } from "./observable.js";
import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { EngineStore } from "../Engines/engineStore.js";

/**
 * @internal
 */
export var DepthTextureType;
(function (DepthTextureType) {
    DepthTextureType[DepthTextureType["NormalizedViewDepth"] = 0] = "NormalizedViewDepth";
    DepthTextureType[DepthTextureType["ViewDepth"] = 1] = "ViewDepth";
    DepthTextureType[DepthTextureType["ScreenDepth"] = 2] = "ScreenDepth";
})(DepthTextureType || (DepthTextureType = {}));
/**
 * @internal
 */
export class ThinMinMaxReducerPostProcess extends EffectWrapper {
    _gatherImports(useWebGPU, list) {
        if (useWebGPU) {
            this._webGPUReady = true;
            list.push(import("../ShadersWGSL/minmaxRedux.fragment.js"));
        }
        else {
            list.push(import("../Shaders/minmaxRedux.fragment.js"));
        }
    }
    constructor(name, engine = null, defines = "", options) {
        super({
            ...options,
            name,
            engine: engine || EngineStore.LastCreatedEngine,
            useShaderStore: true,
            useAsPostProcess: true,
            fragmentShader: ThinMinMaxReducerPostProcess.FragmentUrl,
            uniforms: ThinMinMaxReducerPostProcess.Uniforms,
            defines,
        });
        this.textureWidth = 0;
        this.textureHeight = 0;
    }
    bind(noDefaultBindings = false) {
        super.bind(noDefaultBindings);
        const effect = this.drawWrapper.effect;
        if (this.textureWidth === 1 || this.textureHeight === 1) {
            effect.setInt2("texSize", this.textureWidth, this.textureHeight);
        }
        else {
            effect.setFloat2("texSize", this.textureWidth, this.textureHeight);
        }
    }
}
ThinMinMaxReducerPostProcess.FragmentUrl = "minmaxRedux";
ThinMinMaxReducerPostProcess.Uniforms = ["texSize"];
const BufferFloat = new Float32Array(4 * 1 * 1);
const BufferUint8 = new Uint8Array(4 * 1 * 1);
const MinMax = { min: 0, max: 0 };
/**
 * @internal
 */
export class ThinMinMaxReducer {
    get depthRedux() {
        return this._depthRedux;
    }
    set depthRedux(value) {
        if (this._depthRedux === value) {
            return;
        }
        this._depthRedux = value;
        this._recreatePostProcesses();
    }
    get textureWidth() {
        return this._textureWidth;
    }
    get textureHeight() {
        return this._textureHeight;
    }
    constructor(scene, depthRedux = true) {
        this.onAfterReductionPerformed = new Observable();
        this._textureWidth = 0;
        this._textureHeight = 0;
        this._scene = scene;
        this._depthRedux = depthRedux;
        this.reductionSteps = [];
    }
    setTextureDimensions(width, height, depthTextureType = 0 /* DepthTextureType.NormalizedViewDepth */) {
        if (width === this._textureWidth && height === this._textureHeight && depthTextureType === this._depthTextureType) {
            return false;
        }
        this._textureWidth = width;
        this._textureHeight = height;
        this._depthTextureType = depthTextureType;
        this._recreatePostProcesses();
        return true;
    }
    readMinMax(texture) {
        // Note that we should normally await the call to _readTexturePixels!
        // But because WebGL does the read synchronously, we know the values will be updated without waiting for the promise to be resolved, which will let us get the updated values
        // in the current frame, whereas in WebGPU, the read is asynchronous and we should normally wait for the promise to be resolved to get the updated values.
        // However, it's safe to avoid waiting for the promise to be resolved in WebGPU as well, because we will simply use the current values until "buffer" is updated later on.
        // Note that it means we can suffer some rendering artifacts in WebGPU because we may use previous min/max values for the current frame.
        const isFloat = texture.type === 1 || texture.type === 2;
        const buffer = isFloat ? BufferFloat : BufferUint8;
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._scene.getEngine()._readTexturePixels(texture, 1, 1, -1, 0, buffer, false);
        MinMax.min = buffer[0];
        MinMax.max = buffer[1];
        if (!isFloat) {
            MinMax.min = MinMax.min / 255.0;
            MinMax.max = MinMax.max / 255.0;
        }
        if (MinMax.min >= MinMax.max) {
            MinMax.min = 0;
            MinMax.max = 1;
        }
        this.onAfterReductionPerformed.notifyObservers(MinMax);
    }
    dispose(disposeAll = true) {
        if (disposeAll) {
            this.onAfterReductionPerformed.clear();
            this._textureWidth = 0;
            this._textureHeight = 0;
        }
        for (let i = 0; i < this.reductionSteps.length; ++i) {
            this.reductionSteps[i].dispose();
        }
        this.reductionSteps.length = 0;
    }
    _recreatePostProcesses() {
        this.dispose(false);
        const scene = this._scene;
        let w = this.textureWidth, h = this.textureHeight;
        const reductionInitial = new ThinMinMaxReducerPostProcess("Initial reduction phase", scene.getEngine(), "#define INITIAL" + (this._depthRedux ? "\n#define DEPTH_REDUX" : "") + (this._depthTextureType === 1 /* DepthTextureType.ViewDepth */ ? "\n#define VIEW_DEPTH" : ""));
        reductionInitial.textureWidth = w;
        reductionInitial.textureHeight = h;
        this.reductionSteps.push(reductionInitial);
        let index = 1;
        // create the additional steps
        while (w > 1 || h > 1) {
            w = Math.max(Math.round(w / 2), 1);
            h = Math.max(Math.round(h / 2), 1);
            const reduction = new ThinMinMaxReducerPostProcess("Reduction phase " + index, scene.getEngine(), "#define " + (w == 1 && h == 1 ? "LAST" : w == 1 || h == 1 ? "ONEBEFORELAST" : "MAIN"));
            reduction.textureWidth = w;
            reduction.textureHeight = h;
            this.reductionSteps.push(reduction);
            index++;
        }
    }
}
//# sourceMappingURL=thinMinMaxReducer.js.map