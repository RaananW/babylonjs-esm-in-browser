import { registerGLTFExtension, unregisterGLTFExtension } from "../glTFLoaderExtensionRegistry.js";
const NAME = "KHR_xmp_json_ld";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_xmp_json_ld/README.md)
 * @since 5.0.0
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class KHR_xmp_json_ld {
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
        this.order = 100;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME);
    }
    /** @internal */
    dispose() {
        this._loader = null;
    }
    /**
     * Called after the loader state changes to LOADING.
     */
    onLoading() {
        if (this._loader.rootBabylonMesh === null) {
            return;
        }
        const xmpGltf = this._loader.gltf.extensions?.KHR_xmp_json_ld;
        const xmpNode = this._loader.gltf.asset?.extensions?.KHR_xmp_json_ld;
        if (xmpGltf && xmpNode) {
            const packet = +xmpNode.packet;
            if (xmpGltf.packets && packet < xmpGltf.packets.length) {
                this._loader.rootBabylonMesh.metadata = this._loader.rootBabylonMesh.metadata || {};
                this._loader.rootBabylonMesh.metadata.xmp = xmpGltf.packets[packet];
            }
        }
    }
}
let _Registered = false;
/**
 * Registers the KHR_xmp_json_ld glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function RegisterKHR_xmp_json_ld() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    unregisterGLTFExtension(NAME);
    registerGLTFExtension(NAME, true, (loader) => new KHR_xmp_json_ld(loader));
}
//# sourceMappingURL=KHR_xmp_json_ld.pure.js.map