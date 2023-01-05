import type { HardwareTextureWrapper } from "../../Materials/Textures/hardwareTextureWrapper";
import type { Nullable } from "../../types";
declare type WebGPUBundleList = import("./webgpuBundleList").WebGPUBundleList;
/** @internal */
export declare class WebGPUHardwareTexture implements HardwareTextureWrapper {
    /**
     * List of bundles collected in the snapshot rendering mode when the texture is a render target texture
     * The index in this array is the current layer we are rendering into
     * @internal
     */
    _bundleLists: WebGPUBundleList[];
    /**
     * Current layer we are rendering into when in snapshot rendering mode (if the texture is a render target texture)
     * @internal
     */
    _currentLayer: number;
    /**
     * Cache of RenderPassDescriptor and BindGroup used when generating mipmaps (see WebGPUTextureHelper.generateMipmaps)
     * @internal
     */
    _mipmapGenRenderPassDescr: GPURenderPassDescriptor[][];
    /** @internal */
    _mipmapGenBindGroup: GPUBindGroup[][];
    /**
     * Cache for the invertYPreMultiplyAlpha function (see WebGPUTextureHelper)
     * @internal
     */
    _copyInvertYTempTexture?: GPUTexture;
    /** @internal */
    _copyInvertYRenderPassDescr: GPURenderPassDescriptor;
    /** @internal */
    _copyInvertYBindGroup: GPUBindGroup;
    /** @internal */
    _copyInvertYBindGroupWithOfst: GPUBindGroup;
    private _webgpuTexture;
    private _webgpuMSAATexture;
    get underlyingResource(): Nullable<GPUTexture>;
    get msaaTexture(): Nullable<GPUTexture>;
    set msaaTexture(texture: Nullable<GPUTexture>);
    view: Nullable<GPUTextureView>;
    viewForWriting: Nullable<GPUTextureView>;
    format: GPUTextureFormat;
    textureUsages: number;
    textureAdditionalUsages: number;
    constructor(existingTexture?: Nullable<GPUTexture>);
    set(hardwareTexture: GPUTexture): void;
    setUsage(textureSource: number, generateMipMaps: boolean, isCube: boolean, width: number, height: number): void;
    createView(descriptor?: GPUTextureViewDescriptor, createViewForWriting?: boolean): void;
    reset(): void;
    release(): void;
}
export {};
