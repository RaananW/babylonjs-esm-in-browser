import { GLTFLoader } from "../glTFLoader.pure.js";
import { registerGLTFExtension, unregisterGLTFExtension } from "../glTFLoaderExtensionRegistry.js";
import { Color3 } from "@babylonjs/core/Maths/math.color.pure.js";
const NAME = "KHR_materials_coat";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/6cb2cb84b504c245c49cf2e9a8ae16d26f72ac97/extensions/2.0/Khronos/KHR_materials_coat/README.md)
 * @experimental
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class KHR_materials_coat {
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
        this.order = 191;
        /**
         * Defines whether the KHR_materials_openpbr extension is used, indicating that
         * the material should be interpreted as OpenPBR (for coat, this might be necessary
         * to interpret anisotropy correctly).
         */
        this.useOpenPBR = false;
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
            if (material.extensions && material.extensions["KHR_materials_openpbr"]) {
                this.useOpenPBR = true;
            }
            promises.push(this._loadCoatPropertiesAsync(extensionContext, extension, babylonMaterial));
            await Promise.all(promises);
        });
    }
    // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
    _loadCoatPropertiesAsync(context, properties, babylonMaterial) {
        const adapter = this._loader._getOrCreateMaterialAdapter(babylonMaterial);
        const promises = new Array();
        // Set non-texture properties immediately
        adapter.configureCoat();
        adapter.coatWeight = properties.coatFactor !== undefined ? properties.coatFactor : 0;
        adapter.coatRoughness = properties.coatRoughnessFactor !== undefined ? properties.coatRoughnessFactor : 0;
        // Load textures
        if (properties.coatTexture) {
            promises.push(this._loader.loadTextureInfoAsync(`${context}/coatTexture`, properties.coatTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Coat)`;
                adapter.coatWeightTexture = texture;
            }));
        }
        if (properties.coatRoughnessTexture) {
            properties.coatRoughnessTexture.nonColorData = true;
            promises.push(this._loader.loadTextureInfoAsync(`${context}/coatRoughnessTexture`, properties.coatRoughnessTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Coat Roughness)`;
                adapter.coatRoughnessTexture = texture;
            }));
        }
        if (properties.coatNormalTexture) {
            properties.coatNormalTexture.nonColorData = true;
            promises.push(this._loader.loadTextureInfoAsync(`${context}/coatNormalTexture`, properties.coatNormalTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Coat Normal)`;
                adapter.geometryCoatNormalTexture = texture;
                if (properties.coatNormalTexture?.scale != undefined) {
                    adapter.geometryCoatNormalTextureScale = properties.coatNormalTexture.scale;
                }
            }));
            adapter.setNormalMapInversions(!babylonMaterial.getScene().useRightHandedSystem, babylonMaterial.getScene().useRightHandedSystem);
        }
        adapter.coatDarkening = properties.coatDarkeningFactor !== undefined ? properties.coatDarkeningFactor : 1;
        adapter.coatIor = properties.coatIor !== undefined ? properties.coatIor : 1.5;
        const colorFactor = Color3.White();
        if (properties.coatColorFactor !== undefined) {
            colorFactor.fromArray(properties.coatColorFactor);
        }
        adapter.coatColor = colorFactor;
        if (properties.coatColorTexture) {
            promises.push(this._loader.loadTextureInfoAsync(`${context}/coatColorTexture`, properties.coatColorTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Coat Color)`;
                adapter.coatColorTexture = texture;
            }));
        }
        // Set non-texture properties immediately
        const coatAnisotropyWeight = properties.coatAnisotropyStrength ?? 0;
        const coatAnisotropyAngle = properties.coatAnisotropyRotation ?? 0;
        adapter.coatRoughnessAnisotropy = coatAnisotropyWeight;
        adapter.geometryCoatTangentAngle = coatAnisotropyAngle;
        // Check if this is glTF-style anisotropy
        if (!this.useOpenPBR) {
            adapter.configureGltfStyleAnisotropy(true);
        }
        // Load texture if present
        if (properties.coatAnisotropyTexture) {
            properties.coatAnisotropyTexture.nonColorData = true;
            promises.push(this._loader.loadTextureInfoAsync(`${context}/coatAnisotropyTexture`, properties.coatAnisotropyTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Coat Anisotropy)`;
                adapter.geometryCoatTangentTexture = texture;
            }));
        }
        // eslint-disable-next-line github/no-then
        return Promise.all(promises).then(() => { });
    }
}
let _Registered = false;
/**
 * Registers the KHR_materials_coat glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function RegisterKHR_materials_coat() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    unregisterGLTFExtension(NAME);
    registerGLTFExtension(NAME, true, (loader) => new KHR_materials_coat(loader));
}
//# sourceMappingURL=KHR_materials_coat.pure.js.map