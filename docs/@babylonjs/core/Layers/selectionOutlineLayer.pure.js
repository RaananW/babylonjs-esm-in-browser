/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { serialize, serializeAsColor3 } from "../Misc/decorators.js";
import { Scene } from "../scene.pure.js";
import { EffectLayer } from "./effectLayer.js";

import { SerializationHelper } from "../Misc/decorators.serialization.js";
import { ThinSelectionOutlineLayer } from "./thinSelectionOutlineLayer.js";
import { DepthRenderer } from "../Rendering/depthRenderer.pure.js";
import { RegisterDepthRendererSceneComponent } from "../Rendering/depthRendererSceneComponent.pure.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * The selection outline layer Helps adding a outline effect around a mesh.
 *
 * Once instantiated in a scene, simply use the addMesh or removeMesh method to add or remove
 * outlined meshes to your scene.
 */
let SelectionOutlineLayer = (() => {
    var _a;
    let _classSuper = EffectLayer;
    let _instanceExtraInitializers = [];
    let _get_outlineColor_decorators;
    let _get_outlineThickness_decorators;
    let _get_occlusionStrength_decorators;
    let _get_occlusionThreshold_decorators;
    let _get_useDepthOcclusion_decorators;
    let __options_decorators;
    let __options_initializers = [];
    let __options_extraInitializers = [];
    return _a = class SelectionOutlineLayer extends _classSuper {
            /**
             * Effect Name of the selection outline layer.
             */
            static get EffectName() {
                return ThinSelectionOutlineLayer.EffectName;
            }
            /**
             * The outline color (default (1, 0.5, 0))
             */
            get outlineColor() {
                return this._thinEffectLayer.outlineColor;
            }
            set outlineColor(value) {
                this._thinEffectLayer.outlineColor = value;
            }
            /**
             * The thickness of the edges (default: 2.0)
             */
            get outlineThickness() {
                return this._thinEffectLayer.outlineThickness;
            }
            set outlineThickness(value) {
                this._thinEffectLayer.outlineThickness = value;
            }
            /**
             * The strength of the occlusion effect (default: 0.8)
             */
            get occlusionStrength() {
                return this._thinEffectLayer.occlusionStrength;
            }
            set occlusionStrength(value) {
                this._thinEffectLayer.occlusionStrength = value;
            }
            /**
             * The occlusion threshold (default: 0.01)
             */
            get occlusionThreshold() {
                return this._thinEffectLayer.occlusionThreshold;
            }
            set occlusionThreshold(value) {
                this._thinEffectLayer.occlusionThreshold = value;
            }
            /**
             * Whether to use depth when drawing selection outlines.
             * Disable this to avoid depth renderer usage; selected outlines will not be clipped by scene or selected geometry.
             */
            get useDepthOcclusion() {
                return this._thinEffectLayer.useDepthOcclusion;
            }
            set useDepthOcclusion(value) {
                this._thinEffectLayer.useDepthOcclusion = value;
                this._options.useDepthOcclusion = value;
            }
            /**
             * Instantiates a new selection outline Layer and references it to the scene..
             * @param name The name of the layer
             * @param scene The scene to use the layer in
             * @param options Sets of none mandatory options to use with the layer (see ISelectionOutlineLayerOptions for more information)
             */
            constructor(name, scene, options) {
                super(name, scene, options !== undefined ? !!options.forceGLSL : false, new ThinSelectionOutlineLayer(name, scene, options));
                this._options = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, __options_initializers, void 0));
                __runInitializers(this, __options_extraInitializers);
                // Adapt options
                this._options = {
                    mainTextureRatio: 1.0,
                    mainTextureFixedSize: 0,
                    alphaBlendingMode: 2,
                    camera: null,
                    mainTextureSamples: 1,
                    renderingGroupId: -1,
                    mainTextureType: 1,
                    mainTextureFormat: 7,
                    forceGLSL: false,
                    storeCameraSpaceZ: false,
                    outlineMethod: 0,
                    useDepthOcclusion: true,
                    ...options,
                };
                // Fall back to a supported mask texture type if the device doesn't support rendering to float framebuffers
                // or linear filtering of float textures (e.g. OES_texture_float_linear missing on some iOS versions)
                if (this._options.mainTextureType === 1 && !(this._engine.getCaps().textureFloatRender && this._engine.getCaps().textureFloatLinearFiltering)) {
                    this._options.mainTextureType = 2;
                }
                if (this._options.mainTextureType === 2 && !this._engine.getCaps().textureHalfFloatRender && !this._options.storeCameraSpaceZ) {
                    this._options.mainTextureType = 0;
                }
                // Initialize the layer
                this._init(this._options);
                // Do not render as long as no meshes have been added
                this._shouldRender = false;
            }
            _enableDepthRenderer() {
                RegisterDepthRendererSceneComponent(DepthRenderer);
                return this._scene.enableDepthRenderer();
            }
            /**
             * Checks if the layer is ready to render.
             * When selections are active and depth occlusion is enabled, this also
             * lazily creates the depth renderer and checks that its depth map is ready.
             * @returns true if the layer is ready
             */
            isLayerReady() {
                if (!super.isLayerReady()) {
                    return false;
                }
                if (this.shouldRender() && this.useDepthOcclusion && this.occlusionStrength > 0) {
                    const depthRenderer = this._enableDepthRenderer();
                    if (!depthRenderer.getDepthMap().isReadyForRendering()) {
                        return false;
                    }
                }
                return true;
            }
            /**
             * Get the effect name of the layer.
             * @returns The effect name
             */
            getEffectName() {
                return _a.EffectName;
            }
            _numInternalDraws() {
                return 1; // draw depth mask on main pass and outline on merge pass
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
             * Creates the render target textures and post processes used in the selection outline layer.
             */
            _createTextureAndPostProcesses() {
                this._textures = [];
                this._thinEffectLayer.bindTexturesForCompose = (effect) => {
                    effect.setTexture("maskSampler", this._mainTexture);
                    if (this.useDepthOcclusion && this.occlusionStrength > 0) {
                        const depthRenderer = this._enableDepthRenderer();
                        effect.setTexture("depthSampler", depthRenderer.getDepthMap());
                    }
                    const mainTextureDesiredSize = this._mainTextureDesiredSize;
                    this._thinEffectLayer.textureWidth = mainTextureDesiredSize.width;
                    this._thinEffectLayer.textureHeight = mainTextureDesiredSize.height;
                };
                this._thinEffectLayer._createTextureAndPostProcesses();
                this._postProcesses = [];
                this._mainTexture.samples = this._options.mainTextureSamples;
                this._mainTexture.onAfterUnbindObservable.add(() => {
                    // glow layer and highlight layer both call this._scene.postProcessManager.directRender
                    // when you call this._scene.postProcessManager.directRender, it has 4 side effects:
                    // 1. binds the framebuffer
                    // 2. setAlphaMode(ALPHA_DISABLE)
                    // 3. setDepthBuffer(true)
                    // 4. setDepthWrite(true)
                    // glow layer and highlight layer are restore framebuffer and depends on other side effects
                    // but for now 3 and 4 are not needed to resolve the state management issue, so we just restore alpha mode
                    this._scene.getEngine().setAlphaMode(0);
                });
            }
            /**
             * Creates the main texture for the effect layer.
             */
            _createMainTexture() {
                super._createMainTexture();
                // set the render list for selective rendering
                this._mainTexture.renderList = this._thinEffectLayer._selection;
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
             * Determine if a given mesh will be highlighted by the current SelectionOutlineLayer
             * @param mesh mesh to test
             * @returns true if the mesh will be highlighted by the current SelectionOutlineLayer
             */
            hasMesh(mesh) {
                return this._thinEffectLayer.hasMesh(mesh);
            }
            /**
             * Remove all the meshes currently referenced in the selection outline layer
             */
            clearSelection() {
                this._thinEffectLayer.clearSelection();
                this._mainTexture.renderList = this._thinEffectLayer._selection; // update render list
            }
            /**
             * Adds mesh or group of mesh to the current selection
             *
             * If a group of meshes is provided, they will outline as a single unit
             * @param meshOrGroup Meshes to add to the selection
             */
            addSelection(meshOrGroup) {
                this._thinEffectLayer.addSelection(meshOrGroup);
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
                return "SelectionOutlineLayer";
            }
            /**
             * Serializes this SelectionOutline layer
             * @returns a serialized SelectionOutline layer object
             */
            serialize() {
                const serializationObject = SerializationHelper.Serialize(this);
                serializationObject.customType = "BABYLON.SelectionOutlineLayer";
                // Selected meshes
                serializationObject.selection = [];
                const selection = this._thinEffectLayer._selection;
                if (selection) {
                    const meshUniqueIdToSelectionId = this._thinEffectLayer._meshUniqueIdToSelectionId;
                    // selection can be sparse since _removeMesh can remove entries
                    const selectionMap = {};
                    for (let i = 0; i < selection.length; ++i) {
                        const mesh = selection[i];
                        const selectionId = meshUniqueIdToSelectionId[mesh.uniqueId];
                        if (!selectionMap[selectionId]) {
                            selectionMap[selectionId] = {
                                meshIds: [],
                            };
                        }
                        selectionMap[selectionId].meshIds.push(mesh.id);
                    }
                    serializationObject.selection = selectionMap;
                }
                return serializationObject;
            }
            /**
             * Creates a SelectionOutline layer from parsed SelectionOutline layer data
             * @param parsedSelectionOutlineLayer defines the SelectionOutline layer data
             * @param scene defines the current scene
             * @param rootUrl defines the root URL containing the SelectionOutline layer information
             * @returns a parsed SelectionOutline layer
             */
            static Parse(parsedSelectionOutlineLayer, scene, rootUrl) {
                const selectionOutlineLayer = SerializationHelper.Parse(() => new _a(parsedSelectionOutlineLayer.name, scene, parsedSelectionOutlineLayer.options), parsedSelectionOutlineLayer, scene, rootUrl);
                const selectionMap = parsedSelectionOutlineLayer.selection;
                // Selected meshes
                for (const outlinedMeshes of Object.values(selectionMap)) {
                    const meshes = [];
                    for (let meshIndex = 0; meshIndex < outlinedMeshes.meshIds.length; meshIndex++) {
                        const meshId = outlinedMeshes.meshIds[meshIndex];
                        const mesh = scene.getMeshById(meshId);
                        if (mesh) {
                            meshes.push(mesh);
                        }
                    }
                    selectionOutlineLayer.addSelection(meshes);
                }
                return selectionOutlineLayer;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_outlineColor_decorators = [serializeAsColor3()];
            _get_outlineThickness_decorators = [serialize()];
            _get_occlusionStrength_decorators = [serialize()];
            _get_occlusionThreshold_decorators = [serialize()];
            _get_useDepthOcclusion_decorators = [serialize()];
            __options_decorators = [serialize("options")];
            __esDecorate(_a, null, _get_outlineColor_decorators, { kind: "getter", name: "outlineColor", static: false, private: false, access: { has: obj => "outlineColor" in obj, get: obj => obj.outlineColor }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_outlineThickness_decorators, { kind: "getter", name: "outlineThickness", static: false, private: false, access: { has: obj => "outlineThickness" in obj, get: obj => obj.outlineThickness }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_occlusionStrength_decorators, { kind: "getter", name: "occlusionStrength", static: false, private: false, access: { has: obj => "occlusionStrength" in obj, get: obj => obj.occlusionStrength }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_occlusionThreshold_decorators, { kind: "getter", name: "occlusionThreshold", static: false, private: false, access: { has: obj => "occlusionThreshold" in obj, get: obj => obj.occlusionThreshold }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_useDepthOcclusion_decorators, { kind: "getter", name: "useDepthOcclusion", static: false, private: false, access: { has: obj => "useDepthOcclusion" in obj, get: obj => obj.useDepthOcclusion }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, __options_decorators, { kind: "field", name: "_options", static: false, private: false, access: { has: obj => "_options" in obj, get: obj => obj._options, set: (obj, value) => { obj._options = value; } }, metadata: _metadata }, __options_initializers, __options_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { SelectionOutlineLayer };
let _Registered = false;
/**
 * Register side effects for selectionOutlineLayer.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterSelectionOutlineLayer() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Scene.prototype.getSelectionOutlineLayerByName = function (name) {
        for (let index = 0; index < this.effectLayers?.length; index++) {
            if (this.effectLayers[index].name === name && this.effectLayers[index].getEffectName() === SelectionOutlineLayer.EffectName) {
                return this.effectLayers[index];
            }
        }
        return null;
    };
    RegisterClass("BABYLON.SelectionOutlineLayer", SelectionOutlineLayer);
}
//# sourceMappingURL=selectionOutlineLayer.pure.js.map