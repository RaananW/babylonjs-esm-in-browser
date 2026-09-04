/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialSystemValues } from "../../Enums/nodeMaterialSystemValues.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { InputBlock } from "../Input/inputBlock.pure.js";
import { GetFogState } from "../../../materialHelper.functions.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to add support for scene fog
 */
export class FogBlock extends NodeMaterialBlock {
    /**
     * Create a new FogBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name, NodeMaterialBlockTargets.VertexAndFragment, false);
        // Vertex
        this.registerInput("worldPosition", NodeMaterialBlockConnectionPointTypes.Vector4, false, NodeMaterialBlockTargets.Vertex);
        this.registerInput("view", NodeMaterialBlockConnectionPointTypes.Matrix, false, NodeMaterialBlockTargets.Vertex);
        // Fragment
        this.registerInput("input", NodeMaterialBlockConnectionPointTypes.AutoDetect, false, NodeMaterialBlockTargets.Fragment);
        this.registerInput("fogColor", NodeMaterialBlockConnectionPointTypes.AutoDetect, false, NodeMaterialBlockTargets.Fragment);
        this.registerOutput("output", NodeMaterialBlockConnectionPointTypes.Color3, NodeMaterialBlockTargets.Fragment);
        this.input.addExcludedConnectionPointFromAllowedTypes(NodeMaterialBlockConnectionPointTypes.Color3 | NodeMaterialBlockConnectionPointTypes.Vector3 | NodeMaterialBlockConnectionPointTypes.Color4);
        this.fogColor.addExcludedConnectionPointFromAllowedTypes(NodeMaterialBlockConnectionPointTypes.Color3 | NodeMaterialBlockConnectionPointTypes.Vector3 | NodeMaterialBlockConnectionPointTypes.Color4);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "FogBlock";
    }
    /**
     * Gets the world position input component
     */
    get worldPosition() {
        return this._inputs[0];
    }
    /**
     * Gets the view input component
     */
    get view() {
        return this._inputs[1];
    }
    /**
     * Gets the color input component
     */
    get input() {
        return this._inputs[2];
    }
    /**
     * Gets the fog color input component
     */
    get fogColor() {
        return this._inputs[3];
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    /**
     * Initialize the block
     * @param state - the build state
     */
    initialize(state) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._initShaderSourceAsync(state.shaderLanguage);
    }
    async _initShaderSourceAsync(shaderLanguage) {
        this._codeIsReady = false;
        if (shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
            await import("../../../../ShadersWGSL/ShadersInclude/fogFragmentDeclaration.js");
        }
        else {
            await import("../../../../Shaders/ShadersInclude/fogFragmentDeclaration.js");
        }
        this._codeIsReady = true;
        this.onCodeIsReadyObservable.notifyObservers(this);
    }
    /**
     * Auto configure the block based on the material
     * @param material - the node material
     * @param additionalFilteringInfo - optional filtering info
     */
    autoConfigure(material, additionalFilteringInfo = () => true) {
        if (!this.view.isConnected) {
            let viewInput = material.getInputBlockByPredicate((b) => b.systemValue === NodeMaterialSystemValues.View && additionalFilteringInfo(b));
            if (!viewInput) {
                viewInput = new InputBlock("view");
                viewInput.setAsSystemValue(NodeMaterialSystemValues.View);
            }
            viewInput.output.connectTo(this.view);
        }
        if (!this.fogColor.isConnected) {
            let fogColorInput = material.getInputBlockByPredicate((b) => b.systemValue === NodeMaterialSystemValues.FogColor && additionalFilteringInfo(b));
            if (!fogColorInput) {
                fogColorInput = new InputBlock("fogColor", undefined, NodeMaterialBlockConnectionPointTypes.Color3);
                fogColorInput.setAsSystemValue(NodeMaterialSystemValues.FogColor);
            }
            fogColorInput.output.connectTo(this.fogColor);
        }
    }
    /**
     * Prepare the list of defines
     * @param defines - the material defines
     * @param nodeMaterial - the node material
     * @param mesh - the mesh to prepare for
     */
    prepareDefines(defines, nodeMaterial, mesh) {
        if (!mesh) {
            return;
        }
        const scene = mesh.getScene();
        defines.setValue("FOG", nodeMaterial.fogEnabled && GetFogState(mesh, scene));
    }
    /**
     * Bind data to effect
     * @param effect - the effect to bind to
     * @param nodeMaterial - the node material
     * @param mesh - the mesh to bind for
     */
    bind(effect, nodeMaterial, mesh) {
        if (!mesh) {
            return;
        }
        const scene = mesh.getScene();
        effect.setFloat4(this._fogParameters, scene.fogMode, scene.fogStart, scene.fogEnd, scene.fogDensity);
    }
    _buildBlock(state) {
        super._buildBlock(state);
        if (state.target === NodeMaterialBlockTargets.Fragment) {
            state.sharedData.blocksWithDefines.push(this);
            state.sharedData.bindableBlocks.push(this);
            let replaceStrings;
            let prefix1 = "";
            let prefix2 = "";
            if (state.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
                replaceStrings = [
                    { search: /fn CalcFogFactor\(\)/, replace: "fn CalcFogFactor(vFogDistance: vec3f, vFogInfos: vec4f)" },
                    { search: /uniforms.vFogInfos/g, replace: "vFogInfos" },
                    { search: /fragmentInputs.vFogDistance/g, replace: "vFogDistance" },
                ];
                prefix1 = "fragmentInputs.";
                prefix2 = "uniforms.";
            }
            else {
                replaceStrings = [{ search: /float CalcFogFactor\(\)/, replace: "float CalcFogFactor(vec3 vFogDistance, vec4 vFogInfos)" }];
            }
            state._emitFunctionFromInclude("fogFragmentDeclaration", `//${this.name}`, {
                removeUniforms: true,
                removeVaryings: true,
                removeIfDef: false,
                replaceStrings: replaceStrings,
            });
            const tempFogVariablename = state._getFreeVariableName("fog");
            const color = this.input;
            const fogColor = this.fogColor;
            this._fogParameters = state._getFreeVariableName("fogParameters");
            const output = this._outputs[0];
            state._emitUniformFromString(this._fogParameters, NodeMaterialBlockConnectionPointTypes.Vector4);
            state.compilationString += `#ifdef FOG\n`;
            state.compilationString += `${state._declareLocalVar(tempFogVariablename, NodeMaterialBlockConnectionPointTypes.Float)} = CalcFogFactor(${prefix1}${this._fogDistanceName}, ${prefix2}${this._fogParameters});\n`;
            state.compilationString +=
                state._declareOutput(output) +
                    ` = ${tempFogVariablename} * ${color.associatedVariableName}.rgb + (1.0 - ${tempFogVariablename}) * ${fogColor.associatedVariableName}.rgb;\n`;
            state.compilationString += `#else\n${state._declareOutput(output)} =  ${color.associatedVariableName}.rgb;\n`;
            state.compilationString += `#endif\n`;
        }
        else {
            const worldPos = this.worldPosition;
            const view = this.view;
            this._fogDistanceName = state._getFreeVariableName("vFogDistance");
            state._emitVaryingFromString(this._fogDistanceName, NodeMaterialBlockConnectionPointTypes.Vector3);
            const prefix = state.shaderLanguage === 1 /* ShaderLanguage.WGSL */ ? "vertexOutputs." : "";
            state.compilationString += `${prefix}${this._fogDistanceName} = (${view.associatedVariableName} * ${worldPos.associatedVariableName}).xyz;\n`;
        }
        return this;
    }
}
let _Registered = false;
/**
 * Register side effects for fogBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFogBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.FogBlock", FogBlock);
}
//# sourceMappingURL=fogBlock.pure.js.map