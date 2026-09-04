import { type BaseTexture } from "../Materials/Textures/baseTexture.js";
import { type Scene } from "../scene.js";
/**
 * Gets a default environment BRDF for MS-BRDF Height Correlated BRDF
 * @param scene defines the hosting scene
 * @returns the environment BRDF texture
 */
export declare const GetEnvironmentBRDFTexture: (scene: Scene) => BaseTexture;
/**
 * Gets a default environment fuzz BRDF texture
 * @param scene defines the hosting scene
 * @returns the environment fuzz BRDF texture
 */
export declare const GetEnvironmentFuzzBRDFTexture: (scene: Scene) => BaseTexture;
/**
 * Gets the OpenPBR environment BRDF texture (3-channel F82 LUT)
 * @param scene defines the hosting scene
 * @returns the OpenPBR environment BRDF texture
 */
export declare const GetOpenPBREnvironmentBRDFTexture: (scene: Scene) => BaseTexture;
/**
 * Class used to host texture specific utilities
 */
export declare const BRDFTextureTools: {
    /**
     * Gets a default environment BRDF for MS-BRDF Height Correlated BRDF
     * @param scene defines the hosting scene
     * @returns the environment BRDF texture
     */
    GetEnvironmentBRDFTexture: (scene: Scene) => BaseTexture;
    /**
     * Gets a default environment fuzz BRDF texture
     * @param scene defines the hosting scene
     * @returns the environment fuzz BRDF texture
     */
    GetEnvironmentFuzzBRDFTexture: (scene: Scene) => BaseTexture;
    /**
     * Gets the OpenPBR environment BRDF texture (3-channel F82 LUT)
     * @param scene defines the hosting scene
     * @returns the OpenPBR environment BRDF texture
     */
    GetOpenPBREnvironmentBRDFTexture: (scene: Scene) => BaseTexture;
};
