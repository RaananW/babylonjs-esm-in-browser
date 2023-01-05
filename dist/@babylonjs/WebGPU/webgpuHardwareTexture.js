import { InternalTextureSource } from "../../Materials/Textures/internalTexture.js";
import { Scalar } from "../../Maths/math.scalar.js";
import * as WebGPUConstants from "./webgpuConstants.js";
/** @internal */
export class WebGPUHardwareTexture {
    constructor(existingTexture = null) {
        this.format = WebGPUConstants.TextureFormat.RGBA8Unorm;
        this.textureUsages = 0;
        this.textureAdditionalUsages = 0;
        this._webgpuTexture = existingTexture;
        this._webgpuMSAATexture = null;
        this.view = null;
        this.viewForWriting = null;
    }
    get underlyingResource() {
        return this._webgpuTexture;
    }
    get msaaTexture() {
        return this._webgpuMSAATexture;
    }
    set msaaTexture(texture) {
        this._webgpuMSAATexture = texture;
    }
    set(hardwareTexture) {
        this._webgpuTexture = hardwareTexture;
    }
    setUsage(textureSource, generateMipMaps, isCube, width, height) {
        generateMipMaps = textureSource === InternalTextureSource.RenderTarget ? false : generateMipMaps;
        this.createView({
            format: this.format,
            dimension: isCube ? WebGPUConstants.TextureViewDimension.Cube : WebGPUConstants.TextureViewDimension.E2d,
            mipLevelCount: generateMipMaps ? Scalar.ILog2(Math.max(width, height)) + 1 : 1,
            baseArrayLayer: 0,
            baseMipLevel: 0,
            arrayLayerCount: isCube ? 6 : 1,
            aspect: WebGPUConstants.TextureAspect.All,
        });
    }
    createView(descriptor, createViewForWriting = false) {
        this.view = this._webgpuTexture.createView(descriptor);
        if (createViewForWriting && descriptor) {
            const saveNumMipMaps = descriptor.mipLevelCount;
            descriptor.mipLevelCount = 1;
            this.viewForWriting = this._webgpuTexture.createView(descriptor);
            descriptor.mipLevelCount = saveNumMipMaps;
        }
    }
    reset() {
        this._webgpuTexture = null;
        this._webgpuMSAATexture = null;
        this.view = null;
        this.viewForWriting = null;
    }
    release() {
        var _a, _b, _c;
        (_a = this._webgpuTexture) === null || _a === void 0 ? void 0 : _a.destroy();
        (_b = this._webgpuMSAATexture) === null || _b === void 0 ? void 0 : _b.destroy();
        (_c = this._copyInvertYTempTexture) === null || _c === void 0 ? void 0 : _c.destroy();
        this.reset();
    }
}
//# sourceMappingURL=webgpuHardwareTexture.js.map