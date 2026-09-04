/** This file must only contain pure code and pure imports */
import { Observable } from "../../../Misc/observable.pure.js";
import { NodeGeometryBlockConnectionPointTypes } from "../Enums/nodeGeometryConnectionPointTypes.js";
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to trigger an observable when traversed
 * It can also be used to execute a function when traversed
 */
export class GeometryInterceptorBlock extends NodeGeometryBlock {
    /**
     * Creates a new GeometryInterceptorBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        /**
         * Observable triggered when the block is traversed
         */
        this.onInterceptionObservable = new Observable(undefined, true);
        this.registerInput("input", NodeGeometryBlockConnectionPointTypes.AutoDetect);
        this.registerOutput("output", NodeGeometryBlockConnectionPointTypes.BasedOnInput);
        this._outputs[0]._typeConnectionSource = this._inputs[0];
    }
    /**
     * Gets the time spent to build this block (in ms)
     */
    get buildExecutionTime() {
        return -1;
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "GeometryInterceptorBlock";
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
        const output = this._outputs[0];
        const input = this._inputs[0];
        output._storedFunction = (state) => {
            let value = input.getConnectedValue(state);
            if (this.customFunction) {
                value = this.customFunction(value, state);
            }
            this.onInterceptionObservable.notifyObservers(value);
            return value;
        };
    }
}
let _Registered = false;
/**
 * Register side effects for geometryInterceptorBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterGeometryInterceptorBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.GeometryInterceptorBlock", GeometryInterceptorBlock);
}
//# sourceMappingURL=geometryInterceptorBlock.pure.js.map