import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { SerializationHelper } from "../Misc/decorators.serialization.js";

import { serialize } from "../Misc/decorators.js";
/**
 * Class that holds the different stencil states of a material
 * Usage example: https://playground.babylonjs.com/#CW5PRI#10
 */
let MaterialStencilState = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _get_func_decorators;
    let _get_backFunc_decorators;
    let _get_funcRef_decorators;
    let _get_funcMask_decorators;
    let _get_opStencilFail_decorators;
    let _get_opDepthFail_decorators;
    let _get_opStencilDepthPass_decorators;
    let _get_backOpStencilFail_decorators;
    let _get_backOpDepthFail_decorators;
    let _get_backOpStencilDepthPass_decorators;
    let _get_mask_decorators;
    let _get_enabled_decorators;
    return _a = class MaterialStencilState {
            /**
             * Creates a material stencil state instance
             */
            constructor() {
                this._func = __runInitializers(this, _instanceExtraInitializers);
                this.reset();
            }
            /**
             * Resets all the stencil states to default values
             */
            reset() {
                this.enabled = false;
                this.mask = 0xff;
                this.funcRef = 1;
                this.funcMask = 0xff;
                this.func = 519;
                this.opStencilFail = 7680;
                this.opDepthFail = 7680;
                this.opStencilDepthPass = 7681;
                this.backFunc = 519;
                this.backOpStencilFail = 7680;
                this.backOpDepthFail = 7680;
                this.backOpStencilDepthPass = 7681;
            }
            /**
             * Gets or sets the stencil function
             */
            get func() {
                return this._func;
            }
            set func(value) {
                this._func = value;
            }
            /**
             * Gets or sets the stencil back function
             */
            get backFunc() {
                return this._backFunc;
            }
            set backFunc(value) {
                this._backFunc = value;
            }
            /**
             * Gets or sets the stencil function reference
             */
            get funcRef() {
                return this._funcRef;
            }
            set funcRef(value) {
                this._funcRef = value;
            }
            /**
             * Gets or sets the stencil function mask
             */
            get funcMask() {
                return this._funcMask;
            }
            set funcMask(value) {
                this._funcMask = value;
            }
            /**
             * Gets or sets the operation when the stencil test fails
             */
            get opStencilFail() {
                return this._opStencilFail;
            }
            set opStencilFail(value) {
                this._opStencilFail = value;
            }
            /**
             * Gets or sets the operation when the depth test fails
             */
            get opDepthFail() {
                return this._opDepthFail;
            }
            set opDepthFail(value) {
                this._opDepthFail = value;
            }
            /**
             * Gets or sets the operation when the stencil+depth test succeeds
             */
            get opStencilDepthPass() {
                return this._opStencilDepthPass;
            }
            set opStencilDepthPass(value) {
                this._opStencilDepthPass = value;
            }
            /**
             * Gets or sets the operation when the back stencil test fails
             */
            get backOpStencilFail() {
                return this._backOpStencilFail;
            }
            set backOpStencilFail(value) {
                this._backOpStencilFail = value;
            }
            /**
             * Gets or sets the operation when the back depth test fails
             */
            get backOpDepthFail() {
                return this._backOpDepthFail;
            }
            set backOpDepthFail(value) {
                this._backOpDepthFail = value;
            }
            /**
             * Gets or sets the operation when the back stencil+depth test succeeds
             */
            get backOpStencilDepthPass() {
                return this._backOpStencilDepthPass;
            }
            set backOpStencilDepthPass(value) {
                this._backOpStencilDepthPass = value;
            }
            /**
             * Gets or sets the stencil mask
             */
            get mask() {
                return this._mask;
            }
            set mask(value) {
                this._mask = value;
            }
            /**
             * Enables or disables the stencil test
             */
            get enabled() {
                return this._enabled;
            }
            set enabled(value) {
                this._enabled = value;
            }
            /**
             * Get the current class name, useful for serialization or dynamic coding.
             * @returns "MaterialStencilState"
             */
            getClassName() {
                return "MaterialStencilState";
            }
            /**
             * Makes a duplicate of the current configuration into another one.
             * @param stencilState defines stencil state where to copy the info
             */
            copyTo(stencilState) {
                SerializationHelper.Clone(() => stencilState, this);
            }
            /**
             * Serializes this stencil configuration.
             * @returns - An object with the serialized config.
             */
            serialize() {
                return SerializationHelper.Serialize(this);
            }
            /**
             * Parses a stencil state configuration from a serialized object.
             * @param source - Serialized object.
             * @param scene Defines the scene we are parsing for
             * @param rootUrl Defines the rootUrl to load from
             */
            parse(source, scene, rootUrl) {
                SerializationHelper.Parse(() => this, source, scene, rootUrl);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _get_func_decorators = [serialize()];
            _get_backFunc_decorators = [serialize()];
            _get_funcRef_decorators = [serialize()];
            _get_funcMask_decorators = [serialize()];
            _get_opStencilFail_decorators = [serialize()];
            _get_opDepthFail_decorators = [serialize()];
            _get_opStencilDepthPass_decorators = [serialize()];
            _get_backOpStencilFail_decorators = [serialize()];
            _get_backOpDepthFail_decorators = [serialize()];
            _get_backOpStencilDepthPass_decorators = [serialize()];
            _get_mask_decorators = [serialize()];
            _get_enabled_decorators = [serialize()];
            __esDecorate(_a, null, _get_func_decorators, { kind: "getter", name: "func", static: false, private: false, access: { has: obj => "func" in obj, get: obj => obj.func }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_backFunc_decorators, { kind: "getter", name: "backFunc", static: false, private: false, access: { has: obj => "backFunc" in obj, get: obj => obj.backFunc }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_funcRef_decorators, { kind: "getter", name: "funcRef", static: false, private: false, access: { has: obj => "funcRef" in obj, get: obj => obj.funcRef }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_funcMask_decorators, { kind: "getter", name: "funcMask", static: false, private: false, access: { has: obj => "funcMask" in obj, get: obj => obj.funcMask }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_opStencilFail_decorators, { kind: "getter", name: "opStencilFail", static: false, private: false, access: { has: obj => "opStencilFail" in obj, get: obj => obj.opStencilFail }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_opDepthFail_decorators, { kind: "getter", name: "opDepthFail", static: false, private: false, access: { has: obj => "opDepthFail" in obj, get: obj => obj.opDepthFail }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_opStencilDepthPass_decorators, { kind: "getter", name: "opStencilDepthPass", static: false, private: false, access: { has: obj => "opStencilDepthPass" in obj, get: obj => obj.opStencilDepthPass }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_backOpStencilFail_decorators, { kind: "getter", name: "backOpStencilFail", static: false, private: false, access: { has: obj => "backOpStencilFail" in obj, get: obj => obj.backOpStencilFail }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_backOpDepthFail_decorators, { kind: "getter", name: "backOpDepthFail", static: false, private: false, access: { has: obj => "backOpDepthFail" in obj, get: obj => obj.backOpDepthFail }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_backOpStencilDepthPass_decorators, { kind: "getter", name: "backOpStencilDepthPass", static: false, private: false, access: { has: obj => "backOpStencilDepthPass" in obj, get: obj => obj.backOpStencilDepthPass }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_mask_decorators, { kind: "getter", name: "mask", static: false, private: false, access: { has: obj => "mask" in obj, get: obj => obj.mask }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_enabled_decorators, { kind: "getter", name: "enabled", static: false, private: false, access: { has: obj => "enabled" in obj, get: obj => obj.enabled }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { MaterialStencilState };
//# sourceMappingURL=materialStencilState.js.map