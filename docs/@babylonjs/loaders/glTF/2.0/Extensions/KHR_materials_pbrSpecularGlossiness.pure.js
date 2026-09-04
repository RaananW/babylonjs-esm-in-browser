import { Color3 } from "@babylonjs/core/Maths/math.color.pure.js";
import { GLTFLoader } from "../glTFLoader.pure.js";
import { registerGLTFExtension, unregisterGLTFExtension } from "../glTFLoaderExtensionRegistry.js";
const NAME = "KHR_materials_pbrSpecularGlossiness";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Archived/KHR_materials_pbrSpecularGlossiness/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class KHR_materials_pbrSpecularGlossiness {
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
        this.order = 200;
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
            promises.push(this._loader.loadMaterialBasePropertiesAsync(context, material, babylonMaterial));
            promises.push(this._loadSpecularGlossinessPropertiesAsync(extensionContext, extension, babylonMaterial));
            this._loader.loadMaterialAlphaProperties(context, material, babylonMaterial);
            // eslint-disable-next-line github/no-then
            return await Promise.all(promises).then(() => { });
        });
    }
    // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
    _loadSpecularGlossinessPropertiesAsync(context, properties, babylonMaterial) {
        const adapter = this._loader._getOrCreateMaterialAdapter(babylonMaterial);
        const promises = new Array();
        adapter.configureSpecularGlossiness();
        if (properties.diffuseFactor) {
            adapter.baseColor = Color3.FromArray(properties.diffuseFactor);
            babylonMaterial.alpha = properties.diffuseFactor[3];
        }
        else {
            adapter.baseColor = Color3.White();
        }
        adapter.specularColor = properties.specularFactor ? Color3.FromArray(properties.specularFactor) : Color3.White();
        adapter.glossiness = properties.glossinessFactor == undefined ? 1 : properties.glossinessFactor;
        if (properties.diffuseTexture) {
            promises.push(this._loader.loadTextureInfoAsync(`${context}/diffuseTexture`, properties.diffuseTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Diffuse)`;
                adapter.baseColorTexture = texture;
            }));
        }
        if (properties.specularGlossinessTexture) {
            promises.push(this._loader.loadTextureInfoAsync(`${context}/specularGlossinessTexture`, properties.specularGlossinessTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Specular Glossiness)`;
                adapter.specularColorTexture = texture;
            }));
        }
        // eslint-disable-next-line github/no-then
        return Promise.all(promises).then(() => { });
    }
}
let _Registered = false;
/**
 * Registers the KHR_materials_pbrSpecularGlossiness glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function RegisterKHR_materials_pbrSpecularGlossiness() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    unregisterGLTFExtension(NAME);
    registerGLTFExtension(NAME, true, (loader) => new KHR_materials_pbrSpecularGlossiness(loader));
}
//# sourceMappingURL=KHR_materials_pbrSpecularGlossiness.pure.js.map