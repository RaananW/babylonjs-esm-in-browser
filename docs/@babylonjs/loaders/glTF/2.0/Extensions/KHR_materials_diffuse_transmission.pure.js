import { GLTFLoader } from "../glTFLoader.pure.js";
import { Color3 } from "@babylonjs/core/Maths/math.color.pure.js";
import { registerGLTFExtension, unregisterGLTFExtension } from "../glTFLoaderExtensionRegistry.js";
import { ensureTransmissionHelper } from "./transmissionHelper.js";
const NAME = "KHR_materials_diffuse_transmission";
/**
 * [Proposed Specification](https://github.com/KhronosGroup/glTF/pull/1825)
 * !!! Experimental Extension Subject to Changes !!!
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class KHR_materials_diffuse_transmission {
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
        this.order = 174;
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
            promises.push(this._loadTranslucentPropertiesAsync(extensionContext, material, babylonMaterial, extension));
            return await Promise.all(promises).then(() => { });
        });
    }
    // eslint-disable-next-line no-restricted-syntax, @typescript-eslint/promise-function-async
    _loadTranslucentPropertiesAsync(context, material, babylonMaterial, extension) {
        const adapter = this._loader._getOrCreateMaterialAdapter(babylonMaterial);
        adapter.configureSubsurface();
        adapter.subsurfaceWeight = extension.diffuseTransmissionFactor ?? 0;
        if (adapter.subsurfaceWeight > 0) {
            ensureTransmissionHelper(this._loader, babylonMaterial);
        }
        adapter.diffuseTransmissionTint = extension.diffuseTransmissionColorFactor !== undefined ? Color3.FromArray(extension.diffuseTransmissionColorFactor) : Color3.White();
        const promises = new Array();
        if (extension.diffuseTransmissionTexture) {
            extension.diffuseTransmissionTexture.nonColorData = true;
            promises.push(this._loader.loadTextureInfoAsync(`${context}/diffuseTransmissionTexture`, extension.diffuseTransmissionTexture).then((texture) => {
                texture.name = `${babylonMaterial.name} (Diffuse Transmission)`;
                adapter.subsurfaceWeightTexture = texture;
            }));
        }
        if (extension.diffuseTransmissionColorTexture) {
            promises.push(this._loader.loadTextureInfoAsync(`${context}/diffuseTransmissionColorTexture`, extension.diffuseTransmissionColorTexture).then((texture) => {
                texture.name = `${babylonMaterial.name} (Diffuse Transmission Color)`;
                adapter.diffuseTransmissionTintTexture = texture;
            }));
        }
        return Promise.all(promises).then(() => { });
    }
}
let _Registered = false;
/**
 * Registers the KHR_materials_diffuse_transmission glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function RegisterKHR_materials_diffuse_transmission() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    unregisterGLTFExtension(NAME);
    registerGLTFExtension(NAME, true, (loader) => new KHR_materials_diffuse_transmission(loader));
}
//# sourceMappingURL=KHR_materials_diffuse_transmission.pure.js.map