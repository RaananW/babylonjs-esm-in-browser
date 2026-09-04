/** This file must only contain pure code and pure imports */
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Defines a block used to receive a value from a teleport entry point
 */
export class ParticleTeleportOutBlock extends NodeParticleBlock {
    /**
     * Create a new ParticleTeleportOutBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        /** @internal */
        this._entryPoint = null;
        /** @internal */
        this._tempEntryPointUniqueId = null;
        this._isTeleportOut = true;
        this.registerOutput("output", NodeParticleBlockConnectionPointTypes.BasedOnInput);
    }
    /**
     * Gets the entry point
     */
    get entryPoint() {
        return this._entryPoint;
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "ParticleTeleportOutBlock";
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    /** Detach from entry point */
    detach() {
        if (!this._entryPoint) {
            return;
        }
        this._entryPoint.detachFromEndpoint(this);
    }
    _build() {
        // Do nothing
        // All work done by the emitter
    }
    _customBuildStep(state) {
        if (this.entryPoint) {
            this.entryPoint.build(state);
        }
    }
    /**
     * Clone the current block to a new identical block
     * @returns a copy of the current block
     */
    clone() {
        const clone = super.clone();
        if (this.entryPoint) {
            this.entryPoint.attachToEndpoint(clone);
        }
        return clone;
    }
    /**
     * Serializes this block in a JSON representation
     * @returns the serialized block object
     */
    serialize() {
        const serializationObject = super.serialize();
        serializationObject.entryPoint = this.entryPoint?.uniqueId ?? "";
        return serializationObject;
    }
    _deserialize(serializationObject) {
        super._deserialize(serializationObject);
        this._tempEntryPointUniqueId = serializationObject.entryPoint;
    }
}
let _Registered = false;
/**
 * Register side effects for particleTeleportOutBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterParticleTeleportOutBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ParticleTeleportOutBlock", ParticleTeleportOutBlock);
}
//# sourceMappingURL=particleTeleportOutBlock.pure.js.map