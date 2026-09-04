import { registerGLTFExtension, unregisterGLTFExtension } from "../glTFLoaderExtensionRegistry.js";
import { AddObjectAccessorToKey } from "./objectModelMapping.js";
const NAME = "KHR_node_visibility";
// object model extension for visibility
/**
 * Loader extension for KHR_node_visibility
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class KHR_node_visibility {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME;
        this._loader = loader;
        this.enabled = loader.isExtensionUsed(NAME);
    }
    onReady() {
        if (!this._loader) {
            return;
        }
        const nodes = this._loader.gltf.nodes;
        if (nodes) {
            for (const node of nodes) {
                const babylonTransformNode = node._babylonTransformNode;
                if (babylonTransformNode) {
                    babylonTransformNode.inheritVisibility = true;
                    if (node.extensions && node.extensions.KHR_node_visibility && node.extensions.KHR_node_visibility.visible === false) {
                        // Apply ``visible: false`` to the same set of meshes the
                        // runtime ``pointer/set`` accessor writes to. The wrapping
                        // ``babylonTransformNode`` is often a non-rendering
                        // ``TransformNode``, so setting ``isVisible`` only there
                        // leaves the primitive child meshes visible. Mirror the
                        // accessor below so assets that author hidden defaults
                        // (e.g. MagicBall.glb's FortuneWords) start hidden as intended.
                        babylonTransformNode.isVisible = false;
                        node._primitiveBabylonMeshes?.forEach((mesh) => {
                            mesh.inheritVisibility = true;
                            mesh.isVisible = false;
                        });
                    }
                }
            }
        }
    }
    dispose() {
        delete this._loader;
    }
}
let _RuntimeRegistered = false;
/**
 * @internal
 * Registers KHR_node_visibility runtime dependencies without changing the extension registry.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function _RegisterKHRNodeVisibilityRuntime() {
    if (_RuntimeRegistered) {
        return;
    }
    _RuntimeRegistered = true;
    AddObjectAccessorToKey("/nodes/{}/extensions/KHR_node_visibility/visible", {
        get: (node) => {
            const tn = node._babylonTransformNode;
            if (tn && tn.isVisible !== undefined) {
                return tn.isVisible;
            }
            return true;
        },
        set: (value, node) => {
            node._primitiveBabylonMeshes?.forEach((mesh) => {
                mesh.inheritVisibility = true;
            });
            if (node._babylonTransformNode) {
                node._babylonTransformNode.isVisible = value;
            }
            node._primitiveBabylonMeshes?.forEach((mesh) => {
                mesh.isVisible = value;
            });
        },
        getTarget: (node) => node._babylonTransformNode,
        getPropertyName: [() => "isVisible"],
        type: "boolean",
    });
}
let _Registered = false;
/**
 * Registers the KHR_node_visibility glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function RegisterKHR_node_visibility() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    _RegisterKHRNodeVisibilityRuntime();
    unregisterGLTFExtension(NAME);
    registerGLTFExtension(NAME, true, (loader) => new KHR_node_visibility(loader));
}
//# sourceMappingURL=KHR_node_visibility.pure.js.map