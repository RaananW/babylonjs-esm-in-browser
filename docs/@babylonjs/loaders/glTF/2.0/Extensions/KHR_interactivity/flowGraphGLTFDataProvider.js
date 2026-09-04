import { FlowGraphBlock } from "@babylonjs/core/FlowGraph/flowGraphBlock.js";
import { RichTypeAny } from "@babylonjs/core/FlowGraph/flowGraphRichTypes.js";
/**
 * a glTF-based FlowGraph block that provides arrays with babylon object, based on the glTF tree
 * Can be used, for example, to get animation index from a glTF animation
 */
export class FlowGraphGLTFDataProvider extends FlowGraphBlock {
    constructor(config) {
        super(config);
        const glTF = config.glTF;
        // glTF may be undefined when the block is re-created from serialized data
        // (e.g. in the Flow Graph Editor) where the live glTF parse tree is unavailable.
        const animationGroups = glTF?.animations?.map((a) => a._babylonAnimationGroup) || [];
        this.animationGroups = this.registerDataOutput("animationGroups", RichTypeAny, animationGroups);
        const nodes = glTF?.nodes?.map((n) => n._babylonTransformNode) || [];
        this.nodes = this.registerDataOutput("nodes", RichTypeAny, nodes);
    }
    getClassName() {
        return "FlowGraphGLTFDataProvider";
    }
}
//# sourceMappingURL=flowGraphGLTFDataProvider.js.map