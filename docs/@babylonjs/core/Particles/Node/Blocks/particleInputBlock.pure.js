/** This file must only contain pure code and pure imports */
import { Observable } from "../../../Misc/observable.pure.js";
import { GetClass, RegisterClass } from "../../../Misc/typeStore.js";
import { Matrix, Vector2, Vector3 } from "../../../Maths/math.vector.pure.js";
import { NodeParticleBlock } from "../nodeParticleBlock.js";
import { NodeParticleBlockConnectionPointTypes } from "../Enums/nodeParticleBlockConnectionPointTypes.js";
import { Color4 } from "../../../Maths/math.color.pure.js";
import { NodeParticleContextualSources } from "../Enums/nodeParticleContextualSources.js";
import { NodeParticleSystemSources } from "../Enums/nodeParticleSystemSources.js";
/**
 * Block used to expose an input value
 */
export class ParticleInputBlock extends NodeParticleBlock {
    /**
     * Gets or sets the connection point type (default is float)
     */
    get type() {
        if (this._type === NodeParticleBlockConnectionPointTypes.AutoDetect) {
            if (this.value != null) {
                if (!isNaN(this.value)) {
                    this._type = NodeParticleBlockConnectionPointTypes.Float;
                    return this._type;
                }
                switch (this.value.getClassName()) {
                    case "Vector2":
                        this._type = NodeParticleBlockConnectionPointTypes.Vector2;
                        return this._type;
                    case "Vector3":
                        this._type = NodeParticleBlockConnectionPointTypes.Vector3;
                        return this._type;
                    case "Color4":
                        this._type = NodeParticleBlockConnectionPointTypes.Color4;
                        return this._type;
                    case "Matrix":
                        this._type = NodeParticleBlockConnectionPointTypes.Matrix;
                        return this._type;
                }
            }
        }
        return this._type;
    }
    /**
     * Gets a boolean indicating that the current connection point is a system source
     */
    get isSystemSource() {
        return this._contextualSource === NodeParticleContextualSources.None && this._systemSource !== NodeParticleSystemSources.None;
    }
    /**
     * Gets or sets the system source used by this input block
     */
    get systemSource() {
        return this._systemSource;
    }
    set systemSource(value) {
        this._systemSource = value;
        if (value !== NodeParticleSystemSources.None) {
            this._contextualSource = NodeParticleContextualSources.None;
            this._type = NodeParticleBlockConnectionPointTypes.Float;
            switch (value) {
                case NodeParticleSystemSources.Time:
                case NodeParticleSystemSources.Delta:
                    this._type = NodeParticleBlockConnectionPointTypes.Float;
                    break;
                case NodeParticleSystemSources.Emitter:
                case NodeParticleSystemSources.CameraPosition:
                    this._type = NodeParticleBlockConnectionPointTypes.Vector3;
                    break;
            }
            if (this.output) {
                this.output.type = this._type;
            }
        }
    }
    /**
     * Gets a boolean indicating that the current connection point is a contextual value
     */
    get isContextual() {
        return this._contextualSource !== NodeParticleContextualSources.None;
    }
    /**
     * Gets or sets the current contextual value
     */
    get contextualValue() {
        return this._contextualSource;
    }
    set contextualValue(value) {
        this._contextualSource = value;
        if (value !== NodeParticleContextualSources.None) {
            this._systemSource = NodeParticleSystemSources.None;
            switch (value) {
                case NodeParticleContextualSources.Scale:
                    this._type = NodeParticleBlockConnectionPointTypes.Vector2;
                    break;
                case NodeParticleContextualSources.Position:
                case NodeParticleContextualSources.Direction:
                case NodeParticleContextualSources.ScaledDirection:
                case NodeParticleContextualSources.InitialDirection:
                case NodeParticleContextualSources.LocalPositionUpdated:
                    this._type = NodeParticleBlockConnectionPointTypes.Vector3;
                    break;
                case NodeParticleContextualSources.Color:
                case NodeParticleContextualSources.InitialColor:
                case NodeParticleContextualSources.ColorDead:
                case NodeParticleContextualSources.ColorStep:
                case NodeParticleContextualSources.ScaledColorStep:
                    this._type = NodeParticleBlockConnectionPointTypes.Color4;
                    break;
                case NodeParticleContextualSources.Age:
                case NodeParticleContextualSources.Lifetime:
                case NodeParticleContextualSources.Angle:
                case NodeParticleContextualSources.AgeGradient:
                case NodeParticleContextualSources.Size:
                case NodeParticleContextualSources.DirectionScale:
                    this._type = NodeParticleBlockConnectionPointTypes.Float;
                    break;
                case NodeParticleContextualSources.SpriteCellEnd:
                case NodeParticleContextualSources.SpriteCellStart:
                case NodeParticleContextualSources.SpriteCellIndex:
                    this._type = NodeParticleBlockConnectionPointTypes.Int;
                    break;
            }
            if (this.output) {
                this.output.type = this._type;
            }
        }
    }
    /**
     * Creates a new InputBlock
     * @param name defines the block name
     * @param type defines the type of the input (can be set to NodeParticleBlockConnectionPointTypes.AutoDetect)
     */
    constructor(name, type = NodeParticleBlockConnectionPointTypes.AutoDetect) {
        super(name);
        this._type = NodeParticleBlockConnectionPointTypes.Undefined;
        /** Gets or set a value used to limit the range of float values */
        this.min = 0;
        /** Gets or set a value used to limit the range of float values */
        this.max = 0;
        /** Gets or sets the group to use to display this block in the Inspector */
        this.groupInInspector = "";
        /**
         * Gets or sets a boolean indicating that this input is displayed in the Inspector
         */
        this.displayInInspector = true;
        /** Gets an observable raised when the value is changed */
        this.onValueChangedObservable = new Observable();
        /** @internal */
        this._systemSource = NodeParticleSystemSources.None;
        this._contextualSource = NodeParticleContextualSources.None;
        this._type = type;
        this._isInput = true;
        this._storedValue = null;
        this.setDefaultValue();
        this.registerOutput("output", type);
    }
    /**
     * Gets or sets the value of that point.
     * Please note that this value will be ignored if valueCallback is defined
     */
    get value() {
        return this._storedValue;
    }
    set value(value) {
        if (this.type === NodeParticleBlockConnectionPointTypes.Float) {
            if (this.min !== this.max) {
                value = Math.max(this.min, value);
                value = Math.min(this.max, value);
            }
        }
        this._storedValue = value;
        this.onValueChangedObservable.notifyObservers(this);
    }
    /**
     * Gets or sets a callback used to get the value of that point.
     * Please note that setting this value will force the connection point to ignore the value property
     */
    get valueCallback() {
        return this._valueCallback;
    }
    set valueCallback(value) {
        this._valueCallback = value;
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "ParticleInputBlock";
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    /**
     * Set the input block to its default value (based on its type)
     */
    setDefaultValue() {
        switch (this.type) {
            case NodeParticleBlockConnectionPointTypes.Int:
            case NodeParticleBlockConnectionPointTypes.Float:
                this.value = 0;
                break;
            case NodeParticleBlockConnectionPointTypes.Vector2:
                this.value = Vector2.Zero();
                break;
            case NodeParticleBlockConnectionPointTypes.Vector3:
                this.value = Vector3.Zero();
                break;
            case NodeParticleBlockConnectionPointTypes.Color4:
                this.value = new Color4(1, 1, 1, 1);
                break;
            case NodeParticleBlockConnectionPointTypes.Matrix:
                this.value = Matrix.Identity();
                break;
        }
    }
    _build(state) {
        super._build(state);
        if (this.isSystemSource) {
            this.output._storedValue = null;
            this.output._storedFunction = (state) => {
                return state.getSystemValue(this._systemSource);
            };
        }
        else if (this.isContextual) {
            this.output._storedValue = null;
            this.output._storedFunction = (state) => {
                return state.getContextualValue(this._contextualSource);
            };
        }
        else {
            this.output._storedValue = this.value;
            // As a function to let the user dynamically change the value at runtime
            this.output._storedFunction = () => {
                return this.value;
            };
        }
    }
    dispose() {
        this.onValueChangedObservable.clear();
        super.dispose();
    }
    serialize() {
        const serializationObject = super.serialize();
        serializationObject.type = this.type;
        serializationObject.contextualValue = this.contextualValue;
        serializationObject.systemSource = this.systemSource;
        serializationObject.min = this.min;
        serializationObject.max = this.max;
        serializationObject.groupInInspector = this.groupInInspector;
        serializationObject.displayInInspector = this.displayInInspector;
        if (this._storedValue !== null && !this.isContextual && !this.isSystemSource) {
            if (this._storedValue.asArray) {
                serializationObject.valueType = "BABYLON." + this._storedValue.getClassName();
                serializationObject.value = this._storedValue.asArray();
            }
            else {
                serializationObject.valueType = "number";
                serializationObject.value = this._storedValue;
            }
        }
        return serializationObject;
    }
    _deserialize(serializationObject) {
        super._deserialize(serializationObject);
        this._type = serializationObject.type;
        this.contextualValue = serializationObject.contextualValue;
        this.systemSource = serializationObject.systemSource || NodeParticleSystemSources.None;
        this.min = serializationObject.min || 0;
        this.max = serializationObject.max || 0;
        this.groupInInspector = serializationObject.groupInInspector || "";
        if (serializationObject.displayInInspector !== undefined) {
            this.displayInInspector = serializationObject.displayInInspector;
        }
        if (!serializationObject.valueType) {
            return;
        }
        if (serializationObject.valueType === "number") {
            this._storedValue = serializationObject.value;
        }
        else {
            const valueType = GetClass(serializationObject.valueType);
            if (valueType) {
                this._storedValue = valueType.FromArray(serializationObject.value);
            }
        }
    }
}
let _Registered = false;
/**
 * Register side effects for particleInputBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterParticleInputBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ParticleInputBlock", ParticleInputBlock);
}
//# sourceMappingURL=particleInputBlock.pure.js.map