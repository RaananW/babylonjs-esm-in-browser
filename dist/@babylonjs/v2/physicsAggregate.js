import { PhysicsMaterial } from "./physicsMaterial.js";
import { Logger } from "../../Misc/logger.js";
/**
 *
 */
export class PhysicsAggregate {
    constructor(
    /**
     * The physics-enabled object used as the physics imposter
     */
    transformNode, 
    /**
     * The type of the physics imposter
     */
    type, _options = { mass: 0 }, _scene) {
        this.transformNode = transformNode;
        this.type = type;
        this._options = _options;
        this._scene = _scene;
        //sanity check!
        if (!this.transformNode) {
            Logger.Error("No object was provided. A physics object is obligatory");
            return;
        }
        if (this.transformNode.parent && this._options.mass !== 0) {
            Logger.Warn("A physics impostor has been created for an object which has a parent. Babylon physics currently works in local space so unexpected issues may occur.");
        }
        // Legacy support for old syntax.
        if (!this._scene && transformNode.getScene) {
            this._scene = transformNode.getScene();
        }
        if (!this._scene) {
            return;
        }
        this.material = new PhysicsMaterial(this._options.friction ? this._options.friction : 0, this._options.restitution ? this._options.restitution : 0, this._scene);
    }
    /**
     *
     */
    dispose() {
        this.body.dispose();
        this.material.dispose();
        this.shape.dispose();
    }
}
//# sourceMappingURL=physicsAggregate.js.map