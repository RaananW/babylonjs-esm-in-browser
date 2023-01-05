import * as WebGPUConstants from "./webgpuConstants.js";
import { WebGPUQuerySet } from "./webgpuQuerySet.js";
/** @internal */
export class WebGPUOcclusionQuery {
    constructor(engine, device, bufferManager, startCount = 50, incrementCount = 100) {
        this._availableIndices = [];
        this._engine = engine;
        this._device = device;
        this._bufferManager = bufferManager;
        this._frameLastBuffer = -1;
        this._currentTotalIndices = 0;
        this._countIncrement = incrementCount;
        this._allocateNewIndices(startCount);
    }
    get querySet() {
        return this._querySet.querySet;
    }
    get hasQueries() {
        return this._currentTotalIndices !== this._availableIndices.length;
    }
    get canBeginQuery() {
        const passIndex = this._engine._getCurrentRenderPassIndex();
        switch (passIndex) {
            case 0: {
                return this._engine._mainRenderPassWrapper.renderPassDescriptor.occlusionQuerySet !== undefined;
            }
            case 1: {
                return this._engine._rttRenderPassWrapper.renderPassDescriptor.occlusionQuerySet !== undefined;
            }
        }
        return false;
    }
    createQuery() {
        if (this._availableIndices.length === 0) {
            this._allocateNewIndices();
        }
        const index = this._availableIndices[this._availableIndices.length - 1];
        this._availableIndices.length--;
        return index;
    }
    deleteQuery(index) {
        this._availableIndices[this._availableIndices.length - 1] = index;
    }
    isQueryResultAvailable(index) {
        this._retrieveQueryBuffer();
        return !!this._lastBuffer && index < this._lastBuffer.length;
    }
    getQueryResult(index) {
        var _a, _b;
        return Number((_b = (_a = this._lastBuffer) === null || _a === void 0 ? void 0 : _a[index]) !== null && _b !== void 0 ? _b : -1);
    }
    _retrieveQueryBuffer() {
        if (this._lastBuffer && this._frameLastBuffer === this._engine.frameId) {
            return;
        }
        if (this._frameLastBuffer !== this._engine.frameId) {
            this._frameLastBuffer = this._engine.frameId;
            this._querySet.readValues(0, this._currentTotalIndices).then((arrayBuffer) => {
                this._lastBuffer = arrayBuffer;
            });
        }
    }
    _allocateNewIndices(numIndices) {
        numIndices = numIndices !== null && numIndices !== void 0 ? numIndices : this._countIncrement;
        this._delayQuerySetDispose();
        for (let i = 0; i < numIndices; ++i) {
            this._availableIndices.push(this._currentTotalIndices + i);
        }
        this._currentTotalIndices += numIndices;
        this._querySet = new WebGPUQuerySet(this._currentTotalIndices, WebGPUConstants.QueryType.Occlusion, this._device, this._bufferManager, false);
    }
    _delayQuerySetDispose() {
        const querySet = this._querySet;
        if (querySet) {
            // Wait a bit before disposing of the queryset, in case some queries are still running for it
            setTimeout(() => querySet.dispose, 1000);
        }
    }
    dispose() {
        var _a;
        (_a = this._querySet) === null || _a === void 0 ? void 0 : _a.dispose();
        this._availableIndices.length = 0;
    }
}
//# sourceMappingURL=webgpuOcclusionQuery.js.map