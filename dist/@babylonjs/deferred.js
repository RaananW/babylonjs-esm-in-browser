/**
 * Wrapper class for promise with external resolve and reject.
 */
export class Deferred {
    /**
     * Constructor for this deferred object.
     */
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }
    /**
     * The resolve method of the promise associated with this deferred object.
     */
    get resolve() {
        return this._resolve;
    }
    /**
     * The reject method of the promise associated with this deferred object.
     */
    get reject() {
        return this._reject;
    }
}
//# sourceMappingURL=deferred.js.map