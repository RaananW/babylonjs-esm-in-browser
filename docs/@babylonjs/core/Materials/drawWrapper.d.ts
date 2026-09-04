import { type IDrawContext } from "../Engines/IDrawContext.js";
import { type IMaterialContext } from "../Engines/IMaterialContext.js";
import { type Nullable } from "../types.js";
import { type AbstractEngine } from "../Engines/abstractEngine.js";
import { type Effect } from "./effect.js";
import { type MaterialDefines } from "./materialDefines.js";
/**
 * Wrapper for an effect and its associated material context and draw context.
 * This class is meant to encapsulate the effect and its related contexts, allowing for easier management of rendering states.
 */
export declare class DrawWrapper {
    /**
     * The effect associated with this wrapper.
     */
    effect: Nullable<Effect>;
    /**
     * The defines associated with this wrapper.
     */
    defines: Nullable<string | MaterialDefines>;
    /**
     * The material context associated with this wrapper.
     */
    materialContext?: IMaterialContext;
    /**
     * The draw context associated with this wrapper.
     */
    drawContext?: IDrawContext;
    /**
     * @internal
     * Specifies if the effect was previously ready
     */
    _wasPreviouslyReady: boolean;
    /**
     * @internal
     * Forces the code from bindForSubMesh to be fully run the next time it is called
     */
    _forceRebindOnNextCall: boolean;
    /**
     * @internal
     * Specifies if the effect was previously using instances
     */
    _wasPreviouslyUsingInstances: Nullable<boolean>;
    /**
     * Retrieves the effect from a DrawWrapper or Effect instance.
     * @param effect The effect or DrawWrapper instance to retrieve the effect from.
     * @returns The effect associated with the given instance, or null if not found.
     */
    static GetEffect(effect: Effect | DrawWrapper): Nullable<Effect>;
    /**
     * Creates a new DrawWrapper instance.
     * Note that drawContext is always created (but may end up being undefined if the engine doesn't need draw contexts), but materialContext is optional.
     * @param engine The engine to create the draw wrapper for.
     * @param createMaterialContext If true, creates a material context for this wrapper (default is true).
     */
    constructor(engine: AbstractEngine, createMaterialContext?: boolean);
    /**
     * Sets the effect and its associated defines for this wrapper.
     * @param effect The effect to associate with this wrapper.
     * @param defines The defines to associate with this wrapper.
     * @param resetContext If true, resets the draw context (default is true).
     */
    setEffect(effect: Nullable<Effect>, defines?: Nullable<string | MaterialDefines>, resetContext?: boolean): void;
    /**
     * Disposes the effect wrapper and its resources
     * @param immediate if the effect should be disposed immediately or on the next frame.
     * If dispose() is not called during a scene or engine dispose, we want to delay the dispose of the underlying effect. Mostly to give a chance to user code to reuse the effect in some way.
     */
    dispose(immediate?: boolean): void;
}
