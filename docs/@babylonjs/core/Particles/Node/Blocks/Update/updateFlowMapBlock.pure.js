/** This file must only contain pure code and pure imports */
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { _ConnectAtTheEnd } from "../../../Queue/executionQueue.js";
import { FlowMap } from "../../../flowMap.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to update particle position based on a flow map
 */
export class UpdateFlowMapBlock extends NodeParticleBlock {
    /**
     * Create a new UpdateFlowMapBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this.registerInput("particle", NodeParticleBlockConnectionPointTypes.Particle);
        this.registerInput("flowMap", NodeParticleBlockConnectionPointTypes.Texture);
        this.registerInput("strength", NodeParticleBlockConnectionPointTypes.Float, true, 1);
        this.registerOutput("output", NodeParticleBlockConnectionPointTypes.Particle);
    }
    /**
     * Gets the particle component
     */
    get particle() {
        return this._inputs[0];
    }
    /**
     * Gets the flowMap input component
     */
    get flowMap() {
        return this._inputs[1];
    }
    /**
     * Gets the strength input component
     */
    get strength() {
        return this._inputs[2];
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "UpdateFlowMapBlock";
    }
    /**
     * Builds the block
     * @param state defines the current build state
     */
    _build(state) {
        const system = this.particle.getConnectedValue(state);
        const scene = state.scene;
        const flowMapTexture = this.flowMap.connectedPoint?.ownerBlock;
        let flowMap = null;
        if (flowMapTexture) {
            state.registerBuildPromise((async () => {
                let textureContent;
                try {
                    textureContent = await flowMapTexture.extractTextureContentAsync();
                }
                catch {
                    return;
                }
                if (!textureContent) {
                    return;
                }
                flowMap = new FlowMap(textureContent.width, textureContent.height, textureContent.data);
            })());
        }
        const processFlowMap = (particle) => {
            if (!flowMap) {
                return;
            }
            const matrix = scene.getTransformMatrix();
            const strength = this.strength.getConnectedValue(state);
            flowMap._processParticle(particle, strength * system._tempScaledUpdateSpeed, matrix);
        };
        const flowMapProcessing = {
            process: processFlowMap,
            previousItem: null,
            nextItem: null,
        };
        if (system._updateQueueStart) {
            _ConnectAtTheEnd(flowMapProcessing, system._updateQueueStart);
        }
        else {
            system._updateQueueStart = flowMapProcessing;
        }
        this.output._storedValue = system;
    }
}
let _Registered = false;
/**
 * Register side effects for updateFlowMapBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterUpdateFlowMapBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.UpdateFlowMapBlock", UpdateFlowMapBlock);
}
//# sourceMappingURL=updateFlowMapBlock.pure.js.map