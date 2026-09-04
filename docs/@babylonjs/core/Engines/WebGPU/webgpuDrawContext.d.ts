import { type VertexBuffer } from "../../Buffers/buffer.js";
import { type DataBuffer } from "../../Buffers/dataBuffer.js";
import { type WebGPUDataBuffer } from "../../Meshes/WebGPU/webgpuDataBuffer.js";
import { type Nullable } from "../../types.js";
import { type IDrawContext } from "../IDrawContext.js";
import { type WebGPUBufferManager } from "./webgpuBufferManager.js";
import { type WebGPUPipelineContext } from "./webgpuPipelineContext.js";
/**
 * WebGPU implementation of the IDrawContext interface.
 * This class manages the draw context for WebGPU, including buffers and indirect draw data.
 */
export declare class WebGPUDrawContext implements IDrawContext {
    private _dummyIndexBuffer;
    private static _Counter;
    /**
     * Bundle used in fast mode (when compatibilityMode==false)
     */
    fastBundle?: GPURenderBundle;
    /**
     * Cache of the bind groups. Will be reused for the next draw if isDirty==false (and materialContext.isDirty==false)
     */
    bindGroups?: GPUBindGroup[];
    uniqueId: number;
    /**
     * @internal
     * By default, indirect draws are enabled in NON compatibility mode only
     * To enable indirect draws in compatibility mode (done by the end user), enableIndirectDraw must be set to true
     */
    _enableIndirectDrawInCompatMode: boolean;
    /**
     * Buffers (uniform / storage) used for the draw call
     */
    buffers: {
        [name: string]: Nullable<WebGPUDataBuffer>;
    };
    indirectDrawBuffer?: GPUBuffer;
    private _materialContextUpdateId;
    private _bufferManager;
    private _useInstancing;
    private _indirectDrawData?;
    private _currentInstanceCount;
    private _isDirty;
    private _enableIndirectDraw;
    private _vertexPullingEnabled;
    /**
     * Checks if the draw context is dirty.
     * @param materialContextUpdateId The update ID of the material context associated with the draw context.
     * @returns True if the draw or material context is dirty, false otherwise.
     */
    isDirty(materialContextUpdateId: number): boolean;
    /**
     * Resets the dirty state of the draw context.
     * @param materialContextUpdateId The update ID of the material context associated with the draw context.
     */
    resetIsDirty(materialContextUpdateId: number): void;
    get enableIndirectDraw(): boolean;
    set enableIndirectDraw(enable: boolean);
    get useInstancing(): boolean;
    set useInstancing(use: boolean);
    /**
     * Creates a new WebGPUDrawContext.
     * @param bufferManager The buffer manager used to manage WebGPU buffers.
     * @param _dummyIndexBuffer A dummy index buffer to be bound as the "indices"
     * storage buffer when no index buffer is provided.
     */
    constructor(bufferManager: WebGPUBufferManager, _dummyIndexBuffer: WebGPUDataBuffer);
    reset(): void;
    /**
     * Associates a buffer to the draw context.
     * @param name The name of the buffer.
     * @param buffer The buffer to set.
     */
    setBuffer(name: string, buffer: Nullable<WebGPUDataBuffer>): void;
    setIndirectData(indexOrVertexCount: number, instanceCount: number, firstIndexOrVertex: number, forceUpdate?: boolean): void;
    /**
     * Setup or disable vertex pulling as needed.
     * @param useVertexPulling Use vertex pulling or not
     * @param webgpuPipelineContext The WebGPU pipeline context
     * @param vertexBuffers The current vertex buffers
     * @param indexBuffer The current index buffer
     * @param overrideVertexBuffers The vertex buffers to override
     */
    setVertexPulling(useVertexPulling: boolean, webgpuPipelineContext: WebGPUPipelineContext, vertexBuffers: {
        [key: string]: Nullable<VertexBuffer>;
    }, indexBuffer: Nullable<DataBuffer>, overrideVertexBuffers: Nullable<{
        [kind: string]: Nullable<VertexBuffer>;
    }>): void;
    dispose(): void;
}
