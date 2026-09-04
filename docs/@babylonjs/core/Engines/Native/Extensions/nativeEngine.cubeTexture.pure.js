/** This file must only contain pure code and pure imports */
import { InternalTexture } from "../../../Materials/Textures/internalTexture.js";
import { Texture } from "../../../Materials/Textures/texture.pure.js";
import { CreateRadianceImageDataArrayBufferViews, GetEnvInfo, UploadEnvSpherical } from "../../../Misc/environmentTextureTools.pure.js";
import { SphericalPolynomial } from "../../../Maths/sphericalPolynomial.pure.js";

import { ThinNativeEngine } from "../../thinNativeEngine.pure.js";
let _Registered = false;
/**
 * Register side effects for nativeEngineCubeTexture.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterNativeEngineCubeTexture() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    ThinNativeEngine.prototype.createCubeTexture = function (rootUrl, scene, files, noMipmap, onLoad = null, onError = null, format, forcedExtension = null, createPolynomials = false, lodScale = 0, lodOffset = 0, fallback = null, loaderOptions, useSRGBBuffer = false, buffer = null) {
        const texture = fallback ? fallback : new InternalTexture(this, 7 /* InternalTextureSource.Cube */);
        texture.isCube = true;
        texture.url = rootUrl;
        texture.generateMipMaps = !noMipmap;
        texture._lodGenerationScale = lodScale;
        texture._lodGenerationOffset = lodOffset;
        texture._useSRGBBuffer = this._getUseSRGBBuffer(useSRGBBuffer, !!noMipmap);
        if (!this._doNotHandleContextLost) {
            texture._extension = forcedExtension;
            texture._files = files;
            texture._buffer = buffer;
        }
        const lastDot = rootUrl.lastIndexOf(".");
        const extension = forcedExtension ? forcedExtension : lastDot > -1 ? rootUrl.substring(lastDot).toLowerCase() : "";
        // TODO: use texture loader to load env files?
        if (extension === ".env") {
            const onloaddata = (data) => {
                const info = GetEnvInfo(data);
                texture.width = info.width;
                texture.height = info.width;
                UploadEnvSpherical(texture, info);
                const specularInfo = info.specular;
                if (!specularInfo) {
                    throw new Error(`Nothing else parsed so far`);
                }
                texture._lodGenerationScale = specularInfo.lodGenerationScale;
                const imageData = CreateRadianceImageDataArrayBufferViews(data, info);
                texture.format = 5;
                texture.type = 0;
                texture.generateMipMaps = true;
                texture.getEngine().updateTextureSamplingMode(Texture.TRILINEAR_SAMPLINGMODE, texture);
                texture._isRGBD = true;
                texture.invertY = true;
                this._engine.loadCubeTextureWithMips(texture._hardwareTexture.underlyingResource, imageData, false, texture._useSRGBBuffer, () => {
                    texture.isReady = true;
                    if (onLoad) {
                        onLoad();
                    }
                }, () => {
                    throw new Error("Could not load a native cube texture.");
                });
            };
            if (buffer) {
                onloaddata(buffer);
            }
            else if (files && files.length === 6) {
                throw new Error(`Multi-file loading not allowed on env files.`);
            }
            else {
                const onInternalError = (request, exception) => {
                    if (onError && request) {
                        onError(request.status + " " + request.statusText, exception);
                    }
                };
                this._loadFile(rootUrl, (data) => {
                    onloaddata(new Uint8Array(data, 0, data.byteLength));
                }, undefined, undefined, true, onInternalError);
            }
        }
        else if (files && files.length === 6) {
            // Reorder from [+X, +Y, +Z, -X, -Y, -Z] to [+X, -X, +Y, -Y, +Z, -Z].
            const reorderedFiles = [files[0], files[3], files[1], files[4], files[2], files[5]];
            // eslint-disable-next-line github/no-then
            Promise.all(reorderedFiles.map(async (file) => await this._loadFileAsync(file, undefined, true).then((data) => new Uint8Array(data, 0, data.byteLength))))
                // eslint-disable-next-line github/no-then
                .then(async (data) => {
                return await new Promise((resolve, reject) => {
                    this._engine.loadCubeTexture(texture._hardwareTexture.underlyingResource, data, !noMipmap, true, texture._useSRGBBuffer, () => resolve(), () => reject(new Error("Native engine failed to load the cubemap faces")));
                });
            })
                // eslint-disable-next-line github/no-then
                .then(() => {
                texture.isReady = true;
                if (onLoad) {
                    onLoad();
                }
            }, (error) => {
                if (onError) {
                    onError(`Failed to load cubemap: ${error?.message ?? String(error)}`, error);
                }
            });
        }
        else if (!files || files.length <= 1) {
            // Self-contained single-file cubemap container (.dds / .ktx / .ktx2) that already holds
            // all six faces (and their prefiltered mip chain). Load the single buffer and hand it to
            // the native engine, which parses the container directly and returns the diffuse spherical
            // harmonics (as a 27-float SphericalPolynomial) so PBR irradiance matches the web engines.
            const singleUrl = files && files.length > 0 ? files[0] : rootUrl;
            this._loadFileAsync(singleUrl, undefined, true)
                // eslint-disable-next-line github/no-then
                .then(async (data) => {
                const buffer = new Uint8Array(data, 0, data.byteLength);
                return await new Promise((resolve, reject) => {
                    this._engine.loadCubeTexture(texture._hardwareTexture.underlyingResource, [buffer], !noMipmap, false, texture._useSRGBBuffer, (sphericalPolynomial) => {
                        if (createPolynomials && sphericalPolynomial && sphericalPolynomial.length >= 27) {
                            const sp = new SphericalPolynomial();
                            sp.x.copyFromFloats(sphericalPolynomial[0], sphericalPolynomial[1], sphericalPolynomial[2]);
                            sp.y.copyFromFloats(sphericalPolynomial[3], sphericalPolynomial[4], sphericalPolynomial[5]);
                            sp.z.copyFromFloats(sphericalPolynomial[6], sphericalPolynomial[7], sphericalPolynomial[8]);
                            sp.xx.copyFromFloats(sphericalPolynomial[9], sphericalPolynomial[10], sphericalPolynomial[11]);
                            sp.yy.copyFromFloats(sphericalPolynomial[12], sphericalPolynomial[13], sphericalPolynomial[14]);
                            sp.zz.copyFromFloats(sphericalPolynomial[15], sphericalPolynomial[16], sphericalPolynomial[17]);
                            sp.yz.copyFromFloats(sphericalPolynomial[18], sphericalPolynomial[19], sphericalPolynomial[20]);
                            sp.zx.copyFromFloats(sphericalPolynomial[21], sphericalPolynomial[22], sphericalPolynomial[23]);
                            sp.xy.copyFromFloats(sphericalPolynomial[24], sphericalPolynomial[25], sphericalPolynomial[26]);
                            texture._sphericalPolynomial = sp;
                        }
                        resolve();
                    }, () => reject(new Error(`Native engine failed to parse the cubemap container '${singleUrl}'`)));
                });
            })
                // eslint-disable-next-line github/no-then
                .then(() => {
                texture.isReady = true;
                if (onLoad) {
                    onLoad();
                }
            }, (error) => {
                if (onError) {
                    onError(`Failed to load cubemap: ${error?.message ?? String(error)}`, error);
                }
            });
        }
        else {
            throw new Error("Cannot load cubemap because 6 files were not defined");
        }
        this._internalTexturesCache.push(texture);
        return texture;
    };
}
//# sourceMappingURL=nativeEngine.cubeTexture.pure.js.map