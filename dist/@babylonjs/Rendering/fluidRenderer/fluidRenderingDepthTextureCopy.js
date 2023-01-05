
import { CopyTextureToTexture } from "../../Misc/copyTextureToTexture.js";
/** @internal */
export class FluidRenderingDepthTextureCopy {
    constructor(engine, width, height, samples = 1) {
        this._engine = engine;
        this._copyTextureToTexture = new CopyTextureToTexture(engine, true);
        this._depthRTWrapper = this._engine.createRenderTargetTexture({ width, height }, {
            generateMipMaps: false,
            type: 0,
            format: 6,
            samplingMode: 1,
            generateDepthBuffer: true,
            generateStencilBuffer: false,
            samples,
            noColorAttachment: true,
        });
        this._depthRTWrapper.createDepthStencilTexture(0, false, false, 1);
    }
    get depthRTWrapper() {
        return this._depthRTWrapper;
    }
    copy(source) {
        return this._copyTextureToTexture.copy(source, this._depthRTWrapper);
    }
    dispose() {
        this._depthRTWrapper.dispose();
        this._copyTextureToTexture.dispose();
    }
}
//# sourceMappingURL=fluidRenderingDepthTextureCopy.js.map