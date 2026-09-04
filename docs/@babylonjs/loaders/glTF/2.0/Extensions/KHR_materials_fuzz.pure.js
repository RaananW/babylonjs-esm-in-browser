import { GLTFLoader } from "../glTFLoader.pure.js";
import { Color3 } from "@babylonjs/core/Maths/math.color.pure.js";
import { registerGLTFExtension, unregisterGLTFExtension } from "../glTFLoaderExtensionRegistry.js";
const NAME = "KHR_materials_fuzz";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/9734e44accd0dfb986ec5f376117aa00192745fe/extensions/2.0/Khronos/KHR_materials_fuzz/README.md)
 * @experimental
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class KHR_materials_fuzz {
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
            promises.push(this._loadFuzzPropertiesAsync(extensionContext, extension, babylonMaterial));
            // eslint-disable-next-line github/no-then
            return await Promise.all(promises).then(() => { });
        });
    }
    // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
    _loadFuzzPropertiesAsync(context, properties, babylonMaterial) {
        const adapter = this._loader._getOrCreateMaterialAdapter(babylonMaterial);
        const promises = new Array();
        adapter.configureFuzz();
        // Set non-texture properties immediately
        adapter.fuzzWeight = properties.fuzzFactor !== undefined ? properties.fuzzFactor : 0.0;
        adapter.fuzzColor = properties.fuzzColorFactor !== undefined ? Color3.FromArray(properties.fuzzColorFactor) : Color3.White();
        adapter.fuzzRoughness = properties.fuzzRoughnessFactor !== undefined ? properties.fuzzRoughnessFactor : 0.5;
        // Load textures
        if (properties.fuzzTexture) {
            promises.push(this._loader.loadTextureInfoAsync(`${context}/fuzzTexture`, properties.fuzzTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Fuzz)`;
                adapter.fuzzWeightTexture = texture;
            }));
        }
        if (properties.fuzzColorTexture) {
            promises.push(this._loader.loadTextureInfoAsync(`${context}/fuzzColorTexture`, properties.fuzzColorTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Fuzz Color)`;
                adapter.fuzzColorTexture = texture;
            }));
        }
        if (properties.fuzzRoughnessTexture) {
            properties.fuzzRoughnessTexture.nonColorData = true;
            promises.push(this._loader.loadTextureInfoAsync(`${context}/fuzzRoughnessTexture`, properties.fuzzRoughnessTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Fuzz Roughness)`;
                adapter.fuzzRoughnessTexture = texture;
            }));
        }
        // eslint-disable-next-line github/no-then
        return Promise.all(promises).then(() => { });
    }
}
let _Registered = false;
/**
 * Registers the KHR_materials_fuzz glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function RegisterKHR_materials_fuzz() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    unregisterGLTFExtension(NAME);
    registerGLTFExtension(NAME, true, (loader) => new KHR_materials_fuzz(loader));
}
//# sourceMappingURL=KHR_materials_fuzz.pure.js.map