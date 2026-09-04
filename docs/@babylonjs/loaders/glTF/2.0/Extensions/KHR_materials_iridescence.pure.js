import { GLTFLoader } from "../glTFLoader.pure.js";
import { registerGLTFExtension, unregisterGLTFExtension } from "../glTFLoaderExtensionRegistry.js";
const NAME = "KHR_materials_iridescence";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_iridescence/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class KHR_materials_iridescence {
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
            promises.push(this._loadIridescencePropertiesAsync(extensionContext, extension, babylonMaterial));
            // eslint-disable-next-line github/no-then
            return await Promise.all(promises).then(() => { });
        });
    }
    // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
    _loadIridescencePropertiesAsync(context, properties, babylonMaterial) {
        const adapter = this._loader._getOrCreateMaterialAdapter(babylonMaterial);
        const promises = new Array();
        // Set non-texture properties immediately
        adapter.thinFilmWeight = properties.iridescenceFactor ?? 0;
        adapter.thinFilmIor = properties.iridescenceIor ?? properties.iridescenceIOR ?? 1.3;
        adapter.thinFilmThicknessMinimum = properties.iridescenceThicknessMinimum ?? 100;
        adapter.thinFilmThicknessMaximum = properties.iridescenceThicknessMaximum ?? 400;
        // Load textures
        if (properties.iridescenceTexture) {
            promises.push(this._loader.loadTextureInfoAsync(`${context}/iridescenceTexture`, properties.iridescenceTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Iridescence)`;
                adapter.thinFilmWeightTexture = texture;
            }));
        }
        if (properties.iridescenceThicknessTexture) {
            promises.push(this._loader.loadTextureInfoAsync(`${context}/iridescenceThicknessTexture`, properties.iridescenceThicknessTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Iridescence Thickness)`;
                adapter.thinFilmThicknessTexture = texture;
            }));
        }
        // eslint-disable-next-line github/no-then
        return Promise.all(promises).then(() => { });
    }
}
let _Registered = false;
/**
 * Registers the KHR_materials_iridescence glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function RegisterKHR_materials_iridescence() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    unregisterGLTFExtension(NAME);
    registerGLTFExtension(NAME, true, (loader) => new KHR_materials_iridescence(loader));
}
//# sourceMappingURL=KHR_materials_iridescence.pure.js.map