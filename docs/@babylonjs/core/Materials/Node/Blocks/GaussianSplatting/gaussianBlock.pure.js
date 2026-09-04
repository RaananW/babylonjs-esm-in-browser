/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used for the Gaussian Splatting Fragment part
 */
export class GaussianBlock extends NodeMaterialBlock {
    /**
     * Create a new GaussianBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name, NodeMaterialBlockTargets.Fragment);
        this._isUnique = false;
        this.registerInput("splatColor", NodeMaterialBlockConnectionPointTypes.Color4, false, NodeMaterialBlockTargets.Fragment);
        this.registerOutput("rgba", NodeMaterialBlockConnectionPointTypes.Color4, NodeMaterialBlockTargets.Fragment);
        this.registerOutput("rgb", NodeMaterialBlockConnectionPointTypes.Color3, NodeMaterialBlockTargets.Fragment);
        this.registerOutput("alpha", NodeMaterialBlockConnectionPointTypes.Float, NodeMaterialBlockTargets.Fragment);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "GaussianBlock";
    }
    /**
     * Gets the color input component
     */
    get splatColor() {
        return this._inputs[0];
    }
    /**
     * Gets the rgba output component
     */
    get rgba() {
        return this._outputs[0];
    }
    /**
     * Gets the rgb output component
     */
    get rgb() {
        return this._outputs[1];
    }
    /**
     * Gets the alpha output component
     */
    get alpha() {
        return this._outputs[2];
    }
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state) {
        state._excludeVariableName("vPosition");
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._initShaderSourceAsync(state.shaderLanguage);
    }
    async _initShaderSourceAsync(shaderLanguage) {
        this._codeIsReady = false;
        if (shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
            await Promise.all([
                import("../../../../ShadersWGSL/ShadersInclude/clipPlaneFragmentDeclaration.js"),
                import("../../../../ShadersWGSL/ShadersInclude/logDepthDeclaration.js"),
                import("../../../../ShadersWGSL/ShadersInclude/fogFragmentDeclaration.js"),
                import("../../../../ShadersWGSL/ShadersInclude/gaussianSplattingFragmentDeclaration.js"),
            ]);
        }
        else {
            await Promise.all([
                import("../../../../Shaders/ShadersInclude/clipPlaneFragmentDeclaration.js"),
                import("../../../../Shaders/ShadersInclude/logDepthDeclaration.js"),
                import("../../../../Shaders/ShadersInclude/fogFragmentDeclaration.js"),
                import("../../../../Shaders/ShadersInclude/gaussianSplattingFragmentDeclaration.js"),
            ]);
        }
        this._codeIsReady = true;
        this.onCodeIsReadyObservable.notifyObservers(this);
    }
    _buildBlock(state) {
        super._buildBlock(state);
        if (state.target === NodeMaterialBlockTargets.Vertex) {
            return;
        }
        // Emit code
        const comments = `//${this.name}`;
        state._emitFunctionFromInclude("clipPlaneFragmentDeclaration", comments);
        state._emitFunctionFromInclude("logDepthDeclaration", comments);
        state._emitFunctionFromInclude("fogFragmentDeclaration", comments);
        state._emitFunctionFromInclude("gaussianSplattingFragmentDeclaration", comments);
        state._emitVaryingFromString("vPosition", NodeMaterialBlockConnectionPointTypes.Vector2);
        const tempSplatColor = state._getFreeVariableName("tempSplatColor");
        const color = this.splatColor;
        const rgba = this._outputs[0];
        const rgb = this._outputs[1];
        const alpha = this._outputs[2];
        if (state.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
            state.compilationString += `let ${tempSplatColor}:vec4f = gaussianColor(${color.associatedVariableName}, input.vPosition);\n`;
        }
        else {
            state.compilationString += `vec4 ${tempSplatColor} = gaussianColor(${color.associatedVariableName});\n`;
        }
        state.compilationString += `${state._declareOutput(rgba)} = ${tempSplatColor}.rgba;`;
        state.compilationString += `${state._declareOutput(rgb)} = ${tempSplatColor}.rgb;`;
        state.compilationString += `${state._declareOutput(alpha)} = ${tempSplatColor}.a;`;
        return this;
    }
}
let _Registered = false;
/**
 * Register side effects for gaussianBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterGaussianBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.GaussianBlock", GaussianBlock);
}
//# sourceMappingURL=gaussianBlock.pure.js.map