/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { serialize } from "../Misc/decorators.js";
import { Matrix, Vector3 } from "../Maths/math.vector.pure.js";
import { Light } from "./light.js";
import { ShadowLight } from "./shadowLight.js";

import { Node } from "../node.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * A directional light is defined by a direction (what a surprise!).
 * The light is emitted from everywhere in the specified direction, and has an infinite range.
 * An example of a directional light is when a distance planet is lit by the apparently parallel lines of light from its sun. Light in a downward direction will light the top of an object.
 * Documentation: https://doc.babylonjs.com/features/featuresDeepDive/lights/lights_introduction
 */
let DirectionalLight = (() => {
    var _a;
    let _classSuper = ShadowLight;
    let _instanceExtraInitializers = [];
    let _get_shadowFrustumSize_decorators;
    let _get_shadowOrthoScale_decorators;
    let _autoUpdateExtends_decorators;
    let _autoUpdateExtends_initializers = [];
    let _autoUpdateExtends_extraInitializers = [];
    let _autoCalcShadowZBounds_decorators;
    let _autoCalcShadowZBounds_initializers = [];
    let _autoCalcShadowZBounds_extraInitializers = [];
    let __orthoLeft_decorators;
    let __orthoLeft_initializers = [];
    let __orthoLeft_extraInitializers = [];
    let __orthoRight_decorators;
    let __orthoRight_initializers = [];
    let __orthoRight_extraInitializers = [];
    let __orthoTop_decorators;
    let __orthoTop_initializers = [];
    let __orthoTop_extraInitializers = [];
    let __orthoBottom_decorators;
    let __orthoBottom_initializers = [];
    let __orthoBottom_extraInitializers = [];
    return _a = class DirectionalLight extends _classSuper {
            /**
             * Fix frustum size for the shadow generation. This is disabled if the value is 0.
             */
            get shadowFrustumSize() {
                return this._shadowFrustumSize;
            }
            /**
             * Specifies a fix frustum size for the shadow generation.
             */
            set shadowFrustumSize(value) {
                this._shadowFrustumSize = value;
                this.forceProjectionMatrixCompute();
            }
            /**
             * Gets the shadow projection scale against the optimal computed one.
             * 0.1 by default which means that the projection window is increase by 10% from the optimal size.
             * This does not impact in fixed frustum size (shadowFrustumSize being set)
             */
            get shadowOrthoScale() {
                return this._shadowOrthoScale;
            }
            /**
             * Sets the shadow projection scale against the optimal computed one.
             * 0.1 by default which means that the projection window is increase by 10% from the optimal size.
             * This does not impact in fixed frustum size (shadowFrustumSize being set)
             */
            set shadowOrthoScale(value) {
                this._shadowOrthoScale = value;
                this.forceProjectionMatrixCompute();
            }
            /**
             * Gets or sets the orthoLeft property used to build the light frustum
             */
            get orthoLeft() {
                return this._orthoLeft;
            }
            set orthoLeft(left) {
                this._orthoLeft = left;
            }
            /**
             * Gets or sets the orthoRight property used to build the light frustum
             */
            get orthoRight() {
                return this._orthoRight;
            }
            set orthoRight(right) {
                this._orthoRight = right;
            }
            /**
             * Gets or sets the orthoTop property used to build the light frustum
             */
            get orthoTop() {
                return this._orthoTop;
            }
            set orthoTop(top) {
                this._orthoTop = top;
            }
            /**
             * Gets or sets the orthoBottom property used to build the light frustum
             */
            get orthoBottom() {
                return this._orthoBottom;
            }
            set orthoBottom(bottom) {
                this._orthoBottom = bottom;
            }
            /**
             * Creates a DirectionalLight object in the scene, oriented towards the passed direction (Vector3).
             * The directional light is emitted from everywhere in the given direction.
             * It can cast shadows.
             * Documentation : https://doc.babylonjs.com/features/featuresDeepDive/lights/lights_introduction
             * @param name The friendly name of the light
             * @param direction The direction of the light
             * @param scene The scene the light belongs to
             * @param dontAddToScene True to not add the light to the scene
             */
            constructor(name, direction, scene, dontAddToScene) {
                super(name, scene, dontAddToScene);
                this._shadowFrustumSize = (__runInitializers(this, _instanceExtraInitializers), 0);
                this._shadowOrthoScale = 0.1;
                /**
                 * Automatically compute the projection matrix to best fit (including all the casters)
                 * on each frame.
                 */
                this.autoUpdateExtends = __runInitializers(this, _autoUpdateExtends_initializers, true);
                /**
                 * Automatically compute the shadowMinZ and shadowMaxZ for the projection matrix to best fit (including all the casters)
                 * on each frame. autoUpdateExtends must be set to true for this to work
                 */
                this.autoCalcShadowZBounds = (__runInitializers(this, _autoUpdateExtends_extraInitializers), __runInitializers(this, _autoCalcShadowZBounds_initializers, false));
                // Cache
                this._orthoLeft = (__runInitializers(this, _autoCalcShadowZBounds_extraInitializers), __runInitializers(this, __orthoLeft_initializers, Number.MAX_VALUE));
                this._orthoRight = (__runInitializers(this, __orthoLeft_extraInitializers), __runInitializers(this, __orthoRight_initializers, Number.MIN_VALUE));
                this._orthoTop = (__runInitializers(this, __orthoRight_extraInitializers), __runInitializers(this, __orthoTop_initializers, Number.MIN_VALUE));
                this._orthoBottom = (__runInitializers(this, __orthoTop_extraInitializers), __runInitializers(this, __orthoBottom_initializers, Number.MAX_VALUE));
                __runInitializers(this, __orthoBottom_extraInitializers);
                this.position = direction.scale(-1.0);
                this.direction = direction;
            }
            /**
             * Returns the string "DirectionalLight".
             * @returns The class name
             */
            getClassName() {
                return "DirectionalLight";
            }
            /**
             * Returns the integer 1.
             * @returns The light Type id as a constant defines in Light.LIGHTTYPEID_x
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            getTypeID() {
                return Light.LIGHTTYPEID_DIRECTIONALLIGHT;
            }
            /**
             * Sets the passed matrix "matrix" as projection matrix for the shadows cast by the light according to the passed view matrix.
             * Returns the DirectionalLight Shadow projection matrix.
             * @param matrix
             * @param viewMatrix
             * @param renderList
             */
            _setDefaultShadowProjectionMatrix(matrix, viewMatrix, renderList) {
                if (this.shadowFrustumSize > 0) {
                    this._setDefaultFixedFrustumShadowProjectionMatrix(matrix);
                }
                else {
                    this._setDefaultAutoExtendShadowProjectionMatrix(matrix, viewMatrix, renderList);
                }
            }
            /**
             * Sets the passed matrix "matrix" as fixed frustum projection matrix for the shadows cast by the light according to the passed view matrix.
             * Returns the DirectionalLight Shadow projection matrix.
             * @param matrix
             */
            _setDefaultFixedFrustumShadowProjectionMatrix(matrix) {
                const activeCamera = this.getScene().activeCamera;
                Matrix.OrthoLHToRef(this.shadowFrustumSize, this.shadowFrustumSize, this.shadowMinZ !== undefined ? this.shadowMinZ : activeCamera ? activeCamera.minZ : 0, this.shadowMaxZ !== undefined ? this.shadowMaxZ : activeCamera ? activeCamera.maxZ : 10000, matrix, this.getScene().getEngine().isNDCHalfZRange);
            }
            /**
             * Sets the passed matrix "matrix" as auto extend projection matrix for the shadows cast by the light according to the passed view matrix.
             * Returns the DirectionalLight Shadow projection matrix.
             * @param matrix
             * @param viewMatrix
             * @param renderList
             */
            _setDefaultAutoExtendShadowProjectionMatrix(matrix, viewMatrix, renderList) {
                const activeCamera = this.getScene().activeCamera;
                // Check extends
                if (this.autoUpdateExtends || this._orthoLeft === Number.MAX_VALUE) {
                    const tempVector3 = Vector3.Zero();
                    this._orthoLeft = Number.MAX_VALUE;
                    this._orthoRight = -Number.MAX_VALUE;
                    this._orthoTop = -Number.MAX_VALUE;
                    this._orthoBottom = Number.MAX_VALUE;
                    let shadowMinZ = Number.MAX_VALUE;
                    let shadowMaxZ = -Number.MAX_VALUE;
                    for (let meshIndex = 0; meshIndex < renderList.length; meshIndex++) {
                        const mesh = renderList[meshIndex];
                        if (!mesh) {
                            continue;
                        }
                        const boundingInfo = mesh.getBoundingInfo();
                        const boundingBox = boundingInfo.boundingBox;
                        for (let index = 0; index < boundingBox.vectorsWorld.length; index++) {
                            Vector3.TransformCoordinatesToRef(boundingBox.vectorsWorld[index], viewMatrix, tempVector3);
                            if (tempVector3.x < this._orthoLeft) {
                                this._orthoLeft = tempVector3.x;
                            }
                            if (tempVector3.y < this._orthoBottom) {
                                this._orthoBottom = tempVector3.y;
                            }
                            if (tempVector3.x > this._orthoRight) {
                                this._orthoRight = tempVector3.x;
                            }
                            if (tempVector3.y > this._orthoTop) {
                                this._orthoTop = tempVector3.y;
                            }
                            if (this.autoCalcShadowZBounds) {
                                if (tempVector3.z < shadowMinZ) {
                                    shadowMinZ = tempVector3.z;
                                }
                                if (tempVector3.z > shadowMaxZ) {
                                    shadowMaxZ = tempVector3.z;
                                }
                            }
                        }
                    }
                    if (this.autoCalcShadowZBounds) {
                        this._shadowMinZ = shadowMinZ;
                        this._shadowMaxZ = shadowMaxZ;
                    }
                }
                const xOffset = this._orthoRight - this._orthoLeft;
                const yOffset = this._orthoTop - this._orthoBottom;
                const minZ = this.shadowMinZ !== undefined ? this.shadowMinZ : activeCamera?.minZ || 0;
                const maxZ = this.shadowMaxZ !== undefined ? this.shadowMaxZ : activeCamera?.maxZ || 10000;
                const useReverseDepthBuffer = this.getScene().getEngine().useReverseDepthBuffer;
                Matrix.OrthoOffCenterLHToRef(this._orthoLeft - xOffset * this.shadowOrthoScale, this._orthoRight + xOffset * this.shadowOrthoScale, this._orthoBottom - yOffset * this.shadowOrthoScale, this._orthoTop + yOffset * this.shadowOrthoScale, useReverseDepthBuffer ? maxZ : minZ, useReverseDepthBuffer ? minZ : maxZ, matrix, this.getScene().getEngine().isNDCHalfZRange);
            }
            _buildUniformLayout() {
                this._uniformBuffer.addUniform("vLightData", 4);
                this._uniformBuffer.addUniform("vLightDiffuse", 4);
                this._uniformBuffer.addUniform("vLightSpecular", 4);
                this._uniformBuffer.addUniform("shadowsInfo", 3);
                this._uniformBuffer.addUniform("depthValues", 2);
                this._uniformBuffer.create();
            }
            /**
             * Sets the passed Effect object with the DirectionalLight transformed position (or position if not parented) and the passed name.
             * @param effect The effect to update
             * @param lightIndex The index of the light in the effect to update
             * @returns The directional light
             */
            transferToEffect(effect, lightIndex) {
                if (this.computeTransformedInformation()) {
                    this._uniformBuffer.updateFloat4("vLightData", this.transformedDirection.x, this.transformedDirection.y, this.transformedDirection.z, 1, lightIndex);
                    return this;
                }
                this._uniformBuffer.updateFloat4("vLightData", this.direction.x, this.direction.y, this.direction.z, 1, lightIndex);
                return this;
            }
            transferToNodeMaterialEffect(effect, lightDataUniformName) {
                if (this.computeTransformedInformation()) {
                    effect.setFloat3(lightDataUniformName, this.transformedDirection.x, this.transformedDirection.y, this.transformedDirection.z);
                    return this;
                }
                effect.setFloat3(lightDataUniformName, this.direction.x, this.direction.y, this.direction.z);
                return this;
            }
            /**
             * Gets the minZ used for shadow according to both the scene and the light.
             *
             * Values are fixed on directional lights as it relies on an ortho projection hence the need to convert being
             * -1 and 1 to 0 and 1 doing (depth + min) / (min + max) -> (depth + 1) / (1 + 1) -> (depth * 0.5) + 0.5.
             * (when not using reverse depth buffer / NDC half Z range)
             * @param _activeCamera The camera we are returning the min for (not used)
             * @returns the depth min z
             */
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            getDepthMinZ(_activeCamera) {
                const engine = this._scene.getEngine();
                return !engine.useReverseDepthBuffer && engine.isNDCHalfZRange ? 0 : 1;
            }
            /**
             * Gets the maxZ used for shadow according to both the scene and the light.
             *
             * Values are fixed on directional lights as it relies on an ortho projection hence the need to convert being
             * -1 and 1 to 0 and 1 doing (depth + min) / (min + max) -> (depth + 1) / (1 + 1) -> (depth * 0.5) + 0.5.
             * (when not using reverse depth buffer / NDC half Z range)
             * @param _activeCamera The camera we are returning the max for
             * @returns the depth max z
             */
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            getDepthMaxZ(_activeCamera) {
                const engine = this._scene.getEngine();
                return engine.useReverseDepthBuffer && engine.isNDCHalfZRange ? 0 : 1;
            }
            /**
             * Prepares the list of defines specific to the light type.
             * @param defines the list of defines
             * @param lightIndex defines the index of the light for the effect
             */
            prepareLightSpecificDefines(defines, lightIndex) {
                defines["DIRLIGHT" + lightIndex] = true;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_shadowFrustumSize_decorators = [serialize()];
            _get_shadowOrthoScale_decorators = [serialize()];
            _autoUpdateExtends_decorators = [serialize()];
            _autoCalcShadowZBounds_decorators = [serialize()];
            __orthoLeft_decorators = [serialize("orthoLeft")];
            __orthoRight_decorators = [serialize("orthoRight")];
            __orthoTop_decorators = [serialize("orthoTop")];
            __orthoBottom_decorators = [serialize("orthoBottom")];
            __esDecorate(_a, null, _get_shadowFrustumSize_decorators, { kind: "getter", name: "shadowFrustumSize", static: false, private: false, access: { has: obj => "shadowFrustumSize" in obj, get: obj => obj.shadowFrustumSize }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_shadowOrthoScale_decorators, { kind: "getter", name: "shadowOrthoScale", static: false, private: false, access: { has: obj => "shadowOrthoScale" in obj, get: obj => obj.shadowOrthoScale }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _autoUpdateExtends_decorators, { kind: "field", name: "autoUpdateExtends", static: false, private: false, access: { has: obj => "autoUpdateExtends" in obj, get: obj => obj.autoUpdateExtends, set: (obj, value) => { obj.autoUpdateExtends = value; } }, metadata: _metadata }, _autoUpdateExtends_initializers, _autoUpdateExtends_extraInitializers);
            __esDecorate(null, null, _autoCalcShadowZBounds_decorators, { kind: "field", name: "autoCalcShadowZBounds", static: false, private: false, access: { has: obj => "autoCalcShadowZBounds" in obj, get: obj => obj.autoCalcShadowZBounds, set: (obj, value) => { obj.autoCalcShadowZBounds = value; } }, metadata: _metadata }, _autoCalcShadowZBounds_initializers, _autoCalcShadowZBounds_extraInitializers);
            __esDecorate(null, null, __orthoLeft_decorators, { kind: "field", name: "_orthoLeft", static: false, private: false, access: { has: obj => "_orthoLeft" in obj, get: obj => obj._orthoLeft, set: (obj, value) => { obj._orthoLeft = value; } }, metadata: _metadata }, __orthoLeft_initializers, __orthoLeft_extraInitializers);
            __esDecorate(null, null, __orthoRight_decorators, { kind: "field", name: "_orthoRight", static: false, private: false, access: { has: obj => "_orthoRight" in obj, get: obj => obj._orthoRight, set: (obj, value) => { obj._orthoRight = value; } }, metadata: _metadata }, __orthoRight_initializers, __orthoRight_extraInitializers);
            __esDecorate(null, null, __orthoTop_decorators, { kind: "field", name: "_orthoTop", static: false, private: false, access: { has: obj => "_orthoTop" in obj, get: obj => obj._orthoTop, set: (obj, value) => { obj._orthoTop = value; } }, metadata: _metadata }, __orthoTop_initializers, __orthoTop_extraInitializers);
            __esDecorate(null, null, __orthoBottom_decorators, { kind: "field", name: "_orthoBottom", static: false, private: false, access: { has: obj => "_orthoBottom" in obj, get: obj => obj._orthoBottom, set: (obj, value) => { obj._orthoBottom = value; } }, metadata: _metadata }, __orthoBottom_initializers, __orthoBottom_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { DirectionalLight };
let _Registered = false;
/**
 * Register side effects for directionalLight.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterDirectionalLight() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Node.AddNodeConstructor("Light_Type_1", (name, scene) => {
        return () => new DirectionalLight(name, Vector3.Zero(), scene);
    });
    // Register Class Name
    RegisterClass("BABYLON.DirectionalLight", DirectionalLight);
}
//# sourceMappingURL=directionalLight.pure.js.map