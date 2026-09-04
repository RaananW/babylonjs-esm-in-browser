/** This file must only contain pure code and pure imports */
import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import { RichTypeAny, RichTypeNumber, RichTypeVector3 } from "../../flowGraphRichTypes.pure.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * @experimental
 * An event block that fires when a physics collision occurs on the specified body.
 * Subscribes to the body's collision observable and exposes collision details
 * (the other body, contact point, normal, impulse, and distance) as data outputs.
 */
export class FlowGraphPhysicsCollisionEventBlock extends FlowGraphEventBlock {
    /**
     * Constructs a new FlowGraphPhysicsCollisionEventBlock.
     * @param config - optional configuration for the block
     */
    constructor(
    /**
     * the configuration of the block
     */
    config) {
        super(config);
        this.config = config;
        this.body = this.registerDataInput("body", RichTypeAny);
        this.otherBody = this.registerDataOutput("otherBody", RichTypeAny);
        this.point = this.registerDataOutput("point", RichTypeVector3);
        this.normal = this.registerDataOutput("normal", RichTypeVector3);
        this.impulse = this.registerDataOutput("impulse", RichTypeNumber);
        this.distance = this.registerDataOutput("distance", RichTypeNumber);
    }
    /**
     * @internal
     */
    _preparePendingTasks(context) {
        const physicsBody = this.body.getValue(context);
        if (!physicsBody) {
            this._reportError(context, "No physics body provided for collision event");
            return;
        }
        // Enable collision callbacks on the body
        physicsBody.setCollisionCallbackEnabled(true);
        const observer = physicsBody.getCollisionObservable().add((event) => {
            this._onCollision(context, event);
        });
        // Store observer and subscribed body per-context so multi-context usage is safe
        // and cleanup can target the original body even if the input changes.
        context._setExecutionVariable(this, "_collisionObserver", observer);
        context._setExecutionVariable(this, "_subscribedBody", physicsBody);
    }
    _onCollision(context, event) {
        const physicsBody = this.body.getValue(context);
        // Determine the "other" body from the collision pair
        const other = event.collider === physicsBody ? event.collidedAgainst : event.collider;
        this.otherBody.setValue(other, context);
        if (event.point) {
            this.point.setValue(event.point, context);
        }
        if (event.normal) {
            this.normal.setValue(event.normal, context);
        }
        this.impulse.setValue(event.impulse, context);
        this.distance.setValue(event.distance, context);
        this._execute(context);
    }
    /**
     * @internal
     */
    _executeEvent(_context, _payload) {
        // This block manages its own observable subscription, so the
        // central event coordinator does not dispatch to it.
        return true;
    }
    /**
     * @internal
     */
    _cancelPendingTasks(context) {
        const observer = context._getExecutionVariable(this, "_collisionObserver", null);
        const subscribedBody = context._getExecutionVariable(this, "_subscribedBody", null);
        if (observer && subscribedBody) {
            const observable = subscribedBody.getCollisionObservable();
            observable.remove(observer);
            // Disable collision callbacks if no other observers remain
            if (!observable.hasObservers()) {
                subscribedBody.setCollisionCallbackEnabled(false);
            }
        }
        context._setExecutionVariable(this, "_collisionObserver", null);
        context._setExecutionVariable(this, "_subscribedBody", null);
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphPhysicsCollisionEventBlock" /* FlowGraphBlockNames.PhysicsCollisionEvent */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphPhysicsCollisionEventBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphPhysicsCollisionEventBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphPhysicsCollisionEventBlock" /* FlowGraphBlockNames.PhysicsCollisionEvent */, FlowGraphPhysicsCollisionEventBlock);
}
//# sourceMappingURL=flowGraphPhysicsCollisionEventBlock.pure.js.map