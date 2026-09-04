import { type Nullable, type AbstractEngine, type IFrameGraphPass, type FrameGraphContext, type FrameGraphObjectList, type FrameGraphTask } from "../../index.js";
import { FrameGraphPass } from "./pass.js";
/**
 * Object list pass used to generate a list of objects.
 */
export declare class FrameGraphObjectListPass extends FrameGraphPass<FrameGraphContext> {
    protected readonly _engine: AbstractEngine;
    protected _objectList: FrameGraphObjectList;
    /**
     * Checks if a pass is an object list pass.
     * @param pass The pass to check.
     * @returns True if the pass is an object list pass, else false.
     */
    static IsObjectListPass(pass: IFrameGraphPass): pass is FrameGraphObjectListPass;
    /**
     * Gets the object list used by the pass.
     */
    get objectList(): FrameGraphObjectList;
    /**
     * Sets the object list to use for the pass.
     * @param objectList The object list to use for the pass.
     */
    setObjectList(objectList: FrameGraphObjectList): void;
    /** @internal */
    constructor(name: string, parentTask: FrameGraphTask, context: FrameGraphContext, engine: AbstractEngine);
    /** @internal */
    _isValid(): Nullable<string>;
}
