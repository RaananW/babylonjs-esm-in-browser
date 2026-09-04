import { type Scene } from "../../scene.js";
import { Color3 } from "../../Maths/math.color.pure.js";
import { PBRBaseMaterial } from "./pbrBaseMaterial.pure.js";
import { type BaseTexture } from "../../Materials/Textures/baseTexture.js";
import { type Nullable } from "../../types.js";
/**
 * The Physically based simple base material of BJS.
 *
 * This enables better naming and convention enforcements on top of the pbrMaterial.
 * It is used as the base class for both the specGloss and metalRough conventions.
 */
export declare abstract class PBRBaseSimpleMaterial extends PBRBaseMaterial {
    /**
     * Number of Simultaneous lights allowed on the material.
     */
    accessor maxSimultaneousLights: number;
    /**
     * If sets to true, disables all the lights affecting the material.
     */
    accessor disableLighting: boolean;
    /**
     * Environment Texture used in the material (this is use for both reflection and environment lighting).
     */
    accessor environmentTexture: Nullable<BaseTexture>;
    /**
     * If sets to true, x component of normal map value will invert (x = 1.0 - x).
     */
    accessor invertNormalMapX: boolean;
    /**
     * If sets to true, y component of normal map value will invert (y = 1.0 - y).
     */
    accessor invertNormalMapY: boolean;
    /**
     * Normal map used in the model.
     */
    accessor normalTexture: Nullable<BaseTexture>;
    /**
     * Emissivie color used to self-illuminate the model.
     */
    accessor emissiveColor: Color3;
    /**
     * Emissivie texture used to self-illuminate the model.
     */
    accessor emissiveTexture: Nullable<BaseTexture>;
    /**
     * Occlusion Channel Strength.
     */
    accessor occlusionStrength: number;
    /**
     * Occlusion Texture of the material (adding extra occlusion effects).
     */
    accessor occlusionTexture: Nullable<BaseTexture>;
    /**
     * Defines the alpha limits in alpha test mode.
     */
    accessor alphaCutOff: number;
    /**
     * Gets the current double sided mode.
     */
    get doubleSided(): boolean;
    /**
     * If sets to true and backfaceCulling is false, normals will be flipped on the backside.
     */
    set doubleSided(value: boolean);
    /**
     * Stores the pre-calculated light information of a mesh in a texture.
     */
    accessor lightmapTexture: Nullable<BaseTexture>;
    /**
     * If true, the light map contains occlusion information instead of lighting info.
     */
    accessor useLightmapAsShadowmap: boolean;
    /**
     * Instantiates a new PBRMaterial instance.
     *
     * @param name The material name
     * @param scene The scene the material will be use in.
     */
    constructor(name: string, scene?: Scene);
    getClassName(): string;
}
