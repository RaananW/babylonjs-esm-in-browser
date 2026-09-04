/**
 * Base class for a frame graph pass.
 */
export class FrameGraphPass {
    /** @internal */
    constructor(name, _parentTask, _context) {
        this.name = name;
        this._parentTask = _parentTask;
        this._context = _context;
        /**
         * Whether the pass is disabled. Disabled passes will be skipped during execution.
         */
        this.disabled = false;
    }
    /**
     * Initializes the pass.
     * This function is called once after the frame graph has been built
     * @param func The function to initialize the pass.
     */
    setInitializeFunc(func) {
        this._initFunc = func;
    }
    /**
     * Sets the function to execute when the pass is executed
     * @param func The function to execute when the pass is executed
     */
    setExecuteFunc(func) {
        this._executeFunc = func;
    }
    /** @internal */
    _execute() {
        if (!this.disabled) {
            this._executeFunc(this._context);
        }
    }
    /** @internal */
    _initialize() {
        this._initFunc?.(this._context);
    }
    /** @internal */
    _isValid() {
        return this._executeFunc !== undefined ? null : "Execute function is not set (call setExecuteFunc to set it)";
    }
    /** @internal */
    _dispose() { }
}
//# sourceMappingURL=pass.js.map