/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to test if the fragment shader is front facing
 */
export class FrontFacingBlock extends NodeMaterialBlock {
    /**
     * Creates a new FrontFacingBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name, NodeMaterialBlockTargets.Fragment);
        this.registerOutput("output", NodeMaterialBlockConnectionPointTypes.Float, NodeMaterialBlockTargets.Fragment);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "FrontFacingBlock";
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    _buildBlock(state) {
        super._buildBlock(state);
        if (state.target === NodeMaterialBlockTargets.Vertex) {
            state.sharedData.raiseBuildError("FrontFacingBlock must only be used in a fragment shader");
            return this;
        }
        const output = this._outputs[0];
        state.compilationString +=
            state._declareOutput(output) +
                ` = ${state._generateTernary("1.0", "0.0", state.shaderLanguage === 0 /* ShaderLanguage.GLSL */ ? "gl_FrontFacing" : "fragmentInputs.frontFacing")};\n`;
        return this;
    }
}
let _Registered = false;
/**
 * Register side effects for frontFacingBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFrontFacingBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.FrontFacingBlock", FrontFacingBlock);
}
//# sourceMappingURL=frontFacingBlock.pure.js.map