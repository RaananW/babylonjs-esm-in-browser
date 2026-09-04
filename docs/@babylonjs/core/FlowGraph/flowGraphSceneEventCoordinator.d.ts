import { Observable } from "../Misc/observable.js";
import { type Scene } from "../scene.js";
import { FlowGraphEventType } from "./flowGraphEventType.js";
/**
 * the interface of the object the scene event coordinator will trigger.
 */
export interface IFlowGraphEventTrigger {
    /**
     * The type of the event
     */
    type: FlowGraphEventType;
    /**
     * The data of the event
     */
    payload?: any;
}
/**
 * This class is responsible for coordinating the events that are triggered in the scene.
 * It registers all observers needed to track certain events and triggers the blocks that are listening to them.
 * Abstracting the events from the class will allow us to easily change the events that are being listened to, and trigger them in any order.
 */
export declare class FlowGraphSceneEventCoordinator {
    /**
     * @internal
     */
    readonly _scene: Scene;
    /**
     * register to this observable to get flow graph event notifications.
     */
    onEventTriggeredObservable: Observable<IFlowGraphEventTrigger>;
    /**
     * Was scene-ready already triggered?
     */
    sceneReadyTriggered: boolean;
    private _sceneDisposeObserver;
    private _sceneReadyObserver;
    private _sceneOnBeforeRenderObserver;
    private _meshPickedObserver;
    private _meshUnderPointerObserver;
    private _pointerDownObserver;
    private _pointerUpObserver;
    private _pointerMoveObserver;
    private _pointerUnderMeshState;
    private _keyDownObserver;
    private _keyUpObserver;
    private _onBlurHandler;
    /**
     * The set of keys currently pressed, keyed by `event.code`.
     * Keyboard event blocks use this to determine whether a key is held.
     *
     * In addition to physical key codes, a virtual `"CommandOrControl"` entry
     * is maintained: it tracks Meta (Cmd) on macOS and Ctrl on Windows/Linux,
     * enabling platform-agnostic shortcut checks via the IsKeyPressed block.
     */
    readonly pressedKeys: Set<string>;
    /** The physical key codes that map to the virtual CommandOrControl key on this platform. */
    private static readonly _COMMAND_OR_CTRL_CODES;
    private _startingTime;
    constructor(scene: Scene);
    private _initialize;
    dispose(): void;
}
