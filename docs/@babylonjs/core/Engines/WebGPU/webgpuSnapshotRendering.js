
/** @internal */
export class WebGPUSnapshotRendering {
    constructor(engine, renderingMode, bundleList, bundleListRenderTarget) {
        this._record = false;
        this._play = false;
        this._mainPassBundleList = [];
        this._enabled = false;
        this._engine = engine;
        this._mode = renderingMode;
        this._bundleList = bundleList;
        this._bundleListRenderTarget = bundleListRenderTarget;
    }
    get enabled() {
        return this._enabled;
    }
    get play() {
        return this._play;
    }
    get record() {
        return this._record;
    }
    set enabled(activate) {
        this._mainPassBundleList.length = 0;
        this._record = this._enabled = activate;
        this._play = false;
        if (activate) {
            this._modeSaved = this._mode;
            this._mode = 0; // need to reset to standard for the recording pass to avoid some code being bypassed
        }
    }
    get mode() {
        return this._mode;
    }
    set mode(mode) {
        if (this._record) {
            this._modeSaved = mode;
        }
        else {
            this._mode = mode;
        }
    }
    endMainRenderPass() {
        if (this._record) {
            this._mainPassBundleList.push(this._bundleList.clone());
        }
    }
    endRenderTargetPass(currentRenderPass, gpuWrapper) {
        var _a, _b, _c, _d;
        if (this._play) {
            (_b = (_a = gpuWrapper._bundleLists) === null || _a === void 0 ? void 0 : _a[gpuWrapper._currentLayer]) === null || _b === void 0 ? void 0 : _b.run(currentRenderPass);
            if (this._mode === 1) {
                this._engine._reportDrawCall((_d = (_c = gpuWrapper._bundleLists) === null || _c === void 0 ? void 0 : _c[gpuWrapper._currentLayer]) === null || _d === void 0 ? void 0 : _d.numDrawCalls);
            }
        }
        else if (this._record) {
            if (!gpuWrapper._bundleLists) {
                gpuWrapper._bundleLists = [];
            }
            gpuWrapper._bundleLists[gpuWrapper._currentLayer] = this._bundleListRenderTarget.clone();
            gpuWrapper._bundleLists[gpuWrapper._currentLayer].run(currentRenderPass);
            this._bundleListRenderTarget.reset();
        }
        else {
            return false;
        }
        return true;
    }
    endFrame(mainRenderPass) {
        if (this._record) {
            this._mainPassBundleList.push(this._bundleList.clone());
            this._record = false;
            this._play = true;
            this._mode = this._modeSaved;
        }
        if (mainRenderPass !== null && this._play) {
            for (let i = 0; i < this._mainPassBundleList.length; ++i) {
                this._mainPassBundleList[i].run(mainRenderPass);
                if (this._mode === 1) {
                    this._engine._reportDrawCall(this._mainPassBundleList[i].numDrawCalls);
                }
            }
        }
    }
    reset() {
        this.enabled = false;
        this.enabled = true;
    }
}
//# sourceMappingURL=webgpuSnapshotRendering.js.map