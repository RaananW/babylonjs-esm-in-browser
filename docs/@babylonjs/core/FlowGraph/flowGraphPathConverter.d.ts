import { type FlowGraphContext } from "./flowGraphContext.js";
import { type IPathToObjectConverter, type IObjectInfo } from "../ObjectModel/objectModelInterfaces.js";
import { type IObjectAccessor } from "./typeDefinitions.js";
/**
 * @deprecated Avoid using this on the flow-graph (glTF only)
 * A path converter that converts a path on the flow graph context variables to an object accessor.
 */
export declare class FlowGraphPathConverter implements IPathToObjectConverter<IObjectAccessor> {
    private _context;
    private _separator;
    constructor(_context: FlowGraphContext, _separator?: string);
    convert(path: string): IObjectInfo<IObjectAccessor>;
}
