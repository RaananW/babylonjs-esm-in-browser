/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";

import { EffectRenderer, EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { Tools } from "./tools.pure.js";
import { Clamp } from "../Maths/math.scalar.functions.js";
import { EngineStore } from "../Engines/engineStore.js";
import { Logger } from "./logger.js";
import { EncodeArrayBufferToBase64 } from "./stringTools.js";
import { nativeOverride } from "./decorators.js";
let ResourcesPromise = null;
async function _CreateDumpResourcesAsync() {
    // Create a compatible canvas. Prefer an HTMLCanvasElement if possible to avoid alpha issues with OffscreenCanvas + WebGL in many browsers.
    const canvas = (EngineStore.LastCreatedEngine?.createCanvas(100, 100) ?? new OffscreenCanvas(100, 100)); // will be resized later
    if (canvas instanceof OffscreenCanvas) {
        Logger.Warn("DumpData: OffscreenCanvas will be used for dumping data. This may result in lossy alpha values.");
    }
    // If WebGL via ThinEngine is not available, we cannot encode the data.
    // If https://github.com/whatwg/html/issues/10142 is resolved, we can migrate to just BitmapRenderer and avoid an engine dependency altogether.
    const { ThinEngine: thinEngineClass } = await import("../Engines/thinEngine.pure.js");
    if (!thinEngineClass.IsSupported) {
        throw new Error("DumpData: No WebGL context available. Cannot dump data.");
    }
    const options = {
        preserveDrawingBuffer: true,
        depth: false,
        stencil: false,
        alpha: true,
        premultipliedAlpha: false,
        antialias: false,
        failIfMajorPerformanceCaveat: false,
    };
    const engine = new thinEngineClass(canvas, false, options);
    // remove this engine from the list of instances to avoid using it for other purposes
    EngineStore.Instances.pop();
    // However, make sure to dispose it when no other engines are left
    EngineStore.OnEnginesDisposedObservable.add((e) => {
        // guaranteed to run when no other instances are left
        // only dispose if it's not the current engine
        if (engine && e !== engine && !engine.isDisposed && EngineStore.Instances.length === 0) {
            // Dump the engine and the associated resources
            Dispose();
        }
    });
    engine.getCaps().parallelShaderCompile = undefined;
    const renderer = new EffectRenderer(engine);
    const { passPixelShader } = await import("../Shaders/pass.fragment.js");
    const wrapper = new EffectWrapper({
        engine,
        name: passPixelShader.name,
        fragmentShader: passPixelShader.shader,
        samplerNames: ["textureSampler"],
    });
    return {
        canvas: canvas,
        dumpEngine: { engine, renderer, wrapper },
    };
}
async function _GetDumpResourcesAsync() {
    if (!ResourcesPromise) {
        ResourcesPromise = _CreateDumpResourcesAsync();
    }
    return await ResourcesPromise;
}
let EncodingHelper = (() => {
    var _a;
    let _staticExtraInitializers = [];
    let _static_EncodeImageAsync_decorators;
    return _a = class EncodingHelper {
            /**
             * Encodes image data to the given mime type.
             * This is put into a helper class so we can apply the nativeOverride decorator to it.
             * @internal
             */
            static async EncodeImageAsync(pixelData, width, height, mimeType, invertY, quality) {
                const resources = await _GetDumpResourcesAsync();
                const dumpEngine = resources.dumpEngine;
                dumpEngine.engine.setSize(width, height, true);
                // Create the image
                const texture = dumpEngine.engine.createRawTexture(pixelData, width, height, 5, false, !invertY, 1);
                dumpEngine.renderer.setViewport();
                dumpEngine.renderer.applyEffectWrapper(dumpEngine.wrapper);
                dumpEngine.wrapper.effect._bindTexture("textureSampler", texture);
                dumpEngine.renderer.draw();
                texture.dispose();
                return await new Promise((resolve, reject) => {
                    Tools.ToBlob(resources.canvas, (blob) => {
                        if (!blob) {
                            reject(new Error("EncodeImageAsync: Failed to convert canvas to blob."));
                        }
                        else {
                            resolve(blob);
                        }
                    }, mimeType, quality);
                });
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _static_EncodeImageAsync_decorators = [nativeOverride];
            __esDecorate(_a, null, _static_EncodeImageAsync_decorators, { kind: "method", name: "EncodeImageAsync", static: true, private: false, access: { has: obj => "EncodeImageAsync" in obj, get: obj => obj.EncodeImageAsync }, metadata: _metadata }, null, _staticExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_a, _staticExtraInitializers);
        })(),
        _a;
})();
/**
 * Encodes pixel data to an image
 * @param pixelData 8-bit RGBA pixel data
 * @param width the width of the image
 * @param height the height of the image
 * @param mimeType the requested MIME type
 * @param invertY true to invert the image in the Y direction
 * @param quality the quality of the image if lossy mimeType is used (e.g. image/jpeg, image/webp). See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob | HTMLCanvasElement.toBlob()}'s `quality` parameter.
 * @returns a promise that resolves to the encoded image data. Note that the `blob.type` may differ from `mimeType` if it was not supported.
 */
export const EncodeImageAsync = EncodingHelper.EncodeImageAsync;
/**
 * Dumps the current bound framebuffer
 * @param width defines the rendering width
 * @param height defines the rendering height
 * @param engine defines the hosting engine
 * @param successCallback defines the callback triggered once the data are available
 * @param mimeType defines the mime type of the result
 * @param fileName defines the filename to download. If present, the result will automatically be downloaded
 * @param quality The quality of the image if lossy mimeType is used (e.g. image/jpeg, image/webp). See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob | HTMLCanvasElement.toBlob()}'s `quality` parameter.
 * @returns a void promise
 */
// Should have "Async" in the name but this is a public API and we can't break it now
// eslint-disable-next-line no-restricted-syntax
export async function DumpFramebuffer(width, height, engine, successCallback, mimeType = "image/png", fileName, quality) {
    // Read the contents of the framebuffer
    const bufferView = await engine.readPixels(0, 0, width, height);
    const data = new Uint8Array(bufferView.buffer);
    DumpData(width, height, data, successCallback, mimeType, fileName, true, undefined, quality);
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
 * @param quality The quality of the image if lossy mimeType is used (e.g. image/jpeg, image/webp). See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob | HTMLCanvasElement.toBlob()}'s `quality` parameter.
 * @returns a promise that resolve to the final data
 */
export async function DumpDataAsync(width, height, data, mimeType = "image/png", fileName, invertY = false, toArrayBuffer = false, quality) {
    // Convert if data are float32
    if (data instanceof Float32Array) {
        const data2 = new Uint8Array(data.length);
        let n = data.length;
        while (n--) {
            const v = data[n];
            data2[n] = Math.round(Clamp(v) * 255);
        }
        data = data2;
    }
    const blob = await EncodingHelper.EncodeImageAsync(data, width, height, mimeType, invertY, quality);
    if (fileName !== undefined) {
        Tools.DownloadBlob(blob, fileName);
    }
    if (blob.type !== mimeType) {
        Logger.Warn(`DumpData: The requested mimeType '${mimeType}' is not supported. The result has mimeType '${blob.type}' instead.`);
    }
    const buffer = await blob.arrayBuffer();
    if (toArrayBuffer) {
        return buffer;
    }
    return `data:${mimeType};base64,${EncodeArrayBufferToBase64(buffer)}`;
}
/**
 * Dumps an array buffer
 * @param width defines the rendering width
 * @param height defines the rendering height
 * @param data the data array
 * @param successCallback defines the callback triggered once the data are available
 * @param mimeType defines the mime type of the result
 * @param fileName The name of the file to download. If present, the result will automatically be downloaded. If not defined, and `successCallback` is also not defined, the result will automatically be downloaded with an auto-generated file name.
 * @param invertY true to invert the picture in the Y dimension
 * @param toArrayBuffer true to convert the data to an ArrayBuffer (encoded as `mimeType`) instead of a base64 string
 * @param quality The quality of the image if lossy mimeType is used (e.g. image/jpeg, image/webp). See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob | HTMLCanvasElement.toBlob()}'s `quality` parameter.
 */
export function DumpData(width, height, data, successCallback, mimeType = "image/png", fileName, invertY = false, toArrayBuffer = false, quality) {
    // For back-compat: if no fileName and no callback, force download the result
    if (fileName === undefined && !successCallback) {
        fileName = "";
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    DumpDataAsync(width, height, data, mimeType, fileName, invertY, toArrayBuffer, quality)
        // eslint-disable-next-line github/no-then
        .then((result) => {
        if (successCallback) {
            successCallback(result);
        }
    });
}
/**
 * Dispose the dump tools associated resources
 */
export function Dispose() {
    if (!ResourcesPromise) {
        return;
    }
    // in cases where the engine is not yet created, we need to wait for it to dispose it
    // eslint-disable-next-line @typescript-eslint/no-floating-promises, github/no-then
    ResourcesPromise?.then((resources) => {
        if (resources.canvas instanceof HTMLCanvasElement) {
            resources.canvas.remove();
        }
        if (resources.dumpEngine) {
            resources.dumpEngine.engine.dispose();
            resources.dumpEngine.renderer.dispose();
            resources.dumpEngine.wrapper.dispose();
        }
    });
    ResourcesPromise = null;
}
/**
 * Object containing a set of static utilities functions to dump data from a canvas
 * @deprecated use functions
 */
export const DumpTools = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    DumpData,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    DumpDataAsync,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    DumpFramebuffer,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Dispose,
};
/**
 * This will be executed automatically for UMD and es5.
 * If esm dev wants the side effects to execute they will have to run it manually
 * Once we build native modules those need to be exported.
 * @internal
 */
let _Registered = false;
/**
 * Register side effects for dumpTools.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterDumpTools() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const InitSideEffects = () => {
        // References the dependencies.
        Tools.DumpData = DumpData;
        Tools.DumpDataAsync = DumpDataAsync;
        Tools.DumpFramebuffer = DumpFramebuffer;
    };
    InitSideEffects();
}
//# sourceMappingURL=dumpTools.pure.js.map