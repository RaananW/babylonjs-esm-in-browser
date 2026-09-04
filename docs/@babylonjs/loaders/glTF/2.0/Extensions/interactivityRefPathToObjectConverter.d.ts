import { type IObjectInfo, type IPathToObjectConverter } from "@babylonjs/core/ObjectModel/objectModelInterfaces.js";
import { type IObjectAccessor } from "@babylonjs/core/FlowGraph/typeDefinitions.js";
/**
 * Path-to-object converter that resolves the KHR_interactivity ref-validity
 * pointers `pointer/get` can query (KHR_interactivity spec §4.2.3 Event
 * References and §4.2.4 Delay References):
 *
 *  - `/extensions/KHR_interactivity/events/{}` — valid when the input reference
 *    was produced by an event operation (an event reference). Stateless: any
 *    event-reference path that reaches this converter is valid; a null ref is
 *    rejected earlier by the path-template substitution.
 *  - `/extensions/KHR_interactivity/delays/{}` — valid only while the referenced
 *    delay index is in the runtime active-delay set (i.e. the delay is scheduled
 *    and has not yet fired or been cancelled). This requires the runtime
 *    {@link FlowGraphContext}, which is supplied to the accessor `get` as its
 *    payload argument by `FlowGraphJsonPointerParserBlock`.
 *
 * On success `get` returns the input reference value (matching the spec, which
 * sets the `value` output to the input reference); on failure it returns
 * `undefined`, which the `pointer/get` block surfaces as `isValid = false`.
 */
export declare class InteractivityRefPathToObjectConverter implements IPathToObjectConverter<IObjectAccessor> {
    /**
     * @param path the (template-substituted) JSON Pointer to resolve
     * @returns an object accessor whose `get` validates the reference
     */
    convert(path: string): IObjectInfo<IObjectAccessor>;
}
