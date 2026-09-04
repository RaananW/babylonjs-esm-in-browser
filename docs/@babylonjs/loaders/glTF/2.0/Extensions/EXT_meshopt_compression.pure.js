import { ArrayItem, GLTFLoader } from "../glTFLoader.pure.js";
import { MeshoptCompression } from "@babylonjs/core/Meshes/Compression/meshoptCompression.js";
import { registerGLTFExtension, unregisterGLTFExtension } from "../glTFLoaderExtensionRegistry.js";
const NAME = "EXT_meshopt_compression";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Vendor/EXT_meshopt_compression/README.md)
 *
 * This extension uses a WebAssembly decoder module from https://github.com/zeux/meshoptimizer/tree/master/js
 * @since 5.0.0
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class EXT_meshopt_compression {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME;
        this.enabled = loader.isExtensionUsed(NAME);
        this._loader = loader;
    }
    /** @internal */
    dispose() {
        this._loader = null;
    }
    /**
     * @internal
     */
    // eslint-disable-next-line no-restricted-syntax
    loadBufferViewAsync(context, bufferView) {
        return GLTFLoader.LoadExtensionAsync(context, bufferView, this.name, async (extensionContext, extension) => {
            const bufferViewMeshopt = bufferView;
            if (bufferViewMeshopt._meshOptData) {
                return await bufferViewMeshopt._meshOptData;
            }
            const buffer = ArrayItem.Get(`${context}/buffer`, this._loader.gltf.buffers, extension.buffer);
            bufferViewMeshopt._meshOptData = this._loader
                .loadBufferAsync(`/buffers/${buffer.index}`, buffer, extension.byteOffset || 0, extension.byteLength)
                // eslint-disable-next-line github/no-then
                .then(async (buffer) => {
                return await MeshoptCompression.Default.decodeGltfBufferAsync(buffer, extension.count, extension.byteStride, extension.mode, extension.filter);
            });
            return await bufferViewMeshopt._meshOptData;
        });
    }
}
let _Registered = false;
/**
 * Registers the EXT_meshopt_compression glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function RegisterEXT_meshopt_compression() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    unregisterGLTFExtension(NAME);
    registerGLTFExtension(NAME, true, (loader) => new EXT_meshopt_compression(loader));
}
//# sourceMappingURL=EXT_meshopt_compression.pure.js.map