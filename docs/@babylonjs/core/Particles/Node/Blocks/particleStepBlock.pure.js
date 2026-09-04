/** This file must only contain pure code and pure imports */
import { Vector2, Vector3 } from "../../../Maths/math.vector.pure.js";
import { Color4 } from "../../../Maths/math.color.pure.js";
import { NodeParticleBlock } from "../nodeParticleBlock.js";
import { NodeParticleBlockConnectionPointTypes } from "../Enums/nodeParticleBlockConnectionPointTypes.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to step a value
 */
export class ParticleStepBlock extends NodeParticleBlock {
    /**
     * Creates a new ParticleStepBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this.registerInput("value", NodeParticleBlockConnectionPointTypes.AutoDetect);
        this.registerInput("edge", NodeParticleBlockConnectionPointTypes.Float, true, 0);
        this.registerOutput("output", NodeParticleBlockConnectionPointTypes.BasedOnInput);
        this._outputs[0]._typeConnectionSource = this._inputs[0];
        this._inputs[0].excludedConnectionPointTypes.push(NodeParticleBlockConnectionPointTypes.Matrix);
        this._inputs[0].excludedConnectionPointTypes.push(NodeParticleBlockConnectionPointTypes.Particle);
        this._inputs[0].excludedConnectionPointTypes.push(NodeParticleBlockConnectionPointTypes.Texture);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "ParticleStepBlock";
    }
    /**
     * Gets the value operand input component
     */
    get value() {
        return this._inputs[0];
    }
    /**
     * Gets the edge operand input component
     */
    get edge() {
        return this._inputs[1];
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    _build() {
        if (!this.value.isConnected) {
            this.output._storedFunction = null;
            this.output._storedValue = null;
            return;
        }
        const func = (value, edge) => {
            if (value < edge) {
                return 0;
            }
            return 1;
        };
        this.output._storedFunction = (state) => {
            const source = this.value.getConnectedValue(state);
            const edge = this.edge.getConnectedValue(state);
            switch (this.value.type) {
                case NodeParticleBlockConnectionPointTypes.Int:
                case NodeParticleBlockConnectionPointTypes.Float: {
                    return func(source, edge);
                }
                case NodeParticleBlockConnectionPointTypes.Vector2: {
                    return new Vector2(func(source.x, edge), func(source.y, edge));
                }
                case NodeParticleBlockConnectionPointTypes.Vector3: {
                    return new Vector3(func(source.x, edge), func(source.y, edge), func(source.z, edge));
                }
                case NodeParticleBlockConnectionPointTypes.Color4: {
                    return new Color4(func(source.r, edge), func(source.g, edge), func(source.b, edge), func(source.a, edge));
                }
            }
            return 0;
        };
        return this;
    }
}
let _Registered = false;
/**
 * Register side effects for particleStepBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterParticleStepBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ParticleStepBlock", ParticleStepBlock);
}
//# sourceMappingURL=particleStepBlock.pure.js.map