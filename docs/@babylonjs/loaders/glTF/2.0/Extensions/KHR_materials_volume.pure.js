import { Color3 } from "@babylonjs/core/Maths/math.color.pure.js";
import { GLTFLoader } from "../glTFLoader.pure.js";
import { registerGLTFExtension, unregisterGLTFExtension } from "../glTFLoaderExtensionRegistry.js";
const NAME = "KHR_materials_volume";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_volume/README.md)
 * @since 5.0.0
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class KHR_materials_volume {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        this.order = 173;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME);
        if (this.enabled) {
            // We need to disable instance usage because the attenuation factor depends on the node scale of each individual mesh
            this._loader._disableInstancedMesh++;
        }
    }
    /** @internal */
    dispose() {
        if (this.enabled) {
            this._loader._disableInstancedMesh--;
        }
        this._loader = null;
    }
    /**
     * @internal
     */
    // eslint-disable-next-line no-restricted-syntax
    loadMaterialPropertiesAsync(context, material, babylonMaterial) {
        return GLTFLoader.LoadExtensionAsync(context, material, this.name, async (extensionContext, extension) => {
            const promises = new Array();
            promises.push(this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial));
            promises.push(this._loadVolumePropertiesAsync(extensionContext, material, babylonMaterial, extension));
            // eslint-disable-next-line github/no-then
            return await Promise.all(promises).then(() => { });
        });
    }
    // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
    _loadVolumePropertiesAsync(context, material, babylonMaterial, extension) {
        const adapter = this._loader._getOrCreateMaterialAdapter(babylonMaterial);
        // If transparency isn't enabled already, this extension shouldn't do anything.
        // i.e. it requires either the KHR_materials_transmission or KHR_materials_diffuse_transmission extensions.
        if ((adapter.transmissionWeight === 0 && adapter.subsurfaceWeight === 0) || !extension.thicknessFactor) {
            return Promise.resolve();
        }
        adapter.geometryThinWalled = false;
        const attenuationDistance = extension.attenuationDistance !== undefined ? extension.attenuationDistance : Number.MAX_VALUE;
        const attenuationColor = extension.attenuationColor !== undefined && extension.attenuationColor.length == 3 ? Color3.FromArray(extension.attenuationColor) : Color3.White();
        adapter.configureVolume();
        adapter.transmissionColor = attenuationColor;
        adapter.transmissionDepth = attenuationDistance;
        adapter.volumeThickness = extension.thicknessFactor ?? 0;
        const promises = new Array();
        if (extension.thicknessTexture) {
            extension.thicknessTexture.nonColorData = true;
            // eslint-disable-next-line github/no-then
            promises.push(this._loader.loadTextureInfoAsync(`${context}/thicknessTexture`, extension.thicknessTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Thickness)`;
                adapter.volumeThicknessTexture = texture;
            }));
        }
        // eslint-disable-next-line github/no-then
        return Promise.all(promises).then(() => { });
    }
}
let _Registered = false;
/**
 * Registers the KHR_materials_volume glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function RegisterKHR_materials_volume() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    unregisterGLTFExtension(NAME);
    registerGLTFExtension(NAME, true, (loader) => new KHR_materials_volume(loader));
}
//# sourceMappingURL=KHR_materials_volume.pure.js.map