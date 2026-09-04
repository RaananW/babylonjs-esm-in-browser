import { GLTFLoader } from "../glTFLoader.pure.js";
import { Color3 } from "@babylonjs/core/Maths/math.color.pure.js";
import { registerGLTFExtension, unregisterGLTFExtension } from "../glTFLoaderExtensionRegistry.js";
const NAME = "KHR_materials_specular";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_specular/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class KHR_materials_specular {
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
    // eslint-disable-next-line no-restricted-syntax
    loadMaterialPropertiesAsync(context, material, babylonMaterial) {
        return GLTFLoader.LoadExtensionAsync(context, material, this.name, async (extensionContext, extension) => {
            const promises = new Array();
            promises.push(this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial));
            promises.push(this._loadSpecularPropertiesAsync(extensionContext, extension, babylonMaterial));
            // Handle the EXT_materials_specular_edge_color sub-extension
            // https://github.com/KhronosGroup/glTF/blob/2a1111b88f052cbd3e2d82abb9faee56e7494904/extensions/2.0/Vendor/EXT_materials_specular_edge_color/README.md
            const adapter = this._loader._getOrCreateMaterialAdapter(babylonMaterial);
            if (extension.extensions && extension.extensions.EXT_materials_specular_edge_color) {
                const specularEdgeColorExtension = extension.extensions.EXT_materials_specular_edge_color;
                if (specularEdgeColorExtension.specularEdgeColorEnabled) {
                    adapter.enableSpecularEdgeColor(true);
                }
            }
            // eslint-disable-next-line github/no-then
            return await Promise.all(promises).then(() => { });
        });
    }
    // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
    _loadSpecularPropertiesAsync(context, properties, babylonMaterial) {
        const adapter = this._loader._getOrCreateMaterialAdapter(babylonMaterial);
        const promises = new Array();
        // Set non-texture properties immediately
        adapter.specularWeight = properties.specularFactor ?? 1.0;
        adapter.specularColor = properties.specularColorFactor !== undefined ? Color3.FromArray(properties.specularColorFactor) : new Color3(1, 1, 1);
        if (properties.specularTexture) {
            properties.specularTexture.nonColorData = true;
            promises.push(this._loader.loadTextureInfoAsync(`${context}/specularTexture`, properties.specularTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Specular)`;
                adapter.specularWeightTexture = texture;
            }));
        }
        if (properties.specularColorTexture) {
            promises.push(this._loader.loadTextureInfoAsync(`${context}/specularColorTexture`, properties.specularColorTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Specular Color)`;
                adapter.specularColorTexture = texture;
            }));
        }
        // eslint-disable-next-line github/no-then
        return Promise.all(promises).then(() => { });
    }
}
let _Registered = false;
/**
 * Registers the KHR_materials_specular glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function RegisterKHR_materials_specular() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    unregisterGLTFExtension(NAME);
    registerGLTFExtension(NAME, true, (loader) => new KHR_materials_specular(loader));
}
//# sourceMappingURL=KHR_materials_specular.pure.js.map