/**
 * @internal
 **/
export class StencilStateComposer {
    get isDirty() {
        return this._isStencilTestDirty || this._isStencilMaskDirty || this._isStencilFuncDirty || this._isStencilOpDirty;
    }
    get func() {
        return this._func;
    }
    set func(value) {
        if (this._func === value) {
            return;
        }
        this._func = value;
        this._isStencilFuncDirty = true;
    }
    get backFunc() {
        return this._func;
    }
    set backFunc(value) {
        if (this._backFunc === value) {
            return;
        }
        this._backFunc = value;
        this._isStencilFuncDirty = true;
    }
    get funcRef() {
        return this._funcRef;
    }
    set funcRef(value) {
        if (this._funcRef === value) {
            return;
        }
        this._funcRef = value;
        this._isStencilFuncDirty = true;
    }
    get funcMask() {
        return this._funcMask;
    }
    set funcMask(value) {
        if (this._funcMask === value) {
            return;
        }
        this._funcMask = value;
        this._isStencilFuncDirty = true;
    }
    get opStencilFail() {
        return this._opStencilFail;
    }
    set opStencilFail(value) {
        if (this._opStencilFail === value) {
            return;
        }
        this._opStencilFail = value;
        this._isStencilOpDirty = true;
    }
    get opDepthFail() {
        return this._opDepthFail;
    }
    set opDepthFail(value) {
        if (this._opDepthFail === value) {
            return;
        }
        this._opDepthFail = value;
        this._isStencilOpDirty = true;
    }
    get opStencilDepthPass() {
        return this._opStencilDepthPass;
    }
    set opStencilDepthPass(value) {
        if (this._opStencilDepthPass === value) {
            return;
        }
        this._opStencilDepthPass = value;
        this._isStencilOpDirty = true;
    }
    get backOpStencilFail() {
        return this._backOpStencilFail;
    }
    set backOpStencilFail(value) {
        if (this._backOpStencilFail === value) {
            return;
        }
        this._backOpStencilFail = value;
        this._isStencilOpDirty = true;
    }
    get backOpDepthFail() {
        return this._backOpDepthFail;
    }
    set backOpDepthFail(value) {
        if (this._backOpDepthFail === value) {
            return;
        }
        this._backOpDepthFail = value;
        this._isStencilOpDirty = true;
    }
    get backOpStencilDepthPass() {
        return this._backOpStencilDepthPass;
    }
    set backOpStencilDepthPass(value) {
        if (this._backOpStencilDepthPass === value) {
            return;
        }
        this._backOpStencilDepthPass = value;
        this._isStencilOpDirty = true;
    }
    get mask() {
        return this._mask;
    }
    set mask(value) {
        if (this._mask === value) {
            return;
        }
        this._mask = value;
        this._isStencilMaskDirty = true;
    }
    get enabled() {
        return this._enabled;
    }
    set enabled(value) {
        if (this._enabled === value) {
            return;
        }
        this._enabled = value;
        this._isStencilTestDirty = true;
    }
    constructor(reset = true) {
        this._isStencilTestDirty = false;
        this._isStencilMaskDirty = false;
        this._isStencilFuncDirty = false;
        this._isStencilOpDirty = false;
        this.useStencilGlobalOnly = false;
        if (reset) {
            this.reset();
        }
    }
    reset() {
        this.stencilMaterial = undefined;
        this.stencilGlobal?.reset();
        this._isStencilTestDirty = true;
        this._isStencilMaskDirty = true;
        this._isStencilFuncDirty = true;
        this._isStencilOpDirty = true;
    }
    apply(gl) {
        if (!gl) {
            return;
        }
        const stencilMaterialEnabled = !this.useStencilGlobalOnly && !!this.stencilMaterial?.enabled;
        this.enabled = stencilMaterialEnabled ? this.stencilMaterial.enabled : this.stencilGlobal.enabled;
        this.func = stencilMaterialEnabled ? this.stencilMaterial.func : this.stencilGlobal.func;
        this.backFunc = stencilMaterialEnabled ? this.stencilMaterial.backFunc : this.stencilGlobal.backFunc;
        this.funcRef = stencilMaterialEnabled ? this.stencilMaterial.funcRef : this.stencilGlobal.funcRef;
        this.funcMask = stencilMaterialEnabled ? this.stencilMaterial.funcMask : this.stencilGlobal.funcMask;
        this.opStencilFail = stencilMaterialEnabled ? this.stencilMaterial.opStencilFail : this.stencilGlobal.opStencilFail;
        this.opDepthFail = stencilMaterialEnabled ? this.stencilMaterial.opDepthFail : this.stencilGlobal.opDepthFail;
        this.opStencilDepthPass = stencilMaterialEnabled ? this.stencilMaterial.opStencilDepthPass : this.stencilGlobal.opStencilDepthPass;
        this.backOpStencilFail = stencilMaterialEnabled ? this.stencilMaterial.backOpStencilFail : this.stencilGlobal.backOpStencilFail;
        this.backOpDepthFail = stencilMaterialEnabled ? this.stencilMaterial.backOpDepthFail : this.stencilGlobal.backOpDepthFail;
        this.backOpStencilDepthPass = stencilMaterialEnabled ? this.stencilMaterial.backOpStencilDepthPass : this.stencilGlobal.backOpStencilDepthPass;
        this.mask = stencilMaterialEnabled ? this.stencilMaterial.mask : this.stencilGlobal.mask;
        if (!this.isDirty) {
            return;
        }
        // Stencil test
        if (this._isStencilTestDirty) {
            if (this.enabled) {
                gl.enable(gl.STENCIL_TEST);
            }
            else {
                gl.disable(gl.STENCIL_TEST);
            }
            this._isStencilTestDirty = false;
        }
        // Stencil mask
        if (this._isStencilMaskDirty) {
            gl.stencilMask(this.mask);
            this._isStencilMaskDirty = false;
        }
        // Stencil func
        if (this._isStencilFuncDirty) {
            gl.stencilFuncSeparate(gl.FRONT, this.func, this.funcRef, this.funcMask);
            gl.stencilFuncSeparate(gl.BACK, this.backFunc, this.funcRef, this.funcMask);
            this._isStencilFuncDirty = false;
        }
        // Stencil op
        if (this._isStencilOpDirty) {
            gl.stencilOpSeparate(gl.FRONT, this.opStencilFail, this.opDepthFail, this.opStencilDepthPass);
            gl.stencilOpSeparate(gl.BACK, this.backOpStencilFail, this.backOpDepthFail, this.backOpStencilDepthPass);
            this._isStencilOpDirty = false;
        }
    }
}
//# sourceMappingURL=stencilStateComposer.js.map