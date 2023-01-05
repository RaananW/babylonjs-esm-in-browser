import type { Effect } from "../../Materials/effect";
import type { InternalTexture } from "../../Materials/Textures/internalTexture";
import { VertexBuffer } from "../../Buffers/buffer";
import type { DataBuffer } from "../../Buffers/dataBuffer";
import type { Nullable } from "../../types";
/** @internal */
export declare abstract class WebGPUCacheRenderPipeline {
    static NumCacheHitWithoutHash: number;
    static NumCacheHitWithHash: number;
    static NumCacheMiss: number;
    static NumPipelineCreationLastFrame: number;
    disabled: boolean;
    private static _NumPipelineCreationCurrentFrame;
    protected _states: number[];
    protected _statesLength: number;
    protected _stateDirtyLowestIndex: number;
    lastStateDirtyLowestIndex: number;
    private _device;
    private _isDirty;
    private _emptyVertexBuffer;
    private _parameter;
    private _kMaxVertexBufferStride;
    private _shaderId;
    private _alphaToCoverageEnabled;
    private _frontFace;
    private _cullEnabled;
    private _cullFace;
    private _clampDepth;
    private _rasterizationState;
    private _depthBias;
    private _depthBiasClamp;
    private _depthBiasSlopeScale;
    private _colorFormat;
    private _webgpuColorFormat;
    private _mrtAttachments1;
    private _mrtAttachments2;
    private _mrtFormats;
    private _mrtEnabledMask;
    private _alphaBlendEnabled;
    private _alphaBlendFuncParams;
    private _alphaBlendEqParams;
    private _writeMask;
    private _colorStates;
    private _depthStencilFormat;
    private _webgpuDepthStencilFormat;
    private _depthTestEnabled;
    private _depthWriteEnabled;
    private _depthCompare;
    private _stencilEnabled;
    private _stencilFrontCompare;
    private _stencilFrontDepthFailOp;
    private _stencilFrontPassOp;
    private _stencilFrontFailOp;
    private _stencilReadMask;
    private _stencilWriteMask;
    private _depthStencilState;
    private _vertexBuffers;
    private _overrideVertexBuffers;
    private _indexBuffer;
    private _textureState;
    private _useTextureStage;
    constructor(device: GPUDevice, emptyVertexBuffer: VertexBuffer, useTextureStage: boolean);
    reset(): void;
    protected abstract _getRenderPipeline(param: {
        token: any;
        pipeline: Nullable<GPURenderPipeline>;
    }): void;
    protected abstract _setRenderPipeline(param: {
        token: any;
        pipeline: Nullable<GPURenderPipeline>;
    }): void;
    readonly vertexBuffers: VertexBuffer[];
    get colorFormats(): (GPUTextureFormat | null)[];
    readonly mrtAttachments: number[];
    readonly mrtTextureArray: InternalTexture[];
    readonly mrtTextureCount: number;
    getRenderPipeline(fillMode: number, effect: Effect, sampleCount: number, textureState?: number): GPURenderPipeline;
    endFrame(): void;
    setAlphaToCoverage(enabled: boolean): void;
    setFrontFace(frontFace: number): void;
    setCullEnabled(enabled: boolean): void;
    setCullFace(cullFace: number): void;
    setClampDepth(clampDepth: boolean): void;
    resetDepthCullingState(): void;
    setDepthCullingState(cullEnabled: boolean, frontFace: number, cullFace: number, zOffset: number, zOffsetUnits: number, depthTestEnabled: boolean, depthWriteEnabled: boolean, depthCompare: Nullable<number>): void;
    setDepthBias(depthBias: number): void;
    setDepthBiasSlopeScale(depthBiasSlopeScale: number): void;
    setColorFormat(format: GPUTextureFormat | null): void;
    setMRTAttachments(attachments: number[]): void;
    setMRT(textureArray: InternalTexture[], textureCount?: number): void;
    setAlphaBlendEnabled(enabled: boolean): void;
    setAlphaBlendFactors(factors: Array<Nullable<number>>, operations: Array<Nullable<number>>): void;
    setWriteMask(mask: number): void;
    setDepthStencilFormat(format: GPUTextureFormat | undefined): void;
    setDepthTestEnabled(enabled: boolean): void;
    setDepthWriteEnabled(enabled: boolean): void;
    setDepthCompare(func: Nullable<number>): void;
    setStencilEnabled(enabled: boolean): void;
    setStencilCompare(func: Nullable<number>): void;
    setStencilDepthFailOp(op: Nullable<number>): void;
    setStencilPassOp(op: Nullable<number>): void;
    setStencilFailOp(op: Nullable<number>): void;
    setStencilReadMask(mask: number): void;
    setStencilWriteMask(mask: number): void;
    resetStencilState(): void;
    setStencilState(stencilEnabled: boolean, compare: Nullable<number>, depthFailOp: Nullable<number>, passOp: Nullable<number>, failOp: Nullable<number>, readMask: number, writeMask: number): void;
    setBuffers(vertexBuffers: Nullable<{
        [key: string]: Nullable<VertexBuffer>;
    }>, indexBuffer: Nullable<DataBuffer>, overrideVertexBuffers: Nullable<{
        [key: string]: Nullable<VertexBuffer>;
    }>): void;
    private static _GetTopology;
    private static _GetAphaBlendOperation;
    private static _GetAphaBlendFactor;
    private static _GetCompareFunction;
    private static _GetStencilOpFunction;
    private static _GetVertexInputDescriptorFormat;
    private _getAphaBlendState;
    private _getColorBlendState;
    private _setShaderStage;
    private _setRasterizationState;
    private _setColorStates;
    private _setDepthStencilState;
    private _setVertexState;
    private _setTextureState;
    private _createPipelineLayout;
    private _createPipelineLayoutWithTextureStage;
    private _getVertexInputDescriptor;
    private _createRenderPipeline;
}