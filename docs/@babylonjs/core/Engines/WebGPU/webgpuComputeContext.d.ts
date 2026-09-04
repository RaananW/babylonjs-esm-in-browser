import { type IComputeContext } from "../../Compute/IComputeContext.js";
import { type ComputeBindingList, type ComputeBindingMapping } from "../Extensions/engine.computeShader.pure.js";
import { type WebGPUCacheSampler } from "./webgpuCacheSampler.js";
/** @internal */
export declare class WebGPUComputeContext implements IComputeContext {
    private static _Counter;
    readonly uniqueId: number;
    private _device;
    private _cacheSampler;
    private _bindGroups;
    private _bindGroupEntries;
    getBindGroups(bindings: ComputeBindingList, computePipeline: GPUComputePipeline, bindingsMapping?: ComputeBindingMapping): GPUBindGroup[];
    constructor(device: GPUDevice, cacheSampler: WebGPUCacheSampler);
    clear(): void;
}
