import { GLTFLoader } from "../glTFLoader.pure.js";
import { registerGLTFExtension, unregisterGLTFExtension } from "../glTFLoaderExtensionRegistry.js";
const NAME = "KHR_materials_anisotropy";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_anisotropy)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class KHR_materials_anisotropy {
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
        this.order = 195;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME);
    }
    /** @internal */
    dispose() {
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
            promises.push(this._loadAnisotropyPropertiesAsync(extensionContext, extension, babylonMaterial));
            await Promise.all(promises);
        });
    }
    async _loadAnisotropyPropertiesAsync(context, properties, babylonMaterial) {
        const adapter = this._loader._getOrCreateMaterialAdapter(babylonMaterial);
        const promises = new Array();
        // Set non-texture properties immediately
        const anisotropyWeight = properties.anisotropyStrength ?? 0;
        const anisotropyAngle = properties.anisotropyRotation ?? 0;
        adapter.specularRoughnessAnisotropy = anisotropyWeight;
        adapter.geometryTangentAngle = anisotropyAngle;
        // Check if this is glTF-style anisotropy
        const extensions = properties.extensions ?? {};
        if (!extensions.EXT_materials_anisotropy_openpbr || !extensions.EXT_materials_anisotropy_openpbr.openPbrAnisotropyEnabled) {
            adapter.configureGltfStyleAnisotropy(true);
        }
        // Load texture if present
        if (properties.anisotropyTexture) {
            properties.anisotropyTexture.nonColorData = true;
            promises.push(this._loader.loadTextureInfoAsync(`${context}/anisotropyTexture`, properties.anisotropyTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Anisotropy Intensity)`;
                adapter.geometryTangentTexture = texture;
            }));
        }
        await Promise.all(promises);
    }
}
let _Registered = false;
/**
 * Registers the KHR_materials_anisotropy glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function RegisterKHR_materials_anisotropy() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    unregisterGLTFExtension(NAME);
    registerGLTFExtension(NAME, true, (loader) => new KHR_materials_anisotropy(loader));
}
//# sourceMappingURL=KHR_materials_anisotropy.pure.js.map