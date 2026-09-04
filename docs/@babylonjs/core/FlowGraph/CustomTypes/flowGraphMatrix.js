import { Vector3, Vector2 } from "../../Maths/math.vector.pure.js";
// Note - the matrix classes are basically column-major, and work similarly to Babylon.js' Matrix class.
/**
 * A 2x2 matrix, stored in column-major order.
 *
 * BREAKING: this class was row-major in earlier releases — see {@link IFlowGraphMatrix} for the full
 * behaviour change (flat-array construction, transform, and multiply operand order).
 */
export class FlowGraphMatrix2D {
    constructor(m = [1, 0, 0, 1]) {
        this._m = m;
    }
    get m() {
        return this._m;
    }
    transformVector(v) {
        return this.transformVectorToRef(v, new Vector2());
    }
    transformVectorToRef(v, result) {
        result.x = v.x * this._m[0] + v.y * this._m[2];
        result.y = v.x * this._m[1] + v.y * this._m[3];
        return result;
    }
    asArray() {
        return this.toArray();
    }
    toArray(emptyArray = []) {
        for (let i = 0; i < 4; i++) {
            emptyArray[i] = this._m[i];
        }
        return emptyArray;
    }
    fromArray(array) {
        for (let i = 0; i < 4; i++) {
            this._m[i] = array[i];
        }
        return this;
    }
    multiplyToRef(other, result) {
        const otherMatrix = other._m;
        const thisMatrix = this._m;
        const r = result._m;
        // this * other, column-major (matches core Matrix and the glTF/KHR_interactivity convention)
        r[0] = thisMatrix[0] * otherMatrix[0] + thisMatrix[1] * otherMatrix[2];
        r[1] = thisMatrix[0] * otherMatrix[1] + thisMatrix[1] * otherMatrix[3];
        r[2] = thisMatrix[2] * otherMatrix[0] + thisMatrix[3] * otherMatrix[2];
        r[3] = thisMatrix[2] * otherMatrix[1] + thisMatrix[3] * otherMatrix[3];
        return result;
    }
    multiply(other) {
        return this.multiplyToRef(other, new FlowGraphMatrix2D());
    }
    divideToRef(other, result) {
        const m = this._m;
        const o = other._m;
        const r = result._m;
        r[0] = m[0] / o[0];
        r[1] = m[1] / o[1];
        r[2] = m[2] / o[2];
        r[3] = m[3] / o[3];
        return result;
    }
    divide(other) {
        return this.divideToRef(other, new FlowGraphMatrix2D());
    }
    addToRef(other, result) {
        const m = this._m;
        const o = other.m;
        const r = result.m;
        r[0] = m[0] + o[0];
        r[1] = m[1] + o[1];
        r[2] = m[2] + o[2];
        r[3] = m[3] + o[3];
        return result;
    }
    add(other) {
        return this.addToRef(other, new FlowGraphMatrix2D());
    }
    subtractToRef(other, result) {
        const m = this._m;
        const o = other.m;
        const r = result.m;
        r[0] = m[0] - o[0];
        r[1] = m[1] - o[1];
        r[2] = m[2] - o[2];
        r[3] = m[3] - o[3];
        return result;
    }
    subtract(other) {
        return this.subtractToRef(other, new FlowGraphMatrix2D());
    }
    transpose() {
        const m = this._m;
        return new FlowGraphMatrix2D([m[0], m[2], m[1], m[3]]);
    }
    determinant() {
        const m = this._m;
        return m[0] * m[3] - m[1] * m[2];
    }
    inverse() {
        const det = this.determinant();
        if (det === 0) {
            throw new Error("Matrix is not invertible");
        }
        const m = this._m;
        const invDet = 1 / det;
        return new FlowGraphMatrix2D([m[3] * invDet, -m[1] * invDet, -m[2] * invDet, m[0] * invDet]);
    }
    equals(other, epsilon = 0) {
        const m = this._m;
        const o = other.m;
        if (epsilon === 0) {
            return m[0] === o[0] && m[1] === o[1] && m[2] === o[2] && m[3] === o[3];
        }
        return Math.abs(m[0] - o[0]) < epsilon && Math.abs(m[1] - o[1]) < epsilon && Math.abs(m[2] - o[2]) < epsilon && Math.abs(m[3] - o[3]) < epsilon;
    }
    getClassName() {
        return "FlowGraphMatrix2D";
    }
    toString() {
        return `FlowGraphMatrix2D(${this._m.join(", ")})`;
    }
}
/**
 * A 3x3 matrix, stored in column-major order.
 *
 * BREAKING: this class was row-major in earlier releases — see {@link IFlowGraphMatrix} for the full
 * behaviour change (flat-array construction, transform, and multiply operand order).
 */
export class FlowGraphMatrix3D {
    constructor(array = [1, 0, 0, 0, 1, 0, 0, 0, 1]) {
        this._m = array;
    }
    get m() {
        return this._m;
    }
    transformVector(v) {
        return this.transformVectorToRef(v, new Vector3());
    }
    transformVectorToRef(v, result) {
        const m = this._m;
        result.x = v.x * m[0] + v.y * m[3] + v.z * m[6];
        result.y = v.x * m[1] + v.y * m[4] + v.z * m[7];
        result.z = v.x * m[2] + v.y * m[5] + v.z * m[8];
        return result;
    }
    multiplyToRef(other, result) {
        const otherMatrix = other._m;
        const thisMatrix = this._m;
        const r = result.m;
        r[0] = thisMatrix[0] * otherMatrix[0] + thisMatrix[1] * otherMatrix[3] + thisMatrix[2] * otherMatrix[6];
        r[1] = thisMatrix[0] * otherMatrix[1] + thisMatrix[1] * otherMatrix[4] + thisMatrix[2] * otherMatrix[7];
        r[2] = thisMatrix[0] * otherMatrix[2] + thisMatrix[1] * otherMatrix[5] + thisMatrix[2] * otherMatrix[8];
        r[3] = thisMatrix[3] * otherMatrix[0] + thisMatrix[4] * otherMatrix[3] + thisMatrix[5] * otherMatrix[6];
        r[4] = thisMatrix[3] * otherMatrix[1] + thisMatrix[4] * otherMatrix[4] + thisMatrix[5] * otherMatrix[7];
        r[5] = thisMatrix[3] * otherMatrix[2] + thisMatrix[4] * otherMatrix[5] + thisMatrix[5] * otherMatrix[8];
        r[6] = thisMatrix[6] * otherMatrix[0] + thisMatrix[7] * otherMatrix[3] + thisMatrix[8] * otherMatrix[6];
        r[7] = thisMatrix[6] * otherMatrix[1] + thisMatrix[7] * otherMatrix[4] + thisMatrix[8] * otherMatrix[7];
        r[8] = thisMatrix[6] * otherMatrix[2] + thisMatrix[7] * otherMatrix[5] + thisMatrix[8] * otherMatrix[8];
        return result;
    }
    multiply(other) {
        return this.multiplyToRef(other, new FlowGraphMatrix3D());
    }
    divideToRef(other, result) {
        const m = this._m;
        const o = other.m;
        const r = result.m;
        r[0] = m[0] / o[0];
        r[1] = m[1] / o[1];
        r[2] = m[2] / o[2];
        r[3] = m[3] / o[3];
        r[4] = m[4] / o[4];
        r[5] = m[5] / o[5];
        r[6] = m[6] / o[6];
        r[7] = m[7] / o[7];
        r[8] = m[8] / o[8];
        return result;
    }
    divide(other) {
        return this.divideToRef(other, new FlowGraphMatrix3D());
    }
    addToRef(other, result) {
        const m = this._m;
        const o = other.m;
        const r = result.m;
        r[0] = m[0] + o[0];
        r[1] = m[1] + o[1];
        r[2] = m[2] + o[2];
        r[3] = m[3] + o[3];
        r[4] = m[4] + o[4];
        r[5] = m[5] + o[5];
        r[6] = m[6] + o[6];
        r[7] = m[7] + o[7];
        r[8] = m[8] + o[8];
        return result;
    }
    add(other) {
        return this.addToRef(other, new FlowGraphMatrix3D());
    }
    subtractToRef(other, result) {
        const m = this._m;
        const o = other.m;
        const r = result.m;
        r[0] = m[0] - o[0];
        r[1] = m[1] - o[1];
        r[2] = m[2] - o[2];
        r[3] = m[3] - o[3];
        r[4] = m[4] - o[4];
        r[5] = m[5] - o[5];
        r[6] = m[6] - o[6];
        r[7] = m[7] - o[7];
        r[8] = m[8] - o[8];
        return result;
    }
    subtract(other) {
        return this.subtractToRef(other, new FlowGraphMatrix3D());
    }
    toArray(emptyArray = []) {
        for (let i = 0; i < 9; i++) {
            emptyArray[i] = this._m[i];
        }
        return emptyArray;
    }
    asArray() {
        return this.toArray();
    }
    fromArray(array) {
        for (let i = 0; i < 9; i++) {
            this._m[i] = array[i];
        }
        return this;
    }
    transpose() {
        const m = this._m;
        return new FlowGraphMatrix3D([m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]]);
    }
    determinant() {
        const m = this._m;
        return m[0] * (m[4] * m[8] - m[5] * m[7]) - m[1] * (m[3] * m[8] - m[5] * m[6]) + m[2] * (m[3] * m[7] - m[4] * m[6]);
    }
    inverse() {
        const det = this.determinant();
        if (det === 0) {
            throw new Error("Matrix is not invertible");
        }
        const m = this._m;
        const invDet = 1 / det;
        return new FlowGraphMatrix3D([
            (m[4] * m[8] - m[5] * m[7]) * invDet,
            (m[2] * m[7] - m[1] * m[8]) * invDet,
            (m[1] * m[5] - m[2] * m[4]) * invDet,
            (m[5] * m[6] - m[3] * m[8]) * invDet,
            (m[0] * m[8] - m[2] * m[6]) * invDet,
            (m[2] * m[3] - m[0] * m[5]) * invDet,
            (m[3] * m[7] - m[4] * m[6]) * invDet,
            (m[1] * m[6] - m[0] * m[7]) * invDet,
            (m[0] * m[4] - m[1] * m[3]) * invDet,
        ]);
    }
    equals(other, epsilon = 0) {
        const m = this._m;
        const o = other.m;
        // performance shortcut
        if (epsilon === 0) {
            return m[0] === o[0] && m[1] === o[1] && m[2] === o[2] && m[3] === o[3] && m[4] === o[4] && m[5] === o[5] && m[6] === o[6] && m[7] === o[7] && m[8] === o[8];
        }
        return (Math.abs(m[0] - o[0]) < epsilon &&
            Math.abs(m[1] - o[1]) < epsilon &&
            Math.abs(m[2] - o[2]) < epsilon &&
            Math.abs(m[3] - o[3]) < epsilon &&
            Math.abs(m[4] - o[4]) < epsilon &&
            Math.abs(m[5] - o[5]) < epsilon &&
            Math.abs(m[6] - o[6]) < epsilon &&
            Math.abs(m[7] - o[7]) < epsilon &&
            Math.abs(m[8] - o[8]) < epsilon);
    }
    getClassName() {
        return "FlowGraphMatrix3D";
    }
    toString() {
        return `FlowGraphMatrix3D(${this._m.join(", ")})`;
    }
}
//# sourceMappingURL=flowGraphMatrix.js.map