/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { serialize } from "../Misc/decorators.js";
import { Observable } from "../Misc/observable.pure.js";
import { Scene } from "../scene.pure.js";
import { Vector2 } from "../Maths/math.vector.pure.js";
import { Texture } from "../Materials/Textures/texture.pure.js";
import { RenderTargetTexture } from "../Materials/Textures/renderTargetTexture.pure.js";
import { PostProcess } from "../PostProcesses/postProcess.pure.js";
import { PassPostProcess } from "../PostProcesses/passPostProcess.pure.js";
import { BlurPostProcess } from "../PostProcesses/blurPostProcess.pure.js";
import { EffectLayer } from "./effectLayer.js";

import { Logger } from "../Misc/logger.js";
import { Color3 } from "../Maths/math.color.pure.js";
import { ThinHighlightLayer } from "./thinHighlightLayer.js";
import { SerializationHelper } from "../Misc/decorators.serialization.js";
import { GetExponentOfTwo } from "../Misc/tools.functions.js";
import { ThinGlowBlurPostProcess } from "./thinEffectLayer.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * Special Glow Blur post process only blurring the alpha channel
 * It enforces keeping the most luminous color in the color channel.
 */
class GlowBlurPostProcess extends PostProcess {
    constructor(name, direction, kernel, options, camera = null, samplingMode = Texture.BILINEAR_SAMPLINGMODE, engine, reusable) {
        const localOptions = {
            uniforms: ThinGlowBlurPostProcess.Uniforms,
            size: typeof options === "number" ? options : undefined,
            camera,
            samplingMode,
            engine,
            reusable,
            ...options,
        };
        super(name, ThinGlowBlurPostProcess.FragmentUrl, {
            effectWrapper: typeof options === "number" || !options.effectWrapper ? new ThinGlowBlurPostProcess(name, engine, direction, kernel, localOptions) : undefined,
            ...localOptions,
        });
        this.direction = direction;
        this.kernel = kernel;
        this.onApplyObservable.add(() => {
            this._effectWrapper.textureWidth = this.width;
            this._effectWrapper.textureHeight = this.height;
        });
    }
    _gatherImports(useWebGPU, list) {
        if (useWebGPU) {
            this._webGPUReady = true;
            list.push(import("../ShadersWGSL/glowBlurPostProcess.fragment.js"));
        }
        else {
            list.push(import("../Shaders/glowBlurPostProcess.fragment.js"));
        }
        super._gatherImports(useWebGPU, list);
    }
}
/**
 * The highlight layer Helps adding a glow effect around a mesh.
 *
 * Once instantiated in a scene, simply use the addMesh or removeMesh method to add or remove
 * glowy meshes to your scene.
 *
 * !!! THIS REQUIRES AN ACTIVE STENCIL BUFFER ON THE CANVAS !!!
 */
let HighlightLayer = (() => {
    var _a;
    let _classSuper = EffectLayer;
    let _instanceExtraInitializers = [];
    let _get_innerGlow_decorators;
    let _get_outerGlow_decorators;
    let _get_blurHorizontalSize_decorators;
    let _get_blurVerticalSize_decorators;
    let _get_numStencilBits_decorators;
    let __options_decorators;
    let __options_initializers = [];
    let __options_extraInitializers = [];
    return _a = class HighlightLayer extends _classSuper {
            /**
             * The neutral color used during the preparation of the glow effect.
             * This is black by default as the blend operation is a blend operation.
             */
            static get NeutralColor() {
                return ThinHighlightLayer.NeutralColor;
            }
            static set NeutralColor(value) {
                ThinHighlightLayer.NeutralColor = value;
            }
            /**
             * Specifies whether or not the inner glow is ACTIVE in the layer.
             */
            get innerGlow() {
                return this._thinEffectLayer.innerGlow;
            }
            set innerGlow(value) {
                this._thinEffectLayer.innerGlow = value;
            }
            /**
             * Specifies whether or not the outer glow is ACTIVE in the layer.
             */
            get outerGlow() {
                return this._thinEffectLayer.outerGlow;
            }
            set outerGlow(value) {
                this._thinEffectLayer.outerGlow = value;
            }
            /**
             * Specifies the horizontal size of the blur.
             */
            set blurHorizontalSize(value) {
                this._thinEffectLayer.blurHorizontalSize = value;
            }
            /**
             * Specifies the vertical size of the blur.
             */
            set blurVerticalSize(value) {
                this._thinEffectLayer.blurVerticalSize = value;
            }
            /**
             * Gets the horizontal size of the blur.
             */
            get blurHorizontalSize() {
                return this._thinEffectLayer.blurHorizontalSize;
            }
            /**
             * Gets the vertical size of the blur.
             */
            get blurVerticalSize() {
                return this._thinEffectLayer.blurVerticalSize;
            }
            /**
             * Number of stencil bits used by the highlight layer (default: 8).
             * The layer uses the numStencilBits highest bits of the stencil buffer.
             */
            get numStencilBits() {
                return this._thinEffectLayer.numStencilBits;
            }
            set numStencilBits(value) {
                this._thinEffectLayer.numStencilBits = value;
            }
            /**
             * Gets the stencil reference value used for the meshes rendered by the highlight layer.
             */
            get stencilReference() {
                return this._thinEffectLayer.stencilReference;
            }
            /**
             * Instantiates a new highlight Layer and references it to the scene..
             * @param name The name of the layer
             * @param scene The scene to use the layer in
             * @param options Sets of none mandatory options to use with the layer (see IHighlightLayerOptions for more information)
             */
            constructor(name, scene, options) {
                super(name, scene, options !== undefined ? !!options.forceGLSL : false, new ThinHighlightLayer(name, scene, options));
                /**
                 * An event triggered when the highlight layer is being blurred.
                 */
                this.onBeforeBlurObservable = (__runInitializers(this, _instanceExtraInitializers), new Observable());
                /**
                 * An event triggered when the highlight layer has been blurred.
                 */
                this.onAfterBlurObservable = new Observable();
                this._options = __runInitializers(this, __options_initializers, void 0);
                this._downSamplePostprocess = __runInitializers(this, __options_extraInitializers);
                // Warn on stencil
                if (!this._engine.isStencilEnable) {
                    Logger.Warn("Rendering the Highlight Layer requires the stencil to be active on the canvas. var engine = new Engine(canvas, antialias, { stencil: true }");
                }
                // Adapt options
                this._options = {
                    mainTextureRatio: 0.5,
                    blurTextureSizeRatio: 0.5,
                    mainTextureFixedSize: 0,
                    blurHorizontalSize: 1.0,
                    blurVerticalSize: 1.0,
                    alphaBlendingMode: 2,
                    camera: null,
                    renderingGroupId: -1,
                    mainTextureType: 0,
                    mainTextureFormat: 5,
                    forceGLSL: false,
                    isStroke: false,
                    generateStencilBuffer: false,
                    ...options,
                };
                // Initialize the layer
                this._init(this._options);
                // Do not render as long as no meshes have been added
                this._shouldRender = false;
            }
            /**
             * Get the effect name of the layer.
             * @returns The effect name
             */
            getEffectName() {
                return _a.EffectName;
            }
            _numInternalDraws() {
                return 2; // we need two rendering, one for the inner glow and the other for the outer glow
            }
            /**
             * Create the merge effect. This is the shader use to blit the information back
             * to the main canvas at the end of the scene rendering.
             * @returns The effect created
             */
            _createMergeEffect() {
                return this._thinEffectLayer._createMergeEffect();
            }
            /**
             * Creates the render target textures and post processes used in the highlight layer.
             */
            _createTextureAndPostProcesses() {
                let blurTextureWidth = this._mainTextureDesiredSize.width * this._options.blurTextureSizeRatio;
                let blurTextureHeight = this._mainTextureDesiredSize.height * this._options.blurTextureSizeRatio;
                blurTextureWidth = this._engine.needPOTTextures ? GetExponentOfTwo(blurTextureWidth, this._maxSize) : blurTextureWidth;
                blurTextureHeight = this._engine.needPOTTextures ? GetExponentOfTwo(blurTextureHeight, this._maxSize) : blurTextureHeight;
                let textureType;
                if (this._engine.getCaps().textureHalfFloatRender) {
                    textureType = 2;
                }
                else {
                    textureType = 0;
                }
                this._blurTexture = new RenderTargetTexture("HighlightLayerBlurRTT", {
                    width: blurTextureWidth,
                    height: blurTextureHeight,
                }, this._scene, false, true, textureType);
                this._blurTexture.wrapU = Texture.CLAMP_ADDRESSMODE;
                this._blurTexture.wrapV = Texture.CLAMP_ADDRESSMODE;
                this._blurTexture.anisotropicFilteringLevel = 16;
                this._blurTexture.updateSamplingMode(Texture.TRILINEAR_SAMPLINGMODE);
                this._blurTexture.renderParticles = false;
                this._blurTexture.ignoreCameraViewport = true;
                this._textures = [this._blurTexture];
                this._thinEffectLayer.bindTexturesForCompose = (effect) => {
                    effect.setTexture("textureSampler", this._blurTexture);
                };
                this._thinEffectLayer._createTextureAndPostProcesses();
                if (this._options.alphaBlendingMode === 2) {
                    this._downSamplePostprocess = new PassPostProcess("HighlightLayerPPP", {
                        size: this._options.blurTextureSizeRatio,
                        samplingMode: Texture.BILINEAR_SAMPLINGMODE,
                        engine: this._scene.getEngine(),
                        effectWrapper: this._thinEffectLayer._postProcesses[0],
                    });
                    this._downSamplePostprocess.externalTextureSamplerBinding = true;
                    this._downSamplePostprocess.onApplyObservable.add((effect) => {
                        effect.setTexture("textureSampler", this._mainTexture);
                    });
                    this._horizontalBlurPostprocess = new GlowBlurPostProcess("HighlightLayerHBP", new Vector2(1.0, 0), this._options.blurHorizontalSize, {
                        samplingMode: Texture.BILINEAR_SAMPLINGMODE,
                        engine: this._scene.getEngine(),
                        effectWrapper: this._thinEffectLayer._postProcesses[1],
                    });
                    this._horizontalBlurPostprocess.onApplyObservable.add((effect) => {
                        effect.setFloat2("screenSize", blurTextureWidth, blurTextureHeight);
                    });
                    this._verticalBlurPostprocess = new GlowBlurPostProcess("HighlightLayerVBP", new Vector2(0, 1.0), this._options.blurVerticalSize, {
                        samplingMode: Texture.BILINEAR_SAMPLINGMODE,
                        engine: this._scene.getEngine(),
                        effectWrapper: this._thinEffectLayer._postProcesses[2],
                    });
                    this._verticalBlurPostprocess.onApplyObservable.add((effect) => {
                        effect.setFloat2("screenSize", blurTextureWidth, blurTextureHeight);
                    });
                    this._postProcesses = [this._downSamplePostprocess, this._horizontalBlurPostprocess, this._verticalBlurPostprocess];
                }
                else {
                    this._horizontalBlurPostprocess = new BlurPostProcess("HighlightLayerHBP", new Vector2(1.0, 0), this._options.blurHorizontalSize / 2, {
                        size: {
                            width: blurTextureWidth,
                            height: blurTextureHeight,
                        },
                        samplingMode: Texture.BILINEAR_SAMPLINGMODE,
                        engine: this._scene.getEngine(),
                        textureType,
                        effectWrapper: this._thinEffectLayer._postProcesses[0],
                    });
                    this._horizontalBlurPostprocess.width = blurTextureWidth;
                    this._horizontalBlurPostprocess.height = blurTextureHeight;
                    this._horizontalBlurPostprocess.externalTextureSamplerBinding = true;
                    this._horizontalBlurPostprocess.onApplyObservable.add((effect) => {
                        effect.setTexture("textureSampler", this._mainTexture);
                    });
                    this._verticalBlurPostprocess = new BlurPostProcess("HighlightLayerVBP", new Vector2(0, 1.0), this._options.blurVerticalSize / 2, {
                        size: {
                            width: blurTextureWidth,
                            height: blurTextureHeight,
                        },
                        samplingMode: Texture.BILINEAR_SAMPLINGMODE,
                        engine: this._scene.getEngine(),
                        textureType,
                    });
                    this._postProcesses = [this._horizontalBlurPostprocess, this._verticalBlurPostprocess];
                }
                this._mainTexture.onAfterUnbindObservable.add(() => {
                    this.onBeforeBlurObservable.notifyObservers(this);
                    const internalTexture = this._blurTexture.renderTarget;
                    if (internalTexture) {
                        this._scene.postProcessManager.directRender(this._postProcesses, internalTexture, true);
                        this._engine.unBindFramebuffer(internalTexture, true);
                    }
                    this.onAfterBlurObservable.notifyObservers(this);
                });
                // Prevent autoClear.
                this._postProcesses.map((pp) => {
                    pp.autoClear = false;
                });
                this._mainTextureCreatedSize.width = this._mainTextureDesiredSize.width;
                this._mainTextureCreatedSize.height = this._mainTextureDesiredSize.height;
            }
            /**
             * @returns whether or not the layer needs stencil enabled during the mesh rendering.
             */
            needStencil() {
                return this._thinEffectLayer.needStencil();
            }
            /**
             * Checks for the readiness of the element composing the layer.
             * @param subMesh the mesh to check for
             * @param useInstances specify whether or not to use instances to render the mesh
             * @returns true if ready otherwise, false
             */
            isReady(subMesh, useInstances) {
                return this._thinEffectLayer.isReady(subMesh, useInstances);
            }
            /**
             * Implementation specific of rendering the generating effect on the main canvas.
             * @param effect The effect used to render through
             * @param renderIndex
             */
            _internalRender(effect, renderIndex) {
                this._thinEffectLayer._internalCompose(effect, renderIndex);
            }
            /**
             * @returns true if the layer contains information to display, otherwise false.
             */
            shouldRender() {
                return this._thinEffectLayer.shouldRender();
            }
            /**
             * Returns true if the mesh should render, otherwise false.
             * @param mesh The mesh to render
             * @returns true if it should render otherwise false
             */
            _shouldRenderMesh(mesh) {
                return this._thinEffectLayer._shouldRenderMesh(mesh);
            }
            /**
             * Returns true if the mesh can be rendered, otherwise false.
             * @param mesh The mesh to render
             * @param material The material used on the mesh
             * @returns true if it can be rendered otherwise false
             */
            _canRenderMesh(mesh, material) {
                return this._thinEffectLayer._canRenderMesh(mesh, material);
            }
            /**
             * Adds specific effects defines.
             * @param defines The defines to add specifics to.
             */
            _addCustomEffectDefines(defines) {
                this._thinEffectLayer._addCustomEffectDefines(defines);
            }
            /**
             * Sets the required values for both the emissive texture and and the main color.
             * @param mesh
             * @param subMesh
             * @param material
             */
            _setEmissiveTextureAndColor(mesh, subMesh, material) {
                this._thinEffectLayer._setEmissiveTextureAndColor(mesh, subMesh, material);
            }
            /**
             * Add a mesh in the exclusion list to prevent it to impact or being impacted by the highlight layer.
             * @param mesh The mesh to exclude from the highlight layer
             */
            addExcludedMesh(mesh) {
                this._thinEffectLayer.addExcludedMesh(mesh);
            }
            /**
             * Remove a mesh from the exclusion list to let it impact or being impacted by the highlight layer.
             * @param mesh The mesh to highlight
             */
            removeExcludedMesh(mesh) {
                this._thinEffectLayer.removeExcludedMesh(mesh);
            }
            /**
             * Determine if a given mesh will be highlighted by the current HighlightLayer
             * @param mesh mesh to test
             * @returns true if the mesh will be highlighted by the current HighlightLayer
             */
            hasMesh(mesh) {
                return this._thinEffectLayer.hasMesh(mesh);
            }
            /**
             * Add a mesh in the highlight layer in order to make it glow with the chosen color.
             * @param mesh The mesh to highlight
             * @param color The color of the highlight
             * @param glowEmissiveOnly Extract the glow from the emissive texture
             */
            addMesh(mesh, color, glowEmissiveOnly = false) {
                this._thinEffectLayer.addMesh(mesh, color, glowEmissiveOnly);
            }
            /**
             * Remove a mesh from the highlight layer in order to make it stop glowing.
             * @param mesh The mesh to highlight
             */
            removeMesh(mesh) {
                this._thinEffectLayer.removeMesh(mesh);
            }
            /**
             * Remove all the meshes currently referenced in the highlight layer
             */
            removeAllMeshes() {
                this._thinEffectLayer.removeAllMeshes();
            }
            /**
             * Free any resources and references associated to a mesh.
             * Internal use
             * @param mesh The mesh to free.
             * @internal
             */
            _disposeMesh(mesh) {
                this._thinEffectLayer._disposeMesh(mesh);
            }
            /**
             * Gets the class name of the effect layer
             * @returns the string with the class name of the effect layer
             */
            getClassName() {
                return "HighlightLayer";
            }
            /**
             * Serializes this Highlight layer
             * @returns a serialized Highlight layer object
             */
            serialize() {
                const serializationObject = SerializationHelper.Serialize(this);
                serializationObject.customType = "BABYLON.HighlightLayer";
                // Highlighted meshes
                serializationObject.meshes = [];
                const meshes = this._thinEffectLayer._meshes;
                if (meshes) {
                    for (const m in meshes) {
                        const mesh = meshes[m];
                        if (mesh) {
                            serializationObject.meshes.push({
                                glowEmissiveOnly: mesh.glowEmissiveOnly,
                                color: mesh.color.asArray(),
                                meshId: mesh.mesh.id,
                            });
                        }
                    }
                }
                // Excluded meshes
                serializationObject.excludedMeshes = [];
                const excludedMeshes = this._thinEffectLayer._excludedMeshes;
                if (excludedMeshes) {
                    for (const e in excludedMeshes) {
                        const excludedMesh = excludedMeshes[e];
                        if (excludedMesh) {
                            serializationObject.excludedMeshes.push(excludedMesh.mesh.id);
                        }
                    }
                }
                return serializationObject;
            }
            /**
             * Creates a Highlight layer from parsed Highlight layer data
             * @param parsedHightlightLayer defines the Highlight layer data
             * @param scene defines the current scene
             * @param rootUrl defines the root URL containing the Highlight layer information
             * @returns a parsed Highlight layer
             */
            static Parse(parsedHightlightLayer, scene, rootUrl) {
                const hl = SerializationHelper.Parse(() => new _a(parsedHightlightLayer.name, scene, parsedHightlightLayer.options), parsedHightlightLayer, scene, rootUrl);
                let index;
                // Excluded meshes
                for (index = 0; index < parsedHightlightLayer.excludedMeshes.length; index++) {
                    const mesh = scene.getMeshById(parsedHightlightLayer.excludedMeshes[index]);
                    if (mesh) {
                        hl.addExcludedMesh(mesh);
                    }
                }
                // Included meshes
                for (index = 0; index < parsedHightlightLayer.meshes.length; index++) {
                    const highlightedMesh = parsedHightlightLayer.meshes[index];
                    const mesh = scene.getMeshById(highlightedMesh.meshId);
                    if (mesh) {
                        hl.addMesh(mesh, Color3.FromArray(highlightedMesh.color), highlightedMesh.glowEmissiveOnly);
                    }
                }
                return hl;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_innerGlow_decorators = [serialize()];
            _get_outerGlow_decorators = [serialize()];
            _get_blurHorizontalSize_decorators = [serialize()];
            _get_blurVerticalSize_decorators = [serialize()];
            _get_numStencilBits_decorators = [serialize()];
            __options_decorators = [serialize("options")];
            __esDecorate(_a, null, _get_innerGlow_decorators, { kind: "getter", name: "innerGlow", static: false, private: false, access: { has: obj => "innerGlow" in obj, get: obj => obj.innerGlow }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_outerGlow_decorators, { kind: "getter", name: "outerGlow", static: false, private: false, access: { has: obj => "outerGlow" in obj, get: obj => obj.outerGlow }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_blurHorizontalSize_decorators, { kind: "getter", name: "blurHorizontalSize", static: false, private: false, access: { has: obj => "blurHorizontalSize" in obj, get: obj => obj.blurHorizontalSize }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_blurVerticalSize_decorators, { kind: "getter", name: "blurVerticalSize", static: false, private: false, access: { has: obj => "blurVerticalSize" in obj, get: obj => obj.blurVerticalSize }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_numStencilBits_decorators, { kind: "getter", name: "numStencilBits", static: false, private: false, access: { has: obj => "numStencilBits" in obj, get: obj => obj.numStencilBits }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, __options_decorators, { kind: "field", name: "_options", static: false, private: false, access: { has: obj => "_options" in obj, get: obj => obj._options, set: (obj, value) => { obj._options = value; } }, metadata: _metadata }, __options_initializers, __options_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        /**
         * Effect Name of the highlight layer.
         */
        _a.EffectName = "HighlightLayer",
        _a;
})();
export { HighlightLayer };
let _Registered = false;
/**
 * Register side effects for highlightLayer.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterHighlightLayer() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Scene.prototype.getHighlightLayerByName = function (name) {
        for (let index = 0; index < this.effectLayers?.length; index++) {
            if (this.effectLayers[index].name === name && this.effectLayers[index].getEffectName() === HighlightLayer.EffectName) {
                return this.effectLayers[index];
            }
        }
        return null;
    };
    RegisterClass("BABYLON.HighlightLayer", HighlightLayer);
}
//# sourceMappingURL=highlightLayer.pure.js.map