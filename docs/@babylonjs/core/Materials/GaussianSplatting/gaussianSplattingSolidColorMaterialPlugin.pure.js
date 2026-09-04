/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { serialize } from "../../Misc/decorators.js";
import { MaterialPluginBase } from "../materialPluginBase.pure.js";
import { GetGaussianSplattingMaxPartCount } from "./gaussianSplattingMaterial.pure.js";
import { RegisterClass } from "../../Misc/typeStore.js";
/**
 * Plugin for GaussianSplattingMaterial that replaces per-splat colors with a
 * solid color per compound-mesh part. Each part index maps to a single Color3
 * value, which is looked up in a uniform array in the fragment shader.
 */
let GaussianSplattingSolidColorMaterialPlugin = (() => {
    var _a;
    let _classSuper = MaterialPluginBase;
    let _instanceExtraInitializers = [];
    let _get_isEnabled_decorators;
    return _a = class GaussianSplattingSolidColorMaterialPlugin extends _classSuper {
            /**
             * Whether the solid-color override is active. When false, splats
             * render with their original per-splat colors.
             * Toggled via a shader uniform so no recompilation is required.
             */
            get isEnabled() {
                return this._isEnabled;
            }
            set isEnabled(value) {
                if (this._isEnabled === value) {
                    return;
                }
                this._isEnabled = value;
                this._onIsEnabledChanged();
            }
            /** @internal */
            _onIsEnabledChanged() {
                // Intentional no-op: isEnabled is applied via a uniform in
                // bindForSubMesh, so no dirty-marking or recompilation is needed.
            }
            /**
             * Creates a new GaussianSplatSolidColorPlugin.
             * @param material The GaussianSplattingMaterial to attach the plugin to.
             * @param partColors A map from part index to the solid Color3 for that part.
             * @param maxPartCount The maximum number of parts supported. This determines the size of the uniform array.
             */
            constructor(material, partColors, maxPartCount) {
                super(material, "GaussianSplatSolidColor", 200);
                this._partColors = __runInitializers(this, _instanceExtraInitializers);
                this._isEnabled = true;
                this._partColorArray = [];
                this._partColors = partColors;
                this._maxPartCount = maxPartCount ?? GetGaussianSplattingMaxPartCount(material.getScene().getEngine());
                this._enable(true);
            }
            /**
             * Updates the part colors dynamically.
             * @param partColors A map from part index to the solid Color3 for that part.
             */
            updatePartColors(partColors) {
                this._partColors = partColors;
            }
            // --- Plugin overrides ---
            /**
             * @returns the class name
             */
            getClassName() {
                return "GaussianSplattingSolidColorMaterialPlugin";
            }
            /**
             * Indicates this plugin supports both GLSL and WGSL.
             * @param shaderLanguage the shader language to check
             * @returns true for GLSL and WGSL
             */
            isCompatible(shaderLanguage) {
                switch (shaderLanguage) {
                    case 0 /* ShaderLanguage.GLSL */:
                    case 1 /* ShaderLanguage.WGSL */:
                        return true;
                    default:
                        return false;
                }
            }
            /**
             * Always ready — no textures or async resources to wait on.
             * @param _defines the defines
             * @param _scene the scene
             * @param _engine the engine
             * @param _subMesh the submesh
             * @returns true
             */
            isReadyForSubMesh(_defines, _scene, _engine, _subMesh) {
                return true;
            }
            /**
             * Returns custom shader code fragments to inject solid-color rendering.
             *
             * @param shaderType "vertex" or "fragment"
             * @param shaderLanguage the shader language to use (default: GLSL)
             * @returns null or a map of injection point names to code strings
             */
            getCustomCode(shaderType, shaderLanguage = 0 /* ShaderLanguage.GLSL */) {
                const maxPartCount = this._maxPartCount;
                if (shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
                    return this._getCustomCodeWGSL(shaderType, maxPartCount);
                }
                return this._getCustomCodeGLSL(shaderType, maxPartCount);
            }
            _getCustomCodeGLSL(shaderType, maxPartCount) {
                if (shaderType === "vertex") {
                    return {
                        CUSTOM_VERTEX_DEFINITIONS: `varying float vPartIndex;`,
                        CUSTOM_VERTEX_UPDATE: `
#if IS_COMPOUND
    vPartIndex = float(splat.partIndex);
#else
    vPartIndex = 0.0;
#endif
                `,
                    };
                }
                else if (shaderType === "fragment") {
                    return {
                        CUSTOM_FRAGMENT_DEFINITIONS: `
varying float vPartIndex;
uniform float solidColorEnabled;
uniform vec3 partColors[${maxPartCount}];
                `,
                        CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR: `
if (solidColorEnabled > 0.5) {
    int partIdx = int(vPartIndex + 0.5);
    finalColor = vec4(partColors[partIdx], finalColor.w);
}
                `,
                    };
                }
                return null;
            }
            _getCustomCodeWGSL(shaderType, maxPartCount) {
                if (shaderType === "vertex") {
                    return {
                        CUSTOM_VERTEX_DEFINITIONS: `varying vPartIndex: f32;`,
                        CUSTOM_VERTEX_UPDATE: `
#if IS_COMPOUND
    vertexOutputs.vPartIndex = f32(splat.partIndex);
#else
    vertexOutputs.vPartIndex = 0.0;
#endif
                `,
                    };
                }
                else if (shaderType === "fragment") {
                    return {
                        CUSTOM_FRAGMENT_DEFINITIONS: `
varying vPartIndex: f32;
uniform solidColorEnabled: f32;
uniform partColors: array<vec3f, ${maxPartCount}>;
                `,
                        CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR: `
if (uniforms.solidColorEnabled > 0.5) {
    var partIdx: i32 = i32(fragmentInputs.vPartIndex + 0.5);
    finalColor = vec4f(uniforms.partColors[partIdx], finalColor.w);
}
                `,
                    };
                }
                return null;
            }
            /**
             * Registers the plugin uniforms with the engine so that
             * the Effect can resolve their locations.
             * @returns uniform descriptions
             */
            getUniforms() {
                return {
                    externalUniforms: ["partColors", "solidColorEnabled"],
                };
            }
            /**
             * Binds the plugin uniforms each frame.
             * @param _uniformBuffer the uniform buffer (unused — we bind directly on the effect)
             * @param _scene the current scene
             * @param _engine the current engine
             * @param subMesh the submesh being rendered
             */
            bindForSubMesh(_uniformBuffer, _scene, _engine, subMesh) {
                const effect = subMesh.effect;
                if (!effect) {
                    return;
                }
                effect.setFloat("solidColorEnabled", this._isEnabled ? 1.0 : 0.0);
                const colorArray = this._partColorArray;
                colorArray.length = 0;
                for (let i = 0; i < this._maxPartCount; i++) {
                    const color = this._partColors[i];
                    if (color) {
                        colorArray.push(color.r, color.g, color.b);
                    }
                    else {
                        colorArray.push(0, 0, 0);
                    }
                }
                effect.setArray3("partColors", colorArray);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_isEnabled_decorators = [serialize()];
            __esDecorate(_a, null, _get_isEnabled_decorators, { kind: "getter", name: "isEnabled", static: false, private: false, access: { has: obj => "isEnabled" in obj, get: obj => obj.isEnabled }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { GaussianSplattingSolidColorMaterialPlugin };
let _Registered = false;
/**
 * Register side effects for gaussianSplattingSolidColorMaterialPlugin.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterGaussianSplattingSolidColorMaterialPlugin() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.GaussianSplattingSolidColorMaterialPlugin", GaussianSplattingSolidColorMaterialPlugin);
}
//# sourceMappingURL=gaussianSplattingSolidColorMaterialPlugin.pure.js.map