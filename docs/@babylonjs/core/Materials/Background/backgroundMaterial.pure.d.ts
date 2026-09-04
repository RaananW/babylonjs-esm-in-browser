/** This file must only contain pure code and pure imports */
import { type Nullable, type int, type float } from "../../types.js";
import { type Scene } from "../../scene.pure.js";
import { type Matrix, Vector3 } from "../../Maths/math.vector.pure.js";
import { type SubMesh } from "../../Meshes/subMesh.pure.js";
import { type AbstractMesh } from "../../Meshes/abstractMesh.pure.js";
import { type Mesh } from "../../Meshes/mesh.pure.js";
import { PushMaterial } from "../../Materials/pushMaterial.js";
import { ImageProcessingConfiguration } from "../../Materials/imageProcessingConfiguration.pure.js";
import { type BaseTexture } from "../../Materials/Textures/baseTexture.pure.js";
import { type IShadowLight } from "../../Lights/shadowLight.js";
import { Color3 } from "../../Maths/math.color.pure.js";
declare const BackgroundMaterialBase_base: {
    new (...args: any[]): {
        _imageProcessingConfiguration: ImageProcessingConfiguration;
        get imageProcessingConfiguration(): ImageProcessingConfiguration;
        set imageProcessingConfiguration(value: ImageProcessingConfiguration);
        _imageProcessingObserver: Nullable<import("../../index.js").Observer<ImageProcessingConfiguration>>;
        _attachImageProcessingConfiguration(configuration: Nullable<ImageProcessingConfiguration>): void;
        get cameraColorCurvesEnabled(): boolean;
        set cameraColorCurvesEnabled(value: boolean);
        get cameraColorGradingEnabled(): boolean;
        set cameraColorGradingEnabled(value: boolean);
        get cameraToneMappingEnabled(): boolean;
        set cameraToneMappingEnabled(value: boolean);
        get cameraExposure(): number;
        set cameraExposure(value: number);
        get cameraContrast(): number;
        set cameraContrast(value: number);
        get cameraColorGradingTexture(): Nullable<BaseTexture>;
        set cameraColorGradingTexture(value: Nullable<BaseTexture>);
        get cameraColorCurves(): Nullable<import("../index.js").ColorCurves>;
        set cameraColorCurves(value: Nullable<import("../index.js").ColorCurves>);
    };
} & typeof PushMaterial;
declare class BackgroundMaterialBase extends BackgroundMaterialBase_base {
}
/**
 * Background material used to create an efficient environment around your scene.
 * #157MGZ: simple test
 */
export declare class BackgroundMaterial extends BackgroundMaterialBase {
    /**
     * Standard reflectance value at parallel view angle.
     */
    static StandardReflectance0: number;
    /**
     * Standard reflectance value at grazing angle.
     */
    static StandardReflectance90: number;
    protected _primaryColor: Color3;
    /**
     * Key light Color (multiply against the environment texture)
     */
    accessor primaryColor: Color3;
    protected __perceptualColor: Nullable<Color3>;
    /**
     * Experimental Internal Use Only.
     *
     * Key light Color in "perceptual value" meaning the color you would like to see on screen.
     * This acts as a helper to set the primary color to a more "human friendly" value.
     * Conversion to linear space as well as exposure and tone mapping correction will be applied to keep the
     * output color as close as possible from the chosen value.
     * (This does not account for contrast color grading and color curves as they are considered post effect and not directly
     * part of lighting setup.)
     */
    get _perceptualColor(): Nullable<Color3>;
    set _perceptualColor(value: Nullable<Color3>);
    protected _primaryColorShadowLevel: float;
    /**
     * Defines the level of the shadows (dark area of the reflection map) in order to help scaling the colors.
     * The color opposite to the primary color is used at the level chosen to define what the black area would look.
     */
    get primaryColorShadowLevel(): float;
    set primaryColorShadowLevel(value: float);
    protected _primaryColorHighlightLevel: float;
    /**
     * Defines the level of the highlights (highlight area of the reflection map) in order to help scaling the colors.
     * The primary color is used at the level chosen to define what the white area would look.
     */
    get primaryColorHighlightLevel(): float;
    set primaryColorHighlightLevel(value: float);
    protected _reflectionTexture: Nullable<BaseTexture>;
    /**
     * Reflection Texture used in the material.
     * Should be author in a specific way for the best result (refer to the documentation).
     */
    accessor reflectionTexture: Nullable<BaseTexture>;
    protected _reflectionBlur: float;
    /**
     * Reflection Texture level of blur.
     *
     * Can be use to reuse an existing HDR Texture and target a specific LOD to prevent authoring the
     * texture twice.
     */
    accessor reflectionBlur: float;
    protected _diffuseTexture: Nullable<BaseTexture>;
    /**
     * Diffuse Texture used in the material.
     * Should be author in a specific way for the best result (refer to the documentation).
     */
    accessor diffuseTexture: Nullable<BaseTexture>;
    protected _shadowLights: Nullable<IShadowLight[]>;
    /**
     * Specify the list of lights casting shadow on the material.
     * All scene shadow lights will be included if null.
     */
    accessor shadowLights: Nullable<IShadowLight[]>;
    protected _shadowLevel: float;
    /**
     * Helps adjusting the shadow to a softer level if required.
     * 0 means black shadows and 1 means no shadows.
     */
    accessor shadowLevel: float;
    protected _sceneCenter: Vector3;
    /**
     * In case of opacity Fresnel or reflection falloff, this is use as a scene center.
     * It is usually zero but might be interesting to modify according to your setup.
     */
    accessor sceneCenter: Vector3;
    protected _opacityFresnel: boolean;
    /**
     * This helps specifying that the material is falling off to the sky box at grazing angle.
     * This helps ensuring a nice transition when the camera goes under the ground.
     */
    accessor opacityFresnel: boolean;
    protected _reflectionFresnel: boolean;
    /**
     * This helps specifying that the material is falling off from diffuse to the reflection texture at grazing angle.
     * This helps adding a mirror texture on the ground.
     */
    accessor reflectionFresnel: boolean;
    protected _reflectionFalloffDistance: number;
    /**
     * This helps specifying the falloff radius off the reflection texture from the sceneCenter.
     * This helps adding a nice falloff effect to the reflection if used as a mirror for instance.
     */
    accessor reflectionFalloffDistance: number;
    protected _reflectionAmount: number;
    /**
     * This specifies the weight of the reflection against the background in case of reflection Fresnel.
     */
    accessor reflectionAmount: number;
    protected _reflectionReflectance0: number;
    /**
     * This specifies the weight of the reflection at grazing angle.
     */
    accessor reflectionReflectance0: number;
    protected _reflectionReflectance90: number;
    /**
     * This specifies the weight of the reflection at a perpendicular point of view.
     */
    accessor reflectionReflectance90: number;
    /**
     * Sets the reflection reflectance fresnel values according to the default standard
     * empirically know to work well :-)
     */
    set reflectionStandardFresnelWeight(value: number);
    protected _useRGBColor: boolean;
    /**
     * Helps to directly use the maps channels instead of their level.
     */
    accessor useRGBColor: boolean;
    protected _enableNoise: boolean;
    /**
     * This helps reducing the banding effect that could occur on the background.
     */
    accessor enableNoise: boolean;
    /**
     * The current fov(field of view) multiplier, 0.0 - 2.0. Defaults to 1.0. Lower values "zoom in" and higher values "zoom out".
     * Best used when trying to implement visual zoom effects like fish-eye or binoculars while not adjusting camera fov.
     * Recommended to be keep at 1.0 except for special cases.
     */
    get fovMultiplier(): number;
    set fovMultiplier(value: number);
    private _fovMultiplier;
    /**
     * Enable the FOV adjustment feature controlled by fovMultiplier.
     */
    useEquirectangularFOV: boolean;
    private _maxSimultaneousLights;
    /**
     * Number of Simultaneous lights allowed on the material.
     */
    accessor maxSimultaneousLights: int;
    private _shadowOnly;
    /**
     * Make the material only render shadows
     */
    accessor shadowOnly: boolean;
    /**
     * Due to a bug in iOS10, video tags (which are using the background material) are in BGR and not RGB.
     * Setting this flag to true (not done automatically!) will convert it back to RGB.
     */
    switchToBGR: boolean;
    private _enableGroundProjection;
    /**
     * Enables the ground projection mode on the material.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/environment/skybox#ground-projection
     */
    accessor enableGroundProjection: boolean;
    /**
     * Defines the radius of the projected ground if enableGroundProjection is true.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/environment/skybox#ground-projection
     */
    projectedGroundRadius: number;
    /**
     * Defines the height of the projected ground if enableGroundProjection is true.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/environment/skybox#ground-projection
     */
    projectedGroundHeight: number;
    private _renderTargets;
    private _reflectionControls;
    private _white;
    private _primaryShadowColor;
    private _primaryHighlightColor;
    private static readonly _ShaderLoader;
    /**
     * Instantiates a Background Material in the given scene
     * @param name The friendly name of the material
     * @param scene The scene to add the material to
     * @param forceGLSL Use the GLSL code generation for the shader (even on WebGPU). Default is false
     */
    constructor(name: string, scene?: Scene, forceGLSL?: boolean);
    /**
     * Gets a boolean indicating that current material needs to register RTT
     */
    get hasRenderTargetTextures(): boolean;
    /**
     * The entire material has been created in order to prevent overdraw.
     * @returns false
     */
    needAlphaTesting(): boolean;
    /**
     * The entire material has been created in order to prevent overdraw.
     * @returns true if blending is enable
     */
    needAlphaBlending(): boolean;
    /**
     * Checks whether the material is ready to be rendered for a given mesh.
     * @param mesh The mesh to render
     * @param subMesh The submesh to check against
     * @param useInstances Specify wether or not the material is used with instances
     * @returns true if all the dependencies are ready (Textures, Effects...)
     */
    isReadyForSubMesh(mesh: AbstractMesh, subMesh: SubMesh, useInstances?: boolean): boolean;
    /**
     * Compute the primary color according to the chosen perceptual color.
     */
    private _computePrimaryColorFromPerceptualColor;
    /**
     * Compute the highlights and shadow colors according to their chosen levels.
     */
    private _computePrimaryColors;
    /**
     * Build the uniform buffer used in the material.
     */
    buildUniformLayout(): void;
    /**
     * Unbind the material.
     */
    unbind(): void;
    /**
     * Bind only the world matrix to the material.
     * @param world The world matrix to bind.
     */
    bindOnlyWorldMatrix(world: Matrix): void;
    /**
     * Bind the material for a dedicated submesh (every used meshes will be considered opaque).
     * @param world The world matrix to bind.
     * @param mesh the mesh to bind for.
     * @param subMesh The submesh to bind for.
     */
    bindForSubMesh(world: Matrix, mesh: Mesh, subMesh: SubMesh): void;
    /**
     * Checks to see if a texture is used in the material.
     * @param texture - Base texture to use.
     * @returns - Boolean specifying if a texture is used in the material.
     */
    hasTexture(texture: BaseTexture): boolean;
    /**
     * Dispose the material.
     * @param forceDisposeEffect Force disposal of the associated effect.
     * @param forceDisposeTextures Force disposal of the associated textures.
     */
    dispose(forceDisposeEffect?: boolean, forceDisposeTextures?: boolean): void;
    /**
     * Clones the material.
     * @param name The cloned name.
     * @returns The cloned material.
     */
    clone(name: string): BackgroundMaterial;
    /**
     * Serializes the current material to its JSON representation.
     * @returns The JSON representation.
     */
    serialize(): any;
    /**
     * Gets the class name of the material
     * @returns "BackgroundMaterial"
     */
    getClassName(): string;
    /**
     * Parse a JSON input to create back a background material.
     * @param source The JSON data to parse
     * @param scene The scene to create the parsed material in
     * @param rootUrl The root url of the assets the material depends upon
     * @returns the instantiated BackgroundMaterial.
     */
    static Parse(source: any, scene: Scene, rootUrl: string): BackgroundMaterial;
}
/**
 * Register side effects for backgroundMaterial.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterBackgroundMaterial(): void;
export {};
