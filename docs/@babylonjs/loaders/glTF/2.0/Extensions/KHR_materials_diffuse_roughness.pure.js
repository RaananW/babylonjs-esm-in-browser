import { GLTFLoader } from "../glTFLoader.pure.js";
import { registerGLTFExtension, unregisterGLTFExtension } from "../glTFLoaderExtensionRegistry.js";
const NAME = "KHR_materials_diffuse_roughness";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/b102d2d2b40d44a8776800bb2bf85e218853c17d/extensions/2.0/Khronos/KHR_materials_diffuse_roughness/README.md)
 * @experimental
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class KHR_materials_diffuse_roughness {
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
        this.order = 190;
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
    // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
    loadMaterialPropertiesAsync(context, material, babylonMaterial) {
        return GLTFLoader.LoadExtensionAsync(context, material, this.name, async (extensionContext, extension) => {
            const promises = new Array();
            promises.push(this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial));
            promises.push(this._loadDiffuseRoughnessPropertiesAsync(extensionContext, extension, babylonMaterial));
            // eslint-disable-next-line github/no-then
            return await Promise.all(promises).then(() => { });
        });
    }
    // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
    _loadDiffuseRoughnessPropertiesAsync(context, properties, babylonMaterial) {
        const adapter = this._loader._getOrCreateMaterialAdapter(babylonMaterial);
        const promises = new Array();
        adapter.baseDiffuseRoughness = properties.diffuseRoughnessFactor ?? 0;
        if (properties.diffuseRoughnessTexture) {
            promises.push(this._loader.loadTextureInfoAsync(`${context}/diffuseRoughnessTexture`, properties.diffuseRoughnessTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Diffuse Roughness)`;
                adapter.baseDiffuseRoughnessTexture = texture;
            }));
        }
        // eslint-disable-next-line github/no-then
        return Promise.all(promises).then(() => { });
    }
}
let _Registered = false;
/**
 * Registers the KHR_materials_diffuse_roughness glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function RegisterKHR_materials_diffuse_roughness() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    unregisterGLTFExtension(NAME);
    registerGLTFExtension(NAME, true, (loader) => new KHR_materials_diffuse_roughness(loader));
}
//# sourceMappingURL=KHR_materials_diffuse_roughness.pure.js.map