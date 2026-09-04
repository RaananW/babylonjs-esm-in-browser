import { StencilStateComposer } from "../../States/stencilStateComposer.js";
/**
 * @internal
 **/
export class WebGPUStencilStateComposer extends StencilStateComposer {
    constructor(cache) {
        super(false);
        this._cache = cache;
        this.reset();
    }
    get func() {
        return this._func;
    }
    set func(value) {
        if (this._func === value) {
            return;
        }
        this._func = value;
        this._cache.setStencilCompare(value);
    }
    get backFunc() {
        return this._backFunc;
    }
    set backFunc(value) {
        if (this._backFunc === value) {
            return;
        }
        this._backFunc = value;
        this._cache.setStencilBackCompare(value);
    }
    get funcMask() {
        return this._funcMask;
    }
    set funcMask(value) {
        if (this._funcMask === value) {
            return;
        }
        this._funcMask = value;
        this._cache.setStencilReadMask(value);
    }
    get opStencilFail() {
        return this._opStencilFail;
    }
    set opStencilFail(value) {
        if (this._opStencilFail === value) {
            return;
        }
        this._opStencilFail = value;
        this._cache.setStencilFailOp(value);
    }
    get opDepthFail() {
        return this._opDepthFail;
    }
    set opDepthFail(value) {
        if (this._opDepthFail === value) {
            return;
        }
        this._opDepthFail = value;
        this._cache.setStencilDepthFailOp(value);
    }
    get opStencilDepthPass() {
        return this._opStencilDepthPass;
    }
    set opStencilDepthPass(value) {
        if (this._opStencilDepthPass === value) {
            return;
        }
        this._opStencilDepthPass = value;
        this._cache.setStencilPassOp(value);
    }
    get backOpStencilFail() {
        return this._backOpStencilFail;
    }
    set backOpStencilFail(value) {
        if (this._backOpStencilFail === value) {
            return;
        }
        this._backOpStencilFail = value;
        this._cache.setStencilBackFailOp(value);
    }
    get backOpDepthFail() {
        return this._backOpDepthFail;
    }
    set backOpDepthFail(value) {
        if (this._backOpDepthFail === value) {
            return;
        }
        this._backOpDepthFail = value;
        this._cache.setStencilBackDepthFailOp(value);
    }
    get backOpStencilDepthPass() {
        return this._backOpStencilDepthPass;
    }
    set backOpStencilDepthPass(value) {
        if (this._backOpStencilDepthPass === value) {
            return;
        }
        this._backOpStencilDepthPass = value;
        this._cache.setStencilBackPassOp(value);
    }
    get mask() {
        return this._mask;
    }
    set mask(value) {
        if (this._mask === value) {
            return;
        }
        this._mask = value;
        this._cache.setStencilWriteMask(value);
    }
    get enabled() {
        return this._enabled;
    }
    set enabled(value) {
        if (this._enabled === value) {
            return;
        }
        this._enabled = value;
        this._cache.setStencilEnabled(value);
    }
    reset() {
        super.reset();
        this._cache.resetStencilState();
    }
    apply() {
        const stencilMaterialEnabled = !this.useStencilGlobalOnly && !!this.stencilMaterial?.enabled;
        this.enabled = stencilMaterialEnabled ? this.stencilMaterial.enabled : this.stencilGlobal.enabled;
        if (!this.enabled) {
            return;
        }
        this.mask = stencilMaterialEnabled ? this.stencilMaterial.mask : this.stencilGlobal.mask;
        this.funcRef = stencilMaterialEnabled ? this.stencilMaterial.funcRef : this.stencilGlobal.funcRef;
        this.funcMask = stencilMaterialEnabled ? this.stencilMaterial.funcMask : this.stencilGlobal.funcMask;
        this.func = stencilMaterialEnabled ? this.stencilMaterial.func : this.stencilGlobal.func;
        this.opStencilFail = stencilMaterialEnabled ? this.stencilMaterial.opStencilFail : this.stencilGlobal.opStencilFail;
        this.opDepthFail = stencilMaterialEnabled ? this.stencilMaterial.opDepthFail : this.stencilGlobal.opDepthFail;
        this.opStencilDepthPass = stencilMaterialEnabled ? this.stencilMaterial.opStencilDepthPass : this.stencilGlobal.opStencilDepthPass;
        this.backFunc = stencilMaterialEnabled ? this.stencilMaterial.backFunc : this.stencilGlobal.backFunc;
        this.backOpStencilFail = stencilMaterialEnabled ? this.stencilMaterial.backOpStencilFail : this.stencilGlobal.backOpStencilFail;
        this.backOpDepthFail = stencilMaterialEnabled ? this.stencilMaterial.backOpDepthFail : this.stencilGlobal.backOpDepthFail;
        this.backOpStencilDepthPass = stencilMaterialEnabled ? this.stencilMaterial.backOpStencilDepthPass : this.stencilGlobal.backOpStencilDepthPass;
    }
}
//# sourceMappingURL=webgpuStencilStateComposer.js.map