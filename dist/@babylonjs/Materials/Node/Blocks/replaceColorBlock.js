import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../Enums/nodeMaterialBlockTargets.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to replace a color by another one
 */
export class ReplaceColorBlock extends NodeMaterialBlock {
    /**
     * Creates a new ReplaceColorBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name, NodeMaterialBlockTargets.Neutral);
        this.registerInput("value", NodeMaterialBlockConnectionPointTypes.AutoDetect);
        this.registerInput("reference", NodeMaterialBlockConnectionPointTypes.AutoDetect);
        this.registerInput("distance", NodeMaterialBlockConnectionPointTypes.Float);
        this.registerInput("replacement", NodeMaterialBlockConnectionPointTypes.AutoDetect);
        this.registerOutput("output", NodeMaterialBlockConnectionPointTypes.BasedOnInput);
        this._outputs[0]._typeConnectionSource = this._inputs[0];
        this._linkConnectionTypes(0, 1);
        this._linkConnectionTypes(0, 3);
        this._inputs[0].excludedConnectionPointTypes.push(NodeMaterialBlockConnectionPointTypes.Float);
        this._inputs[0].excludedConnectionPointTypes.push(NodeMaterialBlockConnectionPointTypes.Matrix);
        this._inputs[1].excludedConnectionPointTypes.push(NodeMaterialBlockConnectionPointTypes.Float);
        this._inputs[1].excludedConnectionPointTypes.push(NodeMaterialBlockConnectionPointTypes.Matrix);
        this._inputs[3].excludedConnectionPointTypes.push(NodeMaterialBlockConnectionPointTypes.Float);
        this._inputs[3].excludedConnectionPointTypes.push(NodeMaterialBlockConnectionPointTypes.Matrix);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "ReplaceColorBlock";
    }
    /**
     * Gets the value input component
     */
    get value() {
        return this._inputs[0];
    }
    /**
     * Gets the reference input component
     */
    get reference() {
        return this._inputs[1];
    }
    /**
     * Gets the distance input component
     */
    get distance() {
        return this._inputs[2];
    }
    /**
     * Gets the replacement input component
     */
    get replacement() {
        return this._inputs[3];
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    _buildBlock(state) {
        super._buildBlock(state);
        const output = this._outputs[0];
        state.compilationString += this._declareOutput(output, state) + `;\r\n`;
        state.compilationString += `if (length(${this.value.associatedVariableName} - ${this.reference.associatedVariableName}) < ${this.distance.associatedVariableName}) {\r\n`;
        state.compilationString += `${output.associatedVariableName} = ${this.replacement.associatedVariableName};\r\n`;
        state.compilationString += `} else {\r\n`;
        state.compilationString += `${output.associatedVariableName} = ${this.value.associatedVariableName};\r\n`;
        state.compilationString += `}\r\n`;
        return this;
    }
}
RegisterClass("BABYLON.ReplaceColorBlock", ReplaceColorBlock);
//# sourceMappingURL=replaceColorBlock.js.map