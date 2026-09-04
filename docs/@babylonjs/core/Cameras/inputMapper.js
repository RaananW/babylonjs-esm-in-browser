/** This file must only contain pure code and pure imports */
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
// eslint-disable-next-line @typescript-eslint/naming-convention
export class InputMapper {
    /**
     * Creates a new InputMapper.
     * @param handlers - The interaction handlers, keyed by interaction type.
     * @param createDefaultEntries - Optional factory that returns the default inputMap entries.
     *   Called by `resetInputMap()` and during construction. When omitted, the default map is empty.
     */
    constructor(handlers, createDefaultEntries) {
        /**
         * Ordered list of input-to-interaction mapping rules. First matching entry wins.
         */
        this.inputMap = [];
        this.handlers = handlers;
        this._createDefaultEntries = createDefaultEntries;
        this.resetInputMap();
    }
    resolveInteraction(source, currentConditions) {
        for (const entry of this.inputMap) {
            if (entry.source === source && this._entryMatches(entry, currentConditions)) {
                return entry;
            }
        }
        return null;
    }
    /**
     * Restores the inputMap to the default entries provided at construction time.
     * If no factory was provided, resets to an empty array.
     */
    resetInputMap() {
        this.inputMap = this._createDefaultEntries?.() ?? [];
    }
    getEntry(source, interaction, conditions) {
        // Manual loop instead of `inputMap.find(arrow)` to avoid per-call closure allocation;
        // this is hit per pointer-move from multi-touch panning paths.
        const arr = this.inputMap;
        for (let i = 0; i < arr.length; i++) {
            const e = arr[i];
            if (e.source === source && e.interaction === interaction && this._entryConditionsMatch(e, conditions)) {
                return e;
            }
        }
        return undefined;
    }
    getEntries(source, interaction, conditions) {
        const matches = [];
        const arr = this.inputMap;
        for (let i = 0; i < arr.length; i++) {
            const e = arr[i];
            if (e.source === source && e.interaction === interaction && this._entryConditionsMatch(e, conditions)) {
                matches.push(e);
            }
        }
        return matches;
    }
    /**
     * Adds an entry to the inputMap at the correct position based on specificity.
     * More specific entries (with more conditions like button, key, modifiers) are placed
     * before less specific ones, ensuring they match first. Among equally specific entries,
     * the new entry is placed after existing ones.
     * @param entry - The entry to add
     */
    addEntry(entry) {
        const score = this._entrySpecificity(entry);
        let insertIndex = this.inputMap.length;
        for (let i = 0; i < this.inputMap.length; i++) {
            if (this._entrySpecificity(this.inputMap[i]) < score) {
                insertIndex = i;
                break;
            }
        }
        this.inputMap.splice(insertIndex, 0, entry);
    }
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
    setInteraction(source, conditions, interaction) {
        // resolveInteraction returns the first entry that fires for `conditions` (so its
        // conditions are no stricter than the request). If that entry also covers every
        // condition present in the request, it's an exact match — mutate. Otherwise it's
        // broader (or nothing matches): add a more-specific entry so we don't clobber the
        // broader one.
        const entry = this.resolveInteraction(source, conditions);
        if (entry && this._entryCoversAllConditionsOf(entry, conditions)) {
            entry.interaction = interaction;
            return true;
        }
        this.addEntry({ source, ...(conditions ?? {}), interaction });
        return true;
    }
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
    _entryCoversAllConditionsOf(entry, conditions) {
        if (!conditions) {
            return true;
        }
        // `as any` here because `entry` is a discriminated union and TypeScript can't narrow it
        // from a string-keyed loop. The runtime check is harmless: irrelevant-for-this-source
        // fields are undefined on both entry and conditions and skip the early return.
        const e = entry;
        for (const key of Object.keys(conditions)) {
            const condValue = conditions[key];
            if (condValue === undefined) {
                continue;
            }
            if (key === "modifiers") {
                const entryMods = (e.modifiers ?? {});
                for (const modKey of Object.keys(condValue)) {
                    if (condValue[modKey] !== undefined && entryMods[modKey] === undefined) {
                        return false;
                    }
                }
            }
            else if (e[key] === undefined) {
                return false;
            }
        }
        return true;
    }
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
    setInteractions(source, conditions, interaction) {
        let count = 0;
        const arr = this.inputMap;
        for (let i = 0; i < arr.length; i++) {
            const entry = arr[i];
            if (entry.source === source && this._entryMatches(entry, conditions)) {
                entry.interaction = interaction;
                count++;
            }
        }
        return count;
    }
    _entryMatches(entry, currentConditions) {
        switch (entry.source) {
            case "pointer":
                if (entry.button !== undefined && entry.button !== currentConditions?.button) {
                    return false;
                }
                return this._matchModifiers(entry.modifiers, currentConditions?.modifiers);
            case "wheel":
                return this._matchModifiers(entry.modifiers, currentConditions?.modifiers);
            case "touch":
                if (entry.touchCount !== undefined && entry.touchCount !== currentConditions?.touchCount) {
                    return false;
                }
                return true;
            case "keyboard":
                if (entry.key !== undefined) {
                    if (Array.isArray(entry.key) ? entry.key.indexOf(currentConditions?.key ?? -1) === -1 : entry.key !== currentConditions?.key) {
                        return false;
                    }
                }
                return this._matchModifiers(entry.modifiers, currentConditions?.modifiers);
        }
    }
    _entryConditionsMatch(entry, conditions) {
        if (!conditions) {
            return true;
        }
        // NOTE: Uses the `"key" in conditions` form rather than `conditions.key !== undefined`
        // so that callers can explicitly target entries with no constraint via
        // `getEntries({ button: undefined })` — i.e. "find catch-all entries that don't
        // require a specific button". `!== undefined` would silently ignore a deliberate
        // `undefined` and behave like the property was omitted, which would be wrong here.
        switch (entry.source) {
            case "pointer":
                if ("button" in conditions && entry.button !== conditions.button) {
                    return false;
                }
                return !("modifiers" in conditions) || this._entryModifiersMatch(entry.modifiers, conditions.modifiers);
            case "wheel":
                return !("modifiers" in conditions) || this._entryModifiersMatch(entry.modifiers, conditions.modifiers);
            case "touch":
                return !("touchCount" in conditions) || entry.touchCount === conditions.touchCount;
            case "keyboard":
                if ("key" in conditions) {
                    if (entry.key === undefined) {
                        return conditions.key === undefined;
                    }
                    if (conditions.key === undefined || (Array.isArray(entry.key) ? entry.key.indexOf(conditions.key) === -1 : entry.key !== conditions.key)) {
                        return false;
                    }
                }
                return !("modifiers" in conditions) || this._entryModifiersMatch(entry.modifiers, conditions.modifiers);
        }
    }
    _entrySpecificity(entry) {
        let score = 0;
        if ("button" in entry && entry.button !== undefined) {
            score++;
        }
        if ("key" in entry && entry.key !== undefined) {
            score++;
        }
        if ("touchCount" in entry && entry.touchCount !== undefined) {
            score++;
        }
        if ("modifiers" in entry && entry.modifiers) {
            score++;
        }
        return score;
    }
    _matchModifiers(entryModifiers, currentModifiers) {
        if (!entryModifiers) {
            return true;
        }
        if (entryModifiers.ctrl !== undefined && entryModifiers.ctrl !== (currentModifiers?.ctrl ?? false)) {
            return false;
        }
        if (entryModifiers.shift !== undefined && entryModifiers.shift !== (currentModifiers?.shift ?? false)) {
            return false;
        }
        if (entryModifiers.alt !== undefined && entryModifiers.alt !== (currentModifiers?.alt ?? false)) {
            return false;
        }
        return true;
    }
    _entryModifiersMatch(entryModifiers, conditionsModifiers) {
        if (!conditionsModifiers) {
            return !entryModifiers;
        }
        const hasModifierConditions = conditionsModifiers.ctrl !== undefined || conditionsModifiers.shift !== undefined || conditionsModifiers.alt !== undefined;
        if (!hasModifierConditions) {
            return !entryModifiers || (entryModifiers.ctrl === undefined && entryModifiers.shift === undefined && entryModifiers.alt === undefined);
        }
        if (conditionsModifiers.ctrl !== undefined && entryModifiers?.ctrl !== conditionsModifiers.ctrl) {
            return false;
        }
        if (conditionsModifiers.shift !== undefined && entryModifiers?.shift !== conditionsModifiers.shift) {
            return false;
        }
        if (conditionsModifiers.alt !== undefined && entryModifiers?.alt !== conditionsModifiers.alt) {
            return false;
        }
        return true;
    }
}
//# sourceMappingURL=inputMapper.js.map