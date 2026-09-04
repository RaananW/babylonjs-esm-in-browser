/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialSystemValues } from "../../Enums/nodeMaterialSystemValues.js";
import { type Nullable } from "../../../../types.js";
import { type Effect } from "../../../../Materials/effect.pure.js";
import { Matrix } from "../../../../Maths/math.vector.pure.js";
import { type Scene } from "../../../../scene.pure.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { AnimatedInputBlockTypes } from "./animatedInputBlockTypes.js";
import { Observable } from "../../../../Misc/observable.pure.js";
import { type NodeMaterial } from "../../nodeMaterial.pure.js";
/**
 * Block used to expose an input value
 */
export declare class InputBlock extends NodeMaterialBlock {
    private _mode;
    private _associatedVariableName;
    private _storedValue;
    private _valueCallback;
    private _type;
    private _animationType;
    private _prefix;
    /** Gets or set a value used to limit the range of float values */
    min: number;
    /** Gets or set a value used to limit the range of float values */
    max: number;
    /** Gets or set a value indicating that this input can only get 0 and 1 values */
    isBoolean: boolean;
    /** Gets or sets a value used by the Node Material editor to determine how to configure the current value if it is a matrix */
    matrixMode: number;
    /** @internal */
    _systemValue: Nullable<NodeMaterialSystemValues>;
    /** Gets or sets a boolean indicating that the value of this input will not change after a build */
    isConstant: boolean;
    /** Gets or sets the group to use to display this block in the Inspector */
    groupInInspector: string;
    /** Gets an observable raised when the value is changed */
    onValueChangedObservable: Observable<InputBlock>;
    /** Gets or sets a boolean indicating if content needs to be converted to gamma space (for color3/4 only) */
    convertToGammaSpace: boolean;
    /** Gets or sets a boolean indicating if content needs to be converted to linear space (for color3/4 only) */
    convertToLinearSpace: boolean;
    /**
     * Gets or sets the connection point type (default is float)
     */
    get type(): NodeMaterialBlockConnectionPointTypes;
    /**
     * Creates a new InputBlock
     * @param name defines the block name
     * @param target defines the target of that block (Vertex by default)
     * @param type defines the type of the input (can be set to NodeMaterialBlockConnectionPointTypes.AutoDetect)
     */
    constructor(name: string, target?: NodeMaterialBlockTargets, type?: NodeMaterialBlockConnectionPointTypes);
    /**
     * Validates if a name is a reserve word.
     * @param newName the new name to be given to the node.
     * @returns false if the name is a reserve word, else true.
     */
    validateBlockName(newName: string): boolean;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    /**
     * Set the source of this connection point to a vertex attribute
     * @param attributeName defines the attribute name (position, uv, normal, etc...). If not specified it will take the connection point name
     * @returns the current connection point
     */
    setAsAttribute(attributeName?: string): InputBlock;
    /**
     * Set the source of this connection point to a system value
     * @param value define the system value to use (world, view, etc...) or null to switch to manual value
     * @returns the current connection point
     */
    setAsSystemValue(value: Nullable<NodeMaterialSystemValues>): InputBlock;
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
     * Gets the declaration variable name in the shader
     */
    get declarationVariableName(): string;
    /**
     * Gets or sets the associated variable name in the shader
     */
    get associatedVariableName(): string;
    set associatedVariableName(value: string);
    /** Gets or sets the type of animation applied to the input */
    get animationType(): AnimatedInputBlockTypes;
    set animationType(value: AnimatedInputBlockTypes);
    /**
     * Gets a boolean indicating that this connection point not defined yet
     */
    get isUndefined(): boolean;
    /**
     * Gets or sets a boolean indicating that this connection point is coming from an uniform.
     * In this case the connection point name must be the name of the uniform to use.
     * Can only be set on inputs
     */
    get isUniform(): boolean;
    set isUniform(value: boolean);
    /**
     * Gets or sets a boolean indicating that this connection point is coming from an attribute.
     * In this case the connection point name must be the name of the attribute to use
     * Can only be set on inputs
     */
    get isAttribute(): boolean;
    set isAttribute(value: boolean);
    /**
     * Gets or sets a boolean indicating that this connection point is generating a varying variable.
     * Can only be set on exit points
     */
    get isVarying(): boolean;
    set isVarying(value: boolean);
    /**
     * Gets a boolean indicating that the current connection point is a system value
     */
    get isSystemValue(): boolean;
    /**
     * Gets or sets the current well known value or null if not defined as a system value
     */
    get systemValue(): Nullable<NodeMaterialSystemValues>;
    set systemValue(value: Nullable<NodeMaterialSystemValues>);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Animate the input if animationType !== None
     * @param scene defines the rendering scene
     */
    animate(scene: Scene): void;
    private _emitDefine;
    /**
     * Initialize the block
     */
    initialize(): void;
    /**
     * Set the input block to its default value (based on its type)
     */
    setDefaultValue(): void;
    private _emitConstant;
    /** @internal */
    get _noContextSwitch(): boolean;
    private _emit;
    /**
     * @internal
     */
    _transmitWorld(effect: Effect, world: Matrix, worldView: Matrix, worldViewProjection: Matrix): void;
    /**
     * @internal
     */
    _transmit(effect: Effect, scene: Scene, material: NodeMaterial): void;
    protected _buildBlock(state: NodeMaterialBuildState): void;
    protected _dumpPropertiesCode(): string;
    /**
     * Releases the resources held by the block
     */
    dispose(): void;
    /**
     * Serializes the block
     * @returns the serialized object
     */
    serialize(): any;
    /**
     * Deserializes the block
     * @param serializationObject - defines the serialized object
     * @param scene - defines the scene
     * @param rootUrl - defines the root URL
     */
    _deserialize(serializationObject: any, scene: Scene, rootUrl: string): void;
}
/**
 * Register side effects for materialsNodeBlocksInputInputBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterMaterialsNodeBlocksInputInputBlock(): void;
