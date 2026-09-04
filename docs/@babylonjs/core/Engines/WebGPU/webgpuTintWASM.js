import { Logger } from "../../Misc/logger.js";
import { Tools } from "../../Misc/tools.pure.js";
/** @internal */
export class WebGPUTintWASM {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    async initTwgsl(twgslOptions) {
        if (WebGPUTintWASM._Twgsl) {
            return;
        }
        twgslOptions = twgslOptions || {};
        twgslOptions = {
            ...WebGPUTintWASM._TwgslDefaultOptions,
            ...twgslOptions,
        };
        if (twgslOptions.twgsl) {
            WebGPUTintWASM._Twgsl = twgslOptions.twgsl;
            return;
        }
        if (twgslOptions.jsPath && twgslOptions.wasmPath) {
            await Tools.LoadBabylonScriptAsync(twgslOptions.jsPath);
        }
        if (self.twgsl) {
            // eslint-disable-next-line require-atomic-updates
            WebGPUTintWASM._Twgsl = await self.twgsl(Tools.GetBabylonScriptURL(twgslOptions.wasmPath));
            return;
        }
        throw new Error("twgsl is not available.");
    }
    convertSpirV2WGSL(code, disableUniformityAnalysis = false) {
        const ccode = WebGPUTintWASM._Twgsl.convertSpirV2WGSL(code, WebGPUTintWASM.DisableUniformityAnalysis || disableUniformityAnalysis);
        if (WebGPUTintWASM.ShowWGSLShaderCode) {
            Logger.Log(ccode);
            Logger.Log("***********************************************");
        }
        return WebGPUTintWASM.DisableUniformityAnalysis || disableUniformityAnalysis ? "diagnostic(off, derivative_uniformity);\n" + ccode : ccode;
    }
}
// Default twgsl options.
WebGPUTintWASM._TwgslDefaultOptions = {
    jsPath: `${Tools._DefaultCdnUrl}/twgsl/twgsl.js`,
    wasmPath: `${Tools._DefaultCdnUrl}/twgsl/twgsl.wasm`,
};
WebGPUTintWASM.ShowWGSLShaderCode = false;
WebGPUTintWASM.DisableUniformityAnalysis = false;
WebGPUTintWASM._Twgsl = null;
//# sourceMappingURL=webgpuTintWASM.js.map