/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../Enums/nodeMaterialBlockTargets.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { NodeMaterialConnectionPointCustomObject } from "../nodeMaterialConnectionPointCustomObject.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to repeat code
 */
let LoopBlock = (() => {
    var _a;
    let _classSuper = NodeMaterialBlock;
    let _iterations_decorators;
    let _iterations_initializers = [];
    let _iterations_extraInitializers = [];
    return _a = class LoopBlock extends _classSuper {
            /**
             * Creates a new LoopBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name, NodeMaterialBlockTargets.Neutral);
                /**
                 * Gets or sets number of iterations
                 * Will be ignored if the iterations input is connected
                 */
                this.iterations = __runInitializers(this, _iterations_initializers, 4);
                __runInitializers(this, _iterations_extraInitializers);
                this.registerInput("input", NodeMaterialBlockConnectionPointTypes.AutoDetect);
                this.registerInput("iterations", NodeMaterialBlockConnectionPointTypes.Float, true);
                this.registerOutput("output", NodeMaterialBlockConnectionPointTypes.BasedOnInput);
                this.registerOutput("index", NodeMaterialBlockConnectionPointTypes.Float, NodeMaterialBlockTargets.Fragment);
                this.registerOutput("loopID", NodeMaterialBlockConnectionPointTypes.Object, undefined, new NodeMaterialConnectionPointCustomObject("loopID", this, 1 /* NodeMaterialConnectionPointDirection.Output */, _a, "LoopBlock"));
                this._outputs[0]._typeConnectionSource = this._inputs[0];
                this._outputs[0]._forPostBuild = true;
                this._outputs[2]._redirectedSource = this._inputs[0];
                this._outputs[1]._preventBubbleUp = true;
                this._outputs[2]._preventBubbleUp = true;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "LoopBlock";
            }
            /**
             * Gets the main input component
             */
            get input() {
                return this._inputs[0];
            }
            /**
             * Gets the iterations input component
             */
            get iterationsInput() {
                return this._inputs[1];
            }
            /**
             * Gets the output component
             */
            get output() {
                return this._outputs[0];
            }
            /**
             * Gets the index component which will be incremented at each iteration
             */
            get index() {
                return this._outputs[1];
            }
            /**
             * Gets the loop ID component
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            get loopID() {
                return this._outputs[2];
            }
            _buildBlock(state) {
                super._buildBlock(state);
                const output = this._outputs[0];
                const index = this._outputs[1];
                const indexName = state._getFreeVariableName("index");
                const decl = state.shaderLanguage === 1 /* ShaderLanguage.WGSL */ ? "var" : "int";
                const castFloat = state.shaderLanguage === 1 /* ShaderLanguage.WGSL */ ? "f32" : "float";
                const castInt = state.shaderLanguage === 1 /* ShaderLanguage.WGSL */ ? "i32" : "int";
                // Declare storage variable and store initial value
                state.compilationString += state._declareOutput(output) + ` = ${this.input.associatedVariableName};\n`;
                // Iterations
                const iterations = this.iterationsInput.isConnected ? `${castInt}(${this.iterationsInput.associatedVariableName})` : this.iterations;
                // Loop
                state.compilationString += `for (${decl} ${indexName} = 0; ${indexName} < ${iterations}; ${indexName}++){\n`;
                state.compilationString += `${state._declareOutput(index)} = ${castFloat}(${indexName});\n`;
                return this;
            }
            _postBuildBlock(state) {
                super._postBuildBlock(state);
                state.compilationString += `}\n`;
                return this;
            }
            _dumpPropertiesCode() {
                return super._dumpPropertiesCode() + `${this._codeVariableName}.iterations = ${this.iterations};\n`;
            }
            /**
             * Serializes the block
             * @returns the serialized object
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.iterations = this.iterations;
                return serializationObject;
            }
            /**
             * Deserializes the block
             * @param serializationObject - the serialization object
             * @param scene - the scene
             * @param rootUrl - the root URL
             */
            _deserialize(serializationObject, scene, rootUrl) {
                super._deserialize(serializationObject, scene, rootUrl);
                this.iterations = serializationObject.iterations;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _iterations_decorators = [editableInPropertyPage("Iterations", 2 /* PropertyTypeForEdition.Int */, undefined, { embedded: true })];
            __esDecorate(null, null, _iterations_decorators, { kind: "field", name: "iterations", static: false, private: false, access: { has: obj => "iterations" in obj, get: obj => obj.iterations, set: (obj, value) => { obj.iterations = value; } }, metadata: _metadata }, _iterations_initializers, _iterations_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { LoopBlock };
let _Registered = false;
/**
 * Register side effects for loopBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterLoopBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.LoopBlock", LoopBlock);
}
//# sourceMappingURL=loopBlock.pure.js.map