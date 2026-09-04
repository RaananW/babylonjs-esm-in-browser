import { Vector3, Quaternion, Matrix, TmpVectors } from "@babylonjs/core/Maths/math.vector.pure.js";
import { Logger } from "@babylonjs/core/Misc/logger.js";
import { GLTFLoader, ArrayItem } from "../glTFLoader.pure.js";
import { registerGLTFExtension, unregisterGLTFExtension } from "../glTFLoaderExtensionRegistry.js";
const NAME = "EXT_mesh_gpu_instancing";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Vendor/EXT_mesh_gpu_instancing/README.md)
 * [Playground Sample](https://playground.babylonjs.com/#QFIGLW#9)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class EXT_mesh_gpu_instancing {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME;
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
    loadNodeAsync(context, node, assign) {
        return GLTFLoader.LoadExtensionAsync(context, node, this.name, async (extensionContext, extension) => {
            this._loader._disableInstancedMesh++;
            const promise = this._loader.loadNodeAsync(`/nodes/${node.index}`, node, assign);
            this._loader._disableInstancedMesh--;
            if (!node._primitiveBabylonMeshes) {
                return await promise;
            }
            const promises = new Array();
            let instanceCount = 0;
            const loadAttribute = (attribute) => {
                if (extension.attributes[attribute] == undefined) {
                    promises.push(Promise.resolve(null));
                    return;
                }
                const accessor = ArrayItem.Get(`${extensionContext}/attributes/${attribute}`, this._loader.gltf.accessors, extension.attributes[attribute]);
                promises.push(this._loader._loadFloatAccessorAsync(`/accessors/${accessor.bufferView}`, accessor));
                if (instanceCount === 0) {
                    instanceCount = accessor.count;
                }
                else if (instanceCount !== accessor.count) {
                    throw new Error(`${extensionContext}/attributes: Instance buffer accessors do not have the same count.`);
                }
            };
            loadAttribute("TRANSLATION");
            loadAttribute("ROTATION");
            loadAttribute("SCALE");
            loadAttribute("_COLOR_0");
            // eslint-disable-next-line github/no-then
            return await promise.then(async (babylonTransformNode) => {
                const [translationBuffer, rotationBuffer, scaleBuffer, colorBuffer] = await Promise.all(promises);
                const matrices = new Float32Array(instanceCount * 16);
                TmpVectors.Vector3[0].copyFromFloats(0, 0, 0); // translation
                TmpVectors.Quaternion[0].copyFromFloats(0, 0, 0, 1); // rotation
                TmpVectors.Vector3[1].copyFromFloats(1, 1, 1); // scale
                for (let i = 0; i < instanceCount; ++i) {
                    translationBuffer && Vector3.FromArrayToRef(translationBuffer, i * 3, TmpVectors.Vector3[0]);
                    rotationBuffer && Quaternion.FromArrayToRef(rotationBuffer, i * 4, TmpVectors.Quaternion[0]);
                    scaleBuffer && Vector3.FromArrayToRef(scaleBuffer, i * 3, TmpVectors.Vector3[1]);
                    Matrix.ComposeToRef(TmpVectors.Vector3[1], TmpVectors.Quaternion[0], TmpVectors.Vector3[0], TmpVectors.Matrix[0]);
                    TmpVectors.Matrix[0].copyToArray(matrices, i * 16);
                }
                for (const babylonMesh of node._primitiveBabylonMeshes) {
                    babylonMesh.thinInstanceSetBuffer("matrix", matrices, 16, true);
                    if (colorBuffer) {
                        if (colorBuffer.length === instanceCount * 3) {
                            babylonMesh.thinInstanceSetBuffer("color", colorBuffer, 3, true);
                        }
                        else if (colorBuffer.length === instanceCount * 4) {
                            babylonMesh.thinInstanceSetBuffer("color", colorBuffer, 4, true);
                        }
                        else {
                            Logger.Warn("Unexpected size of _COLOR_0 attribute for mesh " + babylonMesh.name);
                        }
                    }
                }
                return babylonTransformNode;
            });
        });
    }
}
let _Registered = false;
/**
 * Registers the EXT_mesh_gpu_instancing glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function RegisterEXT_mesh_gpu_instancing() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    unregisterGLTFExtension(NAME);
    registerGLTFExtension(NAME, true, (loader) => new EXT_mesh_gpu_instancing(loader));
}
//# sourceMappingURL=EXT_mesh_gpu_instancing.pure.js.map