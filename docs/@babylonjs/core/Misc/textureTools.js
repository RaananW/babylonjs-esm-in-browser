import { Texture } from "../Materials/Textures/texture.pure.js";
import { RenderTargetTexture } from "../Materials/Textures/renderTargetTexture.pure.js";
import { PassPostProcess } from "../PostProcesses/passPostProcess.pure.js";

import { PostProcess } from "../PostProcesses/postProcess.pure.js";
import { Clamp } from "../Maths/math.scalar.functions.js";
import { FromHalfFloat, ToHalfFloat } from "./halfFloat.js";
export { FromHalfFloat, ToHalfFloat };
/**
 * Uses the GPU to create a copy texture rescaled at a given size
 * @param texture Texture to copy from
 * @param width defines the desired width
 * @param height defines the desired height
 * @param useBilinearMode defines if bilinear mode has to be used
 * @returns the generated texture
 */
export function CreateResizedCopy(texture, width, height, useBilinearMode = true) {
    const scene = texture.getScene();
    const engine = scene.getEngine();
    const rtt = new RenderTargetTexture("resized" + texture.name, { width: width, height: height }, scene, !texture.noMipmap, true, texture._texture.type, false, texture.samplingMode, false);
    rtt.wrapU = texture.wrapU;
    rtt.wrapV = texture.wrapV;
    rtt.uOffset = texture.uOffset;
    rtt.vOffset = texture.vOffset;
    rtt.uScale = texture.uScale;
    rtt.vScale = texture.vScale;
    rtt.uAng = texture.uAng;
    rtt.vAng = texture.vAng;
    rtt.wAng = texture.wAng;
    rtt.coordinatesIndex = texture.coordinatesIndex;
    rtt.level = texture.level;
    rtt.anisotropicFilteringLevel = texture.anisotropicFilteringLevel;
    rtt._texture.isReady = false;
    texture.wrapU = Texture.CLAMP_ADDRESSMODE;
    texture.wrapV = Texture.CLAMP_ADDRESSMODE;
    const passPostProcess = new PassPostProcess("pass", 1, null, useBilinearMode ? Texture.BILINEAR_SAMPLINGMODE : Texture.NEAREST_SAMPLINGMODE, engine, false, 0);
    passPostProcess.externalTextureSamplerBinding = true;
    passPostProcess.onEffectCreatedObservable.addOnce((e) => {
        e.executeWhenCompiled(() => {
            passPostProcess.onApply = function (effect) {
                effect.setTexture("textureSampler", texture);
            };
            const internalTexture = rtt.renderTarget;
            if (internalTexture) {
                scene.postProcessManager.directRender([passPostProcess], internalTexture);
                engine.unBindFramebuffer(internalTexture);
                rtt.disposeFramebufferObjects();
                passPostProcess.dispose();
                rtt.getInternalTexture().isReady = true;
            }
        });
    });
    return rtt;
}
/**
 * Apply a post process to a texture
 * @param postProcessName name of the fragment post process
 * @param internalTexture the texture to encode
 * @param scene the scene hosting the texture
 * @param type type of the output texture. If not provided, use the one from internalTexture
 * @param samplingMode sampling mode to use to sample the source texture. If not provided, use the one from internalTexture
 * @param format format of the output texture. If not provided, use the one from internalTexture
 * @param width width of the output texture. If not provided, use the one from internalTexture
 * @param height height of the output texture. If not provided, use the one from internalTexture
 * @returns a promise with the internalTexture having its texture replaced by the result of the processing
 */
// eslint-disable-next-line @typescript-eslint/promise-function-async
export function ApplyPostProcess(postProcessName, internalTexture, scene, type, samplingMode, format, width, height) {
    // Gets everything ready.
    const engine = internalTexture.getEngine();
    internalTexture.isReady = false;
    samplingMode = samplingMode ?? internalTexture.samplingMode;
    type = type ?? internalTexture.type;
    format = format ?? internalTexture.format;
    width = width ?? internalTexture.width;
    height = height ?? internalTexture.height;
    if (type === -1) {
        type = 0;
    }
    return new Promise((resolve) => {
        // Create the post process
        const postProcess = new PostProcess("postprocess", postProcessName, null, null, 1, null, samplingMode, engine, false, undefined, type, undefined, null, false, format);
        postProcess.externalTextureSamplerBinding = true;
        // Hold the output of the decoding.
        const encodedTexture = engine.createRenderTargetTexture({ width: width, height: height }, {
            generateDepthBuffer: false,
            generateMipMaps: false,
            generateStencilBuffer: false,
            samplingMode,
            type,
            format,
        });
        postProcess.onEffectCreatedObservable.addOnce((e) => {
            e.executeWhenCompiled(() => {
                // PP Render Pass
                postProcess.onApply = (effect) => {
                    effect._bindTexture("textureSampler", internalTexture);
                    effect.setFloat2("scale", 1, 1);
                };
                scene.postProcessManager.directRender([postProcess], encodedTexture, true);
                // Cleanup
                engine.restoreDefaultFramebuffer();
                engine._releaseTexture(internalTexture);
                if (postProcess) {
                    postProcess.dispose();
                }
                // Internal Swap
                encodedTexture._swapAndDie(internalTexture);
                // Ready to get rolling again.
                internalTexture.type = type;
                internalTexture.format = 5;
                internalTexture.isReady = true;
                resolve(internalTexture);
            });
        });
    });
}
function IsCompressedTextureFormat(format) {
    switch (format) {
        case 36492:
        case 36493:
        case 36495:
        case 36494:
        case 33779:
        case 35919:
        case 33778:
        case 35918:
        case 33777:
        case 33776:
        case 35917:
        case 35916:
        case 37808:
        case 37809:
        case 37810:
        case 37811:
        case 37812:
        case 37813:
        case 37814:
        case 37815:
        case 37816:
        case 37817:
        case 37818:
        case 37819:
        case 37820:
        case 37821:
        case 37840:
        case 37841:
        case 37842:
        case 37843:
        case 37844:
        case 37845:
        case 37846:
        case 37847:
        case 37848:
        case 37849:
        case 37850:
        case 37851:
        case 37852:
        case 37853:
        case 36196:
        case 37492:
        case 37493:
        case 37494:
        case 37495:
        case 37496:
        case 37497:
            return true;
        default:
            return false;
    }
}
/**
 * Waits for when the given texture is ready to be used (downloaded, converted, mip mapped...)
 * @param texture the texture to wait for
 * @returns a promise that resolves when the texture is ready
 */
export async function WhenTextureReadyAsync(texture) {
    if (texture.isReady()) {
        return;
    }
    if (texture.loadingError) {
        throw new Error(texture.errorObject?.message || `Texture ${texture.name} errored while loading.`);
    }
    const onLoadObservable = texture.onLoadObservable;
    if (onLoadObservable) {
        return await new Promise((res) => onLoadObservable.addOnce(() => res()));
    }
    const onLoadedObservable = texture._texture?.onLoadedObservable;
    if (onLoadedObservable) {
        return await new Promise((res) => onLoadedObservable.addOnce(() => res()));
    }
    throw new Error(`Cannot determine readiness of texture ${texture.name}.`);
}
/**
 * Gets the data of the specified texture by rendering it to an intermediate RGBA texture and retrieving the bytes from it.
 * This is convienent to get 8-bit RGBA values for a texture in a GPU compressed format, which cannot be read using readPixels.
 * @internal
 */
async function ReadPixelsUsingRTT(texture, width, height, face, lod, slice = 0) {
    const scene = texture.getScene();
    const engine = scene.getEngine();
    const sourceInternalTexture = texture.getInternalTexture();
    const is3DTexture = texture.is3D || !!sourceInternalTexture?.is3D;
    if (!engine.isWebGPU) {
        if (is3DTexture) {
            await import("../Shaders/lod3D.fragment.js");
        }
        else if (texture.isCube) {
            await import("../Shaders/lodCube.fragment.js");
        }
        else {
            await import("../Shaders/lod.fragment.js");
        }
    }
    else {
        if (is3DTexture) {
            await import("../ShadersWGSL/lod3D.fragment.js");
        }
        else if (texture.isCube) {
            await import("../ShadersWGSL/lodCube.fragment.js");
        }
        else {
            await import("../ShadersWGSL/lod.fragment.js");
        }
    }
    let lodPostProcess;
    if (is3DTexture) {
        lodPostProcess = new PostProcess("lod3D", "lod3D", {
            uniforms: ["lod", "gamma", "slice"],
            samplingMode: Texture.NEAREST_NEAREST_MIPNEAREST,
            engine,
            shaderLanguage: engine.isWebGPU ? 1 /* ShaderLanguage.WGSL */ : 0 /* ShaderLanguage.GLSL */,
        });
    }
    else if (!texture.isCube) {
        lodPostProcess = new PostProcess("lod", "lod", {
            uniforms: ["lod", "gamma"],
            samplingMode: Texture.NEAREST_NEAREST_MIPNEAREST,
            engine,
            shaderLanguage: engine.isWebGPU ? 1 /* ShaderLanguage.WGSL */ : 0 /* ShaderLanguage.GLSL */,
        });
    }
    else {
        const faceDefines = ["#define POSITIVEX", "#define NEGATIVEX", "#define POSITIVEY", "#define NEGATIVEY", "#define POSITIVEZ", "#define NEGATIVEZ"];
        lodPostProcess = new PostProcess("lodCube", "lodCube", {
            uniforms: ["lod", "gamma"],
            samplingMode: Texture.NEAREST_NEAREST_MIPNEAREST,
            engine,
            defines: faceDefines[face],
            shaderLanguage: engine.isWebGPU ? 1 /* ShaderLanguage.WGSL */ : 0 /* ShaderLanguage.GLSL */,
        });
    }
    await new Promise((resolve) => {
        lodPostProcess.onEffectCreatedObservable.addOnce((e) => {
            e.executeWhenCompiled(() => {
                resolve(0);
            });
        });
    });
    const rtt = new RenderTargetTexture("temp", { width: width, height: height }, scene, false);
    lodPostProcess.onApply = function (effect) {
        effect.setTexture("textureSampler", texture);
        effect.setFloat("lod", lod);
        effect.setInt("gamma", texture.gammaSpace ? 1 : 0);
        if (is3DTexture) {
            effect.setFloat("slice", slice);
        }
    };
    try {
        if (rtt.renderTarget && sourceInternalTexture) {
            const samplingMode = sourceInternalTexture.samplingMode;
            if (lod !== 0) {
                texture.updateSamplingMode(Texture.NEAREST_NEAREST_MIPNEAREST);
            }
            else {
                texture.updateSamplingMode(Texture.NEAREST_NEAREST);
            }
            scene.postProcessManager.directRender([lodPostProcess], rtt.renderTarget, true);
            texture.updateSamplingMode(samplingMode);
            //Reading datas from WebGL
            const bufferView = await engine.readPixels(0, 0, width, height);
            const data = new Uint8Array(bufferView.buffer, bufferView.byteOffset, bufferView.byteLength);
            // Unbind
            engine.unBindFramebuffer(rtt.renderTarget);
            return data;
        }
        else {
            throw Error("Render to texture failed.");
        }
    }
    finally {
        rtt.dispose();
        lodPostProcess.dispose();
    }
}
/**
 * Gets the pixel data of the specified texture, either by reading it directly
 * or by rendering it to an intermediate RGBA texture and retrieving the bytes from it.
 * This is convenient to get 8-bit RGBA values for a texture in a GPU compressed format.
 * When direct readback returns non-RGBA channel layouts, the result is normalized to RGBA8.
 * @param texture the source texture
 * @param width the target width of the result, which does not have to match the source texture width
 * @param height the target height of the result, which does not have to match the source texture height
 * @param face if the texture has multiple faces, the face index to use for the source
 * @param lod if the texture has multiple LODs, the lod index to use for the source
 * @param forceRTT if true, forces the use of the RTT path for reading pixels (useful for cube maps to ensure correct orientation and gamma)
 * @param slice if the texture is 3D, the depth slice index to use for the source
 * @returns the 8-bit texture data
 */
export async function GetTextureDataAsync(texture, width, height, face = 0, lod = 0, forceRTT = false, slice = 0) {
    await WhenTextureReadyAsync(texture);
    const internalTexture = texture.getInternalTexture();
    const is3DTexture = texture.is3D || !!internalTexture?.is3D;
    const { width: textureWidth, height: textureHeight } = texture.getSize();
    const targetWidth = width ?? textureWidth;
    const targetHeight = height ?? textureHeight;
    // If the internal texture format is compressed, we cannot read the pixels directly.
    // If we're resizing the texture, we need to use a render target texture.
    // forceRTT can be used to ensure correct orientation and gamma for cube maps.
    // 3D textures must also use RTT because direct readPixels does not expose slice selection.
    if (forceRTT || is3DTexture || IsCompressedTextureFormat(texture.textureFormat) || targetWidth !== textureWidth || targetHeight !== textureHeight) {
        if (texture.is2DArray) {
            throw new Error(`Reading pixels from 2D array textures with ${forceRTT ? "RTT" : "compression"} is not supported.`);
        }
        return await ReadPixelsUsingRTT(texture, targetWidth, targetHeight, face, lod, slice);
    }
    let data = (await texture.readPixels(face, lod));
    if (!data) {
        throw new Error(`Failed to read pixels from texture ${texture.name}.`);
    }
    // Convert float RGBA values to uint8, if necessary.
    if (data instanceof Float32Array) {
        const data2 = new Uint8Array(data.length);
        let n = data.length;
        while (n--) {
            const v = data[n];
            data2[n] = Math.round(Clamp(v) * 255);
        }
        data = data2;
    }
    // Some backends (notably WebGPU for single/dual/triple channel formats) can return
    // readback data that is not RGBA8. The inspector preview pipeline expects 4 bytes
    // per pixel, so normalize to RGBA here when needed.
    const pixelCount = targetWidth * targetHeight;
    const expectedLength = pixelCount * 4;
    if (data.length !== expectedLength) {
        const componentCount = pixelCount === 0 ? 0 : data.length / pixelCount;
        if (componentCount === 1 || componentCount === 2 || componentCount === 3) {
            const normalizedData = new Uint8Array(expectedLength);
            for (let pixel = 0, src = 0, dst = 0; pixel < pixelCount; pixel++, dst += 4) {
                const c0 = data[src++];
                if (componentCount === 1) {
                    // Luminance/R-style data: replicate to RGB and use opaque alpha.
                    normalizedData[dst] = c0;
                    normalizedData[dst + 1] = c0;
                    normalizedData[dst + 2] = c0;
                    normalizedData[dst + 3] = 255;
                    continue;
                }
                const c1 = data[src++];
                if (componentCount === 2) {
                    // Two-channel data has no standard blue/alpha semantics for preview,
                    // so preserve R/G, clear B, and force opaque alpha.
                    normalizedData[dst] = c0;
                    normalizedData[dst + 1] = c1;
                    normalizedData[dst + 2] = 0;
                    normalizedData[dst + 3] = 255;
                    continue;
                }
                // RGB data: append an opaque alpha channel.
                normalizedData[dst] = c0;
                normalizedData[dst + 1] = c1;
                normalizedData[dst + 2] = data[src++];
                normalizedData[dst + 3] = 255;
            }
            return normalizedData;
        }
    }
    return data;
}
/**
 * Class used to host texture specific utilities
 */
export const TextureTools = {
    /**
     * Uses the GPU to create a copy texture rescaled at a given size
     * @param texture Texture to copy from
     * @param width defines the desired width
     * @param height defines the desired height
     * @param useBilinearMode defines if bilinear mode has to be used
     * @returns the generated texture
     */
    CreateResizedCopy,
    /**
     * Apply a post process to a texture
     * @param postProcessName name of the fragment post process
     * @param internalTexture the texture to encode
     * @param scene the scene hosting the texture
     * @param type type of the output texture. If not provided, use the one from internalTexture
     * @param samplingMode sampling mode to use to sample the source texture. If not provided, use the one from internalTexture
     * @param format format of the output texture. If not provided, use the one from internalTexture
     * @returns a promise with the internalTexture having its texture replaced by the result of the processing
     */
    ApplyPostProcess,
    /**
     * Converts a number to half float
     * @param value number to convert
     * @returns converted number
     */
    ToHalfFloat,
    /**
     * Converts a half float to a number
     * @param value half float to convert
     * @returns converted half float
     */
    FromHalfFloat,
    /**
     * Gets the data of the specified texture by rendering it to an intermediate RGBA texture and retrieving the bytes from it.
     * This is convienent to get 8-bit RGBA values for a texture in a GPU compressed format.
     * @param texture the source texture
     * @param width the width of the result, which does not have to match the source texture width
     * @param height the height of the result, which does not have to match the source texture height
     * @param face if the texture has multiple faces, the face index to use for the source
     * @param lod if the texture has multiple LODs, the lod index to use for the source
     * @returns the 8-bit texture data
     */
    GetTextureDataAsync,
};
//# sourceMappingURL=textureTools.js.map