/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { VertexBuffer } from "../../../../Meshes/buffer.js";
import { IsGaussianSplattingClassName } from "../../../../Meshes/GaussianSplatting/gaussianSplattingMesh.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used for the Gaussian Splatting
 */
export class GaussianSplattingBlock extends NodeMaterialBlock {
    /**
     * Create a new GaussianSplattingBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name, NodeMaterialBlockTargets.Vertex);
        this._isUnique = true;
        this.registerInput("splatPosition", NodeMaterialBlockConnectionPointTypes.Vector3, false, NodeMaterialBlockTargets.Vertex);
        this.registerInput("splatScale", NodeMaterialBlockConnectionPointTypes.Vector2, true, NodeMaterialBlockTargets.Vertex);
        this.registerInput("world", NodeMaterialBlockConnectionPointTypes.Matrix, false, NodeMaterialBlockTargets.Vertex);
        this.registerInput("view", NodeMaterialBlockConnectionPointTypes.Matrix, false, NodeMaterialBlockTargets.Vertex);
        this.registerInput("projection", NodeMaterialBlockConnectionPointTypes.Matrix, false, NodeMaterialBlockTargets.Vertex);
        this.registerOutput("splatVertex", NodeMaterialBlockConnectionPointTypes.Vector4, NodeMaterialBlockTargets.Vertex);
        this.registerOutput("SH", NodeMaterialBlockConnectionPointTypes.Color3, NodeMaterialBlockTargets.Vertex);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "GaussianSplattingBlock";
    }
    /**
     * Gets the position input component
     */
    get splatPosition() {
        return this._inputs[0];
    }
    /**
     * Gets the scale input component
     */
    get splatScale() {
        return this._inputs[1];
    }
    /**
     * Gets the View matrix input component
     */
    get world() {
        return this._inputs[2];
    }
    /**
     * Gets the View matrix input component
     */
    get view() {
        return this._inputs[3];
    }
    /**
     * Gets the projection matrix input component
     */
    get projection() {
        return this._inputs[4];
    }
    /**
     * Gets the splatVertex output component
     */
    get splatVertex() {
        return this._outputs[0];
    }
    /**
     * Gets the SH output contribution
     */
    get SH() {
        return this._outputs[1];
    }
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state) {
        state._excludeVariableName("focal");
        state._excludeVariableName("invViewport");
        state._excludeVariableName("kernelSize");
        state._excludeVariableName("minPixelSize");
        state._excludeVariableName("eyePosition");
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._initShaderSourceAsync(state.shaderLanguage);
    }
    async _initShaderSourceAsync(shaderLanguage) {
        this._codeIsReady = false;
        if (shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
            await Promise.all([
                import("../../../../ShadersWGSL/ShadersInclude/gaussianSplattingVertexDeclaration.js"),
                import("../../../../ShadersWGSL/ShadersInclude/gaussianSplatting.js"),
                import("../../../../ShadersWGSL/ShadersInclude/helperFunctions.js"),
            ]);
        }
        else {
            await Promise.all([
                import("../../../../Shaders/ShadersInclude/gaussianSplattingVertexDeclaration.js"),
                import("../../../../Shaders/ShadersInclude/gaussianSplatting.js"),
                import("../../../../Shaders/ShadersInclude/helperFunctions.js"),
            ]);
        }
        this._codeIsReady = true;
        this.onCodeIsReadyObservable.notifyObservers(this);
    }
    /**
     * Update defines for shader compilation
     * @param defines defines the material defines to update
     * @param nodeMaterial defines the node material requesting the update
     * @param mesh defines the mesh to be rendered
     */
    prepareDefines(defines, nodeMaterial, mesh) {
        if (!mesh) {
            return;
        }
        if (IsGaussianSplattingClassName(mesh.getClassName())) {
            defines.setValue("SH_DEGREE", mesh.shDegree, true);
        }
    }
    _buildBlock(state) {
        super._buildBlock(state);
        if (state.target === NodeMaterialBlockTargets.Fragment) {
            return;
        }
        state.sharedData.blocksWithDefines.push(this);
        const comments = `//${this.name}`;
        state._emitFunctionFromInclude("gaussianSplattingVertexDeclaration", comments);
        state._emitFunctionFromInclude("gaussianSplatting", comments);
        state._emitFunctionFromInclude("helperFunctions", comments);
        state._emitUniformFromString("focal", NodeMaterialBlockConnectionPointTypes.Vector2);
        state._emitUniformFromString("invViewport", NodeMaterialBlockConnectionPointTypes.Vector2);
        state._emitUniformFromString("kernelSize", NodeMaterialBlockConnectionPointTypes.Float);
        state._emitUniformFromString("minPixelSize", NodeMaterialBlockConnectionPointTypes.Float);
        state._emitUniformFromString("eyePosition", NodeMaterialBlockConnectionPointTypes.Vector3);
        state.attributes.push(VertexBuffer.PositionKind);
        state.attributes.push("splatIndex0");
        state.attributes.push("splatIndex1");
        state.attributes.push("splatIndex2");
        state.attributes.push("splatIndex3");
        state.sharedData.nodeMaterial.backFaceCulling = false;
        const splatPosition = this.splatPosition;
        const splatScale = this.splatScale;
        const world = this.world;
        const view = this.view;
        const projection = this.projection;
        const output = this.splatVertex;
        const sh = this.SH;
        const addF = state.fSuffix;
        let splatScaleParameter = `vec2${addF}(1.,1.)`;
        if (splatScale.isConnected) {
            splatScaleParameter = splatScale.associatedVariableName;
        }
        let input = "position";
        let uniforms = "";
        if (state.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
            input = "input.position";
            uniforms = ", uniforms.focal, uniforms.invViewport, uniforms.kernelSize, uniforms.minPixelSize";
        }
        if (this.SH.isConnected) {
            state.compilationString += `#if SH_DEGREE > 0\n`;
            if (state.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
                state.compilationString += `let worldRot: mat3x3f =  mat3x3f(${world.associatedVariableName}[0].xyz, ${world.associatedVariableName}[1].xyz, ${world.associatedVariableName}[2].xyz);`;
                state.compilationString += `let normWorldRot: mat3x3f = inverseMat3(worldRot);`;
                state.compilationString += `var eyeToSplatLocalSpace: vec3f = normalize(normWorldRot * (${splatPosition.associatedVariableName}.xyz - uniforms.eyePosition));\n`;
            }
            else {
                state.compilationString += `mat3 worldRot = mat3(${world.associatedVariableName});`;
                state.compilationString += `mat3 normWorldRot = inverseMat3(worldRot);`;
                state.compilationString += `vec3 eyeToSplatLocalSpace = normalize(normWorldRot * (${splatPosition.associatedVariableName}.xyz - eyePosition));\n`;
            }
            state.compilationString += `${state._declareOutput(sh)} = computeSH(splat, eyeToSplatLocalSpace);\n`;
            state.compilationString += `#else\n`;
            state.compilationString += `${state._declareOutput(sh)} = vec3${addF}(0.,0.,0.);\n`;
            state.compilationString += `#endif;\n`;
        }
        else {
            state.compilationString += `${state._declareOutput(sh)} = vec3${addF}(0.,0.,0.);`;
        }
        state.compilationString += `${state._declareOutput(output)} = gaussianSplatting(${input}.xy, ${splatPosition.associatedVariableName}, ${splatScaleParameter}, covA, covB, ${world.associatedVariableName}, ${view.associatedVariableName}, ${projection.associatedVariableName}${uniforms});\n`;
        return this;
    }
}
let _Registered = false;
/**
 * Register side effects for gaussianSplattingBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterGaussianSplattingBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.GaussianSplattingBlock", GaussianSplattingBlock);
}
//# sourceMappingURL=gaussianSplattingBlock.pure.js.map