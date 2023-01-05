import type { Nullable } from "../../types";
import type { WebGPUHardwareTexture } from "./webgpuHardwareTexture";
/** @internal */
export declare class WebGPURenderPassWrapper {
    renderPassDescriptor: Nullable<GPURenderPassDescriptor>;
    renderPass: Nullable<GPURenderPassEncoder>;
    colorAttachmentViewDescriptor: Nullable<GPUTextureViewDescriptor>;
    depthAttachmentViewDescriptor: Nullable<GPUTextureViewDescriptor>;
    colorAttachmentGPUTextures: (WebGPUHardwareTexture | null)[];
    depthTextureFormat: GPUTextureFormat | undefined;
    constructor();
    reset(fullReset?: boolean): void;
}
