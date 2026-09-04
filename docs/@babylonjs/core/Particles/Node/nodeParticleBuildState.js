import { Color4 } from "../../Maths/math.color.pure.js";
import { Vector2, Vector3 } from "../../Maths/math.vector.pure.js";
import { NodeParticleBlockConnectionPointTypes } from "./Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleContextualSources } from "./Enums/nodeParticleContextualSources.js";
import { NodeParticleSystemSources } from "./Enums/nodeParticleSystemSources.js";
/**
 * Class used to store node based geometry build state
 */
export class NodeParticleBuildState {
    constructor() {
        this._buildPromises = new Array();
        /** Gets or sets the list of non connected mandatory inputs */
        this.notConnectedNonOptionalInputs = [];
        /**
         * Gets or sets the particle context for contextual data
         */
        this.particleContext = null;
        /**
         * Gets or sets the system context for contextual data
         */
        this.systemContext = null;
        /**
         * Gets or sets the index of the gradient to use
         */
        this.gradientIndex = 0;
        /**
         * Gets or sets next gradient in line
         */
        this.nextGradientIndex = 0;
    }
    /**
     * Emits errors if any
     */
    emitErrors() {
        let errorMessage = "";
        for (const notConnectedInput of this.notConnectedNonOptionalInputs) {
            errorMessage += `input ${notConnectedInput.name} from block ${notConnectedInput.ownerBlock.name}[${notConnectedInput.ownerBlock.getClassName()}] is not connected and is not optional.\n`;
        }
        if (errorMessage) {
            // eslint-disable-next-line no-throw-literal
            throw "Build of Node Particle System Set failed:\n" + errorMessage;
        }
    }
    /**
     * Registers an asynchronous operation that must complete before the node particle system is ready.
     * @param promise defines the promise to wait for
     */
    registerBuildPromise(promise) {
        this._buildPromises.push(promise);
    }
    /**
     * Waits for all asynchronous build operations to complete.
     * @returns a promise that resolves when all registered build operations are complete
     */
    async waitForBuildPromisesAsync() {
        await Promise.all(this._buildPromises);
    }
    /**
     * Adapt a value to a target type
     * @param source defines the value to adapt
     * @param targetType defines the target type
     * @returns the adapted value
     */
    adapt(source, targetType) {
        const value = source.getConnectedValue(this) || 0;
        if (source.type === targetType) {
            return value;
        }
        switch (targetType) {
            case NodeParticleBlockConnectionPointTypes.Vector2:
                return new Vector2(value, value);
            case NodeParticleBlockConnectionPointTypes.Vector3:
                return new Vector3(value, value, value);
            case NodeParticleBlockConnectionPointTypes.Color4:
                return new Color4(value, value, value, value);
        }
        return null;
    }
    /**
     * Gets the value associated with a contextual source
     * @param source Source of the contextual value
     * @returns the value associated with the source
     */
    getContextualValue(source) {
        if (!this.particleContext || !this.systemContext) {
            return null;
        }
        switch (source) {
            case NodeParticleContextualSources.Position:
                return this.particleContext.position;
            case NodeParticleContextualSources.Direction:
                return this.particleContext.direction;
            case NodeParticleContextualSources.DirectionScale:
                return this.particleContext._properties.directionScale;
            case NodeParticleContextualSources.ScaledDirection:
                this.particleContext.direction.scaleToRef(this.particleContext._properties.directionScale, this.particleContext._properties.scaledDirection);
                return this.particleContext._properties.scaledDirection;
            case NodeParticleContextualSources.Color:
                return this.particleContext.color;
            case NodeParticleContextualSources.InitialColor:
                return this.particleContext.initialColor;
            case NodeParticleContextualSources.ColorDead:
                return this.particleContext.colorDead;
            case NodeParticleContextualSources.Age:
                return this.particleContext.age;
            case NodeParticleContextualSources.Lifetime:
                return this.particleContext.lifeTime;
            case NodeParticleContextualSources.Angle:
                return this.particleContext.angle;
            case NodeParticleContextualSources.Scale:
                return this.particleContext.scale;
            case NodeParticleContextualSources.Size:
                return this.particleContext.size;
            case NodeParticleContextualSources.AgeGradient:
                return this.particleContext.age / this.particleContext.lifeTime;
            case NodeParticleContextualSources.SpriteCellEnd:
                return this.systemContext.endSpriteCellID;
            case NodeParticleContextualSources.SpriteCellIndex:
                return this.particleContext.cellIndex;
            case NodeParticleContextualSources.SpriteCellStart:
                return this.systemContext.startSpriteCellID;
            case NodeParticleContextualSources.InitialDirection:
                return this.particleContext._properties.initialDirection;
            case NodeParticleContextualSources.ColorStep:
                return this.particleContext.colorStep;
            case NodeParticleContextualSources.ScaledColorStep:
                this.particleContext.colorStep.scaleToRef(this.systemContext._scaledUpdateSpeed, this.systemContext._scaledColorStep);
                return this.systemContext._scaledColorStep;
            case NodeParticleContextualSources.LocalPositionUpdated:
                this.particleContext.direction.scaleToRef(this.particleContext._properties.directionScale, this.particleContext._properties.scaledDirection);
                this.particleContext._properties.localPosition.addInPlace(this.particleContext._properties.scaledDirection);
                Vector3.TransformCoordinatesToRef(this.particleContext._properties.localPosition, this.systemContext._emitterWorldMatrix, this.particleContext.position);
                return this.particleContext.position;
        }
        return null;
    }
    /**
     * Gets the emitter world matrix
     */
    get emitterWorldMatrix() {
        if (!this.systemContext) {
            return null;
        }
        return this.systemContext._emitterWorldMatrix;
    }
    /**
     * Gets the emitter inverse world matrix
     */
    get emitterInverseWorldMatrix() {
        if (!this.systemContext) {
            return null;
        }
        return this.systemContext._emitterInverseWorldMatrix;
    }
    /**
     * Gets the emitter position
     */
    get emitterPosition() {
        if (!this.systemContext) {
            return null;
        }
        if (!this.systemContext.emitter) {
            return null;
        }
        if (this.systemContext.emitter instanceof Vector3) {
            return this.systemContext.emitter;
        }
        return this.systemContext.emitter.absolutePosition;
    }
    /**
     * Gets the value associated with a system source
     * @param source Source of the system value
     * @returns the value associated with the source
     */
    getSystemValue(source) {
        if (!this.systemContext) {
            return null;
        }
        switch (source) {
            case NodeParticleSystemSources.Time:
                return this.systemContext._actualFrame;
            case NodeParticleSystemSources.Delta:
                return this.systemContext._scaledUpdateSpeed;
            case NodeParticleSystemSources.Emitter:
                return this.emitterPosition;
            case NodeParticleSystemSources.CameraPosition:
                return this.scene.activeCamera?.globalPosition || Vector3.Zero();
        }
        return null;
    }
}
//# sourceMappingURL=nodeParticleBuildState.js.map