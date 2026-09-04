/** This file must only contain pure code and pure imports */
import { __classPrivateFieldGet, __classPrivateFieldSet, __esDecorate, __runInitializers } from "../tslib.es6.js";
/* eslint-disable @typescript-eslint/naming-convention */
import { MaterialPluginBase } from "./materialPluginBase.pure.js";
import { MaterialDefines } from "./materialDefines.js";
import { Color3 } from "../Maths/math.js";
import { Logger } from "../Misc/logger.js";
import { expandToProperty, serialize, serializeAsColor3 } from "../Misc/decorators.js";
import { RegisterClass } from "../Misc/typeStore.js";
const vertexDefinitions = `#if defined(DBG_ENABLED)
attribute float dbg_initialPass;
varying vec3 dbg_vBarycentric;
flat varying vec3 dbg_vVertexWorldPos;
flat varying float dbg_vPass;
#endif`;
const vertexDefinitionsWebGPU = `#if defined(DBG_ENABLED)
attribute dbg_initialPass: f32;
varying dbg_vBarycentric: vec3f;
flat varying dbg_vVertexWorldPos: vec3f;
flat varying dbg_vPass: f32;
#endif`;
const vertexMainEnd = `#if defined(DBG_ENABLED)
float dbg_vertexIndex = mod(float(gl_VertexID), 3.);
if (dbg_vertexIndex == 0.0) { 
    dbg_vBarycentric = vec3(1.,0.,0.); 
}
else if (dbg_vertexIndex == 1.0) { 
    dbg_vBarycentric = vec3(0.,1.,0.); 
}
else { 
    dbg_vBarycentric = vec3(0.,0.,1.); 
}

dbg_vVertexWorldPos = vPositionW;
dbg_vPass = dbg_initialPass;
#endif`;
const vertexMainEndWebGPU = `#if defined(DBG_ENABLED)
var dbg_vertexIndex = f32(input.vertexIndex) % 3.;
if (dbg_vertexIndex == 0.0) { 
    vertexOutputs.dbg_vBarycentric = vec3f(1.,0.,0.); 
}
else if (dbg_vertexIndex == 1.0) { 
    vertexOutputs.dbg_vBarycentric = vec3f(0.,1.,0.); 
}
else { 
    vertexOutputs.dbg_vBarycentric = vec3f(0.,0.,1.); 
}

vertexOutputs.dbg_vVertexWorldPos = vertexOutputs.vPositionW;
vertexOutputs.dbg_vPass = input.dbg_initialPass;
#endif`;
const fragmentUniforms = `#if defined(DBG_ENABLED)
uniform vec3 dbg_shadedDiffuseColor;
uniform vec4 dbg_shadedSpecularColorPower;
uniform vec3 dbg_thicknessRadiusScale;

#if DBG_MODE == 2 || DBG_MODE == 3
    uniform vec3 dbg_vertexColor;
#endif

#if DBG_MODE == 1
    uniform vec3 dbg_wireframeTrianglesColor;
#elif DBG_MODE == 3
    uniform vec3 dbg_wireframeVerticesColor;
#elif DBG_MODE == 4 || DBG_MODE == 5
    uniform vec3 dbg_uvPrimaryColor;
    uniform vec3 dbg_uvSecondaryColor;
#elif DBG_MODE == 7
    uniform vec3 dbg_materialColor;
#endif
#endif`;
const fragmentUniformsWebGPU = `#if defined(DBG_ENABLED)
uniform dbg_shadedDiffuseColor: vec3f;
uniform dbg_shadedSpecularColorPower: vec4f;
uniform dbg_thicknessRadiusScale: vec3f;

#if DBG_MODE == 2 || DBG_MODE == 3
    uniform dbg_vertexColor: vec3f;
#endif

#if DBG_MODE == 1
    uniform dbg_wireframeTrianglesColor: vec3f;
#elif DBG_MODE == 3
    uniform  dbg_wireframeVerticesColor: vec3f;
#elif DBG_MODE == 4 || DBG_MODE == 5
    uniform dbg_uvPrimaryColor: vec3f;
    uniform dbg_uvSecondaryColor: vec3f;
#elif DBG_MODE == 7
    uniform dbg_materialColor: vec3f;
#endif
#endif`;
const fragmentDefinitions = `#if defined(DBG_ENABLED)
varying vec3 dbg_vBarycentric;
flat varying vec3 dbg_vVertexWorldPos;
flat varying float dbg_vPass;

#if !defined(DBG_MULTIPLY)
    vec3 dbg_applyShading(vec3 color) {
        vec3 N = vNormalW.xyz;
        vec3 L = normalize(vEyePosition.xyz - vPositionW.xyz);
        vec3 H = normalize(L + L);
        float LdotN = clamp(dot(L,N), 0., 1.);
        float HdotN = clamp(dot(H,N), 0., 1.);
        float specTerm = pow(HdotN, dbg_shadedSpecularColorPower.w);
        color *= (LdotN / PI);
        color += dbg_shadedSpecularColorPower.rgb * (specTerm / PI);
        return color;
    }
#endif

#if DBG_MODE == 1 || DBG_MODE == 3
    float dbg_edgeFactor() {
        vec3 d = fwidth(dbg_vBarycentric);
        vec3 a3 = smoothstep(vec3(0.), d * dbg_thicknessRadiusScale.x, dbg_vBarycentric);
        return min(min(a3.x, a3.y), a3.z);
    }
#endif

#if DBG_MODE == 2 || DBG_MODE == 3
    float dbg_cornerFactor() {
        vec3 worldPos = vPositionW;
        float dist = length(worldPos - dbg_vVertexWorldPos);
        float camDist = length(worldPos - vEyePosition.xyz);
        float d = sqrt(camDist) * .001;
        return smoothstep((dbg_thicknessRadiusScale.y * d), ((dbg_thicknessRadiusScale.y * 1.01) * d), dist);
    }
#endif

#if (DBG_MODE == 4 && defined(UV1)) || (DBG_MODE == 5 && defined(UV2))
    float dbg_checkerboardFactor(vec2 uv) {
        vec2 f = fract(uv * dbg_thicknessRadiusScale.z);
        f -= .5;
        return (f.x * f.y) > 0. ? 1. : 0.;
    }
#endif
#endif`;
const fragmentDefinitionsWebGPU = `#if defined(DBG_ENABLED)
varying dbg_vBarycentric: vec3f;
flat varying dbg_vVertexWorldPos: vec3f;
flat varying dbg_vPass: f32;

#if !defined(DBG_MULTIPLY)
    fn dbg_applyShading(color: vec3f) -> vec3f {
        var N = fragmentInputs.vNormalW.xyz;
        var L = normalize(scene.vEyePosition.xyz - fragmentInputs.vPositionW.xyz);
        var H = normalize(L + L);
        var LdotN = clamp(dot(L,N), 0., 1.);
        var HdotN = clamp(dot(H,N), 0., 1.);
        var specTerm = pow(HdotN, uniforms.dbg_shadedSpecularColorPower.w);
        var result = color * (LdotN / PI);
        result += uniforms.dbg_shadedSpecularColorPower.rgb * (specTerm / PI);
        return result;
    }
#endif

#if DBG_MODE == 1 || DBG_MODE == 3
    fn dbg_edgeFactor() -> f32 {
        var d = fwidth(fragmentInputs.dbg_vBarycentric);
        var a3 = smoothstep(vec3f(0.), d * uniforms.dbg_thicknessRadiusScale.x, fragmentInputs.dbg_vBarycentric);
        return min(min(a3.x, a3.y), a3.z);
    }
#endif

#if DBG_MODE == 2 || DBG_MODE == 3
    fn dbg_cornerFactor() -> f32 {
        let worldPos = fragmentInputs.vPositionW;
        let dist = length(worldPos - fragmentInputs.dbg_vVertexWorldPos);
        let camDist = length(worldPos - scene.vEyePosition.xyz);
        let d = sqrt(camDist) * .001;
        return smoothstep((uniforms.dbg_thicknessRadiusScale.y * d), ((uniforms.dbg_thicknessRadiusScale.y * 1.01) * d), dist);
    }
#endif

#if (DBG_MODE == 4 && defined(UV1)) || (DBG_MODE == 5 && defined(UV2))
    fn dbg_checkerboardFactor(uv: vec2f) -> f32 {
        var f = fract(uv * uniforms.dbg_thicknessRadiusScale.z);
        f -= .5;
        return select(0.0, 1.0, (f.x * f.y) > 0.0);
    }
#endif
#endif`;
const fragmentMainEnd = `#if defined(DBG_ENABLED)
vec3 dbg_color = vec3(1.);
#if DBG_MODE == 1
    dbg_color = mix(dbg_wireframeTrianglesColor, vec3(1.), dbg_edgeFactor());
#elif DBG_MODE == 2 || DBG_MODE == 3
    float dbg_cornerFactor = dbg_cornerFactor();
    if (dbg_vPass == 0. && dbg_cornerFactor == 1.) discard;
    dbg_color = mix(dbg_vertexColor, vec3(1.), dbg_cornerFactor);
    #if DBG_MODE == 3
        dbg_color *= mix(dbg_wireframeVerticesColor, vec3(1.), dbg_edgeFactor());
    #endif
#elif DBG_MODE == 4 && defined(MAINUV1)
    dbg_color = mix(dbg_uvPrimaryColor, dbg_uvSecondaryColor, dbg_checkerboardFactor(vMainUV1));
#elif DBG_MODE == 5 && defined(MAINUV2)
    dbg_color = mix(dbg_uvPrimaryColor, dbg_uvSecondaryColor, dbg_checkerboardFactor(vMainUV2));
#elif DBG_MODE == 6 && defined(VERTEXCOLOR)
    dbg_color = vColor.rgb;
#elif DBG_MODE == 7
    dbg_color = dbg_materialColor;
#endif

#if defined(DBG_MULTIPLY)
    gl_FragColor *= vec4(dbg_color, 1.);
#else
    #if DBG_MODE != 6
        gl_FragColor = vec4(dbg_applyShading(dbg_shadedDiffuseColor) * dbg_color, 1.);
    #else
        gl_FragColor = vec4(dbg_color, 1.);
    #endif
#endif
#endif`;
const fragmentMainEndWebGPU = `#if defined(DBG_ENABLED)
var dbg_color = vec3f(1.);
#if DBG_MODE == 1
    dbg_color = mix(uniforms.dbg_wireframeTrianglesColor, vec3f(1.), dbg_edgeFactor());
#elif DBG_MODE == 2 || DBG_MODE == 3
    let dbg_cornerFactor = dbg_cornerFactor();
    if (fragmentInputs.dbg_vPass == 0.0 && dbg_cornerFactor == 1.0) {
        discard;
    }
    dbg_color = mix(uniforms.dbg_vertexColor, vec3f(1.), dbg_cornerFactor);
    #if DBG_MODE == 3
        dbg_color *= mix(uniforms.dbg_wireframeVerticesColor, vec3f(1.), dbg_edgeFactor());
    #endif
#elif DBG_MODE == 4 && defined(MAINUV1)
    dbg_color = mix(uniforms.dbg_uvPrimaryColor, uniforms.dbg_uvSecondaryColor, dbg_checkerboardFactor(fragmentInputs.vMainUV1));
#elif DBG_MODE == 5 && defined(MAINUV2)
    dbg_color = mix(uniforms.dbg_uvPrimaryColor, uniforms.dbg_uvSecondaryColor, dbg_checkerboardFactor(fragmentInputs.vMainUV2));
#elif DBG_MODE == 6 && defined(VERTEXCOLOR)
    dbg_color = fragmentInputs.vColor.rgb;
#elif DBG_MODE == 7
    dbg_color = uniforms.dbg_materialColor;
#endif

#if defined(DBG_MULTIPLY)
    fragmentOutputs.color *= vec4f(dbg_color, 1.);
#else
    #if DBG_MODE != 6
        fragmentOutputs.color = vec4f(dbg_applyShading(uniforms.dbg_shadedDiffuseColor) * dbg_color, 1.);
    #else
        fragmentOutputs.color = vec4f(dbg_color, 1.);
    #endif
#endif
#endif`;
const defaultMaterialColors = [
    new Color3(0.98, 0.26, 0.38),
    new Color3(0.47, 0.75, 0.3),
    new Color3(0, 0.26, 0.77),
    new Color3(0.97, 0.6, 0.76),
    new Color3(0.19, 0.63, 0.78),
    new Color3(0.98, 0.8, 0.6),
    new Color3(0.65, 0.43, 0.15),
    new Color3(0.15, 0.47, 0.22),
    new Color3(0.67, 0.71, 0.86),
    new Color3(0.09, 0.46, 0.56),
    new Color3(0.8, 0.98, 0.02),
    new Color3(0.39, 0.29, 0.13),
    new Color3(0.53, 0.63, 0.06),
    new Color3(0.95, 0.96, 0.41),
    new Color3(1, 0.72, 0.94),
    new Color3(0.63, 0.08, 0.31),
    new Color3(0.66, 0.96, 0.95),
    new Color3(0.22, 0.14, 0.19),
    new Color3(0.14, 0.65, 0.59),
    new Color3(0.93, 1, 0.68),
    new Color3(0.93, 0.14, 0.44),
    new Color3(0.47, 0.86, 0.67),
    new Color3(0.85, 0.07, 0.78),
    new Color3(0.53, 0.64, 0.98),
    new Color3(0.43, 0.37, 0.56),
    new Color3(0.71, 0.65, 0.25),
    new Color3(0.66, 0.19, 0.01),
    new Color3(0.94, 0.53, 0.12),
    new Color3(0.41, 0.44, 0.44),
    new Color3(0.24, 0.71, 0.96),
    new Color3(0.57, 0.28, 0.56),
    new Color3(0.44, 0.98, 0.42),
];
/**
 * Supported visualizations of MeshDebugPluginMaterial
 */
export var MeshDebugMode;
(function (MeshDebugMode) {
    /**
     * Material without any mesh debug visualization
     */
    MeshDebugMode[MeshDebugMode["NONE"] = 0] = "NONE";
    /**
     * A wireframe of the mesh
     * NOTE: For this mode to work correctly, convertToUnIndexedMesh() or MeshDebugPluginMaterial.PrepareMeshForTrianglesAndVerticesMode() must first be called on mesh.
     */
    MeshDebugMode[MeshDebugMode["TRIANGLES"] = 1] = "TRIANGLES";
    /**
     * Points drawn over vertices of mesh
     * NOTE: For this mode to work correctly, MeshDebugPluginMaterial.PrepareMeshForTrianglesAndVerticesMode() must first be called on mesh.
     */
    MeshDebugMode[MeshDebugMode["VERTICES"] = 2] = "VERTICES";
    /**
     * A wireframe of the mesh, with points drawn over vertices
     * NOTE: For this mode to work correctly, MeshDebugPluginMaterial.PrepareMeshForTrianglesAndVerticesMode() must first be called on mesh.
     */
    MeshDebugMode[MeshDebugMode["TRIANGLES_VERTICES"] = 3] = "TRIANGLES_VERTICES";
    /**
     * A checkerboard grid of the mesh's UV set 0
     */
    MeshDebugMode[MeshDebugMode["UV0"] = 4] = "UV0";
    /**
     * A checkerboard grid of the mesh's UV set 1
     */
    MeshDebugMode[MeshDebugMode["UV1"] = 5] = "UV1";
    /**
     * The mesh's vertex colors displayed as the primary texture
     */
    MeshDebugMode[MeshDebugMode["VERTEXCOLORS"] = 6] = "VERTEXCOLORS";
    /**
     * An arbitrary, distinguishable color to identify the material
     */
    MeshDebugMode[MeshDebugMode["MATERIALIDS"] = 7] = "MATERIALIDS";
})(MeshDebugMode || (MeshDebugMode = {}));
/** @internal */
class MeshDebugDefines extends MaterialDefines {
    constructor() {
        super(...arguments);
        /**
         * Current mesh debug visualization.
         * Defaults to NONE.
         */
        this.DBG_MODE = 0 /* MeshDebugMode.NONE */;
        /**
         * Whether the mesh debug visualization multiplies with colors underneath.
         * Defaults to true.
         */
        this.DBG_MULTIPLY = true;
        /**
         * Whether the mesh debug plugin is enabled in the material.
         * Defaults to true.
         */
        this.DBG_ENABLED = true;
    }
}
/**
 * Plugin that implements various mesh debug visualizations,
 * List of available visualizations can be found in MeshDebugMode enum.
 */
let MeshDebugPluginMaterial = (() => {
    var _a, _MeshDebugPluginMaterial_mode_accessor_storage, _MeshDebugPluginMaterial_multiply_accessor_storage;
    let _classSuper = MaterialPluginBase;
    let __materialColor_decorators;
    let __materialColor_initializers = [];
    let __materialColor_extraInitializers = [];
    let __isEnabled_decorators;
    let __isEnabled_initializers = [];
    let __isEnabled_extraInitializers = [];
    let _mode_decorators;
    let _mode_initializers = [];
    let _mode_extraInitializers = [];
    let _multiply_decorators;
    let _multiply_initializers = [];
    let _multiply_extraInitializers = [];
    let _shadedDiffuseColor_decorators;
    let _shadedDiffuseColor_initializers = [];
    let _shadedDiffuseColor_extraInitializers = [];
    let _shadedSpecularColor_decorators;
    let _shadedSpecularColor_initializers = [];
    let _shadedSpecularColor_extraInitializers = [];
    let _shadedSpecularPower_decorators;
    let _shadedSpecularPower_initializers = [];
    let _shadedSpecularPower_extraInitializers = [];
    let _wireframeThickness_decorators;
    let _wireframeThickness_initializers = [];
    let _wireframeThickness_extraInitializers = [];
    let _wireframeTrianglesColor_decorators;
    let _wireframeTrianglesColor_initializers = [];
    let _wireframeTrianglesColor_extraInitializers = [];
    let _wireframeVerticesColor_decorators;
    let _wireframeVerticesColor_initializers = [];
    let _wireframeVerticesColor_extraInitializers = [];
    let _vertexColor_decorators;
    let _vertexColor_initializers = [];
    let _vertexColor_extraInitializers = [];
    let _vertexRadius_decorators;
    let _vertexRadius_initializers = [];
    let _vertexRadius_extraInitializers = [];
    let _uvScale_decorators;
    let _uvScale_initializers = [];
    let _uvScale_extraInitializers = [];
    let _uvPrimaryColor_decorators;
    let _uvPrimaryColor_initializers = [];
    let _uvPrimaryColor_extraInitializers = [];
    let _uvSecondaryColor_decorators;
    let _uvSecondaryColor_initializers = [];
    let _uvSecondaryColor_extraInitializers = [];
    return _a = class MeshDebugPluginMaterial extends _classSuper {
            /**
             * The mesh debug visualization.
             * Defaults to NONE.
             */
            get mode() { return __classPrivateFieldGet(this, _MeshDebugPluginMaterial_mode_accessor_storage, "f"); }
            set mode(value) { __classPrivateFieldSet(this, _MeshDebugPluginMaterial_mode_accessor_storage, value, "f"); }
            /**
             * Whether the mesh debug visualization should multiply with color underneath.
             * Defaults to true.
             */
            get multiply() { return __classPrivateFieldGet(this, _MeshDebugPluginMaterial_multiply_accessor_storage, "f"); }
            set multiply(value) { __classPrivateFieldSet(this, _MeshDebugPluginMaterial_multiply_accessor_storage, value, "f"); }
            /** @internal */
            _markAllDefinesAsDirty() {
                this._enable(this._isEnabled);
                this.markAllDefinesAsDirty();
            }
            /**
             * Gets a boolean indicating that the plugin is compatible with a given shader language.
             * @param shaderLanguage The shader language to use.
             * @returns true if the plugin is compatible with the shader language
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
             * Creates a new MeshDebugPluginMaterial
             * @param material Material to attach the mesh debug plugin to
             * @param options Options for the mesh debug plugin
             */
            constructor(material, options = {}) {
                const defines = new MeshDebugDefines();
                defines.DBG_MODE = options.mode ?? defines.DBG_MODE;
                defines.DBG_MULTIPLY = options.multiply ?? defines.DBG_MULTIPLY;
                super(material, "MeshDebug", 200, defines, true, true);
                /**
                 * Material ID color of this plugin instance.
                 * Taken from index `_PluginCount` of `MaterialColors` at time of instantiation.
                 */
                this._materialColor = __runInitializers(this, __materialColor_initializers, void 0);
                /**
                 * Whether the mesh debug plugin is enabled in the material.
                 * Defaults to true in constructor.
                 */
                this._isEnabled = (__runInitializers(this, __materialColor_extraInitializers), __runInitializers(this, __isEnabled_initializers, void 0));
                this._mode = __runInitializers(this, __isEnabled_extraInitializers);
                _MeshDebugPluginMaterial_mode_accessor_storage.set(this, __runInitializers(this, _mode_initializers, void 0));
                this._multiply = __runInitializers(this, _mode_extraInitializers);
                _MeshDebugPluginMaterial_multiply_accessor_storage.set(this, __runInitializers(this, _multiply_initializers, void 0));
                /**
                 * Diffuse color used to shade the mesh.
                 * Defaults to (1.0, 1.0, 1.0).
                 */
                this.shadedDiffuseColor = (__runInitializers(this, _multiply_extraInitializers), __runInitializers(this, _shadedDiffuseColor_initializers, void 0));
                /**
                 * Specular color used to shade the mesh.
                 * Defaults to (0.8, 0.8, 0.8).
                 */
                this.shadedSpecularColor = (__runInitializers(this, _shadedDiffuseColor_extraInitializers), __runInitializers(this, _shadedSpecularColor_initializers, void 0));
                /**
                 * Specular power used to shade the mesh.
                 * Defaults to 10.
                 */
                this.shadedSpecularPower = (__runInitializers(this, _shadedSpecularColor_extraInitializers), __runInitializers(this, _shadedSpecularPower_initializers, void 0));
                /**
                 * Width of edge lines in TRIANGLES and TRIANGLE_VERTICES modes.
                 * Defaults to 0.7.
                 */
                this.wireframeThickness = (__runInitializers(this, _shadedSpecularPower_extraInitializers), __runInitializers(this, _wireframeThickness_initializers, void 0));
                /**
                 * Color of edge lines in TRIANGLES mode.
                 * Defaults to (0.0, 0.0, 0.0).
                 */
                this.wireframeTrianglesColor = (__runInitializers(this, _wireframeThickness_extraInitializers), __runInitializers(this, _wireframeTrianglesColor_initializers, void 0));
                /**
                 * Color of edge lines in TRIANGLES_VERTICES modes.
                 * Defaults to (0.8, 0.8, 0.8).
                 */
                this.wireframeVerticesColor = (__runInitializers(this, _wireframeTrianglesColor_extraInitializers), __runInitializers(this, _wireframeVerticesColor_initializers, void 0));
                /**
                 * Color of vertices in TRIANGLES_VERTICES and VERTICES mode.
                 * Defaults to (0.0, 0.0, 0.0).
                 */
                this.vertexColor = (__runInitializers(this, _wireframeVerticesColor_extraInitializers), __runInitializers(this, _vertexColor_initializers, void 0));
                /**
                 * Radius of dots drawn over vertices in TRIANGLE_VERTICES and VERTICES mode.
                 * Defaults to 1.2.
                 */
                this.vertexRadius = (__runInitializers(this, _vertexColor_extraInitializers), __runInitializers(this, _vertexRadius_initializers, void 0));
                /**
                 * Size of tiles in UV1 or UV2 modes.
                 * Defaults to 20.
                 */
                this.uvScale = (__runInitializers(this, _vertexRadius_extraInitializers), __runInitializers(this, _uvScale_initializers, void 0));
                /**
                 * 1st color of checkerboard grid in UV1 or UV2 modes.
                 * Defaults to (1.0, 1.0, 1.0).
                 */
                this.uvPrimaryColor = (__runInitializers(this, _uvScale_extraInitializers), __runInitializers(this, _uvPrimaryColor_initializers, void 0));
                /**
                 * 2nd color of checkerboard grid in UV1 or UV2 modes.
                 * Defaults to (0.5, 0.5, 0.5).
                 */
                this.uvSecondaryColor = (__runInitializers(this, _uvPrimaryColor_extraInitializers), __runInitializers(this, _uvSecondaryColor_initializers, void 0));
                __runInitializers(this, _uvSecondaryColor_extraInitializers);
                this._mode = defines.DBG_MODE;
                this._multiply = defines.DBG_MULTIPLY;
                this.shadedDiffuseColor = options.shadedDiffuseColor ?? new Color3(1, 1, 1);
                this.shadedSpecularColor = options.shadedSpecularColor ?? new Color3(0.8, 0.8, 0.8);
                this.shadedSpecularPower = options.shadedSpecularPower ?? 10;
                this.wireframeThickness = options.wireframeThickness ?? 0.7;
                this.wireframeTrianglesColor = options.wireframeTrianglesColor ?? new Color3(0, 0, 0);
                this.wireframeVerticesColor = options.wireframeVerticesColor ?? new Color3(0.8, 0.8, 0.8);
                this.vertexColor = options.vertexColor ?? new Color3(0, 0, 0);
                this.vertexRadius = options.vertexRadius ?? 1.2;
                this.uvScale = options.uvScale ?? 20;
                this.uvPrimaryColor = options.uvPrimaryColor ?? new Color3(1, 1, 1);
                this.uvSecondaryColor = options.uvSecondaryColor ?? new Color3(0.5, 0.5, 0.5);
                this._materialColor = _a.MaterialColors[_a._PluginCount++ % _a.MaterialColors.length];
                this.isEnabled = true;
            }
            /**
             * Get the class name
             * @returns Class name
             */
            getClassName() {
                return "MeshDebugPluginMaterial";
            }
            /**
             * Gets whether the mesh debug plugin is enabled in the material.
             */
            get isEnabled() {
                return this._isEnabled;
            }
            /**
             * Sets whether the mesh debug plugin is enabled in the material.
             * @param value enabled
             */
            set isEnabled(value) {
                if (this._isEnabled === value) {
                    return;
                }
                if (!this._material.getScene().getEngine().isWebGPU && this._material.getScene().getEngine().version == 1) {
                    Logger.Error("MeshDebugPluginMaterial is not supported on WebGL 1.0.");
                    this._isEnabled = false;
                    return;
                }
                this._isEnabled = value;
                this._markAllDefinesAsDirty();
            }
            /**
             * Prepare the defines
             * @param defines Mesh debug defines
             * @param scene Scene
             * @param mesh Mesh associated with material
             */
            prepareDefines(defines, scene, mesh) {
                if ((this._mode == 2 /* MeshDebugMode.VERTICES */ || this._mode == 1 /* MeshDebugMode.TRIANGLES */ || this._mode == 3 /* MeshDebugMode.TRIANGLES_VERTICES */) &&
                    !mesh.isVerticesDataPresent("dbg_initialPass")) {
                    Logger.Warn("For best results with TRIANGLES, TRIANGLES_VERTICES, or VERTICES modes, please use MeshDebugPluginMaterial.PrepareMeshForTrianglesAndVerticesMode() on mesh.", 1);
                }
                defines.DBG_MODE = this._mode;
                defines.DBG_MULTIPLY = this._multiply;
                defines.DBG_ENABLED = this._isEnabled;
            }
            /**
             * Get the shader attributes
             * @param attributes Array of attributes
             */
            getAttributes(attributes) {
                attributes.push("dbg_initialPass");
            }
            /**
             * Get the shader uniforms
             * @param shaderLanguage The shader language to use.
             * @returns Uniforms
             */
            getUniforms(shaderLanguage = 0 /* ShaderLanguage.GLSL */) {
                return {
                    ubo: [
                        { name: "dbg_shadedDiffuseColor", size: 3, type: "vec3" },
                        { name: "dbg_shadedSpecularColorPower", size: 4, type: "vec4" }, // shadedSpecularColor, shadedSpecularPower
                        { name: "dbg_thicknessRadiusScale", size: 3, type: "vec3" }, // wireframeThickness, vertexRadius, uvScale
                        { name: "dbg_wireframeTrianglesColor", size: 3, type: "vec3" },
                        { name: "dbg_wireframeVerticesColor", size: 3, type: "vec3" },
                        { name: "dbg_vertexColor", size: 3, type: "vec3" },
                        { name: "dbg_uvPrimaryColor", size: 3, type: "vec3" },
                        { name: "dbg_uvSecondaryColor", size: 3, type: "vec3" },
                        { name: "dbg_materialColor", size: 3, type: "vec3" },
                    ],
                    fragment: shaderLanguage === 0 /* ShaderLanguage.GLSL */ ? fragmentUniforms : fragmentUniformsWebGPU,
                };
            }
            /**
             * Bind the uniform buffer
             * @param uniformBuffer Uniform buffer
             */
            bindForSubMesh(uniformBuffer) {
                if (!this._isEnabled) {
                    return;
                }
                uniformBuffer.updateFloat3("dbg_shadedDiffuseColor", this.shadedDiffuseColor.r, this.shadedDiffuseColor.g, this.shadedDiffuseColor.b);
                uniformBuffer.updateFloat4("dbg_shadedSpecularColorPower", this.shadedSpecularColor.r, this.shadedSpecularColor.g, this.shadedSpecularColor.b, this.shadedSpecularPower);
                uniformBuffer.updateFloat3("dbg_thicknessRadiusScale", this.wireframeThickness, this.vertexRadius, this.uvScale);
                uniformBuffer.updateColor3("dbg_wireframeTrianglesColor", this.wireframeTrianglesColor);
                uniformBuffer.updateColor3("dbg_wireframeVerticesColor", this.wireframeVerticesColor);
                uniformBuffer.updateColor3("dbg_vertexColor", this.vertexColor);
                uniformBuffer.updateColor3("dbg_uvPrimaryColor", this.uvPrimaryColor);
                uniformBuffer.updateColor3("dbg_uvSecondaryColor", this.uvSecondaryColor);
                uniformBuffer.updateColor3("dbg_materialColor", this._materialColor);
            }
            /**
             * Get shader code
             * @param shaderType "vertex" or "fragment"
             * @param shaderLanguage The shader language to use.
             * @returns Shader code
             */
            getCustomCode(shaderType, shaderLanguage = 0 /* ShaderLanguage.GLSL */) {
                if (shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
                    return shaderType === "vertex"
                        ? {
                            CUSTOM_VERTEX_DEFINITIONS: vertexDefinitionsWebGPU,
                            CUSTOM_VERTEX_MAIN_END: vertexMainEndWebGPU,
                        }
                        : {
                            CUSTOM_FRAGMENT_DEFINITIONS: fragmentDefinitionsWebGPU,
                            CUSTOM_FRAGMENT_MAIN_END: fragmentMainEndWebGPU,
                        };
                }
                return shaderType === "vertex"
                    ? {
                        CUSTOM_VERTEX_DEFINITIONS: vertexDefinitions,
                        CUSTOM_VERTEX_MAIN_END: vertexMainEnd,
                    }
                    : {
                        CUSTOM_FRAGMENT_DEFINITIONS: fragmentDefinitions,
                        CUSTOM_FRAGMENT_MAIN_END: fragmentMainEnd,
                    };
            }
            /**
             * Resets static variables of the plugin to their original state
             */
            static Reset() {
                this._PluginCount = 0;
                this.MaterialColors = defaultMaterialColors;
            }
            /**
             * Renders triangles in a mesh 3 times by tripling the indices in the index buffer.
             * Used to prepare a mesh to be rendered in `TRIANGLES`, `VERTICES`, or `TRIANGLES_VERTICES` modes.
             * NOTE: This is a destructive operation. The mesh's index buffer and vertex buffers are modified, and a new vertex buffer is allocated.
             * If you'd like the ability to revert these changes, toggle the optional `returnRollback` flag.
             * @param mesh the mesh to target
             * @param returnRollback whether or not to return a function that reverts mesh to its initial state. Default: false.
             * @returns a rollback function if `returnRollback` is true, otherwise an empty function.
             */
            static PrepareMeshForTrianglesAndVerticesMode(mesh, returnRollback = false) {
                let rollback = () => { };
                if (mesh.getTotalIndices() == 0) {
                    return rollback;
                }
                if (returnRollback) {
                    const kinds = mesh.getVerticesDataKinds();
                    const indices = mesh.getIndices();
                    const data = {};
                    for (const kind of kinds) {
                        data[kind] = mesh.getVerticesData(kind);
                    }
                    rollback = function () {
                        mesh.setIndices(indices);
                        for (const kind of kinds) {
                            const stride = mesh.getVertexBuffer(kind).getStrideSize();
                            mesh.setVerticesData(kind, data[kind], undefined, stride);
                        }
                        mesh.removeVerticesData("dbg_initialPass");
                    };
                }
                let indices = Array.from(mesh.getIndices());
                const newIndices1 = [];
                for (let i = 0; i < indices.length; i += 3) {
                    newIndices1.push(indices[i + 1], indices[i + 2], indices[i + 0]);
                }
                mesh.setIndices(indices.concat(newIndices1));
                mesh.convertToUnIndexedMesh();
                mesh.isUnIndexed = false;
                indices = Array.from(mesh.getIndices());
                const newIndices2 = [];
                for (let i = indices.length / 2; i < indices.length; i += 3) {
                    newIndices2.push(indices[i + 1], indices[i + 2], indices[i + 0]);
                }
                mesh.setIndices(indices.concat(newIndices2));
                const num = mesh.getTotalVertices();
                const mid = num / 2;
                const pass = new Array(num).fill(1, 0, mid).fill(0, mid, num);
                mesh.setVerticesData("dbg_initialPass", pass, false, 1);
                return rollback;
            }
        },
        _MeshDebugPluginMaterial_mode_accessor_storage = new WeakMap(),
        _MeshDebugPluginMaterial_multiply_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __materialColor_decorators = [serializeAsColor3()];
            __isEnabled_decorators = [serialize()];
            _mode_decorators = [serialize(), expandToProperty("_markAllDefinesAsDirty")];
            _multiply_decorators = [serialize(), expandToProperty("_markAllDefinesAsDirty")];
            _shadedDiffuseColor_decorators = [serializeAsColor3()];
            _shadedSpecularColor_decorators = [serializeAsColor3()];
            _shadedSpecularPower_decorators = [serialize()];
            _wireframeThickness_decorators = [serialize()];
            _wireframeTrianglesColor_decorators = [serializeAsColor3()];
            _wireframeVerticesColor_decorators = [serializeAsColor3()];
            _vertexColor_decorators = [serializeAsColor3()];
            _vertexRadius_decorators = [serialize()];
            _uvScale_decorators = [serialize()];
            _uvPrimaryColor_decorators = [serializeAsColor3()];
            _uvSecondaryColor_decorators = [serializeAsColor3()];
            __esDecorate(_a, null, _mode_decorators, { kind: "accessor", name: "mode", static: false, private: false, access: { has: obj => "mode" in obj, get: obj => obj.mode, set: (obj, value) => { obj.mode = value; } }, metadata: _metadata }, _mode_initializers, _mode_extraInitializers);
            __esDecorate(_a, null, _multiply_decorators, { kind: "accessor", name: "multiply", static: false, private: false, access: { has: obj => "multiply" in obj, get: obj => obj.multiply, set: (obj, value) => { obj.multiply = value; } }, metadata: _metadata }, _multiply_initializers, _multiply_extraInitializers);
            __esDecorate(null, null, __materialColor_decorators, { kind: "field", name: "_materialColor", static: false, private: false, access: { has: obj => "_materialColor" in obj, get: obj => obj._materialColor, set: (obj, value) => { obj._materialColor = value; } }, metadata: _metadata }, __materialColor_initializers, __materialColor_extraInitializers);
            __esDecorate(null, null, __isEnabled_decorators, { kind: "field", name: "_isEnabled", static: false, private: false, access: { has: obj => "_isEnabled" in obj, get: obj => obj._isEnabled, set: (obj, value) => { obj._isEnabled = value; } }, metadata: _metadata }, __isEnabled_initializers, __isEnabled_extraInitializers);
            __esDecorate(null, null, _shadedDiffuseColor_decorators, { kind: "field", name: "shadedDiffuseColor", static: false, private: false, access: { has: obj => "shadedDiffuseColor" in obj, get: obj => obj.shadedDiffuseColor, set: (obj, value) => { obj.shadedDiffuseColor = value; } }, metadata: _metadata }, _shadedDiffuseColor_initializers, _shadedDiffuseColor_extraInitializers);
            __esDecorate(null, null, _shadedSpecularColor_decorators, { kind: "field", name: "shadedSpecularColor", static: false, private: false, access: { has: obj => "shadedSpecularColor" in obj, get: obj => obj.shadedSpecularColor, set: (obj, value) => { obj.shadedSpecularColor = value; } }, metadata: _metadata }, _shadedSpecularColor_initializers, _shadedSpecularColor_extraInitializers);
            __esDecorate(null, null, _shadedSpecularPower_decorators, { kind: "field", name: "shadedSpecularPower", static: false, private: false, access: { has: obj => "shadedSpecularPower" in obj, get: obj => obj.shadedSpecularPower, set: (obj, value) => { obj.shadedSpecularPower = value; } }, metadata: _metadata }, _shadedSpecularPower_initializers, _shadedSpecularPower_extraInitializers);
            __esDecorate(null, null, _wireframeThickness_decorators, { kind: "field", name: "wireframeThickness", static: false, private: false, access: { has: obj => "wireframeThickness" in obj, get: obj => obj.wireframeThickness, set: (obj, value) => { obj.wireframeThickness = value; } }, metadata: _metadata }, _wireframeThickness_initializers, _wireframeThickness_extraInitializers);
            __esDecorate(null, null, _wireframeTrianglesColor_decorators, { kind: "field", name: "wireframeTrianglesColor", static: false, private: false, access: { has: obj => "wireframeTrianglesColor" in obj, get: obj => obj.wireframeTrianglesColor, set: (obj, value) => { obj.wireframeTrianglesColor = value; } }, metadata: _metadata }, _wireframeTrianglesColor_initializers, _wireframeTrianglesColor_extraInitializers);
            __esDecorate(null, null, _wireframeVerticesColor_decorators, { kind: "field", name: "wireframeVerticesColor", static: false, private: false, access: { has: obj => "wireframeVerticesColor" in obj, get: obj => obj.wireframeVerticesColor, set: (obj, value) => { obj.wireframeVerticesColor = value; } }, metadata: _metadata }, _wireframeVerticesColor_initializers, _wireframeVerticesColor_extraInitializers);
            __esDecorate(null, null, _vertexColor_decorators, { kind: "field", name: "vertexColor", static: false, private: false, access: { has: obj => "vertexColor" in obj, get: obj => obj.vertexColor, set: (obj, value) => { obj.vertexColor = value; } }, metadata: _metadata }, _vertexColor_initializers, _vertexColor_extraInitializers);
            __esDecorate(null, null, _vertexRadius_decorators, { kind: "field", name: "vertexRadius", static: false, private: false, access: { has: obj => "vertexRadius" in obj, get: obj => obj.vertexRadius, set: (obj, value) => { obj.vertexRadius = value; } }, metadata: _metadata }, _vertexRadius_initializers, _vertexRadius_extraInitializers);
            __esDecorate(null, null, _uvScale_decorators, { kind: "field", name: "uvScale", static: false, private: false, access: { has: obj => "uvScale" in obj, get: obj => obj.uvScale, set: (obj, value) => { obj.uvScale = value; } }, metadata: _metadata }, _uvScale_initializers, _uvScale_extraInitializers);
            __esDecorate(null, null, _uvPrimaryColor_decorators, { kind: "field", name: "uvPrimaryColor", static: false, private: false, access: { has: obj => "uvPrimaryColor" in obj, get: obj => obj.uvPrimaryColor, set: (obj, value) => { obj.uvPrimaryColor = value; } }, metadata: _metadata }, _uvPrimaryColor_initializers, _uvPrimaryColor_extraInitializers);
            __esDecorate(null, null, _uvSecondaryColor_decorators, { kind: "field", name: "uvSecondaryColor", static: false, private: false, access: { has: obj => "uvSecondaryColor" in obj, get: obj => obj.uvSecondaryColor, set: (obj, value) => { obj.uvSecondaryColor = value; } }, metadata: _metadata }, _uvSecondaryColor_initializers, _uvSecondaryColor_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        /**
         * Total number of instances of the plugin.
         * Starts at 0.
         */
        _a._PluginCount = 0,
        /**
         * Color palette used for MATERIALIDS mode.
         * Defaults to `defaultMaterialColors`
         */
        _a.MaterialColors = defaultMaterialColors,
        _a;
})();
export { MeshDebugPluginMaterial };
let _Registered = false;
/**
 * Register side effects for meshDebugPluginMaterial.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterMeshDebugPluginMaterial() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.MeshDebugPluginMaterial", MeshDebugPluginMaterial);
}
//# sourceMappingURL=meshDebugPluginMaterial.pure.js.map