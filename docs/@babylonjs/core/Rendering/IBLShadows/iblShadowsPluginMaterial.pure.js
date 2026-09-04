/** This file must only contain pure code and pure imports */
import { __classPrivateFieldGet, __classPrivateFieldSet, __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { MaterialDefines } from "../../Materials/materialDefines.js";
import { MaterialPluginBase } from "../../Materials/materialPluginBase.pure.js";

import { PBRBaseMaterial } from "../../Materials/PBR/pbrBaseMaterial.pure.js";
import { expandToProperty, serialize } from "../../Misc/decorators.js";
import { RegisterClass } from "../../Misc/typeStore.js";
/**
 * @internal
 */
class MaterialIBLShadowsRenderDefines extends MaterialDefines {
    constructor() {
        super(...arguments);
        this.RENDER_WITH_IBL_SHADOWS = false;
        this.COLORED_IBL_SHADOWS = false;
    }
}
/**
 * Plugin used to render the contribution from IBL shadows.
 */
let IBLShadowsPluginMaterial = (() => {
    var _a, _IBLShadowsPluginMaterial_isEnabled_accessor_storage;
    let _classSuper = MaterialPluginBase;
    let _shadowOpacity_decorators;
    let _shadowOpacity_initializers = [];
    let _shadowOpacity_extraInitializers = [];
    let _isEnabled_decorators;
    let _isEnabled_initializers = [];
    let _isEnabled_extraInitializers = [];
    return _a = class IBLShadowsPluginMaterial extends _classSuper {
            get iblShadowsTexture() {
                return this._iblShadowsTexture;
            }
            set iblShadowsTexture(value) {
                if (this._iblShadowsTexture === value) {
                    return;
                }
                this._iblShadowsTexture = value;
                this._markAllSubMeshesAsTexturesDirty();
            }
            get isColored() {
                return this._isColored;
            }
            set isColored(value) {
                if (this._isColored === value) {
                    return;
                }
                this._isColored = value;
                this._markAllSubMeshesAsTexturesDirty();
            }
            /**
             * Defines if the plugin is enabled in the material.
             */
            get isEnabled() { return __classPrivateFieldGet(this, _IBLShadowsPluginMaterial_isEnabled_accessor_storage, "f"); }
            set isEnabled(value) { __classPrivateFieldSet(this, _IBLShadowsPluginMaterial_isEnabled_accessor_storage, value, "f"); }
            _markAllSubMeshesAsTexturesDirty() {
                this._enable(this._isEnabled);
                this._internalMarkAllSubMeshesAsTexturesDirty();
            }
            /**
             * Gets a boolean indicating that the plugin is compatible with a give shader language.
             * @returns true if the plugin is compatible with the shader language
             */
            isCompatible() {
                return true;
            }
            constructor(material) {
                super(material, _a.Name, 310, new MaterialIBLShadowsRenderDefines());
                /**
                 * The opacity of the shadows.
                 */
                this.shadowOpacity = __runInitializers(this, _shadowOpacity_initializers, 1.0);
                this._isEnabled = (__runInitializers(this, _shadowOpacity_extraInitializers), false);
                this._isColored = false;
                _IBLShadowsPluginMaterial_isEnabled_accessor_storage.set(this, __runInitializers(this, _isEnabled_initializers, false));
                this._internalMarkAllSubMeshesAsTexturesDirty = __runInitializers(this, _isEnabled_extraInitializers);
                this._internalMarkAllSubMeshesAsTexturesDirty = material._dirtyCallbacks[1];
            }
            _isOpenPBRMaterial() {
                return this._material.getClassName() === "OpenPBRMaterial";
            }
            prepareDefines(defines) {
                defines.RENDER_WITH_IBL_SHADOWS = this._isEnabled;
                defines.COLORED_IBL_SHADOWS = this.isColored;
            }
            getClassName() {
                return "IBLShadowsPluginMaterial";
            }
            getUniforms(_shaderLanguage) {
                const result = {};
                result.ubo = [];
                if (this._isOpenPBRMaterial()) {
                    if (_shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
                        result.fragment = `#ifdef RENDER_WITH_IBL_SHADOWS
                    var shadowOpacity: f32;
                #endif`;
                    }
                    else {
                        result.fragment = `#ifdef RENDER_WITH_IBL_SHADOWS
                    uniform float shadowOpacity;
                #endif`;
                    }
                }
                else {
                    result.ubo.push({ name: "renderTargetSize", size: 2, type: "vec2" });
                    if (_shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
                        result.fragment = `#ifdef RENDER_WITH_IBL_SHADOWS
                    var renderTargetSize: vec2f;
                    var shadowOpacity: f32;
                #endif`;
                    }
                    else {
                        result.fragment = `#ifdef RENDER_WITH_IBL_SHADOWS
                    uniform vec2 renderTargetSize;
                    uniform float shadowOpacity;
                #endif`;
                    }
                }
                result.ubo.push({ name: "shadowOpacity", size: 1, type: "float" });
                return result;
            }
            getSamplers(samplers) {
                samplers.push("iblShadowsTexture");
            }
            bindForSubMesh(uniformBuffer) {
                if (this._isEnabled && this.iblShadowsTexture) {
                    uniformBuffer.bindTexture("iblShadowsTexture", this.iblShadowsTexture);
                    uniformBuffer.updateFloat2("renderTargetSize", this._material.getScene().getEngine().getRenderWidth(), this._material.getScene().getEngine().getRenderHeight());
                    uniformBuffer.updateFloat("shadowOpacity", this.shadowOpacity);
                }
            }
            getCustomCode(shaderType, shaderLanguage) {
                let frag;
                if (shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
                    frag = {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        CUSTOM_FRAGMENT_DEFINITIONS: `
                #ifdef RENDER_WITH_IBL_SHADOWS
                    var iblShadowsTextureSampler: sampler;
                    var iblShadowsTexture: texture_2d<f32>;

                    #ifdef COLORED_IBL_SHADOWS
                        fn computeIndirectShadow() -> vec3f {
                            var uv = fragmentInputs.position.xy / uniforms.renderTargetSize;
                            var shadowValue: vec3f = textureSample(iblShadowsTexture, iblShadowsTextureSampler, uv).rgb;
                            return mix(shadowValue, vec3f(1.0), 1.0 - uniforms.shadowOpacity);
                        }
                    #else
                        fn computeIndirectShadow() -> vec2f {
                            var uv = fragmentInputs.position.xy / uniforms.renderTargetSize;
                            var shadowValue: vec2f = textureSample(iblShadowsTexture, iblShadowsTextureSampler, uv).rg;
                            return mix(shadowValue, vec2f(1.0), 1.0 - uniforms.shadowOpacity);
                        }
                    #endif
                #endif
            `,
                    };
                    if (this._material instanceof PBRBaseMaterial) {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        frag["CUSTOM_FRAGMENT_BEFORE_FINALCOLORCOMPOSITION"] = `
                #ifdef RENDER_WITH_IBL_SHADOWS
                    #ifndef UNLIT
                        #ifdef REFLECTION
                            #ifdef COLORED_IBL_SHADOWS
                                var shadowValue: vec3f = computeIndirectShadow();
                                finalIrradiance *= shadowValue;
                                finalRadianceScaled *= mix(vec3f(1.0), shadowValue, roughness);
                            #else
                                var shadowValue: vec2f = computeIndirectShadow();
                                finalIrradiance *= vec3f(shadowValue.x);
                                finalRadianceScaled *= vec3f(mix(pow(shadowValue.y, 4.0), shadowValue.x, roughness));
                            #endif
                        #endif
                    #else
                        finalDiffuse *= computeIndirectShadow().x;
                    #endif
                #endif
            `;
                    }
                    else if (this._isOpenPBRMaterial()) {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        frag["CUSTOM_FRAGMENT_BEFORE_IBLLAYERCOMPOSITION"] = `
                #ifdef RENDER_WITH_IBL_SHADOWS
                    #ifndef UNLIT
                        #ifdef REFLECTION
                            #ifdef COLORED_IBL_SHADOWS
                                var shadowValue: vec3f = computeIndirectShadow();
                                ambient_occlusion = min(ambient_occlusion, shadowValue);
                            #else
                                var shadowValue: vec2f = computeIndirectShadow();
                                ambient_occlusion = min(ambient_occlusion, vec3f(shadowValue.x));
                                specular_ambient_occlusion = min(specular_ambient_occlusion, pow(shadowValue.y, 4.0));
                            #endif
                        #endif
                    #else
                        ambient_occlusion = min(ambient_occlusion, vec3f(computeIndirectShadow().x));
                    #endif
                #endif
            `;
                    }
                    else {
                        frag["CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR"] = `
                #ifdef RENDER_WITH_IBL_SHADOWS
                    #ifdef COLORED_IBL_SHADOWS
                        var shadowValue: vec3f = computeIndirectShadow();
                        color *= toGammaSpace(vec4f(shadowValue, 1.0f));
                    #else
                        var shadowValue: vec2f = computeIndirectShadow();
                        color *= toGammaSpace(vec4f(shadowValue.x, shadowValue.x, shadowValue.x, 1.0f));
                    #endif
                #endif
            `;
                    }
                }
                else {
                    frag = {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        CUSTOM_FRAGMENT_DEFINITIONS: `
                #ifdef RENDER_WITH_IBL_SHADOWS
                    uniform sampler2D iblShadowsTexture;
                #ifdef COLORED_IBL_SHADOWS
                    vec3 computeIndirectShadow() {
                        vec2 uv = gl_FragCoord.xy / renderTargetSize;
                        vec3 shadowValue = texture2D(iblShadowsTexture, uv).rgb;
                        return mix(shadowValue.rgb, vec3(1.0), 1.0 - shadowOpacity);
                    }
                #else
                    vec2 computeIndirectShadow() {
                        vec2 uv = gl_FragCoord.xy / renderTargetSize;
                        vec2 shadowValue = texture2D(iblShadowsTexture, uv).rg;
                        return mix(shadowValue.rg, vec2(1.0), 1.0 - shadowOpacity);
                    }
                #endif
                #endif
            `,
                    };
                    if (this._material instanceof PBRBaseMaterial) {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        frag["CUSTOM_FRAGMENT_BEFORE_FINALCOLORCOMPOSITION"] = `
                #ifdef RENDER_WITH_IBL_SHADOWS
                    #ifndef UNLIT
                        #ifdef REFLECTION
                            #ifdef COLORED_IBL_SHADOWS
                                vec3 shadowValue = computeIndirectShadow();
                                finalIrradiance.rgb *= shadowValue.rgb;
                                finalRadianceScaled *= mix(vec3(1.0), shadowValue.rgb, roughness);
                            #else
                                vec2 shadowValue = computeIndirectShadow();
                                finalIrradiance *= shadowValue.x;
                                finalRadianceScaled *= mix(pow(shadowValue.y, 4.0), shadowValue.x, roughness);
                            #endif
                        #endif
                    #else
                        finalDiffuse *= computeIndirectShadow().x;
                    #endif
                #endif
            `;
                    }
                    else if (this._isOpenPBRMaterial()) {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        frag["CUSTOM_FRAGMENT_BEFORE_IBLLAYERCOMPOSITION"] = `
                #ifdef RENDER_WITH_IBL_SHADOWS
                    #ifndef UNLIT
                        #ifdef REFLECTION
                            #ifdef COLORED_IBL_SHADOWS
                                vec3 shadowValue = computeIndirectShadow();
                                ambient_occlusion = min(ambient_occlusion, shadowValue);
                            #else
                                vec2 shadowValue = computeIndirectShadow();
                                ambient_occlusion = min(ambient_occlusion, vec3(shadowValue.x));
                                specular_ambient_occlusion = min(specular_ambient_occlusion, pow(shadowValue.y, 4.0));
                            #endif
                        #endif
                    #else
                        ambient_occlusion = min(ambient_occlusion, vec3(computeIndirectShadow().x));
                    #endif
                #endif
            `;
                    }
                    else {
                        frag["CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR"] = `
                #ifdef RENDER_WITH_IBL_SHADOWS
                    #ifdef COLORED_IBL_SHADOWS
                        vec3 shadowValue = computeIndirectShadow();
                        color.rgb *= toGammaSpace(shadowValue.rgb);
                    #else
                        vec2 shadowValue = computeIndirectShadow();
                        color.rgb *= toGammaSpace(shadowValue.x);
                    #endif
                #endif
            `;
                    }
                }
                return shaderType === "vertex" ? null : frag;
            }
        },
        _IBLShadowsPluginMaterial_isEnabled_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _shadowOpacity_decorators = [serialize()];
            _isEnabled_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __esDecorate(_a, null, _isEnabled_decorators, { kind: "accessor", name: "isEnabled", static: false, private: false, access: { has: obj => "isEnabled" in obj, get: obj => obj.isEnabled, set: (obj, value) => { obj.isEnabled = value; } }, metadata: _metadata }, _isEnabled_initializers, _isEnabled_extraInitializers);
            __esDecorate(null, null, _shadowOpacity_decorators, { kind: "field", name: "shadowOpacity", static: false, private: false, access: { has: obj => "shadowOpacity" in obj, get: obj => obj.shadowOpacity, set: (obj, value) => { obj.shadowOpacity = value; } }, metadata: _metadata }, _shadowOpacity_initializers, _shadowOpacity_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        /**
         * Defines the name of the plugin.
         */
        _a.Name = "IBLShadowsPluginMaterial",
        _a;
})();
export { IBLShadowsPluginMaterial };
let _Registered = false;
/**
 * Register side effects for iblShadowsPluginMaterial.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterIblShadowsPluginMaterial() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass(`BABYLON.IBLShadowsPluginMaterial`, IBLShadowsPluginMaterial);
}
//# sourceMappingURL=iblShadowsPluginMaterial.pure.js.map