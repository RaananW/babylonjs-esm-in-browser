import { GLTFLoaderExtension, GLTFLoader, GLTFLoaderBase } from "./glTFLoader.pure.js";
import { GLTFUtils } from "./glTFLoaderUtils.js";
import { EComponentType } from "./glTFLoaderInterfaces.js";
const BinaryExtensionBufferName = "binary_glTF";
/**
 * @internal
 * @deprecated
 */
export class GLTFBinaryExtension extends GLTFLoaderExtension {
    constructor() {
        super("KHR_binary_glTF");
    }
    // eslint-disable-next-line no-restricted-syntax
    loadRuntimeAsync(scene, data, rootUrl, onSuccess) {
        const extensionsUsed = data.json.extensionsUsed;
        if (!extensionsUsed || extensionsUsed.indexOf(this.name) === -1 || !data.bin) {
            return false;
        }
        this._bin = data.bin;
        onSuccess(GLTFLoaderBase.CreateRuntime(data.json, scene, rootUrl));
        return true;
    }
    // eslint-disable-next-line no-restricted-syntax
    loadBufferAsync(gltfRuntime, id, onSuccess, onError) {
        if (gltfRuntime.extensionsUsed.indexOf(this.name) === -1) {
            return false;
        }
        if (id !== BinaryExtensionBufferName) {
            return false;
        }
        // eslint-disable-next-line github/no-then
        this._bin.readAsync(0, this._bin.byteLength).then(onSuccess, (error) => onError(error.message));
        return true;
    }
    // eslint-disable-next-line no-restricted-syntax
    loadTextureBufferAsync(gltfRuntime, id, onSuccess) {
        const texture = gltfRuntime.textures[id];
        const source = gltfRuntime.images[texture.source];
        if (!source.extensions || !(this.name in source.extensions)) {
            return false;
        }
        const sourceExt = source.extensions[this.name];
        const bufferView = gltfRuntime.bufferViews[sourceExt.bufferView];
        const buffer = GLTFUtils.GetBufferFromBufferView(gltfRuntime, bufferView, 0, bufferView.byteLength, EComponentType.UNSIGNED_BYTE);
        onSuccess(buffer);
        return true;
    }
    // eslint-disable-next-line no-restricted-syntax
    loadShaderStringAsync(gltfRuntime, id, onSuccess) {
        const shader = gltfRuntime.shaders[id];
        if (!shader.extensions || !(this.name in shader.extensions)) {
            return false;
        }
        const binaryExtensionShader = shader.extensions[this.name];
        const bufferView = gltfRuntime.bufferViews[binaryExtensionShader.bufferView];
        const shaderBytes = GLTFUtils.GetBufferFromBufferView(gltfRuntime, bufferView, 0, bufferView.byteLength, EComponentType.UNSIGNED_BYTE);
        setTimeout(() => {
            const shaderString = GLTFUtils.DecodeBufferToText(shaderBytes);
            onSuccess(shaderString);
        });
        return true;
    }
}
let _Registered = false;
/**
 * Registers the KHR_binary_glTF extension.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterGLTFBinaryExtension() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    GLTFLoader.RegisterExtension(new GLTFBinaryExtension());
}
//# sourceMappingURL=glTFBinaryExtension.pure.js.map