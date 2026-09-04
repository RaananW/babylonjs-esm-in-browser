import { type Nullable, type FrameGraphContext, type IFrameGraphPass, type FrameGraphTask } from "../../index.js";
/**
 * Base class for a frame graph pass.
 */
export declare class FrameGraphPass<T extends FrameGraphContext> implements IFrameGraphPass {
    name: string;
    protected readonly _parentTask: FrameGraphTask;
    protected readonly _context: T;
    private _executeFunc;
    private _initFunc?;
    /**
     * Whether the pass is disabled. Disabled passes will be skipped during execution.
     */
    disabled: boolean;
    /** @internal */
    constructor(name: string, _parentTask: FrameGraphTask, _context: T);
    /**
     * Initializes the pass.
     * This function is called once after the frame graph has been built
     * @param func The function to initialize the pass.
     */
    setInitializeFunc(func: (context: T) => void): void;
    /**
     * Sets the function to execute when the pass is executed
     * @param func The function to execute when the pass is executed
     */
    setExecuteFunc(func: (context: T) => void): void;
    /** @internal */
    _execute(): void;
    /** @internal */
    _initialize(): void;
    /** @internal */
    _isValid(): Nullable<string>;
    /** @internal */
    _dispose(): void;
}
