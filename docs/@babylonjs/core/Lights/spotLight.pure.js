/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { serialize, serializeAsTexture } from "../Misc/decorators.js";
import { Matrix, Vector3 } from "../Maths/math.vector.pure.js";
import { Light } from "./light.js";
import { ShadowLight } from "./shadowLight.js";
import { Texture } from "../Materials/Textures/texture.pure.js";

import { Node } from "../node.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * A spot light is defined by a position, a direction, an angle, and an exponent.
 * These values define a cone of light starting from the position, emitting toward the direction.
 * The angle, in radians, defines the size (field of illumination) of the spotlight's conical beam,
 * and the exponent defines the speed of the decay of the light with distance (reach).
 * Documentation: https://doc.babylonjs.com/features/featuresDeepDive/lights/lights_introduction
 */
let SpotLight = (() => {
    var _a;
    let _classSuper = ShadowLight;
    let _instanceExtraInitializers = [];
    let _get_angle_decorators;
    let _get_innerAngle_decorators;
    let _get_shadowAngleScale_decorators;
    let _exponent_decorators;
    let _exponent_initializers = [];
    let _exponent_extraInitializers = [];
    let _get_projectionTextureLightNear_decorators;
    let _get_projectionTextureLightFar_decorators;
    let _get_projectionTextureUpDirection_decorators;
    let __projectionTexture_decorators;
    let __projectionTexture_initializers = [];
    let __projectionTexture_extraInitializers = [];
    return _a = class SpotLight extends _classSuper {
            /**
             * Gets or sets the IES profile texture used to create the spotlight
             * @see https://playground.babylonjs.com/#UIAXAU#1
             */
            get iesProfileTexture() {
                return this._iesProfileTexture;
            }
            set iesProfileTexture(value) {
                if (this._iesProfileTexture === value) {
                    return;
                }
                this._iesProfileTexture = value;
                if (this._iesProfileTexture && _a._IsTexture(this._iesProfileTexture)) {
                    this._iesProfileTexture.onLoadObservable.addOnce(() => {
                        this._markMeshesAsLightDirty();
                    });
                }
            }
            /**
             * Gets the cone angle of the spot light in Radians.
             */
            get angle() {
                return this._angle;
            }
            /**
             * Sets the cone angle of the spot light in Radians.
             */
            set angle(value) {
                this._angle = value;
                this._cosHalfAngle = Math.cos(value * 0.5);
                this._projectionTextureProjectionLightDirty = true;
                this.forceProjectionMatrixCompute();
                this._computeAngleValues();
            }
            /**
             * Only used in gltf falloff mode, this defines the angle where
             * the directional falloff will start before cutting at angle which could be seen
             * as outer angle.
             */
            get innerAngle() {
                return this._innerAngle;
            }
            /**
             * Only used in gltf falloff mode, this defines the angle where
             * the directional falloff will start before cutting at angle which could be seen
             * as outer angle.
             */
            set innerAngle(value) {
                this._innerAngle = value;
                this._computeAngleValues();
            }
            /**
             * Allows scaling the angle of the light for shadow generation only.
             */
            get shadowAngleScale() {
                return this._shadowAngleScale;
            }
            /**
             * Allows scaling the angle of the light for shadow generation only.
             */
            set shadowAngleScale(value) {
                this._shadowAngleScale = value;
                this.forceProjectionMatrixCompute();
            }
            /**
             * Allows reading the projection texture
             */
            get projectionTextureMatrix() {
                return this._projectionTextureMatrix;
            }
            /**
             * Gets the near clip of the Spotlight for texture projection.
             */
            get projectionTextureLightNear() {
                return this._projectionTextureLightNear;
            }
            /**
             * Sets the near clip of the Spotlight for texture projection.
             */
            set projectionTextureLightNear(value) {
                this._projectionTextureLightNear = value;
                this._projectionTextureProjectionLightDirty = true;
            }
            /**
             * Gets the far clip of the Spotlight for texture projection.
             */
            get projectionTextureLightFar() {
                return this._projectionTextureLightFar;
            }
            /**
             * Sets the far clip of the Spotlight for texture projection.
             */
            set projectionTextureLightFar(value) {
                this._projectionTextureLightFar = value;
                this._projectionTextureProjectionLightDirty = true;
            }
            /**
             * Gets the Up vector of the Spotlight for texture projection.
             */
            get projectionTextureUpDirection() {
                return this._projectionTextureUpDirection;
            }
            /**
             * Sets the Up vector of the Spotlight for texture projection.
             */
            set projectionTextureUpDirection(value) {
                this._projectionTextureUpDirection = value;
                this._projectionTextureViewLightDirty = true;
            }
            /**
             * Gets the projection texture of the light.
             */
            get projectionTexture() {
                return this._projectionTexture;
            }
            /**
             * Sets the projection texture of the light.
             */
            set projectionTexture(value) {
                if (this._projectionTexture === value) {
                    return;
                }
                this._projectionTexture = value;
                this._projectionTextureDirty = true;
                if (this._projectionTexture && !this._projectionTexture.isReady()) {
                    if (_a._IsProceduralTexture(this._projectionTexture)) {
                        this._projectionTexture.getEffect().executeWhenCompiled(() => {
                            this._markMeshesAsLightDirty();
                        });
                    }
                    else if (_a._IsTexture(this._projectionTexture)) {
                        this._projectionTexture.onLoadObservable.addOnce(() => {
                            this._markMeshesAsLightDirty();
                        });
                    }
                }
            }
            static _IsProceduralTexture(texture) {
                return texture.onGeneratedObservable !== undefined;
            }
            static _IsTexture(texture) {
                return texture.onLoadObservable !== undefined;
            }
            /**
             * Gets or sets the light projection matrix as used by the projection texture
             */
            get projectionTextureProjectionLightMatrix() {
                return this._projectionTextureProjectionLightMatrix;
            }
            set projectionTextureProjectionLightMatrix(projection) {
                this._projectionTextureProjectionLightMatrix = projection;
                this._projectionTextureProjectionLightDirty = false;
                this._projectionTextureDirty = true;
            }
            /**
             * Creates a SpotLight object in the scene. A spot light is a simply light oriented cone.
             * It can cast shadows.
             * Documentation : https://doc.babylonjs.com/features/featuresDeepDive/lights/lights_introduction
             * @param name The light friendly name
             * @param position The position of the spot light in the scene
             * @param direction The direction of the light in the scene
             * @param angle The cone angle of the light in Radians
             * @param exponent The light decay speed with the distance from the emission spot
             * @param scene The scene the lights belongs to
             * @param dontAddToScene True to not add the light to the scene
             */
            constructor(name, position, direction, angle, exponent, scene, dontAddToScene) {
                super(name, scene, dontAddToScene);
                /*
                    upVector , rightVector and direction will form the coordinate system for this spot light.
                    These three vectors will be used as projection matrix when doing texture projection.
            
                    Also we have the following rules always holds:
                    direction cross up   = right
                    right cross direction = up
                    up cross right       = forward
            
                    light_near and light_far will control the range of the texture projection. If a plane is
                    out of the range in spot light space, there is no texture projection.
                */
                this._angle = __runInitializers(this, _instanceExtraInitializers);
                this._innerAngle = 0;
                this._iesProfileTexture = null;
                /**
                 * The light decay speed with the distance from the emission spot.
                 */
                this.exponent = __runInitializers(this, _exponent_initializers, void 0);
                this._projectionTextureMatrix = (__runInitializers(this, _exponent_extraInitializers), Matrix.Zero());
                this._projectionTextureLightNear = 1e-6;
                this._projectionTextureLightFar = 1000.0;
                this._projectionTextureUpDirection = Vector3.Up();
                this._projectionTexture = __runInitializers(this, __projectionTexture_initializers, void 0);
                this._projectionTextureViewLightDirty = (__runInitializers(this, __projectionTexture_extraInitializers), true);
                this._projectionTextureProjectionLightDirty = true;
                this._projectionTextureDirty = true;
                this._projectionTextureViewTargetVector = Vector3.Zero();
                this._projectionTextureViewLightMatrix = Matrix.Zero();
                this._projectionTextureProjectionLightMatrix = Matrix.Zero();
                this._projectionTextureScalingMatrix = Matrix.FromValues(0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.5, 0.5, 1.0);
                this.position = position;
                this.direction = direction;
                this.angle = angle;
                this.exponent = exponent;
            }
            /**
             * Returns the string "SpotLight".
             * @returns the class name
             */
            getClassName() {
                return "SpotLight";
            }
            /**
             * Returns the integer 2.
             * @returns The light Type id as a constant defines in Light.LIGHTTYPEID_x
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            getTypeID() {
                return Light.LIGHTTYPEID_SPOTLIGHT;
            }
            /**
             * Overrides the direction setter to recompute the projection texture view light Matrix.
             * @param value
             */
            _setDirection(value) {
                super._setDirection(value);
                this._projectionTextureViewLightDirty = true;
            }
            /**
             * Overrides the position setter to recompute the projection texture view light Matrix.
             * @param value
             */
            _setPosition(value) {
                super._setPosition(value);
                this._projectionTextureViewLightDirty = true;
            }
            /**
             * Sets the passed matrix "matrix" as perspective projection matrix for the shadows and the passed view matrix with the fov equal to the SpotLight angle and and aspect ratio of 1.0.
             * Returns the SpotLight.
             * @param matrix
             * @param viewMatrix
             * @param renderList
             */
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            _setDefaultShadowProjectionMatrix(matrix, viewMatrix, renderList) {
                const activeCamera = this.getScene().activeCamera;
                if (!activeCamera) {
                    return;
                }
                this._shadowAngleScale = this._shadowAngleScale || 1;
                const angle = this._shadowAngleScale * this._angle;
                const minZ = this.shadowMinZ !== undefined ? this.shadowMinZ : activeCamera.minZ;
                const maxZ = this.shadowMaxZ !== undefined ? this.shadowMaxZ : activeCamera.maxZ;
                const useReverseDepthBuffer = this.getScene().getEngine().useReverseDepthBuffer;
                Matrix.PerspectiveFovLHToRef(angle, 1.0, useReverseDepthBuffer ? maxZ : minZ, useReverseDepthBuffer ? minZ : maxZ, matrix, true, this._scene.getEngine().isNDCHalfZRange, undefined, useReverseDepthBuffer);
            }
            _computeProjectionTextureViewLightMatrix() {
                this._projectionTextureViewLightDirty = false;
                this._projectionTextureDirty = true;
                this.getAbsolutePosition().addToRef(this.getShadowDirection(), this._projectionTextureViewTargetVector);
                Matrix.LookAtLHToRef(this.getAbsolutePosition(), this._projectionTextureViewTargetVector, this._projectionTextureUpDirection, this._projectionTextureViewLightMatrix);
            }
            _computeProjectionTextureProjectionLightMatrix() {
                this._projectionTextureProjectionLightDirty = false;
                this._projectionTextureDirty = true;
                const lightFar = this.projectionTextureLightFar;
                const lightNear = this.projectionTextureLightNear;
                const p = lightFar / (lightFar - lightNear);
                const q = -p * lightNear;
                const s = 1.0 / Math.tan(this._angle / 2.0);
                const a = 1.0;
                Matrix.FromValuesToRef(s / a, 0.0, 0.0, 0.0, 0.0, s, 0.0, 0.0, 0.0, 0.0, p, 1.0, 0.0, 0.0, q, 0.0, this._projectionTextureProjectionLightMatrix);
            }
            /**
             * Main function for light texture projection matrix computing.
             */
            _computeProjectionTextureMatrix() {
                this._projectionTextureDirty = false;
                this._projectionTextureViewLightMatrix.multiplyToRef(this._projectionTextureProjectionLightMatrix, this._projectionTextureMatrix);
                if (this._projectionTexture instanceof Texture) {
                    const u = this._projectionTexture.uScale / 2.0;
                    const v = this._projectionTexture.vScale / 2.0;
                    Matrix.FromValuesToRef(u, 0.0, 0.0, 0.0, 0.0, v, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.5, 0.5, 1.0, this._projectionTextureScalingMatrix);
                }
                this._projectionTextureMatrix.multiplyToRef(this._projectionTextureScalingMatrix, this._projectionTextureMatrix);
            }
            _buildUniformLayout() {
                this._uniformBuffer.addUniform("vLightData", 4);
                this._uniformBuffer.addUniform("vLightDiffuse", 4);
                this._uniformBuffer.addUniform("vLightSpecular", 4);
                this._uniformBuffer.addUniform("vLightDirection", 3);
                this._uniformBuffer.addUniform("vLightFalloff", 4);
                this._uniformBuffer.addUniform("shadowsInfo", 3);
                this._uniformBuffer.addUniform("depthValues", 2);
                this._uniformBuffer.create();
            }
            _computeAngleValues() {
                this._lightAngleScale = 1.0 / Math.max(0.001, Math.cos(this._innerAngle * 0.5) - this._cosHalfAngle);
                this._lightAngleOffset = -this._cosHalfAngle * this._lightAngleScale;
            }
            /**
             * Sets the passed Effect "effect" with the Light textures.
             * @param effect The effect to update
             * @param lightIndex The index of the light in the effect to update
             * @returns The light
             */
            transferTexturesToEffect(effect, lightIndex) {
                if (this.projectionTexture && this.projectionTexture.isReady()) {
                    if (this._projectionTextureViewLightDirty) {
                        this._computeProjectionTextureViewLightMatrix();
                    }
                    if (this._projectionTextureProjectionLightDirty) {
                        this._computeProjectionTextureProjectionLightMatrix();
                    }
                    if (this._projectionTextureDirty) {
                        this._computeProjectionTextureMatrix();
                    }
                    effect.setMatrix("textureProjectionMatrix" + lightIndex, this._projectionTextureMatrix);
                    effect.setTexture("projectionLightTexture" + lightIndex, this.projectionTexture);
                }
                if (this._iesProfileTexture && this._iesProfileTexture.isReady()) {
                    effect.setTexture("iesLightTexture" + lightIndex, this._iesProfileTexture);
                }
                return this;
            }
            /**
             * Sets the passed Effect object with the SpotLight transformed position (or position if not parented) and normalized direction.
             * @param effect The effect to update
             * @param lightIndex The index of the light in the effect to update
             * @returns The spot light
             */
            transferToEffect(effect, lightIndex) {
                let normalizeDirection;
                const offset = this._scene.floatingOriginOffset;
                if (this.computeTransformedInformation()) {
                    this._uniformBuffer.updateFloat4("vLightData", this.transformedPosition.x - offset.x, this.transformedPosition.y - offset.y, this.transformedPosition.z - offset.z, this.exponent, lightIndex);
                    normalizeDirection = Vector3.Normalize(this.transformedDirection);
                }
                else {
                    this._uniformBuffer.updateFloat4("vLightData", this.position.x - offset.x, this.position.y - offset.y, this.position.z - offset.z, this.exponent, lightIndex);
                    normalizeDirection = Vector3.Normalize(this.direction);
                }
                this._uniformBuffer.updateFloat4("vLightDirection", normalizeDirection.x, normalizeDirection.y, normalizeDirection.z, this._cosHalfAngle, lightIndex);
                this._uniformBuffer.updateFloat4("vLightFalloff", this.range, this._inverseSquaredRange, this._lightAngleScale, this._lightAngleOffset, lightIndex);
                return this;
            }
            transferToNodeMaterialEffect(effect, lightDataUniformName) {
                let normalizeDirection;
                if (this.computeTransformedInformation()) {
                    normalizeDirection = Vector3.Normalize(this.transformedDirection);
                }
                else {
                    normalizeDirection = Vector3.Normalize(this.direction);
                }
                if (this.getScene().useRightHandedSystem) {
                    effect.setFloat3(lightDataUniformName, -normalizeDirection.x, -normalizeDirection.y, -normalizeDirection.z);
                }
                else {
                    effect.setFloat3(lightDataUniformName, normalizeDirection.x, normalizeDirection.y, normalizeDirection.z);
                }
                return this;
            }
            /**
             * Disposes the light and the associated resources.
             */
            dispose() {
                super.dispose();
                if (this._projectionTexture) {
                    this._projectionTexture.dispose();
                }
                if (this._iesProfileTexture) {
                    this._iesProfileTexture.dispose();
                    this._iesProfileTexture = null;
                }
            }
            /**
             * Gets the minZ used for shadow according to both the scene and the light.
             * @param activeCamera The camera we are returning the min for
             * @returns the depth min z
             */
            getDepthMinZ(activeCamera) {
                const engine = this._scene.getEngine();
                const minZ = this.shadowMinZ !== undefined ? this.shadowMinZ : (activeCamera?.minZ ?? 0);
                return engine.useReverseDepthBuffer && engine.isNDCHalfZRange ? minZ : this._scene.getEngine().isNDCHalfZRange ? 0 : minZ;
            }
            /**
             * Gets the maxZ used for shadow according to both the scene and the light.
             * @param activeCamera The camera we are returning the max for
             * @returns the depth max z
             */
            getDepthMaxZ(activeCamera) {
                const engine = this._scene.getEngine();
                const maxZ = this.shadowMaxZ !== undefined ? this.shadowMaxZ : (activeCamera?.maxZ ?? 10000);
                return engine.useReverseDepthBuffer && engine.isNDCHalfZRange ? 0 : maxZ;
            }
            /**
             * Returns whether light related textures are ready to be used in the rendering
             * @override
             * @returns true if the light textures are ready
             */
            areLightTexturesReady() {
                if (this._projectionTexture && !this._projectionTexture.isReadyOrNotBlocking()) {
                    return false;
                }
                if (this._iesProfileTexture && !this._iesProfileTexture.isReadyOrNotBlocking()) {
                    return false;
                }
                return true;
            }
            /**
             * Prepares the list of defines specific to the light type.
             * @param defines the list of defines
             * @param lightIndex defines the index of the light for the effect
             */
            prepareLightSpecificDefines(defines, lightIndex) {
                defines["SPOTLIGHT" + lightIndex] = true;
                defines["PROJECTEDLIGHTTEXTURE" + lightIndex] = this.projectionTexture && this.projectionTexture.isReady() ? true : false;
                defines["IESLIGHTTEXTURE" + lightIndex] = this._iesProfileTexture && this._iesProfileTexture.isReady() ? true : false;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_angle_decorators = [serialize()];
            _get_innerAngle_decorators = [serialize()];
            _get_shadowAngleScale_decorators = [serialize()];
            _exponent_decorators = [serialize()];
            _get_projectionTextureLightNear_decorators = [serialize()];
            _get_projectionTextureLightFar_decorators = [serialize()];
            _get_projectionTextureUpDirection_decorators = [serialize()];
            __projectionTexture_decorators = [serializeAsTexture("projectedLightTexture")];
            __esDecorate(_a, null, _get_angle_decorators, { kind: "getter", name: "angle", static: false, private: false, access: { has: obj => "angle" in obj, get: obj => obj.angle }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_innerAngle_decorators, { kind: "getter", name: "innerAngle", static: false, private: false, access: { has: obj => "innerAngle" in obj, get: obj => obj.innerAngle }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_shadowAngleScale_decorators, { kind: "getter", name: "shadowAngleScale", static: false, private: false, access: { has: obj => "shadowAngleScale" in obj, get: obj => obj.shadowAngleScale }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_projectionTextureLightNear_decorators, { kind: "getter", name: "projectionTextureLightNear", static: false, private: false, access: { has: obj => "projectionTextureLightNear" in obj, get: obj => obj.projectionTextureLightNear }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_projectionTextureLightFar_decorators, { kind: "getter", name: "projectionTextureLightFar", static: false, private: false, access: { has: obj => "projectionTextureLightFar" in obj, get: obj => obj.projectionTextureLightFar }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_projectionTextureUpDirection_decorators, { kind: "getter", name: "projectionTextureUpDirection", static: false, private: false, access: { has: obj => "projectionTextureUpDirection" in obj, get: obj => obj.projectionTextureUpDirection }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _exponent_decorators, { kind: "field", name: "exponent", static: false, private: false, access: { has: obj => "exponent" in obj, get: obj => obj.exponent, set: (obj, value) => { obj.exponent = value; } }, metadata: _metadata }, _exponent_initializers, _exponent_extraInitializers);
            __esDecorate(null, null, __projectionTexture_decorators, { kind: "field", name: "_projectionTexture", static: false, private: false, access: { has: obj => "_projectionTexture" in obj, get: obj => obj._projectionTexture, set: (obj, value) => { obj._projectionTexture = value; } }, metadata: _metadata }, __projectionTexture_initializers, __projectionTexture_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { SpotLight };
let _Registered = false;
/**
 * Register side effects for spotLight.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterSpotLight() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Node.AddNodeConstructor("Light_Type_2", (name, scene) => {
        return () => new SpotLight(name, Vector3.Zero(), Vector3.Zero(), 0, 0, scene);
    });
    // Register Class Name
    RegisterClass("BABYLON.SpotLight", SpotLight);
}
//# sourceMappingURL=spotLight.pure.js.map