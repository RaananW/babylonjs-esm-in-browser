/** This file must only contain pure code and pure imports */
import { NodeParticleBlock } from "../nodeParticleBlock.js";
import { NodeParticleBlockConnectionPointTypes } from "../Enums/nodeParticleBlockConnectionPointTypes.js";
import { Lerp } from "../../../Maths/math.scalar.functions.js";
import { Color4 } from "../../../Maths/math.color.pure.js";
import { Vector2, Vector3 } from "../../../Maths/math.vector.pure.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to define a list of gradient entries
 */
export class ParticleGradientBlock extends NodeParticleBlock {
    /**
     * Creates a new ParticleGradientBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this._entryCount = 1;
        this.registerInput("gradient", NodeParticleBlockConnectionPointTypes.Float, true, 1, 0, 1);
        this.registerInput("value0", NodeParticleBlockConnectionPointTypes.AutoDetect);
        this.registerOutput("output", NodeParticleBlockConnectionPointTypes.BasedOnInput);
        this._outputs[0]._typeConnectionSource = this._inputs[1];
        this._outputs[0]._typeConnectionSourceTranslation = (type) => {
            switch (type) {
                case NodeParticleBlockConnectionPointTypes.FloatGradient:
                    return NodeParticleBlockConnectionPointTypes.Float;
                case NodeParticleBlockConnectionPointTypes.Vector2Gradient:
                    return NodeParticleBlockConnectionPointTypes.Vector2;
                case NodeParticleBlockConnectionPointTypes.Vector3Gradient:
                    return NodeParticleBlockConnectionPointTypes.Vector3;
                case NodeParticleBlockConnectionPointTypes.Color4Gradient:
                    return NodeParticleBlockConnectionPointTypes.Color4;
            }
            return type;
        };
        this._inputs[1].addExcludedConnectionPointFromAllowedTypes(NodeParticleBlockConnectionPointTypes.FloatGradient |
            NodeParticleBlockConnectionPointTypes.Vector2Gradient |
            NodeParticleBlockConnectionPointTypes.Vector3Gradient |
            NodeParticleBlockConnectionPointTypes.Color4Gradient);
        this._manageExtendedInputs(1);
    }
    _extend() {
        this._entryCount++;
        this.registerInput("value" + (this._entryCount - 1), NodeParticleBlockConnectionPointTypes.AutoDetect, true);
        this._linkConnectionTypes(1, this._entryCount);
        this._manageExtendedInputs(this._entryCount);
    }
    _reduce() {
        // Remove the last input if it's not connected and we have more than one entry
        for (let i = this._inputs.length - 2; i >= 1; i--) {
            if (this._inputs[i].isConnected) {
                break;
            }
            const inputToRemove = this._inputs[i];
            inputToRemove.dispose();
            this._inputs.splice(i, 1);
            this._entryCount--;
            this.onInputChangedObservable.notifyObservers(inputToRemove);
        }
        // Rename inputs
        for (let i = 1; i < this._inputs.length; i++) {
            this._inputs[i].name = "value" + (i - 1);
        }
    }
    _manageExtendedInputs(index) {
        this._inputs[index].onConnectionObservable.add(() => {
            if (this._entryCount > index) {
                return;
            }
            // Need to add a new input
            this._extend();
        });
        this._inputs[index].onDisconnectionObservable.add(() => {
            this._reduce();
        });
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "ParticleGradientBlock";
    }
    /**
     * Gets the gradient operand input component
     */
    get gradient() {
        return this._inputs[0];
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    _build() {
        // Building the list of entries in order
        const entries = [];
        for (let i = 1; i < this._inputs.length; i++) {
            if (this._inputs[i].isConnected) {
                entries.push(this._inputs[i].connectedPoint?.ownerBlock);
            }
        }
        entries.sort((a, b) => {
            return a.reference - b.reference;
        });
        this.output._storedFunction = (state) => {
            const gradient = this.gradient.getConnectedValue(state);
            if (entries.length === 1) {
                return entries[0].value.getConnectedValue(state);
            }
            // Go down the entries list in reverse order
            let nextEntry = null;
            for (let i = entries.length - 1; i >= 0; i--) {
                const entry = entries[i];
                if (entry.reference <= gradient) {
                    const currentValue = entry.value.getConnectedValue(state);
                    if (nextEntry) {
                        const nextValue = nextEntry.value.getConnectedValue(state);
                        const nextReference = nextEntry.reference;
                        const currentReference = entry.reference;
                        const scale = Math.max(0, Math.min(1, (gradient - currentReference) / (nextReference - currentReference)));
                        switch (this.output.type) {
                            case NodeParticleBlockConnectionPointTypes.Float:
                                return Lerp(currentValue, nextValue, scale);
                            case NodeParticleBlockConnectionPointTypes.Vector2:
                                return Vector2.Lerp(currentValue, nextValue, scale);
                            case NodeParticleBlockConnectionPointTypes.Vector3:
                                return Vector3.Lerp(currentValue, nextValue, scale);
                            case NodeParticleBlockConnectionPointTypes.Color4:
                                return Color4.Lerp(currentValue, nextValue, scale);
                        }
                    }
                    return currentValue;
                }
                nextEntry = entry;
            }
            return 0;
        };
    }
    serialize() {
        const serializationObject = super.serialize();
        serializationObject._entryCount = this._entryCount;
        return serializationObject;
    }
    _deserialize(serializationObject) {
        super._deserialize(serializationObject);
        if (serializationObject._entryCount && serializationObject._entryCount > 1) {
            for (let i = 1; i < serializationObject._entryCount; i++) {
                this._extend();
            }
        }
    }
}
let _Registered = false;
/**
 * Register side effects for particleGradientBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterParticleGradientBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ParticleGradientBlock", ParticleGradientBlock);
}
//# sourceMappingURL=particleGradientBlock.pure.js.map