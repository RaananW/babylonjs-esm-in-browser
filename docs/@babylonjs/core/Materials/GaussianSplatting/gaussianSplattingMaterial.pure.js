/** This file must only contain pure code and pure imports */
import { SerializationHelper } from "../../Misc/decorators.serialization.js";
import { Logger } from "../../Misc/logger.js";
import { VertexBuffer } from "../../Buffers/buffer.pure.js";
import { MaterialDefines } from "../../Materials/materialDefines.js";
import { PushMaterial } from "../../Materials/pushMaterial.js";
import { AddClipPlaneUniforms, BindClipPlane } from "../clipPlaneMaterialHelper.js";
import { Camera } from "../../Cameras/camera.pure.js";
import { ShadowDepthWrapper } from "../../Materials/shadowDepthWrapper.js";
import { ShaderMaterial } from "../../Materials/shaderMaterial.pure.js";
import { Material } from "../material.pure.js";
import { BindFogParameters, BindLogDepth, PrepareAttributesForInstances, PrepareDefinesForAttributes, PrepareDefinesForFrameBoundValues, PrepareDefinesForMisc, PrepareUniformsAndSamplersList, } from "../materialHelper.functions.js";
import { Engine } from "../../Engines/engine.pure.js";
import { RegisterClass } from "../../Misc/typeStore.js";
/**
 * Computes the maximum number of Gaussian Splatting compound parts supported by the given engine.
 * The limit is derived from the engine's maximum vertex uniform vectors capability.
 * @param engine - The engine to compute the limit for
 * @returns The maximum number of parts supported
 */
export function GetGaussianSplattingMaxPartCount(engine) {
    // Each GS compound part requires 5 uniform vectors: 4 for the mat4 world matrix + 1 for the visibility float.
    // The maximum number of parts is limited by the engine's uniform vector capacity and by the uint8 partIndices texture format (max 256).
    const uniformsPerSplat = 5;
    const reservedUniforms = 40; // base shader uniforms + margin for plugins/clip planes
    const absoluteMax = 256; // uint8 partIndices texture format limit
    const maxUniformVectors = engine.getCaps().maxVertexUniformVectors;
    const available = Math.max(maxUniformVectors - reservedUniforms, 0);
    const maxFromUniforms = Math.floor(available / uniformsPerSplat);
    return Math.min(Math.max(maxFromUniforms, 1), absoluteMax);
}
/**
 * @deprecated Use {@link GetGaussianSplattingMaxPartCount} with an engine instance instead.
 */
export const GaussianSplattingMaxPartCount = 128;
/**
 * @internal
 */
class GaussianSplattingMaterialDefines extends MaterialDefines {
    /**
     * Constructor of the defines.
     * @param externalProperties External properties (e.g. from material plugins) to add to the defines.
     */
    constructor(externalProperties) {
        super(externalProperties);
        /** Defines whether fog is enabled */
        this.FOG = false;
        /** Defines whether thin instances are used */
        this.THIN_INSTANCES = true;
        /** Defines whether logarithmic depth is enabled */
        this.LOGARITHMICDEPTH = false;
        /** Defines whether clip plane 1 is enabled */
        this.CLIPPLANE = false;
        /** Defines whether clip plane 2 is enabled */
        this.CLIPPLANE2 = false;
        /** Defines whether clip plane 3 is enabled */
        this.CLIPPLANE3 = false;
        /** Defines whether clip plane 4 is enabled */
        this.CLIPPLANE4 = false;
        /** Defines whether clip plane 5 is enabled */
        this.CLIPPLANE5 = false;
        /** Defines whether clip plane 6 is enabled */
        this.CLIPPLANE6 = false;
        /** Defines the spherical harmonics degree */
        this.SH_DEGREE = 0;
        /** Defines whether compensation is applied */
        this.COMPENSATION = false;
        /** Defines whether this is a compound splat */
        this.IS_COMPOUND = false;
        /** Defines the maximum number of parts (computed from engine caps at runtime) */
        this.MAX_PART_COUNT = GaussianSplattingMaxPartCount;
        /** Defines whether SOG raw-texture in-shader dequantization is enabled */
        this.USE_SOG = false;
        /** Defines whether SOG v2 (codebook) dequantization is enabled */
        this.USE_SOG_V2 = false;
        this.rebuild();
    }
    /**
     * Checks if a define is part of the generated define list.
     * @param name define name to check
     * @returns true if the define exists
     */
    hasDefine(name) {
        return this._keys.indexOf(name) !== -1;
    }
}
/**
 * GaussianSplattingMaterial material used to render Gaussian Splatting
 * @experimental
 */
export class GaussianSplattingMaterial extends PushMaterial {
    /**
     * Instantiates a Gaussian Splatting Material in the given scene
     * @param name The friendly name of the material
     * @param scene The scene to add the material to
     */
    constructor(name, scene) {
        super(name, scene);
        /**
         * Point spread function (default 0.3). Can be overriden per GS material, otherwise, using default static `KernelSize` value
         */
        this.kernelSize = GaussianSplattingMaterial.KernelSize;
        /**
         * Minimum projected splat size, in pixels, below which a splat is discarded (default 0 = disabled).
         */
        this.minPixelSize = GaussianSplattingMaterial.MinPixelSize;
        this._compensation = GaussianSplattingMaterial.Compensation;
        // set to true when material defines are dirty
        this._isDirty = false;
        this._sourceMesh = null;
        this._voxelMissingTextureWarned = new Set();
        this._voxelPartWorldData = new Float32Array(0);
        this._voxelPartVisibilityData = [];
        this.backFaceCulling = false;
        this.shadowDepthWrapper = GaussianSplattingMaterial._MakeGaussianSplattingShadowDepthWrapper(scene, this.shaderLanguage);
    }
    /**
     * Set compensation default value is `GaussianSplattingMaterial.Compensation`
     */
    set compensation(value) {
        this._isDirty = this._isDirty != value;
        this._compensation = value;
    }
    /**
     * Get compensation
     */
    get compensation() {
        return this._compensation;
    }
    /**
     * Gets a boolean indicating that current material needs to register RTT
     */
    get hasRenderTargetTextures() {
        return false;
    }
    /**
     * Specifies whether or not this material should be rendered in alpha test mode.
     * @returns false
     */
    needAlphaTesting() {
        return false;
    }
    /**
     * Specifies whether or not this material should be rendered in alpha blend mode.
     * @returns true
     */
    needAlphaBlending() {
        return true;
    }
    /**
     * Checks whether the material is ready to be rendered for a given mesh.
     * @param mesh The mesh to render
     * @param subMesh The submesh to check against
     * @returns true if all the dependencies are ready (Textures, Effects...)
     */
    isReadyForSubMesh(mesh, subMesh) {
        const useInstances = true;
        const drawWrapper = subMesh._drawWrapper;
        let defines = subMesh.materialDefines;
        if (defines && this._isDirty) {
            defines.markAsUnprocessed();
        }
        if (drawWrapper.effect && this.isFrozen) {
            if (drawWrapper._wasPreviouslyReady && drawWrapper._wasPreviouslyUsingInstances === useInstances) {
                return true;
            }
        }
        if (!subMesh.materialDefines || this.pluginManager) {
            this._callbackPluginEventGeneric(4 /* MaterialPluginEvent.GetDefineNames */, this._eventInfo);
            const defineNames = this._eventInfo.defineNames;
            const needsNewDefines = !subMesh.materialDefines || (defineNames && Object.keys(defineNames).some((name) => !defines.hasDefine(name)));
            if (needsNewDefines) {
                defines = subMesh.materialDefines = new GaussianSplattingMaterialDefines(defineNames);
            }
        }
        const scene = this.getScene();
        if (this._isReadyForSubMesh(subMesh)) {
            return true;
        }
        // Check plugin readiness
        this._eventInfo.isReadyForSubMesh = true;
        this._eventInfo.defines = defines;
        this._eventInfo.subMesh = subMesh;
        this._callbackPluginEventIsReadyForSubMesh(this._eventInfo);
        if (!this._eventInfo.isReadyForSubMesh) {
            return false;
        }
        if (!this._sourceMesh) {
            return false;
        }
        const engine = scene.getEngine();
        const gsMesh = this._sourceMesh;
        // Misc.
        PrepareDefinesForMisc(mesh, scene, this._useLogarithmicDepth, this.pointsCloud, this.fogEnabled, false, defines, undefined, undefined, undefined, this._isVertexOutputInvariant);
        // Values that need to be evaluated on every frame
        PrepareDefinesForFrameBoundValues(scene, engine, this, defines, useInstances, null, true);
        // External config
        this._eventInfo.defines = defines;
        this._eventInfo.mesh = mesh;
        this._callbackPluginEventPrepareDefinesBeforeAttributes(this._eventInfo);
        // Attribs
        PrepareDefinesForAttributes(mesh, defines, false, false);
        // External config
        this._callbackPluginEventPrepareDefines(this._eventInfo);
        // SH is disabled for webGL1
        if (engine.version > 1 || engine.isWebGPU) {
            defines["SH_DEGREE"] = gsMesh.shDegree;
        }
        defines["IS_COMPOUND"] = gsMesh.isCompound;
        defines["MAX_PART_COUNT"] = GetGaussianSplattingMaxPartCount(engine);
        defines["USE_SOG"] = gsMesh.useSog;
        defines["USE_SOG_V2"] = gsMesh.useSog && gsMesh.sogParams?.version === 2;
        // Compensation
        const splatMaterial = gsMesh.material;
        defines["COMPENSATION"] = splatMaterial && splatMaterial.compensation ? splatMaterial.compensation : GaussianSplattingMaterial.Compensation;
        // Get correct effect
        if (defines.isDirty) {
            defines.markAsProcessed();
            scene.resetCachedMaterial();
            //Attributes
            PrepareAttributesForInstances(GaussianSplattingMaterial._Attribs, defines);
            const attribs = GaussianSplattingMaterial._Attribs.slice();
            const uniforms = GaussianSplattingMaterial._Uniforms.slice();
            const samplers = GaussianSplattingMaterial._Samplers.slice();
            const uniformBuffers = GaussianSplattingMaterial._UniformBuffers.slice();
            PrepareUniformsAndSamplersList({
                uniformsNames: uniforms,
                uniformBuffersNames: uniformBuffers,
                samplers: samplers,
                defines: defines,
            });
            AddClipPlaneUniforms(uniforms);
            // Let plugin manager prepare its uniform/sampler/ubo lists
            if (!this._uniformBufferLayoutBuilt) {
                this.buildUniformLayout();
            }
            // Prepare plugin effect
            this._eventInfo.fallbackRank = 0;
            this._eventInfo.defines = defines;
            this._eventInfo.attributes = attribs;
            this._eventInfo.uniforms = uniforms;
            this._eventInfo.samplers = samplers;
            this._eventInfo.uniformBuffersNames = uniformBuffers;
            this._eventInfo.customCode = undefined;
            this._eventInfo.mesh = mesh;
            this._callbackPluginEventGeneric(128 /* MaterialPluginEvent.PrepareEffect */, this._eventInfo);
            const join = defines.toString();
            const effect = scene.getEngine().createEffect("gaussianSplatting", {
                attributes: attribs,
                uniformsNames: uniforms,
                uniformBuffersNames: uniformBuffers,
                samplers: samplers,
                defines: join,
                onCompiled: this.onCompiled,
                onError: this.onError,
                indexParameters: {},
                processCodeAfterIncludes: this._eventInfo.customCode,
                shaderLanguage: this._shaderLanguage,
                extraInitializationsAsync: async () => {
                    if (this._shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
                        await Promise.all([import("../../ShadersWGSL/gaussianSplatting.fragment.js"), import("../../ShadersWGSL/gaussianSplatting.vertex.js")]);
                    }
                    else {
                        await Promise.all([import("../../Shaders/gaussianSplatting.fragment.js"), import("../../Shaders/gaussianSplatting.vertex.js")]);
                    }
                },
            }, engine);
            subMesh.setEffect(effect, defines, this._materialContext);
        }
        if (!subMesh.effect || !subMesh.effect.isReady()) {
            return false;
        }
        defines._renderId = scene.getRenderId();
        drawWrapper._wasPreviouslyReady = true;
        drawWrapper._wasPreviouslyUsingInstances = useInstances;
        this._isDirty = false;
        return true;
    }
    /**
     * GaussianSplattingMaterial belongs to a single mesh
     * @param mesh mesh this material belongs to
     */
    setSourceMesh(mesh) {
        this._sourceMesh = mesh;
    }
    /**
     * Gets the source mesh of this material, which is the Gaussian Splatting mesh that provides the data for rendering
     * @returns The Gaussian Splatting mesh that provides the data for rendering, or null if not set
     */
    getSourceMesh() {
        return this._sourceMesh;
    }
    /**
     * Bind material effect for a specific Gaussian Splatting mesh
     * @param mesh Gaussian splatting mesh
     * @param effect Splatting material or node material
     * @param scene scene that contains mesh and camera used for rendering
     */
    static BindEffect(mesh, effect, scene) {
        const engine = scene.getEngine();
        const camera = scene.activeCamera;
        const renderWidth = engine.getRenderWidth() * camera.viewport.width;
        const renderHeight = engine.getRenderHeight() * camera.viewport.height;
        const gsMaterial = mesh.material;
        if (!gsMaterial._sourceMesh) {
            return;
        }
        const gsMesh = gsMaterial._sourceMesh;
        // check if rigcamera, get number of rigs
        const numberOfRigs = camera?.rigParent?.rigCameras.length || 1;
        effect.setFloat2("invViewport", 1 / (renderWidth / numberOfRigs), 1 / renderHeight);
        let focal = 1000;
        if (camera) {
            /*
            more explicit version:
            const t = camera.getProjectionMatrix().m[5];
            const FovY = Math.atan(1.0 / t) * 2.0;
            focal = renderHeight / 2.0 / Math.tan(FovY / 2.0);
            Using a shorter version here to not have tan(atan) and 2.0 factor
            */
            const t = camera.getProjectionMatrix().m[5];
            if (camera.fovMode == Camera.FOVMODE_VERTICAL_FIXED) {
                focal = (renderHeight * t) / 2.0;
            }
            else {
                focal = (renderWidth * t) / 2.0;
            }
        }
        effect.setFloat2("focal", focal, focal);
        effect.setFloat("kernelSize", gsMaterial && gsMaterial.kernelSize ? gsMaterial.kernelSize : GaussianSplattingMaterial.KernelSize);
        effect.setFloat("minPixelSize", gsMaterial ? gsMaterial.minPixelSize : GaussianSplattingMaterial.MinPixelSize);
        effect.setFloat("alpha", gsMaterial.alpha);
        scene.bindEyePosition(effect, "eyePosition", true);
        if (gsMesh.covariancesATexture) {
            const textureSize = gsMesh.covariancesATexture.getSize();
            effect.setFloat2("dataTextureSize", textureSize.width, textureSize.height);
            effect.setTexture("covariancesATexture", gsMesh.covariancesATexture);
            effect.setTexture("covariancesBTexture", gsMesh.covariancesBTexture);
            effect.setTexture("centersTexture", gsMesh.centersTexture);
            effect.setTexture("colorsTexture", gsMesh.colorsTexture);
            if (gsMesh.useSog) {
                GaussianSplattingMaterial._BindSogUniforms(gsMesh, effect);
            }
            else if (gsMesh.shTextures) {
                for (let i = 0; i < gsMesh.shTextures.length; i++) {
                    effect.setTexture(`shTexture${i}`, gsMesh.shTextures[i]);
                }
            }
            // Bind part indices texture, if the
            gsMesh.bindExtraEffectUniforms(effect);
        }
    }
    /**
     * Bind SOG dequantization uniforms + raw textures.
     * @internal
     */
    static _BindSogUniforms(gsMesh, effect) {
        const p = gsMesh.sogParams;
        if (!p) {
            return;
        }
        effect.setTexture("sogQuatsTexture", gsMesh.rotationsATexture);
        if (gsMesh.shTextures && gsMesh.shTextures.length >= 2) {
            effect.setTexture("sogShNCentroidsTexture", gsMesh.shTextures[0]);
            effect.setTexture("sogShNLabelsTexture", gsMesh.shTextures[1]);
        }
        if (p.codebookTexture) {
            effect.setTexture("sogCodebookTexture", p.codebookTexture);
        }
        effect.setFloat3("sogMeansMin", p.meansMin[0], p.meansMin[1], p.meansMin[2]);
        effect.setFloat3("sogMeansMax", p.meansMax[0], p.meansMax[1], p.meansMax[2]);
        if (p.scalesMin && p.scalesMax) {
            effect.setFloat3("sogScalesMin", p.scalesMin[0], p.scalesMin[1], p.scalesMin[2]);
            effect.setFloat3("sogScalesMax", p.scalesMax[0], p.scalesMax[1], p.scalesMax[2]);
        }
        if (p.sh0Min && p.sh0Max) {
            effect.setFloat4("sogSh0Min", p.sh0Min[0], p.sh0Min[1], p.sh0Min[2], p.sh0Min[3]);
            effect.setFloat4("sogSh0Max", p.sh0Max[0], p.sh0Max[1], p.sh0Max[2], p.sh0Max[3]);
        }
        effect.setFloat("sogShnMin", p.shnMin ?? 0);
        effect.setFloat("sogShnMax", p.shnMax ?? 0);
        effect.setFloat("sogShCoeffCount", p.shCoeffCount ?? 0);
    }
    /**
     * Binds the submesh to this material by preparing the effect and shader to draw
     * @param world defines the world transformation matrix
     * @param mesh defines the mesh containing the submesh
     * @param subMesh defines the submesh to bind the material to
     */
    bindForSubMesh(world, mesh, subMesh) {
        const scene = this.getScene();
        const defines = subMesh.materialDefines;
        if (!defines) {
            return;
        }
        const effect = subMesh.effect;
        if (!effect) {
            return;
        }
        this._activeEffect = effect;
        // Matrices Mesh.
        mesh.getMeshUniformBuffer().bindToEffect(effect, "Mesh");
        mesh.transferToEffect(world);
        // Bind data
        const mustRebind = this._mustRebind(scene, effect, subMesh, mesh.visibility);
        if (mustRebind) {
            this.bindView(effect);
            this.bindViewProjection(effect);
            GaussianSplattingMaterial.BindEffect(mesh, this._activeEffect, scene);
            // Clip plane
            BindClipPlane(effect, this, scene);
        }
        else if (scene.getEngine()._features.needToAlwaysBindUniformBuffers) {
            this._needToBindSceneUbo = true;
        }
        // Fog
        BindFogParameters(scene, mesh, effect);
        // Log. depth
        if (this.useLogarithmicDepth) {
            BindLogDepth(defines, effect, scene);
        }
        // Bind plugins
        this._eventInfo.subMesh = subMesh;
        this._callbackPluginEventBindForSubMesh(this._eventInfo);
        this._afterBind(mesh, this._activeEffect, subMesh);
    }
    static _BindEffectUniforms(gsMesh, gsMaterial, shaderMaterial, scene) {
        const engine = scene.getEngine();
        const effect = shaderMaterial.getEffect();
        const camera = scene.activeCamera;
        if (!camera) {
            return;
        }
        gsMesh.getMeshUniformBuffer().bindToEffect(effect, "Mesh");
        shaderMaterial.bindView(effect);
        shaderMaterial.bindViewProjection(effect);
        const renderWidth = engine.getRenderWidth() * camera.viewport.width;
        const renderHeight = engine.getRenderHeight() * camera.viewport.height;
        effect.setFloat2("invViewport", 1 / renderWidth, 1 / renderHeight);
        let focal = 1000;
        if (camera) {
            /*
            more explicit version:
            const t = camera.getProjectionMatrix().m[5];
            const FovY = Math.atan(1.0 / t) * 2.0;
            focal = renderHeight / 2.0 / Math.tan(FovY / 2.0);
            Using a shorter version here to not have tan(atan) and 2.0 factor
            */
            const t = camera.getProjectionMatrix().m[5];
            if (camera.fovMode == Camera.FOVMODE_VERTICAL_FIXED) {
                focal = (renderHeight * t) / 2.0;
            }
            else {
                focal = (renderWidth * t) / 2.0;
            }
        }
        effect.setFloat2("focal", focal, focal);
        effect.setFloat("kernelSize", gsMaterial && gsMaterial.kernelSize ? gsMaterial.kernelSize : GaussianSplattingMaterial.KernelSize);
        effect.setFloat("minPixelSize", gsMaterial ? gsMaterial.minPixelSize : GaussianSplattingMaterial.MinPixelSize);
        effect.setFloat("alpha", gsMaterial.alpha);
        let minZ, maxZ;
        const cameraIsOrtho = camera.mode === Camera.ORTHOGRAPHIC_CAMERA;
        if (cameraIsOrtho) {
            minZ = !engine.useReverseDepthBuffer && engine.isNDCHalfZRange ? 0 : 1;
            maxZ = engine.useReverseDepthBuffer && engine.isNDCHalfZRange ? 0 : 1;
        }
        else {
            minZ = engine.useReverseDepthBuffer && engine.isNDCHalfZRange ? camera.minZ : engine.isNDCHalfZRange ? 0 : camera.minZ;
            maxZ = engine.useReverseDepthBuffer && engine.isNDCHalfZRange ? 0 : camera.maxZ;
        }
        effect.setFloat2("depthValues", minZ, minZ + maxZ);
        if (gsMesh.covariancesATexture) {
            const textureSize = gsMesh.covariancesATexture.getSize();
            effect.setFloat2("dataTextureSize", textureSize.width, textureSize.height);
            effect.setTexture("covariancesATexture", gsMesh.covariancesATexture);
            effect.setTexture("covariancesBTexture", gsMesh.covariancesBTexture);
            effect.setTexture("centersTexture", gsMesh.centersTexture);
            effect.setTexture("colorsTexture", gsMesh.colorsTexture);
            gsMesh.bindExtraEffectUniforms(effect);
        }
    }
    _bindVoxelEffectUniforms(gsMesh, gsMaterial, shaderMaterial) {
        if (!gsMesh.rotationsATexture) {
            // Attempt to enable rotation/scale texture generation (no-op if already enabled).
            // If the mesh is already loaded and splat data is in RAM this triggers updateData() synchronously.
            // If the mesh was loaded without keepInRam=true the setter will log an error.
            gsMesh.needsRotationScaleTextures = true;
            if (!gsMesh.rotationsATexture) {
                // Mesh data was already processed but rotation textures couldn't be generated — warn once.
                if (gsMesh.centersTexture && !gsMesh.splatsData && !this._voxelMissingTextureWarned.has(gsMesh.uniqueId)) {
                    this._voxelMissingTextureWarned.add(gsMesh.uniqueId);
                    Logger.Error("IBL voxelization: GaussianSplattingMesh rotation/scale textures are not available. " +
                        "Create the mesh either with keepInRam=true or needsRotationScaleTextures=true to enable IBL shadow voxelization.");
                }
                return false;
            }
        }
        this._voxelMissingTextureWarned.delete(gsMesh.uniqueId);
        const effect = shaderMaterial.getEffect();
        gsMesh.getMeshUniformBuffer().bindToEffect(effect, "Mesh");
        const textureSize = gsMesh.rotationsATexture.getSize();
        effect.setFloat("alpha", gsMaterial.alpha);
        effect.setFloat2("dataTextureSize", textureSize.width, textureSize.height);
        effect.setTexture("rotationsATexture", gsMesh.rotationsATexture);
        effect.setTexture("rotationsBTexture", gsMesh.rotationsBTexture);
        effect.setTexture("rotationScaleTexture", gsMesh.rotationScaleTexture);
        effect.setTexture("centersTexture", gsMesh.centersTexture);
        effect.setTexture("colorsTexture", gsMesh.colorsTexture);
        if (gsMesh.partIndicesTexture) {
            effect.setTexture("partIndicesTexture", gsMesh.partIndicesTexture);
            const partWorldDataLength = gsMesh.partCount * 16;
            if (this._voxelPartWorldData.length !== partWorldDataLength) {
                this._voxelPartWorldData = new Float32Array(partWorldDataLength);
            }
            const partWorldData = this._voxelPartWorldData;
            for (let i = 0; i < gsMesh.partCount; i++) {
                gsMesh.getWorldMatrixForPart(i).toArray(partWorldData, i * 16);
            }
            effect.setMatrices("partWorld", partWorldData);
            const partVisibilityData = this._voxelPartVisibilityData;
            partVisibilityData.length = gsMesh.partCount;
            for (let i = 0; i < gsMesh.partCount; i++) {
                partVisibilityData[i] = gsMesh.partVisibility[i] ?? 1.0;
            }
            effect.setArray("partVisibility", partVisibilityData);
        }
        return true;
    }
    /**
     * Create a voxel rendering material for a Gaussian Splatting mesh, for use with IBL shadow voxelization.
     * The returned ShaderMaterial's onBindObservable binds the GS mesh-side uniforms (textures, alpha, dataTextureSize, part data).
     * The caller (e.g. iblShadowsVoxelRenderer) is responsible for setting the per-slab uniforms on the returned material:
     * viewMatrix, invWorldScale, nearPlane, farPlane, stepSize.
     * @param scene scene it belongs to
     * @param shaderLanguage GLSL or WGSL
     * @param maxDrawBuffers number of draw buffers (MRT outputs) per voxelization slab
     * @param compoundMesh whether the mesh is a compound mesh
     * @returns voxel rendering shader material
     */
    makeVoxelRenderingMaterial(scene, shaderLanguage, maxDrawBuffers, compoundMesh = false) {
        const defines = [`#define MAX_DRAW_BUFFERS ${maxDrawBuffers}`];
        defines.push("#define IS_FOR_VOXELIZATION");
        if (compoundMesh) {
            defines.push("#define IS_COMPOUND 1");
            defines.push(`#define MAX_PART_COUNT ${GetGaussianSplattingMaxPartCount(scene.getEngine())}`);
        }
        const shaderMaterial = new ShaderMaterial("gaussianSplattingVoxelRender", scene, {
            vertex: "gaussianSplattingVoxel",
            fragment: "gaussianSplattingVoxel",
        }, {
            attributes: GaussianSplattingMaterial._Attribs,
            uniforms: GaussianSplattingMaterial._VoxelUniforms,
            samplers: GaussianSplattingMaterial._VoxelSamplers,
            uniformBuffers: GaussianSplattingMaterial._UniformBuffers,
            // WebGPU accumulates non-binary voxel opacity via atomicMax into this storage buffer.
            storageBuffers: shaderLanguage === 1 /* ShaderLanguage.WGSL */ ? ["voxelOpacityBuffer"] : [],
            shaderLanguage: shaderLanguage,
            defines: defines,
            needAlphaBlending: false,
            extraInitializationsAsync: async () => {
                if (shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
                    await Promise.all([import("../../ShadersWGSL/gaussianSplattingVoxel.vertex.js"), import("../../ShadersWGSL/gaussianSplattingVoxel.fragment.js")]);
                }
                else {
                    await Promise.all([import("../../Shaders/gaussianSplattingVoxel.vertex.js"), import("../../Shaders/gaussianSplattingVoxel.fragment.js")]);
                }
            },
        });
        shaderMaterial.cullBackFaces = false;
        shaderMaterial.backFaceCulling = false;
        shaderMaterial.depthFunction = Engine.ALWAYS;
        shaderMaterial.onBindObservable.add((mesh) => {
            const gsMaterial = mesh.material;
            const gsMesh = mesh;
            this._bindVoxelEffectUniforms(gsMesh, gsMaterial, shaderMaterial);
        });
        return shaderMaterial;
    }
    /**
     * Create a depth rendering material for a Gaussian Splatting mesh
     * @param scene scene it belongs to
     * @param shaderLanguage GLSL or WGSL
     * @param alphaBlendedDepth whether to enable alpha blended depth rendering
     * @param compoundMesh whether the mesh is a compound mesh
     * @returns depth rendering shader material
     */
    makeDepthRenderingMaterial(scene, shaderLanguage, alphaBlendedDepth = false, compoundMesh = false) {
        const defines = ["#define DEPTH_RENDER"];
        if (alphaBlendedDepth) {
            defines.push("#define ALPHA_BLENDED_DEPTH");
        }
        if (compoundMesh) {
            defines.push("#define IS_COMPOUND 1");
            defines.push(`#define MAX_PART_COUNT ${GetGaussianSplattingMaxPartCount(scene.getEngine())}`);
        }
        const shaderMaterial = new ShaderMaterial("gaussianSplattingDepthRender", scene, {
            vertex: "gaussianSplattingDepth",
            fragment: "gaussianSplattingDepth",
        }, {
            attributes: GaussianSplattingMaterial._Attribs,
            uniforms: GaussianSplattingMaterial._Uniforms,
            samplers: GaussianSplattingMaterial._Samplers,
            uniformBuffers: GaussianSplattingMaterial._UniformBuffers,
            shaderLanguage: shaderLanguage,
            defines: defines,
            needAlphaBlending: alphaBlendedDepth,
        });
        shaderMaterial.doNotSerialize = true;
        shaderMaterial.backFaceCulling = false;
        shaderMaterial.onBindObservable.add((mesh) => {
            const gsMaterial = mesh.material;
            // Use the source mesh from the material for GS-specific properties (textures, etc.),
            // since the bound mesh may be a camera mesh proxy without those properties.
            const gsMesh = (gsMaterial?.getSourceMesh() ?? mesh);
            GaussianSplattingMaterial._BindEffectUniforms(gsMesh, gsMaterial, shaderMaterial, scene);
        });
        return shaderMaterial;
    }
    static _MakeGaussianSplattingShadowDepthWrapper(scene, shaderLanguage) {
        const shaderMaterial = new ShaderMaterial("gaussianSplattingDepth", scene, {
            vertex: "gaussianSplattingDepth",
            fragment: "gaussianSplattingDepth",
        }, {
            attributes: GaussianSplattingMaterial._Attribs,
            uniforms: GaussianSplattingMaterial._Uniforms,
            samplers: GaussianSplattingMaterial._Samplers,
            uniformBuffers: GaussianSplattingMaterial._UniformBuffers,
            shaderLanguage: shaderLanguage,
        });
        shaderMaterial.doNotSerialize = true;
        shaderMaterial.backFaceCulling = false;
        const shadowDepthWrapper = new ShadowDepthWrapper(shaderMaterial, scene, {
            standalone: true,
        });
        shaderMaterial.onBindObservable.add((mesh) => {
            const gsMaterial = mesh.material;
            // Use the source mesh from the material for GS-specific properties (textures, etc.),
            // since the bound mesh may be a camera mesh proxy without those properties.
            const gsMesh = (gsMaterial?.getSourceMesh() ?? mesh);
            GaussianSplattingMaterial._BindEffectUniforms(gsMesh, gsMaterial, shaderMaterial, scene);
        });
        return shadowDepthWrapper;
    }
    /**
     * Clones the material.
     * @param name The cloned name.
     * @returns The cloned material.
     */
    clone(name) {
        const clone = SerializationHelper.Clone(() => new GaussianSplattingMaterial(name, this.getScene()), this);
        clone.id = name;
        clone.name = name;
        this._clonePlugins(clone, "");
        return clone;
    }
    /**
     * Serializes the current material to its JSON representation.
     * @returns The JSON representation.
     */
    serialize() {
        const serializationObject = super.serialize();
        serializationObject.customType = "BABYLON.GaussianSplattingMaterial";
        return serializationObject;
    }
    /**
     * Gets the class name of the material
     * @returns "GaussianSplattingMaterial"
     */
    getClassName() {
        return "GaussianSplattingMaterial";
    }
    /**
     * Parse a JSON input to create back a Gaussian Splatting material.
     * @param source The JSON data to parse
     * @param scene The scene to create the parsed material in
     * @param rootUrl The root url of the assets the material depends upon
     * @returns the instantiated GaussianSplattingMaterial.
     */
    static Parse(source, scene, rootUrl) {
        const material = SerializationHelper.Parse(() => new GaussianSplattingMaterial(source.name, scene), source, scene, rootUrl);
        Material._ParsePlugins(source, material, scene, rootUrl);
        return material;
    }
}
/**
 * Point spread function (default 0.3). Can be overriden per GS material
 */
GaussianSplattingMaterial.KernelSize = 0.3;
/**
 * Compensation
 */
GaussianSplattingMaterial.Compensation = false;
/**
 * Minimum projected splat size, in pixels, below which a splat is discarded (default 0 = disabled).
 * Matches PlayCanvas `minPixelSize`. Applies to all Gaussian Splatting meshes using this material.
 */
GaussianSplattingMaterial.MinPixelSize = 0;
GaussianSplattingMaterial._Attribs = [VertexBuffer.PositionKind, "splatIndex0", "splatIndex1", "splatIndex2", "splatIndex3"];
GaussianSplattingMaterial._Samplers = [
    "covariancesATexture",
    "covariancesBTexture",
    "centersTexture",
    "colorsTexture",
    "shTexture0",
    "shTexture1",
    "shTexture2",
    "shTexture3",
    "shTexture4",
    "partIndicesTexture",
    "sogQuatsTexture",
    "sogShNCentroidsTexture",
    "sogShNLabelsTexture",
    "sogCodebookTexture",
];
GaussianSplattingMaterial._UniformBuffers = ["Scene", "Mesh"];
GaussianSplattingMaterial._VoxelUniforms = [
    "world",
    "dataTextureSize",
    "alpha",
    "invWorldScale",
    "viewMatrix",
    "nearPlane",
    "farPlane",
    "stepSize",
    "partWorld",
    "partVisibility",
    "axis",
];
GaussianSplattingMaterial._VoxelSamplers = ["rotationsATexture", "rotationsBTexture", "rotationScaleTexture", "centersTexture", "colorsTexture", "partIndicesTexture"];
GaussianSplattingMaterial._Uniforms = [
    "world",
    "view",
    "projection",
    "vFogInfos",
    "vFogColor",
    "logarithmicDepthConstant",
    "invViewport",
    "dataTextureSize",
    "focal",
    "eyePosition",
    "kernelSize",
    "minPixelSize",
    "alpha",
    "depthValues",
    "partWorld",
    "partVisibility",
    "sogMeansMin",
    "sogMeansMax",
    "sogScalesMin",
    "sogScalesMax",
    "sogSh0Min",
    "sogSh0Max",
    "sogShnMin",
    "sogShnMax",
    "sogShCoeffCount",
];
let _Registered = false;
/**
 * Register side effects for gaussianSplattingMaterial.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterGaussianSplattingMaterial() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.GaussianSplattingMaterial", GaussianSplattingMaterial);
}
//# sourceMappingURL=gaussianSplattingMaterial.pure.js.map