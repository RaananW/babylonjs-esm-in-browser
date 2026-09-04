import { type TextureSampler } from "../../Materials/Textures/textureSampler.js";
import { type Nullable } from "../../types.js";
/** @internal */
export declare class WebGPUCacheSampler {
    private _samplers;
    private _device;
    disabled: boolean;
    constructor(device: GPUDevice);
    static GetSamplerHashCode(sampler: TextureSampler): number;
    private static _GetSamplerFilterDescriptor;
    private static _GetWrappingMode;
    private static _GetSamplerWrappingDescriptor;
    private static _GetSamplerDescriptor;
    static GetCompareFunction(compareFunction: Nullable<number>): GPUCompareFunction;
    getSampler(sampler: TextureSampler, bypassCache?: boolean, hash?: number, label?: string): GPUSampler;
}
