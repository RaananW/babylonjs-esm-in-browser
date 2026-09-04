/** This file must only contain pure code and pure imports */
import { Observable } from "../../../Misc/observable.pure.js";
import { NodeGeometryBlockConnectionPointTypes } from "../Enums/nodeGeometryConnectionPointTypes.js";
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../nodeGeometryBlockConnectionPoint.js";
import { type NodeGeometryBuildState } from "../nodeGeometryBuildState.js";
import { NodeGeometryContextualSources } from "../Enums/nodeGeometryContextualSources.js";
/**
 * Block used to expose an input value
 */
export declare class GeometryInputBlock extends NodeGeometryBlock {
    private _storedValue;
    private _valueCallback;
    private _type;
    private _contextualSource;
    /** Gets or set a value used to limit the range of float values */
    min: number;
    /** Gets or set a value used to limit the range of float values */
    max: number;
    /** Gets or sets the group to use to display this block in the Inspector */
    groupInInspector: string;
    /**
     * Gets or sets a boolean indicating that this input is displayed in the Inspector
     */
    displayInInspector: boolean;
    /** Gets an observable raised when the value is changed */
    onValueChangedObservable: Observable<GeometryInputBlock>;
    /**
     * Gets or sets the connection point type (default is float)
     */
    get type(): NodeGeometryBlockConnectionPointTypes;
    /**
     * Gets a boolean indicating that the current connection point is a contextual value
     */
    get isContextual(): boolean;
    /**
     * Gets or sets the current contextual value
     */
    get contextualValue(): NodeGeometryContextualSources;
    set contextualValue(value: NodeGeometryContextualSources);
    /**
     * Creates a new InputBlock
     * @param name defines the block name
     * @param type defines the type of the input (can be set to NodeGeometryBlockConnectionPointTypes.AutoDetect)
     */
    constructor(name: string, type?: NodeGeometryBlockConnectionPointTypes);
    /**
     * Gets or sets the value of that point.
     * Please note that this value will be ignored if valueCallback is defined
     */
    get value(): any;
    set value(value: any);
    /**
     * Gets or sets a callback used to get the value of that point.
     * Please note that setting this value will force the connection point to ignore the value property
     */
    get valueCallback(): () => any;
    set valueCallback(value: () => any);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the geometry output component
     */
    get output(): NodeGeometryConnectionPoint;
    /**
     * Set the input block to its default value (based on its type)
     */
    setDefaultValue(): void;
    protected _buildBlock(state: NodeGeometryBuildState): void;
    /** @internal */
    dispose(): void;
    protected _dumpPropertiesCode(): string;
    /** @internal */
    serialize(): any;
    /** @internal */
    _deserialize(serializationObject: any): void;
}
/**
 * Register side effects for geometryInputBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGeometryInputBlock(): void;
