import { GLTFLoader } from "../glTFLoader.pure.js";
import { registerGLTFExtension, unregisterGLTFExtension } from "../glTFLoaderExtensionRegistry.js";
const NAME = "KHR_materials_clearcoat";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_clearcoat/README.md)
 * [Playground Sample](https://www.babylonjs-playground.com/frame.html#7F7PN6#8)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class KHR_materials_clearcoat {
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
            promises.push(this._loadClearCoatPropertiesAsync(extensionContext, extension, babylonMaterial));
            await Promise.all(promises);
        });
    }
    // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
    _loadClearCoatPropertiesAsync(context, properties, babylonMaterial) {
        const adapter = this._loader._getOrCreateMaterialAdapter(babylonMaterial);
        const promises = new Array();
        // Set non-texture properties immediately
        adapter.configureCoat();
        adapter.coatWeight = properties.clearcoatFactor !== undefined ? properties.clearcoatFactor : 0;
        adapter.coatRoughness = properties.clearcoatRoughnessFactor !== undefined ? properties.clearcoatRoughnessFactor : 0;
        // Load textures
        if (properties.clearcoatTexture) {
            promises.push(this._loader.loadTextureInfoAsync(`${context}/clearcoatTexture`, properties.clearcoatTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (ClearCoat)`;
                adapter.coatWeightTexture = texture;
            }));
        }
        if (properties.clearcoatRoughnessTexture) {
            properties.clearcoatRoughnessTexture.nonColorData = true;
            promises.push(this._loader.loadTextureInfoAsync(`${context}/clearcoatRoughnessTexture`, properties.clearcoatRoughnessTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (ClearCoat Roughness)`;
                adapter.coatRoughnessTexture = texture;
            }));
        }
        if (properties.clearcoatNormalTexture) {
            properties.clearcoatNormalTexture.nonColorData = true;
            promises.push(this._loader.loadTextureInfoAsync(`${context}/clearcoatNormalTexture`, properties.clearcoatNormalTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (ClearCoat Normal)`;
                adapter.geometryCoatNormalTexture = texture;
                if (properties.clearcoatNormalTexture?.scale != undefined) {
                    adapter.geometryCoatNormalTextureScale = properties.clearcoatNormalTexture.scale;
                }
            }));
            adapter.setNormalMapInversions(!babylonMaterial.getScene().useRightHandedSystem, babylonMaterial.getScene().useRightHandedSystem);
        }
        // eslint-disable-next-line github/no-then
        return Promise.all(promises).then(() => { });
    }
}
let _Registered = false;
/**
 * Registers the KHR_materials_clearcoat glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function RegisterKHR_materials_clearcoat() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    unregisterGLTFExtension(NAME);
    registerGLTFExtension(NAME, true, (loader) => new KHR_materials_clearcoat(loader));
}
//# sourceMappingURL=KHR_materials_clearcoat.pure.js.map