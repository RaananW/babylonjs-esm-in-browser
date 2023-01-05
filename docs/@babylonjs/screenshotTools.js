import { Texture } from "../Materials/Textures/texture.js";
import { RenderTargetTexture } from "../Materials/Textures/renderTargetTexture.js";
import { FxaaPostProcess } from "../PostProcesses/fxaaPostProcess.js";

import { Logger } from "./logger.js";
import { Tools } from "./tools.js";
import { DumpTools } from "./dumpTools.js";
let screenshotCanvas = null;
/**
 * Captures a screenshot of the current rendering
 * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/renderToPNG
 * @param engine defines the rendering engine
 * @param camera defines the source camera
 * @param size This parameter can be set to a single number or to an object with the
 * following (optional) properties: precision, width, height. If a single number is passed,
 * it will be used for both width and height. If an object is passed, the screenshot size
 * will be derived from the parameters. The precision property is a multiplier allowing
 * rendering at a higher or lower resolution
 * @param successCallback defines the callback receives a single parameter which contains the
 * screenshot as a string of base64-encoded characters. This string can be assigned to the
 * src parameter of an <img> to display it
 * @param mimeType defines the MIME type of the screenshot image (default: image/png).
 * Check your browser for supported MIME types
 * @param forceDownload force the system to download the image even if a successCallback is provided
 */
export function CreateScreenshot(engine, camera, size, successCallback, mimeType = "image/png", forceDownload = false) {
    const { height, width } = _GetScreenshotSize(engine, camera, size);
    if (!(height && width)) {
        Logger.Error("Invalid 'size' parameter !");
        return;
    }
    if (!screenshotCanvas) {
        screenshotCanvas = document.createElement("canvas");
    }
    screenshotCanvas.width = width;
    screenshotCanvas.height = height;
    const renderContext = screenshotCanvas.getContext("2d");
    const ratio = engine.getRenderWidth() / engine.getRenderHeight();
    let newWidth = width;
    let newHeight = newWidth / ratio;
    if (newHeight > height) {
        newHeight = height;
        newWidth = newHeight * ratio;
    }
    const offsetX = Math.max(0, width - newWidth) / 2;
    const offsetY = Math.max(0, height - newHeight) / 2;
    const scene = camera.getScene();
    if (scene.activeCamera !== camera) {
        CreateScreenshotUsingRenderTarget(engine, camera, size, (data) => {
            if (forceDownload) {
                const blob = new Blob([data]);
                Tools.DownloadBlob(blob);
                if (successCallback) {
                    successCallback("");
                }
            }
            else if (successCallback) {
                successCallback(data);
            }
        }, mimeType, 1, engine.getCreationOptions().antialias);
    }
    else {
        engine.onEndFrameObservable.addOnce(() => {
            const renderingCanvas = engine.getRenderingCanvas();
            if (renderContext && renderingCanvas) {
                renderContext.drawImage(renderingCanvas, offsetX, offsetY, newWidth, newHeight);
            }
            if (screenshotCanvas) {
                if (forceDownload) {
                    Tools.EncodeScreenshotCanvasData(screenshotCanvas, undefined, mimeType);
                    if (successCallback) {
                        successCallback("");
                    }
                }
                else {
                    Tools.EncodeScreenshotCanvasData(screenshotCanvas, successCallback, mimeType);
                }
            }
        });
    }
}
/**
 * Captures a screenshot of the current rendering
 * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/renderToPNG
 * @param engine defines the rendering engine
 * @param camera defines the source camera
 * @param size This parameter can be set to a single number or to an object with the
 * following (optional) properties: precision, width, height. If a single number is passed,
 * it will be used for both width and height. If an object is passed, the screenshot size
 * will be derived from the parameters. The precision property is a multiplier allowing
 * rendering at a higher or lower resolution
 * @param mimeType defines the MIME type of the screenshot image (default: image/png).
 * Check your browser for supported MIME types
 * @returns screenshot as a string of base64-encoded characters. This string can be assigned
 * to the src parameter of an <img> to display it
 */
export function CreateScreenshotAsync(engine, camera, size, mimeType = "image/png") {
    return new Promise((resolve, reject) => {
        CreateScreenshot(engine, camera, size, (data) => {
            if (typeof data !== "undefined") {
                resolve(data);
            }
            else {
                reject(new Error("Data is undefined"));
            }
        }, mimeType);
    });
}
/**
 * Captures a screenshot of the current rendering for a specific size. This will render the entire canvas but will generate a blink (due to canvas resize)
 * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/renderToPNG
 * @param engine defines the rendering engine
 * @param camera defines the source camera
 * @param width defines the expected width
 * @param height defines the expected height
 * @param mimeType defines the MIME type of the screenshot image (default: image/png).
 * Check your browser for supported MIME types
 * @returns screenshot as a string of base64-encoded characters. This string can be assigned
 * to the src parameter of an <img> to display it
 */
export function CreateScreenshotWithResizeAsync(engine, camera, width, height, mimeType = "image/png") {
    return new Promise((resolve) => {
        CreateScreenshot(engine, camera, { width: width, height: height }, () => {
            resolve();
        }, mimeType, true);
    });
}
/**
 * Generates an image screenshot from the specified camera.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/renderToPNG
 * @param engine The engine to use for rendering
 * @param camera The camera to use for rendering
 * @param size This parameter can be set to a single number or to an object with the
 * following (optional) properties: precision, width, height. If a single number is passed,
 * it will be used for both width and height. If an object is passed, the screenshot size
 * will be derived from the parameters. The precision property is a multiplier allowing
 * rendering at a higher or lower resolution
 * @param successCallback The callback receives a single parameter which contains the
 * screenshot as a string of base64-encoded characters. This string can be assigned to the
 * src parameter of an <img> to display it
 * @param mimeType The MIME type of the screenshot image (default: image/png).
 * Check your browser for supported MIME types
 * @param samples Texture samples (default: 1)
 * @param antialiasing Whether antialiasing should be turned on or not (default: false)
 * @param fileName A name for for the downloaded file.
 * @param renderSprites Whether the sprites should be rendered or not (default: false)
 * @param enableStencilBuffer Whether the stencil buffer should be enabled or not (default: false)
 * @param useLayerMask if the camera's layer mask should be used to filter what should be rendered (default: true)
 */
export function CreateScreenshotUsingRenderTarget(engine, camera, size, successCallback, mimeType = "image/png", samples = 1, antialiasing = false, fileName, renderSprites = false, enableStencilBuffer = false, useLayerMask = true) {
    const { height, width } = _GetScreenshotSize(engine, camera, size);
    const targetTextureSize = { width, height };
    if (!(height && width)) {
        Logger.Error("Invalid 'size' parameter !");
        return;
    }
    const originalSize = { width: engine.getRenderWidth(), height: engine.getRenderHeight() };
    engine.setSize(width, height); // we need this call to trigger onResizeObservable with the screenshot width/height on all the subsystems that are observing this event and that needs to (re)create some resources with the right dimensions
    const scene = camera.getScene();
    // At this point size can be a number, or an object (according to engine.prototype.createRenderTargetTexture method)
    const texture = new RenderTargetTexture("screenShot", targetTextureSize, scene, false, false, 0, false, Texture.NEAREST_SAMPLINGMODE, undefined, enableStencilBuffer, undefined, undefined, undefined, samples);
    texture.renderList = scene.meshes.slice();
    texture.samples = samples;
    texture.renderSprites = renderSprites;
    texture.activeCamera = camera;
    texture.forceLayerMaskCheck = useLayerMask;
    const renderToTexture = () => {
        engine.onEndFrameObservable.addOnce(() => {
            texture.readPixels(undefined, undefined, undefined, false).then((data) => {
                DumpTools.DumpData(width, height, data, successCallback, mimeType, fileName, true);
                texture.dispose();
            });
        });
        // render the RTT
        scene.incrementRenderId();
        scene.resetCachedMaterial();
        texture.render(true);
        // re-render the scene after the camera has been reset to the original camera to avoid a flicker that could occur
        // if the camera used for the RTT rendering stays in effect for the next frame (and if that camera was different from the original camera)
        scene.incrementRenderId();
        scene.resetCachedMaterial();
        engine.setSize(originalSize.width, originalSize.height);
        camera.getProjectionMatrix(true); // Force cache refresh;
        scene.render();
    };
    if (antialiasing) {
        const fxaaPostProcess = new FxaaPostProcess("antialiasing", 1.0, scene.activeCamera);
        texture.addPostProcess(fxaaPostProcess);
        // Async Shader Compilation can lead to none ready effects in synchronous code
        if (!fxaaPostProcess.getEffect().isReady()) {
            fxaaPostProcess.getEffect().onCompiled = () => {
                renderToTexture();
            };
        }
        // The effect is ready we can render
        else {
            renderToTexture();
        }
    }
    else {
        // No need to wait for extra resources to be ready
        renderToTexture();
    }
}
/**
 * Generates an image screenshot from the specified camera.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/renderToPNG
 * @param engine The engine to use for rendering
 * @param camera The camera to use for rendering
 * @param size This parameter can be set to a single number or to an object with the
 * following (optional) properties: precision, width, height. If a single number is passed,
 * it will be used for both width and height. If an object is passed, the screenshot size
 * will be derived from the parameters. The precision property is a multiplier allowing
 * rendering at a higher or lower resolution
 * @param mimeType The MIME type of the screenshot image (default: image/png).
 * Check your browser for supported MIME types
 * @param samples Texture samples (default: 1)
 * @param antialiasing Whether antialiasing should be turned on or not (default: false)
 * @param fileName A name for for the downloaded file.
 * @param renderSprites Whether the sprites should be rendered or not (default: false)
 * @param enableStencilBuffer Whether the stencil buffer should be enabled or not (default: false)
 * @param useLayerMask if the camera's layer mask should be used to filter what should be rendered (default: true)
 * @returns screenshot as a string of base64-encoded characters. This string can be assigned
 * to the src parameter of an <img> to display it
 */
export function CreateScreenshotUsingRenderTargetAsync(engine, camera, size, mimeType = "image/png", samples = 1, antialiasing = false, fileName, renderSprites = false, enableStencilBuffer = false, useLayerMask = true) {
    return new Promise((resolve, reject) => {
        CreateScreenshotUsingRenderTarget(engine, camera, size, (data) => {
            if (typeof data !== "undefined") {
                resolve(data);
            }
            else {
                reject(new Error("Data is undefined"));
            }
        }, mimeType, samples, antialiasing, fileName, renderSprites, enableStencilBuffer, useLayerMask);
    });
}
/**
 * Gets height and width for screenshot size
 * @param engine
 * @param camera
 * @param size
 * @private
 */
function _GetScreenshotSize(engine, camera, size) {
    let height = 0;
    let width = 0;
    //If a size value defined as object
    if (typeof size === "object") {
        const precision = size.precision
            ? Math.abs(size.precision) // prevent GL_INVALID_VALUE : glViewport: negative width/height
            : 1;
        //If a width and height values is specified
        if (size.width && size.height) {
            height = size.height * precision;
            width = size.width * precision;
        }
        //If passing only width, computing height to keep display canvas ratio.
        else if (size.width && !size.height) {
            width = size.width * precision;
            height = Math.round(width / engine.getAspectRatio(camera));
        }
        //If passing only height, computing width to keep display canvas ratio.
        else if (size.height && !size.width) {
            height = size.height * precision;
            width = Math.round(height * engine.getAspectRatio(camera));
        }
        else {
            width = Math.round(engine.getRenderWidth() * precision);
            height = Math.round(width / engine.getAspectRatio(camera));
        }
    }
    //Assuming here that "size" parameter is a number
    else if (!isNaN(size)) {
        height = size;
        width = size;
    }
    // When creating the image data from the CanvasRenderingContext2D, the width and height is clamped to the size of the _gl context
    // On certain GPUs, it seems as if the _gl context truncates to an integer automatically. Therefore, if a user tries to pass the width of their canvas element
    // and it happens to be a float (1000.5 x 600.5 px), the engine.readPixels will return a different size array than context.createImageData
    // to resolve this, we truncate the floats here to ensure the same size
    if (width) {
        width = Math.floor(width);
    }
    if (height) {
        height = Math.floor(height);
    }
    return { height: height | 0, width: width | 0 };
}
/**
 * Class containing a set of static utilities functions for screenshots
 */
export const ScreenshotTools = {
    /**
     * Captures a screenshot of the current rendering
     * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/renderToPNG
     * @param engine defines the rendering engine
     * @param camera defines the source camera
     * @param size This parameter can be set to a single number or to an object with the
     * following (optional) properties: precision, width, height. If a single number is passed,
     * it will be used for both width and height. If an object is passed, the screenshot size
     * will be derived from the parameters. The precision property is a multiplier allowing
     * rendering at a higher or lower resolution
     * @param successCallback defines the callback receives a single parameter which contains the
     * screenshot as a string of base64-encoded characters. This string can be assigned to the
     * src parameter of an <img> to display it
     * @param mimeType defines the MIME type of the screenshot image (default: image/png).
     * Check your browser for supported MIME types
     * @param forceDownload force the system to download the image even if a successCallback is provided
     */
    CreateScreenshot,
    /**
     * Captures a screenshot of the current rendering
     * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/renderToPNG
     * @param engine defines the rendering engine
     * @param camera defines the source camera
     * @param size This parameter can be set to a single number or to an object with the
     * following (optional) properties: precision, width, height. If a single number is passed,
     * it will be used for both width and height. If an object is passed, the screenshot size
     * will be derived from the parameters. The precision property is a multiplier allowing
     * rendering at a higher or lower resolution
     * @param mimeType defines the MIME type of the screenshot image (default: image/png).
     * Check your browser for supported MIME types
     * @returns screenshot as a string of base64-encoded characters. This string can be assigned
     * to the src parameter of an <img> to display it
     */
    CreateScreenshotAsync,
    /**
     * Captures a screenshot of the current rendering for a specific size. This will render the entire canvas but will generate a blink (due to canvas resize)
     * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/renderToPNG
     * @param engine defines the rendering engine
     * @param camera defines the source camera
     * @param width defines the expected width
     * @param height defines the expected height
     * @param mimeType defines the MIME type of the screenshot image (default: image/png).
     * Check your browser for supported MIME types
     * @returns screenshot as a string of base64-encoded characters. This string can be assigned
     * to the src parameter of an <img> to display it
     */
    CreateScreenshotWithResizeAsync,
    /**
     * Generates an image screenshot from the specified camera.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/renderToPNG
     * @param engine The engine to use for rendering
     * @param camera The camera to use for rendering
     * @param size This parameter can be set to a single number or to an object with the
     * following (optional) properties: precision, width, height. If a single number is passed,
     * it will be used for both width and height. If an object is passed, the screenshot size
     * will be derived from the parameters. The precision property is a multiplier allowing
     * rendering at a higher or lower resolution
     * @param successCallback The callback receives a single parameter which contains the
     * screenshot as a string of base64-encoded characters. This string can be assigned to the
     * src parameter of an <img> to display it
     * @param mimeType The MIME type of the screenshot image (default: image/png).
     * Check your browser for supported MIME types
     * @param samples Texture samples (default: 1)
     * @param antialiasing Whether antialiasing should be turned on or not (default: false)
     * @param fileName A name for for the downloaded file.
     * @param renderSprites Whether the sprites should be rendered or not (default: false)
     * @param enableStencilBuffer Whether the stencil buffer should be enabled or not (default: false)
     */
    CreateScreenshotUsingRenderTarget,
    /**
     * Generates an image screenshot from the specified camera.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/renderToPNG
     * @param engine The engine to use for rendering
     * @param camera The camera to use for rendering
     * @param size This parameter can be set to a single number or to an object with the
     * following (optional) properties: precision, width, height. If a single number is passed,
     * it will be used for both width and height. If an object is passed, the screenshot size
     * will be derived from the parameters. The precision property is a multiplier allowing
     * rendering at a higher or lower resolution
     * @param mimeType The MIME type of the screenshot image (default: image/png).
     * Check your browser for supported MIME types
     * @param samples Texture samples (default: 1)
     * @param antialiasing Whether antialiasing should be turned on or not (default: false)
     * @param fileName A name for for the downloaded file.
     * @param renderSprites Whether the sprites should be rendered or not (default: false)
     * @returns screenshot as a string of base64-encoded characters. This string can be assigned
     * to the src parameter of an <img> to display it
     */
    CreateScreenshotUsingRenderTargetAsync,
};
/**
 * This will be executed automatically for UMD and es5.
 * If esm dev wants the side effects to execute they will have to run it manually
 * Once we build native modules those need to be exported.
 * @internal
 */
const initSideEffects = () => {
    // References the dependencies.
    Tools.CreateScreenshot = CreateScreenshot;
    Tools.CreateScreenshotAsync = CreateScreenshotAsync;
    Tools.CreateScreenshotUsingRenderTarget = CreateScreenshotUsingRenderTarget;
    Tools.CreateScreenshotUsingRenderTargetAsync = CreateScreenshotUsingRenderTargetAsync;
};
initSideEffects();
//# sourceMappingURL=screenshotTools.js.map