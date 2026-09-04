/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { serializeAsVector3, serialize, serializeAsMeshReference } from "../Misc/decorators.js";
import { Logger } from "../Misc/logger.js";
import { Vector2, Vector3, Matrix } from "../Maths/math.vector.pure.js";
import { VertexBuffer } from "../Buffers/buffer.pure.js";
import { AbstractMesh } from "../Meshes/abstractMesh.pure.js";
import { Material } from "../Materials/material.pure.js";
import { StandardMaterial } from "../Materials/standardMaterial.pure.js";
import { Texture } from "../Materials/Textures/texture.pure.js";
import { RenderTargetTexture } from "../Materials/Textures/renderTargetTexture.pure.js";
import { PostProcess } from "./postProcess.pure.js";

import { CreatePlane } from "../Meshes/Builders/planeBuilder.pure.js";
import { Color4, Color3 } from "../Maths/math.color.pure.js";
import { Viewport } from "../Maths/math.viewport.js";
import { BindBonesParameters, BindMorphTargetParameters, PrepareDefinesAndAttributesForMorphTargets, PushAttributesForInstances } from "../Materials/materialHelper.functions.js";
import { EffectFallbacks } from "../Materials/effectFallbacks.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 *  Inspired by https://developer.nvidia.com/gpugems/gpugems3/part-ii-light-and-shadows/chapter-13-volumetric-light-scattering-post-process
 */
let VolumetricLightScatteringPostProcess = (() => {
    var _a;
    let _classSuper = PostProcess;
    let _customMeshPosition_decorators;
    let _customMeshPosition_initializers = [];
    let _customMeshPosition_extraInitializers = [];
    let _useCustomMeshPosition_decorators;
    let _useCustomMeshPosition_initializers = [];
    let _useCustomMeshPosition_extraInitializers = [];
    let _invert_decorators;
    let _invert_initializers = [];
    let _invert_extraInitializers = [];
    let _mesh_decorators;
    let _mesh_initializers = [];
    let _mesh_extraInitializers = [];
    let _excludedMeshes_decorators;
    let _excludedMeshes_initializers = [];
    let _excludedMeshes_extraInitializers = [];
    let _includedMeshes_decorators;
    let _includedMeshes_initializers = [];
    let _includedMeshes_extraInitializers = [];
    let _exposure_decorators;
    let _exposure_initializers = [];
    let _exposure_extraInitializers = [];
    let _decay_decorators;
    let _decay_initializers = [];
    let _decay_extraInitializers = [];
    let _weight_decorators;
    let _weight_initializers = [];
    let _weight_extraInitializers = [];
    let _density_decorators;
    let _density_initializers = [];
    let _density_extraInitializers = [];
    return _a = class VolumetricLightScatteringPostProcess extends _classSuper {
            /**
             * @internal
             * VolumetricLightScatteringPostProcess.useDiffuseColor is no longer used, use the mesh material directly instead
             */
            get useDiffuseColor() {
                Logger.Warn("VolumetricLightScatteringPostProcess.useDiffuseColor is no longer used, use the mesh material directly instead");
                return false;
            }
            set useDiffuseColor(useDiffuseColor) {
                Logger.Warn("VolumetricLightScatteringPostProcess.useDiffuseColor is no longer used, use the mesh material directly instead");
            }
            /**
             * @constructor
             * @param name The post-process name
             * @param ratio The size of the post-process and/or internal pass (0.5 means that your postprocess will have a width = canvas.width 0.5 and a height = canvas.height 0.5)
             * @param camera The camera that the post-process will be attached to
             * @param mesh The mesh used to create the light scattering
             * @param samples The post-process quality, default 100
             * @param samplingMode The post-process filtering mode
             * @param engine The babylon engine
             * @param reusable If the post-process is reusable
             * @param scene The constructor needs a scene reference to initialize internal components. If "camera" is null a "scene" must be provided
             */
            constructor(name, ratio, camera, mesh, samples = 100, samplingMode = Texture.BILINEAR_SAMPLINGMODE, engine, reusable, scene) {
                const selectedEngine = engine ?? camera?.getScene().getEngine() ?? scene?.getEngine();
                const shaderLanguage = selectedEngine?.isWebGPU && !PostProcess.ForceGLSL ? 1 /* ShaderLanguage.WGSL */ : 0 /* ShaderLanguage.GLSL */;
                super(name, "volumetricLightScattering", ["decay", "exposure", "weight", "meshPositionOnScreen", "density"], ["lightScatteringSampler"], ratio.postProcessRatio || ratio, camera, samplingMode, selectedEngine, reusable, "#define NUM_SAMPLES " + samples, undefined, undefined, undefined, undefined, undefined, shaderLanguage);
                this._screenCoordinates = Vector2.Zero();
                /**
                 * Custom position of the mesh. Used if "useCustomMeshPosition" is set to "true"
                 */
                this.customMeshPosition = __runInitializers(this, _customMeshPosition_initializers, Vector3.Zero());
                /**
                 * Set if the post-process should use a custom position for the light source (true) or the internal mesh position (false)
                 */
                this.useCustomMeshPosition = (__runInitializers(this, _customMeshPosition_extraInitializers), __runInitializers(this, _useCustomMeshPosition_initializers, false));
                /**
                 * If the post-process should inverse the light scattering direction
                 */
                this.invert = (__runInitializers(this, _useCustomMeshPosition_extraInitializers), __runInitializers(this, _invert_initializers, true));
                /**
                 * The internal mesh used by the post-process
                 */
                this.mesh = (__runInitializers(this, _invert_extraInitializers), __runInitializers(this, _mesh_initializers, void 0));
                /**
                 * Array containing the excluded meshes not rendered in the internal pass
                 */
                this.excludedMeshes = (__runInitializers(this, _mesh_extraInitializers), __runInitializers(this, _excludedMeshes_initializers, []));
                /**
                 * Array containing the only meshes rendered in the internal pass.
                 * If this array is not empty, only the meshes from this array are rendered in the internal pass
                 */
                this.includedMeshes = (__runInitializers(this, _excludedMeshes_extraInitializers), __runInitializers(this, _includedMeshes_initializers, []));
                /**
                 * Controls the overall intensity of the post-process
                 */
                this.exposure = (__runInitializers(this, _includedMeshes_extraInitializers), __runInitializers(this, _exposure_initializers, 0.3));
                /**
                 * Dissipates each sample's contribution in range [0, 1]
                 */
                this.decay = (__runInitializers(this, _exposure_extraInitializers), __runInitializers(this, _decay_initializers, 0.96815));
                /**
                 * Controls the overall intensity of each sample
                 */
                this.weight = (__runInitializers(this, _decay_extraInitializers), __runInitializers(this, _weight_initializers, 0.58767));
                /**
                 * Controls the density of each sample
                 */
                this.density = (__runInitializers(this, _weight_extraInitializers), __runInitializers(this, _density_initializers, 0.926));
                __runInitializers(this, _density_extraInitializers);
                scene = camera?.getScene() ?? scene ?? this._scene; // parameter "scene" can be null.
                engine = scene.getEngine();
                this._viewPort = new Viewport(0, 0, 1, 1).toGlobal(engine.getRenderWidth(), engine.getRenderHeight());
                // Configure mesh
                this.mesh = mesh ?? _a.CreateDefaultMesh("VolumetricLightScatteringMesh", scene);
                // Configure
                this._createPass(scene, ratio.passRatio || ratio);
                this.onActivate = (camera) => {
                    if (!this.isSupported) {
                        this.dispose(camera);
                    }
                    this.onActivate = null;
                };
                this.onApplyObservable.add((effect) => {
                    this._updateMeshScreenCoordinates(scene);
                    effect.setTexture("lightScatteringSampler", this._volumetricLightScatteringRTT);
                    effect.setFloat("exposure", this.exposure);
                    effect.setFloat("decay", this.decay);
                    effect.setFloat("weight", this.weight);
                    effect.setFloat("density", this.density);
                    effect.setVector2("meshPositionOnScreen", this._screenCoordinates);
                });
            }
            _gatherImports(useWebGPU, list) {
                if (useWebGPU) {
                    this._webGPUReady = true;
                    list.push(Promise.all([
                        import("../ShadersWGSL/volumetricLightScattering.fragment.js"),
                        import("../ShadersWGSL/volumetricLightScatteringPass.vertex.js"),
                        import("../ShadersWGSL/volumetricLightScatteringPass.fragment.js"),
                    ]));
                }
                else {
                    list.push(Promise.all([
                        import("../Shaders/volumetricLightScattering.fragment.js"),
                        import("../Shaders/volumetricLightScatteringPass.vertex.js"),
                        import("../Shaders/volumetricLightScatteringPass.fragment.js"),
                    ]));
                }
                super._gatherImports(useWebGPU, list);
            }
            /**
             * Returns the string "VolumetricLightScatteringPostProcess"
             * @returns "VolumetricLightScatteringPostProcess"
             */
            getClassName() {
                return "VolumetricLightScatteringPostProcess";
            }
            _isReady(subMesh, useInstances) {
                const mesh = subMesh.getMesh();
                // Render this.mesh as default
                if (mesh === this.mesh && mesh.material) {
                    return mesh.material.isReady(mesh);
                }
                const renderingMaterial = mesh._internalAbstractMeshDataInfo._materialForRenderPass?.[this._scene.getEngine().currentRenderPassId];
                if (renderingMaterial) {
                    return renderingMaterial.isReadyForSubMesh(mesh, subMesh, useInstances);
                }
                const defines = [];
                const attribs = [VertexBuffer.PositionKind];
                const material = subMesh.getMaterial();
                let uv1 = false;
                let uv2 = false;
                const color = false;
                // Alpha test
                if (material) {
                    const needAlphaTesting = material.needAlphaTestingForMesh(mesh);
                    if (needAlphaTesting) {
                        defines.push("#define ALPHATEST");
                    }
                    if (mesh.isVerticesDataPresent(VertexBuffer.UVKind)) {
                        attribs.push(VertexBuffer.UVKind);
                        defines.push("#define UV1");
                        uv1 = needAlphaTesting;
                    }
                    if (mesh.isVerticesDataPresent(VertexBuffer.UV2Kind)) {
                        attribs.push(VertexBuffer.UV2Kind);
                        defines.push("#define UV2");
                        uv2 = needAlphaTesting;
                    }
                }
                // Bones
                const fallbacks = new EffectFallbacks();
                if (mesh.useBones && mesh.computeBonesUsingShaders && mesh.skeleton) {
                    attribs.push(VertexBuffer.MatricesIndicesKind);
                    attribs.push(VertexBuffer.MatricesWeightsKind);
                    if (mesh.numBoneInfluencers > 4) {
                        attribs.push(VertexBuffer.MatricesIndicesExtraKind);
                        attribs.push(VertexBuffer.MatricesWeightsExtraKind);
                    }
                    defines.push("#define NUM_BONE_INFLUENCERS " + mesh.numBoneInfluencers);
                    if (mesh.numBoneInfluencers > 0) {
                        fallbacks.addCPUSkinningFallback(0, mesh);
                    }
                    const skeleton = mesh.skeleton;
                    if (skeleton.isUsingTextureForMatrices) {
                        defines.push("#define BONETEXTURE");
                    }
                    else {
                        defines.push("#define BonesPerMesh " + (skeleton.bones.length + 1));
                    }
                }
                else {
                    defines.push("#define NUM_BONE_INFLUENCERS 0");
                }
                // Morph targets
                const numMorphInfluencers = mesh.morphTargetManager
                    ? PrepareDefinesAndAttributesForMorphTargets(mesh.morphTargetManager, defines, attribs, mesh, true, // usePositionMorph
                    false, // useNormalMorph
                    false, // useTangentMorph
                    uv1, // useUVMorph
                    uv2, // useUV2Morph
                    color // useColorMorph
                    )
                    : 0;
                // Instances
                if (useInstances) {
                    defines.push("#define INSTANCES");
                    PushAttributesForInstances(attribs);
                    if (subMesh.getRenderingMesh().hasThinInstances) {
                        defines.push("#define THIN_INSTANCES");
                    }
                }
                // Baked vertex animations
                const bvaManager = mesh.bakedVertexAnimationManager;
                if (bvaManager && bvaManager.isEnabled) {
                    defines.push("#define BAKED_VERTEX_ANIMATION_TEXTURE");
                    if (useInstances) {
                        attribs.push("bakedVertexAnimationSettingsInstanced");
                    }
                }
                // Get correct effect
                const drawWrapper = subMesh._getDrawWrapper(undefined, true);
                const cachedDefines = drawWrapper.defines;
                const join = defines.join("\n");
                if (cachedDefines !== join) {
                    const engine = mesh.getScene().getEngine();
                    const uniforms = [
                        "world",
                        "mBones",
                        "boneTextureInfo",
                        "viewProjection",
                        "diffuseMatrix",
                        "morphTargetInfluences",
                        "morphTargetCount",
                        "morphTargetTextureInfo",
                        "morphTargetTextureIndices",
                        "bakedVertexAnimationSettings",
                        "bakedVertexAnimationTextureSizeInverted",
                        "bakedVertexAnimationTime",
                        "bakedVertexAnimationTexture",
                    ];
                    const samplers = ["diffuseSampler", "morphTargets", "boneSampler", "bakedVertexAnimationTexture"];
                    drawWrapper.setEffect(engine.createEffect("volumetricLightScatteringPass", {
                        attributes: attribs,
                        uniformsNames: uniforms,
                        uniformBuffersNames: [],
                        samplers: samplers,
                        defines: join,
                        fallbacks: fallbacks,
                        onCompiled: null,
                        onError: null,
                        indexParameters: { maxSimultaneousMorphTargets: numMorphInfluencers },
                        shaderLanguage: engine.isWebGPU && !PostProcess.ForceGLSL ? 1 /* ShaderLanguage.WGSL */ : 0 /* ShaderLanguage.GLSL */,
                    }, engine), join);
                }
                return drawWrapper.effect.isReady();
            }
            /**
             * Sets the new light position for light scattering effect
             * @param position The new custom light position
             */
            setCustomMeshPosition(position) {
                this.customMeshPosition = position;
            }
            /**
             * Returns the light position for light scattering effect
             * @returns Vector3 The custom light position
             */
            getCustomMeshPosition() {
                return this.customMeshPosition;
            }
            /**
             * Disposes the internal assets and detaches the post-process from the camera
             * @param camera The camera from which to detach the post-process
             */
            dispose(camera) {
                const rttIndex = camera.getScene().customRenderTargets.indexOf(this._volumetricLightScatteringRTT);
                if (rttIndex !== -1) {
                    camera.getScene().customRenderTargets.splice(rttIndex, 1);
                }
                this._volumetricLightScatteringRTT.dispose();
                super.dispose(camera);
            }
            /**
             * Returns the render target texture used by the post-process
             * @returns the render target texture used by the post-process
             */
            getPass() {
                return this._volumetricLightScatteringRTT;
            }
            // Private methods
            _meshExcluded(mesh) {
                if ((this.includedMeshes.length > 0 && this.includedMeshes.indexOf(mesh) === -1) || (this.excludedMeshes.length > 0 && this.excludedMeshes.indexOf(mesh) !== -1)) {
                    return true;
                }
                return false;
            }
            _createPass(scene, ratio) {
                const engine = scene.getEngine();
                this._volumetricLightScatteringRTT = new RenderTargetTexture("volumetricLightScatteringMap", { width: engine.getRenderWidth() * ratio, height: engine.getRenderHeight() * ratio }, scene, false, true, 0);
                this._volumetricLightScatteringRTT.wrapU = Texture.CLAMP_ADDRESSMODE;
                this._volumetricLightScatteringRTT.wrapV = Texture.CLAMP_ADDRESSMODE;
                this._volumetricLightScatteringRTT.renderList = null;
                this._volumetricLightScatteringRTT.renderParticles = false;
                this._volumetricLightScatteringRTT.ignoreCameraViewport = true;
                const camera = this.getCamera();
                if (camera) {
                    camera.customRenderTargets.push(this._volumetricLightScatteringRTT);
                }
                else {
                    scene.customRenderTargets.push(this._volumetricLightScatteringRTT);
                }
                // Custom render function for submeshes
                const renderSubMesh = (subMesh) => {
                    const renderingMesh = subMesh.getRenderingMesh();
                    const effectiveMesh = subMesh.getEffectiveMesh();
                    if (this._meshExcluded(renderingMesh)) {
                        return;
                    }
                    effectiveMesh._internalAbstractMeshDataInfo._isActiveIntermediate = false;
                    const material = subMesh.getMaterial();
                    if (!material) {
                        return;
                    }
                    const scene = renderingMesh.getScene();
                    const engine = scene.getEngine();
                    // Culling
                    engine.setState(material.backFaceCulling, undefined, undefined, undefined, material.cullBackFaces);
                    // Managing instances
                    const batch = renderingMesh._getInstancesRenderList(subMesh._id, !!subMesh.getReplacementMesh());
                    if (batch.mustReturn) {
                        return;
                    }
                    const hardwareInstancedRendering = engine.getCaps().instancedArrays && (batch.visibleInstances[subMesh._id] !== null || renderingMesh.hasThinInstances);
                    if (this._isReady(subMesh, hardwareInstancedRendering)) {
                        const renderingMaterial = effectiveMesh._internalAbstractMeshDataInfo._materialForRenderPass?.[engine.currentRenderPassId];
                        let drawWrapper = subMesh._getDrawWrapper();
                        if (renderingMesh === this.mesh && !drawWrapper) {
                            drawWrapper = material._getDrawWrapper();
                        }
                        if (!drawWrapper) {
                            return;
                        }
                        const effect = drawWrapper.effect;
                        engine.enableEffect(drawWrapper);
                        if (!hardwareInstancedRendering) {
                            renderingMesh._bind(subMesh, effect, material.fillMode);
                        }
                        if (renderingMesh === this.mesh) {
                            material.bind(effectiveMesh.getWorldMatrix(), renderingMesh);
                        }
                        else if (renderingMaterial) {
                            renderingMaterial.bindForSubMesh(effectiveMesh.getWorldMatrix(), effectiveMesh, subMesh);
                        }
                        else {
                            effect.setMatrix("viewProjection", scene.getTransformMatrix());
                            // Alpha test
                            if (material.needAlphaTestingForMesh(effectiveMesh)) {
                                const alphaTexture = material.getAlphaTestTexture();
                                if (alphaTexture) {
                                    effect.setTexture("diffuseSampler", alphaTexture);
                                    effect.setMatrix("diffuseMatrix", alphaTexture.getTextureMatrix());
                                }
                            }
                            // Bones
                            BindBonesParameters(renderingMesh, effect);
                            // Morph targets
                            BindMorphTargetParameters(renderingMesh, effect);
                            if (renderingMesh.morphTargetManager && renderingMesh.morphTargetManager.isUsingTextureForTargets) {
                                renderingMesh.morphTargetManager._bind(effect);
                            }
                            // Baked vertex animations
                            const bvaManager = subMesh.getMesh().bakedVertexAnimationManager;
                            if (bvaManager && bvaManager.isEnabled) {
                                bvaManager.bind(effect, hardwareInstancedRendering);
                            }
                        }
                        if (hardwareInstancedRendering && renderingMesh.hasThinInstances) {
                            effect.setMatrix("world", effectiveMesh.getWorldMatrix());
                        }
                        // Draw
                        renderingMesh._processRendering(effectiveMesh, subMesh, effect, Material.TriangleFillMode, batch, hardwareInstancedRendering, (isInstance, world) => {
                            if (!isInstance) {
                                effect.setMatrix("world", world);
                            }
                        });
                    }
                };
                // Render target texture callbacks
                let savedSceneClearColor;
                const sceneClearColor = new Color4(0.0, 0.0, 0.0, 1.0);
                this._volumetricLightScatteringRTT.onBeforeRenderObservable.add(() => {
                    savedSceneClearColor = scene.clearColor;
                    scene.clearColor = sceneClearColor;
                });
                this._volumetricLightScatteringRTT.onAfterRenderObservable.add(() => {
                    scene.clearColor = savedSceneClearColor;
                });
                this._volumetricLightScatteringRTT.customIsReadyFunction = (mesh, refreshRate, preWarm) => {
                    if ((preWarm || refreshRate === 0) && mesh.subMeshes) {
                        for (let i = 0; i < mesh.subMeshes.length; ++i) {
                            const subMesh = mesh.subMeshes[i];
                            const material = subMesh.getMaterial();
                            const renderingMesh = subMesh.getRenderingMesh();
                            if (!material) {
                                continue;
                            }
                            const batch = renderingMesh._getInstancesRenderList(subMesh._id, !!subMesh.getReplacementMesh());
                            const hardwareInstancedRendering = engine.getCaps().instancedArrays && (batch.visibleInstances[subMesh._id] !== null || renderingMesh.hasThinInstances);
                            if (!this._isReady(subMesh, hardwareInstancedRendering)) {
                                return false;
                            }
                        }
                    }
                    return true;
                };
                this._volumetricLightScatteringRTT.customRenderFunction = (opaqueSubMeshes, alphaTestSubMeshes, transparentSubMeshes, depthOnlySubMeshes) => {
                    const engine = scene.getEngine();
                    let index;
                    if (depthOnlySubMeshes.length) {
                        engine.setColorWrite(false);
                        for (index = 0; index < depthOnlySubMeshes.length; index++) {
                            renderSubMesh(depthOnlySubMeshes.data[index]);
                        }
                        engine.setColorWrite(true);
                    }
                    for (index = 0; index < opaqueSubMeshes.length; index++) {
                        renderSubMesh(opaqueSubMeshes.data[index]);
                    }
                    for (index = 0; index < alphaTestSubMeshes.length; index++) {
                        renderSubMesh(alphaTestSubMeshes.data[index]);
                    }
                    if (transparentSubMeshes.length) {
                        // Sort sub meshes
                        for (index = 0; index < transparentSubMeshes.length; index++) {
                            const submesh = transparentSubMeshes.data[index];
                            const boundingInfo = submesh.getBoundingInfo();
                            if (boundingInfo && scene.activeCamera) {
                                submesh._alphaIndex = submesh.getMesh().alphaIndex;
                                submesh._distanceToCamera = boundingInfo.boundingSphere.centerWorld.subtract(scene.activeCamera.position).length();
                            }
                        }
                        const sortedArray = transparentSubMeshes.data.slice(0, transparentSubMeshes.length);
                        sortedArray.sort((a, b) => {
                            // Alpha index first
                            if (a._alphaIndex > b._alphaIndex) {
                                return 1;
                            }
                            if (a._alphaIndex < b._alphaIndex) {
                                return -1;
                            }
                            // Then distance to camera
                            if (a._distanceToCamera < b._distanceToCamera) {
                                return 1;
                            }
                            if (a._distanceToCamera > b._distanceToCamera) {
                                return -1;
                            }
                            return 0;
                        });
                        // Render sub meshes
                        engine.setAlphaMode(2);
                        for (index = 0; index < sortedArray.length; index++) {
                            renderSubMesh(sortedArray[index]);
                        }
                        engine.setAlphaMode(0);
                    }
                };
            }
            _updateMeshScreenCoordinates(scene) {
                const transform = scene.getTransformMatrix();
                let meshPosition;
                if (this.useCustomMeshPosition) {
                    meshPosition = this.customMeshPosition;
                }
                else if (this.attachedNode) {
                    meshPosition = this.attachedNode.position;
                }
                else {
                    meshPosition = this.mesh.parent ? this.mesh.getAbsolutePosition() : this.mesh.position;
                }
                const pos = Vector3.Project(meshPosition, Matrix.Identity(), transform, this._viewPort);
                this._screenCoordinates.x = pos.x / this._viewPort.width;
                this._screenCoordinates.y = pos.y / this._viewPort.height;
                if (this.invert) {
                    this._screenCoordinates.y = 1.0 - this._screenCoordinates.y;
                }
            }
            // Static methods
            /**
             * Creates a default mesh for the Volumeric Light Scattering post-process
             * @param name The mesh name
             * @param scene The scene where to create the mesh
             * @returns the default mesh
             */
            static CreateDefaultMesh(name, scene) {
                const mesh = CreatePlane(name, { size: 1 }, scene);
                mesh.billboardMode = AbstractMesh.BILLBOARDMODE_ALL;
                const material = new StandardMaterial(name + "Material", scene);
                material.emissiveColor = new Color3(1, 1, 1);
                mesh.material = material;
                return mesh;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _customMeshPosition_decorators = [serializeAsVector3()];
            _useCustomMeshPosition_decorators = [serialize()];
            _invert_decorators = [serialize()];
            _mesh_decorators = [serializeAsMeshReference()];
            _excludedMeshes_decorators = [serialize()];
            _includedMeshes_decorators = [serialize()];
            _exposure_decorators = [serialize()];
            _decay_decorators = [serialize()];
            _weight_decorators = [serialize()];
            _density_decorators = [serialize()];
            __esDecorate(null, null, _customMeshPosition_decorators, { kind: "field", name: "customMeshPosition", static: false, private: false, access: { has: obj => "customMeshPosition" in obj, get: obj => obj.customMeshPosition, set: (obj, value) => { obj.customMeshPosition = value; } }, metadata: _metadata }, _customMeshPosition_initializers, _customMeshPosition_extraInitializers);
            __esDecorate(null, null, _useCustomMeshPosition_decorators, { kind: "field", name: "useCustomMeshPosition", static: false, private: false, access: { has: obj => "useCustomMeshPosition" in obj, get: obj => obj.useCustomMeshPosition, set: (obj, value) => { obj.useCustomMeshPosition = value; } }, metadata: _metadata }, _useCustomMeshPosition_initializers, _useCustomMeshPosition_extraInitializers);
            __esDecorate(null, null, _invert_decorators, { kind: "field", name: "invert", static: false, private: false, access: { has: obj => "invert" in obj, get: obj => obj.invert, set: (obj, value) => { obj.invert = value; } }, metadata: _metadata }, _invert_initializers, _invert_extraInitializers);
            __esDecorate(null, null, _mesh_decorators, { kind: "field", name: "mesh", static: false, private: false, access: { has: obj => "mesh" in obj, get: obj => obj.mesh, set: (obj, value) => { obj.mesh = value; } }, metadata: _metadata }, _mesh_initializers, _mesh_extraInitializers);
            __esDecorate(null, null, _excludedMeshes_decorators, { kind: "field", name: "excludedMeshes", static: false, private: false, access: { has: obj => "excludedMeshes" in obj, get: obj => obj.excludedMeshes, set: (obj, value) => { obj.excludedMeshes = value; } }, metadata: _metadata }, _excludedMeshes_initializers, _excludedMeshes_extraInitializers);
            __esDecorate(null, null, _includedMeshes_decorators, { kind: "field", name: "includedMeshes", static: false, private: false, access: { has: obj => "includedMeshes" in obj, get: obj => obj.includedMeshes, set: (obj, value) => { obj.includedMeshes = value; } }, metadata: _metadata }, _includedMeshes_initializers, _includedMeshes_extraInitializers);
            __esDecorate(null, null, _exposure_decorators, { kind: "field", name: "exposure", static: false, private: false, access: { has: obj => "exposure" in obj, get: obj => obj.exposure, set: (obj, value) => { obj.exposure = value; } }, metadata: _metadata }, _exposure_initializers, _exposure_extraInitializers);
            __esDecorate(null, null, _decay_decorators, { kind: "field", name: "decay", static: false, private: false, access: { has: obj => "decay" in obj, get: obj => obj.decay, set: (obj, value) => { obj.decay = value; } }, metadata: _metadata }, _decay_initializers, _decay_extraInitializers);
            __esDecorate(null, null, _weight_decorators, { kind: "field", name: "weight", static: false, private: false, access: { has: obj => "weight" in obj, get: obj => obj.weight, set: (obj, value) => { obj.weight = value; } }, metadata: _metadata }, _weight_initializers, _weight_extraInitializers);
            __esDecorate(null, null, _density_decorators, { kind: "field", name: "density", static: false, private: false, access: { has: obj => "density" in obj, get: obj => obj.density, set: (obj, value) => { obj.density = value; } }, metadata: _metadata }, _density_initializers, _density_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { VolumetricLightScatteringPostProcess };
let _Registered = false;
/**
 * Register side effects for volumetricLightScatteringPostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterVolumetricLightScatteringPostProcess() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.VolumetricLightScatteringPostProcess", VolumetricLightScatteringPostProcess);
}
//# sourceMappingURL=volumetricLightScatteringPostProcess.pure.js.map