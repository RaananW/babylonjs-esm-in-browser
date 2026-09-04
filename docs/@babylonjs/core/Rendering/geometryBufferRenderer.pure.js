/** This file must only contain pure code and pure imports */
import { Matrix } from "../Maths/math.vector.pure.js";
import { VertexBuffer } from "../Buffers/buffer.pure.js";

import { Texture } from "../Materials/Textures/texture.pure.js";
import { MultiRenderTarget } from "../Materials/Textures/multiRenderTarget.pure.js";
import { Color4 } from "../Maths/math.color.pure.js";
import { _WarnImport } from "../Misc/devTools.js";
import { Material } from "../Materials/material.pure.js";
import { MaterialFlags } from "../Materials/materialFlags.js";
import { BindClipPlane, PrepareStringDefinesForClipPlanes, AddClipPlaneUniforms } from "../Materials/clipPlaneMaterialHelper.js";
import { BindMorphTargetParameters, BindSceneUniformBuffer, PrepareDefinesAndAttributesForMorphTargets, PushAttributesForInstances, PrepareDefinesForIBL, PrepareUniformsAndSamplersForIBL, } from "../Materials/materialHelper.functions.js";
import { RegisterGeometryBufferRendererSceneComponent } from "./geometryBufferRendererSceneComponent.pure.js";
import { IsGaussianSplattingClassName } from "../Meshes/GaussianSplatting/gaussianSplattingMesh.pure.js";
export const Samplers = [
    "diffuseSampler",
    "bumpSampler",
    "reflectivitySampler",
    "albedoSampler",
    "morphTargets",
    "boneSampler",
    "transmissionWeightSampler",
    "subsurfaceWeightSampler",
    "iblShadowSampler",
];
/** list the uniforms used by the geometry renderer */
export const Uniforms = [
    "world",
    "mBones",
    "viewProjection",
    "diffuseMatrix",
    "view",
    "previousWorld",
    "previousViewProjection",
    "mPreviousBones",
    "bumpMatrix",
    "reflectivityMatrix",
    "albedoMatrix",
    "reflectivityColor",
    "albedoColor",
    "reflectionMatrix",
    "vTransmissionWeight",
    "vSubsurfaceWeight",
    "vEyePosition",
    "vTransmissionScatterAnisotropy",
    "vSubsurfaceScatterAnisotropy",
    "shadowTextureSize",
    "metallic",
    "glossiness",
    "vTangentSpaceParams",
    "vBumpInfos",
    "morphTargetInfluences",
    "morphTargetCount",
    "morphTargetTextureInfo",
    "morphTargetTextureIndices",
    "boneTextureInfo",
];
/**
 * This renderer is helpful to fill one of the render target with a geometry buffer.
 */
export class GeometryBufferRenderer {
    /**
     * Gets a boolean indicating if normals are encoded in the [0,1] range in the render target. If true, you should do `normal = normal_rt * 2.0 - 1.0` to get the right normal
     */
    get normalsAreUnsigned() {
        return this._normalsAreUnsigned;
    }
    /**
     * @internal
     * Sets up internal structures to share outputs with PrePassRenderer
     * This method should only be called by the PrePassRenderer itself
     */
    _linkPrePassRenderer(prePassRenderer) {
        this._linkedWithPrePass = true;
        this._prePassRenderer = prePassRenderer;
        if (this._multiRenderTarget) {
            // prevents clearing of the RT since it's done by prepass
            this._multiRenderTarget.onClearObservable.clear();
            this._multiRenderTarget.onClearObservable.add(() => {
                // pass
            });
        }
    }
    /**
     * @internal
     * Separates internal structures from PrePassRenderer so the geometry buffer can now operate by itself.
     * This method should only be called by the PrePassRenderer itself
     */
    _unlinkPrePassRenderer() {
        this._linkedWithPrePass = false;
        this._createRenderTargets();
    }
    /**
     * @internal
     * Resets the geometry buffer layout
     */
    _resetLayout() {
        this._enableDepth = true;
        this._enableNormal = true;
        this._enablePosition = false;
        this._enableReflectivity = false;
        this._enableVelocity = false;
        this._enableVelocityLinear = false;
        this._enableScreenspaceDepth = false;
        this._enableIrradiance = false;
        this._attachmentsFromPrePass = [];
    }
    /**
     * @internal
     * Replaces a texture in the geometry buffer renderer
     * Useful when linking textures of the prepass renderer
     */
    _forceTextureType(geometryBufferType, index) {
        if (geometryBufferType === GeometryBufferRenderer.POSITION_TEXTURE_TYPE) {
            this._positionIndex = index;
            this._enablePosition = true;
        }
        else if (geometryBufferType === GeometryBufferRenderer.VELOCITY_TEXTURE_TYPE) {
            this._velocityIndex = index;
            this._enableVelocity = true;
        }
        else if (geometryBufferType === GeometryBufferRenderer.VELOCITY_LINEAR_TEXTURE_TYPE) {
            this._velocityLinearIndex = index;
            this._enableVelocityLinear = true;
        }
        else if (geometryBufferType === GeometryBufferRenderer.REFLECTIVITY_TEXTURE_TYPE) {
            this._reflectivityIndex = index;
            this._enableReflectivity = true;
        }
        else if (geometryBufferType === GeometryBufferRenderer.DEPTH_TEXTURE_TYPE) {
            this._depthIndex = index;
            this._enableDepth = true;
        }
        else if (geometryBufferType === GeometryBufferRenderer.NORMAL_TEXTURE_TYPE) {
            this._normalIndex = index;
            this._enableNormal = true;
        }
        else if (geometryBufferType === GeometryBufferRenderer.SCREENSPACE_DEPTH_TEXTURE_TYPE) {
            this._screenspaceDepthIndex = index;
            this._enableScreenspaceDepth = true;
        }
        else if (geometryBufferType === GeometryBufferRenderer.IRRADIANCE_TEXTURE_TYPE) {
            this._irradianceIndex = index;
            this._enableIrradiance = true;
        }
    }
    /**
     * @internal
     * Sets texture attachments
     * Useful when linking textures of the prepass renderer
     */
    _setAttachments(attachments) {
        this._attachmentsFromPrePass = attachments;
    }
    /**
     * @internal
     * Replaces the first texture which is hard coded as a depth texture in the geometry buffer
     * Useful when linking textures of the prepass renderer
     */
    _linkInternalTexture(internalTexture) {
        this._multiRenderTarget.setInternalTexture(internalTexture, 0, false);
    }
    /**
     * Gets the render list (meshes to be rendered) used in the G buffer.
     */
    get renderList() {
        return this._multiRenderTarget.renderList;
    }
    /**
     * Set the render list (meshes to be rendered) used in the G buffer.
     */
    set renderList(meshes) {
        this._multiRenderTarget.renderList = meshes;
    }
    /**
     * Gets whether or not G buffer are supported by the running hardware.
     * This requires draw buffer supports
     */
    get isSupported() {
        return this._multiRenderTarget.isSupported;
    }
    /**
     * Returns the index of the given texture type in the G-Buffer textures array
     * @param textureType The texture type constant. For example GeometryBufferRenderer.POSITION_TEXTURE_INDEX
     * @returns the index of the given texture type in the G-Buffer textures array
     */
    getTextureIndex(textureType) {
        switch (textureType) {
            case GeometryBufferRenderer.POSITION_TEXTURE_TYPE:
                return this._positionIndex;
            case GeometryBufferRenderer.VELOCITY_TEXTURE_TYPE:
                return this._velocityIndex;
            case GeometryBufferRenderer.VELOCITY_LINEAR_TEXTURE_TYPE:
                return this._velocityLinearIndex;
            case GeometryBufferRenderer.REFLECTIVITY_TEXTURE_TYPE:
                return this._reflectivityIndex;
            case GeometryBufferRenderer.DEPTH_TEXTURE_TYPE:
                return this._depthIndex;
            case GeometryBufferRenderer.NORMAL_TEXTURE_TYPE:
                return this._normalIndex;
            case GeometryBufferRenderer.SCREENSPACE_DEPTH_TEXTURE_TYPE:
                return this._screenspaceDepthIndex;
            case GeometryBufferRenderer.IRRADIANCE_TEXTURE_TYPE:
                return this._irradianceIndex;
            default:
                return -1;
        }
    }
    /**
     * @returns a boolean indicating if object's depths are enabled for the G buffer.
     */
    get enableDepth() {
        return this._enableDepth;
    }
    /**
     * Sets whether or not object's depths are enabled for the G buffer.
     */
    set enableDepth(enable) {
        this._enableDepth = enable;
        if (!this._linkedWithPrePass) {
            this.dispose();
            this._createRenderTargets();
        }
    }
    /**
     * @returns a boolean indicating if object's normals are enabled for the G buffer.
     */
    get enableNormal() {
        return this._enableNormal;
    }
    /**
     * Sets whether or not object's normals are enabled for the G buffer.
     */
    set enableNormal(enable) {
        this._enableNormal = enable;
        if (!this._linkedWithPrePass) {
            this.dispose();
            this._createRenderTargets();
        }
    }
    /**
     * @returns a boolean indicating if objects positions are enabled for the G buffer.
     */
    get enablePosition() {
        return this._enablePosition;
    }
    /**
     * Sets whether or not objects positions are enabled for the G buffer.
     */
    set enablePosition(enable) {
        this._enablePosition = enable;
        // PrePass handles index and texture links
        if (!this._linkedWithPrePass) {
            this.dispose();
            this._createRenderTargets();
        }
    }
    /**
     * @returns a boolean indicating if objects velocities are enabled for the G buffer.
     */
    get enableVelocity() {
        return this._enableVelocity;
    }
    /**
     * Sets whether or not objects velocities are enabled for the G buffer.
     */
    set enableVelocity(enable) {
        this._enableVelocity = enable;
        if (!enable) {
            this._previousTransformationMatrices = {};
        }
        if (!this._linkedWithPrePass) {
            this.dispose();
            this._createRenderTargets();
        }
        this._scene.needsPreviousWorldMatrices = enable;
    }
    /**
     * @returns a boolean indicating if object's linear velocities are enabled for the G buffer.
     */
    get enableVelocityLinear() {
        return this._enableVelocityLinear;
    }
    /**
     * Sets whether or not object's linear velocities are enabled for the G buffer.
     */
    set enableVelocityLinear(enable) {
        this._enableVelocityLinear = enable;
        if (!this._linkedWithPrePass) {
            this.dispose();
            this._createRenderTargets();
        }
    }
    /**
     * Gets a boolean indicating if objects reflectivity are enabled in the G buffer.
     */
    get enableReflectivity() {
        return this._enableReflectivity;
    }
    /**
     * Sets whether or not objects reflectivity are enabled for the G buffer.
     * For Metallic-Roughness workflow with ORM texture, we assume that ORM texture is defined according to the default layout:
     * pbr.useRoughnessFromMetallicTextureAlpha = false;
     * pbr.useRoughnessFromMetallicTextureGreen = true;
     * pbr.useMetallnessFromMetallicTextureBlue = true;
     */
    set enableReflectivity(enable) {
        this._enableReflectivity = enable;
        if (!this._linkedWithPrePass) {
            this.dispose();
            this._createRenderTargets();
        }
    }
    /**
     * Sets whether or not objects screenspace depth are enabled for the G buffer.
     */
    get enableScreenspaceDepth() {
        return this._enableScreenspaceDepth;
    }
    set enableScreenspaceDepth(enable) {
        this._enableScreenspaceDepth = enable;
        if (!this._linkedWithPrePass) {
            this.dispose();
            this._createRenderTargets();
        }
    }
    /**
     * Gets a boolean indicating if objects irradiance are enabled in the G buffer.
     */
    get enableIrradiance() {
        return this._enableIrradiance;
    }
    /**
     * Sets whether or not objects irradiance are enabled for the G buffer.
     */
    set enableIrradiance(enable) {
        this._enableIrradiance = enable;
        if (!this._linkedWithPrePass) {
            this.dispose();
            this._createRenderTargets();
        }
    }
    /**
     * Gets the scene associated with the buffer.
     */
    get scene() {
        return this._scene;
    }
    /**
     * Gets the ratio used by the buffer during its creation.
     * How big is the buffer related to the main canvas.
     */
    get ratio() {
        return typeof this._ratioOrDimensions === "object" ? 1 : this._ratioOrDimensions;
    }
    /**
     * Gets the shader language used in this material.
     */
    get shaderLanguage() {
        return this._shaderLanguage;
    }
    /**
     * Creates a new G Buffer for the scene
     * @param scene The scene the buffer belongs to
     * @param ratioOrDimensions How big is the buffer related to the main canvas (default: 1). You can also directly pass a width and height for the generated textures
     * @param depthFormat Format of the depth texture (default: 15)
     * @param textureTypesAndFormats The types, formats and optional sampling modes of textures to create as render targets.
     * If not provided, all textures will be RGBA and float or half float, depending on the engine capabilities.
     */
    constructor(scene, ratioOrDimensions = 1, depthFormat = 15, textureTypesAndFormats) {
        /**
         * Dictionary used to store the previous transformation matrices of each rendered mesh
         * in order to compute objects velocities when enableVelocity is set to "true"
         * @internal
         */
        this._previousTransformationMatrices = {};
        /**
         * Dictionary used to store the previous bones transformation matrices of each rendered mesh
         * in order to compute objects velocities when enableVelocity is set to "true"
         * @internal
         */
        this._previousBonesTransformationMatrices = {};
        /**
         * Array used to store the ignored skinned meshes while computing velocity map (typically used by the motion blur post-process).
         * Avoids computing bones velocities and computes only mesh's velocity itself (position, rotation, scaling).
         */
        this.excludedSkinnedMeshesFromVelocity = [];
        /** Gets or sets a boolean indicating if transparent meshes should be rendered */
        this.renderTransparentMeshes = true;
        /**
         * Gets or sets a boolean indicating if normals should be generated in world space (default: false, meaning normals are generated in view space)
         */
        this.generateNormalsInWorldSpace = false;
        this._normalsAreUnsigned = false;
        this._resizeObserver = null;
        this._enableDepth = true;
        this._enableNormal = true;
        this._enablePosition = false;
        this._enableVelocity = false;
        this._enableVelocityLinear = false;
        this._enableReflectivity = false;
        this._enableScreenspaceDepth = false;
        this._enableIrradiance = false;
        this._clearColor = new Color4(0, 0, 0, 0);
        this._clearDepthColor = new Color4(0, 0, 0, 1); // sets an invalid value by default - depth in the depth texture is view.z, so 0 is not possible because view.z can't be less than camera.minZ
        this._positionIndex = -1;
        this._velocityIndex = -1;
        this._velocityLinearIndex = -1;
        this._reflectivityIndex = -1;
        this._depthIndex = -1;
        this._normalIndex = -1;
        this._screenspaceDepthIndex = -1;
        this._irradianceIndex = -1;
        this._linkedWithPrePass = false;
        /**
         * This will store a mask in the alpha channel of the irradiance texture to indicate which pixels have
         * scattering and should be taken into account when applying image-based lighting.
         */
        this.generateIrradianceWithScatterMask = false;
        /**
         * If set to true (default: false), the depth texture will be cleared with the depth value corresponding to the far plane (1 in normal mode, 0 in reverse depth buffer mode)
         * If set to false, the depth texture is always cleared with 0.
         */
        this.useSpecificClearForDepthTexture = false;
        /** Shader language used by the material */
        this._shaderLanguage = 0 /* ShaderLanguage.GLSL */;
        this._shadersLoaded = false;
        this._scene = scene;
        this._ratioOrDimensions = ratioOrDimensions;
        this._useUbo = scene.getEngine().supportsUniformBuffers;
        this._depthFormat = depthFormat;
        this._textureTypesAndFormats = textureTypesAndFormats || {};
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._initShaderSourceAsync();
        RegisterGeometryBufferRendererSceneComponent(GeometryBufferRenderer);
        GeometryBufferRenderer._SceneComponentInitialization(this._scene);
        // Render target
        this._createRenderTargets();
    }
    async _initShaderSourceAsync() {
        const engine = this._scene.getEngine();
        if (engine.isWebGPU && !GeometryBufferRenderer.ForceGLSL) {
            this._shaderLanguage = 1 /* ShaderLanguage.WGSL */;
            await Promise.all([import("../ShadersWGSL/geometry.vertex.js"), import("../ShadersWGSL/geometry.fragment.js")]);
        }
        else {
            await Promise.all([import("../Shaders/geometry.vertex.js"), import("../Shaders/geometry.fragment.js")]);
        }
        this._shadersLoaded = true;
    }
    /**
     * Checks whether everything is ready to render a submesh to the G buffer.
     * @param subMesh the submesh to check readiness for
     * @param useInstances is the mesh drawn using instance or not
     * @returns true if ready otherwise false
     */
    isReady(subMesh, useInstances) {
        if (!this._shadersLoaded) {
            return false;
        }
        const material = subMesh.getMaterial();
        if (material && material.disableDepthWrite) {
            return false;
        }
        // Gaussian Splatting meshes store splat indices in position.z (not world-space Z).
        // The generic geometry.vertex shader misreads this as world coordinates, producing
        // garbage positions and normals, and thus they should be excluded from the G-buffer
        // rendering.
        if (IsGaussianSplattingClassName(subMesh.getMesh().getClassName())) {
            return false;
        }
        const defines = [];
        const attribs = [VertexBuffer.PositionKind];
        const mesh = subMesh.getMesh();
        const hasNormals = mesh.isVerticesDataPresent(VertexBuffer.NormalKind);
        if (hasNormals) {
            defines.push("#define HAS_NORMAL_ATTRIBUTE");
            attribs.push(VertexBuffer.NormalKind);
        }
        let uv1 = false;
        let uv2 = false;
        const color = false;
        if (material) {
            let needUv = false;
            // Alpha test
            if (material.needAlphaTestingForMesh(mesh) && material.getAlphaTestTexture()) {
                defines.push("#define ALPHATEST");
                defines.push(`#define ALPHATEST_UV${material.getAlphaTestTexture().coordinatesIndex + 1}`);
                needUv = true;
            }
            // Normal map texture
            if ((material.bumpTexture || material.normalTexture || material.geometryNormalTexture) && MaterialFlags.BumpTextureEnabled) {
                const texture = material.bumpTexture || material.normalTexture || material.geometryNormalTexture;
                defines.push("#define BUMP");
                defines.push(`#define BUMP_UV${texture.coordinatesIndex + 1}`);
                needUv = true;
            }
            if (this._enableReflectivity) {
                let metallicWorkflow = false;
                // for PBR materials: cf. https://doc.babylonjs.com/features/featuresDeepDive/materials/using/masterPBR
                if (material.getClassName() === "PBRMetallicRoughnessMaterial") {
                    // if it is a PBR material in MetallicRoughness Mode:
                    if (material.metallicRoughnessTexture) {
                        defines.push("#define ORMTEXTURE");
                        defines.push(`#define REFLECTIVITY_UV${material.metallicRoughnessTexture.coordinatesIndex + 1}`);
                        defines.push("#define METALLICWORKFLOW");
                        needUv = true;
                        metallicWorkflow = true;
                    }
                    // null or undefined
                    if (material.metallic != null) {
                        defines.push("#define METALLIC");
                        defines.push("#define METALLICWORKFLOW");
                        metallicWorkflow = true;
                    }
                    // null or undefined
                    if (material.roughness != null) {
                        defines.push("#define ROUGHNESS");
                        defines.push("#define METALLICWORKFLOW");
                        metallicWorkflow = true;
                    }
                    if (metallicWorkflow) {
                        if (material.baseTexture) {
                            defines.push("#define ALBEDOTEXTURE");
                            defines.push(`#define ALBEDO_UV${material.baseTexture.coordinatesIndex + 1}`);
                            if (material.baseTexture.gammaSpace) {
                                defines.push("#define GAMMAALBEDO");
                            }
                            needUv = true;
                        }
                        if (material.baseColor) {
                            defines.push("#define ALBEDOCOLOR");
                        }
                    }
                }
                else if (material.getClassName() === "PBRSpecularGlossinessMaterial") {
                    // if it is a PBR material in Specular/Glossiness Mode:
                    if (material.specularGlossinessTexture) {
                        defines.push("#define SPECULARGLOSSINESSTEXTURE");
                        defines.push(`#define REFLECTIVITY_UV${material.specularGlossinessTexture.coordinatesIndex + 1}`);
                        needUv = true;
                        if (material.specularGlossinessTexture.gammaSpace) {
                            defines.push("#define GAMMAREFLECTIVITYTEXTURE");
                        }
                    }
                    else {
                        if (material.specularColor) {
                            defines.push("#define REFLECTIVITYCOLOR");
                        }
                    }
                    // null or undefined
                    if (material.glossiness != null) {
                        defines.push("#define GLOSSINESS");
                    }
                }
                else if (material.getClassName() === "PBRMaterial") {
                    // if it is the bigger PBRMaterial
                    if (material.metallicTexture) {
                        defines.push("#define ORMTEXTURE");
                        defines.push(`#define REFLECTIVITY_UV${material.metallicTexture.coordinatesIndex + 1}`);
                        defines.push("#define METALLICWORKFLOW");
                        needUv = true;
                        metallicWorkflow = true;
                    }
                    // null or undefined
                    if (material.metallic != null) {
                        defines.push("#define METALLIC");
                        defines.push("#define METALLICWORKFLOW");
                        metallicWorkflow = true;
                    }
                    // null or undefined
                    if (material.roughness != null) {
                        defines.push("#define ROUGHNESS");
                        defines.push("#define METALLICWORKFLOW");
                        metallicWorkflow = true;
                    }
                    if (metallicWorkflow) {
                        if (material.albedoTexture) {
                            defines.push("#define ALBEDOTEXTURE");
                            defines.push(`#define ALBEDO_UV${material.albedoTexture.coordinatesIndex + 1}`);
                            if (material.albedoTexture.gammaSpace) {
                                defines.push("#define GAMMAALBEDO");
                            }
                            needUv = true;
                        }
                        if (material.albedoColor) {
                            defines.push("#define ALBEDOCOLOR");
                        }
                    }
                    else {
                        // SpecularGlossiness Model
                        if (material.reflectivityTexture) {
                            defines.push("#define SPECULARGLOSSINESSTEXTURE");
                            defines.push(`#define REFLECTIVITY_UV${material.reflectivityTexture.coordinatesIndex + 1}`);
                            if (material.reflectivityTexture.gammaSpace) {
                                defines.push("#define GAMMAREFLECTIVITYTEXTURE");
                            }
                            needUv = true;
                        }
                        else if (material.reflectivityColor) {
                            defines.push("#define REFLECTIVITYCOLOR");
                        }
                        // null or undefined
                        if (material.microSurface != null) {
                            defines.push("#define GLOSSINESS");
                        }
                    }
                }
                else if (material.getClassName() === "StandardMaterial") {
                    // if StandardMaterial:
                    if (material.specularTexture) {
                        defines.push("#define REFLECTIVITYTEXTURE");
                        defines.push(`#define REFLECTIVITY_UV${material.specularTexture.coordinatesIndex + 1}`);
                        if (material.specularTexture.gammaSpace) {
                            defines.push("#define GAMMAREFLECTIVITYTEXTURE");
                        }
                        needUv = true;
                    }
                    if (material.specularColor) {
                        defines.push("#define REFLECTIVITYCOLOR");
                    }
                }
                else if (material.getClassName() === "OpenPBRMaterial") {
                    const openpbrMaterial = material;
                    defines.push("#define METALLIC");
                    defines.push("#define ROUGHNESS");
                    if (openpbrMaterial._useRoughnessFromMetallicTextureGreen && openpbrMaterial.baseMetalnessTexture) {
                        defines.push("#define ORMTEXTURE");
                        defines.push(`#define REFLECTIVITY_UV${openpbrMaterial.baseMetalnessTexture.coordinatesIndex + 1}`);
                        needUv = true;
                    }
                    else if (openpbrMaterial.baseMetalnessTexture) {
                        defines.push("#define METALLIC_TEXTURE");
                        defines.push(`#define METALLIC_UV${openpbrMaterial.baseMetalnessTexture.coordinatesIndex + 1}`);
                        needUv = true;
                    }
                    else if (openpbrMaterial.specularRoughnessTexture) {
                        defines.push("#define ROUGHNESS_TEXTURE");
                        defines.push(`#define ROUGHNESS_UV${openpbrMaterial.specularRoughnessTexture.coordinatesIndex + 1}`);
                        needUv = true;
                    }
                    if (openpbrMaterial.baseColorTexture) {
                        defines.push("#define ALBEDOTEXTURE");
                        defines.push(`#define ALBEDO_UV${openpbrMaterial.baseColorTexture.coordinatesIndex + 1}`);
                        if (openpbrMaterial.baseColorTexture.gammaSpace) {
                            defines.push("#define GAMMAALBEDO");
                        }
                        needUv = true;
                    }
                    if (openpbrMaterial.baseColor) {
                        defines.push("#define ALBEDOCOLOR");
                    }
                }
            }
            if (this._enableIrradiance && this.generateIrradianceWithScatterMask) {
                defines.push("#define IRRADIANCE_SCATTER_MASK");
                if (material.getClassName() === "OpenPBRMaterial") {
                    const openpbrMaterial = material;
                    if (openpbrMaterial.subsurfaceWeight > 0) {
                        if (openpbrMaterial.subsurfaceWeightTexture) {
                            defines.push("#define SUBSURFACE_WEIGHT");
                            defines.push(`#define SUBSURFACEWEIGHT_UV${openpbrMaterial.subsurfaceWeightTexture.coordinatesIndex + 1}`);
                            needUv = true;
                        }
                    }
                    if (openpbrMaterial.transmissionWeight > 0) {
                        if (openpbrMaterial.transmissionWeightTexture) {
                            defines.push("#define TRANSMISSION_WEIGHT");
                            defines.push(`#define TRANSMISSIONWEIGHT_UV${openpbrMaterial.transmissionWeightTexture.coordinatesIndex + 1}`);
                            needUv = true;
                        }
                    }
                }
            }
            if (needUv) {
                defines.push("#define NEED_UV");
                if (mesh.isVerticesDataPresent(VertexBuffer.UVKind)) {
                    attribs.push(VertexBuffer.UVKind);
                    defines.push("#define UV1");
                    uv1 = true;
                }
                if (mesh.isVerticesDataPresent(VertexBuffer.UV2Kind)) {
                    attribs.push(VertexBuffer.UV2Kind);
                    defines.push("#define UV2");
                    uv2 = true;
                }
            }
        }
        // Buffers
        if (this._enableDepth) {
            defines.push("#define DEPTH");
            defines.push("#define DEPTH_INDEX " + this._depthIndex);
        }
        if (this._enableNormal) {
            defines.push("#define NORMAL");
            defines.push("#define NORMAL_INDEX " + this._normalIndex);
        }
        if (this._enablePosition) {
            defines.push("#define POSITION");
            defines.push("#define POSITION_INDEX " + this._positionIndex);
        }
        if (this._enableVelocity) {
            defines.push("#define VELOCITY");
            defines.push("#define VELOCITY_INDEX " + this._velocityIndex);
            if (this.excludedSkinnedMeshesFromVelocity.indexOf(mesh) === -1) {
                defines.push("#define BONES_VELOCITY_ENABLED");
            }
        }
        if (this._enableVelocityLinear) {
            defines.push("#define VELOCITY_LINEAR");
            defines.push("#define VELOCITY_LINEAR_INDEX " + this._velocityLinearIndex);
            if (this.excludedSkinnedMeshesFromVelocity.indexOf(mesh) === -1) {
                defines.push("#define BONES_VELOCITY_ENABLED");
            }
        }
        if (this._enableReflectivity) {
            defines.push("#define REFLECTIVITY");
            defines.push("#define REFLECTIVITY_INDEX " + this._reflectivityIndex);
        }
        if (this._enableScreenspaceDepth) {
            if (this._screenspaceDepthIndex !== -1) {
                defines.push("#define SCREENSPACE_DEPTH_INDEX " + this._screenspaceDepthIndex);
                defines.push("#define SCREENSPACE_DEPTH");
            }
        }
        if (this._enableIrradiance) {
            if (this._irradianceIndex !== -1) {
                defines.push("#define IRRADIANCE_INDEX " + this._irradianceIndex);
                defines.push("#define IRRADIANCE");
                // Check if scene has IBL setup
                const scene = this._scene;
                if (scene.environmentTexture) {
                    const iblDefines = {};
                    let realtime = false;
                    let realtimeQuality = 0;
                    if (material.getClassName() === "OpenPBRMaterial" ||
                        material.getClassName() === "StandardMaterial" ||
                        material.getClassName() === "PBRMetallicRoughnessMaterial" ||
                        material.getClassName() === "PBRSpecularGlossinessMaterial" ||
                        material.getClassName() === "PBRMaterial") {
                        realtime = material.realtimeFiltering ? true : false;
                        realtimeQuality = material.realtimeFilteringQuality || 0;
                    }
                    PrepareDefinesForIBL(scene, scene.environmentTexture, iblDefines, realtime, realtimeQuality, true);
                    for (const define in iblDefines) {
                        if (iblDefines[define]) {
                            defines.push("#define " + define);
                        }
                    }
                    if (!iblDefines.USEIRRADIANCEMAP) {
                        defines.push("#define SPHERICAL_HARMONICS");
                    }
                    const iblShadowsPipeline = scene.postProcessRenderPipelineManager.supportedPipelines.find((p) => p.getClassName() === "IBLShadowsRenderPipeline");
                    if (iblShadowsPipeline) {
                        const pipeline = iblShadowsPipeline;
                        const shadowTexture = pipeline._getAccumulatedTexture();
                        if (shadowTexture) {
                            defines.push("#define IBL_SHADOW_TEXTURE");
                            if (pipeline.coloredShadows) {
                                defines.push("#define COLORED_IBL_SHADOWS");
                            }
                        }
                    }
                }
            }
        }
        if (this.generateNormalsInWorldSpace) {
            defines.push("#define NORMAL_WORLDSPACE");
        }
        if (this._normalsAreUnsigned) {
            defines.push("#define ENCODE_NORMAL");
        }
        // Bones
        if (mesh.useBones && mesh.computeBonesUsingShaders && mesh.skeleton) {
            attribs.push(VertexBuffer.MatricesIndicesKind);
            attribs.push(VertexBuffer.MatricesWeightsKind);
            if (mesh.numBoneInfluencers > 4) {
                attribs.push(VertexBuffer.MatricesIndicesExtraKind);
                attribs.push(VertexBuffer.MatricesWeightsExtraKind);
            }
            defines.push("#define NUM_BONE_INFLUENCERS " + mesh.numBoneInfluencers);
            defines.push("#define BONETEXTURE " + mesh.skeleton.isUsingTextureForMatrices);
            defines.push("#define BonesPerMesh " + (mesh.skeleton.bones.length + 1));
        }
        else {
            defines.push("#define NUM_BONE_INFLUENCERS 0");
            defines.push("#define BONETEXTURE false");
            defines.push("#define BonesPerMesh 0");
        }
        // Morph targets
        const numMorphInfluencers = mesh.morphTargetManager
            ? PrepareDefinesAndAttributesForMorphTargets(mesh.morphTargetManager, defines, attribs, mesh, true, // usePositionMorph
            true, // useNormalMorph
            false, // useTangentMorph
            uv1, // useUVMorph
            uv2, // useUV2Morph
            color // useColorMorph
            )
            : 0;
        // Instances
        if (useInstances) {
            defines.push("#define INSTANCES");
            PushAttributesForInstances(attribs, this._enableVelocity || this._enableVelocityLinear);
            if (subMesh.getRenderingMesh().hasThinInstances) {
                defines.push("#define THIN_INSTANCES");
            }
        }
        // Setup textures count
        if (this._linkedWithPrePass) {
            defines.push("#define SCENE_MRT_COUNT " + this._attachmentsFromPrePass.length);
        }
        else {
            defines.push("#define SCENE_MRT_COUNT " + this._multiRenderTarget.textures.length);
        }
        PrepareStringDefinesForClipPlanes(material, this._scene, defines);
        // Get correct effect
        const engine = this._scene.getEngine();
        const drawWrapper = subMesh._getDrawWrapper(undefined, true);
        const cachedDefines = drawWrapper.defines;
        const join = defines.join("\n");
        if (cachedDefines !== join) {
            drawWrapper.setEffect(engine.createEffect("geometry", {
                attributes: attribs,
                uniformsNames: Uniforms,
                samplers: Samplers,
                defines: join,
                onCompiled: null,
                fallbacks: null,
                onError: null,
                uniformBuffersNames: ["Scene"],
                indexParameters: { buffersCount: this._multiRenderTarget.textures.length - 1, maxSimultaneousMorphTargets: numMorphInfluencers },
                shaderLanguage: this.shaderLanguage,
            }, engine), join);
        }
        return drawWrapper.effect.isReady();
    }
    /**
     * Gets the current underlying G Buffer.
     * @returns the buffer
     */
    getGBuffer() {
        return this._multiRenderTarget;
    }
    /**
     * Gets the number of samples used to render the buffer (anti aliasing).
     */
    get samples() {
        return this._multiRenderTarget.samples;
    }
    /**
     * Sets the number of samples used to render the buffer (anti aliasing).
     */
    set samples(value) {
        this._multiRenderTarget.samples = value;
    }
    /**
     * Disposes the renderer and frees up associated resources.
     */
    dispose() {
        if (this._resizeObserver) {
            const engine = this._scene.getEngine();
            engine.onResizeObservable.remove(this._resizeObserver);
            this._resizeObserver = null;
        }
        if (this._multiRenderTarget?.renderTarget && this.scene.getEngine()._currentRenderTarget === this._multiRenderTarget.renderTarget) {
            this.scene.getEngine().unBindFramebuffer(this._multiRenderTarget?.renderTarget);
        }
        this.getGBuffer().dispose();
    }
    _assignRenderTargetIndices() {
        const textureNames = [];
        const textureTypesAndFormats = [];
        let count = 0;
        if (this._enableDepth) {
            this._depthIndex = count;
            count++;
            textureNames.push("gBuffer_Depth");
            textureTypesAndFormats.push(this._textureTypesAndFormats[GeometryBufferRenderer.DEPTH_TEXTURE_TYPE]);
        }
        if (this._enableNormal) {
            this._normalIndex = count;
            count++;
            textureNames.push("gBuffer_Normal");
            textureTypesAndFormats.push(this._textureTypesAndFormats[GeometryBufferRenderer.NORMAL_TEXTURE_TYPE]);
        }
        if (this._enablePosition) {
            this._positionIndex = count;
            count++;
            textureNames.push("gBuffer_Position");
            textureTypesAndFormats.push(this._textureTypesAndFormats[GeometryBufferRenderer.POSITION_TEXTURE_TYPE]);
        }
        if (this._enableVelocity) {
            this._velocityIndex = count;
            count++;
            textureNames.push("gBuffer_Velocity");
            textureTypesAndFormats.push(this._textureTypesAndFormats[GeometryBufferRenderer.VELOCITY_TEXTURE_TYPE]);
        }
        if (this._enableVelocityLinear) {
            this._velocityLinearIndex = count;
            count++;
            textureNames.push("gBuffer_VelocityLinear");
            textureTypesAndFormats.push(this._textureTypesAndFormats[GeometryBufferRenderer.VELOCITY_LINEAR_TEXTURE_TYPE]);
        }
        if (this._enableReflectivity) {
            this._reflectivityIndex = count;
            count++;
            textureNames.push("gBuffer_Reflectivity");
            textureTypesAndFormats.push(this._textureTypesAndFormats[GeometryBufferRenderer.REFLECTIVITY_TEXTURE_TYPE]);
        }
        if (this._enableScreenspaceDepth) {
            this._screenspaceDepthIndex = count;
            count++;
            textureNames.push("gBuffer_ScreenspaceDepth");
            textureTypesAndFormats.push(this._textureTypesAndFormats[GeometryBufferRenderer.SCREENSPACE_DEPTH_TEXTURE_TYPE]);
        }
        if (this._enableIrradiance) {
            this._irradianceIndex = count;
            count++;
            textureNames.push("gBuffer_Irradiance");
            textureTypesAndFormats.push(this._textureTypesAndFormats[GeometryBufferRenderer.IRRADIANCE_TEXTURE_TYPE]);
        }
        return [count, textureNames, textureTypesAndFormats];
    }
    _createRenderTargets() {
        const engine = this._scene.getEngine();
        const [count, textureNames, textureTypesAndFormat] = this._assignRenderTargetIndices();
        let type = 0;
        if (engine._caps.textureFloat && engine._caps.textureFloatLinearFiltering) {
            type = 1;
        }
        else if (engine._caps.textureHalfFloat && engine._caps.textureHalfFloatLinearFiltering) {
            type = 2;
        }
        const dimensions = this._ratioOrDimensions.width !== undefined
            ? this._ratioOrDimensions
            : { width: engine.getRenderWidth() * this._ratioOrDimensions, height: engine.getRenderHeight() * this._ratioOrDimensions };
        const textureTypes = [];
        const textureFormats = [];
        const samplingModes = [];
        for (const typeAndFormat of textureTypesAndFormat) {
            if (typeAndFormat) {
                textureTypes.push(typeAndFormat.textureType);
                textureFormats.push(typeAndFormat.textureFormat);
                samplingModes.push(typeAndFormat.samplingMode ?? 2);
            }
            else {
                textureTypes.push(type);
                textureFormats.push(5);
                samplingModes.push(2);
            }
        }
        this._normalsAreUnsigned =
            textureTypes[GeometryBufferRenderer.NORMAL_TEXTURE_TYPE] === 11 ||
                textureTypes[GeometryBufferRenderer.NORMAL_TEXTURE_TYPE] === 13;
        this._multiRenderTarget = new MultiRenderTarget("gBuffer", dimensions, count, this._scene, { generateMipMaps: false, generateDepthTexture: true, types: textureTypes, formats: textureFormats, samplingModes, depthTextureFormat: this._depthFormat }, textureNames.concat("gBuffer_DepthBuffer"));
        if (!this.isSupported) {
            return;
        }
        this._multiRenderTarget.wrapU = Texture.CLAMP_ADDRESSMODE;
        this._multiRenderTarget.wrapV = Texture.CLAMP_ADDRESSMODE;
        this._multiRenderTarget.refreshRate = 1;
        this._multiRenderTarget.renderParticles = false;
        this._multiRenderTarget.renderList = null;
        // Depth is always the first texture in the geometry buffer renderer!
        const layoutAttachmentsAll = [true];
        const layoutAttachmentsAllButDepth = [false];
        const layoutAttachmentsDepthOnly = [true];
        for (let i = 1; i < count; ++i) {
            layoutAttachmentsAll.push(true);
            layoutAttachmentsDepthOnly.push(false);
            layoutAttachmentsAllButDepth.push(true);
        }
        const attachmentsAll = engine.buildTextureLayout(layoutAttachmentsAll);
        const attachmentsAllButDepth = engine.buildTextureLayout(layoutAttachmentsAllButDepth);
        const attachmentsDepthOnly = engine.buildTextureLayout(layoutAttachmentsDepthOnly);
        this._multiRenderTarget.onClearObservable.add((engine) => {
            engine.bindAttachments(this.useSpecificClearForDepthTexture ? attachmentsAllButDepth : attachmentsAll);
            engine.clear(this._clearColor, true, true, true);
            if (this.useSpecificClearForDepthTexture) {
                engine.bindAttachments(attachmentsDepthOnly);
                engine.clear(this._clearDepthColor, true, true, true);
            }
            engine.bindAttachments(attachmentsAll);
        });
        this._resizeObserver = engine.onResizeObservable.add(() => {
            if (this._multiRenderTarget) {
                const dimensions = this._ratioOrDimensions.width !== undefined
                    ? this._ratioOrDimensions
                    : { width: engine.getRenderWidth() * this._ratioOrDimensions, height: engine.getRenderHeight() * this._ratioOrDimensions };
                this._multiRenderTarget.resize(dimensions);
            }
        });
        // Custom render function
        const renderSubMesh = (subMesh) => {
            const renderingMesh = subMesh.getRenderingMesh();
            const effectiveMesh = subMesh.getEffectiveMesh();
            const scene = this._scene;
            const engine = scene.getEngine();
            const material = subMesh.getMaterial();
            if (!material) {
                return;
            }
            effectiveMesh._internalAbstractMeshDataInfo._isActiveIntermediate = false;
            // Velocity
            if ((this._enableVelocity || this._enableVelocityLinear) && !this._previousTransformationMatrices[effectiveMesh.uniqueId]) {
                this._previousTransformationMatrices[effectiveMesh.uniqueId] = {
                    world: Matrix.Identity(),
                    viewProjection: scene.getTransformMatrix(),
                };
                if (renderingMesh.skeleton) {
                    const bonesTransformations = renderingMesh.skeleton.getTransformMatrices(renderingMesh);
                    this._previousBonesTransformationMatrices[renderingMesh.uniqueId] = this._copyBonesTransformationMatrices(bonesTransformations, new Float32Array(bonesTransformations.length));
                }
            }
            // Managing instances
            const batch = renderingMesh._getInstancesRenderList(subMesh._id, !!subMesh.getReplacementMesh());
            if (batch.mustReturn) {
                return;
            }
            const hardwareInstancedRendering = engine.getCaps().instancedArrays && (batch.visibleInstances[subMesh._id] !== null || renderingMesh.hasThinInstances);
            const world = effectiveMesh.getWorldMatrix();
            if (this.isReady(subMesh, hardwareInstancedRendering)) {
                const drawWrapper = subMesh._getDrawWrapper();
                if (!drawWrapper) {
                    return;
                }
                const effect = drawWrapper.effect;
                engine.enableEffect(drawWrapper);
                if (!hardwareInstancedRendering) {
                    renderingMesh._bind(subMesh, effect, material.fillMode);
                }
                if (!this._useUbo) {
                    effect.setMatrix("viewProjection", scene.getTransformMatrix());
                    effect.setMatrix("view", scene.getViewMatrix());
                    this._scene.bindEyePosition(effect, "vEyePosition");
                }
                else {
                    BindSceneUniformBuffer(effect, this._scene.getSceneUniformBuffer());
                    this._scene.finalizeSceneUbo();
                }
                let sideOrientation;
                const instanceDataStorage = renderingMesh._instanceDataStorage;
                if (!instanceDataStorage.isFrozen && (material.backFaceCulling || material.sideOrientation !== null)) {
                    const mainDeterminant = effectiveMesh._getWorldMatrixDeterminant();
                    sideOrientation = material._getEffectiveOrientation(renderingMesh);
                    if (mainDeterminant < 0) {
                        sideOrientation = sideOrientation === Material.ClockWiseSideOrientation ? Material.CounterClockWiseSideOrientation : Material.ClockWiseSideOrientation;
                    }
                }
                else {
                    sideOrientation = renderingMesh._effectiveSideOrientation;
                }
                material._preBind(drawWrapper, sideOrientation);
                // Alpha test
                if (material.needAlphaTestingForMesh(effectiveMesh)) {
                    const alphaTexture = material.getAlphaTestTexture();
                    if (alphaTexture) {
                        effect.setTexture("diffuseSampler", alphaTexture);
                        effect.setMatrix("diffuseMatrix", alphaTexture.getTextureMatrix());
                    }
                }
                // Bump
                if ((material.bumpTexture || material.normalTexture || material.geometryNormalTexture) &&
                    scene.getEngine().getCaps().standardDerivatives &&
                    MaterialFlags.BumpTextureEnabled) {
                    const texture = material.bumpTexture || material.normalTexture || material.geometryNormalTexture;
                    effect.setFloat3("vBumpInfos", texture.coordinatesIndex, 1.0 / texture.level, material.parallaxScaleBias);
                    effect.setMatrix("bumpMatrix", texture.getTextureMatrix());
                    effect.setTexture("bumpSampler", texture);
                    effect.setFloat2("vTangentSpaceParams", material.invertNormalMapX ? -1.0 : 1.0, material.invertNormalMapY ? -1.0 : 1.0);
                }
                // Reflectivity
                if (this._enableReflectivity) {
                    // for PBR materials: cf. https://doc.babylonjs.com/features/featuresDeepDive/materials/using/masterPBR
                    if (material.getClassName() === "PBRMetallicRoughnessMaterial") {
                        // if it is a PBR material in MetallicRoughness Mode:
                        if (material.metallicRoughnessTexture !== null) {
                            effect.setTexture("reflectivitySampler", material.metallicRoughnessTexture);
                            effect.setMatrix("reflectivityMatrix", material.metallicRoughnessTexture.getTextureMatrix());
                        }
                        if (material.metallic !== null) {
                            effect.setFloat("metallic", material.metallic);
                        }
                        if (material.roughness !== null) {
                            effect.setFloat("glossiness", 1.0 - material.roughness);
                        }
                        if (material.baseTexture !== null) {
                            effect.setTexture("albedoSampler", material.baseTexture);
                            effect.setMatrix("albedoMatrix", material.baseTexture.getTextureMatrix());
                        }
                        if (material.baseColor !== null) {
                            effect.setColor3("albedoColor", material.baseColor);
                        }
                    }
                    else if (material.getClassName() === "PBRSpecularGlossinessMaterial") {
                        // if it is a PBR material in Specular/Glossiness Mode:
                        if (material.specularGlossinessTexture !== null) {
                            effect.setTexture("reflectivitySampler", material.specularGlossinessTexture);
                            effect.setMatrix("reflectivityMatrix", material.specularGlossinessTexture.getTextureMatrix());
                        }
                        else {
                            if (material.specularColor !== null) {
                                effect.setColor3("reflectivityColor", material.specularColor);
                            }
                        }
                        if (material.glossiness !== null) {
                            effect.setFloat("glossiness", material.glossiness);
                        }
                    }
                    else if (material.getClassName() === "PBRMaterial") {
                        // if it is the bigger PBRMaterial
                        if (material.metallicTexture !== null) {
                            effect.setTexture("reflectivitySampler", material.metallicTexture);
                            effect.setMatrix("reflectivityMatrix", material.metallicTexture.getTextureMatrix());
                        }
                        if (material.metallic !== null) {
                            effect.setFloat("metallic", material.metallic);
                        }
                        if (material.roughness !== null) {
                            effect.setFloat("glossiness", 1.0 - material.roughness);
                        }
                        if (material.roughness !== null || material.metallic !== null || material.metallicTexture !== null) {
                            // MetallicRoughness Model
                            if (material.albedoTexture !== null) {
                                effect.setTexture("albedoSampler", material.albedoTexture);
                                effect.setMatrix("albedoMatrix", material.albedoTexture.getTextureMatrix());
                            }
                            if (material.albedoColor !== null) {
                                effect.setColor3("albedoColor", material.albedoColor);
                            }
                        }
                        else {
                            // SpecularGlossiness Model
                            if (material.reflectivityTexture !== null) {
                                effect.setTexture("reflectivitySampler", material.reflectivityTexture);
                                effect.setMatrix("reflectivityMatrix", material.reflectivityTexture.getTextureMatrix());
                            }
                            else if (material.reflectivityColor !== null) {
                                effect.setColor3("reflectivityColor", material.reflectivityColor);
                            }
                            if (material.microSurface !== null) {
                                effect.setFloat("glossiness", material.microSurface);
                            }
                        }
                    }
                    else if (material.getClassName() === "StandardMaterial") {
                        // if StandardMaterial:
                        if (material.specularTexture !== null) {
                            effect.setTexture("reflectivitySampler", material.specularTexture);
                            effect.setMatrix("reflectivityMatrix", material.specularTexture.getTextureMatrix());
                        }
                        if (material.specularColor !== null) {
                            effect.setColor3("reflectivityColor", material.specularColor);
                        }
                    }
                    else if (material.getClassName() === "OpenPBRMaterial") {
                        // if it is a OpenPBR material:
                        const openpbrMaterial = material;
                        if (openpbrMaterial._useRoughnessFromMetallicTextureGreen && openpbrMaterial.baseMetalnessTexture) {
                            effect.setTexture("reflectivitySampler", openpbrMaterial.baseMetalnessTexture);
                            effect.setMatrix("reflectivityMatrix", openpbrMaterial.baseMetalnessTexture.getTextureMatrix());
                        }
                        else if (openpbrMaterial.baseMetalnessTexture) {
                            effect.setTexture("metallicSampler", openpbrMaterial.baseMetalnessTexture);
                            effect.setMatrix("metallicMatrix", openpbrMaterial.baseMetalnessTexture.getTextureMatrix());
                        }
                        else if (openpbrMaterial.specularRoughnessTexture) {
                            effect.setTexture("roughnessSampler", openpbrMaterial.specularRoughnessTexture);
                            effect.setMatrix("roughnessMatrix", openpbrMaterial.specularRoughnessTexture.getTextureMatrix());
                        }
                        effect.setFloat("metallic", openpbrMaterial.baseMetalness);
                        effect.setFloat("glossiness", 1.0 - openpbrMaterial.specularRoughness);
                        if (openpbrMaterial.baseColorTexture !== null) {
                            effect.setTexture("albedoSampler", openpbrMaterial.baseColorTexture);
                            effect.setMatrix("albedoMatrix", openpbrMaterial.baseColorTexture.getTextureMatrix());
                        }
                        if (openpbrMaterial.baseColor !== null) {
                            effect.setColor3("albedoColor", openpbrMaterial.baseColor);
                        }
                    }
                }
                // IBL binding for irradiance
                if (this._enableIrradiance && scene.environmentTexture) {
                    const reflectionTexture = scene.environmentTexture;
                    const iblShadowsPipeline = scene.postProcessRenderPipelineManager.supportedPipelines.find((p) => p.getClassName() === "IBLShadowsRenderPipeline");
                    if (iblShadowsPipeline) {
                        const pipeline = iblShadowsPipeline;
                        const shadowTexture = pipeline._getAccumulatedTexture();
                        if (shadowTexture) {
                            effect.setTexture("iblShadowSampler", shadowTexture);
                            effect.setFloat2("shadowTextureSize", shadowTexture.getSize().width, shadowTexture.getSize().height);
                        }
                    }
                    // Bind reflection matrix
                    effect.setMatrix("reflectionMatrix", reflectionTexture.getReflectionTextureMatrix());
                    // Bind reflection info (intensity and other parameters)
                    effect.setFloat2("vReflectionInfos", reflectionTexture.level * scene.iblIntensity, 0.0);
                    // Bind reflection sampler
                    effect.setTexture("reflectionSampler", reflectionTexture);
                    // Bind irradiance sampler if available
                    if (reflectionTexture.irradianceTexture) {
                        effect.setTexture("irradianceSampler", reflectionTexture.irradianceTexture);
                        if (reflectionTexture.irradianceTexture._dominantDirection) {
                            effect.setVector3("vReflectionDominantDirection", reflectionTexture.irradianceTexture._dominantDirection);
                        }
                    }
                    // Bind spherical harmonics uniforms if available
                    if (reflectionTexture.sphericalPolynomial) {
                        const polynomials = reflectionTexture.sphericalPolynomial;
                        if (polynomials.preScaledHarmonics) {
                            const harmonics = polynomials.preScaledHarmonics;
                            effect.setVector3("vSphericalL00", harmonics.l00);
                            effect.setVector3("vSphericalL1_1", harmonics.l1_1);
                            effect.setVector3("vSphericalL10", harmonics.l10);
                            effect.setVector3("vSphericalL11", harmonics.l11);
                            effect.setVector3("vSphericalL2_2", harmonics.l2_2);
                            effect.setVector3("vSphericalL2_1", harmonics.l2_1);
                            effect.setVector3("vSphericalL20", harmonics.l20);
                            effect.setVector3("vSphericalL21", harmonics.l21);
                            effect.setVector3("vSphericalL22", harmonics.l22);
                        }
                        else {
                            effect.setFloat3("vSphericalX", polynomials.x.x, polynomials.x.y, polynomials.x.z);
                            effect.setFloat3("vSphericalY", polynomials.y.x, polynomials.y.y, polynomials.y.z);
                            effect.setFloat3("vSphericalZ", polynomials.z.x, polynomials.z.y, polynomials.z.z);
                            effect.setFloat3("vSphericalXX_ZZ", polynomials.xx.x - polynomials.zz.x, polynomials.xx.y - polynomials.zz.y, polynomials.xx.z - polynomials.zz.z);
                            effect.setFloat3("vSphericalYY_ZZ", polynomials.yy.x - polynomials.zz.x, polynomials.yy.y - polynomials.zz.y, polynomials.yy.z - polynomials.zz.z);
                            effect.setFloat3("vSphericalZZ", polynomials.zz.x, polynomials.zz.y, polynomials.zz.z);
                            effect.setFloat3("vSphericalXY", polynomials.xy.x, polynomials.xy.y, polynomials.xy.z);
                            effect.setFloat3("vSphericalYZ", polynomials.yz.x, polynomials.yz.y, polynomials.yz.z);
                            effect.setFloat3("vSphericalZX", polynomials.zx.x, polynomials.zx.y, polynomials.zx.z);
                        }
                    }
                    if (this.generateIrradianceWithScatterMask && material.getClassName() === "OpenPBRMaterial") {
                        const openpbrMaterial = material;
                        effect.setFloat("vSubsurfaceWeight", openpbrMaterial.subsurfaceWeight);
                        if (openpbrMaterial.subsurfaceWeightTexture) {
                            effect.setTexture("subsurfaceWeightSampler", openpbrMaterial.subsurfaceWeightTexture);
                            effect.setMatrix("subsurfaceWeightMatrix", openpbrMaterial.subsurfaceWeightTexture.getTextureMatrix());
                        }
                        effect.setFloat("vTransmissionWeight", openpbrMaterial.transmissionWeight);
                        if (openpbrMaterial.transmissionWeightTexture) {
                            effect.setTexture("transmissionWeightSampler", openpbrMaterial.transmissionWeightTexture);
                            effect.setMatrix("transmissionWeightMatrix", openpbrMaterial.transmissionWeightTexture.getTextureMatrix());
                        }
                        effect.setFloat("vTransmissionScatterAnisotropy", openpbrMaterial.transmissionScatterAnisotropy);
                        effect.setFloat("vSubsurfaceScatterAnisotropy", openpbrMaterial.subsurfaceScatterAnisotropy);
                    }
                }
                // Clip plane
                BindClipPlane(effect, material, this._scene);
                // Bones
                if (renderingMesh.useBones && renderingMesh.computeBonesUsingShaders && renderingMesh.skeleton) {
                    const skeleton = renderingMesh.skeleton;
                    if (skeleton.isUsingTextureForMatrices && effect.getUniformIndex("boneTextureInfo") > -1) {
                        const boneTexture = skeleton.getTransformMatrixTexture(renderingMesh);
                        effect.setTexture("boneSampler", boneTexture);
                        effect.setFloat2("boneTextureInfo", skeleton._textureWidth, skeleton._textureHeight);
                    }
                    else {
                        effect.setMatrices("mBones", renderingMesh.skeleton.getTransformMatrices(renderingMesh));
                    }
                    if (this._enableVelocity || this._enableVelocityLinear) {
                        effect.setMatrices("mPreviousBones", this._previousBonesTransformationMatrices[renderingMesh.uniqueId]);
                    }
                }
                // Morph targets
                BindMorphTargetParameters(renderingMesh, effect);
                if (renderingMesh.morphTargetManager && renderingMesh.morphTargetManager.isUsingTextureForTargets) {
                    renderingMesh.morphTargetManager._bind(effect);
                }
                // Velocity
                if (this._enableVelocity || this._enableVelocityLinear) {
                    effect.setMatrix("previousWorld", this._previousTransformationMatrices[effectiveMesh.uniqueId].world);
                    effect.setMatrix("previousViewProjection", this._previousTransformationMatrices[effectiveMesh.uniqueId].viewProjection);
                }
                if (hardwareInstancedRendering && renderingMesh.hasThinInstances) {
                    effect.setMatrix("world", world);
                }
                // Draw
                renderingMesh._processRendering(effectiveMesh, subMesh, effect, material.fillMode, batch, hardwareInstancedRendering, (isInstance, w) => {
                    if (!isInstance) {
                        effect.setMatrix("world", w);
                    }
                });
            }
            // Velocity
            if (this._enableVelocity || this._enableVelocityLinear) {
                this._previousTransformationMatrices[effectiveMesh.uniqueId].world = world.clone();
                this._previousTransformationMatrices[effectiveMesh.uniqueId].viewProjection = this._scene.getTransformMatrix().clone();
                if (renderingMesh.skeleton) {
                    this._copyBonesTransformationMatrices(renderingMesh.skeleton.getTransformMatrices(renderingMesh), this._previousBonesTransformationMatrices[effectiveMesh.uniqueId]);
                }
            }
        };
        this._multiRenderTarget.customIsReadyFunction = (mesh, refreshRate, preWarm) => {
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
                    if (!this.isReady(subMesh, hardwareInstancedRendering)) {
                        return false;
                    }
                }
            }
            return true;
        };
        this._multiRenderTarget.customRenderFunction = (opaqueSubMeshes, alphaTestSubMeshes, transparentSubMeshes, depthOnlySubMeshes) => {
            let index;
            if (this._linkedWithPrePass) {
                if (!this._prePassRenderer.enabled) {
                    return;
                }
                this._scene.getEngine().bindAttachments(this._attachmentsFromPrePass);
            }
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
            engine.setDepthWrite(false);
            for (index = 0; index < alphaTestSubMeshes.length; index++) {
                renderSubMesh(alphaTestSubMeshes.data[index]);
            }
            if (this.renderTransparentMeshes) {
                for (index = 0; index < transparentSubMeshes.length; index++) {
                    renderSubMesh(transparentSubMeshes.data[index]);
                }
            }
            engine.setDepthWrite(true);
        };
    }
    // Copies the bones transformation matrices into the target array and returns the target's reference
    _copyBonesTransformationMatrices(source, target) {
        for (let i = 0; i < source.length; i++) {
            target[i] = source[i];
        }
        return target;
    }
}
/**
 * Force all the standard materials to compile to glsl even on WebGPU engines.
 * False by default. This is mostly meant for backward compatibility.
 */
GeometryBufferRenderer.ForceGLSL = false;
/**
 * Constant used to retrieve the depth texture index in the G-Buffer textures array
 * using getIndex(GeometryBufferRenderer.DEPTH_TEXTURE_INDEX)
 */
GeometryBufferRenderer.DEPTH_TEXTURE_TYPE = 0;
/**
 * Constant used to retrieve the normal texture index in the G-Buffer textures array
 * using getIndex(GeometryBufferRenderer.NORMAL_TEXTURE_INDEX)
 */
GeometryBufferRenderer.NORMAL_TEXTURE_TYPE = 1;
/**
 * Constant used to retrieve the position texture index in the G-Buffer textures array
 * using getIndex(GeometryBufferRenderer.POSITION_TEXTURE_INDEX)
 */
GeometryBufferRenderer.POSITION_TEXTURE_TYPE = 2;
/**
 * Constant used to retrieve the velocity texture index in the G-Buffer textures array
 * using getIndex(GeometryBufferRenderer.VELOCITY_TEXTURE_INDEX)
 */
GeometryBufferRenderer.VELOCITY_TEXTURE_TYPE = 3;
/**
 * Constant used to retrieve the reflectivity texture index in the G-Buffer textures array
 * using the getIndex(GeometryBufferRenderer.REFLECTIVITY_TEXTURE_TYPE)
 */
GeometryBufferRenderer.REFLECTIVITY_TEXTURE_TYPE = 4;
/**
 * Constant used to retrieve the screen-space depth texture index in the G-Buffer textures array
 * using getIndex(GeometryBufferRenderer.SCREENSPACE_DEPTH_TEXTURE_TYPE)
 */
GeometryBufferRenderer.SCREENSPACE_DEPTH_TEXTURE_TYPE = 5;
/**
 * Constant used to retrieve the linear velocity texture index in the G-Buffer textures array
 * using getIndex(GeometryBufferRenderer.VELOCITY_LINEAR_TEXTURE_TYPE)
 */
GeometryBufferRenderer.VELOCITY_LINEAR_TEXTURE_TYPE = 6;
/**
 * Constant used to retrieve the irradiance texture index in the G-Buffer textures array
 * using getIndex(GeometryBufferRenderer.IRRADIANCE_TEXTURE_TYPE)
 */
GeometryBufferRenderer.IRRADIANCE_TEXTURE_TYPE = 7;
/**
 * @internal
 */
GeometryBufferRenderer._SceneComponentInitialization = (_) => {
    throw _WarnImport("GeometryBufferRendererSceneComponent");
};
let _Registered = false;
/**
 * Register side effects for geometryBufferRenderer.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterGeometryBufferRenderer() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    PrepareUniformsAndSamplersForIBL(Uniforms, Samplers, true);
    AddClipPlaneUniforms(Uniforms);
}
//# sourceMappingURL=geometryBufferRenderer.pure.js.map