/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { InputBlock } from "../Input/inputBlock.pure.js";
import { NodeMaterialConnectionPointCustomObject } from "../../nodeMaterialConnectionPointCustomObject.js";
import { RefractionBlock } from "./refractionBlock.pure.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { PBRSubSurfaceConfiguration } from "../../../PBR/pbrSubSurfaceConfiguration.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to implement the sub surface module of the PBR material
 */
let SubSurfaceBlock = (() => {
    var _a;
    let _classSuper = NodeMaterialBlock;
    let _applyAlbedoAfterSubSurface_decorators;
    let _applyAlbedoAfterSubSurface_initializers = [];
    let _applyAlbedoAfterSubSurface_extraInitializers = [];
    return _a = class SubSurfaceBlock extends _classSuper {
            /**
             * Create a new SubSurfaceBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name, NodeMaterialBlockTargets.Fragment);
                /**
                 * Set it to true if your rendering in 8.0+ is different from that in 7 when you use sub-surface properties (transmission, refraction, etc.)
                 */
                this.applyAlbedoAfterSubSurface = __runInitializers(this, _applyAlbedoAfterSubSurface_initializers, PBRSubSurfaceConfiguration.DEFAULT_APPLY_ALBEDO_AFTERSUBSURFACE);
                __runInitializers(this, _applyAlbedoAfterSubSurface_extraInitializers);
                this._isUnique = true;
                this.registerInput("thickness", NodeMaterialBlockConnectionPointTypes.Float, false, NodeMaterialBlockTargets.Fragment);
                this.registerInput("tintColor", NodeMaterialBlockConnectionPointTypes.Color3, true, NodeMaterialBlockTargets.Fragment);
                this.registerInput("translucencyIntensity", NodeMaterialBlockConnectionPointTypes.Float, true, NodeMaterialBlockTargets.Fragment);
                this.registerInput("translucencyDiffusionDist", NodeMaterialBlockConnectionPointTypes.Color3, true, NodeMaterialBlockTargets.Fragment);
                this.registerInput("refraction", NodeMaterialBlockConnectionPointTypes.Object, true, NodeMaterialBlockTargets.Fragment, new NodeMaterialConnectionPointCustomObject("refraction", this, 0 /* NodeMaterialConnectionPointDirection.Input */, RefractionBlock, "RefractionBlock"));
                this.registerInput("dispersion", NodeMaterialBlockConnectionPointTypes.Float, true, NodeMaterialBlockTargets.Fragment);
                this.registerOutput("subsurface", NodeMaterialBlockConnectionPointTypes.Object, NodeMaterialBlockTargets.Fragment, new NodeMaterialConnectionPointCustomObject("subsurface", this, 1 /* NodeMaterialConnectionPointDirection.Output */, _a, "SubSurfaceBlock"));
            }
            /**
             * Initialize the block and prepare the context for build
             * @param state defines the state that will be used for the build
             */
            initialize(state) {
                state._excludeVariableName("subSurfaceOut");
                state._excludeVariableName("vThicknessParam");
                state._excludeVariableName("vTintColor");
                state._excludeVariableName("vTranslucencyColor");
                state._excludeVariableName("vSubSurfaceIntensity");
                state._excludeVariableName("dispersion");
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "SubSurfaceBlock";
            }
            /**
             * Gets the thickness component
             */
            get thickness() {
                return this._inputs[0];
            }
            /**
             * Gets the tint color input component
             */
            get tintColor() {
                return this._inputs[1];
            }
            /**
             * Gets the translucency intensity input component
             */
            get translucencyIntensity() {
                return this._inputs[2];
            }
            /**
             * Gets the translucency diffusion distance input component
             */
            get translucencyDiffusionDist() {
                return this._inputs[3];
            }
            /**
             * Gets the refraction object parameters
             */
            get refraction() {
                return this._inputs[4];
            }
            /**
             * Gets the dispersion input component
             */
            get dispersion() {
                return this._inputs[5];
            }
            /**
             * Gets the sub surface object output component
             */
            get subsurface() {
                return this._outputs[0];
            }
            /**
             * Auto configure the block based on the material
             */
            autoConfigure() {
                if (!this.thickness.isConnected) {
                    const thicknessInput = new InputBlock("SubSurface thickness", NodeMaterialBlockTargets.Fragment, NodeMaterialBlockConnectionPointTypes.Float);
                    thicknessInput.value = 0;
                    thicknessInput.output.connectTo(this.thickness);
                }
            }
            /**
             * Prepare the list of defines
             * @param defines - the list of defines
             */
            prepareDefines(defines) {
                const translucencyEnabled = this.translucencyDiffusionDist.isConnected || this.translucencyIntensity.isConnected;
                defines.setValue("SUBSURFACE", translucencyEnabled || this.refraction.isConnected, true);
                defines.setValue("SS_TRANSLUCENCY", translucencyEnabled, true);
                defines.setValue("SS_THICKNESSANDMASK_TEXTURE", false, true);
                defines.setValue("SS_REFRACTIONINTENSITY_TEXTURE", false, true);
                defines.setValue("SS_TRANSLUCENCYINTENSITY_TEXTURE", false, true);
                defines.setValue("SS_USE_GLTF_TEXTURES", false, true);
                defines.setValue("SS_DISPERSION", this.dispersion.isConnected, true);
                defines.setValue("SS_APPLY_ALBEDO_AFTER_SUBSURFACE", this.applyAlbedoAfterSubSurface, true);
            }
            /**
             * Gets the main code of the block (fragment side)
             * @param state current state of the node material building
             * @param ssBlock instance of a SubSurfaceBlock or null if the code must be generated without an active sub surface module
             * @param reflectionBlock instance of a ReflectionBlock null if the code must be generated without an active reflection module
             * @param worldPosVarName name of the variable holding the world position
             * @returns the shader code
             */
            static GetCode(state, ssBlock, reflectionBlock, worldPosVarName) {
                let code = "";
                const thickness = ssBlock?.thickness.isConnected ? ssBlock.thickness.associatedVariableName : "0.";
                const tintColor = ssBlock?.tintColor.isConnected ? ssBlock.tintColor.associatedVariableName : "vec3(1.)";
                const translucencyIntensity = ssBlock?.translucencyIntensity.isConnected ? ssBlock?.translucencyIntensity.associatedVariableName : "1.";
                const translucencyDiffusionDistance = ssBlock?.translucencyDiffusionDist.isConnected ? ssBlock?.translucencyDiffusionDist.associatedVariableName : "vec3(1.)";
                const refractionBlock = (ssBlock?.refraction.isConnected ? ssBlock?.refraction.connectedPoint?.ownerBlock : null);
                const refractionTintAtDistance = refractionBlock?.tintAtDistance.isConnected ? refractionBlock.tintAtDistance.associatedVariableName : "1.";
                const refractionIntensity = refractionBlock?.intensity.isConnected ? refractionBlock.intensity.associatedVariableName : "1.";
                const refractionView = refractionBlock?.view.isConnected ? refractionBlock.view.associatedVariableName : "";
                const dispersion = ssBlock?.dispersion.isConnected ? ssBlock?.dispersion.associatedVariableName : "0.0";
                const isWebGPU = state.shaderLanguage === 1 /* ShaderLanguage.WGSL */;
                code += refractionBlock?.getCode(state) ?? "";
                code += `${isWebGPU ? "var subSurfaceOut: subSurfaceOutParams" : "subSurfaceOutParams subSurfaceOut"};

        #ifdef SUBSURFACE
            ${state._declareLocalVar("vThicknessParam", NodeMaterialBlockConnectionPointTypes.Vector2)} = vec2${state.fSuffix}(0., ${thickness});
            ${state._declareLocalVar("vTintColor", NodeMaterialBlockConnectionPointTypes.Vector4)} = vec4${state.fSuffix}(${tintColor}, ${refractionTintAtDistance});
            ${state._declareLocalVar("vSubSurfaceIntensity", NodeMaterialBlockConnectionPointTypes.Vector3)} = vec3(${refractionIntensity}, ${translucencyIntensity}, 0.);
            ${state._declareLocalVar("dispersion", NodeMaterialBlockConnectionPointTypes.Float)} = ${dispersion};
            subSurfaceOut = subSurfaceBlock(
                vSubSurfaceIntensity
                , vThicknessParam
                , vTintColor
                , normalW
            #ifdef LEGACY_SPECULAR_ENERGY_CONSERVATION
        `;
                code += isWebGPU
                    ? `, vec3f(max(colorSpecularEnvironmentReflectance.r, max(colorSpecularEnvironmentReflectance.g, colorSpecularEnvironmentReflectance.b)))/n`
                    : `, vec3(max(colorSpecularEnvironmentReflectance.r, max(colorSpecularEnvironmentReflectance.g, colorSpecularEnvironmentReflectance.b)))/n`;
                code += `#else
                , baseSpecularEnvironmentReflectance
            #endif
            #ifdef SS_THICKNESSANDMASK_TEXTURE
                , vec4${state.fSuffix}(0.)
            #endif
            #ifdef REFLECTION
                #ifdef SS_TRANSLUCENCY
                    , ${(isWebGPU ? "uniforms." : "") + reflectionBlock?._reflectionMatrixName}
                    #ifdef USESPHERICALFROMREFLECTIONMAP
                        #if !defined(NORMAL) || !defined(USESPHERICALINVERTEX)
                            , reflectionOut.irradianceVector
                        #endif
                        #if defined(REALTIME_FILTERING)
                            , ${reflectionBlock?._cubeSamplerName}
                            ${isWebGPU ? `, ${reflectionBlock?._cubeSamplerName}Sampler` : ""}
                            , ${reflectionBlock?._vReflectionFilteringInfoName}
                        #endif
                        #endif
                    #ifdef USEIRRADIANCEMAP
                        , irradianceSampler
                        ${isWebGPU ? `, irradianceSamplerSampler` : ""}
                    #endif
                #endif
            #endif
            #if defined(SS_REFRACTION) || defined(SS_TRANSLUCENCY)
                , surfaceAlbedo
            #endif
            #ifdef SS_REFRACTION
                , ${worldPosVarName}.xyz
                , viewDirectionW
                , ${refractionView}
                , ${(isWebGPU ? "uniforms." : "") + (refractionBlock?._vRefractionInfosName ?? "")}
                , ${(isWebGPU ? "uniforms." : "") + (refractionBlock?._refractionMatrixName ?? "")}
                , ${(isWebGPU ? "uniforms." : "") + (refractionBlock?._vRefractionMicrosurfaceInfosName ?? "")}
                , ${isWebGPU ? "uniforms." : ""}vLightingIntensity
                #ifdef SS_LINKREFRACTIONTOTRANSPARENCY
                    , alpha
                #endif
                #ifdef ${refractionBlock?._defineLODRefractionAlpha ?? "IGNORE"}
                    , NdotVUnclamped
                #endif
                #ifdef ${refractionBlock?._defineLinearSpecularRefraction ?? "IGNORE"}
                    , roughness
                #endif
                , alphaG
                #ifdef ${refractionBlock?._define3DName ?? "IGNORE"}
                    , ${refractionBlock?._cubeSamplerName ?? ""}
                    ${isWebGPU ? `, ${refractionBlock?._cubeSamplerName}Sampler` : ""}
                #else
                    , ${refractionBlock?._2DSamplerName ?? ""}
                    ${isWebGPU ? `, ${refractionBlock?._2DSamplerName}Sampler` : ""}
                #endif
                #ifndef LODBASEDMICROSFURACE
                    #ifdef ${refractionBlock?._define3DName ?? "IGNORE"}
                        , ${refractionBlock?._cubeSamplerName ?? ""}                        
                        ${isWebGPU ? `, ${refractionBlock?._cubeSamplerName}Sampler` : ""}
                        , ${refractionBlock?._cubeSamplerName ?? ""}                        
                        ${isWebGPU ? `, ${refractionBlock?._cubeSamplerName}Sampler` : ""}
                    #else
                        , ${refractionBlock?._2DSamplerName ?? ""}
                        ${isWebGPU ? `, ${refractionBlock?._2DSamplerName}Sampler` : ""}
                        , ${refractionBlock?._2DSamplerName ?? ""}
                        ${isWebGPU ? `, ${refractionBlock?._2DSamplerName}Sampler` : ""}
                    #endif
                #endif
                #ifdef ANISOTROPIC
                    , anisotropicOut
                #endif
                #ifdef REALTIME_FILTERING
                    , ${refractionBlock?._vRefractionFilteringInfoName ?? ""}
                #endif
                #ifdef SS_USE_LOCAL_REFRACTIONMAP_CUBIC
                    , vRefractionPosition
                    , vRefractionSize
                #endif
                #ifdef SS_DISPERSION
                    , dispersion
                #endif
            #endif
            #ifdef SS_TRANSLUCENCY
                , ${translucencyDiffusionDistance}
                , vTintColor
                #ifdef SS_TRANSLUCENCYCOLOR_TEXTURE
                    , vec4${state.fSuffix}(0.)
                #endif
            #endif                
            );

            #ifdef SS_REFRACTION
                surfaceAlbedo = subSurfaceOut.surfaceAlbedo;
                #ifdef SS_LINKREFRACTIONTOTRANSPARENCY
                    alpha = subSurfaceOut.alpha;
                #endif
            #endif
        #else
            subSurfaceOut.specularEnvironmentReflectance = colorSpecularEnvironmentReflectance;
        #endif\n`;
                return code;
            }
            _buildBlock(state) {
                if (state.target === NodeMaterialBlockTargets.Fragment) {
                    state.sharedData.blocksWithDefines.push(this);
                }
                return this;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _applyAlbedoAfterSubSurface_decorators = [editableInPropertyPage("Apply albedo after sub-surface", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED")];
            __esDecorate(null, null, _applyAlbedoAfterSubSurface_decorators, { kind: "field", name: "applyAlbedoAfterSubSurface", static: false, private: false, access: { has: obj => "applyAlbedoAfterSubSurface" in obj, get: obj => obj.applyAlbedoAfterSubSurface, set: (obj, value) => { obj.applyAlbedoAfterSubSurface = value; } }, metadata: _metadata }, _applyAlbedoAfterSubSurface_initializers, _applyAlbedoAfterSubSurface_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { SubSurfaceBlock };
let _Registered = false;
/**
 * Register side effects for subSurfaceBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterSubSurfaceBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.SubSurfaceBlock", SubSurfaceBlock);
}
//# sourceMappingURL=subSurfaceBlock.pure.js.map