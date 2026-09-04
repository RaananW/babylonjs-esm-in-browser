/** This file must only contain pure code and pure imports */
import { __classPrivateFieldGet, __classPrivateFieldSet, __esDecorate, __runInitializers } from "../tslib.es6.js";
import { serialize, expandToProperty } from "../Misc/decorators.js";
import { MaterialDefines } from "./materialDefines.js";
import { MaterialPluginBase } from "./materialPluginBase.pure.js";

import { MaterialFlags } from "./materialFlags.js";
import { BindTextureMatrix, PrepareDefinesForMergedUV } from "./materialHelper.functions.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * @internal
 */
export class DecalMapDefines extends MaterialDefines {
    constructor() {
        super(...arguments);
        this.DECAL = false;
        this.DECALDIRECTUV = 0;
        this.DECAL_SMOOTHALPHA = false;
        this.GAMMADECAL = false;
    }
}
/**
 * Plugin that implements the decal map component of a material
 * @since 5.49.1
 */
let DecalMapConfiguration = (() => {
    var _a, _DecalMapConfiguration_isEnabled_accessor_storage, _DecalMapConfiguration_smoothAlpha_accessor_storage;
    let _classSuper = MaterialPluginBase;
    let _isEnabled_decorators;
    let _isEnabled_initializers = [];
    let _isEnabled_extraInitializers = [];
    let _smoothAlpha_decorators;
    let _smoothAlpha_initializers = [];
    let _smoothAlpha_extraInitializers = [];
    return _a = class DecalMapConfiguration extends _classSuper {
            /**
             * Enables or disables the decal map on this material
             */
            get isEnabled() { return __classPrivateFieldGet(this, _DecalMapConfiguration_isEnabled_accessor_storage, "f"); }
            set isEnabled(value) { __classPrivateFieldSet(this, _DecalMapConfiguration_isEnabled_accessor_storage, value, "f"); }
            /**
             * Enables or disables the smooth alpha mode on this material. Default: false.
             * When enabled, the alpha value used to blend the decal map will be the squared value and will produce a smoother result.
             */
            get smoothAlpha() { return __classPrivateFieldGet(this, _DecalMapConfiguration_smoothAlpha_accessor_storage, "f"); }
            set smoothAlpha(value) { __classPrivateFieldSet(this, _DecalMapConfiguration_smoothAlpha_accessor_storage, value, "f"); }
            /** @internal */
            _markAllSubMeshesAsTexturesDirty() {
                this._enable(this._isEnabled);
                this._internalMarkAllSubMeshesAsTexturesDirty();
            }
            /**
             * Gets a boolean indicating that the plugin is compatible with a given shader language.
             * @returns true if the plugin is compatible with the shader language
             */
            isCompatible() {
                return true;
            }
            /**
             * Creates a new DecalMapConfiguration
             * @param material The material to attach the decal map plugin to
             * @param addToPluginList If the plugin should be added to the material plugin list
             */
            constructor(material, addToPluginList = true) {
                super(material, "DecalMap", 150, new DecalMapDefines(), addToPluginList);
                this._isEnabled = false;
                _DecalMapConfiguration_isEnabled_accessor_storage.set(this, __runInitializers(this, _isEnabled_initializers, false));
                this._smoothAlpha = (__runInitializers(this, _isEnabled_extraInitializers), false);
                _DecalMapConfiguration_smoothAlpha_accessor_storage.set(this, __runInitializers(this, _smoothAlpha_initializers, false));
                this._internalMarkAllSubMeshesAsTexturesDirty = __runInitializers(this, _smoothAlpha_extraInitializers);
                this.registerForExtraEvents = true; // because we override the hardBindForSubMesh method
                this._internalMarkAllSubMeshesAsTexturesDirty = material._dirtyCallbacks[1];
            }
            /**
             * Checks if the sub mesh is ready to be used
             * @param defines the list of defines
             * @param scene the current scene
             * @param engine the current engine
             * @param subMesh the sub mesh to check
             * @returns true if the sub mesh is ready
             */
            isReadyForSubMesh(defines, scene, engine, subMesh) {
                const decalMap = subMesh.getMesh().decalMap;
                if (!this._isEnabled || !decalMap?.texture || !MaterialFlags.DecalMapEnabled || !scene.texturesEnabled) {
                    return true;
                }
                return decalMap.isReady();
            }
            /**
             * Prepares the defines before attributes are set
             * @param defines the list of defines
             * @param scene the current scene
             * @param mesh the current mesh
             */
            prepareDefinesBeforeAttributes(defines, scene, mesh) {
                const decalMap = mesh.decalMap;
                if (!this._isEnabled || !decalMap?.texture || !MaterialFlags.DecalMapEnabled || !scene.texturesEnabled) {
                    const isDirty = defines.DECAL;
                    if (isDirty) {
                        defines.markAsTexturesDirty();
                    }
                    defines.DECAL = false;
                }
                else {
                    const isDirty = !defines.DECAL || defines.GAMMADECAL !== decalMap.texture.gammaSpace;
                    if (isDirty) {
                        defines.markAsTexturesDirty();
                    }
                    defines.DECAL = true;
                    defines.GAMMADECAL = decalMap.texture.gammaSpace;
                    defines.DECAL_SMOOTHALPHA = this._smoothAlpha;
                    PrepareDefinesForMergedUV(decalMap.texture, defines, "DECAL");
                }
            }
            /**
             * Binds the material data for a sub mesh
             * @param uniformBuffer the uniform buffer to update
             * @param scene the current scene
             * @param _engine the current engine
             * @param subMesh the sub mesh to bind
             */
            hardBindForSubMesh(uniformBuffer, scene, _engine, subMesh) {
                /**
                 * Note that we override hardBindForSubMesh and not bindForSubMesh because the material can be shared by multiple meshes,
                 * in which case mustRebind could return false even though the decal map is different for each mesh: that's because the decal map
                 * is not part of the material but hosted by the decalMap of the mesh instead.
                 */
                const decalMap = subMesh.getMesh().decalMap;
                if (!this._isEnabled || !decalMap?.texture || !MaterialFlags.DecalMapEnabled || !scene.texturesEnabled) {
                    return;
                }
                const isFrozen = this._material.isFrozen;
                const texture = decalMap.texture;
                if (!uniformBuffer.useUbo || !isFrozen || !uniformBuffer.isSync) {
                    uniformBuffer.updateFloat4("vDecalInfos", texture.coordinatesIndex, 0, 0, 0);
                    BindTextureMatrix(texture, uniformBuffer, "decal");
                }
                uniformBuffer.setTexture("decalSampler", texture);
            }
            /**
             * Gets the class name of this plugin
             * @returns the class name
             */
            getClassName() {
                return "DecalMapConfiguration";
            }
            /**
             * Gets the samplers used by the plugin
             * @param samplers the list of samplers to update
             */
            getSamplers(samplers) {
                samplers.push("decalSampler");
            }
            getUniforms() {
                return {
                    ubo: [
                        { name: "vDecalInfos", size: 4, type: "vec4" },
                        { name: "decalMatrix", size: 16, type: "mat4" },
                    ],
                };
            }
        },
        _DecalMapConfiguration_isEnabled_accessor_storage = new WeakMap(),
        _DecalMapConfiguration_smoothAlpha_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _isEnabled_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _smoothAlpha_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __esDecorate(_a, null, _isEnabled_decorators, { kind: "accessor", name: "isEnabled", static: false, private: false, access: { has: obj => "isEnabled" in obj, get: obj => obj.isEnabled, set: (obj, value) => { obj.isEnabled = value; } }, metadata: _metadata }, _isEnabled_initializers, _isEnabled_extraInitializers);
            __esDecorate(_a, null, _smoothAlpha_decorators, { kind: "accessor", name: "smoothAlpha", static: false, private: false, access: { has: obj => "smoothAlpha" in obj, get: obj => obj.smoothAlpha, set: (obj, value) => { obj.smoothAlpha = value; } }, metadata: _metadata }, _smoothAlpha_initializers, _smoothAlpha_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { DecalMapConfiguration };
let _Registered = false;
/**
 * Register side effects for materialDecalMapConfiguration.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterMaterialDecalMapConfiguration() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.DecalMapConfiguration", DecalMapConfiguration);
}
//# sourceMappingURL=material.decalMapConfiguration.pure.js.map