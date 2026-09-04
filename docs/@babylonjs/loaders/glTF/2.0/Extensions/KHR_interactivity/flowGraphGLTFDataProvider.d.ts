import { type IFlowGraphBlockConfiguration, FlowGraphBlock } from "@babylonjs/core/FlowGraph/flowGraphBlock.js";
import { type IGLTF } from "../../glTFLoaderInterfaces.js";
import { type FlowGraphDataConnection } from "@babylonjs/core/FlowGraph/flowGraphDataConnection.js";
import { type AnimationGroup } from "@babylonjs/core/Animations/animationGroup.js";
import { type TransformNode } from "@babylonjs/core/Meshes/transformNode.js";
/**
 * a configuration interface for this block
 */
export interface IFlowGraphGLTFDataProviderBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * the glTF object to provide data from
     */
    glTF: IGLTF;
}
/**
 * a glTF-based FlowGraph block that provides arrays with babylon object, based on the glTF tree
 * Can be used, for example, to get animation index from a glTF animation
 */
export declare class FlowGraphGLTFDataProvider extends FlowGraphBlock {
    /**
     * Output: an array of animation groups
     * Corresponds directly to the glTF animations array
     */
    readonly animationGroups: FlowGraphDataConnection<AnimationGroup[]>;
    /**
     * Output an array of (Transform) nodes
     * Corresponds directly to the glTF nodes array
     */
    readonly nodes: FlowGraphDataConnection<TransformNode[]>;
    constructor(config: IFlowGraphGLTFDataProviderBlockConfiguration);
    getClassName(): string;
}
