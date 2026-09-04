/** This file must only contain pure code and pure imports */
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Defines a block used to teleport a value to an endpoint
 */
export class ParticleTeleportInBlock extends NodeParticleBlock {
    /** Gets the list of attached endpoints */
    get endpoints() {
        return this._endpoints;
    }
    /**
     * Create a new ParticleTeleportInBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this._endpoints = [];
        this._isTeleportIn = true;
        this.registerInput("input", NodeParticleBlockConnectionPointTypes.AutoDetect);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "ParticleTeleportInBlock";
    }
    /**
     * Gets the input component
     */
    get input() {
        return this._inputs[0];
    }
    /**
     * Checks if the current block is an ancestor of a given type
     * @param type defines the potential type to check
     * @returns true if block is a descendant
     */
    isAnAncestorOfType(type) {
        if (this.getClassName() === type) {
            return true;
        }
        for (const endpoint of this.endpoints) {
            if (endpoint.isAnAncestorOfType(type)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Checks if the current block is an ancestor of a given block
     * @param block defines the potential descendant block to check
     * @returns true if block is a descendant
     */
    isAnAncestorOf(block) {
        for (const endpoint of this.endpoints) {
            if (endpoint === block) {
                return true;
            }
            if (endpoint.isAnAncestorOf(block)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Add an enpoint to this block
     * @param endpoint define the endpoint to attach to
     */
    attachToEndpoint(endpoint) {
        endpoint.detach();
        this._endpoints.push(endpoint);
        endpoint._entryPoint = this;
        endpoint._outputs[0]._typeConnectionSource = this._inputs[0];
        endpoint._tempEntryPointUniqueId = null;
        endpoint.name = "> " + this.name;
    }
    /**
     * Remove enpoint from this block
     * @param endpoint define the endpoint to remove
     */
    detachFromEndpoint(endpoint) {
        const index = this._endpoints.indexOf(endpoint);
        if (index !== -1) {
            this._endpoints.splice(index, 1);
            endpoint._outputs[0]._typeConnectionSource = null;
            endpoint._entryPoint = null;
        }
    }
    _build() {
        for (const endpoint of this._endpoints) {
            endpoint.output._storedFunction = (state) => {
                return this.input.getConnectedValue(state);
            };
        }
    }
}
let _Registered = false;
/**
 * Register side effects for particleTeleportInBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterParticleTeleportInBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ParticleTeleportInBlock", ParticleTeleportInBlock);
}
//# sourceMappingURL=particleTeleportInBlock.pure.js.map