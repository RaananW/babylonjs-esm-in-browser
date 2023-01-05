/** @internal */
export class WebGPURenderPassWrapper {
    constructor() {
        this.colorAttachmentGPUTextures = [];
        this.reset();
    }
    reset(fullReset = false) {
        this.renderPass = null;
        if (fullReset) {
            this.renderPassDescriptor = null;
            this.colorAttachmentViewDescriptor = null;
            this.depthAttachmentViewDescriptor = null;
            this.colorAttachmentGPUTextures = [];
            this.depthTextureFormat = undefined;
        }
    }
}
//# sourceMappingURL=webgpuRenderPassWrapper.js.map