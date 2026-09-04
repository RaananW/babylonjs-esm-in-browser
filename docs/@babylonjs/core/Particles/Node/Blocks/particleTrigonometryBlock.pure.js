/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { Vector2, Vector3 } from "../../../Maths/math.vector.pure.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { NodeParticleBlock } from "../nodeParticleBlock.js";
import { NodeParticleBlockConnectionPointTypes } from "../Enums/nodeParticleBlockConnectionPointTypes.js";
import { Color4 } from "../../../Maths/math.color.pure.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Operations supported by the Trigonometry block
 */
export var ParticleTrigonometryBlockOperations;
(function (ParticleTrigonometryBlockOperations) {
    /** Cos */
    ParticleTrigonometryBlockOperations[ParticleTrigonometryBlockOperations["Cos"] = 0] = "Cos";
    /** Sin */
    ParticleTrigonometryBlockOperations[ParticleTrigonometryBlockOperations["Sin"] = 1] = "Sin";
    /** Abs */
    ParticleTrigonometryBlockOperations[ParticleTrigonometryBlockOperations["Abs"] = 2] = "Abs";
    /** Exp */
    ParticleTrigonometryBlockOperations[ParticleTrigonometryBlockOperations["Exp"] = 3] = "Exp";
    /** Exp2 */
    ParticleTrigonometryBlockOperations[ParticleTrigonometryBlockOperations["Exp2"] = 4] = "Exp2";
    /** Round */
    ParticleTrigonometryBlockOperations[ParticleTrigonometryBlockOperations["Round"] = 5] = "Round";
    /** Floor */
    ParticleTrigonometryBlockOperations[ParticleTrigonometryBlockOperations["Floor"] = 6] = "Floor";
    /** Ceiling */
    ParticleTrigonometryBlockOperations[ParticleTrigonometryBlockOperations["Ceiling"] = 7] = "Ceiling";
    /** Square root */
    ParticleTrigonometryBlockOperations[ParticleTrigonometryBlockOperations["Sqrt"] = 8] = "Sqrt";
    /** Log */
    ParticleTrigonometryBlockOperations[ParticleTrigonometryBlockOperations["Log"] = 9] = "Log";
    /** Tangent */
    ParticleTrigonometryBlockOperations[ParticleTrigonometryBlockOperations["Tan"] = 10] = "Tan";
    /** Arc tangent */
    ParticleTrigonometryBlockOperations[ParticleTrigonometryBlockOperations["ArcTan"] = 11] = "ArcTan";
    /** Arc cosinus */
    ParticleTrigonometryBlockOperations[ParticleTrigonometryBlockOperations["ArcCos"] = 12] = "ArcCos";
    /** Arc sinus */
    ParticleTrigonometryBlockOperations[ParticleTrigonometryBlockOperations["ArcSin"] = 13] = "ArcSin";
    /** Sign */
    ParticleTrigonometryBlockOperations[ParticleTrigonometryBlockOperations["Sign"] = 14] = "Sign";
    /** Negate */
    ParticleTrigonometryBlockOperations[ParticleTrigonometryBlockOperations["Negate"] = 15] = "Negate";
    /** OneMinus */
    ParticleTrigonometryBlockOperations[ParticleTrigonometryBlockOperations["OneMinus"] = 16] = "OneMinus";
    /** Reciprocal */
    ParticleTrigonometryBlockOperations[ParticleTrigonometryBlockOperations["Reciprocal"] = 17] = "Reciprocal";
    /** ToDegrees */
    ParticleTrigonometryBlockOperations[ParticleTrigonometryBlockOperations["ToDegrees"] = 18] = "ToDegrees";
    /** ToRadians */
    ParticleTrigonometryBlockOperations[ParticleTrigonometryBlockOperations["ToRadians"] = 19] = "ToRadians";
    /** Fract */
    ParticleTrigonometryBlockOperations[ParticleTrigonometryBlockOperations["Fract"] = 20] = "Fract";
})(ParticleTrigonometryBlockOperations || (ParticleTrigonometryBlockOperations = {}));
/**
 * Block used to apply trigonometry operation to floats
 */
let ParticleTrigonometryBlock = (() => {
    var _a;
    let _classSuper = NodeParticleBlock;
    let _operation_decorators;
    let _operation_initializers = [];
    let _operation_extraInitializers = [];
    return _a = class ParticleTrigonometryBlock extends _classSuper {
            /**
             * Creates a new GeometryTrigonometryBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                /**
                 * Gets or sets the operation applied by the block
                 */
                this.operation = __runInitializers(this, _operation_initializers, ParticleTrigonometryBlockOperations.Cos);
                __runInitializers(this, _operation_extraInitializers);
                this.registerInput("input", NodeParticleBlockConnectionPointTypes.AutoDetect);
                this.registerOutput("output", NodeParticleBlockConnectionPointTypes.BasedOnInput);
                this._outputs[0]._typeConnectionSource = this._inputs[0];
                this._inputs[0].addExcludedConnectionPointFromAllowedTypes(NodeParticleBlockConnectionPointTypes.Float |
                    NodeParticleBlockConnectionPointTypes.Int |
                    NodeParticleBlockConnectionPointTypes.Vector2 |
                    NodeParticleBlockConnectionPointTypes.Vector3 |
                    NodeParticleBlockConnectionPointTypes.Color4);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "ParticleTrigonometryBlock";
            }
            /**
             * Gets the input component
             */
            get input() {
                return this._inputs[0];
            }
            /**
             * Gets the output component
             */
            get output() {
                return this._outputs[0];
            }
            _build(state) {
                super._build(state);
                let func = null;
                switch (this.operation) {
                    case ParticleTrigonometryBlockOperations.Cos: {
                        func = (value) => Math.cos(value);
                        break;
                    }
                    case ParticleTrigonometryBlockOperations.Sin: {
                        func = (value) => Math.sin(value);
                        break;
                    }
                    case ParticleTrigonometryBlockOperations.Abs: {
                        func = (value) => Math.abs(value);
                        break;
                    }
                    case ParticleTrigonometryBlockOperations.Exp: {
                        func = (value) => Math.exp(value);
                        break;
                    }
                    case ParticleTrigonometryBlockOperations.Exp2: {
                        func = (value) => Math.pow(2, value);
                        break;
                    }
                    case ParticleTrigonometryBlockOperations.Round: {
                        func = (value) => Math.round(value);
                        break;
                    }
                    case ParticleTrigonometryBlockOperations.Floor: {
                        func = (value) => Math.floor(value);
                        break;
                    }
                    case ParticleTrigonometryBlockOperations.Ceiling: {
                        func = (value) => Math.ceil(value);
                        break;
                    }
                    case ParticleTrigonometryBlockOperations.Sqrt: {
                        func = (value) => Math.sqrt(value);
                        break;
                    }
                    case ParticleTrigonometryBlockOperations.Log: {
                        func = (value) => Math.log(value);
                        break;
                    }
                    case ParticleTrigonometryBlockOperations.Tan: {
                        func = (value) => Math.tan(value);
                        break;
                    }
                    case ParticleTrigonometryBlockOperations.ArcTan: {
                        func = (value) => Math.atan(value);
                        break;
                    }
                    case ParticleTrigonometryBlockOperations.ArcCos: {
                        func = (value) => Math.acos(value);
                        break;
                    }
                    case ParticleTrigonometryBlockOperations.ArcSin: {
                        func = (value) => Math.asin(value);
                        break;
                    }
                    case ParticleTrigonometryBlockOperations.Sign: {
                        func = (value) => Math.sign(value);
                        break;
                    }
                    case ParticleTrigonometryBlockOperations.Negate: {
                        func = (value) => -value;
                        break;
                    }
                    case ParticleTrigonometryBlockOperations.OneMinus: {
                        func = (value) => 1 - value;
                        break;
                    }
                    case ParticleTrigonometryBlockOperations.Reciprocal: {
                        func = (value) => 1 / value;
                        break;
                    }
                    case ParticleTrigonometryBlockOperations.ToRadians: {
                        func = (value) => (value * Math.PI) / 180;
                        break;
                    }
                    case ParticleTrigonometryBlockOperations.ToDegrees: {
                        func = (value) => (value * 180) / Math.PI;
                        break;
                    }
                    case ParticleTrigonometryBlockOperations.Fract: {
                        func = (value) => {
                            if (value >= 0) {
                                return value - Math.floor(value);
                            }
                            else {
                                return value - Math.ceil(value);
                            }
                        };
                        break;
                    }
                }
                if (!func) {
                    this.output._storedFunction = null;
                    this.output._storedValue = null;
                    return;
                }
                switch (this.input.type) {
                    case NodeParticleBlockConnectionPointTypes.Int:
                    case NodeParticleBlockConnectionPointTypes.Float: {
                        this.output._storedFunction = (state) => {
                            const source = this.input.getConnectedValue(state);
                            return func(source);
                        };
                        break;
                    }
                    case NodeParticleBlockConnectionPointTypes.Vector2: {
                        this.output._storedFunction = (state) => {
                            const source = this.input.getConnectedValue(state);
                            return new Vector2(func(source.x), func(source.y));
                        };
                        break;
                    }
                    case NodeParticleBlockConnectionPointTypes.Vector3: {
                        this.output._storedFunction = (state) => {
                            const source = this.input.getConnectedValue(state);
                            return new Vector3(func(source.x), func(source.y), func(source.z));
                        };
                        break;
                    }
                    case NodeParticleBlockConnectionPointTypes.Color4: {
                        this.output._storedFunction = (state) => {
                            const source = this.input.getConnectedValue(state);
                            return new Color4(func(source.r), func(source.g), func(source.b), func(source.a));
                        };
                        break;
                    }
                }
                return this;
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.operation = this.operation;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.operation = serializationObject.operation;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _operation_decorators = [editableInPropertyPage("Operation", 5 /* PropertyTypeForEdition.List */, "ADVANCED", {
                    embedded: true,
                    notifiers: { rebuild: true },
                    options: [
                        { label: "Cos", value: ParticleTrigonometryBlockOperations.Cos },
                        { label: "Sin", value: ParticleTrigonometryBlockOperations.Sin },
                        { label: "Abs", value: ParticleTrigonometryBlockOperations.Abs },
                        { label: "Exp", value: ParticleTrigonometryBlockOperations.Exp },
                        { label: "Exp2", value: ParticleTrigonometryBlockOperations.Exp2 },
                        { label: "Round", value: ParticleTrigonometryBlockOperations.Round },
                        { label: "Floor", value: ParticleTrigonometryBlockOperations.Floor },
                        { label: "Ceiling", value: ParticleTrigonometryBlockOperations.Ceiling },
                        { label: "Sqrt", value: ParticleTrigonometryBlockOperations.Sqrt },
                        { label: "Log", value: ParticleTrigonometryBlockOperations.Log },
                        { label: "Tan", value: ParticleTrigonometryBlockOperations.Tan },
                        { label: "ArcTan", value: ParticleTrigonometryBlockOperations.ArcTan },
                        { label: "ArcCos", value: ParticleTrigonometryBlockOperations.ArcCos },
                        { label: "ArcSin", value: ParticleTrigonometryBlockOperations.ArcSin },
                        { label: "Sign", value: ParticleTrigonometryBlockOperations.Sign },
                        { label: "Negate", value: ParticleTrigonometryBlockOperations.Negate },
                        { label: "OneMinus", value: ParticleTrigonometryBlockOperations.OneMinus },
                        { label: "Reciprocal", value: ParticleTrigonometryBlockOperations.Reciprocal },
                        { label: "ToDegrees", value: ParticleTrigonometryBlockOperations.ToDegrees },
                        { label: "ToRadians", value: ParticleTrigonometryBlockOperations.ToRadians },
                        { label: "Fract", value: ParticleTrigonometryBlockOperations.Fract },
                    ],
                })];
            __esDecorate(null, null, _operation_decorators, { kind: "field", name: "operation", static: false, private: false, access: { has: obj => "operation" in obj, get: obj => obj.operation, set: (obj, value) => { obj.operation = value; } }, metadata: _metadata }, _operation_initializers, _operation_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { ParticleTrigonometryBlock };
let _Registered = false;
/**
 * Register side effects for particleTrigonometryBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterParticleTrigonometryBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ParticleTrigonometryBlock", ParticleTrigonometryBlock);
}
//# sourceMappingURL=particleTrigonometryBlock.pure.js.map