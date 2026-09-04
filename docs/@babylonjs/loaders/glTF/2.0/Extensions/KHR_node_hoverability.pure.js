import { registerGLTFExtension, unregisterGLTFExtension } from "../glTFLoaderExtensionRegistry.js";
import { addNewInteractivityFlowGraphMapping } from "./KHR_interactivity/declarationMapper.js";
import { AddObjectAccessorToKey } from "./objectModelMapping.js";
const NAME = "KHR_node_hoverability";
// interactivity
const MeshPointerOverPrefix = "targetMeshPointerOver_";
const MeshPointerOutPrefix = "targetMeshPointerOut_";
/**
 * Loader extension for KHR_node_hoverability
 * @see https://github.com/KhronosGroup/glTF/pull/2426
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class KHR_node_hoverability {
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
    // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-misused-promises
    async onReady() {
        this._loader.gltf.nodes?.forEach((node) => {
            // default is true, so only apply if false
            if (node.extensions?.KHR_node_hoverability && node.extensions?.KHR_node_hoverability.hoverable === false) {
                node._babylonTransformNode?.getChildMeshes().forEach((mesh) => {
                    mesh.pointerOverDisableMeshTesting = true;
                });
            }
        });
    }
    dispose() {
        this._loader = null;
    }
}
let _RuntimeRegistered = false;
/**
 * @internal
 * Registers KHR_node_hoverability runtime dependencies without changing the extension registry.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function _RegisterKHRNodeHoverabilityRuntime() {
    if (_RuntimeRegistered) {
        return;
    }
    _RuntimeRegistered = true;
    addNewInteractivityFlowGraphMapping("event/onHoverIn", NAME, {
        // using GetVariable as the nodeIndex is a configuration and not a value (i.e. it's not mutable)
        blocks: ["FlowGraphPointerOverEventBlock" /* FlowGraphBlockNames.PointerOverEvent */, "FlowGraphGetVariableBlock" /* FlowGraphBlockNames.GetVariable */, "FlowGraphIndexOfBlock" /* FlowGraphBlockNames.IndexOf */, "KHR_interactivity/FlowGraphGLTFDataProvider"],
        configuration: {
            stopPropagation: { name: "stopPropagation" },
            nodeIndex: {
                name: "variable",
                toBlock: "FlowGraphGetVariableBlock" /* FlowGraphBlockNames.GetVariable */,
                dataTransformer(data) {
                    return MeshPointerOverPrefix + data;
                },
            },
        },
        outputs: {
            values: {
                hoverNodeIndex: { name: "index", toBlock: "FlowGraphIndexOfBlock" /* FlowGraphBlockNames.IndexOf */ },
                // `hoveredNode` is the new ref-typed output from the Opaque-Reference
                // spec update — the picked Babylon mesh itself, available directly
                // from FlowGraphPointerOverEventBlock.meshUnderPointer (no IndexOf).
                hoveredNode: { name: "meshUnderPointer", toBlock: "FlowGraphPointerOverEventBlock" /* FlowGraphBlockNames.PointerOverEvent */ },
                controllerIndex: { name: "pointerId" },
            },
            flows: {
                out: { name: "done" },
            },
        },
        interBlockConnectors: [
            {
                input: "targetMesh",
                output: "value",
                inputBlockIndex: 0,
                outputBlockIndex: 1,
                isVariable: true,
            },
            {
                input: "array",
                output: "nodes",
                inputBlockIndex: 2,
                outputBlockIndex: 3,
                isVariable: true,
            },
            {
                input: "object",
                output: "meshUnderPointer",
                inputBlockIndex: 2,
                outputBlockIndex: 0,
                isVariable: true,
            },
        ],
        extraProcessor(gltfBlock, _declaration, _mapping, _arrays, serializedObjects, context, globalGLTF) {
            // add the glTF to the configuration of the last serialized object
            const serializedObject = serializedObjects[serializedObjects.length - 1];
            serializedObject.config = serializedObject.config || {};
            serializedObject.config.glTF = globalGLTF;
            // find the listener nodeIndex value
            const nodeIndex = gltfBlock.configuration?.["nodeIndex"]?.value?.[0];
            if (nodeIndex === undefined || typeof nodeIndex !== "number") {
                throw new Error("nodeIndex not found in configuration");
            }
            const variableName = MeshPointerOverPrefix + nodeIndex;
            // find the nodeIndex value
            serializedObjects[1].config.variable = variableName;
            context._userVariables[variableName] = {
                className: "Mesh",
                id: globalGLTF?.nodes?.[nodeIndex]._babylonTransformNode?.id,
                uniqueId: globalGLTF?.nodes?.[nodeIndex]._babylonTransformNode?.uniqueId,
            };
            return serializedObjects;
        },
    });
    addNewInteractivityFlowGraphMapping("event/onHoverOut", NAME, {
        // using GetVariable as the nodeIndex is a configuration and not a value (i.e. it's not mutable)
        blocks: ["FlowGraphPointerOutEventBlock" /* FlowGraphBlockNames.PointerOutEvent */, "FlowGraphGetVariableBlock" /* FlowGraphBlockNames.GetVariable */, "FlowGraphIndexOfBlock" /* FlowGraphBlockNames.IndexOf */, "KHR_interactivity/FlowGraphGLTFDataProvider"],
        configuration: {
            stopPropagation: { name: "stopPropagation" },
            nodeIndex: {
                name: "variable",
                toBlock: "FlowGraphGetVariableBlock" /* FlowGraphBlockNames.GetVariable */,
                dataTransformer(data) {
                    return MeshPointerOutPrefix + data;
                },
            },
        },
        outputs: {
            values: {
                hoverNodeIndex: { name: "index", toBlock: "FlowGraphIndexOfBlock" /* FlowGraphBlockNames.IndexOf */ },
                // Ref-typed output: the mesh that the pointer just left.
                hoveredNode: { name: "meshOutOfPointer", toBlock: "FlowGraphPointerOutEventBlock" /* FlowGraphBlockNames.PointerOutEvent */ },
                controllerIndex: { name: "pointerId" },
            },
            flows: {
                out: { name: "done" },
            },
        },
        interBlockConnectors: [
            {
                input: "targetMesh",
                output: "value",
                inputBlockIndex: 0,
                outputBlockIndex: 1,
                isVariable: true,
            },
            {
                input: "array",
                output: "nodes",
                inputBlockIndex: 2,
                outputBlockIndex: 3,
                isVariable: true,
            },
            {
                input: "object",
                output: "meshOutOfPointer",
                inputBlockIndex: 2,
                outputBlockIndex: 0,
                isVariable: true,
            },
        ],
        extraProcessor(gltfBlock, _declaration, _mapping, _arrays, serializedObjects, context, globalGLTF) {
            // add the glTF to the configuration of the last serialized object
            const serializedObject = serializedObjects[serializedObjects.length - 1];
            serializedObject.config = serializedObject.config || {};
            serializedObject.config.glTF = globalGLTF;
            const nodeIndex = gltfBlock.configuration?.["nodeIndex"]?.value?.[0];
            if (nodeIndex === undefined || typeof nodeIndex !== "number") {
                throw new Error("nodeIndex not found in configuration");
            }
            const variableName = MeshPointerOutPrefix + nodeIndex;
            // find the nodeIndex value
            serializedObjects[1].config.variable = variableName;
            context._userVariables[variableName] = {
                className: "Mesh",
                id: globalGLTF?.nodes?.[nodeIndex]._babylonTransformNode?.id,
                uniqueId: globalGLTF?.nodes?.[nodeIndex]._babylonTransformNode?.uniqueId,
            };
            return serializedObjects;
        },
    });
    AddObjectAccessorToKey("/nodes/{}/extensions/KHR_node_hoverability/hoverable", {
        get: (node) => {
            const tn = node._babylonTransformNode;
            if (tn && tn.pointerOverDisableMeshTesting !== undefined) {
                return tn.pointerOverDisableMeshTesting;
            }
            return true;
        },
        set: (value, node) => {
            node._primitiveBabylonMeshes?.forEach((mesh) => {
                mesh.pointerOverDisableMeshTesting = !value;
            });
        },
        getTarget: (node) => node._babylonTransformNode,
        getPropertyName: [() => "pointerOverDisableMeshTesting"],
        type: "boolean",
    });
}
let _Registered = false;
/**
 * Registers the KHR_node_hoverability glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function RegisterKHR_node_hoverability() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    _RegisterKHRNodeHoverabilityRuntime();
    unregisterGLTFExtension(NAME);
    registerGLTFExtension(NAME, true, (loader) => new KHR_node_hoverability(loader));
}
//# sourceMappingURL=KHR_node_hoverability.pure.js.map