/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { StorageBuffer } from "../../Buffers/storageBuffer.js";

import { ShaderMaterial } from "../../Materials/shaderMaterial.pure.js";
import { RawTexture } from "../../Materials/Textures/rawTexture.js";
import { RenderTargetTexture } from "../../Materials/Textures/renderTargetTexture.pure.js";
import { UniformBuffer } from "../../Materials/uniformBuffer.js";
import { TmpColors } from "../../Maths/math.color.pure.js";
import { TmpVectors, Vector3 } from "../../Maths/math.vector.pure.js";
import { CreatePlane } from "../../Meshes/Builders/planeBuilder.pure.js";
import { serialize } from "../../Misc/decorators.js";
import { _WarnImport } from "../../Misc/devTools.js";
import { Logger } from "../../Misc/logger.js";
import { Light } from "../light.js";
import { LightConstants } from "../lightConstants.js";
import { RegisterClass } from "../../Misc/typeStore.js";
import { Node } from "../../node.js";
import { RegisterClusteredLightingSceneComponent } from "./clusteredLightingSceneComponent.pure.js";
import { RegisterEnginesExtensionsEngineRawTexture } from "../../Engines/Extensions/engine.rawTexture.pure.js";
import { RegisterEnginesExtensionsEngineRenderTarget } from "../../Engines/Extensions/engine.renderTarget.pure.js";
import { RegisterEnginesExtensionsEngineRenderTargetTexture } from "../../Engines/Extensions/engine.renderTargetTexture.pure.js";
import { RegisterThinInstanceMesh } from "../../Meshes/thinInstanceMesh.pure.js";
const DefaultDepthSlices = 16;
const MobileClusteredLightBatchSize = 8;
/**
 * A special light that renders all its associated spot or point lights using a clustered or forward+ system.
 */
let ClusteredLightContainer = (() => {
    var _a;
    let _classSuper = Light;
    let _instanceExtraInitializers = [];
    let _get_horizontalTiles_decorators;
    let _get_verticalTiles_decorators;
    let _get_depthSlices_decorators;
    let _get_maxRange_decorators;
    return _a = class ClusteredLightContainer extends _classSuper {
            static _GetEngineBatchSize(engine) {
                const caps = engine._caps;
                if (!caps.texelFetch) {
                    return 0;
                }
                else if (engine.isWebGPU) {
                    // On WebGPU we use atomic writes to storage buffers
                    return 32;
                }
                else if (engine.version > 1) {
                    // On WebGL 2 we use additive float blending as the light mask
                    if (!caps.colorBufferFloat || !caps.blendFloat) {
                        return 0;
                    }
                    // Due to the use of floats we want to limit lights to the precision of floats
                    // The reduced precision for mobiles is because some devices (like Samsung Galaxy) report support for R32F but actually create the texture with less precision.
                    return engine.hostInformation.isMobile ? MobileClusteredLightBatchSize : caps.shaderFloatPrecision;
                }
                else {
                    // WebGL 1 is not supported due to lack of dynamic for loops
                    return 0;
                }
            }
            /**
             * Checks if the clustered lighting system supports the given light with its current parameters.
             * This will also check if the light's associated engine supports clustered lighting.
             *
             * @param light The light to test
             * @returns true if the light and its engine is supported
             */
            static IsLightSupported(light) {
                if (_a._GetEngineBatchSize(light.getEngine()) === 0) {
                    return false;
                }
                if (light.shadowEnabled && light._scene.shadowsEnabled && light.getShadowGenerators()) {
                    // Shadows are not supported
                    return false;
                }
                if (light.falloffType !== Light.FALLOFF_DEFAULT) {
                    // Only the default falloff is supported
                    return false;
                }
                if (light.getTypeID() === LightConstants.LIGHTTYPEID_POINTLIGHT) {
                    return true;
                }
                if (light.getTypeID() === LightConstants.LIGHTTYPEID_SPOTLIGHT) {
                    // Extra texture bindings per light are not supported
                    return !light.projectionTexture && !light.iesProfileTexture;
                }
                // Currently only point and spot lights are supported
                return false;
            }
            /**
             * True if clustered lighting is supported.
             */
            get isSupported() {
                return this._batchSize > 0;
            }
            /**
             * Gets the current list of lights added to this clustering system.
             */
            get lights() {
                return this._lights;
            }
            /**
             * The number of tiles in the horizontal direction to cluster lights into.
             * A lower value will reduce memory and make the clustering step faster, while a higher value increases memory and makes the rendering step faster.
             */
            get horizontalTiles() {
                return this._horizontalTiles;
            }
            set horizontalTiles(horizontal) {
                if (this._horizontalTiles === horizontal) {
                    return;
                }
                this._horizontalTiles = horizontal;
                // Force the batch data to be recreated
                this._tileMaskBatches = -1;
            }
            /**
             * The number of tiles in the vertical direction to cluster lights into.
             * A lower value will reduce memory and make the clustering step faster, while a higher value increases memory and makes the rendering step faster.
             */
            get verticalTiles() {
                return this._verticalTiles;
            }
            set verticalTiles(vertical) {
                if (this._verticalTiles === vertical) {
                    return;
                }
                this._verticalTiles = vertical;
                // Force the batch data to be recreated
                this._tileMaskBatches = -1;
            }
            /**
             * The number of slices to split the depth range by and cluster lights into.
             */
            get depthSlices() {
                return this._depthSlices;
            }
            set depthSlices(slices) {
                if (this._depthSlices === slices) {
                    return;
                }
                this._depthSlices = slices;
                this._sliceRanges = new Float32Array(slices * 2);
                // UBO size depends on the number of depth slices
                this._uniformBuffer.dispose();
                this._uniformBuffer = new UniformBuffer(this.getEngine(), undefined, undefined, this.name);
                this._buildUniformLayout();
                // The UBO has been recreated so previous bindings are no longer valid; transferToEffect will repopulate it.
                this._lastBoundLightIndex = null;
                // CLUSTLIGHT_SLICES is a shader define that sizes the vSliceRanges array in the UBO.
                // Materials must recompile when depthSlices changes so the shader layout matches the rebuilt UBO.
                // Otherwise, if depthSlices is reduced, the rebuilt UBO can be smaller than what the previously compiled shader expects, causing rendering to fail.
                this._markMeshesAsLightDirty();
            }
            /**
             * This limits the range of all the added lights, so even lights with extreme ranges will still have bounds for clustering.
             */
            get maxRange() {
                return this._maxRange;
            }
            set maxRange(range) {
                if (this._maxRange === range) {
                    return;
                }
                this._maxRange = range;
                this._minInverseSquaredRange = 1 / (range * range);
            }
            /**
             * Creates a new clustered light system with an initial set of lights.
             *
             * @param name The name of the clustered light container
             * @param lights The initial set of lights to add
             * @param scene The scene the clustered light container belongs to
             */
            constructor(name, lights = [], scene) {
                super(name, scene);
                this._batchSize = __runInitializers(this, _instanceExtraInitializers);
                this._lights = [];
                this._camera = null;
                // The lights sorted by depth
                this._sortedLights = [];
                this._lightDataRenderId = -1;
                this._tileMaskBatches = -1;
                this._horizontalTiles = 64;
                this._verticalTiles = 64;
                this._sliceScale = 0;
                this._sliceBias = 0;
                // Tracks the last lightIndex string passed to transferToEffect, or null if the cluster
                // has not yet been bound. Used to refresh the camera-dependent UBO entries (vSliceData /
                // vSliceRanges) every frame in cases where material binding is bypassed (e.g. WebGPU FAST
                // snapshot rendering replays cached bundles and never re-runs Light._bindLight).
                this._lastBoundLightIndex = null;
                this._depthSlices = DefaultDepthSlices;
                this._maxRange = 16383;
                this._minInverseSquaredRange = 1 / (this._maxRange * this._maxRange);
                const engine = this.getEngine();
                this._batchSize = _a._GetEngineBatchSize(engine);
                // Clustered lighting relies on engine and mesh side effects that are not part of the
                // pure import baseline. Register them here (idempotently) so the feature works on the
                // tree-shakeable path without requiring callers to import these extensions manually.
                // Without this, createRawTexture/createRenderTargetTexture throw and the thin-instance
                // setters silently no-op, leaving the scene unlit with no error.
                RegisterEnginesExtensionsEngineRawTexture();
                RegisterEnginesExtensionsEngineRenderTarget();
                RegisterEnginesExtensionsEngineRenderTargetTexture();
                RegisterThinInstanceMesh();
                const proxyShader = { vertex: "lightProxy", fragment: "lightProxy" };
                const defines = [`CLUSTLIGHT_BATCH ${this._batchSize}`];
                if (this._scene.useRightHandedSystem) {
                    defines.push("#define RIGHT_HANDED");
                }
                this._proxyMaterial = new ShaderMaterial("ProxyMaterial", this._scene, proxyShader, {
                    attributes: ["position"],
                    uniforms: ["view", "projection", "tileMaskResolution"],
                    samplers: ["lightDataTexture"],
                    uniformBuffers: ["Scene"],
                    storageBuffers: ["tileMaskBuffer"],
                    defines,
                    shaderLanguage: engine.isWebGPU ? 1 /* ShaderLanguage.WGSL */ : 0 /* ShaderLanguage.GLSL */,
                    extraInitializationsAsync: async () => {
                        if (engine.isWebGPU) {
                            await Promise.all([import("../../ShadersWGSL/lightProxy.vertex.js"), import("../../ShadersWGSL/lightProxy.fragment.js")]);
                        }
                        else {
                            await Promise.all([import("../../Shaders/lightProxy.vertex.js"), import("../../Shaders/lightProxy.fragment.js")]);
                        }
                    },
                });
                // Additive blending is for merging masks on WebGL
                this._proxyMaterial.transparencyMode = ShaderMaterial.MATERIAL_ALPHABLEND;
                this._proxyMaterial.alphaMode = 1;
                this._proxyMaterial.sideOrientation = 1;
                this._proxyMesh = CreatePlane("ProxyMesh", { size: 2 }, this._scene);
                // Make sure it doesn't render for the default scene
                this._scene.removeMesh(this._proxyMesh);
                this._proxyMesh.material = this._proxyMaterial;
                this._updateBatches();
                this._sliceRanges = new Float32Array(this._depthSlices * 2);
                if (this._batchSize > 0) {
                    RegisterClusteredLightingSceneComponent(_a);
                    _a._SceneComponentInitialization(this._scene);
                    for (const light of lights) {
                        this.addLight(light);
                    }
                }
            }
            getClassName() {
                return "ClusteredLightContainer";
            }
            // eslint-disable-next-line @typescript-eslint/naming-convention
            getTypeID() {
                return LightConstants.LIGHTTYPEID_CLUSTERED_CONTAINER;
            }
            /** @internal */
            _updateBatches(camera = null) {
                this._camera = camera;
                this._proxyMesh.isVisible = this._sortedLights.length > 0;
                // Ensure space for atleast 1 batch
                const batches = Math.max(Math.ceil(this._sortedLights.length / this._batchSize), 1);
                if (this._tileMaskBatches >= batches) {
                    this._proxyMesh.thinInstanceCount = this._sortedLights.length;
                    return this._tileMaskTexture;
                }
                const engine = this.getEngine();
                // Round up to a batch size so we don't have to reallocate as often
                const maxLights = batches * this._batchSize;
                this._lightDataBuffer = new Float32Array(20 * maxLights);
                this._lightDataTexture?.dispose();
                this._lightDataTexture = new RawTexture(this._lightDataBuffer, 5, maxLights, 5, this._scene, false, false, 1, 1);
                this._lightDataTexture.name = "LightDataTexture_clustered_" + this.name;
                this._proxyMaterial.setTexture("lightDataTexture", this._lightDataTexture);
                this._tileMaskTexture?.dispose();
                const textureSize = { width: this._horizontalTiles, height: this._verticalTiles };
                if (!engine.isWebGPU) {
                    // In WebGL we shift the light proxy by the batch number
                    textureSize.height *= batches;
                }
                this._tileMaskTexture = new RenderTargetTexture("TileMaskTexture", textureSize, this._scene, {
                    // We don't write anything on WebGPU so make it as small as possible
                    type: engine.isWebGPU ? 0 : 1,
                    format: 6,
                    generateDepthBuffer: false,
                });
                this._tileMaskTexture.renderParticles = false;
                this._tileMaskTexture.renderSprites = false;
                this._tileMaskTexture.noPrePassRenderer = true;
                this._tileMaskTexture.renderList = [this._proxyMesh];
                let currentRenderTarget = null;
                this._tileMaskTexture.onBeforeBindObservable.add(() => {
                    currentRenderTarget = engine._currentRenderTarget;
                    this._updateLightData();
                    // On WebGPU, clear the storage buffer here (before bindFramebuffer) because
                    // clearBuffer is a command encoder operation that cannot run while a render pass is open.
                    // In snapshot rendering mode, bindFramebuffer eagerly creates the render pass, so
                    // clearing must happen before that point.
                    if (engine.isWebGPU) {
                        this._tileMaskBuffer?.clear();
                    }
                });
                this._tileMaskTexture.onAfterUnbindObservable.add(() => {
                    if (engine._currentRenderTarget !== currentRenderTarget) {
                        if (!currentRenderTarget) {
                            engine.restoreDefaultFramebuffer();
                        }
                        else {
                            engine.bindFramebuffer(currentRenderTarget);
                        }
                    }
                });
                this._tileMaskTexture.onClearObservable.add(() => {
                    if (!engine.isWebGPU) {
                        // Only clear the texture on WebGL
                        engine.clear({ r: 0, g: 0, b: 0, a: 1 }, true, false);
                    }
                });
                if (engine.isWebGPU) {
                    // WebGPU also needs a storage buffer to write to
                    this._tileMaskBuffer?.dispose();
                    const bufferSize = this._horizontalTiles * this._verticalTiles * batches * 4;
                    this._tileMaskBuffer = new StorageBuffer(engine, bufferSize);
                    this._proxyMaterial.setStorageBuffer("tileMaskBuffer", this._tileMaskBuffer);
                }
                this._proxyMaterial.setVector3("tileMaskResolution", new Vector3(this._horizontalTiles, this.verticalTiles, batches));
                // We don't actually use the matrix data but we need enough capacity for the lights
                if (this._proxyMesh.thinInstanceSetBuffer) {
                    this._proxyMesh.thinInstanceSetBuffer("matrix", new Float32Array(maxLights * 16));
                }
                this._proxyMesh.thinInstanceCount = this._sortedLights.length;
                this._tileMaskBatches = batches;
                return this._tileMaskTexture;
            }
            _getSliceIndex(camera, depth) {
                if (depth < camera.minZ) {
                    // Prevent calling log on small or negative values
                    return -1;
                }
                return Math.floor(Math.log(depth) * this._sliceScale + this._sliceBias);
            }
            _updateLightData() {
                const camera = this._camera || this._scene.activeCamera;
                const renderId = this._scene.getRenderId();
                if (!camera || this._lightDataRenderId === renderId) {
                    return;
                }
                this._lightDataRenderId = renderId;
                // Resort lights based on distance from camera
                const view = camera.getViewMatrix();
                for (const light of this._sortedLights) {
                    const position = light.computeTransformedInformation() ? light.transformedPosition : light.position;
                    const viewPosition = Vector3.TransformCoordinatesToRef(position, view, TmpVectors.Vector3[0]);
                    light._currentViewDepth = this._scene.useRightHandedSystem ? -viewPosition.z : viewPosition.z;
                }
                this._sortedLights.sort((a, b) => a._currentViewDepth - b._currentViewDepth);
                // DOOM 2016 subdivision scheme, copied from: https://www.aortiz.me/2018/12/21/CG.html
                const logFarNear = Math.log(camera.maxZ / camera.minZ);
                this._sliceScale = this._depthSlices / logFarNear;
                this._sliceBias = -(this._depthSlices * Math.log(camera.minZ)) / logFarNear;
                this._sliceRanges.fill(0);
                // Last slice which had had its min index updated
                let minSlice = -1;
                const buf = this._lightDataBuffer;
                const offset = this._scene.floatingOriginOffset;
                for (let i = 0; i < this._sortedLights.length; i += 1) {
                    const light = this._sortedLights[i];
                    const off = i * 20;
                    const computed = light.computeTransformedInformation();
                    const scaledIntensity = light.getScaledIntensity();
                    const position = computed ? light.transformedPosition : light.position;
                    const diffuse = light.diffuse.scaleToRef(scaledIntensity, TmpColors.Color3[0]);
                    const specular = light.specular.scaleToRef(scaledIntensity, TmpColors.Color3[1]);
                    const range = Math.min(light.range, this.maxRange);
                    const inverseSquaredRange = Math.max(light._inverseSquaredRange, this._minInverseSquaredRange);
                    // vLightData
                    buf[off + 0] = position.x - offset.x;
                    buf[off + 1] = position.y - offset.y;
                    buf[off + 2] = position.z - offset.z;
                    buf[off + 3] = 0;
                    // vLightDiffuse
                    buf[off + 4] = diffuse.r;
                    buf[off + 5] = diffuse.g;
                    buf[off + 6] = diffuse.b;
                    buf[off + 7] = range;
                    // vLightSpecular
                    buf[off + 8] = specular.r;
                    buf[off + 9] = specular.g;
                    buf[off + 10] = specular.b;
                    buf[off + 11] = light.radius;
                    // vLightDirection
                    buf[off + 12] = 0;
                    buf[off + 13] = 0;
                    buf[off + 14] = 0;
                    buf[off + 15] = -1;
                    // vLightFalloff
                    buf[off + 16] = range;
                    buf[off + 17] = inverseSquaredRange;
                    buf[off + 18] = 0;
                    buf[off + 19] = 0;
                    if (light.getTypeID() === LightConstants.LIGHTTYPEID_SPOTLIGHT) {
                        const spotLight = light;
                        const direction = Vector3.NormalizeToRef(computed ? spotLight.transformedDirection : spotLight.direction, TmpVectors.Vector3[0]);
                        // vLightData.a
                        buf[off + 3] = spotLight.exponent;
                        // vLightDirection
                        buf[off + 12] = direction.x;
                        buf[off + 13] = direction.y;
                        buf[off + 14] = direction.z;
                        buf[off + 15] = spotLight._cosHalfAngle;
                        // vLightFalloff.zw
                        buf[off + 18] = spotLight._lightAngleScale;
                        buf[off + 19] = spotLight._lightAngleOffset;
                    }
                    // Update the depth slices that include this light
                    const firstSlice = this._getSliceIndex(camera, light._currentViewDepth - range);
                    const lastSlice = this._getSliceIndex(camera, light._currentViewDepth + range);
                    for (let j = firstSlice; j <= lastSlice; j += 1) {
                        if (j < 0 || j >= this._depthSlices) {
                            continue;
                        }
                        else if (j > minSlice) {
                            // Update min index
                            this._sliceRanges[j * 2] = i;
                            minSlice = j;
                        }
                        // Update max index
                        this._sliceRanges[j * 2 + 1] = i;
                    }
                }
                const engine = this.getEngine();
                if (engine.isWebGPU) {
                    // Whenever the light data changes we have to flush pending WebGPU command buffers so that
                    // previous render passes use the old data and later render passes use the new data.
                    engine.flushFramebuffer();
                }
                this._lightDataTexture.update(this._lightDataBuffer);
                // Refresh camera-dependent UBO fields when running under FAST snapshot rendering, where
                // ObjectRenderer.render bypasses the rendering manager and Light._bindLight is not
                // re-invoked each frame. Without this, transferToEffect would never run again after the
                // recording frame and the slice data would stay frozen, producing visibly stale lighting
                // as the camera moves. STANDARD snapshot mode and non-snapshot rendering still go through
                // material binding each frame, so transferToEffect already keeps the UBO up to date.
                if (this._lastBoundLightIndex !== null && engine.snapshotRendering && engine.snapshotRenderingMode === 1) {
                    this._uniformBuffer.updateFloat2("vSliceData", this._sliceScale, this._sliceBias, this._lastBoundLightIndex);
                    this._uniformBuffer.updateFloatArray("vSliceRanges", this._sliceRanges, this._lastBoundLightIndex);
                    this._uniformBuffer.update();
                }
            }
            dispose(doNotRecurse, disposeMaterialAndTextures) {
                for (const light of this._lights) {
                    light.dispose(doNotRecurse, disposeMaterialAndTextures);
                }
                this._lightDataTexture.dispose();
                this._tileMaskTexture.dispose();
                this._tileMaskBuffer?.dispose();
                this._proxyMesh.dispose(doNotRecurse, disposeMaterialAndTextures);
                super.dispose(doNotRecurse, disposeMaterialAndTextures);
            }
            /**
             * Adds a light to the clustering system.
             * @param light The light to add
             */
            addLight(light) {
                if (!_a.IsLightSupported(light)) {
                    Logger.Warn("Attempting to add a light to cluster that does not support clustering");
                    return;
                }
                if (light._clusteredContainer) {
                    Logger.Warn("Attempting to add a light to a cluster that is already owned by a clustered light container");
                    return;
                }
                light._clusteredContainer = this;
                // scene.removeLight returns -1 if the light wasn't in scene.lights. In that case the
                // mesh.lightSources cleanup it normally performs didn't happen — but the light may still be
                // there: lights constructed with `dontAddToScene = true` are pushed into mesh.lightSources
                // by the Light constructor (the `includedOnlyMeshes` setter calls `_resyncMeshes`).
                // Without explicit cleanup, the orphan would be picked up by PrepareDefinesForLights and
                // rendered as a regular point/spot light, bypassing the cluster (notably ignoring `maxRange`).
                if (this._scene.removeLight(light) === -1) {
                    for (const mesh of this._scene.meshes) {
                        mesh._removeLightSource(light, false);
                    }
                }
                this._lights.push(light);
                this._sortedLights.push(light);
                this._proxyMesh.isVisible = true;
                this._proxyMesh.thinInstanceCount = this._sortedLights.length;
            }
            /**
             * Removes a light from the clustering system.
             * @param light The light to remove
             * @returns the index where the light was in the light list
             */
            removeLight(light) {
                // Convert to `Light` array without cast so `indexOf` has correct typing
                const sortedLights = this._sortedLights;
                const sortedIndex = sortedLights.indexOf(light);
                if (sortedIndex !== -1) {
                    sortedLights.splice(sortedIndex, 1);
                    this._proxyMesh.thinInstanceCount = sortedLights.length;
                    if (sortedLights.length === 0) {
                        this._proxyMesh.isVisible = false;
                    }
                }
                const index = this._lights.indexOf(light);
                if (index !== -1) {
                    this._lights.splice(index, 1);
                    // We treat the unsorted array as the "real" one so only add back to the scene if it was found in that
                    if (light._clusteredContainer === this) {
                        light._clusteredContainer = null;
                    }
                    this._scene.addLight(light);
                }
                return index;
            }
            _buildUniformLayout() {
                this._uniformBuffer.addUniform("vLightData", 4);
                this._uniformBuffer.addUniform("vLightDiffuse", 4);
                this._uniformBuffer.addUniform("vLightSpecular", 4);
                this._uniformBuffer.addUniform("vSliceData", 2);
                // _depthSlices might not be initialized yet
                this._uniformBuffer.addUniform("vSliceRanges", 2, this._depthSlices ?? DefaultDepthSlices);
                this._uniformBuffer.addUniform("shadowsInfo", 3);
                this._uniformBuffer.addUniform("depthValues", 2);
                this._uniformBuffer.create();
            }
            transferToEffect(effect, lightIndex) {
                const engine = this.getEngine();
                const hscale = this._horizontalTiles / engine.getRenderWidth();
                const vscale = this._verticalTiles / engine.getRenderHeight();
                this._uniformBuffer.updateFloat4("vLightData", hscale, vscale, this._verticalTiles, this._tileMaskBatches, lightIndex);
                this._uniformBuffer.updateFloat2("vSliceData", this._sliceScale, this._sliceBias, lightIndex);
                this._uniformBuffer.updateFloatArray("vSliceRanges", this._sliceRanges, lightIndex);
                this._lastBoundLightIndex = lightIndex;
                return this;
            }
            transferTexturesToEffect(effect, lightIndex) {
                const engine = this.getEngine();
                effect.setTexture("lightDataTexture" + lightIndex, this._lightDataTexture);
                if (engine.isWebGPU) {
                    engine.setStorageBuffer("tileMaskBuffer" + lightIndex, this._tileMaskBuffer);
                }
                else {
                    effect.setTexture("tileMaskTexture" + lightIndex, this._tileMaskTexture);
                }
                return this;
            }
            /**
             * Transfers the effect to the node material effect
             * @param _effect the effect to transfer to
             * @returns the light
             */
            transferToNodeMaterialEffect(_effect) {
                return this;
            }
            prepareLightSpecificDefines(defines, lightIndex) {
                defines["CLUSTLIGHT" + lightIndex] = true;
                defines["CLUSTLIGHT_BATCH"] = this._batchSize;
                defines["CLUSTLIGHT_SLICES"] = this._depthSlices;
            }
            /**
             * Returns whether this light is ready to be used
             * @returns true if the light is ready
             */
            _isReady() {
                this._updateBatches();
                return this._proxyMesh.isReady(true, true);
            }
            /**
             * Serializes the ClusteredLightContainer to a JSON object, including all child lights.
             * @returns the serialized object
             */
            serialize() {
                const serializationObject = super.serialize();
                // Serialize child lights inline so they round-trip with the container.
                // Child lights are removed from scene.lights by addLight(), so the scene
                // serializer would not reach them on its own.
                serializationObject.clusteredLights = [];
                for (const light of this._lights) {
                    if (!light.doNotSerialize) {
                        serializationObject.clusteredLights.push(light.serialize());
                    }
                }
                return serializationObject;
            }
            _onParsed(parsedLight, scene, rootUrl = "") {
                if (parsedLight.clusteredLights) {
                    // Parse child lights first, but defer addLight() until after the loader
                    // fixup passes (parent resolution, excluded/included mesh resolution)
                    // have run on scene.lights. addLight() removes lights from scene.lights,
                    // which would cause those fixups to miss the child lights.
                    const parsedChildLights = [];
                    for (const parsedChildLight of parsedLight.clusteredLights) {
                        const childLight = Light.Parse(parsedChildLight, scene, rootUrl);
                        if (childLight) {
                            parsedChildLights.push(childLight);
                        }
                    }
                    if (parsedChildLights.length > 0) {
                        scene.onDataLoadedObservable.addOnce(() => {
                            for (const childLight of parsedChildLights) {
                                this.addLight(childLight);
                            }
                        });
                    }
                }
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_horizontalTiles_decorators = [serialize()];
            _get_verticalTiles_decorators = [serialize()];
            _get_depthSlices_decorators = [serialize()];
            _get_maxRange_decorators = [serialize()];
            __esDecorate(_a, null, _get_horizontalTiles_decorators, { kind: "getter", name: "horizontalTiles", static: false, private: false, access: { has: obj => "horizontalTiles" in obj, get: obj => obj.horizontalTiles }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_verticalTiles_decorators, { kind: "getter", name: "verticalTiles", static: false, private: false, access: { has: obj => "verticalTiles" in obj, get: obj => obj.verticalTiles }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_depthSlices_decorators, { kind: "getter", name: "depthSlices", static: false, private: false, access: { has: obj => "depthSlices" in obj, get: obj => obj.depthSlices }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_maxRange_decorators, { kind: "getter", name: "maxRange", static: false, private: false, access: { has: obj => "maxRange" in obj, get: obj => obj.maxRange }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        /** @internal */
        _a._SceneComponentInitialization = () => {
            throw _WarnImport("ClusteredLightingSceneComponent");
        },
        _a;
})();
export { ClusteredLightContainer };
let _Registered = false;
/**
 * Register side effects for clusteredLightContainer.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterClusteredLightContainer() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Node.AddNodeConstructor("Light_Type_5", (name, scene) => {
        return () => new ClusteredLightContainer(name, [], scene);
    });
    // Register Class Name
    RegisterClass("BABYLON.ClusteredLightContainer", ClusteredLightContainer);
}
//# sourceMappingURL=clusteredLightContainer.pure.js.map