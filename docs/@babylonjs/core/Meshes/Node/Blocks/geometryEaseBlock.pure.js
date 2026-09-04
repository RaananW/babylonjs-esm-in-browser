/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { NodeGeometryBlockConnectionPointTypes } from "../Enums/nodeGeometryConnectionPointTypes.js";
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { Vector2, Vector3, Vector4 } from "../../../Maths/math.vector.pure.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { BackEase, CircleEase, CubicEase, ElasticEase, ExponentialEase, QuadraticEase, QuarticEase, QuinticEase, SineEase } from "../../../Animations/easing.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Types of easing function supported by the Ease block
 */
export var GeometryEaseBlockTypes;
(function (GeometryEaseBlockTypes) {
    /** EaseInSine */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseInSine"] = 0] = "EaseInSine";
    /** EaseOutSine */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseOutSine"] = 1] = "EaseOutSine";
    /** EaseInOutSine */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseInOutSine"] = 2] = "EaseInOutSine";
    /** EaseInQuad */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseInQuad"] = 3] = "EaseInQuad";
    /** EaseOutQuad */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseOutQuad"] = 4] = "EaseOutQuad";
    /** EaseInOutQuad */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseInOutQuad"] = 5] = "EaseInOutQuad";
    /** EaseInCubic */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseInCubic"] = 6] = "EaseInCubic";
    /** EaseOutCubic */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseOutCubic"] = 7] = "EaseOutCubic";
    /** EaseInOutCubic */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseInOutCubic"] = 8] = "EaseInOutCubic";
    /** EaseInQuart */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseInQuart"] = 9] = "EaseInQuart";
    /** EaseOutQuart */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseOutQuart"] = 10] = "EaseOutQuart";
    /** EaseInOutQuart */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseInOutQuart"] = 11] = "EaseInOutQuart";
    /** EaseInQuint */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseInQuint"] = 12] = "EaseInQuint";
    /** EaseOutQuint */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseOutQuint"] = 13] = "EaseOutQuint";
    /** EaseInOutQuint */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseInOutQuint"] = 14] = "EaseInOutQuint";
    /** EaseInExpo */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseInExpo"] = 15] = "EaseInExpo";
    /** EaseOutExpo */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseOutExpo"] = 16] = "EaseOutExpo";
    /** EaseInOutExpo */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseInOutExpo"] = 17] = "EaseInOutExpo";
    /** EaseInCirc */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseInCirc"] = 18] = "EaseInCirc";
    /** EaseOutCirc */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseOutCirc"] = 19] = "EaseOutCirc";
    /** EaseInOutCirc */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseInOutCirc"] = 20] = "EaseInOutCirc";
    /** EaseInBack */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseInBack"] = 21] = "EaseInBack";
    /** EaseOutBack */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseOutBack"] = 22] = "EaseOutBack";
    /** EaseInOutBack */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseInOutBack"] = 23] = "EaseInOutBack";
    /** EaseInElastic */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseInElastic"] = 24] = "EaseInElastic";
    /** EaseOutElastic */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseOutElastic"] = 25] = "EaseOutElastic";
    /** EaseInOutElastic */
    GeometryEaseBlockTypes[GeometryEaseBlockTypes["EaseInOutElastic"] = 26] = "EaseInOutElastic";
})(GeometryEaseBlockTypes || (GeometryEaseBlockTypes = {}));
/**
 * Block used to apply an easing function to floats
 */
let GeometryEaseBlock = (() => {
    var _a;
    let _classSuper = NodeGeometryBlock;
    let _instanceExtraInitializers = [];
    let _get_type_decorators;
    return _a = class GeometryEaseBlock extends _classSuper {
            /**
             * Gets or sets the type of the easing functions applied by the block
             */
            get type() {
                return this._type;
            }
            set type(value) {
                if (this._type === value) {
                    return;
                }
                this._type = value;
                switch (this._type) {
                    case GeometryEaseBlockTypes.EaseInSine:
                        this._easingFunction = new SineEase();
                        this._easingFunction.setEasingMode(SineEase.EASINGMODE_EASEIN);
                        break;
                    case GeometryEaseBlockTypes.EaseOutSine:
                        this._easingFunction = new SineEase();
                        this._easingFunction.setEasingMode(SineEase.EASINGMODE_EASEOUT);
                        break;
                    case GeometryEaseBlockTypes.EaseInOutSine:
                        this._easingFunction = new SineEase();
                        this._easingFunction.setEasingMode(SineEase.EASINGMODE_EASEINOUT);
                        break;
                    case GeometryEaseBlockTypes.EaseInQuad:
                        this._easingFunction = new QuadraticEase();
                        this._easingFunction.setEasingMode(QuadraticEase.EASINGMODE_EASEIN);
                        break;
                    case GeometryEaseBlockTypes.EaseOutQuad:
                        this._easingFunction = new QuadraticEase();
                        this._easingFunction.setEasingMode(QuadraticEase.EASINGMODE_EASEOUT);
                        break;
                    case GeometryEaseBlockTypes.EaseInOutQuad:
                        this._easingFunction = new QuadraticEase();
                        this._easingFunction.setEasingMode(QuadraticEase.EASINGMODE_EASEINOUT);
                        break;
                    case GeometryEaseBlockTypes.EaseInCubic:
                        this._easingFunction = new CubicEase();
                        this._easingFunction.setEasingMode(CubicEase.EASINGMODE_EASEIN);
                        break;
                    case GeometryEaseBlockTypes.EaseOutCubic:
                        this._easingFunction = new CubicEase();
                        this._easingFunction.setEasingMode(CubicEase.EASINGMODE_EASEOUT);
                        break;
                    case GeometryEaseBlockTypes.EaseInOutCubic:
                        this._easingFunction = new CubicEase();
                        this._easingFunction.setEasingMode(CubicEase.EASINGMODE_EASEINOUT);
                        break;
                    case GeometryEaseBlockTypes.EaseInQuart:
                        this._easingFunction = new QuarticEase();
                        this._easingFunction.setEasingMode(QuarticEase.EASINGMODE_EASEIN);
                        break;
                    case GeometryEaseBlockTypes.EaseOutQuart:
                        this._easingFunction = new QuarticEase();
                        this._easingFunction.setEasingMode(QuarticEase.EASINGMODE_EASEOUT);
                        break;
                    case GeometryEaseBlockTypes.EaseInOutQuart:
                        this._easingFunction = new QuarticEase();
                        this._easingFunction.setEasingMode(QuarticEase.EASINGMODE_EASEINOUT);
                        break;
                    case GeometryEaseBlockTypes.EaseInQuint:
                        this._easingFunction = new QuinticEase();
                        this._easingFunction.setEasingMode(QuinticEase.EASINGMODE_EASEIN);
                        break;
                    case GeometryEaseBlockTypes.EaseOutQuint:
                        this._easingFunction = new QuinticEase();
                        this._easingFunction.setEasingMode(QuinticEase.EASINGMODE_EASEOUT);
                        break;
                    case GeometryEaseBlockTypes.EaseInOutQuint:
                        this._easingFunction = new QuinticEase();
                        this._easingFunction.setEasingMode(QuinticEase.EASINGMODE_EASEINOUT);
                        break;
                    case GeometryEaseBlockTypes.EaseInExpo:
                        this._easingFunction = new ExponentialEase();
                        this._easingFunction.setEasingMode(ExponentialEase.EASINGMODE_EASEIN);
                        break;
                    case GeometryEaseBlockTypes.EaseOutExpo:
                        this._easingFunction = new ExponentialEase();
                        this._easingFunction.setEasingMode(ExponentialEase.EASINGMODE_EASEOUT);
                        break;
                    case GeometryEaseBlockTypes.EaseInOutExpo:
                        this._easingFunction = new ExponentialEase();
                        this._easingFunction.setEasingMode(ExponentialEase.EASINGMODE_EASEINOUT);
                        break;
                    case GeometryEaseBlockTypes.EaseInCirc:
                        this._easingFunction = new CircleEase();
                        this._easingFunction.setEasingMode(CircleEase.EASINGMODE_EASEIN);
                        break;
                    case GeometryEaseBlockTypes.EaseOutCirc:
                        this._easingFunction = new CircleEase();
                        this._easingFunction.setEasingMode(CircleEase.EASINGMODE_EASEOUT);
                        break;
                    case GeometryEaseBlockTypes.EaseInOutCirc:
                        this._easingFunction = new CircleEase();
                        this._easingFunction.setEasingMode(CircleEase.EASINGMODE_EASEINOUT);
                        break;
                    case GeometryEaseBlockTypes.EaseInBack:
                        this._easingFunction = new BackEase();
                        this._easingFunction.setEasingMode(BackEase.EASINGMODE_EASEIN);
                        break;
                    case GeometryEaseBlockTypes.EaseOutBack:
                        this._easingFunction = new BackEase();
                        this._easingFunction.setEasingMode(BackEase.EASINGMODE_EASEOUT);
                        break;
                    case GeometryEaseBlockTypes.EaseInOutBack:
                        this._easingFunction = new BackEase();
                        this._easingFunction.setEasingMode(BackEase.EASINGMODE_EASEINOUT);
                        break;
                    case GeometryEaseBlockTypes.EaseInElastic:
                        this._easingFunction = new ElasticEase();
                        this._easingFunction.setEasingMode(ElasticEase.EASINGMODE_EASEIN);
                        break;
                    case GeometryEaseBlockTypes.EaseOutElastic:
                        this._easingFunction = new ElasticEase();
                        this._easingFunction.setEasingMode(ElasticEase.EASINGMODE_EASEOUT);
                        break;
                    case GeometryEaseBlockTypes.EaseInOutElastic:
                        this._easingFunction = new ElasticEase();
                        this._easingFunction.setEasingMode(ElasticEase.EASINGMODE_EASEINOUT);
                        break;
                }
            }
            /**
             * Creates a new GeometryEaseBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                this._easingFunction = (__runInitializers(this, _instanceExtraInitializers), new SineEase());
                this._type = GeometryEaseBlockTypes.EaseInOutSine;
                this.registerInput("input", NodeGeometryBlockConnectionPointTypes.AutoDetect);
                this.registerOutput("output", NodeGeometryBlockConnectionPointTypes.BasedOnInput);
                this._outputs[0]._typeConnectionSource = this._inputs[0];
                this._inputs[0].excludedConnectionPointTypes.push(NodeGeometryBlockConnectionPointTypes.Matrix);
                this._inputs[0].excludedConnectionPointTypes.push(NodeGeometryBlockConnectionPointTypes.Geometry);
                this._inputs[0].excludedConnectionPointTypes.push(NodeGeometryBlockConnectionPointTypes.Texture);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "GeometryEaseBlock";
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
            _buildBlock(state) {
                super._buildBlock(state);
                if (!this._easingFunction) {
                    this.output._storedFunction = null;
                    this.output._storedValue = null;
                    return;
                }
                switch (this.input.type) {
                    case NodeGeometryBlockConnectionPointTypes.Int:
                    case NodeGeometryBlockConnectionPointTypes.Float: {
                        this.output._storedFunction = (state) => {
                            const source = this.input.getConnectedValue(state);
                            return this._easingFunction.ease(source);
                        };
                        break;
                    }
                    case NodeGeometryBlockConnectionPointTypes.Vector2: {
                        this.output._storedFunction = (state) => {
                            const source = this.input.getConnectedValue(state);
                            return new Vector2(this._easingFunction.ease(source.x), this._easingFunction.ease(source.y));
                        };
                        break;
                    }
                    case NodeGeometryBlockConnectionPointTypes.Vector3: {
                        this.output._storedFunction = (state) => {
                            const source = this.input.getConnectedValue(state);
                            return new Vector3(this._easingFunction.ease(source.x), this._easingFunction.ease(source.y), this._easingFunction.ease(source.z));
                        };
                        break;
                    }
                    case NodeGeometryBlockConnectionPointTypes.Vector4: {
                        this.output._storedFunction = (state) => {
                            const source = this.input.getConnectedValue(state);
                            return new Vector4(this._easingFunction.ease(source.x), this._easingFunction.ease(source.y), this._easingFunction.ease(source.z), this._easingFunction.ease(source.w));
                        };
                        break;
                    }
                }
                return this;
            }
            /** @internal */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.type = this.type;
                return serializationObject;
            }
            /** @internal */
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.type = serializationObject.type;
            }
            _dumpPropertiesCode() {
                const codeString = super._dumpPropertiesCode() + `${this._codeVariableName}.type = BABYLON.GeometryEaseBlockTypes.${GeometryEaseBlockTypes[this.type]};\n`;
                return codeString;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_type_decorators = [editableInPropertyPage("Type", 5 /* PropertyTypeForEdition.List */, "ADVANCED", {
                    notifiers: { rebuild: true },
                    embedded: true,
                    options: [
                        { label: "EaseInSine", value: GeometryEaseBlockTypes.EaseInSine },
                        { label: "EaseOutSine", value: GeometryEaseBlockTypes.EaseOutSine },
                        { label: "EaseInOutSine", value: GeometryEaseBlockTypes.EaseInOutSine },
                        { label: "EaseInQuad", value: GeometryEaseBlockTypes.EaseInQuad },
                        { label: "EaseOutQuad", value: GeometryEaseBlockTypes.EaseOutQuad },
                        { label: "EaseInOutQuad", value: GeometryEaseBlockTypes.EaseInOutQuad },
                        { label: "EaseInCubic", value: GeometryEaseBlockTypes.EaseInCubic },
                        { label: "EaseOutCubic", value: GeometryEaseBlockTypes.EaseOutCubic },
                        { label: "EaseInOutCubic", value: GeometryEaseBlockTypes.EaseInOutCubic },
                        { label: "EaseInQuart", value: GeometryEaseBlockTypes.EaseInQuart },
                        { label: "EaseOutQuart", value: GeometryEaseBlockTypes.EaseOutQuart },
                        { label: "EaseInOutQuart", value: GeometryEaseBlockTypes.EaseInOutQuart },
                        { label: "EaseInQuint", value: GeometryEaseBlockTypes.EaseInQuint },
                        { label: "EaseOutQuint", value: GeometryEaseBlockTypes.EaseOutQuint },
                        { label: "EaseInOutQuint", value: GeometryEaseBlockTypes.EaseInOutQuint },
                        { label: "EaseInExpo", value: GeometryEaseBlockTypes.EaseInExpo },
                        { label: "EaseOutExpo", value: GeometryEaseBlockTypes.EaseOutExpo },
                        { label: "EaseInOutExpo", value: GeometryEaseBlockTypes.EaseInOutExpo },
                        { label: "EaseInCirc", value: GeometryEaseBlockTypes.EaseInCirc },
                        { label: "EaseOutCirc", value: GeometryEaseBlockTypes.EaseOutCirc },
                        { label: "EaseInOutCirc", value: GeometryEaseBlockTypes.EaseInOutCirc },
                        { label: "EaseInBack", value: GeometryEaseBlockTypes.EaseInBack },
                        { label: "EaseOutBack", value: GeometryEaseBlockTypes.EaseOutBack },
                        { label: "EaseInOutBack", value: GeometryEaseBlockTypes.EaseInOutBack },
                        { label: "EaseInElastic", value: GeometryEaseBlockTypes.EaseInElastic },
                        { label: "EaseOutElastic", value: GeometryEaseBlockTypes.EaseOutElastic },
                        { label: "EaseInOutElastic", value: GeometryEaseBlockTypes.EaseInOutElastic },
                    ],
                })];
            __esDecorate(_a, null, _get_type_decorators, { kind: "getter", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { GeometryEaseBlock };
let _Registered = false;
/**
 * Register side effects for geometryEaseBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterGeometryEaseBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.GeometryEaseBlock", GeometryEaseBlock);
}
//# sourceMappingURL=geometryEaseBlock.pure.js.map