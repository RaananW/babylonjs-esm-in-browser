/** This file must only contain pure code and pure imports */
import { Vector2, Vector3 } from "../../../Maths/math.vector.pure.js";
import { Color4 } from "../../../Maths/math.color.pure.js";
import { NodeParticleBlock } from "../nodeParticleBlock.js";
import { NodeParticleBlockConnectionPointTypes } from "../Enums/nodeParticleBlockConnectionPointTypes.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to smooth step a value
 */
export class ParticleSmoothStepBlock extends NodeParticleBlock {
    /**
     * Creates a new ParticleSmoothStepBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this.registerInput("value", NodeParticleBlockConnectionPointTypes.AutoDetect);
        this.registerInput("edge0", NodeParticleBlockConnectionPointTypes.Float, true, 0);
        this.registerInput("edge1", NodeParticleBlockConnectionPointTypes.Float, true, 1);
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
        return "ParticleSmoothStepBlock";
    }
    /**
     * Gets the value operand input component
     */
    get value() {
        return this._inputs[0];
    }
    /**
     * Gets the first edge operand input component
     */
    get edge0() {
        return this._inputs[1];
    }
    /**
     * Gets the second edge operand input component
     */
    get edge1() {
        return this._inputs[2];
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
        const func = (value, edge0, edge1) => {
            const x = Math.max(0, Math.min((value - edge0) / (edge1 - edge0), 1));
            // Smoothstep formula: 3x^2 - 2x^3
            return x * x * (3 - 2 * x);
        };
        this.output._storedFunction = (state) => {
            const source = this.value.getConnectedValue(state);
            const edge0 = this.edge0.getConnectedValue(state);
            const edge1 = this.edge1.getConnectedValue(state);
            switch (this.value.type) {
                case NodeParticleBlockConnectionPointTypes.Int:
                case NodeParticleBlockConnectionPointTypes.Float: {
                    return func(source, edge0, edge1);
                }
                case NodeParticleBlockConnectionPointTypes.Vector2: {
                    return new Vector2(func(source.x, edge0, edge1), func(source.y, edge0, edge1));
                }
                case NodeParticleBlockConnectionPointTypes.Vector3: {
                    return new Vector3(func(source.x, edge0, edge1), func(source.y, edge0, edge1), func(source.z, edge0, edge1));
                }
                case NodeParticleBlockConnectionPointTypes.Color4: {
                    return new Color4(func(source.r, edge0, edge1), func(source.g, edge0, edge1), func(source.b, edge0, edge1), func(source.a, edge0, edge1));
                }
            }
            return 0;
        };
        return this;
    }
}
let _Registered = false;
/**
 * Register side effects for particleSmoothStepBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterParticleSmoothStepBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ParticleSmoothStepBlock", ParticleSmoothStepBlock);
}
//# sourceMappingURL=particleSmoothStepBlock.pure.js.map