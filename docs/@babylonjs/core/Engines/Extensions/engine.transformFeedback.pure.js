/** This file must only contain pure code and pure imports */
import { Engine } from "../../Engines/engine.pure.js";
/** @internal */
// eslint-disable-next-line no-var, @typescript-eslint/naming-convention
export var _forceTransformFeedbackToBundle = true;
let _Registered = false;
/**
 * Register side effects for engineTransformFeedback.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterEngineTransformFeedback() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Engine.prototype.createTransformFeedback = function () {
        const transformFeedback = this._gl.createTransformFeedback();
        if (!transformFeedback) {
            throw new Error("Unable to create Transform Feedback");
        }
        return transformFeedback;
    };
    Engine.prototype.deleteTransformFeedback = function (value) {
        this._gl.deleteTransformFeedback(value);
    };
    Engine.prototype.bindTransformFeedback = function (value) {
        this._gl.bindTransformFeedback(this._gl.TRANSFORM_FEEDBACK, value);
    };
    Engine.prototype.beginTransformFeedback = function (usePoints = true) {
        this._gl.beginTransformFeedback(usePoints ? this._gl.POINTS : this._gl.TRIANGLES);
    };
    Engine.prototype.endTransformFeedback = function () {
        this._gl.endTransformFeedback();
    };
    Engine.prototype.setTranformFeedbackVaryings = function (program, value) {
        this._gl.transformFeedbackVaryings(program, value, this._gl.INTERLEAVED_ATTRIBS);
    };
    Engine.prototype.bindTransformFeedbackBuffer = function (value) {
        this._gl.bindBufferBase(this._gl.TRANSFORM_FEEDBACK_BUFFER, 0, value ? value.underlyingResource : null);
    };
    Engine.prototype.readTransformFeedbackBuffer = function (target) {
        this._gl.getBufferSubData(this._gl.TRANSFORM_FEEDBACK_BUFFER, 0, target);
    };
}
//# sourceMappingURL=engine.transformFeedback.pure.js.map