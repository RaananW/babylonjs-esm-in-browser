/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { Vector3 } from "../../../../Maths/math.vector.pure.js";
import { RandomRange } from "../../../../Maths/math.scalar.functions.js";
import { _CreateLocalPositionData } from "./emitters.functions.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to provide a flow of particles emitted from a sphere shape.
 * DirectionRandomizer will be used for the particles initial direction unless both direction1 and direction2 are connected.
 */
let SphereShapeBlock = (() => {
    var _a;
    let _classSuper = NodeParticleBlock;
    let _isHemispheric_decorators;
    let _isHemispheric_initializers = [];
    let _isHemispheric_extraInitializers = [];
    return _a = class SphereShapeBlock extends _classSuper {
            /**
             * Create a new SphereShapeBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                /**
                 * Gets or sets a boolean indicating whether to emit in a hemispheric mode (top half of the sphere) or not
                 */
                this.isHemispheric = __runInitializers(this, _isHemispheric_initializers, false);
                __runInitializers(this, _isHemispheric_extraInitializers);
                this.registerInput("particle", NodeParticleBlockConnectionPointTypes.Particle);
                this.registerInput("radius", NodeParticleBlockConnectionPointTypes.Float, true, 1);
                this.registerInput("radiusRange", NodeParticleBlockConnectionPointTypes.Float, true, 1, 0, 1);
                this.registerInput("directionRandomizer", NodeParticleBlockConnectionPointTypes.Float, true, 0, 0, 1);
                this.registerInput("direction1", NodeParticleBlockConnectionPointTypes.Vector3, true);
                this.registerInput("direction2", NodeParticleBlockConnectionPointTypes.Vector3, true);
                this.registerOutput("output", NodeParticleBlockConnectionPointTypes.Particle);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "SphereShapeBlock";
            }
            /**
             * Gets the particle component
             */
            get particle() {
                return this._inputs[0];
            }
            /**
             * Gets the radius input component
             */
            get radius() {
                return this._inputs[1];
            }
            /**
             * Gets the radiusRange input component
             */
            get radiusRange() {
                return this._inputs[2];
            }
            /**
             * Gets the directionRandomizer input component
             */
            get directionRandomizer() {
                return this._inputs[3];
            }
            /**
             * Gets the direction1 input component
             */
            get direction1() {
                return this._inputs[4];
            }
            /**
             * Gets the direction2 input component
             */
            get direction2() {
                return this._inputs[5];
            }
            /**
             * Gets the output component
             */
            get output() {
                return this._outputs[0];
            }
            /**
             * Builds the block
             * @param state defines the build state
             */
            _build(state) {
                const system = this.particle.getConnectedValue(state);
                system._directionCreation.process = (particle) => {
                    state.particleContext = particle;
                    state.systemContext = system;
                    // We always use directionRandomizer unless both directions are connected
                    if (this.direction1.isConnected === false || this.direction2.isConnected === false) {
                        const directionRandomizer = this.directionRandomizer.getConnectedValue(state);
                        const direction = particle.position.subtract(state.emitterPosition).normalize();
                        const randX = RandomRange(0, directionRandomizer);
                        const randY = RandomRange(0, directionRandomizer);
                        const randZ = RandomRange(0, directionRandomizer);
                        direction.x += randX;
                        direction.y += randY;
                        direction.z += randZ;
                        direction.normalize();
                        if (system.isLocal) {
                            particle.direction.copyFromFloats(direction.x, direction.y, direction.z);
                        }
                        else {
                            Vector3.TransformNormalFromFloatsToRef(direction.x, direction.y, direction.z, state.emitterWorldMatrix, particle.direction);
                        }
                    }
                    else {
                        const direction1 = this.direction1.getConnectedValue(state);
                        const direction2 = this.direction2.getConnectedValue(state);
                        const randX = RandomRange(direction1.x, direction2.x);
                        const randY = RandomRange(direction1.y, direction2.y);
                        const randZ = RandomRange(direction1.z, direction2.z);
                        if (system.isLocal) {
                            particle.direction.copyFromFloats(randX, randY, randZ);
                        }
                        else {
                            Vector3.TransformNormalFromFloatsToRef(randX, randY, randZ, state.emitterWorldMatrix, particle.direction);
                        }
                    }
                    particle._properties.initialDirection = particle.direction.clone();
                };
                system._positionCreation.process = (particle) => {
                    state.particleContext = particle;
                    state.systemContext = system;
                    const radius = this.radius.getConnectedValue(state);
                    const radiusRange = this.radiusRange.getConnectedValue(state);
                    const randRadius = radius - RandomRange(0, radius * radiusRange);
                    const v = RandomRange(0, 1.0);
                    const phi = RandomRange(0, 2 * Math.PI);
                    const theta = Math.acos(2 * v - 1);
                    const randX = randRadius * Math.cos(phi) * Math.sin(theta);
                    let randY = randRadius * Math.cos(theta);
                    const randZ = randRadius * Math.sin(phi) * Math.sin(theta);
                    if (this.isHemispheric) {
                        randY = Math.abs(randY);
                    }
                    if (system.isLocal) {
                        particle.position.copyFromFloats(randX, randY, randZ);
                    }
                    else {
                        Vector3.TransformCoordinatesFromFloatsToRef(randX, randY, randZ, state.emitterWorldMatrix, particle.position);
                    }
                    _CreateLocalPositionData(particle);
                };
                this.output._storedValue = system;
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.isHemispheric = this.isHemispheric;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.isHemispheric = serializationObject.isHemispheric;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _isHemispheric_decorators = [editableInPropertyPage("Is hemispheric", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })];
            __esDecorate(null, null, _isHemispheric_decorators, { kind: "field", name: "isHemispheric", static: false, private: false, access: { has: obj => "isHemispheric" in obj, get: obj => obj.isHemispheric, set: (obj, value) => { obj.isHemispheric = value; } }, metadata: _metadata }, _isHemispheric_initializers, _isHemispheric_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { SphereShapeBlock };
let _Registered = false;
/**
 * Register side effects for sphereShapeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterSphereShapeBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.SphereShapeBlock", SphereShapeBlock);
}
//# sourceMappingURL=sphereShapeBlock.pure.js.map