import { GLTFLoader } from "../glTFLoader.pure.js";
import { registerGLTFExtension, unregisterGLTFExtension } from "../glTFLoaderExtensionRegistry.js";
const NAME = "MSFT_minecraftMesh";
/** @internal */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class MSFT_minecraftMesh {
    /** @internal */
    constructor(loader) {
        /** @internal */
        this.name = NAME;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME);
    }
    /** @internal */
    dispose() {
        this._loader = null;
    }
    /** @internal */
    // eslint-disable-next-line no-restricted-syntax
    loadMaterialPropertiesAsync(context, material, babylonMaterial) {
        return GLTFLoader.LoadExtraAsync(context, material, this.name, async (extraContext, extra) => {
            if (extra) {
                const impl = this._loader._pbrMaterialImpls.get("pbr");
                if (!impl) {
                    throw new Error(`${extraContext}: Material type not supported`);
                }
                const promise = this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial);
                if (babylonMaterial.needAlphaBlending()) {
                    babylonMaterial.forceDepthWrite = true;
                    babylonMaterial.separateCullingPass = true;
                }
                babylonMaterial.backFaceCulling = babylonMaterial.forceDepthWrite;
                babylonMaterial.twoSidedLighting = true;
                return await promise;
            }
        });
    }
}
let _Registered = false;
/**
 * Registers the MSFT_minecraftMesh glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function RegisterMSFT_minecraftMesh() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    unregisterGLTFExtension(NAME);
    registerGLTFExtension(NAME, true, (loader) => new MSFT_minecraftMesh(loader));
}
//# sourceMappingURL=MSFT_minecraftMesh.pure.js.map