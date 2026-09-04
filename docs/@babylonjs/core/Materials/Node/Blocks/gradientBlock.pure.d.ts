/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
import { Color3 } from "../../../Maths/math.color.pure.js";
import { type Scene } from "../../../scene.pure.js";
import { Observable } from "../../../Misc/observable.pure.js";
/**
 * Class used to store a color step for the GradientBlock
 */
export declare class GradientBlockColorStep {
    private _step;
    /**
     * Gets value indicating which step this color is associated with (between 0 and 1)
     */
    get step(): number;
    /**
     * Sets a value indicating which step this color is associated with (between 0 and 1)
     */
    set step(val: number);
    private _color;
    /**
     * Gets the color associated with this step
     */
    get color(): Color3;
    /**
     * Sets the color associated with this step
     */
    set color(val: Color3);
    /**
     * Creates a new GradientBlockColorStep
     * @param step defines a value indicating which step this color is associated with (between 0 and 1)
     * @param color defines the color associated with this step
     */
    constructor(step: number, color: Color3);
}
/**
 * Block used to return a color from a gradient based on an input value between 0 and 1
 */
export declare class GradientBlock extends NodeMaterialBlock {
    /**
     * Gets or sets the list of color steps
     */
    colorSteps: GradientBlockColorStep[];
    /** Gets an observable raised when the value is changed */
    onValueChangedObservable: Observable<GradientBlock>;
    /** calls observable when the value is changed*/
    colorStepsUpdated(): void;
    /**
     * Creates a new GradientBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the gradient input component
     */
    get gradient(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    private _writeColorConstant;
    protected _buildBlock(state: NodeMaterialBuildState): this | undefined;
    /**
     * Serializes the block
     * @returns the serialized object
     */
    serialize(): any;
    /**
     * Deserializes the block
     * @param serializationObject - the serialization object
     * @param scene - the scene
     * @param rootUrl - the root URL
     */
    _deserialize(serializationObject: any, scene: Scene, rootUrl: string): void;
    protected _dumpPropertiesCode(): string;
}
/**
 * Register side effects for gradientBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGradientBlock(): void;
