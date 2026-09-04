/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { _ConnectAtTheEnd } from "../../../Queue/executionQueue.js";
import { Vector3 } from "../../../../Maths/math.vector.pure.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to align the angle of a particle to its direction
 * We assume the sprite is facing +Y
 * NPE: #W5054F
 * PG: #H5RP91
 */
let AlignAngleBlock = (() => {
    var _a;
    let _classSuper = NodeParticleBlock;
    let _alignment_decorators;
    let _alignment_initializers = [];
    let _alignment_extraInitializers = [];
    return _a = class AlignAngleBlock extends _classSuper {
            /**
             * Create a new AlignAngleBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                /**
                 * Gets or sets the strenght of the flow map effect
                 */
                this.alignment = __runInitializers(this, _alignment_initializers, Math.PI / 2); // Default to 90 degrees, aligning +Y with direction
                __runInitializers(this, _alignment_extraInitializers);
                this.registerInput("particle", NodeParticleBlockConnectionPointTypes.Particle);
                this.registerOutput("output", NodeParticleBlockConnectionPointTypes.Particle);
            }
            /**
             * Gets the particle component
             */
            get particle() {
                return this._inputs[0];
            }
            /**
             * Gets the output component
             */
            get output() {
                return this._outputs[0];
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "AlignAngleBlock";
            }
            /**
             * Builds the block
             * @param state defines the current build state
             */
            _build(state) {
                const system = this.particle.getConnectedValue(state);
                this.output._storedValue = system;
                const tempVector3 = new Vector3();
                const processAngle = (particle) => {
                    const cam = state.scene.activeCamera;
                    if (!cam) {
                        return;
                    }
                    const dir = particle.direction;
                    const view = cam.getViewMatrix();
                    const dirInView = Vector3.TransformNormalToRef(dir, view, tempVector3);
                    // Angle so sprite’s +Y aligns with projected direction
                    const angle = Math.atan2(dirInView.y, dirInView.x) + this.alignment;
                    particle.angle = angle; // radians
                };
                const angleProcessing = {
                    process: processAngle,
                    previousItem: null,
                    nextItem: null,
                };
                if (system._updateQueueStart) {
                    _ConnectAtTheEnd(angleProcessing, system._updateQueueStart);
                }
                else {
                    system._updateQueueStart = angleProcessing;
                }
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.alignment = this.alignment;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                if (serializationObject.alignment !== undefined) {
                    this.alignment = serializationObject.alignment;
                }
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _alignment_decorators = [editableInPropertyPage("alignment", 1 /* PropertyTypeForEdition.Float */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: -0, max: 2 * Math.PI })];
            __esDecorate(null, null, _alignment_decorators, { kind: "field", name: "alignment", static: false, private: false, access: { has: obj => "alignment" in obj, get: obj => obj.alignment, set: (obj, value) => { obj.alignment = value; } }, metadata: _metadata }, _alignment_initializers, _alignment_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { AlignAngleBlock };
let _Registered = false;
/**
 * Register side effects for alignAngleBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterAlignAngleBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.AlignAngleBlock", AlignAngleBlock);
}
//# sourceMappingURL=alignAngleBlock.pure.js.map