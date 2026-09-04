/** This file must only contain pure code and pure imports */
import { MaterialDefines } from "../../../Materials/materialDefines.js";
import { MaterialPluginBase } from "../../../Materials/materialPluginBase.pure.js";
import { RegisterMaterialPlugin, UnregisterMaterialPlugin } from "../../../Materials/materialPluginManager.pure.js";
import { Vector2 } from "../../../Maths/math.vector.pure.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
class TAAJitterMaterialDefines extends MaterialDefines {
    constructor() {
        super(...arguments);
        this.TAA_JITTER = false;
    }
}
class TAAJitterMaterialPlugin extends MaterialPluginBase {
    get manager() {
        return this._manager;
    }
    set manager(manager) {
        if (this._manager === manager) {
            return;
        }
        this.dispose();
        this._manager = manager;
        manager?._materialPlugins.push(this);
        this._updateMaterial();
    }
    get isEnabled() {
        return this._manager?.isEnabled ?? false;
    }
    constructor(material) {
        super(material, TAAJitterMaterialPlugin.Name, 300, new TAAJitterMaterialDefines());
        this.registerForExtraEvents = true;
        this.doNotSerialize = true;
    }
    /** @internal */
    _updateMaterial() {
        this._enable(this.isEnabled);
        this.markAllDefinesAsDirty();
    }
    isCompatible() {
        return true;
    }
    getClassName() {
        return "TAAJitterMaterialPlugin";
    }
    prepareDefines(defines) {
        defines.TAA_JITTER = this.isEnabled;
    }
    getUniforms(shaderLanguage = 0 /* ShaderLanguage.GLSL */) {
        const ubo = [{ name: "taa_jitter", size: 2, type: "vec2" }];
        if (shaderLanguage === 0 /* ShaderLanguage.GLSL */) {
            return {
                ubo,
                vertex: `
                    #ifdef TAA_JITTER
                    uniform vec2 taa_jitter;
                    #endif
                `,
            };
        }
        else {
            return { ubo };
        }
    }
    hardBindForSubMesh(uniformBuffer) {
        if (this.isEnabled) {
            const jitter = this._manager.jitter;
            uniformBuffer.updateFloat2("taa_jitter", jitter.x, jitter.y);
        }
    }
    getCustomCode(shaderType, shaderLanguage = 0 /* ShaderLanguage.GLSL */) {
        // We jitter instead of modifying the camera so the velocity buffer stays unaffected
        // More info: https://sugulee.wordpress.com/2021/06/21/temporal-anti-aliasingtaa-tutorial/
        if (shaderType !== "vertex") {
            return null;
        }
        else if (shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
            return {
                CUSTOM_VERTEX_MAIN_END: `
                    #ifdef TAA_JITTER
                    vertexOutputs.position += vec4f(uniforms.taa_jitter * vertexOutputs.position.w, 0.0, 0.0);
                    #endif
                `,
            };
        }
        else {
            return {
                CUSTOM_VERTEX_MAIN_END: `
                    #ifdef TAA_JITTER
                    gl_Position.xy += taa_jitter * gl_Position.w;
                    #endif
                `,
            };
        }
    }
    dispose() {
        if (this._manager) {
            const index = this._manager._materialPlugins.indexOf(this);
            if (index !== -1) {
                this._manager._materialPlugins.splice(index, 1);
            }
        }
    }
}
TAAJitterMaterialPlugin.Name = "TAAJitter";
/**
 * Applies and manages the TAA jitter plugin on all materials.
 */
export class TAAMaterialManager {
    /**
     * Set to enable or disable the jitter offset on all materials.
     */
    get isEnabled() {
        return this._isEnabled;
    }
    set isEnabled(enabled) {
        if (this._isEnabled === enabled) {
            return;
        }
        this._isEnabled = enabled;
        for (const plugin of this._materialPlugins) {
            plugin._updateMaterial();
        }
    }
    /**
     * @param scene All materials in this scene will have a jitter offset applied to them.
     */
    constructor(scene) {
        this._isEnabled = true;
        /**
         * The current jitter offset to apply to all materials.
         */
        this.jitter = new Vector2();
        /** @internal */
        this._materialPlugins = [];
        for (const material of scene.materials) {
            this._getPlugin(material);
        }
        RegisterMaterialPlugin(TAAJitterMaterialPlugin.Name, (material) => this._getPlugin(material));
    }
    /**
     * Disposes of the material manager.
     */
    dispose() {
        UnregisterMaterialPlugin(TAAJitterMaterialPlugin.Name);
        const plugins = this._materialPlugins.splice(0, this._materialPlugins.length);
        for (const plugin of plugins) {
            plugin.manager = null;
        }
    }
    _getPlugin(material) {
        if (!material.pluginManager) {
            return null;
        }
        let plugin = material.pluginManager.getPlugin(TAAJitterMaterialPlugin.Name);
        if (!plugin) {
            plugin = new TAAJitterMaterialPlugin(material);
        }
        plugin.manager = this;
        return plugin;
    }
}
let _Registered = false;
/**
 * Register side effects for taaMaterialManager.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterTaaMaterialManager() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass(`BABYLON.TAAJitterMaterialPlugin`, TAAJitterMaterialPlugin);
}
//# sourceMappingURL=taaMaterialManager.pure.js.map