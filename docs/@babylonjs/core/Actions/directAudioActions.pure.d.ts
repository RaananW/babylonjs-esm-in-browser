/** This file must only contain pure code and pure imports */
import { Action } from "./action.pure.js";
import { type Condition } from "./condition.pure.js";
import { type Sound } from "../Audio/sound.pure.js";
/**
 * This defines an action helpful to play a defined sound on a triggered action.
 */
export declare class PlaySoundAction extends Action {
    private _sound;
    /**
     * Instantiate the action
     * @param triggerOptions defines the trigger options
     * @param sound defines the sound to play
     * @param condition defines the trigger related conditions
     */
    constructor(triggerOptions: any, sound: Sound, condition?: Condition);
    /** @internal */
    _prepare(): void;
    /**
     * Execute the action and play the sound.
     */
    execute(): void;
    /**
     * Serializes the actions and its related information.
     * @param parent defines the object to serialize in
     * @returns the serialized object
     */
    serialize(parent: any): any;
}
/**
 * This defines an action helpful to stop a defined sound on a triggered action.
 */
export declare class StopSoundAction extends Action {
    private _sound;
    /**
     * Instantiate the action
     * @param triggerOptions defines the trigger options
     * @param sound defines the sound to stop
     * @param condition defines the trigger related conditions
     */
    constructor(triggerOptions: any, sound: Sound, condition?: Condition);
    /** @internal */
    _prepare(): void;
    /**
     * Execute the action and stop the sound.
     */
    execute(): void;
    /**
     * Serializes the actions and its related information.
     * @param parent defines the object to serialize in
     * @returns the serialized object
     */
    serialize(parent: any): any;
}
/**
 * Register side effects for directAudioActions.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterDirectAudioActions(): void;
