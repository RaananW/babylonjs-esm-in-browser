/**
 * A thin matrix class that is used for size reasons.
 * The class is identity by default
 */
export class ThinMatrix {
    constructor() {
        this._m = [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0];
        /**
         * Gets the update flag of the matrix which is an unique number for the matrix.
         * It will be incremented every time the matrix data change.
         * You can use it to speed the comparison between two versions of the same matrix.
         */
        this.updateFlag = 0;
    }
    /**
     * Returns the matrix as a Array<number>
     * @returns the matrix underlying array.
     */
    asArray() {
        return this._m;
    }
}
//# sourceMappingURL=thinMath.matrix.js.map