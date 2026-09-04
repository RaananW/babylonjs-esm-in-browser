/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../Enums/nodeMaterialBlockTargets.js";
import { InputBlock } from "./Input/inputBlock.pure.js";
import { AnimatedInputBlockTypes } from "./Input/animatedInputBlockTypes.js";
import { NodeMaterialModes } from "../Enums/nodeMaterialModes.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to pan UV coordinates over time (similar to Unreal's Panner node).
 * This block takes UV coordinates, speed values for X and Y axes, and a time input,
 * then outputs animated UV coordinates that scroll based on the speed and time.
 */
export class PannerBlock extends NodeMaterialBlock {
    /**
     * Creates a new PannerBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name, NodeMaterialBlockTargets.Neutral);
        this.registerInput("uv", NodeMaterialBlockConnectionPointTypes.Vector2);
        this.registerInput("speed", NodeMaterialBlockConnectionPointTypes.Vector2);
        this.registerInput("time", NodeMaterialBlockConnectionPointTypes.Float);
        this.registerOutput("output", NodeMaterialBlockConnectionPointTypes.Vector2);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "PannerBlock";
    }
    /**
     * Gets the uv input component
     */
    get uv() {
        return this._inputs[0];
    }
    /**
     * Gets the speed input component
     */
    get speed() {
        return this._inputs[1];
    }
    /**
     * Gets the time input component
     */
    get time() {
        return this._inputs[2];
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    /**
     * Auto configure the block based on the material
     * @param material - the node material
     * @param additionalFilteringInfo - additional filtering info
     */
    autoConfigure(material, additionalFilteringInfo = () => true) {
        if (!this.uv.isConnected) {
            if (material.mode !== NodeMaterialModes.PostProcess && material.mode !== NodeMaterialModes.ProceduralTexture) {
                const attributeName = material.mode === NodeMaterialModes.Particle ? "particle_uv" : "uv";
                let uvInput = material.getInputBlockByPredicate((b) => b.isAttribute && b.name === attributeName && additionalFilteringInfo(b));
                if (!uvInput) {
                    uvInput = new InputBlock("uv");
                    uvInput.setAsAttribute(attributeName);
                }
                uvInput.output.connectTo(this.uv);
            }
        }
        if (!this.time.isConnected) {
            let timeInput = material.getInputBlockByPredicate((b) => b.animationType === AnimatedInputBlockTypes.Time && additionalFilteringInfo(b));
            if (!timeInput) {
                timeInput = new InputBlock("time");
                timeInput.value = 0;
                timeInput.animationType = AnimatedInputBlockTypes.Time;
            }
            timeInput.output.connectTo(this.time);
        }
    }
    _buildBlock(state) {
        super._buildBlock(state);
        const output = this._outputs[0];
        // Output = UV + speed * time
        state.compilationString +=
            state._declareOutput(output) + ` = ${this.uv.associatedVariableName} + ${this.speed.associatedVariableName} * ${this.time.associatedVariableName};\n`;
        return this;
    }
}
let _Registered = false;
/**
 * Register side effects for pannerBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterPannerBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.PannerBlock", PannerBlock);
}
//# sourceMappingURL=pannerBlock.pure.js.map