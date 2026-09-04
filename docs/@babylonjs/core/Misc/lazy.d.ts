/**
 * A class that lazily initializes a value given a factory function.
 */
export declare class Lazy<T> {
    private _factory;
    private _value;
    /**
     * Creates a new instance of the Lazy class.
     * @param factory A function that creates the value.
     */
    constructor(factory: () => T);
    /**
     * Gets the lazily initialized value.
     */
    get value(): T;
}
