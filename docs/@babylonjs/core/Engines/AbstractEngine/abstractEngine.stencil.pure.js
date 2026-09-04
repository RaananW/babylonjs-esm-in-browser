import { AbstractEngine } from "../abstractEngine.pure.js";
/** This file must only contain pure code and pure imports */
let _Registered = false;
/**
 * Register side effects for abstractEngineStencil.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterAbstractEngineStencil() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    AbstractEngine.prototype.getStencilBuffer = function () {
        return this._stencilState.stencilTest;
    };
    AbstractEngine.prototype.setStencilBuffer = function (enable) {
        this._stencilState.stencilTest = enable;
    };
    AbstractEngine.prototype.getStencilMask = function () {
        return this._stencilState.stencilMask;
    };
    AbstractEngine.prototype.setStencilMask = function (mask) {
        this._stencilState.stencilMask = mask;
    };
    AbstractEngine.prototype.getStencilFunction = function () {
        return this._stencilState.stencilFunc;
    };
    AbstractEngine.prototype.getStencilBackFunction = function () {
        return this._stencilState.stencilBackFunc;
    };
    AbstractEngine.prototype.getStencilFunctionReference = function () {
        return this._stencilState.stencilFuncRef;
    };
    AbstractEngine.prototype.getStencilFunctionMask = function () {
        return this._stencilState.stencilFuncMask;
    };
    AbstractEngine.prototype.setStencilFunction = function (stencilFunc) {
        this._stencilState.stencilFunc = stencilFunc;
    };
    AbstractEngine.prototype.setStencilBackFunction = function (stencilFunc) {
        this._stencilState.stencilBackFunc = stencilFunc;
    };
    AbstractEngine.prototype.setStencilFunctionReference = function (reference) {
        this._stencilState.stencilFuncRef = reference;
    };
    AbstractEngine.prototype.setStencilFunctionMask = function (mask) {
        this._stencilState.stencilFuncMask = mask;
    };
    AbstractEngine.prototype.getStencilOperationFail = function () {
        return this._stencilState.stencilOpStencilFail;
    };
    AbstractEngine.prototype.getStencilBackOperationFail = function () {
        return this._stencilState.stencilBackOpStencilFail;
    };
    AbstractEngine.prototype.getStencilOperationDepthFail = function () {
        return this._stencilState.stencilOpDepthFail;
    };
    AbstractEngine.prototype.getStencilBackOperationDepthFail = function () {
        return this._stencilState.stencilBackOpDepthFail;
    };
    AbstractEngine.prototype.getStencilOperationPass = function () {
        return this._stencilState.stencilOpStencilDepthPass;
    };
    AbstractEngine.prototype.getStencilBackOperationPass = function () {
        return this._stencilState.stencilBackOpStencilDepthPass;
    };
    AbstractEngine.prototype.setStencilOperationFail = function (operation) {
        this._stencilState.stencilOpStencilFail = operation;
    };
    AbstractEngine.prototype.setStencilBackOperationFail = function (operation) {
        this._stencilState.stencilBackOpStencilFail = operation;
    };
    AbstractEngine.prototype.setStencilOperationDepthFail = function (operation) {
        this._stencilState.stencilOpDepthFail = operation;
    };
    AbstractEngine.prototype.setStencilBackOperationDepthFail = function (operation) {
        this._stencilState.stencilBackOpDepthFail = operation;
    };
    AbstractEngine.prototype.setStencilOperationPass = function (operation) {
        this._stencilState.stencilOpStencilDepthPass = operation;
    };
    AbstractEngine.prototype.setStencilBackOperationPass = function (operation) {
        this._stencilState.stencilBackOpStencilDepthPass = operation;
    };
    AbstractEngine.prototype.cacheStencilState = function () {
        this._cachedStencilBuffer = this.getStencilBuffer();
        this._cachedStencilFunction = this.getStencilFunction();
        this._cachedStencilMask = this.getStencilMask();
        this._cachedStencilOperationPass = this.getStencilOperationPass();
        this._cachedStencilOperationFail = this.getStencilOperationFail();
        this._cachedStencilOperationDepthFail = this.getStencilOperationDepthFail();
        this._cachedStencilReference = this.getStencilFunctionReference();
    };
    AbstractEngine.prototype.restoreStencilState = function () {
        this.setStencilFunction(this._cachedStencilFunction);
        this.setStencilMask(this._cachedStencilMask);
        this.setStencilBuffer(this._cachedStencilBuffer);
        this.setStencilOperationPass(this._cachedStencilOperationPass);
        this.setStencilOperationFail(this._cachedStencilOperationFail);
        this.setStencilOperationDepthFail(this._cachedStencilOperationDepthFail);
        this.setStencilFunctionReference(this._cachedStencilReference);
    };
}
//# sourceMappingURL=abstractEngine.stencil.pure.js.map