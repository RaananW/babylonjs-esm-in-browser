/** This file must only contain pure code and pure imports */
import { Vector3 } from "../Maths/math.vector.pure.js";
import { Light } from "./light.js";
import { type Effect } from "../Materials/effect.pure.js";
import { type Scene } from "../scene.pure.js";
import { AreaLight } from "./areaLight.pure.js";
import { type Nullable } from "../types.js";
import { type BaseTexture } from "../Materials/Textures/baseTexture.pure.js";
/**
 * A rectangular area light defined by an unique point in world space, a width and a height.
 * The light is emitted from the rectangular area in the -Z direction.
 */
export declare class RectAreaLight extends AreaLight {
    private readonly _width;
    private readonly _height;
    protected readonly _pointTransformedPosition: Vector3;
    protected readonly _pointTransformedWidth: Vector3;
    protected readonly _pointTransformedHeight: Vector3;
    private _emissionTextureTexture;
    /**
     * Gets Rect Area Light emission texture. (Note: This texture needs pre-processing! Use AreaLightTextureTools to pre-process the texture).
     */
    get emissionTexture(): Nullable<BaseTexture>;
    /**
     * Sets Rect Area Light emission texture. (Note: This texture needs pre-processing! Use AreaLightTextureTools to pre-process the texture).
     */
    set emissionTexture(value: Nullable<BaseTexture>);
    /**
     * Rect Area Light width.
     */
    get width(): number;
    /**
     * Rect Area Light width.
     */
    set width(value: number);
    /**
     * Rect Area Light height.
     */
    get height(): number;
    /**
     * Rect Area Light height.
     */
    set height(value: number);
    /**
     * Creates a rectangular area light object.
     * Documentation : https://doc.babylonjs.com/features/featuresDeepDive/lights/lights_introduction
     * @param name The friendly name of the light
     * @param position The position of the area light.
     * @param width The width of the area light.
     * @param height The height of the area light.
     * @param scene The scene the light belongs to
     * @param dontAddToScene True to not add the light to the scene
     */
    constructor(name: string, position: Vector3, width: number, height: number, scene?: Scene, dontAddToScene?: boolean);
    /**
     * Returns the string "RectAreaLight"
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Returns the integer 4.
     * @returns The light Type id as a constant defines in Light.LIGHTTYPEID_x
     */
    getTypeID(): number;
    /**
     * Serializes the rect area light into a serialization object.
     * The emission texture is normally produced at runtime by AreaLightTextureTools and has no
     * source URL, so its pixels are embedded as a base64 string to keep the scene self-contained.
     * @returns the serialized object
     */
    serialize(): any;
    private _serializeEmissionTexture;
    private static _BuildEmbeddedEmissionTextureAsync;
    private static _BuildEmbeddedEmissionTexture;
    /**
     * Restores the emission texture from the serialized data after the base light has been parsed.
     * @param parsedLight The JSON representation of the light
     * @param scene The scene the light belongs to
     * @param rootUrl The root url to use to load the emission texture when serialized by reference
     */
    protected _onParsed(parsedLight: any, scene: Scene, rootUrl?: string): void;
    protected _buildUniformLayout(): void;
    protected _computeTransformedInformation(): boolean;
    private static _IsTexture;
    /**
     * Sets the passed Effect "effect" with the PointLight transformed position (or position, if none) and passed name (string).
     * @param effect The effect to update
     * @param lightIndex The index of the light in the effect to update
     * @returns The point light
     */
    transferToEffect(effect: Effect, lightIndex: string): RectAreaLight;
    transferTexturesToEffect(effect: Effect, lightIndex: string): Light;
    transferToNodeMaterialEffect(effect: Effect, lightDataUniformName: string): this;
    /**
     * Prepares the list of defines specific to the light type.
     * @param defines the list of defines
     * @param lightIndex defines the index of the light for the effect
     */
    prepareLightSpecificDefines(defines: any, lightIndex: number): void;
}
/**
 * Register side effects for rectAreaLight.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterRectAreaLight(): void;
