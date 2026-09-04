import { FrameGraphPass } from "./pass.js";
/**
 * Object list pass used to generate a list of objects.
 */
export class FrameGraphObjectListPass extends FrameGraphPass {
    /**
     * Checks if a pass is an object list pass.
     * @param pass The pass to check.
     * @returns True if the pass is an object list pass, else false.
     */
    static IsObjectListPass(pass) {
        return pass.setObjectList !== undefined;
    }
    /**
     * Gets the object list used by the pass.
     */
    get objectList() {
        return this._objectList;
    }
    /**
     * Sets the object list to use for the pass.
     * @param objectList The object list to use for the pass.
     */
    setObjectList(objectList) {
        this._objectList = objectList;
    }
    /** @internal */
    constructor(name, parentTask, context, engine) {
        super(name, parentTask, context);
        this._engine = engine;
    }
    /** @internal */
    _isValid() {
        const errMsg = super._isValid();
        return errMsg ? errMsg : this._objectList !== undefined ? null : "Object list is not set (call setObjectList to set it)";
    }
}
//# sourceMappingURL=objectListPass.js.map