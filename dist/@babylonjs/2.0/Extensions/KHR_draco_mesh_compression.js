import { DracoCompression } from "@babylonjs/core/Meshes/Compression/dracoCompression.js";
import { VertexBuffer } from "@babylonjs/core/Buffers/buffer.js";
import { Geometry } from "@babylonjs/core/Meshes/geometry.js";
import { GLTFLoader, ArrayItem } from "../glTFLoader.js";
const NAME = "KHR_draco_mesh_compression";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_draco_mesh_compression/README.md)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class KHR_draco_mesh_compression {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME;
        this._loader = loader;
        this.enabled = DracoCompression.DecoderAvailable && this._loader.isExtensionUsed(NAME);
    }
    /** @internal */
    dispose() {
        delete this.dracoCompression;
        this._loader = null;
    }
    /**
     * @internal
     */
    _loadVertexDataAsync(context, primitive, babylonMesh) {
        return GLTFLoader.LoadExtensionAsync(context, primitive, this.name, (extensionContext, extension) => {
            if (primitive.mode != undefined) {
                if (primitive.mode !== 5 /* TRIANGLE_STRIP */ && primitive.mode !== 4 /* TRIANGLES */) {
                    throw new Error(`${context}: Unsupported mode ${primitive.mode}`);
                }
                // TODO: handle triangle strips
                if (primitive.mode === 5 /* TRIANGLE_STRIP */) {
                    throw new Error(`${context}: Mode ${primitive.mode} is not currently supported`);
                }
            }
            const attributes = {};
            const dividers = {};
            const loadAttribute = (name, kind) => {
                const uniqueId = extension.attributes[name];
                if (uniqueId === undefined || primitive.attributes[name] === undefined) {
                    return;
                }
                attributes[kind] = uniqueId;
                const accessor = ArrayItem.Get(`${context}/attributes/${name}`, this._loader.gltf.accessors, primitive.attributes[name]);
                if (accessor.normalized && accessor.componentType !== 5126 /* FLOAT */) {
                    let divider = 1;
                    switch (accessor.componentType) {
                        case 5120 /* BYTE */:
                            divider = 127.0;
                            break;
                        case 5121 /* UNSIGNED_BYTE */:
                            divider = 255.0;
                            break;
                        case 5122 /* SHORT */:
                            divider = 32767.0;
                            break;
                        case 5123 /* UNSIGNED_SHORT */:
                            divider = 65535.0;
                            break;
                    }
                    dividers[kind] = divider;
                }
                babylonMesh._delayInfo = babylonMesh._delayInfo || [];
                if (babylonMesh._delayInfo.indexOf(kind) === -1) {
                    babylonMesh._delayInfo.push(kind);
                }
            };
            loadAttribute("POSITION", VertexBuffer.PositionKind);
            loadAttribute("NORMAL", VertexBuffer.NormalKind);
            loadAttribute("TANGENT", VertexBuffer.TangentKind);
            loadAttribute("TEXCOORD_0", VertexBuffer.UVKind);
            loadAttribute("TEXCOORD_1", VertexBuffer.UV2Kind);
            loadAttribute("TEXCOORD_2", VertexBuffer.UV3Kind);
            loadAttribute("TEXCOORD_3", VertexBuffer.UV4Kind);
            loadAttribute("TEXCOORD_4", VertexBuffer.UV5Kind);
            loadAttribute("TEXCOORD_5", VertexBuffer.UV6Kind);
            loadAttribute("JOINTS_0", VertexBuffer.MatricesIndicesKind);
            loadAttribute("WEIGHTS_0", VertexBuffer.MatricesWeightsKind);
            loadAttribute("COLOR_0", VertexBuffer.ColorKind);
            const bufferView = ArrayItem.Get(extensionContext, this._loader.gltf.bufferViews, extension.bufferView);
            if (!bufferView._dracoBabylonGeometry) {
                bufferView._dracoBabylonGeometry = this._loader.loadBufferViewAsync(`/bufferViews/${bufferView.index}`, bufferView).then((data) => {
                    const dracoCompression = this.dracoCompression || DracoCompression.Default;
                    return dracoCompression
                        .decodeMeshAsync(data, attributes, dividers)
                        .then((babylonVertexData) => {
                        const babylonGeometry = new Geometry(babylonMesh.name, this._loader.babylonScene);
                        babylonVertexData.applyToGeometry(babylonGeometry);
                        return babylonGeometry;
                    })
                        .catch((error) => {
                        throw new Error(`${context}: ${error.message}`);
                    });
                });
            }
            return bufferView._dracoBabylonGeometry;
        });
    }
}
GLTFLoader.RegisterExtension(NAME, (loader) => new KHR_draco_mesh_compression(loader));
//# sourceMappingURL=KHR_draco_mesh_compression.js.map