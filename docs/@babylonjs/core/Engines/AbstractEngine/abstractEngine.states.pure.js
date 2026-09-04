/** This file must only contain pure code and pure imports */

import { AbstractEngine } from "../abstractEngine.pure.js";
let _Registered = false;
/**
 * Register side effects for abstractEngineStates.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterAbstractEngineStates() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    AbstractEngine.prototype.getInputElement = function () {
        return this._renderingCanvas;
    };
    AbstractEngine.prototype.getDepthFunction = function () {
        return this._depthCullingState.depthFunc;
    };
    AbstractEngine.prototype.setDepthFunction = function (depthFunc) {
        this._depthCullingState.depthFunc = depthFunc;
    };
    AbstractEngine.prototype.setDepthFunctionToGreater = function () {
        this.setDepthFunction(516);
    };
    AbstractEngine.prototype.setDepthFunctionToGreaterOrEqual = function () {
        this.setDepthFunction(518);
    };
    AbstractEngine.prototype.setDepthFunctionToLess = function () {
        this.setDepthFunction(513);
    };
    AbstractEngine.prototype.setDepthFunctionToLessOrEqual = function () {
        this.setDepthFunction(515);
    };
    AbstractEngine.prototype.getDepthWrite = function () {
        return this._depthCullingState.depthMask;
    };
    AbstractEngine.prototype.setDepthWrite = function (enable) {
        this._depthCullingState.depthMask = enable;
    };
    AbstractEngine.prototype.setAlphaConstants = function (r, g, b, a) {
        this._alphaState.setAlphaBlendConstants(r, g, b, a);
    };
    AbstractEngine.prototype.getAlphaMode = function (targetIndex = 0) {
        return this._alphaMode[targetIndex];
    };
    AbstractEngine.prototype.getAlphaEquation = function (targetIndex = 0) {
        return this._alphaEquation[targetIndex];
    };
}
//# sourceMappingURL=abstractEngine.states.pure.js.map