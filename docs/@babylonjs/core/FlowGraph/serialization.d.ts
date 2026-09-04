import { type IAssetContainer } from "../IAssetContainer.js";
import { type Scene } from "../scene.js";
import { FlowGraphBlockNames } from "./Blocks/flowGraphBlockNames.js";
import { type Node } from "../node.js";
/**
 * Resolves a serialized node reference (`{ id, name, className, uniqueId }`) to an actual scene node.
 * Matching prefers `id` (falling back to `name`), then narrows by class name, then by `uniqueId`.
 * Because `uniqueId` is reassigned every time a scene is built, it is only used as a tie-breaker so
 * that references still resolve after a scene is reloaded (e.g. an editor preview).
 * @param serializedReference the serialized reference to resolve
 * @param scene the scene to resolve the reference against
 * @returns the matching node, or undefined when none is found
 */
export declare function GetSceneNodeFromSerializedReference(serializedReference: any, scene: Scene): Node | undefined;
/**
 * The default function that serializes values in a context object to a serialization object
 * @param key the key where the value should be stored in the serialization object
 * @param value the value to store
 * @param serializationObject the object where the value will be stored
 */
export declare function defaultValueSerializationFunction(key: string, value: any, serializationObject: any): void;
/**
 * The default function that parses values stored in a serialization object
 * @param key the key to the value that will be parsed
 * @param serializationObject the object that will be parsed
 * @param assetsContainer the assets container that will be used to find the objects
 * @param scene
 * @returns
 */
export declare function defaultValueParseFunction(key: string, serializationObject: any, assetsContainer: IAssetContainer, scene: Scene): any;
/**
 * Given a name of a flow graph block class, return if this
 * class needs to be created with a path converter. Used in
 * parsing.
 * @param className the name of the flow graph block class
 * @returns a boolean indicating if the class needs a path converter
 */
export declare function needsPathConverter(className: string): className is FlowGraphBlockNames.JsonPointerParser;
