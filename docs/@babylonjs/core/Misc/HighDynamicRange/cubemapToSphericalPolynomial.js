import { Vector3 } from "../../Maths/math.vector.pure.js";
import { Clamp } from "../../Maths/math.scalar.functions.js";
import { SphericalPolynomial, SphericalHarmonics } from "../../Maths/sphericalPolynomial.js";

import { ToLinearSpace } from "../../Maths/math.constants.js";
import { Color3 } from "../../Maths/math.color.pure.js";
class FileFaceOrientation {
    constructor(name, worldAxisForNormal, worldAxisForFileX, worldAxisForFileY) {
        this.name = name;
        this.worldAxisForNormal = worldAxisForNormal;
        this.worldAxisForFileX = worldAxisForFileX;
        this.worldAxisForFileY = worldAxisForFileY;
    }
}
/**
 * Helper class dealing with the extraction of spherical polynomial dataArray
 * from a cube map.
 */
export class CubeMapToSphericalPolynomialTools {
    /**
     * Clamp a value to the nearest power of two (rounding down).
     * @param value The value to clamp
     * @returns The nearest power of two less than or equal to value
     */
    static _NearestPow2Floor(value) {
        // Ensure minimum of 1
        if (value <= 1) {
            return 1;
        }
        return 1 << Math.floor(Math.log2(value));
    }
    /**
     * Converts a texture to the according Spherical Polynomial data.
     * This extracts the first 3 orders only as they are the only one used in the lighting.
     *
     * @param texture The texture to extract the information from.
     * @returns The Spherical Polynomial data.
     */
    static ConvertCubeMapTextureToSphericalPolynomial(texture) {
        if (!texture.isCube) {
            // Only supports cube Textures currently.
            return null;
        }
        texture.getScene()?.getEngine().flushFramebuffer();
        const size = texture.getSize().width;
        const rawTargetSize = texture._sphericalPolynomialTargetSize;
        const targetSize = rawTargetSize > 0 ? this._NearestPow2Floor(rawTargetSize) : 0;
        const hasMipmaps = !texture.noMipmap && texture._texture?.generateMipMaps === true;
        const useMip = targetSize > 0 && targetSize < size && hasMipmaps;
        const mipLevel = useMip ? Math.max(0, Math.round(Math.log2(size / targetSize))) : 0;
        const mipSize = useMip ? Math.max(1, Math.floor(size / Math.pow(2, mipLevel))) : size;
        const rightPromise = texture.readPixels(0, mipLevel, undefined, false);
        const leftPromise = texture.readPixels(1, mipLevel, undefined, false);
        let upPromise;
        let downPromise;
        if (texture.isRenderTarget) {
            upPromise = texture.readPixels(3, mipLevel, undefined, false);
            downPromise = texture.readPixels(2, mipLevel, undefined, false);
        }
        else {
            upPromise = texture.readPixels(2, mipLevel, undefined, false);
            downPromise = texture.readPixels(3, mipLevel, undefined, false);
        }
        const frontPromise = texture.readPixels(4, mipLevel, undefined, false);
        const backPromise = texture.readPixels(5, mipLevel, undefined, false);
        const gammaSpace = texture.gammaSpace;
        // Always read as RGBA.
        const format = 5;
        const needsCpuDownsample = targetSize > 0 && targetSize < size && !useMip;
        return new Promise((resolve) => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises, github/no-then
            Promise.all([leftPromise, rightPromise, upPromise, downPromise, frontPromise, backPromise]).then(([left, right, up, down, front, back]) => {
                let effectiveSize = mipSize;
                if (needsCpuDownsample) {
                    const stride = 4; // RGBA
                    left = this._DownsampleFace(left, size, targetSize, stride);
                    right = this._DownsampleFace(right, size, targetSize, stride);
                    up = this._DownsampleFace(up, size, targetSize, stride);
                    down = this._DownsampleFace(down, size, targetSize, stride);
                    front = this._DownsampleFace(front, size, targetSize, stride);
                    back = this._DownsampleFace(back, size, targetSize, stride);
                    effectiveSize = targetSize;
                }
                const cubeInfo = {
                    size: effectiveSize,
                    right,
                    left,
                    up,
                    down,
                    front,
                    back,
                    format,
                    type: left instanceof Float32Array ? 1 : 0,
                    gammaSpace,
                };
                resolve(this.ConvertCubeMapToSphericalPolynomial(cubeInfo));
            });
        });
    }
    /**
     * Compute the area on the unit sphere of the rectangle defined by (x,y) and the origin
     * See https://www.rorydriscoll.com/2012/01/15/cubemap-texel-solid-angle/
     * @param x
     * @param y
     * @returns the area
     */
    static _AreaElement(x, y) {
        return Math.atan2(x * y, Math.sqrt(x * x + y * y + 1));
    }
    /**
     * Box-filter downsample a single cubemap face.
     * @param data Source face data
     * @param srcSize Source face width/height
     * @param dstSize Target face width/height
     * @param stride Number of components per pixel
     * @returns Downsampled face data
     */
    static _DownsampleFace(data, srcSize, dstSize, stride) {
        // Build a Float32Array view over the source for uniform accumulation.
        // Float32Array: use directly. Any integer typed array: convert element values.
        const src = data instanceof Float32Array ? data : Float32Array.from(data);
        const dstLength = dstSize * dstSize * stride;
        const avg = new Float32Array(dstLength);
        const blockSize = srcSize / dstSize;
        const invArea = 1.0 / (blockSize * blockSize);
        for (let dy = 0; dy < dstSize; dy++) {
            const sy0 = Math.floor(dy * blockSize);
            const sy1 = Math.floor((dy + 1) * blockSize);
            for (let dx = 0; dx < dstSize; dx++) {
                const sx0 = Math.floor(dx * blockSize);
                const sx1 = Math.floor((dx + 1) * blockSize);
                const dstIdx = (dy * dstSize + dx) * stride;
                for (let c = 0; c < stride; c++) {
                    let sum = 0;
                    for (let sy = sy0; sy < sy1; sy++) {
                        for (let sx = sx0; sx < sx1; sx++) {
                            sum += src[(sy * srcSize + sx) * stride + c];
                        }
                    }
                    avg[dstIdx + c] = sum * invArea;
                }
            }
        }
        // Return the same typed-array kind as the input so downstream type
        // detection (Float32Array vs UNSIGNED_BYTE) keeps working.
        if (data instanceof Float32Array) {
            return avg;
        }
        // Integer path: round back into the original array type.
        const ctor = data.constructor;
        const dst = new ctor(dstLength);
        for (let i = 0; i < dstLength; i++) {
            dst[i] = (avg[i] + 0.5) | 0;
        }
        return dst;
    }
    /**
     * Converts a cubemap to the according Spherical Polynomial data.
     * This extracts the first 3 orders only as they are the only one used in the lighting.
     *
     * @param cubeInfo The Cube map to extract the information from.
     * @param targetSize Optional target face size for downsampling before integration. 0 = no downsampling (default).
     * @returns The Spherical Polynomial data.
     */
    static ConvertCubeMapToSphericalPolynomial(cubeInfo, targetSize = 0) {
        // Clamp target to power of two and downsample faces if requested
        const effectiveTarget = targetSize > 0 ? this._NearestPow2Floor(targetSize) : 0;
        if (effectiveTarget > 0 && cubeInfo.size > effectiveTarget) {
            const stride = cubeInfo.format === 5 ? 4 : 3;
            const faces = ["right", "left", "up", "down", "front", "back"];
            const downsampled = {};
            for (const face of faces) {
                downsampled[face] = this._DownsampleFace(cubeInfo[face], cubeInfo.size, effectiveTarget, stride);
            }
            cubeInfo = { ...cubeInfo, ...downsampled, size: effectiveTarget };
        }
        const sphericalHarmonics = new SphericalHarmonics();
        let totalSolidAngle = 0.0;
        // The (u,v) range is [-1,+1], so the distance between each texel is 2/Size.
        const du = 2.0 / cubeInfo.size;
        const dv = du;
        const halfTexel = 0.5 * du;
        // The (u,v) of the first texel is half a texel from the corner (-1,-1).
        const minUV = halfTexel - 1.0;
        for (let faceIndex = 0; faceIndex < 6; faceIndex++) {
            const fileFace = this._FileFaces[faceIndex];
            const dataArray = cubeInfo[fileFace.name];
            let v = minUV;
            // TODO: we could perform the summation directly into a SphericalPolynomial (SP), which is more efficient than SphericalHarmonic (SH).
            // This is possible because during the summation we do not need the SH-specific properties, e.g. orthogonality.
            // Because SP is still linear, so summation is fine in that basis.
            const stride = cubeInfo.format === 5 ? 4 : 3;
            for (let y = 0; y < cubeInfo.size; y++) {
                let u = minUV;
                for (let x = 0; x < cubeInfo.size; x++) {
                    // World direction (not normalised)
                    const worldDirection = fileFace.worldAxisForFileX.scale(u).add(fileFace.worldAxisForFileY.scale(v)).add(fileFace.worldAxisForNormal);
                    worldDirection.normalize();
                    const deltaSolidAngle = this._AreaElement(u - halfTexel, v - halfTexel) -
                        this._AreaElement(u - halfTexel, v + halfTexel) -
                        this._AreaElement(u + halfTexel, v - halfTexel) +
                        this._AreaElement(u + halfTexel, v + halfTexel);
                    let r = dataArray[y * cubeInfo.size * stride + x * stride + 0];
                    let g = dataArray[y * cubeInfo.size * stride + x * stride + 1];
                    let b = dataArray[y * cubeInfo.size * stride + x * stride + 2];
                    // Prevent NaN harmonics with extreme HDRI data.
                    if (isNaN(r)) {
                        r = 0;
                    }
                    if (isNaN(g)) {
                        g = 0;
                    }
                    if (isNaN(b)) {
                        b = 0;
                    }
                    // Handle Integer types.
                    if (cubeInfo.type === 0) {
                        r /= 255;
                        g /= 255;
                        b /= 255;
                    }
                    // Handle Gamma space textures.
                    if (cubeInfo.gammaSpace) {
                        r = Math.pow(Clamp(r), ToLinearSpace);
                        g = Math.pow(Clamp(g), ToLinearSpace);
                        b = Math.pow(Clamp(b), ToLinearSpace);
                    }
                    // Prevent to explode in case of really high dynamic ranges.
                    // sh 3 would not be enough to accurately represent it.
                    const max = this.MAX_HDRI_VALUE;
                    if (this.PRESERVE_CLAMPED_COLORS) {
                        const currentMax = Math.max(r, g, b);
                        if (currentMax > max) {
                            const factor = max / currentMax;
                            r *= factor;
                            g *= factor;
                            b *= factor;
                        }
                    }
                    else {
                        r = Clamp(r, 0, max);
                        g = Clamp(g, 0, max);
                        b = Clamp(b, 0, max);
                    }
                    const color = new Color3(r, g, b);
                    sphericalHarmonics.addLight(worldDirection, color, deltaSolidAngle);
                    totalSolidAngle += deltaSolidAngle;
                    u += du;
                }
                v += dv;
            }
        }
        // Solid angle for entire sphere is 4*pi
        const sphereSolidAngle = 4.0 * Math.PI;
        // Adjust the solid angle to allow for how many faces we processed.
        const facesProcessed = 6.0;
        const expectedSolidAngle = (sphereSolidAngle * facesProcessed) / 6.0;
        // Adjust the harmonics so that the accumulated solid angle matches the expected solid angle.
        // This is needed because the numerical integration over the cube uses a
        // small angle approximation of solid angle for each texel (see deltaSolidAngle),
        // and also to compensate for accumulative error due to float precision in the summation.
        const correctionFactor = expectedSolidAngle / totalSolidAngle;
        sphericalHarmonics.scaleInPlace(correctionFactor);
        sphericalHarmonics.convertIncidentRadianceToIrradiance();
        sphericalHarmonics.convertIrradianceToLambertianRadiance();
        return SphericalPolynomial.FromHarmonics(sphericalHarmonics);
    }
}
CubeMapToSphericalPolynomialTools._FileFaces = [
    new FileFaceOrientation("right", new Vector3(1, 0, 0), new Vector3(0, 0, -1), new Vector3(0, -1, 0)), // +X east
    new FileFaceOrientation("left", new Vector3(-1, 0, 0), new Vector3(0, 0, 1), new Vector3(0, -1, 0)), // -X west
    new FileFaceOrientation("up", new Vector3(0, 1, 0), new Vector3(1, 0, 0), new Vector3(0, 0, 1)), // +Y north
    new FileFaceOrientation("down", new Vector3(0, -1, 0), new Vector3(1, 0, 0), new Vector3(0, 0, -1)), // -Y south
    new FileFaceOrientation("front", new Vector3(0, 0, 1), new Vector3(1, 0, 0), new Vector3(0, -1, 0)), // +Z top
    new FileFaceOrientation("back", new Vector3(0, 0, -1), new Vector3(-1, 0, 0), new Vector3(0, -1, 0)), // -Z bottom
];
/** @internal */
CubeMapToSphericalPolynomialTools.MAX_HDRI_VALUE = 4096;
/** @internal */
CubeMapToSphericalPolynomialTools.PRESERVE_CLAMPED_COLORS = false;
//# sourceMappingURL=cubemapToSphericalPolynomial.js.map