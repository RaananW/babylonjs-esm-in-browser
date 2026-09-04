import { ILog2 } from "../../Maths/math.scalar.functions.js";
import { WebGPUTextureHelper } from "./webgpuTextureHelper.js";
/** @internal */
export class WebGPUHardwareTexture {
    get underlyingResource() {
        return this._webgpuTexture;
    }
    // index is the index of the layer for a 2DArrayTexture / 3DTexture, the face index for a cube texture or the layer * 6 + face index for a cube array texture.
    // In single render target case, index is 0.
    getMSAATexture(sampleCount, index = 0) {
        const texture = this._webgpuMSAATexture[index];
        if (!texture) {
            this._createMSAATexture(sampleCount, index);
        }
        return this._webgpuMSAATexture[index];
    }
    releaseMSAATextures() {
        for (const texture of this._webgpuMSAATexture) {
            if (texture) {
                this._engine._textureHelper.releaseTexture(texture);
            }
        }
        this._webgpuMSAATexture.length = 0;
    }
    constructor(_engine, existingTexture = null) {
        this._engine = _engine;
        /** @internal */
        this._originalFormatIsRGB = false;
        this.format = "rgba8unorm" /* WebGPUConstants.TextureFormat.RGBA8Unorm */;
        // This is the original format requested. It can be different from "format" in case original format is a depth/stencil format and MSAA is requested.
        // In that case, format will be a R16 or R32 format, because the texture will be used as the resolve texture.
        this.originalFormat = "rgba8unorm" /* WebGPUConstants.TextureFormat.RGBA8Unorm */;
        this.textureUsages = 0;
        this.textureAdditionalUsages = 0;
        this._webgpuTexture = existingTexture;
        this._webgpuMSAATexture = [];
        this.view = null;
        this.viewForWriting = null;
    }
    set(hardwareTexture) {
        this._webgpuTexture = hardwareTexture;
    }
    setUsage(_textureSource, generateMipMaps, is2DArray, isCube, is3D, width, height, depth) {
        let viewDimension = "2d" /* WebGPUConstants.TextureViewDimension.E2d */;
        let arrayLayerCount = 1;
        if (isCube) {
            viewDimension = is2DArray ? "cube-array" /* WebGPUConstants.TextureViewDimension.CubeArray */ : "cube" /* WebGPUConstants.TextureViewDimension.Cube */;
            arrayLayerCount = 6 * (depth || 1);
        }
        else if (is3D) {
            viewDimension = "3d" /* WebGPUConstants.TextureViewDimension.E3d */;
            arrayLayerCount = 1;
        }
        else if (is2DArray) {
            viewDimension = "2d-array" /* WebGPUConstants.TextureViewDimension.E2dArray */;
            arrayLayerCount = depth;
        }
        const format = WebGPUTextureHelper.GetDepthFormatOnly(this.format);
        const aspect = WebGPUTextureHelper.HasDepthAndStencilAspects(this.format) ? "depth-only" /* WebGPUConstants.TextureAspect.DepthOnly */ : "all" /* WebGPUConstants.TextureAspect.All */;
        this.createView({
            label: `TextureView${is3D ? "3D" : isCube ? "Cube" : "2D"}${is2DArray ? "_Array" + arrayLayerCount : ""}_${width}x${height}_${generateMipMaps ? "wmips" : "womips"}_${this.format}_${viewDimension}`,
            format,
            dimension: viewDimension,
            mipLevelCount: generateMipMaps ? ILog2(Math.max(width, height)) + 1 : 1,
            baseArrayLayer: 0,
            baseMipLevel: 0,
            arrayLayerCount,
            aspect,
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
        this._webgpuMSAATexture.length = 0;
        this.view = null;
        this.viewForWriting = null;
    }
    release() {
        this._webgpuTexture?.destroy();
        this.releaseMSAATextures();
        this._copyInvertYTempTexture?.destroy();
        this.reset();
    }
    _createMSAATexture(samples, index) {
        if (!this._webgpuTexture) {
            throw new Error("Cannot create GPU MSAA texture because underlying GPU texture is not created yet.");
        }
        if (!this._webgpuMSAATexture) {
            this._webgpuMSAATexture = [];
        }
        this._webgpuMSAATexture[index] = this._engine._textureHelper.createMSAATexture(this._webgpuTexture, this.originalFormat, samples);
    }
}
//# sourceMappingURL=webgpuHardwareTexture.js.map