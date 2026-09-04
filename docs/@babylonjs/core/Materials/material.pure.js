/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { serialize } from "../Misc/decorators.js";
import { Tools } from "../Misc/tools.pure.js";
import { Observable } from "../Misc/observable.pure.js";
import { EngineStore } from "../Engines/engineStore.js";
import { SubMesh } from "../Meshes/subMesh.pure.js";
import { UniformBuffer } from "./uniformBuffer.js";

import { Logger } from "../Misc/logger.js";
import { Plane } from "../Maths/math.plane.js";
import { DrawWrapper } from "./drawWrapper.js";
import { MaterialStencilState } from "./materialStencilState.js";
import { BindSceneUniformBuffer } from "./materialHelper.functions.js";
import { SerializationHelper } from "../Misc/decorators.serialization.js";
import { IsWrapper } from "./drawWrapper.functions.js";
/**
 * Base class for the main features of a material in Babylon.js
 */
let Material = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _uniqueId_decorators;
    let _uniqueId_initializers = [];
    let _uniqueId_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _checkReadyOnEveryCall_decorators;
    let _checkReadyOnEveryCall_initializers = [];
    let _checkReadyOnEveryCall_extraInitializers = [];
    let _checkReadyOnlyOnce_decorators;
    let _checkReadyOnlyOnce_initializers = [];
    let _checkReadyOnlyOnce_extraInitializers = [];
    let _state_decorators;
    let _state_initializers = [];
    let _state_extraInitializers = [];
    let __alpha_decorators;
    let __alpha_initializers = [];
    let __alpha_extraInitializers = [];
    let __backFaceCulling_decorators;
    let __backFaceCulling_initializers = [];
    let __backFaceCulling_extraInitializers = [];
    let __textureRepetitionMode_decorators;
    let __textureRepetitionMode_initializers = [];
    let __textureRepetitionMode_extraInitializers = [];
    let _textureRepetitionHexTilingParams_decorators;
    let _textureRepetitionHexTilingParams_initializers = [];
    let _textureRepetitionHexTilingParams_extraInitializers = [];
    let __cullBackFaces_decorators;
    let __cullBackFaces_initializers = [];
    let __cullBackFaces_extraInitializers = [];
    let _sideOrientation_decorators;
    let _sideOrientation_initializers = [];
    let _sideOrientation_extraInitializers = [];
    let __alphaMode_decorators;
    let __alphaMode_initializers = [];
    let __alphaMode_extraInitializers = [];
    let __needDepthPrePass_decorators;
    let __needDepthPrePass_initializers = [];
    let __needDepthPrePass_extraInitializers = [];
    let _disableDepthWrite_decorators;
    let _disableDepthWrite_initializers = [];
    let _disableDepthWrite_extraInitializers = [];
    let _disableColorWrite_decorators;
    let _disableColorWrite_initializers = [];
    let _disableColorWrite_extraInitializers = [];
    let _forceDepthWrite_decorators;
    let _forceDepthWrite_initializers = [];
    let _forceDepthWrite_extraInitializers = [];
    let _depthFunction_decorators;
    let _depthFunction_initializers = [];
    let _depthFunction_extraInitializers = [];
    let _separateCullingPass_decorators;
    let _separateCullingPass_initializers = [];
    let _separateCullingPass_extraInitializers = [];
    let __fogEnabled_decorators;
    let __fogEnabled_initializers = [];
    let __fogEnabled_extraInitializers = [];
    let _pointSize_decorators;
    let _pointSize_initializers = [];
    let _pointSize_extraInitializers = [];
    let _zOffset_decorators;
    let _zOffset_initializers = [];
    let _zOffset_extraInitializers = [];
    let _zOffsetUnits_decorators;
    let _zOffsetUnits_initializers = [];
    let _zOffsetUnits_extraInitializers = [];
    let _get_pointsCloud_decorators;
    let _get_fillMode_decorators;
    let _get_useLogarithmicDepth_decorators;
    let __isVertexOutputInvariant_decorators;
    let __isVertexOutputInvariant_initializers = [];
    let __isVertexOutputInvariant_extraInitializers = [];
    let _get_transparencyMode_decorators;
    return _a = class Material {
            /**
             * Tells the engine to draw geometry using vertex pulling instead of index drawing. This will automatically
             * set the vertex buffers as storage buffers and make them accessible to the vertex shader (WebGPU only).
             */
            get useVertexPulling() {
                return this._useVertexPulling;
            }
            set useVertexPulling(value) {
                if (this._useVertexPulling === value) {
                    return;
                }
                this._useVertexPulling = value;
                this.markAsDirty(_a.MiscDirtyFlag);
            }
            /** @internal */
            get _supportGlowLayer() {
                return false;
            }
            /** @internal */
            set _glowModeEnabled(value) {
                // Do nothing here
            }
            /**
             * Gets the shader language used in this material.
             */
            get shaderLanguage() {
                return this._shaderLanguage;
            }
            /**
             * If the material can be rendered to several textures with MRT extension
             */
            get canRenderToMRT() {
                // By default, shaders are not compatible with MRTs
                // Base classes should override that if their shader supports MRT
                return false;
            }
            /**
             * Sets the alpha value of the material
             */
            set alpha(value) {
                if (this._alpha === value) {
                    return;
                }
                const oldValue = this._alpha;
                this._alpha = value;
                // Only call dirty when there is a state change (no alpha / alpha)
                if (oldValue === 1 || value === 1) {
                    this.markAsDirty(_a.MiscDirtyFlag + _a.PrePassDirtyFlag);
                }
            }
            /**
             * Gets the alpha value of the material
             */
            get alpha() {
                return this._alpha;
            }
            /**
             * Sets the culling state (true to enable culling, false to disable)
             */
            set backFaceCulling(value) {
                if (this._backFaceCulling === value) {
                    return;
                }
                this._backFaceCulling = value;
                this.markAsDirty(_a.TextureDirtyFlag);
            }
            /**
             * Gets the culling state
             */
            get backFaceCulling() {
                return this._backFaceCulling;
            }
            /**
             * Sets the texture repetition breaking mode.
             * Use one of the undefined* values to break visible texture tiling patterns.
             * Ordered by cost: NONE (1 fetch), NOISE_BLEND (3), HEX_TILING (3), TILE_RANDOMIZATION (4), VORONOI_BOMBING (9).
             * Not supported on WebGL1 — the mode will be forced to NONE.
             * @see https://iquilezles.org/articles/texturerepetition/
             * @see https://jcgt.org/published/0011/03/05/
             */
            set textureRepetitionMode(value) {
                const clamped = Math.max(0, Math.min(value | 0, 4));
                if (this._textureRepetitionMode === clamped) {
                    return;
                }
                this._textureRepetitionMode = clamped;
                this.markAsDirty(_a.TextureDirtyFlag);
            }
            /**
             * Gets the texture repetition breaking mode.
             * @see https://iquilezles.org/articles/texturerepetition/
             */
            get textureRepetitionMode() {
                return this._textureRepetitionMode;
            }
            /**
             * Sets the type of faces that should be culled (true for back faces, false for front faces)
             */
            set cullBackFaces(value) {
                if (this._cullBackFaces === value) {
                    return;
                }
                this._cullBackFaces = value;
                this.markAsDirty(_a.TextureDirtyFlag);
            }
            /**
             * Gets the type of faces that should be culled
             */
            get cullBackFaces() {
                return this._cullBackFaces;
            }
            /**
             * Block the dirty-mechanism for this specific material
             * When set to false after being true the material will be marked as dirty.
             */
            get blockDirtyMechanism() {
                return this._blockDirtyMechanism;
            }
            set blockDirtyMechanism(value) {
                if (this._blockDirtyMechanism === value) {
                    return;
                }
                this._blockDirtyMechanism = value;
                if (!value) {
                    this.markDirty();
                }
            }
            /**
             * This allows you to modify the material without marking it as dirty after every change.
             * This function should be used if you need to make more than one dirty-enabling change to the material - adding a texture, setting a new fill mode and so on.
             * The callback will pass the material as an argument, so you can make your changes to it.
             * @param callback the callback to be executed that will update the material
             */
            atomicMaterialsUpdate(callback) {
                this.blockDirtyMechanism = true;
                try {
                    callback(this);
                }
                finally {
                    this.blockDirtyMechanism = false;
                }
            }
            /**
             * Gets a boolean indicating that current material needs to register RTT
             */
            get hasRenderTargetTextures() {
                this._eventInfo.hasRenderTargetTextures = false;
                this._callbackPluginEventHasRenderTargetTextures(this._eventInfo);
                return this._eventInfo.hasRenderTargetTextures;
            }
            /**
             * Called during a dispose event
             */
            set onDispose(callback) {
                if (this._onDisposeObserver) {
                    this.onDisposeObservable.remove(this._onDisposeObserver);
                }
                this._onDisposeObserver = this.onDisposeObservable.add(callback);
            }
            /**
             * An event triggered when the material is bound
             */
            get onBindObservable() {
                if (!this._onBindObservable) {
                    this._onBindObservable = new Observable();
                }
                return this._onBindObservable;
            }
            /**
             * Called during a bind event
             */
            set onBind(callback) {
                if (this._onBindObserver) {
                    this.onBindObservable.remove(this._onBindObserver);
                }
                this._onBindObserver = this.onBindObservable.add(callback);
            }
            /**
             * An event triggered when the material is unbound
             */
            get onUnBindObservable() {
                if (!this._onUnBindObservable) {
                    this._onUnBindObservable = new Observable();
                }
                return this._onUnBindObservable;
            }
            /**
             * An event triggered when the effect is (re)created
             */
            get onEffectCreatedObservable() {
                if (!this._onEffectCreatedObservable) {
                    this._onEffectCreatedObservable = new Observable();
                }
                return this._onEffectCreatedObservable;
            }
            /**
             * Sets the value of the alpha mode.
             *
             * | Value | Type | Description |
             * | --- | --- | --- |
             * | 0 | ALPHA_DISABLE |  |
             * | 1 | ALPHA_ADD | Defines that alpha blending is COLOR=SRC_ALPHA * SRC + DEST, ALPHA=DEST_ALPHA |
             * | 2 | ALPHA_COMBINE | Defines that alpha blending is COLOR=SRC_ALPHA * SRC + (1 - SRC_ALPHA) * DEST, ALPHA=SRC_ALPHA + DEST_ALPHA |
             * | 3 | ALPHA_SUBTRACT | Defines that alpha blending is COLOR=(1 - SRC) * DEST, ALPHA=SRC_ALPHA + DEST_ALPHA |
             * | 4 | ALPHA_MULTIPLY | Defines that alpha blending is COLOR=DEST * SRC, ALPHA=SRC_ALPHA + DEST_ALPHA |
             * | 5 | ALPHA_MAXIMIZED | Defines that alpha blending is COLOR=SRC_ALPHA * SRC + (1 - SRC) * DEST, ALPHA=SRC_ALPHA + DEST_ALPHA |
             * | 6 | ALPHA_ONEONE | Defines that alpha blending is COLOR=SRC + DEST, ALPHA=DEST_ALPHA |
             * | 7 | ALPHA_PREMULTIPLIED | Defines that alpha blending is COLOR=SRC + (1 - SRC_ALPHA) * DEST, ALPHA=SRC_ALPHA + DEST_ALPHA |
             * | 8 | ALPHA_PREMULTIPLIED_PORTERDUFF | Defines that alpha blending is COLOR=SRC + (1 - SRC_ALPHA) * DEST, ALPHA=SRC_ALPHA + (1 - SRC_ALPHA) * DEST_ALPHA |
             * | 9 | ALPHA_INTERPOLATE | Defines that alpha blending is COLOR=CST * SRC + (1 - CST) * DEST, ALPHA=CST_ALPHA * SRC + (1 - CST_ALPHA) * DEST_ALPHA |
             * | 10 | ALPHA_SCREENMODE | Defines that alpha blending is COLOR=SRC + (1 - SRC) * DEST, ALPHA=SRC_ALPHA + (1 - SRC_ALPHA) * DEST_ALPHA |
             * | 11 | ALPHA_ONEONE_ONEONE | Defines that alpha blending is COLOR=SRC + DST, ALPHA=SRC_ALPHA + DEST_ALPHA |
             * | 12 | ALPHA_ALPHATOCOLOR | Defines that alpha blending is COLOR=DEST_ALPHA * SRC + DST, ALPHA=0 |
             * | 13 | ALPHA_REVERSEONEMINUS | Defines that alpha blending is COLOR=(1 - DEST) * SRC + (1 - SRC) * DEST, ALPHA=(1 - DEST_ALPHA) * SRC_ALPHA + (1 - SRC_ALPHA) * DEST_ALPHA |
             * | 14 | ALPHA_SRC_DSTONEMINUSSRCALPHA | Defines that alpha blending is ALPHA=SRC + (1 - SRC ALPHA) * DEST, ALPHA=SRC_ALPHA + (1 - SRC ALPHA) * DEST_ALPHA |
             * | 15 | ALPHA_ONEONE_ONEZERO | Defines that alpha blending is COLOR=SRC + DST, ALPHA=SRC_ALPHA |
             * | 16 | ALPHA_EXCLUSION | Defines that alpha blending is COLOR=(1 - DEST) * SRC + (1 - SRC) * DEST, ALPHA=DEST_ALPHA |
             * | 17 | ALPHA_LAYER_ACCUMULATE | Defines that alpha blending is COLOR=SRC_ALPHA * SRC + (1 - SRC ALPHA) * DEST, ALPHA=SRC_ALPHA + (1 - SRC_ALPHA) * DEST_ALPHA |
             * | 18 | ALPHA_MIN | Defines that alpha blending is COLOR=MIN(SRC, DEST), ALPHA=MIN(SRC_ALPHA, DEST_ALPHA) |
             * | 19 | ALPHA_MAX | Defines that alpha blending is COLOR=MAX(SRC, DEST), ALPHA=MAX(SRC_ALPHA, DEST_ALPHA) |
             * | 20 | ALPHA_DUAL_SRC0_ADD_SRC1xDST | Defines that alpha blending uses dual source blending and is COLOR=SRC + SRC1 * DEST, ALPHA=DST_ALPHA |
             * | 21 | ALPHA_REPLACE_COLOR | Defines that alpha blending is COLOR=SRC, ALPHA=SRC_ALPHA + (1 - SRC_ALPHA) * DEST_ALPHA |
             *
             */
            set alphaMode(value) {
                if (this._alphaMode[0] === value) {
                    return;
                }
                this._alphaMode[0] = value;
                this.markAsDirty(_a.TextureDirtyFlag);
            }
            /**
             * Gets the value of the alpha mode
             */
            get alphaMode() {
                return this._alphaMode[0];
            }
            /**
             * Gets the list of alpha modes (length greater than 1 for multi-targets)
             */
            get alphaModes() {
                return this._alphaMode;
            }
            /**
             * Sets the value of the alpha mode for a specific target index.
             * @param value The alpha mode value to set.
             * @param targetIndex The index of the target to set the alpha mode for. Defaults to 0.
             */
            setAlphaMode(value, targetIndex = 0) {
                if (this._alphaMode[targetIndex] === value) {
                    return;
                }
                this._alphaMode[targetIndex] = value;
                this.markAsDirty(_a.TextureDirtyFlag);
            }
            /**
             * Sets the need depth pre-pass value
             */
            set needDepthPrePass(value) {
                if (this._needDepthPrePass === value) {
                    return;
                }
                this._needDepthPrePass = value;
                if (this._needDepthPrePass) {
                    this.checkReadyOnEveryCall = true;
                }
            }
            /**
             * Gets the depth pre-pass value
             */
            get needDepthPrePass() {
                return this._needDepthPrePass;
            }
            /**
             * Can this material render to prepass
             */
            get isPrePassCapable() {
                return false;
            }
            /**
             * Sets the state for enabling fog
             */
            set fogEnabled(value) {
                if (this._fogEnabled === value) {
                    return;
                }
                this._fogEnabled = value;
                this.markAsDirty(_a.MiscDirtyFlag);
            }
            /**
             * Gets the value of the fog enabled state
             */
            get fogEnabled() {
                return this._fogEnabled;
            }
            get wireframe() {
                switch (this._fillMode) {
                    case _a.WireFrameFillMode:
                    case _a.LineListDrawMode:
                    case _a.LineLoopDrawMode:
                    case _a.LineStripDrawMode:
                        return true;
                }
                return this._scene.forceWireframe;
            }
            /**
             * Sets the state of wireframe mode
             */
            set wireframe(value) {
                this.fillMode = value ? _a.WireFrameFillMode : _a.TriangleFillMode;
            }
            /**
             * Gets the value specifying if point clouds are enabled
             */
            get pointsCloud() {
                switch (this._fillMode) {
                    case _a.PointFillMode:
                    case _a.PointListDrawMode:
                        return true;
                }
                return this._scene.forcePointsCloud;
            }
            /**
             * Sets the state of point cloud mode
             */
            set pointsCloud(value) {
                this.fillMode = value ? _a.PointFillMode : _a.TriangleFillMode;
            }
            /**
             * Gets the material fill mode
             */
            get fillMode() {
                return this._fillMode;
            }
            /**
             * Sets the material fill mode
             */
            set fillMode(value) {
                if (this._fillMode === value) {
                    return;
                }
                this._fillMode = value;
                this.markAsDirty(_a.MiscDirtyFlag);
            }
            /**
             * In case the depth buffer does not allow enough depth precision for your scene (might be the case in large scenes)
             * You can try switching to logarithmic depth.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/advanced/logarithmicDepthBuffer
             */
            get useLogarithmicDepth() {
                return this._useLogarithmicDepth;
            }
            set useLogarithmicDepth(value) {
                const fragmentDepthSupported = this.getScene().getEngine().getCaps().fragmentDepthSupported;
                if (value && !fragmentDepthSupported) {
                    Logger.Warn("Logarithmic depth has been requested for a material on a device that doesn't support it.");
                }
                this._useLogarithmicDepth = value && fragmentDepthSupported;
                this._markAllSubMeshesAsMiscDirty();
            }
            /**
             * Gets or sets the vertex output invariant state
             * Setting this property to true will force the shader compiler to disable some optimization to make sure the vertex output is always calculated
             * the same way across different compilation units.
             * You may need to enable this option if you are seeing some depth artifacts when using a depth pre-pass, for e.g.
             * Note that this may have an impact on performance, so leave this option disabled if not needed.
             */
            get isVertexOutputInvariant() {
                return this._isVertexOutputInvariant;
            }
            set isVertexOutputInvariant(value) {
                if (this._isVertexOutputInvariant === value) {
                    return;
                }
                this._isVertexOutputInvariant = value;
                this._markAllSubMeshesAsMiscDirty();
            }
            /** @internal */
            _getDrawWrapper() {
                return this._drawWrapper;
            }
            /**
             * @internal
             */
            _setDrawWrapper(drawWrapper) {
                this._drawWrapper = drawWrapper;
            }
            /**
             * Creates a material instance
             * @param name defines the name of the material
             * @param scene defines the scene to reference
             * @param doNotAdd specifies if the material should be added to the scene
             * @param forceGLSL Use the GLSL code generation for the shader (even on WebGPU). Default is false
             */
            constructor(name, scene, doNotAdd, forceGLSL = false) {
                /**
                 * Custom callback helping to override the default shader used in the material.
                 */
                this.customShaderNameResolve = __runInitializers(this, _instanceExtraInitializers);
                /**
                 * Custom shadow depth material to use for shadow rendering instead of the in-built one
                 */
                this.shadowDepthWrapper = null;
                /**
                 * Gets or sets a boolean indicating that the material is allowed (if supported) to do shader hot swapping.
                 * This means that the material can keep using a previous shader while a new one is being compiled.
                 * This is mostly used when shader parallel compilation is supported (true by default)
                 */
                this.allowShaderHotSwapping = true;
                /** Shader language used by the material */
                this._shaderLanguage = 0 /* ShaderLanguage.GLSL */;
                this._forceGLSL = false;
                this._useVertexPulling = false;
                /**
                 * The ID of the material
                 */
                this.id = __runInitializers(this, _id_initializers, void 0);
                /**
                 * Gets or sets the unique id of the material
                 */
                this.uniqueId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _uniqueId_initializers, void 0));
                /** @internal */
                this._loadedUniqueId = __runInitializers(this, _uniqueId_extraInitializers);
                /**
                 * The name of the material
                 */
                this.name = __runInitializers(this, _name_initializers, void 0);
                /**
                 * Gets or sets user defined metadata
                 */
                this.metadata = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _metadata_initializers, null));
                /** @internal */
                this._internalMetadata = __runInitializers(this, _metadata_extraInitializers);
                /**
                 * For internal use only. Please do not use.
                 */
                this.reservedDataStore = null;
                /**
                 * Specifies if the ready state should be checked on each call
                 */
                this.checkReadyOnEveryCall = __runInitializers(this, _checkReadyOnEveryCall_initializers, false);
                /**
                 * Specifies if the ready state should be checked once
                 */
                this.checkReadyOnlyOnce = (__runInitializers(this, _checkReadyOnEveryCall_extraInitializers), __runInitializers(this, _checkReadyOnlyOnce_initializers, false));
                /**
                 * The state of the material
                 */
                this.state = (__runInitializers(this, _checkReadyOnlyOnce_extraInitializers), __runInitializers(this, _state_initializers, ""));
                /**
                 * The alpha value of the material
                 */
                this._alpha = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, __alpha_initializers, 1.0));
                /**
                 * List of inspectable custom properties (used by the Inspector)
                 * @see https://doc.babylonjs.com/toolsAndResources/inspector#extensibility
                 */
                this.inspectableCustomProperties = __runInitializers(this, __alpha_extraInitializers);
                /**
                 * Specifies if back face culling is enabled
                 */
                this._backFaceCulling = __runInitializers(this, __backFaceCulling_initializers, true);
                this._textureRepetitionMode = (__runInitializers(this, __backFaceCulling_extraInitializers), __runInitializers(this, __textureRepetitionMode_initializers, 0));
                /**
                 * Parameters for the hex tiling texture repetition mode (TEXTURE_REPETITION_HEX_TILING).
                 * x = rotation strength (0..1, default 1.0) — how much each hex tile is rotated.
                 * y = fall-off contrast (0..1, default 0.6) — how much luminance affects blending weight at tile borders.
                 * z = exponent (1..20, default 7.0) — controls the sharpness of weight falloff between tiles.
                 * w = contrast (0..1, default 0.5) — boost blending contrast via Gain3 (0.5 = neutral, &gt;0.5 = higher contrast).
                 * @see https://jcgt.org/published/0011/03/05/
                 */
                this.textureRepetitionHexTilingParams = (__runInitializers(this, __textureRepetitionMode_extraInitializers), __runInitializers(this, _textureRepetitionHexTilingParams_initializers, [1.0, 0.6, 7.0, 0.5]));
                /**
                 * Specifies if back or front faces should be culled (when culling is enabled)
                 */
                this._cullBackFaces = (__runInitializers(this, _textureRepetitionHexTilingParams_extraInitializers), __runInitializers(this, __cullBackFaces_initializers, true));
                this._blockDirtyMechanism = (__runInitializers(this, __cullBackFaces_extraInitializers), false);
                /**
                 * Stores the value for side orientation
                 */
                this.sideOrientation = __runInitializers(this, _sideOrientation_initializers, null);
                /**
                 * Callback triggered when the material is compiled
                 */
                this.onCompiled = (__runInitializers(this, _sideOrientation_extraInitializers), null);
                /**
                 * Callback triggered when an error occurs
                 */
                this.onError = null;
                /**
                 * Callback triggered to get the render target textures
                 */
                this.getRenderTargetTextures = null;
                /**
                 * Specifies if the material should be serialized
                 */
                this.doNotSerialize = false;
                /**
                 * @internal
                 */
                this._storeEffectOnSubMeshes = false;
                /**
                 * Stores the animations for the material
                 */
                this.animations = null;
                /**
                 * An event triggered when the material is disposed
                 */
                this.onDisposeObservable = new Observable();
                /**
                 * An observer which watches for dispose events
                 */
                this._onDisposeObserver = null;
                this._onUnBindObservable = null;
                /**
                 * An observer which watches for bind events
                 */
                this._onBindObserver = null;
                /**
                 * Stores the value of the alpha mode
                 */
                this._alphaMode = __runInitializers(this, __alphaMode_initializers, [2]);
                /**
                 * Stores the state of the need depth pre-pass value
                 */
                this._needDepthPrePass = (__runInitializers(this, __alphaMode_extraInitializers), __runInitializers(this, __needDepthPrePass_initializers, false));
                /**
                 * Specifies if depth writing should be disabled
                 */
                this.disableDepthWrite = (__runInitializers(this, __needDepthPrePass_extraInitializers), __runInitializers(this, _disableDepthWrite_initializers, false));
                /**
                 * Specifies if color writing should be disabled
                 */
                this.disableColorWrite = (__runInitializers(this, _disableDepthWrite_extraInitializers), __runInitializers(this, _disableColorWrite_initializers, false));
                /**
                 * Specifies if depth writing should be forced
                 */
                this.forceDepthWrite = (__runInitializers(this, _disableColorWrite_extraInitializers), __runInitializers(this, _forceDepthWrite_initializers, false));
                /**
                 * Specifies the depth function that should be used. 0 means the default engine function
                 */
                this.depthFunction = (__runInitializers(this, _forceDepthWrite_extraInitializers), __runInitializers(this, _depthFunction_initializers, 0));
                /**
                 * Specifies if there should be a separate pass for culling
                 */
                this.separateCullingPass = (__runInitializers(this, _depthFunction_extraInitializers), __runInitializers(this, _separateCullingPass_initializers, false));
                /**
                 * Stores the state specifying if fog should be enabled
                 */
                this._fogEnabled = (__runInitializers(this, _separateCullingPass_extraInitializers), __runInitializers(this, __fogEnabled_initializers, true));
                /**
                 * Stores the size of points
                 */
                this.pointSize = (__runInitializers(this, __fogEnabled_extraInitializers), __runInitializers(this, _pointSize_initializers, 1.0));
                /**
                 * Stores the z offset Factor value
                 */
                this.zOffset = (__runInitializers(this, _pointSize_extraInitializers), __runInitializers(this, _zOffset_initializers, 0));
                /**
                 * Stores the z offset Units value
                 */
                this.zOffsetUnits = (__runInitializers(this, _zOffset_extraInitializers), __runInitializers(this, _zOffsetUnits_initializers, 0));
                /**
                 * Gets or sets the active clipplane 1
                 */
                this.clipPlane = __runInitializers(this, _zOffsetUnits_extraInitializers);
                /**
                 * Gives access to the stencil properties of the material
                 */
                this.stencil = new MaterialStencilState();
                this._isVertexOutputInvariant = __runInitializers(this, __isVertexOutputInvariant_initializers, _a.ForceVertexOutputInvariant);
                /**
                 * @internal
                 * Stores the effects for the material
                 */
                this._materialContext = __runInitializers(this, __isVertexOutputInvariant_extraInitializers);
                /**
                 * Specifies if uniform buffers should be used
                 */
                this._useUBO = false;
                /**
                 * Stores the fill mode state
                 */
                this._fillMode = _a.TriangleFillMode;
                /**
                 * Specifies if the depth write state should be cached
                 */
                this._cachedDepthWriteState = false;
                /**
                 * Specifies if the color write state should be cached
                 */
                this._cachedColorWriteState = false;
                /**
                 * Specifies if the depth function state should be cached
                 */
                this._cachedDepthFunctionState = 0;
                /** @internal */
                this._indexInSceneMaterialArray = -1;
                /** @internal */
                this.meshMap = null;
                /** @internal */
                this._parentContainer = null;
                /** @internal */
                this._uniformBufferLayoutBuilt = false;
                this._eventInfo = {}; // will be initialized before each event notification
                /** @internal */
                this._callbackPluginEventGeneric = () => void 0;
                /** @internal */
                this._callbackPluginEventIsReadyForSubMesh = () => void 0;
                /** @internal */
                this._callbackPluginEventPrepareDefines = () => void 0;
                /** @internal */
                this._callbackPluginEventPrepareDefinesBeforeAttributes = () => void 0;
                /** @internal */
                this._callbackPluginEventHardBindForSubMesh = () => void 0;
                /** @internal */
                this._callbackPluginEventBindForSubMesh = () => void 0;
                /** @internal */
                this._callbackPluginEventHasRenderTargetTextures = () => void 0;
                /** @internal */
                this._callbackPluginEventFillRenderTargetTextures = () => void 0;
                /**
                 * The transparency mode of the material.
                 */
                this._transparencyMode = null;
                this.name = name;
                const setScene = scene || EngineStore.LastCreatedScene;
                if (!setScene) {
                    return;
                }
                this._scene = setScene;
                this._dirtyCallbacks = {};
                this._forceGLSL = forceGLSL;
                this._dirtyCallbacks[1] = this._markAllSubMeshesAsTexturesDirty.bind(this);
                this._dirtyCallbacks[2] = this._markAllSubMeshesAsLightsDirty.bind(this);
                this._dirtyCallbacks[4] = this._markAllSubMeshesAsFresnelDirty.bind(this);
                this._dirtyCallbacks[8] = this._markAllSubMeshesAsAttributesDirty.bind(this);
                this._dirtyCallbacks[16] = this._markAllSubMeshesAsMiscDirty.bind(this);
                this._dirtyCallbacks[32] = this._markAllSubMeshesAsPrePassDirty.bind(this);
                this._dirtyCallbacks[127] = this._markAllSubMeshesAsAllDirty.bind(this);
                this.id = name || Tools.RandomId();
                this.uniqueId = this._scene.getUniqueId();
                this._materialContext = this._scene.getEngine().createMaterialContext();
                this._drawWrapper = new DrawWrapper(this._scene.getEngine(), false);
                this._drawWrapper.materialContext = this._materialContext;
                this._uniformBuffer = new UniformBuffer(this._scene.getEngine(), undefined, undefined, name);
                this._useUBO = this.getScene().getEngine().supportsUniformBuffers;
                this._createUniformBuffer();
                if (!doNotAdd) {
                    this._scene.addMaterial(this);
                }
                if (this._scene.useMaterialMeshMap) {
                    this.meshMap = {};
                }
                _a.OnEventObservable.notifyObservers(this, 1 /* MaterialPluginEvent.Created */);
            }
            /** @internal */
            _createUniformBuffer() {
                const engine = this.getScene().getEngine();
                this._uniformBuffer?.dispose();
                if (engine.isWebGPU && !this._forceGLSL) {
                    // Switch main UBO to non UBO to connect to leftovers UBO in webgpu
                    this._uniformBuffer = new UniformBuffer(engine, undefined, undefined, this.name, true);
                    this._shaderLanguage = 1 /* ShaderLanguage.WGSL */;
                }
                else {
                    this._uniformBuffer = new UniformBuffer(this._scene.getEngine(), undefined, undefined, this.name);
                }
                this._uniformBufferLayoutBuilt = false;
            }
            /**
             * Returns a string representation of the current material
             * @param fullDetails defines a boolean indicating which levels of logging is desired
             * @returns a string with material information
             */
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            toString(fullDetails) {
                const ret = "Name: " + this.name;
                return ret;
            }
            /**
             * Gets the class name of the material
             * @returns a string with the class name of the material
             */
            getClassName() {
                return "Material";
            }
            /** @internal */
            get _isMaterial() {
                return true;
            }
            /**
             * Specifies if updates for the material been locked
             */
            get isFrozen() {
                return this.checkReadyOnlyOnce;
            }
            /**
             * Locks updates for the material.
             *
             * Note: while a material is frozen, the scene can still rebind it at least
             * once per camera render (and again whenever another material was bound in
             * between). What can be skipped while the frozen material stays cached are
             * per-mesh updates performed during a rebind.
             *
             * This includes per-mesh morph target influences. If the same frozen
             * material is shared across several meshes that each have different
             * per-mesh morph influences, only the mesh that triggers the rebind updates
             * those values. Other meshes rendered afterward with the same cached frozen
             * material may reuse stale influences and render with the wrong values.
             *
             * For that scenario either keep the material unfrozen, clone the material
             * per mesh and freeze each clone, or `unfreeze()` before changing
             * influences and `freeze()` again afterwards.
             */
            freeze() {
                this.markDirty();
                this.checkReadyOnlyOnce = true;
            }
            /**
             * Unlocks updates for the material
             */
            unfreeze() {
                this.markDirty();
                this.checkReadyOnlyOnce = false;
            }
            /**
             * Specifies if the material is ready to be used
             * @param mesh defines the mesh to check
             * @param useInstances specifies if instances should be used
             * @returns a boolean indicating if the material is ready to be used
             */
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            isReady(mesh, useInstances) {
                return true;
            }
            /**
             * Specifies that the submesh is ready to be used
             * @param mesh defines the mesh to check
             * @param subMesh defines which submesh to check
             * @param useInstances specifies that instances should be used
             * @returns a boolean indicating that the submesh is ready or not
             */
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            isReadyForSubMesh(mesh, subMesh, useInstances) {
                const defines = subMesh.materialDefines;
                if (!defines) {
                    return false;
                }
                this._eventInfo.isReadyForSubMesh = true;
                this._eventInfo.defines = defines;
                this._callbackPluginEventIsReadyForSubMesh(this._eventInfo);
                return this._eventInfo.isReadyForSubMesh;
            }
            /**
             * Returns the material effect
             * @returns the effect associated with the material
             */
            getEffect() {
                return this._drawWrapper.effect;
            }
            /**
             * Returns the current scene
             * @returns a Scene
             */
            getScene() {
                return this._scene;
            }
            /** @internal */
            _getEffectiveOrientation(mesh) {
                return this.sideOrientation !== null ? this.sideOrientation : mesh.sideOrientation;
            }
            /**
             * Gets the current transparency mode.
             */
            get transparencyMode() {
                return this._transparencyMode;
            }
            /**
             * Sets the transparency mode of the material.
             *
             * | Value | Type                                | Description |
             * | ----- | ----------------------------------- | ----------- |
             * | 0     | OPAQUE                              |             |
             * | 1     | ALPHATEST                           |             |
             * | 2     | ALPHABLEND                          |             |
             * | 3     | ALPHATESTANDBLEND                   |             |
             *
             */
            set transparencyMode(value) {
                if (this._transparencyMode === value) {
                    return;
                }
                this._transparencyMode = value;
                this._markAllSubMeshesAsTexturesAndMiscDirty();
            }
            get _hasTransparencyMode() {
                return this._transparencyMode != null;
            }
            get _transparencyModeIsBlend() {
                return this._transparencyMode === _a.MATERIAL_ALPHABLEND || this._transparencyMode === _a.MATERIAL_ALPHATESTANDBLEND;
            }
            get _transparencyModeIsTest() {
                return this._transparencyMode === _a.MATERIAL_ALPHATEST || this._transparencyMode === _a.MATERIAL_ALPHATESTANDBLEND;
            }
            /**
             * Returns true if alpha blending should be disabled.
             */
            get _disableAlphaBlending() {
                return this._transparencyMode === _a.MATERIAL_OPAQUE || this._transparencyMode === _a.MATERIAL_ALPHATEST;
            }
            /**
             * Specifies whether or not this material should be rendered in alpha blend mode.
             * @returns a boolean specifying if alpha blending is needed
             * @deprecated Please use needAlphaBlendingForMesh instead
             */
            needAlphaBlending() {
                if (this._hasTransparencyMode) {
                    return this._transparencyModeIsBlend;
                }
                if (this._disableAlphaBlending) {
                    return false;
                }
                return this.alpha < 1.0;
            }
            /**
             * Specifies if the mesh will require alpha blending
             * @param mesh defines the mesh to check
             * @returns a boolean specifying if alpha blending is needed for the mesh
             */
            needAlphaBlendingForMesh(mesh) {
                if (this._hasTransparencyMode) {
                    return this._transparencyModeIsBlend;
                }
                if (mesh.visibility < 1.0) {
                    return true;
                }
                if (this._disableAlphaBlending) {
                    return false;
                }
                return mesh.hasVertexAlpha || this.needAlphaBlending();
            }
            /**
             * Specifies whether or not this material should be rendered in alpha test mode.
             * @returns a boolean specifying if an alpha test is needed.
             * @deprecated Please use needAlphaTestingForMesh instead
             */
            needAlphaTesting() {
                if (this._hasTransparencyMode) {
                    return this._transparencyModeIsTest;
                }
                return false;
            }
            /**
             * Specifies if material alpha testing should be turned on for the mesh
             * @param mesh defines the mesh to check
             * @returns a boolean specifying if alpha testing should be turned on for the mesh
             */
            needAlphaTestingForMesh(mesh) {
                if (this._hasTransparencyMode) {
                    return this._transparencyModeIsTest;
                }
                return !this.needAlphaBlendingForMesh(mesh) && this.needAlphaTesting();
            }
            /**
             * Gets the texture used for the alpha test
             * @returns the texture to use for alpha testing
             */
            getAlphaTestTexture() {
                return null;
            }
            /**
             * Marks the material to indicate that it needs to be re-calculated
             * @param forceMaterialDirty - Forces the material to be marked as dirty for all components (same as this.markAsDirty(Material.AllDirtyFlag)). You should use this flag if the material is frozen and you want to force a recompilation.
             */
            markDirty(forceMaterialDirty = false) {
                const meshes = this.getScene().meshes;
                for (const mesh of meshes) {
                    if (!mesh.subMeshes) {
                        continue;
                    }
                    for (const subMesh of mesh.subMeshes) {
                        if (subMesh.getMaterial() !== this) {
                            continue;
                        }
                        for (const drawWrapper of subMesh._drawWrappers) {
                            if (!drawWrapper) {
                                continue;
                            }
                            if (this._materialContext === drawWrapper.materialContext) {
                                drawWrapper._wasPreviouslyReady = false;
                                drawWrapper._wasPreviouslyUsingInstances = null;
                                drawWrapper._forceRebindOnNextCall = forceMaterialDirty;
                            }
                        }
                    }
                }
                if (forceMaterialDirty) {
                    this.markAsDirty(_a.AllDirtyFlag);
                }
            }
            /**
             * @internal
             */
            _preBind(effect, overrideOrientation = null) {
                const engine = this._scene.getEngine();
                const orientation = overrideOrientation == null ? this.sideOrientation : overrideOrientation;
                const reverse = orientation === _a.ClockWiseSideOrientation;
                const effectiveDrawWrapper = effect ? effect : this._getDrawWrapper();
                if (IsWrapper(effectiveDrawWrapper) && effectiveDrawWrapper.materialContext) {
                    effectiveDrawWrapper.materialContext.useVertexPulling = this.useVertexPulling;
                }
                engine.enableEffect(effectiveDrawWrapper);
                engine.setState(this.backFaceCulling, this.zOffset, false, reverse, this._scene._mirroredCameraPosition ? !this.cullBackFaces : this.cullBackFaces, this.stencil, this.zOffsetUnits);
                return reverse;
            }
            /**
             * Binds the material to the mesh
             * @param world defines the world transformation matrix
             * @param mesh defines the mesh to bind the material to
             */
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            bind(world, mesh) { }
            /**
             * Initializes the uniform buffer layout for the shader.
             */
            buildUniformLayout() {
                const ubo = this._uniformBuffer;
                this._eventInfo.ubo = ubo;
                this._callbackPluginEventGeneric(8 /* MaterialPluginEvent.PrepareUniformBuffer */, this._eventInfo);
                ubo.create();
                this._uniformBufferLayoutBuilt = true;
            }
            /**
             * Binds the submesh to the material
             * @param world defines the world transformation matrix
             * @param mesh defines the mesh containing the submesh
             * @param subMesh defines the submesh to bind the material to
             */
            bindForSubMesh(world, mesh, subMesh) {
                const drawWrapper = subMesh._drawWrapper;
                this._eventInfo.subMesh = subMesh;
                this._callbackPluginEventBindForSubMesh(this._eventInfo);
                drawWrapper._forceRebindOnNextCall = false;
            }
            /**
             * Binds the world matrix to the material
             * @param world defines the world transformation matrix
             */
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            bindOnlyWorldMatrix(world) { }
            /**
             * Binds the view matrix to the effect
             * @param effect defines the effect to bind the view matrix to
             */
            bindView(effect) {
                if (!this._useUBO) {
                    effect.setMatrix("view", this.getScene().getViewMatrix());
                }
                else {
                    this._needToBindSceneUbo = true;
                }
            }
            /**
             * Binds the view projection and projection matrices to the effect
             * @param effect defines the effect to bind the view projection and projection matrices to
             */
            bindViewProjection(effect) {
                if (!this._useUBO) {
                    effect.setMatrix("viewProjection", this.getScene().getTransformMatrix());
                    effect.setMatrix("projection", this.getScene().getProjectionMatrix());
                    effect.setMatrix("inverseProjection", this.getScene().getInverseProjectionMatrix());
                }
                else {
                    this._needToBindSceneUbo = true;
                }
            }
            /**
             * Binds the view matrix to the effect
             * @param effect defines the effect to bind the view matrix to
             * @param variableName name of the shader variable that will hold the eye position
             */
            bindEyePosition(effect, variableName) {
                if (!this._useUBO) {
                    this._scene.bindEyePosition(effect, variableName);
                }
                else {
                    this._needToBindSceneUbo = true;
                }
            }
            /**
             * Processes to execute after binding the material to a mesh
             * @param mesh defines the rendered mesh
             * @param effect defines the effect used to bind the material
             * @param _subMesh defines the subMesh that the material has been bound for
             */
            _afterBind(mesh, effect = null, _subMesh) {
                this._scene._cachedMaterial = this;
                if (this._needToBindSceneUbo) {
                    if (effect) {
                        this._needToBindSceneUbo = false;
                        BindSceneUniformBuffer(effect, this.getScene().getSceneUniformBuffer());
                        this._scene.finalizeSceneUbo();
                    }
                }
                if (mesh) {
                    this._scene._cachedVisibility = mesh.visibility;
                }
                else {
                    this._scene._cachedVisibility = 1;
                }
                if (this._onBindObservable && mesh) {
                    this._onBindObservable.notifyObservers(mesh);
                }
                if (this.disableDepthWrite) {
                    const engine = this._scene.getEngine();
                    this._cachedDepthWriteState = engine.getDepthWrite();
                    engine.setDepthWrite(false);
                }
                if (this.disableColorWrite) {
                    const engine = this._scene.getEngine();
                    this._cachedColorWriteState = engine.getColorWrite();
                    engine.setColorWrite(false);
                }
                if (this.depthFunction !== 0) {
                    const engine = this._scene.getEngine();
                    this._cachedDepthFunctionState = engine.getDepthFunction() || 0;
                    engine.setDepthFunction(this.depthFunction);
                }
            }
            /**
             * Unbinds the material from the mesh
             */
            unbind() {
                this._scene.getSceneUniformBuffer().unbindEffect();
                if (this._onUnBindObservable) {
                    this._onUnBindObservable.notifyObservers(this);
                }
                if (this.depthFunction !== 0) {
                    const engine = this._scene.getEngine();
                    engine.setDepthFunction(this._cachedDepthFunctionState);
                }
                if (this.disableDepthWrite) {
                    const engine = this._scene.getEngine();
                    engine.setDepthWrite(this._cachedDepthWriteState);
                }
                if (this.disableColorWrite) {
                    const engine = this._scene.getEngine();
                    engine.setColorWrite(this._cachedColorWriteState);
                }
            }
            /**
             * Returns the animatable textures.
             * @returns - Array of animatable textures.
             */
            getAnimatables() {
                this._eventInfo.animatables = [];
                this._callbackPluginEventGeneric(256 /* MaterialPluginEvent.GetAnimatables */, this._eventInfo);
                return this._eventInfo.animatables;
            }
            /**
             * Gets the active textures from the material
             * @returns an array of textures
             */
            getActiveTextures() {
                this._eventInfo.activeTextures = [];
                this._callbackPluginEventGeneric(512 /* MaterialPluginEvent.GetActiveTextures */, this._eventInfo);
                return this._eventInfo.activeTextures;
            }
            /**
             * Specifies if the material uses a texture
             * @param texture defines the texture to check against the material
             * @returns a boolean specifying if the material uses the texture
             */
            hasTexture(texture) {
                this._eventInfo.hasTexture = false;
                this._eventInfo.texture = texture;
                this._callbackPluginEventGeneric(1024 /* MaterialPluginEvent.HasTexture */, this._eventInfo);
                return this._eventInfo.hasTexture;
            }
            /**
             * Makes a duplicate of the material, and gives it a new name
             * @param name defines the new name for the duplicated material
             * @returns the cloned material
             */
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            clone(name) {
                return null;
            }
            _clonePlugins(targetMaterial, rootUrl) {
                const serializationObject = {};
                // Create plugins in targetMaterial in case they don't exist
                this._serializePlugins(serializationObject);
                _a._ParsePlugins(serializationObject, targetMaterial, this._scene, rootUrl);
                // Copy the properties of the current plugins to the cloned material's plugins
                if (this.pluginManager) {
                    for (const plugin of this.pluginManager._plugins) {
                        const targetPlugin = targetMaterial.pluginManager.getPlugin(plugin.name);
                        if (targetPlugin) {
                            plugin.copyTo(targetPlugin);
                        }
                    }
                }
            }
            /**
             * Gets the meshes bound to the material
             * @returns an array of meshes bound to the material
             */
            getBindedMeshes() {
                if (this.meshMap) {
                    const result = [];
                    for (const meshId in this.meshMap) {
                        const mesh = this.meshMap[meshId];
                        if (mesh) {
                            result.push(mesh);
                        }
                    }
                    return result;
                }
                else {
                    const meshes = this._scene.meshes;
                    return meshes.filter((mesh) => mesh.material === this);
                }
            }
            /**
             * Force shader compilation
             * @param mesh defines the mesh associated with this material
             * @param onCompiled defines a function to execute once the material is compiled
             * @param options defines the options to configure the compilation
             * @param onError defines a function to execute if the material fails compiling
             */
            forceCompilation(mesh, onCompiled, options, onError) {
                const localOptions = {
                    clipPlane: false,
                    useInstances: false,
                    ...options,
                };
                const scene = this.getScene();
                const currentHotSwapingState = this.allowShaderHotSwapping;
                this.allowShaderHotSwapping = false; // Turned off to let us evaluate the real compilation state
                const checkReady = () => {
                    if (!this._scene || !this._scene.getEngine()) {
                        return;
                    }
                    const clipPlaneState = scene.clipPlane;
                    if (localOptions.clipPlane) {
                        scene.clipPlane = new Plane(0, 0, 0, 1);
                    }
                    if (this._storeEffectOnSubMeshes) {
                        let allDone = true, lastError = null;
                        if (mesh.subMeshes) {
                            const tempSubMesh = new SubMesh(0, 0, 0, 0, 0, mesh, undefined, false, false);
                            if (tempSubMesh.materialDefines) {
                                tempSubMesh.materialDefines._renderId = -1;
                            }
                            if (!this.isReadyForSubMesh(mesh, tempSubMesh, localOptions.useInstances)) {
                                if (tempSubMesh.effect && tempSubMesh.effect.getCompilationError() && tempSubMesh.effect.allFallbacksProcessed()) {
                                    lastError = tempSubMesh.effect.getCompilationError();
                                }
                                else {
                                    allDone = false;
                                    setTimeout(checkReady, 16);
                                }
                            }
                        }
                        if (allDone) {
                            this.allowShaderHotSwapping = currentHotSwapingState;
                            if (lastError) {
                                if (onError) {
                                    onError(lastError);
                                }
                            }
                            if (onCompiled) {
                                onCompiled(this);
                            }
                        }
                    }
                    else {
                        if (this.isReady()) {
                            this.allowShaderHotSwapping = currentHotSwapingState;
                            if (onCompiled) {
                                onCompiled(this);
                            }
                        }
                        else {
                            setTimeout(checkReady, 16);
                        }
                    }
                    if (localOptions.clipPlane) {
                        scene.clipPlane = clipPlaneState;
                    }
                };
                checkReady();
            }
            /**
             * Force shader compilation
             * @param mesh defines the mesh that will use this material
             * @param options defines additional options for compiling the shaders
             * @returns a promise that resolves when the compilation completes
             */
            async forceCompilationAsync(mesh, options) {
                return await new Promise((resolve, reject) => {
                    this.forceCompilation(mesh, () => {
                        resolve();
                    }, options, (reason) => {
                        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                        reject(reason);
                    });
                });
            }
            /**
             * Marks a define in the material to indicate that it needs to be re-computed
             * @param flag defines a flag used to determine which parts of the material have to be marked as dirty
             */
            markAsDirty(flag) {
                if (this.getScene().blockMaterialDirtyMechanism || this._blockDirtyMechanism) {
                    return;
                }
                _a._DirtyCallbackArray.length = 0;
                if (flag & _a.ImageProcessingDirtyFlag) {
                    _a._DirtyCallbackArray.push(_a._ImageProcessingDirtyCallBack);
                }
                if (flag & _a.TextureDirtyFlag) {
                    _a._DirtyCallbackArray.push(_a._TextureDirtyCallBack);
                }
                if (flag & _a.LightDirtyFlag) {
                    _a._DirtyCallbackArray.push(_a._LightsDirtyCallBack);
                }
                if (flag & _a.FresnelDirtyFlag) {
                    _a._DirtyCallbackArray.push(_a._FresnelDirtyCallBack);
                }
                if (flag & _a.AttributesDirtyFlag) {
                    _a._DirtyCallbackArray.push(_a._AttributeDirtyCallBack);
                }
                if (flag & _a.MiscDirtyFlag) {
                    _a._DirtyCallbackArray.push(_a._MiscDirtyCallBack);
                }
                if (flag & _a.PrePassDirtyFlag) {
                    _a._DirtyCallbackArray.push(_a._PrePassDirtyCallBack);
                }
                if (_a._DirtyCallbackArray.length) {
                    this._markAllSubMeshesAsDirty(_a._RunDirtyCallBacks);
                }
                this.getScene().resetCachedMaterial();
            }
            /**
             * Resets the draw wrappers cache for all submeshes that are using this material
             */
            resetDrawCache() {
                const meshes = this.getScene().meshes;
                for (const mesh of meshes) {
                    if (!mesh.subMeshes) {
                        continue;
                    }
                    for (const subMesh of mesh.subMeshes) {
                        if (subMesh.getMaterial() !== this) {
                            continue;
                        }
                        subMesh.resetDrawCache();
                    }
                }
            }
            /**
             * Marks all submeshes of a material to indicate that their material defines need to be re-calculated
             * @param func defines a function which checks material defines against the submeshes
             */
            _markAllSubMeshesAsDirty(func) {
                const scene = this.getScene();
                if (scene.blockMaterialDirtyMechanism || this._blockDirtyMechanism) {
                    return;
                }
                const meshes = scene.meshes;
                for (const mesh of meshes) {
                    if (!mesh.subMeshes) {
                        continue;
                    }
                    for (const subMesh of mesh.subMeshes) {
                        // We want to skip the submeshes which are not using this material or which have not yet rendered at least once
                        const material = subMesh.getMaterial() || (scene._hasDefaultMaterial ? scene.defaultMaterial : null);
                        if (material !== this) {
                            continue;
                        }
                        for (const drawWrapper of subMesh._drawWrappers) {
                            if (!drawWrapper || !drawWrapper.defines || !drawWrapper.defines.markAllAsDirty) {
                                continue;
                            }
                            if (this._materialContext === drawWrapper.materialContext) {
                                func(drawWrapper.defines);
                            }
                        }
                    }
                }
            }
            /**
             * Indicates that the scene should check if the rendering now needs a prepass
             */
            _markScenePrePassDirty() {
                if (this.getScene().blockMaterialDirtyMechanism || this._blockDirtyMechanism) {
                    return;
                }
                const prePassRenderer = this.getScene().enablePrePassRenderer();
                if (prePassRenderer) {
                    prePassRenderer.markAsDirty();
                }
            }
            /**
             * Indicates that we need to re-calculated for all submeshes
             */
            _markAllSubMeshesAsAllDirty() {
                this._markAllSubMeshesAsDirty(_a._AllDirtyCallBack);
            }
            /**
             * Indicates that image processing needs to be re-calculated for all submeshes
             */
            _markAllSubMeshesAsImageProcessingDirty() {
                this._markAllSubMeshesAsDirty(_a._ImageProcessingDirtyCallBack);
            }
            /**
             * Indicates that textures need to be re-calculated for all submeshes
             */
            _markAllSubMeshesAsTexturesDirty() {
                this._markAllSubMeshesAsDirty(_a._TextureDirtyCallBack);
            }
            /**
             * Indicates that fresnel needs to be re-calculated for all submeshes
             */
            _markAllSubMeshesAsFresnelDirty() {
                this._markAllSubMeshesAsDirty(_a._FresnelDirtyCallBack);
            }
            /**
             * Indicates that fresnel and misc need to be re-calculated for all submeshes
             */
            _markAllSubMeshesAsFresnelAndMiscDirty() {
                this._markAllSubMeshesAsDirty(_a._FresnelAndMiscDirtyCallBack);
            }
            /**
             * Indicates that lights need to be re-calculated for all submeshes
             */
            _markAllSubMeshesAsLightsDirty() {
                this._markAllSubMeshesAsDirty(_a._LightsDirtyCallBack);
            }
            /**
             * Indicates that attributes need to be re-calculated for all submeshes
             */
            _markAllSubMeshesAsAttributesDirty() {
                this._markAllSubMeshesAsDirty(_a._AttributeDirtyCallBack);
            }
            /**
             * Indicates that misc needs to be re-calculated for all submeshes
             */
            _markAllSubMeshesAsMiscDirty() {
                this._markAllSubMeshesAsDirty(_a._MiscDirtyCallBack);
            }
            /**
             * Indicates that prepass needs to be re-calculated for all submeshes
             */
            _markAllSubMeshesAsPrePassDirty() {
                this._markAllSubMeshesAsDirty(_a._PrePassDirtyCallBack);
            }
            /**
             * Indicates that textures and misc need to be re-calculated for all submeshes
             */
            _markAllSubMeshesAsTexturesAndMiscDirty() {
                this._markAllSubMeshesAsDirty(_a._TextureAndMiscDirtyCallBack);
            }
            _checkScenePerformancePriority() {
                if (this._scene.performancePriority !== 0 /* ScenePerformancePriority.BackwardCompatible */) {
                    this.checkReadyOnlyOnce = true;
                    // re-set the flag when the perf priority changes
                    const observer = this._scene.onScenePerformancePriorityChangedObservable.addOnce(() => {
                        this.checkReadyOnlyOnce = false;
                    });
                    // if this material is disposed before the scene is disposed, cleanup the observer
                    this.onDisposeObservable.add(() => {
                        this._scene.onScenePerformancePriorityChangedObservable.remove(observer);
                    });
                }
            }
            /**
             * Sets the required values to the prepass renderer.
             * @param prePassRenderer defines the prepass renderer to setup.
             * @returns true if the pre pass is needed.
             */
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            setPrePassRenderer(prePassRenderer) {
                // Do Nothing by default
                return false;
            }
            /**
             * Disposes the material
             * @param _forceDisposeEffect kept for backward compat. We reference count the effect now.
             * @param forceDisposeTextures specifies if textures should be forcefully disposed
             * @param notBoundToMesh specifies if the material that is being disposed is known to be not bound to any mesh
             */
            dispose(_forceDisposeEffect, forceDisposeTextures, notBoundToMesh) {
                const scene = this.getScene();
                // Animations
                scene.stopAnimation(this);
                scene.freeProcessedMaterials();
                // Remove from scene
                scene.removeMaterial(this);
                this._eventInfo.forceDisposeTextures = forceDisposeTextures;
                this._callbackPluginEventGeneric(2 /* MaterialPluginEvent.Disposed */, this._eventInfo);
                if (this._parentContainer) {
                    const index = this._parentContainer.materials.indexOf(this);
                    if (index > -1) {
                        this._parentContainer.materials.splice(index, 1);
                    }
                    this._parentContainer = null;
                }
                if (notBoundToMesh !== true) {
                    // Remove from meshes
                    if (this.meshMap) {
                        for (const meshId in this.meshMap) {
                            const mesh = this.meshMap[meshId];
                            this._disposeMeshResources(mesh);
                        }
                    }
                    else {
                        const meshes = scene.meshes;
                        for (const mesh of meshes) {
                            this._disposeMeshResources(mesh);
                        }
                    }
                }
                this._uniformBuffer.dispose();
                // Shader are kept in cache for further use but we can get rid of this by using forceDisposeEffect
                if (this._drawWrapper.effect) {
                    if (!this._storeEffectOnSubMeshes) {
                        this._drawWrapper.effect.dispose();
                    }
                    this._drawWrapper.effect = null;
                }
                this.metadata = null;
                // Callback
                this.onDisposeObservable.notifyObservers(this);
                this.onDisposeObservable.clear();
                if (this._onBindObservable) {
                    this._onBindObservable.clear();
                }
                if (this._onUnBindObservable) {
                    this._onUnBindObservable.clear();
                }
                if (this._onEffectCreatedObservable) {
                    this._onEffectCreatedObservable.clear();
                }
                if (this._eventInfo) {
                    this._eventInfo = {};
                }
            }
            _disposeMeshResources(mesh) {
                if (!mesh) {
                    return;
                }
                const geometry = mesh.geometry;
                const materialForRenderPass = mesh._internalAbstractMeshDataInfo._materialForRenderPass;
                if (this._storeEffectOnSubMeshes) {
                    if (mesh.subMeshes && materialForRenderPass) {
                        for (const subMesh of mesh.subMeshes) {
                            const drawWrappers = subMesh._drawWrappers;
                            for (let renderPassIndex = 0; renderPassIndex < drawWrappers.length; renderPassIndex++) {
                                const effect = drawWrappers[renderPassIndex]?.effect;
                                if (!effect) {
                                    continue;
                                }
                                const material = materialForRenderPass[renderPassIndex];
                                if (material === this) {
                                    geometry?._releaseVertexArrayObject(effect);
                                    subMesh._removeDrawWrapper(renderPassIndex, true, true);
                                }
                            }
                        }
                    }
                }
                else {
                    geometry?._releaseVertexArrayObject(this._drawWrapper.effect);
                }
                if (mesh.material === this && !mesh.sourceMesh) {
                    mesh.material = null;
                }
            }
            /**
             * Serializes this material
             * @returns the serialized material object
             */
            serialize() {
                const serializationObject = SerializationHelper.Serialize(this);
                serializationObject.stencil = this.stencil.serialize();
                serializationObject.uniqueId = this.uniqueId;
                this._serializePlugins(serializationObject);
                return serializationObject;
            }
            _serializePlugins(serializationObject) {
                serializationObject.plugins = {};
                if (this.pluginManager) {
                    for (const plugin of this.pluginManager._plugins) {
                        if (!plugin.doNotSerialize) {
                            serializationObject.plugins[plugin.getClassName()] = plugin.serialize();
                        }
                    }
                }
            }
            /**
             * Parses the alpha mode from the material data to parse
             * @param parsedMaterial defines the material data to parse
             * @param material defines the material to update
             */
            static ParseAlphaMode(parsedMaterial, material) {
                if (parsedMaterial._alphaMode !== undefined) {
                    material._alphaMode = Array.isArray(parsedMaterial._alphaMode) ? [...parsedMaterial._alphaMode] : [parsedMaterial._alphaMode];
                }
                else if (parsedMaterial.alphaMode !== undefined) {
                    material._alphaMode = Array.isArray(parsedMaterial.alphaMode) ? [...parsedMaterial.alphaMode] : [parsedMaterial.alphaMode];
                }
                else {
                    material._alphaMode = [2];
                }
            }
            /**
             * Creates a material from parsed material data
             * @param parsedMaterial defines parsed material data
             * @param scene defines the hosting scene
             * @param rootUrl defines the root URL to use to load textures
             * @returns a new material
             */
            static Parse(parsedMaterial, scene, rootUrl) {
                if (!parsedMaterial.customType) {
                    parsedMaterial.customType = "BABYLON.StandardMaterial";
                }
                else if (parsedMaterial.customType === "BABYLON.PBRMaterial" && parsedMaterial.overloadedAlbedo) {
                    parsedMaterial.customType = "BABYLON.LegacyPBRMaterial";
                    if (!BABYLON.LegacyPBRMaterial) {
                        Logger.Error("Your scene is trying to load a legacy version of the PBRMaterial, please, include it from the materials library.");
                        return null;
                    }
                }
                const materialType = Tools.Instantiate(parsedMaterial.customType);
                const material = materialType.Parse(parsedMaterial, scene, rootUrl);
                material._loadedUniqueId = parsedMaterial.uniqueId;
                _a.ParseAlphaMode(parsedMaterial, material);
                return material;
            }
            static _ParsePlugins(serializationObject, material, scene, rootUrl) {
                if (!serializationObject.plugins) {
                    return;
                }
                for (const pluginClassName in serializationObject.plugins) {
                    const pluginData = serializationObject.plugins[pluginClassName];
                    let plugin = material.pluginManager?.getPlugin(pluginData.name);
                    if (!plugin) {
                        const pluginClassType = Tools.Instantiate("BABYLON." + pluginClassName);
                        if (pluginClassType) {
                            plugin = new pluginClassType(material);
                        }
                    }
                    plugin?.parse(pluginData, scene, rootUrl);
                }
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [serialize()];
            _uniqueId_decorators = [serialize()];
            _name_decorators = [serialize()];
            _metadata_decorators = [serialize()];
            _checkReadyOnEveryCall_decorators = [serialize()];
            _checkReadyOnlyOnce_decorators = [serialize()];
            _state_decorators = [serialize()];
            __alpha_decorators = [serialize("alpha")];
            __backFaceCulling_decorators = [serialize("backFaceCulling")];
            __textureRepetitionMode_decorators = [serialize("textureRepetitionMode")];
            _textureRepetitionHexTilingParams_decorators = [serialize("textureRepetitionHexTilingParams")];
            __cullBackFaces_decorators = [serialize("cullBackFaces")];
            _sideOrientation_decorators = [serialize()];
            __alphaMode_decorators = [serialize()];
            __needDepthPrePass_decorators = [serialize()];
            _disableDepthWrite_decorators = [serialize()];
            _disableColorWrite_decorators = [serialize()];
            _forceDepthWrite_decorators = [serialize()];
            _depthFunction_decorators = [serialize()];
            _separateCullingPass_decorators = [serialize()];
            __fogEnabled_decorators = [serialize("fogEnabled")];
            _pointSize_decorators = [serialize()];
            _zOffset_decorators = [serialize()];
            _zOffsetUnits_decorators = [serialize()];
            _get_pointsCloud_decorators = [serialize()];
            _get_fillMode_decorators = [serialize()];
            _get_useLogarithmicDepth_decorators = [serialize()];
            __isVertexOutputInvariant_decorators = [serialize()];
            _get_transparencyMode_decorators = [serialize()];
            __esDecorate(_a, null, _get_pointsCloud_decorators, { kind: "getter", name: "pointsCloud", static: false, private: false, access: { has: obj => "pointsCloud" in obj, get: obj => obj.pointsCloud }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_fillMode_decorators, { kind: "getter", name: "fillMode", static: false, private: false, access: { has: obj => "fillMode" in obj, get: obj => obj.fillMode }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_useLogarithmicDepth_decorators, { kind: "getter", name: "useLogarithmicDepth", static: false, private: false, access: { has: obj => "useLogarithmicDepth" in obj, get: obj => obj.useLogarithmicDepth }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_transparencyMode_decorators, { kind: "getter", name: "transparencyMode", static: false, private: false, access: { has: obj => "transparencyMode" in obj, get: obj => obj.transparencyMode }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _uniqueId_decorators, { kind: "field", name: "uniqueId", static: false, private: false, access: { has: obj => "uniqueId" in obj, get: obj => obj.uniqueId, set: (obj, value) => { obj.uniqueId = value; } }, metadata: _metadata }, _uniqueId_initializers, _uniqueId_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            __esDecorate(null, null, _checkReadyOnEveryCall_decorators, { kind: "field", name: "checkReadyOnEveryCall", static: false, private: false, access: { has: obj => "checkReadyOnEveryCall" in obj, get: obj => obj.checkReadyOnEveryCall, set: (obj, value) => { obj.checkReadyOnEveryCall = value; } }, metadata: _metadata }, _checkReadyOnEveryCall_initializers, _checkReadyOnEveryCall_extraInitializers);
            __esDecorate(null, null, _checkReadyOnlyOnce_decorators, { kind: "field", name: "checkReadyOnlyOnce", static: false, private: false, access: { has: obj => "checkReadyOnlyOnce" in obj, get: obj => obj.checkReadyOnlyOnce, set: (obj, value) => { obj.checkReadyOnlyOnce = value; } }, metadata: _metadata }, _checkReadyOnlyOnce_initializers, _checkReadyOnlyOnce_extraInitializers);
            __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: obj => "state" in obj, get: obj => obj.state, set: (obj, value) => { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
            __esDecorate(null, null, __alpha_decorators, { kind: "field", name: "_alpha", static: false, private: false, access: { has: obj => "_alpha" in obj, get: obj => obj._alpha, set: (obj, value) => { obj._alpha = value; } }, metadata: _metadata }, __alpha_initializers, __alpha_extraInitializers);
            __esDecorate(null, null, __backFaceCulling_decorators, { kind: "field", name: "_backFaceCulling", static: false, private: false, access: { has: obj => "_backFaceCulling" in obj, get: obj => obj._backFaceCulling, set: (obj, value) => { obj._backFaceCulling = value; } }, metadata: _metadata }, __backFaceCulling_initializers, __backFaceCulling_extraInitializers);
            __esDecorate(null, null, __textureRepetitionMode_decorators, { kind: "field", name: "_textureRepetitionMode", static: false, private: false, access: { has: obj => "_textureRepetitionMode" in obj, get: obj => obj._textureRepetitionMode, set: (obj, value) => { obj._textureRepetitionMode = value; } }, metadata: _metadata }, __textureRepetitionMode_initializers, __textureRepetitionMode_extraInitializers);
            __esDecorate(null, null, _textureRepetitionHexTilingParams_decorators, { kind: "field", name: "textureRepetitionHexTilingParams", static: false, private: false, access: { has: obj => "textureRepetitionHexTilingParams" in obj, get: obj => obj.textureRepetitionHexTilingParams, set: (obj, value) => { obj.textureRepetitionHexTilingParams = value; } }, metadata: _metadata }, _textureRepetitionHexTilingParams_initializers, _textureRepetitionHexTilingParams_extraInitializers);
            __esDecorate(null, null, __cullBackFaces_decorators, { kind: "field", name: "_cullBackFaces", static: false, private: false, access: { has: obj => "_cullBackFaces" in obj, get: obj => obj._cullBackFaces, set: (obj, value) => { obj._cullBackFaces = value; } }, metadata: _metadata }, __cullBackFaces_initializers, __cullBackFaces_extraInitializers);
            __esDecorate(null, null, _sideOrientation_decorators, { kind: "field", name: "sideOrientation", static: false, private: false, access: { has: obj => "sideOrientation" in obj, get: obj => obj.sideOrientation, set: (obj, value) => { obj.sideOrientation = value; } }, metadata: _metadata }, _sideOrientation_initializers, _sideOrientation_extraInitializers);
            __esDecorate(null, null, __alphaMode_decorators, { kind: "field", name: "_alphaMode", static: false, private: false, access: { has: obj => "_alphaMode" in obj, get: obj => obj._alphaMode, set: (obj, value) => { obj._alphaMode = value; } }, metadata: _metadata }, __alphaMode_initializers, __alphaMode_extraInitializers);
            __esDecorate(null, null, __needDepthPrePass_decorators, { kind: "field", name: "_needDepthPrePass", static: false, private: false, access: { has: obj => "_needDepthPrePass" in obj, get: obj => obj._needDepthPrePass, set: (obj, value) => { obj._needDepthPrePass = value; } }, metadata: _metadata }, __needDepthPrePass_initializers, __needDepthPrePass_extraInitializers);
            __esDecorate(null, null, _disableDepthWrite_decorators, { kind: "field", name: "disableDepthWrite", static: false, private: false, access: { has: obj => "disableDepthWrite" in obj, get: obj => obj.disableDepthWrite, set: (obj, value) => { obj.disableDepthWrite = value; } }, metadata: _metadata }, _disableDepthWrite_initializers, _disableDepthWrite_extraInitializers);
            __esDecorate(null, null, _disableColorWrite_decorators, { kind: "field", name: "disableColorWrite", static: false, private: false, access: { has: obj => "disableColorWrite" in obj, get: obj => obj.disableColorWrite, set: (obj, value) => { obj.disableColorWrite = value; } }, metadata: _metadata }, _disableColorWrite_initializers, _disableColorWrite_extraInitializers);
            __esDecorate(null, null, _forceDepthWrite_decorators, { kind: "field", name: "forceDepthWrite", static: false, private: false, access: { has: obj => "forceDepthWrite" in obj, get: obj => obj.forceDepthWrite, set: (obj, value) => { obj.forceDepthWrite = value; } }, metadata: _metadata }, _forceDepthWrite_initializers, _forceDepthWrite_extraInitializers);
            __esDecorate(null, null, _depthFunction_decorators, { kind: "field", name: "depthFunction", static: false, private: false, access: { has: obj => "depthFunction" in obj, get: obj => obj.depthFunction, set: (obj, value) => { obj.depthFunction = value; } }, metadata: _metadata }, _depthFunction_initializers, _depthFunction_extraInitializers);
            __esDecorate(null, null, _separateCullingPass_decorators, { kind: "field", name: "separateCullingPass", static: false, private: false, access: { has: obj => "separateCullingPass" in obj, get: obj => obj.separateCullingPass, set: (obj, value) => { obj.separateCullingPass = value; } }, metadata: _metadata }, _separateCullingPass_initializers, _separateCullingPass_extraInitializers);
            __esDecorate(null, null, __fogEnabled_decorators, { kind: "field", name: "_fogEnabled", static: false, private: false, access: { has: obj => "_fogEnabled" in obj, get: obj => obj._fogEnabled, set: (obj, value) => { obj._fogEnabled = value; } }, metadata: _metadata }, __fogEnabled_initializers, __fogEnabled_extraInitializers);
            __esDecorate(null, null, _pointSize_decorators, { kind: "field", name: "pointSize", static: false, private: false, access: { has: obj => "pointSize" in obj, get: obj => obj.pointSize, set: (obj, value) => { obj.pointSize = value; } }, metadata: _metadata }, _pointSize_initializers, _pointSize_extraInitializers);
            __esDecorate(null, null, _zOffset_decorators, { kind: "field", name: "zOffset", static: false, private: false, access: { has: obj => "zOffset" in obj, get: obj => obj.zOffset, set: (obj, value) => { obj.zOffset = value; } }, metadata: _metadata }, _zOffset_initializers, _zOffset_extraInitializers);
            __esDecorate(null, null, _zOffsetUnits_decorators, { kind: "field", name: "zOffsetUnits", static: false, private: false, access: { has: obj => "zOffsetUnits" in obj, get: obj => obj.zOffsetUnits, set: (obj, value) => { obj.zOffsetUnits = value; } }, metadata: _metadata }, _zOffsetUnits_initializers, _zOffsetUnits_extraInitializers);
            __esDecorate(null, null, __isVertexOutputInvariant_decorators, { kind: "field", name: "_isVertexOutputInvariant", static: false, private: false, access: { has: obj => "_isVertexOutputInvariant" in obj, get: obj => obj._isVertexOutputInvariant, set: (obj, value) => { obj._isVertexOutputInvariant = value; } }, metadata: _metadata }, __isVertexOutputInvariant_initializers, __isVertexOutputInvariant_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        /**
         * Returns the triangle fill mode
         */
        _a.TriangleFillMode = 0,
        /**
         * Returns the wireframe mode
         */
        _a.WireFrameFillMode = 1,
        /**
         * Returns the point fill mode
         */
        _a.PointFillMode = 2,
        /**
         * Returns the point list draw mode
         */
        _a.PointListDrawMode = 3,
        /**
         * Returns the line list draw mode
         */
        _a.LineListDrawMode = 4,
        /**
         * Returns the line loop draw mode
         */
        _a.LineLoopDrawMode = 5,
        /**
         * Returns the line strip draw mode
         */
        _a.LineStripDrawMode = 6,
        /**
         * Returns the triangle strip draw mode
         */
        _a.TriangleStripDrawMode = 7,
        /**
         * Returns the triangle fan draw mode
         */
        _a.TriangleFanDrawMode = 8,
        /**
         * Stores the clock-wise side orientation
         */
        _a.ClockWiseSideOrientation = 0,
        /**
         * Stores the counter clock-wise side orientation
         */
        _a.CounterClockWiseSideOrientation = 1,
        /**
         * The dirty image processing flag value
         */
        _a.ImageProcessingDirtyFlag = 64,
        /**
         * The dirty texture flag value
         */
        _a.TextureDirtyFlag = 1,
        /**
         * The dirty light flag value
         */
        _a.LightDirtyFlag = 2,
        /**
         * The dirty fresnel flag value
         */
        _a.FresnelDirtyFlag = 4,
        /**
         * The dirty attribute flag value
         */
        _a.AttributesDirtyFlag = 8,
        /**
         * The dirty misc flag value
         */
        _a.MiscDirtyFlag = 16,
        /**
         * The dirty prepass flag value
         */
        _a.PrePassDirtyFlag = 32,
        /**
         * The all dirty flag value
         */
        _a.AllDirtyFlag = 127,
        /**
         * MaterialTransparencyMode: No transparency mode, Alpha channel is not use.
         */
        _a.MATERIAL_OPAQUE = 0,
        /**
         * MaterialTransparencyMode: Alpha Test mode, pixel are discarded below a certain threshold defined by the alpha cutoff value.
         */
        _a.MATERIAL_ALPHATEST = 1,
        /**
         * MaterialTransparencyMode: Pixels are blended (according to the alpha mode) with the already drawn pixels in the current frame buffer.
         */
        _a.MATERIAL_ALPHABLEND = 2,
        /**
         * MaterialTransparencyMode: Pixels are blended (according to the alpha mode) with the already drawn pixels in the current frame buffer.
         * They are also discarded below the alpha cutoff threshold to improve performances.
         */
        _a.MATERIAL_ALPHATESTANDBLEND = 3,
        /**
         * The Whiteout method is used to blend normals.
         * Details of the algorithm can be found here: https://blog.selfshadow.com/publications/blending-in-detail/
         */
        _a.MATERIAL_NORMALBLENDMETHOD_WHITEOUT = 0,
        /**
         * The Reoriented Normal Mapping method is used to blend normals.
         * Details of the algorithm can be found here: https://blog.selfshadow.com/publications/blending-in-detail/
         */
        _a.MATERIAL_NORMALBLENDMETHOD_RNM = 1,
        /**
         * PBRMaterialLightFalloff Physical: light is falling off following the inverse squared distance law.
         */
        _a.LIGHTFALLOFF_PHYSICAL = 0,
        /**
         * PBRMaterialLightFalloff gltf: light is falling off as described in the gltf moving to PBR document
         * to enhance interoperability with other engines.
         */
        _a.LIGHTFALLOFF_GLTF = 1,
        /**
         * PBRMaterialLightFalloff Standard: light is falling off like in the standard material
         * to enhance interoperability with other materials.
         */
        _a.LIGHTFALLOFF_STANDARD = 2,
        /**
         * Event observable which raises global events common to all materials (like MaterialPluginEvent.Created)
         */
        _a.OnEventObservable = new Observable(),
        /**
         * If true, all materials will have their vertex output set to invariant (see the vertexOutputInvariant property).
         */
        _a.ForceVertexOutputInvariant = false,
        _a._AllDirtyCallBack = (defines) => defines.markAllAsDirty(),
        _a._ImageProcessingDirtyCallBack = (defines) => defines.markAsImageProcessingDirty(),
        _a._TextureDirtyCallBack = (defines) => defines.markAsTexturesDirty(),
        _a._FresnelDirtyCallBack = (defines) => defines.markAsFresnelDirty(),
        _a._MiscDirtyCallBack = (defines) => defines.markAsMiscDirty(),
        _a._PrePassDirtyCallBack = (defines) => defines.markAsPrePassDirty(),
        _a._LightsDirtyCallBack = (defines) => defines.markAsLightDirty(),
        _a._AttributeDirtyCallBack = (defines) => defines.markAsAttributesDirty(),
        _a._FresnelAndMiscDirtyCallBack = (defines) => {
            _a._FresnelDirtyCallBack(defines);
            _a._MiscDirtyCallBack(defines);
        },
        _a._TextureAndMiscDirtyCallBack = (defines) => {
            _a._TextureDirtyCallBack(defines);
            _a._MiscDirtyCallBack(defines);
        },
        _a._DirtyCallbackArray = [],
        _a._RunDirtyCallBacks = (defines) => {
            for (const cb of _a._DirtyCallbackArray) {
                cb(defines);
            }
        },
        _a;
})();
export { Material };
// #region GENERATED_SIDE_EFFECT_STUBS — do not edit, regenerate with `npm run generate:side-effect-stubs`
import { _MissingSideEffectProperty } from "../Misc/devTools.js";
if (!Object.getOwnPropertyDescriptor(Material.prototype, "pluginManager")) {
    Object.defineProperty(Material.prototype, "pluginManager", _MissingSideEffectProperty("Material", "pluginManager"));
}
// #endregion GENERATED_SIDE_EFFECT_STUBS
//# sourceMappingURL=material.pure.js.map