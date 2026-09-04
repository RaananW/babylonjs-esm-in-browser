/**
 * A class that lazily initializes a value given a factory function.
 */
export class Lazy {
    /**
     * Creates a new instance of the Lazy class.
     * @param factory A function that creates the value.
     */
    constructor(factory) {
        this._factory = factory;
    }
    /**
     * Gets the lazily initialized value.
     */
    get value() {
        // If the factory function is still defined, it means we haven't called it yet.
        if (this._factory) {
            this._value = this._factory();
            // Set the factory function to undefined to allow it to be garbage collected.
            this._factory = undefined;
        }
        return this._value;
    }
}
//# sourceMappingURL=lazy.js.map