/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Defines a block used to receive a value from a teleport entry point
 */
export class NodeMaterialTeleportOutBlock extends NodeMaterialBlock {
    /**
     * Create a new TeleportOutBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name, NodeMaterialBlockTargets.Neutral);
        /** @internal */
        this._entryPoint = null;
        /** @internal */
        this._tempEntryPointUniqueId = null;
        this.registerOutput("output", NodeMaterialBlockConnectionPointTypes.BasedOnInput);
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
        return "NodeMaterialTeleportOutBlock";
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    /**
     * Gets or sets the target of the block
     */
    get target() {
        return this._entryPoint ? this._entryPoint.target : this._target;
    }
    set target(value) {
        if ((this._target & value) !== 0) {
            return;
        }
        this._target = value;
    }
    /** Detach from entry point */
    detach() {
        if (!this._entryPoint) {
            return;
        }
        this._entryPoint.detachFromEndpoint(this);
    }
    _buildBlock(state) {
        super._buildBlock(state);
        if (!this.entryPoint) {
            return;
        }
        if (this.entryPoint.isConnectedToUniform) {
            // We skip the build if the entry point is connected to a uniform
            this.output.associatedVariableName = this.entryPoint.input.associatedVariableName;
            return;
        }
        state.compilationString += state._declareOutput(this.output) + ` = ${this.entryPoint.input.associatedVariableName};\n`;
        if (this.entryPoint.endpoints.length > 1) {
            // Check if all the endpoints are in the same shader stage
            const firstConnected = this.entryPoint.endpoints.find((e) => e.output.isConnected);
            if (firstConnected) {
                const firstTarget = firstConnected.output.isConnectedInVertexShader;
                for (const endpoint of this.entryPoint.endpoints) {
                    if (endpoint === firstConnected) {
                        continue;
                    }
                    if (endpoint.output.isConnected && endpoint.output.isConnectedInVertexShader !== firstTarget) {
                        state.sharedData.raiseBuildError(`TeleportInBlock "${this.entryPoint.name}" cannot have outputs in different shader stages. All the outputs must be in the same shader stage (vertex or fragment but not both).`);
                    }
                }
            }
        }
    }
    /**
     * Clone the current block to a new identical block
     * @param scene defines the hosting scene
     * @param rootUrl defines the root URL to use to load textures and relative dependencies
     * @returns a copy of the current block
     */
    clone(scene, rootUrl = "") {
        const clone = super.clone(scene, rootUrl);
        if (this.entryPoint) {
            this.entryPoint.attachToEndpoint(clone);
        }
        return clone;
    }
    _customBuildStep(state, activeBlocks) {
        if (this.entryPoint) {
            this.entryPoint.build(state, activeBlocks);
        }
    }
    /**
     * Dumps the code for the block
     * @param uniqueNames - the unique names
     * @param alreadyDumped - the already dumped blocks
     * @returns the code string
     */
    _dumpCode(uniqueNames, alreadyDumped) {
        let codeString = "";
        if (this.entryPoint) {
            if (alreadyDumped.indexOf(this.entryPoint) === -1) {
                codeString += this.entryPoint._dumpCode(uniqueNames, alreadyDumped);
            }
        }
        return codeString + super._dumpCode(uniqueNames, alreadyDumped);
    }
    /**
     * Dumps the code for output connections
     * @param alreadyDumped - the already dumped blocks
     * @returns the code string
     */
    _dumpCodeForOutputConnections(alreadyDumped) {
        let codeString = super._dumpCodeForOutputConnections(alreadyDumped);
        if (this.entryPoint) {
            codeString += this.entryPoint._dumpCodeForOutputConnections(alreadyDumped);
        }
        return codeString;
    }
    _dumpPropertiesCode() {
        let codeString = super._dumpPropertiesCode();
        if (this.entryPoint) {
            codeString += `${this.entryPoint._codeVariableName}.attachToEndpoint(${this._codeVariableName});\n`;
        }
        return codeString;
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
    /**
     * Deserializes the block
     * @param serializationObject - the serialization object
     * @param scene - the scene
     * @param rootUrl - the root URL
     */
    _deserialize(serializationObject, scene, rootUrl) {
        super._deserialize(serializationObject, scene, rootUrl);
        this._tempEntryPointUniqueId = serializationObject.entryPoint;
    }
}
let _Registered = false;
/**
 * Register side effects for materialsNodeBlocksTeleportTeleportOutBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterMaterialsNodeBlocksTeleportTeleportOutBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeMaterialTeleportOutBlock", NodeMaterialTeleportOutBlock);
}
//# sourceMappingURL=teleportOutBlock.pure.js.map