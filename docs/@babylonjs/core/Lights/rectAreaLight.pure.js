/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { Vector3 } from "../Maths/math.vector.pure.js";
import { Light } from "./light.js";
import { serialize } from "../Misc/decorators.js";
import { AreaLight } from "./areaLight.pure.js";
import { Texture } from "../Materials/Textures/texture.pure.js";
import { GenerateBase64StringFromTexture, GenerateBase64StringFromTextureAsync } from "../Misc/copyTools.js";

import { Node } from "../node.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * A rectangular area light defined by an unique point in world space, a width and a height.
 * The light is emitted from the rectangular area in the -Z direction.
 */
let RectAreaLight = (() => {
    var _a;
    let _classSuper = AreaLight;
    let _instanceExtraInitializers = [];
    let _get_width_decorators;
    let _get_height_decorators;
    return _a = class RectAreaLight extends _classSuper {
            /**
             * Gets Rect Area Light emission texture. (Note: This texture needs pre-processing! Use AreaLightTextureTools to pre-process the texture).
             */
            get emissionTexture() {
                return this._emissionTextureTexture;
            }
            /**
             * Sets Rect Area Light emission texture. (Note: This texture needs pre-processing! Use AreaLightTextureTools to pre-process the texture).
             */
            set emissionTexture(value) {
                if (this._emissionTextureTexture === value) {
                    return;
                }
                this._emissionTextureTexture = value;
                if (this._emissionTextureTexture) {
                    this._emissionTextureTexture.wrapU = 0;
                    this._emissionTextureTexture.wrapV = 0;
                }
                if (this._emissionTextureTexture && _a._IsTexture(this._emissionTextureTexture)) {
                    this._emissionTextureTexture.onLoadObservable.addOnce(() => {
                        this._markMeshesAsLightDirty();
                    });
                }
            }
            /**
             * Rect Area Light width.
             */
            get width() {
                return this._width.x;
            }
            /**
             * Rect Area Light width.
             */
            set width(value) {
                this._width.x = value;
            }
            /**
             * Rect Area Light height.
             */
            get height() {
                return this._height.y;
            }
            /**
             * Rect Area Light height.
             */
            set height(value) {
                this._height.y = value;
            }
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
            constructor(name, position, width, height, scene, dontAddToScene) {
                super(name, position, scene, dontAddToScene);
                this._width = __runInitializers(this, _instanceExtraInitializers);
                this._emissionTextureTexture = null;
                this._width = new Vector3(width, 0, 0);
                this._height = new Vector3(0, height, 0);
                this._pointTransformedPosition = Vector3.Zero();
                this._pointTransformedWidth = Vector3.Zero();
                this._pointTransformedHeight = Vector3.Zero();
            }
            /**
             * Returns the string "RectAreaLight"
             * @returns the class name
             */
            getClassName() {
                return "RectAreaLight";
            }
            /**
             * Returns the integer 4.
             * @returns The light Type id as a constant defines in Light.LIGHTTYPEID_x
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            getTypeID() {
                return Light.LIGHTTYPEID_RECT_AREALIGHT;
            }
            /**
             * Serializes the rect area light into a serialization object.
             * The emission texture is normally produced at runtime by AreaLightTextureTools and has no
             * source URL, so its pixels are embedded as a base64 string to keep the scene self-contained.
             * @returns the serialized object
             */
            serialize() {
                const serializationObject = super.serialize();
                if (this._emissionTextureTexture) {
                    const serializedEmissionTexture = this._serializeEmissionTexture(this._emissionTextureTexture);
                    if (serializedEmissionTexture) {
                        serializationObject.emissionTexture = serializedEmissionTexture;
                    }
                }
                return serializationObject;
            }
            _serializeEmissionTexture(texture) {
                // A regular URL-backed texture can be serialized by reference.
                const referencedTexture = texture.serialize();
                if (referencedTexture) {
                    return referencedTexture;
                }
                // The emission texture produced by AreaLightTextureTools is a runtime render-target texture
                // with no source URL, so embed its pixels as a base64 PNG.
                const internalTexture = texture.getInternalTexture();
                if (!internalTexture) {
                    return null;
                }
                const invertY = internalTexture.invertY;
                const hasAlpha = texture.hasAlpha;
                // On engines with synchronous texture read (WebGL) the pixels are embedded immediately.
                if (this._scene.getEngine()._features.supportSyncTextureRead) {
                    return _a._BuildEmbeddedEmissionTexture(GenerateBase64StringFromTexture(texture), invertY, hasAlpha);
                }
                // On WebGPU/Native (no synchronous texture read) a promise for the entire texture object is
                // returned so it resolves to null (and is skipped on parse) if the pixels cannot be read.
                // SceneSerializer.SerializeAsync resolves the promise before producing the final JSON.
                return _a._BuildEmbeddedEmissionTextureAsync(GenerateBase64StringFromTextureAsync(texture), invertY, hasAlpha);
            }
            static async _BuildEmbeddedEmissionTextureAsync(base64Promise, invertY, hasAlpha) {
                return _a._BuildEmbeddedEmissionTexture(await base64Promise, invertY, hasAlpha);
            }
            static _BuildEmbeddedEmissionTexture(base64String, invertY, hasAlpha) {
                if (!base64String) {
                    return null;
                }
                return {
                    name: "areaLightEmissionTexture",
                    base64String: base64String,
                    invertY: invertY,
                    hasAlpha: hasAlpha,
                };
            }
            /**
             * Restores the emission texture from the serialized data after the base light has been parsed.
             * @param parsedLight The JSON representation of the light
             * @param scene The scene the light belongs to
             * @param rootUrl The root url to use to load the emission texture when serialized by reference
             */
            _onParsed(parsedLight, scene, rootUrl = "") {
                super._onParsed(parsedLight, scene, rootUrl);
                if (parsedLight.emissionTexture) {
                    this.emissionTexture = Texture.Parse(parsedLight.emissionTexture, scene, rootUrl);
                }
            }
            _buildUniformLayout() {
                this._uniformBuffer.addUniform("vLightData", 4);
                this._uniformBuffer.addUniform("vLightDiffuse", 4);
                this._uniformBuffer.addUniform("vLightSpecular", 4);
                this._uniformBuffer.addUniform("vLightWidth", 4);
                this._uniformBuffer.addUniform("vLightHeight", 4);
                this._uniformBuffer.addUniform("shadowsInfo", 3);
                this._uniformBuffer.addUniform("depthValues", 2);
                this._uniformBuffer.create();
            }
            _computeTransformedInformation() {
                if (this.parent && this.parent.getWorldMatrix) {
                    Vector3.TransformCoordinatesToRef(this.position, this.parent.getWorldMatrix(), this._pointTransformedPosition);
                    Vector3.TransformNormalToRef(this._width, this.parent.getWorldMatrix(), this._pointTransformedWidth);
                    Vector3.TransformNormalToRef(this._height, this.parent.getWorldMatrix(), this._pointTransformedHeight);
                    return true;
                }
                return false;
            }
            static _IsTexture(texture) {
                return texture.onLoadObservable !== undefined;
            }
            /**
             * Sets the passed Effect "effect" with the PointLight transformed position (or position, if none) and passed name (string).
             * @param effect The effect to update
             * @param lightIndex The index of the light in the effect to update
             * @returns The point light
             */
            transferToEffect(effect, lightIndex) {
                const offset = this._scene.floatingOriginOffset;
                if (this._computeTransformedInformation()) {
                    this._uniformBuffer.updateFloat4("vLightData", this._pointTransformedPosition.x - offset.x, this._pointTransformedPosition.y - offset.y, this._pointTransformedPosition.z - offset.z, 0, lightIndex);
                    this._uniformBuffer.updateFloat4("vLightWidth", this._pointTransformedWidth.x / 2, this._pointTransformedWidth.y / 2, this._pointTransformedWidth.z / 2, 0, lightIndex);
                    this._uniformBuffer.updateFloat4("vLightHeight", this._pointTransformedHeight.x / 2, this._pointTransformedHeight.y / 2, this._pointTransformedHeight.z / 2, 0, lightIndex);
                }
                else {
                    this._uniformBuffer.updateFloat4("vLightData", this.position.x - offset.x, this.position.y - offset.y, this.position.z - offset.z, 0, lightIndex);
                    this._uniformBuffer.updateFloat4("vLightWidth", this._width.x / 2, this._width.y / 2, this._width.z / 2, 0.0, lightIndex);
                    this._uniformBuffer.updateFloat4("vLightHeight", this._height.x / 2, this._height.y / 2, this._height.z / 2, 0.0, lightIndex);
                }
                return this;
            }
            transferTexturesToEffect(effect, lightIndex) {
                super.transferTexturesToEffect(effect, lightIndex);
                if (this._emissionTextureTexture && this._emissionTextureTexture.isReady()) {
                    effect.setTexture("rectAreaLightEmissionTexture" + lightIndex, this._emissionTextureTexture);
                }
                return this;
            }
            transferToNodeMaterialEffect(effect, lightDataUniformName) {
                const offset = this._scene.floatingOriginOffset;
                if (this._computeTransformedInformation()) {
                    effect.setFloat3(lightDataUniformName, this._pointTransformedPosition.x - offset.x, this._pointTransformedPosition.y - offset.y, this._pointTransformedPosition.z - offset.z);
                }
                else {
                    effect.setFloat3(lightDataUniformName, this.position.x - offset.x, this.position.y - offset.y, this.position.z - offset.z);
                }
                return this;
            }
            /**
             * Prepares the list of defines specific to the light type.
             * @param defines the list of defines
             * @param lightIndex defines the index of the light for the effect
             */
            prepareLightSpecificDefines(defines, lightIndex) {
                super.prepareLightSpecificDefines(defines, lightIndex);
                defines["RECTAREALIGHTEMISSIONTEXTURE" + lightIndex] = this._emissionTextureTexture && this._emissionTextureTexture.isReady() ? true : false;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_width_decorators = [serialize()];
            _get_height_decorators = [serialize()];
            __esDecorate(_a, null, _get_width_decorators, { kind: "getter", name: "width", static: false, private: false, access: { has: obj => "width" in obj, get: obj => obj.width }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_height_decorators, { kind: "getter", name: "height", static: false, private: false, access: { has: obj => "height" in obj, get: obj => obj.height }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { RectAreaLight };
let _Registered = false;
/**
 * Register side effects for rectAreaLight.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterRectAreaLight() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Node.AddNodeConstructor("Light_Type_4", (name, scene) => {
        return () => new RectAreaLight(name, Vector3.Zero(), 1, 1, scene);
    });
    // Register Class Name
    RegisterClass("BABYLON.RectAreaLight", RectAreaLight);
}
//# sourceMappingURL=rectAreaLight.pure.js.map