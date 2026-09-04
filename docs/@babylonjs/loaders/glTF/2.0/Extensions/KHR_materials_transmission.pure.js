import { GLTFLoader } from "../glTFLoader.pure.js";
import { registerGLTFExtension, unregisterGLTFExtension } from "../glTFLoaderExtensionRegistry.js";
import { ensureTransmissionHelper } from "./transmissionHelper.js";
const NAME = "KHR_materials_transmission";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_transmission/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class KHR_materials_transmission {
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
        this.order = 175;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME);
        if (this.enabled) {
            loader.parent.transparencyAsCoverage = true;
        }
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
            promises.push(this._loadTransparentPropertiesAsync(extensionContext, material, babylonMaterial, extension));
            // eslint-disable-next-line github/no-then
            return await Promise.all(promises).then(() => { });
        });
    }
    // eslint-disable-next-line no-restricted-syntax, @typescript-eslint/promise-function-async
    _loadTransparentPropertiesAsync(context, material, babylonMaterial, extension) {
        const adapter = this._loader._getOrCreateMaterialAdapter(babylonMaterial);
        const transmissionWeight = extension.transmissionFactor !== undefined ? extension.transmissionFactor : 0.0;
        if (transmissionWeight === 0 || !adapter) {
            return Promise.resolve();
        }
        // Set transmission properties immediately via adapter
        adapter.configureTransmission();
        adapter.transmissionWeight = transmissionWeight;
        if (transmissionWeight > 0) {
            ensureTransmissionHelper(this._loader, babylonMaterial);
        }
        // Load texture if present
        let texturePromise = Promise.resolve(null);
        if (extension.transmissionTexture) {
            extension.transmissionTexture.nonColorData = true;
            texturePromise = this._loader.loadTextureInfoAsync(`${context}/transmissionTexture`, extension.transmissionTexture, (texture) => {
                texture.name = `${babylonMaterial.name} (Transmission)`;
                adapter.transmissionWeightTexture = texture;
            });
        }
        // eslint-disable-next-line github/no-then
        return texturePromise.then(() => { });
    }
}
let _Registered = false;
/**
 * Registers the KHR_materials_transmission glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function RegisterKHR_materials_transmission() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    unregisterGLTFExtension(NAME);
    registerGLTFExtension(NAME, true, (loader) => new KHR_materials_transmission(loader));
}
//# sourceMappingURL=KHR_materials_transmission.pure.js.map