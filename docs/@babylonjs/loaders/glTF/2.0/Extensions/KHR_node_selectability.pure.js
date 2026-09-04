import { registerGLTFExtension, unregisterGLTFExtension } from "../glTFLoaderExtensionRegistry.js";
import { addNewInteractivityFlowGraphMapping } from "./KHR_interactivity/declarationMapper.js";
import { AddObjectAccessorToKey } from "./objectModelMapping.js";
const NAME = "KHR_node_selectability";
// add the interactivity mapping for the onSelect event
// object model extension for selectable
/**
 * Loader extension for KHR_selectability
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class KHR_node_selectability {
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
            if (node.extensions?.KHR_node_selectability && node.extensions?.KHR_node_selectability.selectable === false) {
                node._babylonTransformNode?.getChildMeshes().forEach((mesh) => {
                    mesh.isPickable = false;
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
 * Registers KHR_node_selectability runtime dependencies without changing the extension registry.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function _RegisterKHRNodeSelectabilityRuntime() {
    if (_RuntimeRegistered) {
        return;
    }
    _RuntimeRegistered = true;
    addNewInteractivityFlowGraphMapping("event/onSelect", NAME, {
        // using GetVariable as the nodeIndex is a configuration and not a value (i.e. it's not mutable)
        blocks: ["FlowGraphMeshPickEventBlock" /* FlowGraphBlockNames.MeshPickEvent */, "FlowGraphGetVariableBlock" /* FlowGraphBlockNames.GetVariable */, "FlowGraphIndexOfBlock" /* FlowGraphBlockNames.IndexOf */, "KHR_interactivity/FlowGraphGLTFDataProvider"],
        configuration: {
            stopPropagation: { name: "stopPropagation" },
            nodeIndex: {
                name: "variable",
                toBlock: "FlowGraphGetVariableBlock" /* FlowGraphBlockNames.GetVariable */,
                dataTransformer(data) {
                    return "pickedMesh_" + data;
                },
            },
        },
        outputs: {
            values: {
                selectedNodeIndex: { name: "index", toBlock: "FlowGraphIndexOfBlock" /* FlowGraphBlockNames.IndexOf */ },
                // `selectedNode` is the new ref-typed output from the Opaque-Reference
                // spec update. It's the picked Babylon mesh itself, available directly
                // from FlowGraphMeshPickEventBlock.pickedMesh — no IndexOf lookup needed.
                selectedNode: { name: "pickedMesh", toBlock: "FlowGraphMeshPickEventBlock" /* FlowGraphBlockNames.MeshPickEvent */ },
                controllerIndex: { name: "pointerId" },
                selectionPoint: { name: "pickedPoint" },
                selectionRayOrigin: { name: "pickOrigin" },
            },
            flows: {
                out: { name: "done" },
            },
        },
        interBlockConnectors: [
            {
                input: "asset",
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
                output: "pickedMesh",
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
            const variableName = "pickedMesh_" + nodeIndex;
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
    AddObjectAccessorToKey("/nodes/{}/extensions/KHR_node_selectability/selectable", {
        get: (node) => {
            const tn = node._babylonTransformNode;
            if (tn && tn.isPickable !== undefined) {
                return tn.isPickable;
            }
            return true;
        },
        set: (value, node) => {
            node._primitiveBabylonMeshes?.forEach((mesh) => {
                mesh.isPickable = value;
            });
        },
        getTarget: (node) => node._babylonTransformNode,
        getPropertyName: [() => "isPickable"],
        type: "boolean",
    });
}
let _Registered = false;
/**
 * Registers the KHR_node_selectability glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function RegisterKHR_node_selectability() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    _RegisterKHRNodeSelectabilityRuntime();
    unregisterGLTFExtension(NAME);
    registerGLTFExtension(NAME, true, (loader) => new KHR_node_selectability(loader));
}
//# sourceMappingURL=KHR_node_selectability.pure.js.map