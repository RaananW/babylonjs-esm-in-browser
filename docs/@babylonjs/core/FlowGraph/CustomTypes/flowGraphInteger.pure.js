import { RegisterClass } from "../../Misc/typeStore.js";
/** This file must only contain pure code and pure imports */
/**
 * Class that represents an integer value.
 */
export class FlowGraphInteger {
    constructor(value) {
        this.value = this._toInt(value);
    }
    /**
     * Converts a float to an integer.
     * @param n the float to convert
     * @returns the result of n | 0 - converting it to a int
     */
    _toInt(n) {
        return n | 0;
    }
    /**
     * Adds two integers together.
     * @param other the other integer to add
     * @returns a FlowGraphInteger with the result of the addition
     */
    add(other) {
        return new FlowGraphInteger(this.value + other.value);
    }
    /**
     * Subtracts two integers.
     * @param other the other integer to subtract
     * @returns a FlowGraphInteger with the result of the subtraction
     */
    subtract(other) {
        return new FlowGraphInteger(this.value - other.value);
    }
    /**
     * Multiplies two integers.
     * @param other the other integer to multiply
     * @returns a FlowGraphInteger with the result of the multiplication
     */
    multiply(other) {
        return new FlowGraphInteger(Math.imul(this.value, other.value));
    }
    /**
     * Divides two integers.
     * @param other the other integer to divide
     * @returns a FlowGraphInteger with the result of the division
     */
    divide(other) {
        return new FlowGraphInteger(this.value / other.value);
    }
    /**
     * The class name of this type.
     * @returns
     */
    getClassName() {
        return FlowGraphInteger.ClassName;
    }
    /**
     * Compares two integers for equality.
     * @param other the other integer to compare
     * @returns true if the integers are equal
     */
    equals(other) {
        return this.value === other.value;
    }
    /**
     * Parses a FlowGraphInteger from a serialization object.
     * @param value te number to parse
     * @returns a new FlowGraphInteger
     */
    static FromValue(value) {
        return new FlowGraphInteger(value);
    }
    /**
     * Returns a string representation of this integer
     * @returns the string representation
     */
    toString() {
        return this.value.toString();
    }
}
/** The class name of this type */
FlowGraphInteger.ClassName = "FlowGraphInteger";
let _Registered = false;
/**
 * Register side effects for flowGraphInteger.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphInteger() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphInteger", FlowGraphInteger);
}
//# sourceMappingURL=flowGraphInteger.pure.js.map