import { ThinEngine } from "../Engines/thinEngine.js";

import { EffectRenderer, EffectWrapper } from "../Materials/effectRenderer.js";
import { Tools } from "./tools.js";
import { passPixelShader } from "../Shaders/pass.fragment.js";
/**
 * Class containing a set of static utilities functions to dump data from a canvas
 */
export class DumpTools {
    static _CreateDumpRenderer() {
        if (!DumpTools._DumpToolsEngine) {
            const canvas = document.createElement("canvas");
            const engine = new ThinEngine(canvas, false, {
                preserveDrawingBuffer: true,
                depth: false,
                stencil: false,
                alpha: true,
                premultipliedAlpha: false,
                antialias: false,
                failIfMajorPerformanceCaveat: false,
            });
            engine.getCaps().parallelShaderCompile = undefined;
            const renderer = new EffectRenderer(engine);
            const wrapper = new EffectWrapper({
                engine,
                name: passPixelShader.name,
                fragmentShader: passPixelShader.shader,
                samplerNames: ["textureSampler"],
            });
            DumpTools._DumpToolsEngine = {
                canvas,
                engine,
                renderer,
                wrapper,
            };
        }
        return DumpTools._DumpToolsEngine;
    }
    /**
     * Dumps the current bound framebuffer
     * @param width defines the rendering width
     * @param height defines the rendering height
     * @param engine defines the hosting engine
     * @param successCallback defines the callback triggered once the data are available
     * @param mimeType defines the mime type of the result
     * @param fileName defines the filename to download. If present, the result will automatically be downloaded
     * @returns a void promise
     */
    static async DumpFramebuffer(width, height, engine, successCallback, mimeType = "image/png", fileName) {
        // Read the contents of the framebuffer
        const bufferView = await engine.readPixels(0, 0, width, height);
        const data = new Uint8Array(bufferView.buffer);
        DumpTools.DumpData(width, height, data, successCallback, mimeType, fileName, true);
    }
    /**
     * Dumps an array buffer
     * @param width defines the rendering width
     * @param height defines the rendering height
     * @param data the data array
     * @param mimeType defines the mime type of the result
     * @param fileName defines the filename to download. If present, the result will automatically be downloaded
     * @param invertY true to invert the picture in the Y dimension
     * @param toArrayBuffer true to convert the data to an ArrayBuffer (encoded as `mimeType`) instead of a base64 string
     * @param quality defines the quality of the result
     * @returns a promise that resolve to the final data
     */
    static DumpDataAsync(width, height, data, mimeType = "image/png", fileName, invertY = false, toArrayBuffer = false, quality) {
        return new Promise((resolve) => {
            DumpTools.DumpData(width, height, data, (result) => resolve(result), mimeType, fileName, invertY, toArrayBuffer, quality);
        });
    }
    /**
     * Dumps an array buffer
     * @param width defines the rendering width
     * @param height defines the rendering height
     * @param data the data array
     * @param successCallback defines the callback triggered once the data are available
     * @param mimeType defines the mime type of the result
     * @param fileName defines the filename to download. If present, the result will automatically be downloaded
     * @param invertY true to invert the picture in the Y dimension
     * @param toArrayBuffer true to convert the data to an ArrayBuffer (encoded as `mimeType`) instead of a base64 string
     * @param quality defines the quality of the result
     */
    static DumpData(width, height, data, successCallback, mimeType = "image/png", fileName, invertY = false, toArrayBuffer = false, quality) {
        const renderer = DumpTools._CreateDumpRenderer();
        renderer.engine.setSize(width, height, true);
        // Convert if data are float32
        if (data instanceof Float32Array) {
            const data2 = new Uint8Array(data.length);
            let n = data.length;
            while (n--) {
                const v = data[n];
                data2[n] = v < 0 ? 0 : v > 1 ? 1 : Math.round(v * 255);
            }
            data = data2;
        }
        // Create the image
        const texture = renderer.engine.createRawTexture(data, width, height, 5, false, !invertY, 1);
        renderer.renderer.setViewport();
        renderer.renderer.applyEffectWrapper(renderer.wrapper);
        renderer.wrapper.effect._bindTexture("textureSampler", texture);
        renderer.renderer.draw();
        if (toArrayBuffer) {
            Tools.ToBlob(renderer.canvas, (blob) => {
                const fileReader = new FileReader();
                fileReader.onload = (event) => {
                    const arrayBuffer = event.target.result;
                    if (successCallback) {
                        successCallback(arrayBuffer);
                    }
                };
                fileReader.readAsArrayBuffer(blob);
            }, mimeType, quality);
        }
        else {
            Tools.EncodeScreenshotCanvasData(renderer.canvas, successCallback, mimeType, fileName, quality);
        }
        texture.dispose();
    }
    /**
     * Dispose the dump tools associated resources
     */
    static Dispose() {
        if (DumpTools._DumpToolsEngine) {
            DumpTools._DumpToolsEngine.wrapper.dispose();
            DumpTools._DumpToolsEngine.renderer.dispose();
            DumpTools._DumpToolsEngine.engine.dispose();
        }
        DumpTools._DumpToolsEngine = null;
    }
}
/**
 * This will be executed automatically for UMD and es5.
 * If esm dev wants the side effects to execute they will have to run it manually
 * Once we build native modules those need to be exported.
 * @internal
 */
const initSideEffects = () => {
    // References the dependencies.
    Tools.DumpData = DumpTools.DumpData;
    Tools.DumpDataAsync = DumpTools.DumpDataAsync;
    Tools.DumpFramebuffer = DumpTools.DumpFramebuffer;
};
initSideEffects();
//# sourceMappingURL=dumpTools.js.map