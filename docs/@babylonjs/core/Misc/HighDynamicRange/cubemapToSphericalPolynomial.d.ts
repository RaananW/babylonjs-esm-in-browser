import { SphericalPolynomial } from "../../Maths/sphericalPolynomial.js";
import { type BaseTexture } from "../../Materials/Textures/baseTexture.js";
import { type Nullable } from "../../types.js";
import { type CubeMapInfo } from "./panoramaToCubemap.js";
/**
 * Helper class dealing with the extraction of spherical polynomial dataArray
 * from a cube map.
 */
export declare class CubeMapToSphericalPolynomialTools {
    private static _FileFaces;
    /** @internal */
    static MAX_HDRI_VALUE: number;
    /** @internal */
    static PRESERVE_CLAMPED_COLORS: boolean;
    /**
     * Clamp a value to the nearest power of two (rounding down).
     * @param value The value to clamp
     * @returns The nearest power of two less than or equal to value
     */
    private static _NearestPow2Floor;
    /**
     * Converts a texture to the according Spherical Polynomial data.
     * This extracts the first 3 orders only as they are the only one used in the lighting.
     *
     * @param texture The texture to extract the information from.
     * @returns The Spherical Polynomial data.
     */
    static ConvertCubeMapTextureToSphericalPolynomial(texture: BaseTexture): Nullable<Promise<SphericalPolynomial>>;
    /**
     * Compute the area on the unit sphere of the rectangle defined by (x,y) and the origin
     * See https://www.rorydriscoll.com/2012/01/15/cubemap-texel-solid-angle/
     * @param x
     * @param y
     * @returns the area
     */
    private static _AreaElement;
    /**
     * Box-filter downsample a single cubemap face.
     * @param data Source face data
     * @param srcSize Source face width/height
     * @param dstSize Target face width/height
     * @param stride Number of components per pixel
     * @returns Downsampled face data
     */
    private static _DownsampleFace;
    /**
     * Converts a cubemap to the according Spherical Polynomial data.
     * This extracts the first 3 orders only as they are the only one used in the lighting.
     *
     * @param cubeInfo The Cube map to extract the information from.
     * @param targetSize Optional target face size for downsampling before integration. 0 = no downsampling (default).
     * @returns The Spherical Polynomial data.
     */
    static ConvertCubeMapToSphericalPolynomial(cubeInfo: CubeMapInfo, targetSize?: number): SphericalPolynomial;
}
