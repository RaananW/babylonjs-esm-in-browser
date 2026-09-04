/** This file must only contain pure code and pure imports */
/**
 * Physical input source that generated an interaction.
 */
export type InputSource = "pointer" | "wheel" | "touch" | "keyboard";
/**
 * Modifier key state, shared across input sources that support modifiers.
 */
export type InputModifiers = {
    /** Ctrl key pressed */
    ctrl?: boolean;
    /** Shift key pressed */
    shift?: boolean;
    /** Alt key pressed */
    alt?: boolean;
};
/**
 * Conditions for pointer inputs.
 */
export type PointerConditions = {
    /** Mouse button (0=left, 1=middle, 2=right). Omit to match any button. */
    button?: number;
    /** Modifier key state. Only specified keys are checked; omitted = don't-care. */
    modifiers?: InputModifiers;
};
/**
 * Conditions for mouse wheel inputs.
 */
export type WheelConditions = {
    /** Modifier key state. Only specified keys are checked; omitted = don't-care. */
    modifiers?: InputModifiers;
};
/**
 * Conditions for touch inputs.
 */
export type TouchConditions = {
    /** Number of active touch points. Omit to match any count. */
    touchCount?: number;
};
/**
 * Conditions for keyboard inputs.
 */
export type KeyboardConditions = {
    /** Key code of the current key being resolved. Omit to match any key. */
    key?: number;
    /** Modifier key state. Only specified keys are checked; omitted = don't-care. */
    modifiers?: InputModifiers;
};
/**
 * Mapping rule for pointer (mouse button) inputs.
 */
export type PointerInputMapEntry<TInteraction extends string = string> = {
    source: "pointer";
    interaction: TInteraction;
    /** Multiplier applied to input deltas before passing to the handler. Default is 1. */
    sensitivity?: number;
    /** Optional per-axis override for the X (horizontal / yaw) component. Falls back to `sensitivity` if unset. */
    sensitivityX?: number;
    /** Optional per-axis override for the Y (vertical / pitch) component. Falls back to `sensitivity` if unset. */
    sensitivityY?: number;
} & PointerConditions;
/**
 * Mapping rule for mouse wheel inputs.
 */
export type WheelInputMapEntry<TInteraction extends string = string> = {
    source: "wheel";
    interaction: TInteraction;
    /** Multiplier applied to input deltas before passing to the handler. Default is 1. */
    sensitivity?: number;
} & WheelConditions;
/**
 * Mapping rule for touch inputs.
 */
export type TouchInputMapEntry<TInteraction extends string = string> = {
    source: "touch";
    interaction: TInteraction;
    /** Multiplier applied to input deltas before passing to the handler. Default is 1. */
    sensitivity?: number;
    /** Optional per-axis override for the X component. Falls back to `sensitivity` if unset. */
    sensitivityX?: number;
    /** Optional per-axis override for the Y component. Falls back to `sensitivity` if unset. */
    sensitivityY?: number;
} & TouchConditions;
/**
 * Mapping rule for keyboard inputs.
 * The `key` field on the entry supports a single key code or an array of key codes for matching.
 * When resolving, the condition's `key` is checked against the entry's `key` value(s).
 */
export type KeyboardInputMapEntry<TInteraction extends string = string> = {
    /** Discriminator: keyboard input source */
    source: "keyboard";
    /** Interaction type to dispatch when this entry matches */
    interaction: TInteraction;
    /** Multiplier applied to input deltas before passing to the handler. Default is 1. */
    sensitivity?: number;
    /** Key code filter(s). Supports a single code or an array. Omit to match any key. */
    key?: number | number[];
    /** Modifier keys that must be active for this entry to match. Omit to match regardless of modifiers. */
    modifiers?: InputModifiers;
};
/**
 * A single mapping rule: source + optional conditions → interaction type.
 * The inputMap is an ordered array on the movement class; first matching entry wins.
 * The interaction string should match a handler property name on the camera's movement subclass.
 *
 * Discriminated union by `source` — only fields relevant to that source are available.
 */
export type InputMapEntry<TInteraction extends string = string> = PointerInputMapEntry<TInteraction> | WheelInputMapEntry<TInteraction> | TouchInputMapEntry<TInteraction> | KeyboardInputMapEntry<TInteraction>;
/**
 * Flat conditions object passed to resolveInteraction().
 * Only the fields relevant to the source type need to be set.
 * Per-source condition types (PointerConditions, KeyboardConditions, etc.) are subtypes
 * of this and should be used at call sites for clarity.
 */
export type InputConditions = {
    /** Mouse button (0=left, 1=middle, 2=right) */
    button?: number;
    /** Current modifier key state */
    modifiers?: InputModifiers;
    /** Number of active touch points */
    touchCount?: number;
    /** Key code of the current key being resolved */
    key?: number;
};
/**
 * Extracts the string-typed interaction names from a handlers object type.
 * Equivalent to `keyof THandlers & string` — filters out symbol/number keys.
 */
export type InteractionName<THandlers> = keyof THandlers & string;
/**
 * Generic input-to-interaction mapper that resolves physical input events to semantic interaction types
 * and dispatches them to typed handlers.
 *
 * `InputMapper` is not tied to cameras — any object that needs a configurable, prioritized
 * mapping from physical inputs (pointer, keyboard, wheel, touch) to named interactions can use it.
 *
 * The mapper holds an ordered `inputMap` array. When `resolveInteraction` is called, the first
 * entry whose source and conditions match the current input wins. More specific entries (with more
 * conditions like button, key, modifiers) should be placed before less specific ones; use `addEntry`
 * to auto-insert based on specificity.
 *
 * @typeParam THandlers - Object type whose keys are the valid interaction type strings and values
 *   are the handler functions/objects for each interaction (e.g. `ArcRotateHandlers`).
 *   Interaction types are derived as `InteractionName<THandlers>`.
 */
export declare class InputMapper<THandlers extends Record<string, unknown>> {
    /**
     * Ordered list of input-to-interaction mapping rules. First matching entry wins.
     */
    inputMap: InputMapEntry<InteractionName<THandlers>>[];
    /**
     * Interaction handlers keyed by interaction type.
     * Override individual handlers to customize behavior without changing input mapping.
     */
    readonly handlers: THandlers;
    /**
     * Creates a new InputMapper.
     * @param handlers - The interaction handlers, keyed by interaction type.
     * @param createDefaultEntries - Optional factory that returns the default inputMap entries.
     *   Called by `resetInputMap()` and during construction. When omitted, the default map is empty.
     */
    constructor(handlers: THandlers, createDefaultEntries?: () => InputMapEntry<InteractionName<THandlers>>[]);
    private _createDefaultEntries?;
    /**
     * Resolves a physical input event to a matching inputMap entry.
     * Iterates the inputMap in order; the first entry whose source and conditions match wins.
     * @param source - The physical input source (e.g. "pointer", "keyboard")
     * @param currentConditions - Conditions to match against, specific to the source type
     * @returns The matched InputMapEntry, or null if no entry matches
     */
    resolveInteraction(source: "pointer", currentConditions?: InputConditions): PointerInputMapEntry<InteractionName<THandlers>> | null;
    resolveInteraction(source: "wheel", currentConditions?: InputConditions): WheelInputMapEntry<InteractionName<THandlers>> | null;
    resolveInteraction(source: "touch", currentConditions?: InputConditions): TouchInputMapEntry<InteractionName<THandlers>> | null;
    resolveInteraction(source: "keyboard", currentConditions?: InputConditions): KeyboardInputMapEntry<InteractionName<THandlers>> | null;
    resolveInteraction(source: InputSource, currentConditions?: InputConditions): InputMapEntry<InteractionName<THandlers>> | null;
    /**
     * Restores the inputMap to the default entries provided at construction time.
     * If no factory was provided, resets to an empty array.
     */
    resetInputMap(): void;
    /**
     * Finds the first inputMap entry matching the given source, interaction, and optional entry conditions.
     * Useful for modifying entry properties (e.g. sensitivity) without rebuilding the entire inputMap.
     * @param source - The physical input source to match
     * @param interaction - The interaction type to match
     * @param conditions - Optional entry conditions to match. Omitted condition fields are ignored.
     * @returns The matching entry, or undefined if not found
     */
    getEntry(source: "pointer", interaction: InteractionName<THandlers>, conditions?: PointerConditions): PointerInputMapEntry<InteractionName<THandlers>> | undefined;
    getEntry(source: "wheel", interaction: InteractionName<THandlers>, conditions?: WheelConditions): WheelInputMapEntry<InteractionName<THandlers>> | undefined;
    getEntry(source: "touch", interaction: InteractionName<THandlers>, conditions?: TouchConditions): TouchInputMapEntry<InteractionName<THandlers>> | undefined;
    getEntry(source: "keyboard", interaction: InteractionName<THandlers>, conditions?: KeyboardConditions): KeyboardInputMapEntry<InteractionName<THandlers>> | undefined;
    getEntry(source: InputSource, interaction: InteractionName<THandlers>, conditions?: InputConditions): InputMapEntry<InteractionName<THandlers>> | undefined;
    /**
     * Finds all inputMap entries matching the given source, interaction, and optional entry conditions.
     * Useful for bulk updates when more than one physical input maps to the same interaction.
     * @param source - The physical input source to match
     * @param interaction - The interaction type to match
     * @param conditions - Optional entry conditions to match. Omitted condition fields are ignored.
     * @returns All matching entries, in inputMap order
     */
    getEntries(source: "pointer", interaction: InteractionName<THandlers>, conditions?: PointerConditions): PointerInputMapEntry<InteractionName<THandlers>>[];
    getEntries(source: "wheel", interaction: InteractionName<THandlers>, conditions?: WheelConditions): WheelInputMapEntry<InteractionName<THandlers>>[];
    getEntries(source: "touch", interaction: InteractionName<THandlers>, conditions?: TouchConditions): TouchInputMapEntry<InteractionName<THandlers>>[];
    getEntries(source: "keyboard", interaction: InteractionName<THandlers>, conditions?: KeyboardConditions): KeyboardInputMapEntry<InteractionName<THandlers>>[];
    getEntries(source: InputSource, interaction: InteractionName<THandlers>, conditions?: InputConditions): InputMapEntry<InteractionName<THandlers>>[];
    /**
     * Adds an entry to the inputMap at the correct position based on specificity.
     * More specific entries (with more conditions like button, key, modifiers) are placed
     * before less specific ones, ensuring they match first. Among equally specific entries,
     * the new entry is placed after existing ones.
     * @param entry - The entry to add
     */
    addEntry(entry: InputMapEntry<InteractionName<THandlers>>): void;
    /**
     * Sets the interaction for the input combination described by `conditions`. If an
     * existing entry maps that exact combination, its `interaction` is updated in place;
     * otherwise a new entry is inserted via {@link addEntry}.
     *
     * To force an update on every matching entry use {@link setInteractions}; to address
     * an individual entry beyond the first, look it up via {@link getEntries} and assign
     * `entry.interaction` directly.
     * @param source - The physical input source to match
     * @param conditions - Conditions describing the input combination (button, modifiers, key, etc.)
     * @param interaction - The interaction to assign / insert
     * @returns true (the mapping is always made effective)
     */
    setInteraction(source: InputSource, conditions: InputConditions | undefined, interaction: InteractionName<THandlers>): boolean;
    /**
     * Returns true when `entry` constrains every field that `conditions` specifies — i.e.
     * `entry` covers all of the request's conditions. Used by {@link setInteraction} as one
     * half of the "exactly as specific" check: combined with {@link resolveInteraction}'s
     * guarantee that the returned entry is no *stricter* than the request, a true result
     * here means `entry` and `conditions` constrain the same fields, and mutating
     * `entry.interaction` is safe.
     *
     * On its own this predicate does not exclude entries that are stricter than `conditions`
     * (those would also trivially cover every field present in `conditions`); callers must
     * rely on the upstream resolve step to rule them out.
     *
     * `InputConditions` is a flat type covering all source-specific fields (`button`, `key`,
     * `touchCount`, `modifiers`); for any given source the irrelevant fields are `undefined`
     * on both `entry` and `conditions`, so checking them all is harmless.
     * @param entry - The matched inputMap entry to test
     * @param conditions - The conditions the caller supplied to `setInteraction`
     * @returns true if `entry` covers every condition present in `conditions`
     */
    private _entryCoversAllConditionsOf;
    /**
     * Changes the interaction for every inputMap entry matching the given source and conditions.
     * Useful when more than one entry maps to the same physical input (e.g. duplicate bindings,
     * or several keys aliased to the same action) and all of them should be remapped together.
     * @param source - The physical input source to match
     * @param conditions - Conditions to match (button, modifiers, key, etc.). Uses the same
     *                     event-resolution semantics as {@link resolveInteraction}: omitted entry
     *                     condition fields are treated as wildcards and will match.
     * @param interaction - The new interaction to assign to every matched entry
     * @returns The number of entries that were updated
     */
    setInteractions(source: InputSource, conditions: InputConditions | undefined, interaction: InteractionName<THandlers>): number;
    private _entryMatches;
    private _entryConditionsMatch;
    private _entrySpecificity;
    private _matchModifiers;
    private _entryModifiersMatch;
}
