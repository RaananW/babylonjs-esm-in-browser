import { __decorate } from "../../tslib.es6.js";
/* eslint-disable @typescript-eslint/naming-convention */
import { serialize, expandToProperty, serializeAsVector2, serializeAsTexture } from "../../Misc/decorators.js";
import { VertexBuffer } from "../../Buffers/buffer.js";
import { Vector2 } from "../../Maths/math.vector.js";
import { MaterialFlags } from "../../Materials/materialFlags.js";
import { MaterialHelper } from "../../Materials/materialHelper.js";
import { MaterialPluginBase } from "../materialPluginBase.js";

import { MaterialDefines } from "../materialDefines.js";
/**
 * @internal
 */
export class MaterialAnisotropicDefines extends MaterialDefines {
    constructor() {
        super(...arguments);
        this.ANISOTROPIC = false;
        this.ANISOTROPIC_TEXTURE = false;
        this.ANISOTROPIC_TEXTUREDIRECTUV = 0;
        this.MAINUV1 = false;
    }
}
/**
 * Plugin that implements the anisotropic component of the PBR material
 */
export class PBRAnisotropicConfiguration extends MaterialPluginBase {
    constructor(material, addToPluginList = true) {
        super(material, "PBRAnisotropic", 110, new MaterialAnisotropicDefines(), addToPluginList);
        this._isEnabled = false;
        /**
         * Defines if the anisotropy is enabled in the material.
         */
        this.isEnabled = false;
        /**
         * Defines the anisotropy strength (between 0 and 1) it defaults to 1.
         */
        this.intensity = 1;
        /**
         * Defines if the effect is along the tangents, bitangents or in between.
         * By default, the effect is "stretching" the highlights along the tangents.
         */
        this.direction = new Vector2(1, 0);
        this._texture = null;
        /**
         * Stores the anisotropy values in a texture.
         * rg is direction (like normal from -1 to 1)
         * b is a intensity
         */
        this.texture = null;
        this._internalMarkAllSubMeshesAsTexturesDirty = material._dirtyCallbacks[1];
    }
    /** @internal */
    _markAllSubMeshesAsTexturesDirty() {
        this._enable(this._isEnabled);
        this._internalMarkAllSubMeshesAsTexturesDirty();
    }
    isReadyForSubMesh(defines, scene) {
        if (!this._isEnabled) {
            return true;
        }
        if (defines._areTexturesDirty) {
            if (scene.texturesEnabled) {
                if (this._texture && MaterialFlags.AnisotropicTextureEnabled) {
                    if (!this._texture.isReadyOrNotBlocking()) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    prepareDefinesBeforeAttributes(defines, scene, mesh) {
        if (this._isEnabled) {
            defines.ANISOTROPIC = this._isEnabled;
            if (this._isEnabled && !mesh.isVerticesDataPresent(VertexBuffer.TangentKind)) {
                defines._needUVs = true;
                defines.MAINUV1 = true;
            }
            if (defines._areTexturesDirty) {
                if (scene.texturesEnabled) {
                    if (this._texture && MaterialFlags.AnisotropicTextureEnabled) {
                        MaterialHelper.PrepareDefinesForMergedUV(this._texture, defines, "ANISOTROPIC_TEXTURE");
                    }
                    else {
                        defines.ANISOTROPIC_TEXTURE = false;
                    }
                }
            }
        }
        else {
            defines.ANISOTROPIC = false;
            defines.ANISOTROPIC_TEXTURE = false;
            defines.ANISOTROPIC_TEXTUREDIRECTUV = 0;
            defines.MAINUV1 = false;
        }
    }
    bindForSubMesh(uniformBuffer, scene) {
        if (!this._isEnabled) {
            return;
        }
        const isFrozen = this._material.isFrozen;
        if (!uniformBuffer.useUbo || !isFrozen || !uniformBuffer.isSync) {
            if (this._texture && MaterialFlags.AnisotropicTextureEnabled) {
                uniformBuffer.updateFloat2("vAnisotropyInfos", this._texture.coordinatesIndex, this._texture.level);
                MaterialHelper.BindTextureMatrix(this._texture, uniformBuffer, "anisotropy");
            }
            // Anisotropy
            uniformBuffer.updateFloat3("vAnisotropy", this.direction.x, this.direction.y, this.intensity);
        }
        // Textures
        if (scene.texturesEnabled) {
            if (this._texture && MaterialFlags.AnisotropicTextureEnabled) {
                uniformBuffer.setTexture("anisotropySampler", this._texture);
            }
        }
    }
    hasTexture(texture) {
        if (this._texture === texture) {
            return true;
        }
        return false;
    }
    getActiveTextures(activeTextures) {
        if (this._texture) {
            activeTextures.push(this._texture);
        }
    }
    getAnimatables(animatables) {
        if (this._texture && this._texture.animations && this._texture.animations.length > 0) {
            animatables.push(this._texture);
        }
    }
    dispose(forceDisposeTextures) {
        if (forceDisposeTextures) {
            if (this._texture) {
                this._texture.dispose();
            }
        }
    }
    getClassName() {
        return "PBRAnisotropicConfiguration";
    }
    addFallbacks(defines, fallbacks, currentRank) {
        if (defines.ANISOTROPIC) {
            fallbacks.addFallback(currentRank++, "ANISOTROPIC");
        }
        return currentRank;
    }
    getSamplers(samplers) {
        samplers.push("anisotropySampler");
    }
    getUniforms() {
        return {
            ubo: [
                { name: "vAnisotropy", size: 3, type: "vec3" },
                { name: "vAnisotropyInfos", size: 2, type: "vec2" },
                { name: "anisotropyMatrix", size: 16, type: "mat4" },
            ],
        };
    }
}
__decorate([
    serialize(),
    expandToProperty("_markAllSubMeshesAsTexturesDirty")
], PBRAnisotropicConfiguration.prototype, "isEnabled", void 0);
__decorate([
    serialize()
], PBRAnisotropicConfiguration.prototype, "intensity", void 0);
__decorate([
    serializeAsVector2()
], PBRAnisotropicConfiguration.prototype, "direction", void 0);
__decorate([
    serializeAsTexture(),
    expandToProperty("_markAllSubMeshesAsTexturesDirty")
], PBRAnisotropicConfiguration.prototype, "texture", void 0);
//# sourceMappingURL=pbrAnisotropicConfiguration.js.map