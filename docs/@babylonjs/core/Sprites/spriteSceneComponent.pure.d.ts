/** This file must only contain pure code and pure imports */
import { Observable } from "../Misc/observable.pure.js";
import { Scene } from "../scene.pure.js";
import { type ISceneComponent } from "../sceneComponent.js";
import { type ISpriteManager } from "./spriteManager.js";
/** @internal */
export type InternalSpriteAugmentedScene = Scene & {
    _onNewSpriteManagerAddedObservable?: Observable<ISpriteManager>;
    _onSpriteManagerRemovedObservable?: Observable<ISpriteManager>;
};
/**
 * Defines the sprite scene component responsible to manage sprites
 * in a given scene.
 */
export declare class SpriteSceneComponent implements ISceneComponent {
    /**
     * The component name helpfull to identify the component in the list of scene components.
     */
    readonly name = "Sprite";
    /**
     * The scene the component belongs to.
     */
    scene: Scene;
    /** @internal */
    private _spritePredicate;
    /**
     * Creates a new instance of the component for the given scene
     * @param scene Defines the scene to register the component in
     */
    constructor(scene: Scene);
    /**
     * Registers the component in a given scene
     */
    register(): void;
    /**
     * Rebuilds the elements related to this component in case of
     * context lost for instance.
     */
    rebuild(): void;
    /**
     * Disposes the component and the associated resources.
     */
    dispose(): void;
    private _pickSpriteButKeepRay;
    private _pointerMove;
    private _pointerDown;
    private _pointerUp;
}
/**
 * Register side effects for spriteSceneComponent.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterSpriteSceneComponent(): void;
