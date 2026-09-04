/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used as configure the sprite sheet for particles
 */
let SetupSpriteSheetBlock = (() => {
    var _a;
    let _classSuper = NodeParticleBlock;
    let _start_decorators;
    let _start_initializers = [];
    let _start_extraInitializers = [];
    let _end_decorators;
    let _end_initializers = [];
    let _end_extraInitializers = [];
    let _width_decorators;
    let _width_initializers = [];
    let _width_extraInitializers = [];
    let _height_decorators;
    let _height_initializers = [];
    let _height_extraInitializers = [];
    let _spriteCellChangeSpeed_decorators;
    let _spriteCellChangeSpeed_initializers = [];
    let _spriteCellChangeSpeed_extraInitializers = [];
    let _loop_decorators;
    let _loop_initializers = [];
    let _loop_extraInitializers = [];
    let _randomStartCell_decorators;
    let _randomStartCell_initializers = [];
    let _randomStartCell_extraInitializers = [];
    return _a = class SetupSpriteSheetBlock extends _classSuper {
            /**
             * Creates a new SetupSpriteSheetBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                /**
                 * Gets or sets the start cell of the sprite sheet
                 */
                this.start = __runInitializers(this, _start_initializers, 0);
                /**
                 * Gets or sets the end cell of the sprite sheet
                 */
                this.end = (__runInitializers(this, _start_extraInitializers), __runInitializers(this, _end_initializers, 8));
                /**
                 * Gets or sets the width of the sprite sheet
                 */
                this.width = (__runInitializers(this, _end_extraInitializers), __runInitializers(this, _width_initializers, 64));
                /**
                 * Gets or sets the height of the sprite sheet
                 */
                this.height = (__runInitializers(this, _width_extraInitializers), __runInitializers(this, _height_initializers, 64));
                /**
                 * Gets or sets the speed of the cell change
                 */
                this.spriteCellChangeSpeed = (__runInitializers(this, _height_extraInitializers), __runInitializers(this, _spriteCellChangeSpeed_initializers, 1));
                /**
                 * Gets or sets a boolean indicating if the sprite sheet should loop
                 */
                this.loop = (__runInitializers(this, _spriteCellChangeSpeed_extraInitializers), __runInitializers(this, _loop_initializers, false));
                /**
                 * Gets or sets a boolean indicating if the sprite sheet should start at a random cell
                 */
                this.randomStartCell = (__runInitializers(this, _loop_extraInitializers), __runInitializers(this, _randomStartCell_initializers, false));
                __runInitializers(this, _randomStartCell_extraInitializers);
                this.registerInput("particle", NodeParticleBlockConnectionPointTypes.Particle);
                this.registerOutput("output", NodeParticleBlockConnectionPointTypes.Particle);
                this._outputs[0]._typeConnectionSource = this._inputs[0];
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "SetupSpriteSheetBlock";
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
            _build(state) {
                super._build(state);
                const system = this.particle.getConnectedValue(state);
                system._isAnimationSheetEnabled = true;
                system.spriteCellWidth = this.width;
                system.spriteCellHeight = this.height;
                system.startSpriteCellID = this.start;
                system.endSpriteCellID = this.end;
                system.spriteCellLoop = this.loop;
                system.spriteRandomStartCell = this.randomStartCell;
                system.spriteCellChangeSpeed = this.spriteCellChangeSpeed;
                this.output._storedValue = system;
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.width = this.width;
                serializationObject.height = this.height;
                serializationObject.start = this.start;
                serializationObject.end = this.end;
                serializationObject.spriteCellChangeSpeed = this.spriteCellChangeSpeed;
                serializationObject.loop = this.loop;
                serializationObject.randomStartCell = this.randomStartCell;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.width = serializationObject.width;
                this.height = serializationObject.height;
                this.start = serializationObject.start;
                this.end = serializationObject.end;
                this.spriteCellChangeSpeed = serializationObject.spriteCellChangeSpeed;
                this.loop = serializationObject.loop;
                this.randomStartCell = serializationObject.randomStartCell;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _start_decorators = [editableInPropertyPage("Start", 2 /* PropertyTypeForEdition.Int */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: 0 })];
            _end_decorators = [editableInPropertyPage("End", 2 /* PropertyTypeForEdition.Int */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: 0 })];
            _width_decorators = [editableInPropertyPage("Width", 1 /* PropertyTypeForEdition.Float */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: 0 })];
            _height_decorators = [editableInPropertyPage("Height", 1 /* PropertyTypeForEdition.Float */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: 0 })];
            _spriteCellChangeSpeed_decorators = [editableInPropertyPage("Sprite Cell Change Speed", 1 /* PropertyTypeForEdition.Float */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: 0 })];
            _loop_decorators = [editableInPropertyPage("Loop", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })];
            _randomStartCell_decorators = [editableInPropertyPage("Random start cell", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })];
            __esDecorate(null, null, _start_decorators, { kind: "field", name: "start", static: false, private: false, access: { has: obj => "start" in obj, get: obj => obj.start, set: (obj, value) => { obj.start = value; } }, metadata: _metadata }, _start_initializers, _start_extraInitializers);
            __esDecorate(null, null, _end_decorators, { kind: "field", name: "end", static: false, private: false, access: { has: obj => "end" in obj, get: obj => obj.end, set: (obj, value) => { obj.end = value; } }, metadata: _metadata }, _end_initializers, _end_extraInitializers);
            __esDecorate(null, null, _width_decorators, { kind: "field", name: "width", static: false, private: false, access: { has: obj => "width" in obj, get: obj => obj.width, set: (obj, value) => { obj.width = value; } }, metadata: _metadata }, _width_initializers, _width_extraInitializers);
            __esDecorate(null, null, _height_decorators, { kind: "field", name: "height", static: false, private: false, access: { has: obj => "height" in obj, get: obj => obj.height, set: (obj, value) => { obj.height = value; } }, metadata: _metadata }, _height_initializers, _height_extraInitializers);
            __esDecorate(null, null, _spriteCellChangeSpeed_decorators, { kind: "field", name: "spriteCellChangeSpeed", static: false, private: false, access: { has: obj => "spriteCellChangeSpeed" in obj, get: obj => obj.spriteCellChangeSpeed, set: (obj, value) => { obj.spriteCellChangeSpeed = value; } }, metadata: _metadata }, _spriteCellChangeSpeed_initializers, _spriteCellChangeSpeed_extraInitializers);
            __esDecorate(null, null, _loop_decorators, { kind: "field", name: "loop", static: false, private: false, access: { has: obj => "loop" in obj, get: obj => obj.loop, set: (obj, value) => { obj.loop = value; } }, metadata: _metadata }, _loop_initializers, _loop_extraInitializers);
            __esDecorate(null, null, _randomStartCell_decorators, { kind: "field", name: "randomStartCell", static: false, private: false, access: { has: obj => "randomStartCell" in obj, get: obj => obj.randomStartCell, set: (obj, value) => { obj.randomStartCell = value; } }, metadata: _metadata }, _randomStartCell_initializers, _randomStartCell_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { SetupSpriteSheetBlock };
let _Registered = false;
/**
 * Register side effects for setupSpriteSheetBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterSetupSpriteSheetBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.SetupSpriteSheetBlock", SetupSpriteSheetBlock);
}
//# sourceMappingURL=setupSpriteSheetBlock.pure.js.map