/** This file must only contain pure code and pure imports */
import { Observable } from "../../../Misc/observable.pure.js";
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { type NodeGeometryConnectionPoint } from "../nodeGeometryBlockConnectionPoint.js";
import { type NodeGeometryBuildState } from "../nodeGeometryBuildState.js";
/**
 * Block used to trigger an observable when traversed
 * It can also be used to execute a function when traversed
 */
export declare class GeometryInterceptorBlock extends NodeGeometryBlock {
    /**
     * Observable triggered when the block is traversed
     */
    onInterceptionObservable: Observable<any>;
    /**
     * Custom function to execute when traversed
     */
    customFunction?: (value: any, state: NodeGeometryBuildState) => any;
    /**
     * Creates a new GeometryInterceptorBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the time spent to build this block (in ms)
     */
    get buildExecutionTime(): number;
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the input component
     */
    get input(): NodeGeometryConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeGeometryConnectionPoint;
    protected _buildBlock(state: NodeGeometryBuildState): void;
}
/**
 * Register side effects for geometryInterceptorBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGeometryInterceptorBlock(): void;
