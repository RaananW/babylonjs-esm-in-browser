/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { RandomRange } from "../../../../Maths/math.scalar.functions.js";
import { Vector3 } from "../../../../Maths/math.vector.pure.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { _CreateLocalPositionData } from "./emitters.functions.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to provide a flow of particles emitted from a cone shape.
 */
let ConeShapeBlock = (() => {
    var _a;
    let _classSuper = NodeParticleBlock;
    let _emitFromSpawnPointOnly_decorators;
    let _emitFromSpawnPointOnly_initializers = [];
    let _emitFromSpawnPointOnly_extraInitializers = [];
    return _a = class ConeShapeBlock extends _classSuper {
            /**
             * Create a new ConeShapeBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                /**
                 * Gets or sets a boolean indicating if the system should emit only from the spawn point
                 * DirectionRandomizer will be used for the particles initial direction unless both direction1 and direction2 are connected.
                 */
                this.emitFromSpawnPointOnly = __runInitializers(this, _emitFromSpawnPointOnly_initializers, false);
                __runInitializers(this, _emitFromSpawnPointOnly_extraInitializers);
                this.registerInput("particle", NodeParticleBlockConnectionPointTypes.Particle);
                this.registerInput("radius", NodeParticleBlockConnectionPointTypes.Float, true, 1);
                this.registerInput("angle", NodeParticleBlockConnectionPointTypes.Float, true, Math.PI);
                this.registerInput("radiusRange", NodeParticleBlockConnectionPointTypes.Float, true, 1);
                this.registerInput("heightRange", NodeParticleBlockConnectionPointTypes.Float, true, 1);
                this.registerInput("directionRandomizer", NodeParticleBlockConnectionPointTypes.Float, true, 0);
                this.registerInput("direction1", NodeParticleBlockConnectionPointTypes.Vector3, true);
                this.registerInput("direction2", NodeParticleBlockConnectionPointTypes.Vector3, true);
                this.registerOutput("output", NodeParticleBlockConnectionPointTypes.Particle);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "ConeShapeBlock";
            }
            /**
             * Gets the particle input component
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
             * Gets the angle input component
             */
            get angle() {
                return this._inputs[2];
            }
            /**
             * Gets the radiusRange input component
             */
            get radiusRange() {
                return this._inputs[3];
            }
            /**
             * Gets the heightRange input component
             */
            get heightRange() {
                return this._inputs[4];
            }
            /**
             * Gets the directionRandomizer input component
             */
            get directionRandomizer() {
                return this._inputs[5];
            }
            /**
             * Gets the direction1 input component
             */
            get direction1() {
                return this._inputs[6];
            }
            /**
             * Gets the direction2 input component
             */
            get direction2() {
                return this._inputs[7];
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
                    // Connected values
                    const radius = this.radius.getConnectedValue(state);
                    const angle = this.angle.getConnectedValue(state);
                    const radiusRange = this.radiusRange.getConnectedValue(state);
                    const heightRange = this.heightRange.getConnectedValue(state);
                    // Calculate position creation logic
                    let h;
                    if (!this.emitFromSpawnPointOnly) {
                        h = RandomRange(0, heightRange);
                        // Better distribution in a cone at normal angles.
                        h = 1 - h * h;
                    }
                    else {
                        h = 0.0001;
                    }
                    let newRadius = radius - RandomRange(0, radius * radiusRange);
                    newRadius = newRadius * h;
                    const s = RandomRange(0, Math.PI * 2);
                    const randX = newRadius * Math.sin(s);
                    const randZ = newRadius * Math.cos(s);
                    const randY = h * this._calculateHeight(angle, radius);
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
            _calculateHeight(angle, radius) {
                if (angle !== 0) {
                    return radius / Math.tan(angle / 2);
                }
                else {
                    return 1;
                }
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.emitFromSpawnPointOnly = this.emitFromSpawnPointOnly;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.emitFromSpawnPointOnly = serializationObject.emitFromSpawnPointOnly;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _emitFromSpawnPointOnly_decorators = [editableInPropertyPage("Emit from spawn point only", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })];
            __esDecorate(null, null, _emitFromSpawnPointOnly_decorators, { kind: "field", name: "emitFromSpawnPointOnly", static: false, private: false, access: { has: obj => "emitFromSpawnPointOnly" in obj, get: obj => obj.emitFromSpawnPointOnly, set: (obj, value) => { obj.emitFromSpawnPointOnly = value; } }, metadata: _metadata }, _emitFromSpawnPointOnly_initializers, _emitFromSpawnPointOnly_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { ConeShapeBlock };
let _Registered = false;
/**
 * Register side effects for coneShapeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterConeShapeBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ConeShapeBlock", ConeShapeBlock);
}
//# sourceMappingURL=coneShapeBlock.pure.js.map