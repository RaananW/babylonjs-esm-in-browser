/** This file must only contain pure code and pure imports */
import { FlowGraphBlock } from "../../flowGraphBlock.js";
import { RichTypeAny, RichTypeVector3 } from "../../flowGraphRichTypes.pure.js";
import { TmpVectors, Vector3 } from "../../../Maths/math.vector.pure.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * This blocks transforms a vector from one coordinate system to another.
 */
export class FlowGraphTransformCoordinatesSystemBlock extends FlowGraphBlock {
    /**
     * Creates a new FlowGraphCoordinateTransformBlock
     * @param config optional configuration for this block
     */
    constructor(config) {
        super(config);
        this.sourceSystem = this.registerDataInput("sourceSystem", RichTypeAny);
        this.destinationSystem = this.registerDataInput("destinationSystem", RichTypeAny);
        this.inputCoordinates = this.registerDataInput("inputCoordinates", RichTypeVector3);
        this.outputCoordinates = this.registerDataOutput("outputCoordinates", RichTypeVector3);
    }
    _updateOutputs(_context) {
        const sourceSystemValue = this.sourceSystem.getValue(_context);
        const destinationSystemValue = this.destinationSystem.getValue(_context);
        const inputCoordinatesValue = this.inputCoordinates.getValue(_context);
        // takes coordinates from source space to world space
        const sourceWorld = sourceSystemValue.getWorldMatrix();
        // takes coordinates from destination space to world space
        const destinationWorld = destinationSystemValue.getWorldMatrix();
        const destinationWorldInverse = TmpVectors.Matrix[0].copyFrom(destinationWorld);
        // takes coordinates from world space to destination space
        destinationWorldInverse.invert();
        const sourceToDestination = TmpVectors.Matrix[1];
        // takes coordinates from source space to world space to destination space
        destinationWorldInverse.multiplyToRef(sourceWorld, sourceToDestination);
        const outputCoordinatesValue = this.outputCoordinates.getValue(_context);
        Vector3.TransformCoordinatesToRef(inputCoordinatesValue, sourceToDestination, outputCoordinatesValue);
    }
    /**
     * Gets the class name of this block
     * @returns the class name
     */
    getClassName() {
        return "FlowGraphTransformCoordinatesSystemBlock" /* FlowGraphBlockNames.TransformCoordinatesSystem */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphTransformCoordinatesSystemBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphTransformCoordinatesSystemBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphTransformCoordinatesSystemBlock" /* FlowGraphBlockNames.TransformCoordinatesSystem */, FlowGraphTransformCoordinatesSystemBlock);
}
//# sourceMappingURL=flowGraphTransformCoordinatesSystemBlock.pure.js.map