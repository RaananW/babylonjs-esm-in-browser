/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { Color4 } from "../../../Maths/math.color.pure.js";
import { Vector2, Vector3 } from "../../../Maths/math.vector.pure.js";
import { NodeParticleBlock } from "../nodeParticleBlock.js";
import { NodeParticleBlockConnectionPointTypes } from "../Enums/nodeParticleBlockConnectionPointTypes.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Locks supported by the random block
 */
export var ParticleRandomBlockLocks;
(function (ParticleRandomBlockLocks) {
    /** None */
    ParticleRandomBlockLocks[ParticleRandomBlockLocks["None"] = 0] = "None";
    /** PerParticle */
    ParticleRandomBlockLocks[ParticleRandomBlockLocks["PerParticle"] = 1] = "PerParticle";
    /** PerSystem */
    ParticleRandomBlockLocks[ParticleRandomBlockLocks["PerSystem"] = 2] = "PerSystem";
    /** OncePerParticle */
    ParticleRandomBlockLocks[ParticleRandomBlockLocks["OncePerParticle"] = 3] = "OncePerParticle";
})(ParticleRandomBlockLocks || (ParticleRandomBlockLocks = {}));
/**
 * Block used to get a random number
 */
let ParticleRandomBlock = (() => {
    var _a;
    let _classSuper = NodeParticleBlock;
    let _lockMode_decorators;
    let _lockMode_initializers = [];
    let _lockMode_extraInitializers = [];
    return _a = class ParticleRandomBlock extends _classSuper {
            /**
             * Create a new ParticleRandomBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                this._currentLockId = -2;
                this._oncePerParticleMap = new Map();
                /**
                 * Gets or sets a value indicating if that block will lock its value for a specific event
                 */
                this.lockMode = __runInitializers(this, _lockMode_initializers, ParticleRandomBlockLocks.PerParticle);
                __runInitializers(this, _lockMode_extraInitializers);
                this.registerInput("min", NodeParticleBlockConnectionPointTypes.AutoDetect, true, 0);
                this.registerInput("max", NodeParticleBlockConnectionPointTypes.AutoDetect, true, 1);
                this.registerOutput("output", NodeParticleBlockConnectionPointTypes.BasedOnInput);
                this._inputs[0].addExcludedConnectionPointFromAllowedTypes(NodeParticleBlockConnectionPointTypes.Float |
                    NodeParticleBlockConnectionPointTypes.Int |
                    NodeParticleBlockConnectionPointTypes.Vector2 |
                    NodeParticleBlockConnectionPointTypes.Vector3 |
                    NodeParticleBlockConnectionPointTypes.Color4);
                this._inputs[1].addExcludedConnectionPointFromAllowedTypes(NodeParticleBlockConnectionPointTypes.Float |
                    NodeParticleBlockConnectionPointTypes.Int |
                    NodeParticleBlockConnectionPointTypes.Vector2 |
                    NodeParticleBlockConnectionPointTypes.Vector3 |
                    NodeParticleBlockConnectionPointTypes.Color4);
                this._outputs[0]._typeConnectionSource = this._inputs[0];
                this._outputs[0]._defaultConnectionPointType = NodeParticleBlockConnectionPointTypes.Float;
                this._linkConnectionTypes(0, 1);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "ParticleRandomBlock";
            }
            /**
             * Gets the min input component
             */
            get min() {
                return this._inputs[0];
            }
            /**
             * Gets the max input component
             */
            get max() {
                return this._inputs[1];
            }
            /**
             * Gets the geometry output component
             */
            get output() {
                return this._outputs[0];
            }
            _build() {
                let func = null;
                this._currentLockId = -2;
                this._oncePerParticleMap.clear();
                switch (this.min.type) {
                    case NodeParticleBlockConnectionPointTypes.AutoDetect:
                    case NodeParticleBlockConnectionPointTypes.Int:
                    case NodeParticleBlockConnectionPointTypes.Float: {
                        func = (state) => {
                            const min = this.min.getConnectedValue(state) ?? 0;
                            const max = this.max.getConnectedValue(state) ?? 1;
                            return min + Math.random() * (max - min);
                        };
                        break;
                    }
                    case NodeParticleBlockConnectionPointTypes.Vector2: {
                        func = (state) => {
                            const min = this.min.getConnectedValue(state) ?? Vector2.Zero();
                            const max = this.max.getConnectedValue(state) ?? Vector2.One();
                            return new Vector2(min.x + Math.random() * (max.x - min.x), min.y + Math.random() * (max.y - min.y));
                        };
                        break;
                    }
                    case NodeParticleBlockConnectionPointTypes.Vector3: {
                        func = (state) => {
                            const min = this.min.getConnectedValue(state) ?? Vector3.Zero();
                            const max = this.max.getConnectedValue(state) ?? Vector3.One();
                            return new Vector3(min.x + Math.random() * (max.x - min.x), min.y + Math.random() * (max.y - min.y), min.z + Math.random() * (max.z - min.z));
                        };
                        break;
                    }
                    case NodeParticleBlockConnectionPointTypes.Color4: {
                        func = (state) => {
                            const min = this.min.getConnectedValue(state) ?? new Color4(0, 0, 0, 0);
                            const max = this.max.getConnectedValue(state) ?? new Color4(1, 1, 1, 1);
                            return new Color4(min.r + Math.random() * (max.r - min.r), min.g + Math.random() * (max.g - min.g), min.b + Math.random() * (max.b - min.b), min.a + Math.random() * (max.a - min.a));
                        };
                        break;
                    }
                }
                this.output._storedFunction = (state) => {
                    if (this.lockMode === ParticleRandomBlockLocks.OncePerParticle) {
                        const particleId = state.particleContext?.id ?? -1;
                        let cachedValue = this._oncePerParticleMap.get(particleId);
                        if (!cachedValue) {
                            cachedValue = func(state);
                            this._oncePerParticleMap.set(particleId, cachedValue);
                        }
                        this.output._storedValue = cachedValue;
                    }
                    else {
                        let lockId = -2;
                        switch (this.lockMode) {
                            case ParticleRandomBlockLocks.PerParticle:
                                lockId = state.particleContext?.id ?? -1;
                                break;
                            case ParticleRandomBlockLocks.PerSystem:
                                lockId = state.buildId ?? 0;
                                break;
                            default:
                                break;
                        }
                        if (this.lockMode === ParticleRandomBlockLocks.None || this._currentLockId !== lockId) {
                            if (this.lockMode !== ParticleRandomBlockLocks.None) {
                                this._currentLockId = lockId;
                            }
                            this.output._storedValue = func(state);
                        }
                    }
                    return this.output._storedValue;
                };
            }
            /**
             * Serializes this block in a JSON representation
             * @returns the serialized block object
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.lockMode = this.lockMode;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.lockMode = serializationObject.lockMode;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _lockMode_decorators = [editableInPropertyPage("LockMode", 5 /* PropertyTypeForEdition.List */, "ADVANCED", {
                    notifiers: { rebuild: true },
                    embedded: true,
                    options: [
                        { label: "None", value: ParticleRandomBlockLocks.None },
                        { label: "Per particle", value: ParticleRandomBlockLocks.PerParticle },
                        { label: "Per system", value: ParticleRandomBlockLocks.PerSystem },
                        { label: "Once per particle", value: ParticleRandomBlockLocks.OncePerParticle },
                    ],
                })];
            __esDecorate(null, null, _lockMode_decorators, { kind: "field", name: "lockMode", static: false, private: false, access: { has: obj => "lockMode" in obj, get: obj => obj.lockMode, set: (obj, value) => { obj.lockMode = value; } }, metadata: _metadata }, _lockMode_initializers, _lockMode_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { ParticleRandomBlock };
let _Registered = false;
/**
 * Register side effects for particleRandomBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterParticleRandomBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ParticleRandomBlock", ParticleRandomBlock);
}
//# sourceMappingURL=particleRandomBlock.pure.js.map