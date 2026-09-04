import * as WebGPUConstants from "./webgpuConstants.js";
/**
 * WebGPU implementation of the IDrawContext interface.
 * This class manages the draw context for WebGPU, including buffers and indirect draw data.
 */
export class WebGPUDrawContext {
    /**
     * Checks if the draw context is dirty.
     * @param materialContextUpdateId The update ID of the material context associated with the draw context.
     * @returns True if the draw or material context is dirty, false otherwise.
     */
    isDirty(materialContextUpdateId) {
        return this._isDirty || this._materialContextUpdateId !== materialContextUpdateId;
    }
    /**
     * Resets the dirty state of the draw context.
     * @param materialContextUpdateId The update ID of the material context associated with the draw context.
     */
    resetIsDirty(materialContextUpdateId) {
        this._isDirty = false;
        this._materialContextUpdateId = materialContextUpdateId;
    }
    get enableIndirectDraw() {
        return this._enableIndirectDraw;
    }
    set enableIndirectDraw(enable) {
        this._enableIndirectDrawInCompatMode = true;
        if (this._enableIndirectDraw === enable) {
            return;
        }
        this._enableIndirectDraw = enable;
        if (!enable && !this._useInstancing && this.indirectDrawBuffer) {
            this._bufferManager.releaseBuffer(this.indirectDrawBuffer);
            this.indirectDrawBuffer = undefined;
            this._indirectDrawData = undefined;
        }
        else if (enable && !this.indirectDrawBuffer) {
            this.indirectDrawBuffer = this._bufferManager.createRawBuffer(20, WebGPUConstants.BufferUsage.CopyDst | WebGPUConstants.BufferUsage.Indirect | WebGPUConstants.BufferUsage.Storage, undefined, "IndirectDrawBuffer");
            this._indirectDrawData = new Uint32Array(5);
            this._indirectDrawData[3] = 0;
            this._indirectDrawData[4] = 0;
        }
    }
    get useInstancing() {
        return this._useInstancing;
    }
    set useInstancing(use) {
        if (this._useInstancing === use) {
            return;
        }
        this._useInstancing = use;
        this._currentInstanceCount = -1;
        const enableIndirectDrawInCompatMode = this._enableIndirectDrawInCompatMode;
        this.enableIndirectDraw = use;
        this._enableIndirectDrawInCompatMode = enableIndirectDrawInCompatMode;
    }
    /**
     * Creates a new WebGPUDrawContext.
     * @param bufferManager The buffer manager used to manage WebGPU buffers.
     * @param _dummyIndexBuffer A dummy index buffer to be bound as the "indices"
     * storage buffer when no index buffer is provided.
     */
    constructor(bufferManager, _dummyIndexBuffer) {
        this._dummyIndexBuffer = _dummyIndexBuffer;
        /**
         * @internal
         * By default, indirect draws are enabled in NON compatibility mode only
         * To enable indirect draws in compatibility mode (done by the end user), enableIndirectDraw must be set to true
         */
        this._enableIndirectDrawInCompatMode = false;
        this._bufferManager = bufferManager;
        this.uniqueId = WebGPUDrawContext._Counter++;
        this._useInstancing = false;
        this._currentInstanceCount = 0;
        this._enableIndirectDraw = false;
        this._vertexPullingEnabled = false;
        this.reset();
    }
    reset() {
        this.buffers = {};
        this._isDirty = true;
        this._materialContextUpdateId = 0;
        this.fastBundle = undefined;
        this.bindGroups = undefined;
        this._vertexPullingEnabled = false;
    }
    /**
     * Associates a buffer to the draw context.
     * @param name The name of the buffer.
     * @param buffer The buffer to set.
     */
    setBuffer(name, buffer) {
        this._isDirty || (this._isDirty = buffer?.uniqueId !== this.buffers[name]?.uniqueId);
        this.buffers[name] = buffer;
    }
    setIndirectData(indexOrVertexCount, instanceCount, firstIndexOrVertex, forceUpdate = false) {
        if ((!forceUpdate && instanceCount === this._currentInstanceCount) || !this.indirectDrawBuffer || !this._indirectDrawData) {
            // The current buffer is already up to date so do nothing
            // Note that we only check for instanceCount and not indexOrVertexCount nor firstIndexOrVertex because those values
            // are supposed to not change during the lifetime of a draw context
            return;
        }
        this._currentInstanceCount = instanceCount;
        this._indirectDrawData[0] = indexOrVertexCount;
        this._indirectDrawData[1] = instanceCount;
        this._indirectDrawData[2] = firstIndexOrVertex;
        this._bufferManager.setRawData(this.indirectDrawBuffer, 0, this._indirectDrawData, 0, 20);
    }
    /**
     * Setup or disable vertex pulling as needed.
     * @param useVertexPulling Use vertex pulling or not
     * @param webgpuPipelineContext The WebGPU pipeline context
     * @param vertexBuffers The current vertex buffers
     * @param indexBuffer The current index buffer
     * @param overrideVertexBuffers The vertex buffers to override
     */
    setVertexPulling(useVertexPulling, webgpuPipelineContext, vertexBuffers, indexBuffer, overrideVertexBuffers) {
        if (this._vertexPullingEnabled === useVertexPulling) {
            return;
        }
        this._vertexPullingEnabled = useVertexPulling;
        this._isDirty = true;
        const bufferNames = webgpuPipelineContext.shaderProcessingContext.bufferNames;
        if (overrideVertexBuffers) {
            for (const attributeName in overrideVertexBuffers) {
                const vertexBuffer = overrideVertexBuffers[attributeName];
                if (!vertexBuffer || bufferNames.indexOf(attributeName) === -1) {
                    continue;
                }
                const buffer = vertexBuffer.effectiveBuffer;
                this.setBuffer(attributeName, useVertexPulling ? buffer : null);
            }
        }
        for (const attributeName in vertexBuffers) {
            if (overrideVertexBuffers && attributeName in overrideVertexBuffers) {
                continue;
            }
            const vertexBuffer = vertexBuffers[attributeName];
            if (!vertexBuffer || bufferNames.indexOf(attributeName) === -1) {
                continue;
            }
            const buffer = vertexBuffer.effectiveBuffer;
            this.setBuffer(attributeName, useVertexPulling ? buffer : null);
        }
        if (bufferNames.indexOf("indices") !== -1) {
            this.setBuffer("indices", !useVertexPulling ? null : (indexBuffer ?? this._dummyIndexBuffer));
        }
    }
    dispose() {
        if (this.indirectDrawBuffer) {
            this._bufferManager.releaseBuffer(this.indirectDrawBuffer);
            this.indirectDrawBuffer = undefined;
            this._indirectDrawData = undefined;
        }
        this.fastBundle = undefined;
        this.bindGroups = undefined;
        this.buffers = undefined;
        this._enableIndirectDraw = false;
    }
}
WebGPUDrawContext._Counter = 0;
//# sourceMappingURL=webgpuDrawContext.js.map