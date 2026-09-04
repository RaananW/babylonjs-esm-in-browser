/** This file must only contain pure code and pure imports */
import { TmpVectors, Vector3 } from "../../../../Maths/math.vector.pure.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { _ConnectAtTheEnd } from "../../../Queue/executionQueue.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to update particle position based on a noise texture
 */
export class UpdateNoiseBlock extends NodeParticleBlock {
    /**
     * Create a new UpdateNoiseBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this.registerInput("particle", NodeParticleBlockConnectionPointTypes.Particle);
        this.registerInput("noiseTexture", NodeParticleBlockConnectionPointTypes.Texture);
        this.registerInput("strength", NodeParticleBlockConnectionPointTypes.Vector3, true, new Vector3(100, 100, 100));
        this.registerOutput("output", NodeParticleBlockConnectionPointTypes.Particle);
    }
    /**
     * Gets the particle component
     */
    get particle() {
        return this._inputs[0];
    }
    /**
     * Gets the noiseTexture input component
     */
    get noiseTexture() {
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
        return "UpdateNoiseBlock";
    }
    /**
     * Builds the block
     * @param state defines the current build state
     */
    _build(state) {
        const system = this.particle.getConnectedValue(state);
        const strength = this.strength.getConnectedValue(state);
        if (!strength) {
            return;
        }
        const noiseTextureBlock = this.noiseTexture.connectedPoint?.ownerBlock;
        if (!noiseTextureBlock) {
            return;
        }
        // These will be updated each frame for procedural textures
        let noiseTextureData = null;
        let noiseTextureSize = null;
        let lastFrameId = -1;
        state.registerBuildPromise((async () => {
            try {
                const textureContent = await noiseTextureBlock.extractTextureContentAsync();
                if (!textureContent) {
                    return;
                }
                noiseTextureData = textureContent.data;
                noiseTextureSize = { width: textureContent.width, height: textureContent.height };
                lastFrameId = noiseTextureBlock.textureOutput._storedValue?.getScene?.()?.getFrameId() ?? -1;
            }
            catch {
                return;
            }
        })());
        const processNoise = (particle) => {
            // Get the texture directly from the block's stored value to support procedural textures
            // (as the block caches the texture data)
            const texture = noiseTextureBlock.textureOutput._storedValue;
            if (!texture || !texture.isReady()) {
                return;
            }
            // Fetch fresh texture data once per frame (like in thinParticleSystem)
            const currentFrameId = texture.getScene()?.getFrameId() ?? -1;
            if (currentFrameId !== lastFrameId) {
                lastFrameId = currentFrameId;
                // Texture size only needs to be fetched once
                if (!noiseTextureSize) {
                    noiseTextureSize = texture.getSize();
                }
                // eslint-disable-next-line @typescript-eslint/no-floating-promises, github/no-then
                texture.getContent()?.then((data) => {
                    noiseTextureData = data;
                });
            }
            // Skip if we don't have texture data yet
            if (!noiseTextureData || !noiseTextureSize) {
                return;
            }
            if (!particle._properties.randomNoiseCoordinates1) {
                particle._properties.randomNoiseCoordinates1 = new Vector3(Math.random(), Math.random(), Math.random());
            }
            if (!particle._properties.randomNoiseCoordinates2) {
                particle._properties.randomNoiseCoordinates2 = new Vector3(Math.random(), Math.random(), Math.random());
            }
            const fetchedColorR = system._fetchR(particle._properties.randomNoiseCoordinates1.x, particle._properties.randomNoiseCoordinates1.y, noiseTextureSize.width, noiseTextureSize.height, noiseTextureData);
            const fetchedColorG = system._fetchR(particle._properties.randomNoiseCoordinates1.z, particle._properties.randomNoiseCoordinates2.x, noiseTextureSize.width, noiseTextureSize.height, noiseTextureData);
            const fetchedColorB = system._fetchR(particle._properties.randomNoiseCoordinates2.y, particle._properties.randomNoiseCoordinates2.z, noiseTextureSize.width, noiseTextureSize.height, noiseTextureData);
            const force = TmpVectors.Vector3[0];
            const scaledForce = TmpVectors.Vector3[1];
            force.copyFromFloats((2 * fetchedColorR - 1) * strength.x, (2 * fetchedColorG - 1) * strength.y, (2 * fetchedColorB - 1) * strength.z);
            force.scaleToRef(system._tempScaledUpdateSpeed, scaledForce);
            particle.direction.addInPlace(scaledForce);
        };
        const noiseProcessing = {
            process: processNoise,
            previousItem: null,
            nextItem: null,
        };
        if (system._updateQueueStart) {
            _ConnectAtTheEnd(noiseProcessing, system._updateQueueStart);
        }
        else {
            system._updateQueueStart = noiseProcessing;
        }
        this.output._storedValue = system;
    }
}
let _Registered = false;
/**
 * Register side effects for updateNoiseBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterUpdateNoiseBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.UpdateNoiseBlock", UpdateNoiseBlock);
}
//# sourceMappingURL=updateNoiseBlock.pure.js.map