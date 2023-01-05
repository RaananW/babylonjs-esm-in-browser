import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialConnectionPointDirection } from "../../nodeMaterialBlockConnectionPoint.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
import { NodeMaterialConnectionPointCustomObject } from "../../nodeMaterialConnectionPointCustomObject.js";
import { TBNBlock } from "../Fragment/TBNBlock.js";
/**
 * Block used to implement the anisotropy module of the PBR material
 */
export class AnisotropyBlock extends NodeMaterialBlock {
    /**
     * Create a new AnisotropyBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name, NodeMaterialBlockTargets.Fragment);
        this._tangentCorrectionFactorName = "";
        this._isUnique = true;
        this.registerInput("intensity", NodeMaterialBlockConnectionPointTypes.Float, true, NodeMaterialBlockTargets.Fragment);
        this.registerInput("direction", NodeMaterialBlockConnectionPointTypes.Vector2, true, NodeMaterialBlockTargets.Fragment);
        this.registerInput("uv", NodeMaterialBlockConnectionPointTypes.Vector2, true); // need this property and the next one in case there's no PerturbNormal block connected to the main PBR block
        this.registerInput("worldTangent", NodeMaterialBlockConnectionPointTypes.Vector4, true);
        this.registerInput("TBN", NodeMaterialBlockConnectionPointTypes.Object, true, NodeMaterialBlockTargets.VertexAndFragment, new NodeMaterialConnectionPointCustomObject("TBN", this, NodeMaterialConnectionPointDirection.Input, TBNBlock, "TBNBlock"));
        this.registerOutput("anisotropy", NodeMaterialBlockConnectionPointTypes.Object, NodeMaterialBlockTargets.Fragment, new NodeMaterialConnectionPointCustomObject("anisotropy", this, NodeMaterialConnectionPointDirection.Output, AnisotropyBlock, "AnisotropyBlock"));
    }
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state) {
        state._excludeVariableName("anisotropicOut");
        state._excludeVariableName("TBN");
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "AnisotropyBlock";
    }
    /**
     * Gets the intensity input component
     */
    get intensity() {
        return this._inputs[0];
    }
    /**
     * Gets the direction input component
     */
    get direction() {
        return this._inputs[1];
    }
    /**
     * Gets the uv input component
     */
    get uv() {
        return this._inputs[2];
    }
    /**
     * Gets the worldTangent input component
     */
    get worldTangent() {
        return this._inputs[3];
    }
    /**
     * Gets the TBN input component
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get TBN() {
        return this._inputs[4];
    }
    /**
     * Gets the anisotropy object output component
     */
    get anisotropy() {
        return this._outputs[0];
    }
    _generateTBNSpace(state) {
        let code = "";
        const comments = `//${this.name}`;
        const uv = this.uv;
        const worldPosition = this.worldPositionConnectionPoint;
        const worldNormal = this.worldNormalConnectionPoint;
        const worldTangent = this.worldTangent;
        if (!uv.isConnected) {
            // we must set the uv input as optional because we may not end up in this method (in case a PerturbNormal block is linked to the PBR material)
            // in which case uv is not required. But if we do come here, we do need the uv, so we have to raise an error but not with throw, else
            // it will stop the building of the node material and will lead to errors in the editor!
            console.error("You must connect the 'uv' input of the Anisotropy block!");
        }
        state._emitExtension("derivatives", "#extension GL_OES_standard_derivatives : enable");
        const tangentReplaceString = { search: /defined\(TANGENT\)/g, replace: worldTangent.isConnected ? "defined(TANGENT)" : "defined(IGNORE)" };
        const TBN = this.TBN;
        if (TBN.isConnected) {
            state.compilationString += `
            #ifdef TBNBLOCK
            mat3 vTBN = ${TBN.associatedVariableName};
            #endif
            `;
        }
        else if (worldTangent.isConnected) {
            code += `vec3 tbnNormal = normalize(${worldNormal.associatedVariableName}.xyz);\r\n`;
            code += `vec3 tbnTangent = normalize(${worldTangent.associatedVariableName}.xyz);\r\n`;
            code += `vec3 tbnBitangent = cross(tbnNormal, tbnTangent) * ${this._tangentCorrectionFactorName};\r\n`;
            code += `mat3 vTBN = mat3(tbnTangent, tbnBitangent, tbnNormal);\r\n`;
        }
        code += `
            #if defined(${worldTangent.isConnected ? "TANGENT" : "IGNORE"}) && defined(NORMAL)
                mat3 TBN = vTBN;
            #else
                mat3 TBN = cotangent_frame(${worldNormal.associatedVariableName + ".xyz"}, ${"v_" + worldPosition.associatedVariableName + ".xyz"}, ${uv.isConnected ? uv.associatedVariableName : "vec2(0.)"}, vec2(1., 1.));
            #endif\r\n`;
        state._emitFunctionFromInclude("bumpFragmentMainFunctions", comments, {
            replaceStrings: [tangentReplaceString],
        });
        return code;
    }
    /**
     * Gets the main code of the block (fragment side)
     * @param state current state of the node material building
     * @param generateTBNSpace if true, the code needed to create the TBN coordinate space is generated
     * @returns the shader code
     */
    getCode(state, generateTBNSpace = false) {
        let code = "";
        if (generateTBNSpace) {
            code += this._generateTBNSpace(state);
        }
        const intensity = this.intensity.isConnected ? this.intensity.associatedVariableName : "1.0";
        const direction = this.direction.isConnected ? this.direction.associatedVariableName : "vec2(1., 0.)";
        code += `anisotropicOutParams anisotropicOut;
            anisotropicBlock(
                vec3(${direction}, ${intensity}),
            #ifdef ANISOTROPIC_TEXTURE
                vec3(0.),
            #endif
                TBN,
                normalW,
                viewDirectionW,
                anisotropicOut
            );\r\n`;
        return code;
    }
    prepareDefines(mesh, nodeMaterial, defines) {
        super.prepareDefines(mesh, nodeMaterial, defines);
        defines.setValue("ANISOTROPIC", true);
        defines.setValue("ANISOTROPIC_TEXTURE", false, true);
    }
    bind(effect, nodeMaterial, mesh) {
        super.bind(effect, nodeMaterial, mesh);
        if (mesh) {
            effect.setFloat(this._tangentCorrectionFactorName, mesh.getWorldMatrix().determinant() < 0 ? -1 : 1);
        }
    }
    _buildBlock(state) {
        if (state.target === NodeMaterialBlockTargets.Fragment) {
            state.sharedData.blocksWithDefines.push(this);
            state.sharedData.bindableBlocks.push(this);
            this._tangentCorrectionFactorName = state._getFreeDefineName("tangentCorrectionFactor");
            state._emitUniformFromString(this._tangentCorrectionFactorName, "float");
        }
        return this;
    }
}
RegisterClass("BABYLON.AnisotropyBlock", AnisotropyBlock);
//# sourceMappingURL=anisotropyBlock.js.map