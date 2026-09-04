import { GLTFLoader } from "../glTFLoader.pure.js";
import { registerGLTFExtension, unregisterGLTFExtension } from "../glTFLoaderExtensionRegistry.js";
const NAME = "KHR_materials_emissive_strength";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_emissive_strength/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class KHR_materials_emissive_strength {
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
        this.order = 170;
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
            await this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial);
            this._loadEmissiveProperties(extensionContext, extension, babylonMaterial);
            return await Promise.resolve();
        });
    }
    _loadEmissiveProperties(context, properties, babylonMaterial) {
        if (properties.emissiveStrength !== undefined) {
            const adapter = this._loader._getOrCreateMaterialAdapter(babylonMaterial);
            adapter.emissionLuminance = properties.emissiveStrength;
        }
    }
}
let _Registered = false;
/**
 * Registers the KHR_materials_emissive_strength glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function RegisterKHR_materials_emissive_strength() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    unregisterGLTFExtension(NAME);
    registerGLTFExtension(NAME, true, (loader) => new KHR_materials_emissive_strength(loader));
}
//# sourceMappingURL=KHR_materials_emissive_strength.pure.js.map