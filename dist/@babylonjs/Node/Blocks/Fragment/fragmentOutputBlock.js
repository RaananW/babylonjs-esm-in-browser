import { __decorate } from "../../../../tslib.es6.js";
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
import { editableInPropertyPage, PropertyTypeForEdition } from "../../nodeMaterialDecorator.js";
import { MaterialHelper } from "../../../materialHelper.js";
/**
 * Block used to output the final color
 */
export class FragmentOutputBlock extends NodeMaterialBlock {
    /**
     * Create a new FragmentOutputBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name, NodeMaterialBlockTargets.Fragment, true);
        /** Gets or sets a boolean indicating if content needs to be converted to gamma space */
        this.convertToGammaSpace = false;
        /** Gets or sets a boolean indicating if content needs to be converted to linear space */
        this.convertToLinearSpace = false;
        /** Gets or sets a boolean indicating if logarithmic depth should be used */
        this.useLogarithmicDepth = false;
        this.registerInput("rgba", NodeMaterialBlockConnectionPointTypes.Color4, true);
        this.registerInput("rgb", NodeMaterialBlockConnectionPointTypes.AutoDetect, true);
        this.registerInput("a", NodeMaterialBlockConnectionPointTypes.Float, true);
        this.rgb.addExcludedConnectionPointFromAllowedTypes(NodeMaterialBlockConnectionPointTypes.Color3 | NodeMaterialBlockConnectionPointTypes.Vector3 | NodeMaterialBlockConnectionPointTypes.Float);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "FragmentOutputBlock";
    }
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state) {
        state._excludeVariableName("logarithmicDepthConstant");
        state._excludeVariableName("vFragmentDepth");
    }
    /**
     * Gets the rgba input component
     */
    get rgba() {
        return this._inputs[0];
    }
    /**
     * Gets the rgb input component
     */
    get rgb() {
        return this._inputs[1];
    }
    /**
     * Gets the a input component
     */
    get a() {
        return this._inputs[2];
    }
    prepareDefines(mesh, nodeMaterial, defines) {
        defines.setValue(this._linearDefineName, this.convertToLinearSpace, true);
        defines.setValue(this._gammaDefineName, this.convertToGammaSpace, true);
    }
    bind(effect, nodeMaterial, mesh) {
        if (this.useLogarithmicDepth && mesh) {
            MaterialHelper.BindLogDepth(undefined, effect, mesh.getScene());
        }
    }
    _buildBlock(state) {
        super._buildBlock(state);
        const rgba = this.rgba;
        const rgb = this.rgb;
        const a = this.a;
        state.sharedData.hints.needAlphaBlending = rgba.isConnected || a.isConnected;
        state.sharedData.blocksWithDefines.push(this);
        if (this.useLogarithmicDepth) {
            state._emitUniformFromString("logarithmicDepthConstant", "float");
            state._emitVaryingFromString("vFragmentDepth", "float");
            state.sharedData.bindableBlocks.push(this);
        }
        this._linearDefineName = state._getFreeDefineName("CONVERTTOLINEAR");
        this._gammaDefineName = state._getFreeDefineName("CONVERTTOGAMMA");
        const comments = `//${this.name}`;
        state._emitFunctionFromInclude("helperFunctions", comments);
        if (rgba.connectedPoint) {
            if (a.isConnected) {
                state.compilationString += `gl_FragColor = vec4(${rgba.associatedVariableName}.rgb, ${a.associatedVariableName});\r\n`;
            }
            else {
                state.compilationString += `gl_FragColor = ${rgba.associatedVariableName};\r\n`;
            }
        }
        else if (rgb.connectedPoint) {
            let aValue = "1.0";
            if (a.connectedPoint) {
                aValue = a.associatedVariableName;
            }
            if (rgb.connectedPoint.type === NodeMaterialBlockConnectionPointTypes.Float) {
                state.compilationString += `gl_FragColor = vec4(${rgb.associatedVariableName}, ${rgb.associatedVariableName}, ${rgb.associatedVariableName}, ${aValue});\r\n`;
            }
            else {
                state.compilationString += `gl_FragColor = vec4(${rgb.associatedVariableName}, ${aValue});\r\n`;
            }
        }
        else {
            state.sharedData.checks.notConnectedNonOptionalInputs.push(rgba);
        }
        state.compilationString += `#ifdef ${this._linearDefineName}\r\n`;
        state.compilationString += `gl_FragColor = toLinearSpace(gl_FragColor);\r\n`;
        state.compilationString += `#endif\r\n`;
        state.compilationString += `#ifdef ${this._gammaDefineName}\r\n`;
        state.compilationString += `gl_FragColor = toGammaSpace(gl_FragColor);\r\n`;
        state.compilationString += `#endif\r\n`;
        if (this.useLogarithmicDepth) {
            state.compilationString += `gl_FragDepthEXT = log2(vFragmentDepth) * logarithmicDepthConstant * 0.5;\r\n`;
        }
        return this;
    }
    _dumpPropertiesCode() {
        let codeString = super._dumpPropertiesCode();
        codeString += `${this._codeVariableName}.convertToGammaSpace = ${this.convertToGammaSpace};\r\n`;
        codeString += `${this._codeVariableName}.convertToLinearSpace = ${this.convertToLinearSpace};\r\n`;
        codeString += `${this._codeVariableName}.useLogarithmicDepth = ${this.useLogarithmicDepth};\r\n`;
        return codeString;
    }
    serialize() {
        const serializationObject = super.serialize();
        serializationObject.convertToGammaSpace = this.convertToGammaSpace;
        serializationObject.convertToLinearSpace = this.convertToLinearSpace;
        serializationObject.useLogarithmicDepth = this.useLogarithmicDepth;
        return serializationObject;
    }
    _deserialize(serializationObject, scene, rootUrl) {
        var _a;
        super._deserialize(serializationObject, scene, rootUrl);
        this.convertToGammaSpace = serializationObject.convertToGammaSpace;
        this.convertToLinearSpace = serializationObject.convertToLinearSpace;
        this.useLogarithmicDepth = (_a = serializationObject.useLogarithmicDepth) !== null && _a !== void 0 ? _a : false;
    }
}
__decorate([
    editableInPropertyPage("Convert to gamma space", PropertyTypeForEdition.Boolean, "PROPERTIES", { notifiers: { update: true } })
], FragmentOutputBlock.prototype, "convertToGammaSpace", void 0);
__decorate([
    editableInPropertyPage("Convert to linear space", PropertyTypeForEdition.Boolean, "PROPERTIES", { notifiers: { update: true } })
], FragmentOutputBlock.prototype, "convertToLinearSpace", void 0);
__decorate([
    editableInPropertyPage("Use logarithmic depth", PropertyTypeForEdition.Boolean, "PROPERTIES")
], FragmentOutputBlock.prototype, "useLogarithmicDepth", void 0);
RegisterClass("BABYLON.FragmentOutputBlock", FragmentOutputBlock);
//# sourceMappingURL=fragmentOutputBlock.js.map