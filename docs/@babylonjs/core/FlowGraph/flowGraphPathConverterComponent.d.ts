import { type IObjectInfo, type IPathToObjectConverter } from "../ObjectModel/objectModelInterfaces.js";
import { type FlowGraphBlock } from "./flowGraphBlock.js";
import { type FlowGraphContext } from "./flowGraphContext.js";
import { type FlowGraphDataConnection } from "./flowGraphDataConnection.js";
import { type IObjectAccessor } from "./typeDefinitions.js";
interface IPathTemplateInfo {
    /** Template variable name (without surrounding brackets). */
    name: string;
    /** Bracket style used in the source path; preserved so we replace the right placeholder. */
    style: "curly" | "square";
    /** The connection that supplies the runtime value for substitution. */
    connection: FlowGraphDataConnection<any>;
}
/**
 * @experimental
 * A component that converts a path to an object accessor.
 */
export declare class FlowGraphPathConverterComponent {
    path: string;
    ownerBlock: FlowGraphBlock;
    /**
     * The templated inputs for the provided path. Values may be FlowGraphInteger, number, or
     * string (an opaque reference encoded as a JSON Pointer).
     */
    readonly templatedInputs: FlowGraphDataConnection<any>[];
    /** Per-template metadata (name + bracket style + input connection). */
    readonly templateInfos: IPathTemplateInfo[];
    constructor(path: string, ownerBlock: FlowGraphBlock);
    /**
     * Get the accessor for the path.
     * @param pathConverter the path converter to use to convert the path to an object accessor.
     * @param context the context to use.
     * @returns the accessor for the path.
     * @throws if the value for a templated input is invalid.
     */
    getAccessor(pathConverter: IPathToObjectConverter<IObjectAccessor>, context: FlowGraphContext): IObjectInfo<IObjectAccessor>;
}
export {};
