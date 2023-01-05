import { __decorate } from "../../../../tslib.es6.js";
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { NodeMaterialConnectionPointDirection } from "../../nodeMaterialBlockConnectionPoint.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
import { InputBlock } from "../Input/inputBlock.js";
import { editableInPropertyPage, PropertyTypeForEdition } from "../../nodeMaterialDecorator.js";
import { NodeMaterialConnectionPointCustomObject } from "../../nodeMaterialConnectionPointCustomObject.js";
import { TBNBlock } from "./TBNBlock.js";
import "../../../../Shaders/ShadersInclude/bumpFragmentMainFunctions.js";
import "../../../../Shaders/ShadersInclude/bumpFragmentFunctions.js";
import "../../../../Shaders/ShadersInclude/bumpFragment.js";
/**
 * Block used to perturb normals based on a normal map
 */
export class PerturbNormalBlock extends NodeMaterialBlock {
    /**
     * Create a new PerturbNormalBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name, NodeMaterialBlockTargets.Fragment);
        this._tangentSpaceParameterName = "";
        this._tangentCorrectionFactorName = "";
        /** Gets or sets a boolean indicating that normal should be inverted on X axis */
        this.invertX = false;
        /** Gets or sets a boolean indicating that normal should be inverted on Y axis */
        this.invertY = false;
        /** Gets or sets a boolean indicating that parallax occlusion should be enabled */
        this.useParallaxOcclusion = false;
        this._isUnique = true;
        // Vertex
        this.registerInput("worldPosition", NodeMaterialBlockConnectionPointTypes.Vector4, false);
        this.registerInput("worldNormal", NodeMaterialBlockConnectionPointTypes.Vector4, false);
        this.registerInput("worldTangent", NodeMaterialBlockConnectionPointTypes.Vector4, true);
        this.registerInput("uv", NodeMaterialBlockConnectionPointTypes.Vector2, false);
        this.registerInput("normalMapColor", NodeMaterialBlockConnectionPointTypes.Color3, false);
        this.registerInput("strength", NodeMaterialBlockConnectionPointTypes.Float, false);
        this.registerInput("viewDirection", NodeMaterialBlockConnectionPointTypes.Vector3, true);
        this.registerInput("parallaxScale", NodeMaterialBlockConnectionPointTypes.Float, true);
        this.registerInput("parallaxHeight", NodeMaterialBlockConnectionPointTypes.Float, true);
        this.registerInput("TBN", NodeMaterialBlockConnectionPointTypes.Object, true, NodeMaterialBlockTargets.VertexAndFragment, new NodeMaterialConnectionPointCustomObject("TBN", this, NodeMaterialConnectionPointDirection.Input, TBNBlock, "TBNBlock"));
        // Fragment
        this.registerOutput("output", NodeMaterialBlockConnectionPointTypes.Vector4);
        this.registerOutput("uvOffset", NodeMaterialBlockConnectionPointTypes.Vector2);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "PerturbNormalBlock";
    }
    /**
     * Gets the world position input component
     */
    get worldPosition() {
        return this._inputs[0];
    }
    /**
     * Gets the world normal input component
     */
    get worldNormal() {
        return this._inputs[1];
    }
    /**
     * Gets the world tangent input component
     */
    get worldTangent() {
        return this._inputs[2];
    }
    /**
     * Gets the uv input component
     */
    get uv() {
        return this._inputs[3];
    }
    /**
     * Gets the normal map color input component
     */
    get normalMapColor() {
        return this._inputs[4];
    }
    /**
     * Gets the strength input component
     */
    get strength() {
        return this._inputs[5];
    }
    /**
     * Gets the view direction input component
     */
    get viewDirection() {
        return this._inputs[6];
    }
    /**
     * Gets the parallax scale input component
     */
    get parallaxScale() {
        return this._inputs[7];
    }
    /**
     * Gets the parallax height input component
     */
    get parallaxHeight() {
        return this._inputs[8];
    }
    /**
     * Gets the TBN input component
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get TBN() {
        return this._inputs[9];
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    /**
     * Gets the uv offset output component
     */
    get uvOffset() {
        return this._outputs[1];
    }
    prepareDefines(mesh, nodeMaterial, defines) {
        const normalSamplerName = this.normalMapColor.connectedPoint._ownerBlock.samplerName;
        const useParallax = this.viewDirection.isConnected && ((this.useParallaxOcclusion && normalSamplerName) || (!this.useParallaxOcclusion && this.parallaxHeight.isConnected));
        defines.setValue("BUMP", true);
        defines.setValue("PARALLAX", useParallax, true);
        defines.setValue("PARALLAXOCCLUSION", this.useParallaxOcclusion, true);
    }
    bind(effect, nodeMaterial, mesh) {
        if (nodeMaterial.getScene()._mirroredCameraPosition) {
            effect.setFloat2(this._tangentSpaceParameterName, this.invertX ? 1.0 : -1.0, this.invertY ? 1.0 : -1.0);
        }
        else {
            effect.setFloat2(this._tangentSpaceParameterName, this.invertX ? -1.0 : 1.0, this.invertY ? -1.0 : 1.0);
        }
        if (mesh) {
            effect.setFloat(this._tangentCorrectionFactorName, mesh.getWorldMatrix().determinant() < 0 ? -1 : 1);
        }
    }
    autoConfigure(material) {
        if (!this.uv.isConnected) {
            let uvInput = material.getInputBlockByPredicate((b) => b.isAttribute && b.name === "uv");
            if (!uvInput) {
                uvInput = new InputBlock("uv");
                uvInput.setAsAttribute();
            }
            uvInput.output.connectTo(this.uv);
        }
        if (!this.strength.isConnected) {
            const strengthInput = new InputBlock("strength");
            strengthInput.value = 1.0;
            strengthInput.output.connectTo(this.strength);
        }
    }
    _buildBlock(state) {
        super._buildBlock(state);
        const comments = `//${this.name}`;
        const uv = this.uv;
        const worldPosition = this.worldPosition;
        const worldNormal = this.worldNormal;
        const worldTangent = this.worldTangent;
        state.sharedData.blocksWithDefines.push(this);
        state.sharedData.bindableBlocks.push(this);
        this._tangentSpaceParameterName = state._getFreeDefineName("tangentSpaceParameter");
        state._emitUniformFromString(this._tangentSpaceParameterName, "vec2");
        this._tangentCorrectionFactorName = state._getFreeDefineName("tangentCorrectionFactor");
        state._emitUniformFromString(this._tangentCorrectionFactorName, "float");
        let normalSamplerName = null;
        if (this.normalMapColor.connectedPoint) {
            normalSamplerName = this.normalMapColor.connectedPoint._ownerBlock.samplerName;
        }
        const useParallax = this.viewDirection.isConnected && ((this.useParallaxOcclusion && normalSamplerName) || (!this.useParallaxOcclusion && this.parallaxHeight.isConnected));
        const replaceForParallaxInfos = !this.parallaxScale.isConnectedToInputBlock
            ? "0.05"
            : this.parallaxScale.connectInputBlock.isConstant
                ? state._emitFloat(this.parallaxScale.connectInputBlock.value)
                : this.parallaxScale.associatedVariableName;
        const replaceForBumpInfos = this.strength.isConnectedToInputBlock && this.strength.connectInputBlock.isConstant
            ? `\r\n#if !defined(NORMALXYSCALE)\r\n1.0/\r\n#endif\r\n${state._emitFloat(this.strength.connectInputBlock.value)}`
            : `\r\n#if !defined(NORMALXYSCALE)\r\n1.0/\r\n#endif\r\n${this.strength.associatedVariableName}`;
        state._emitExtension("derivatives", "#extension GL_OES_standard_derivatives : enable");
        const tangentReplaceString = { search: /defined\(TANGENT\)/g, replace: worldTangent.isConnected ? "defined(TANGENT)" : "defined(IGNORE)" };
        const tbnVarying = { search: /varying mat3 vTBN/g, replace: "" };
        const TBN = this.TBN;
        if (TBN.isConnected) {
            state.compilationString += `
            #ifdef TBNBLOCK
            mat3 vTBN = ${TBN.associatedVariableName};
            #endif
            `;
        }
        else if (worldTangent.isConnected) {
            state.compilationString += `vec3 tbnNormal = normalize(${worldNormal.associatedVariableName}.xyz);\r\n`;
            state.compilationString += `vec3 tbnTangent = normalize(${worldTangent.associatedVariableName}.xyz);\r\n`;
            state.compilationString += `vec3 tbnBitangent = cross(tbnNormal, tbnTangent) * ${this._tangentCorrectionFactorName};\r\n`;
            state.compilationString += `mat3 vTBN = mat3(tbnTangent, tbnBitangent, tbnNormal);\r\n`;
        }
        state._emitFunctionFromInclude("bumpFragmentMainFunctions", comments, {
            replaceStrings: [tangentReplaceString, tbnVarying],
        });
        state._emitFunctionFromInclude("bumpFragmentFunctions", comments, {
            replaceStrings: [
                { search: /#include<samplerFragmentDeclaration>\(_DEFINENAME_,BUMP,_VARYINGNAME_,Bump,_SAMPLERNAME_,bump\)/g, replace: "" },
                { search: /uniform sampler2D bumpSampler;/g, replace: "" },
                {
                    search: /vec2 parallaxOcclusion\(vec3 vViewDirCoT,vec3 vNormalCoT,vec2 texCoord,float parallaxScale\)/g,
                    replace: "#define inline\r\nvec2 parallaxOcclusion(vec3 vViewDirCoT, vec3 vNormalCoT, vec2 texCoord, float parallaxScale, sampler2D bumpSampler)",
                },
                { search: /vec2 parallaxOffset\(vec3 viewDir,float heightScale\)/g, replace: "vec2 parallaxOffset(vec3 viewDir, float heightScale, float height_)" },
                { search: /texture2D\(bumpSampler,vBumpUV\)\.w/g, replace: "height_" },
            ],
        });
        const uvForPerturbNormal = !useParallax || !normalSamplerName ? this.normalMapColor.associatedVariableName : `texture2D(${normalSamplerName}, ${uv.associatedVariableName} + uvOffset).xyz`;
        state.compilationString += this._declareOutput(this.output, state) + " = vec4(0.);\r\n";
        state.compilationString += state._emitCodeFromInclude("bumpFragment", comments, {
            replaceStrings: [
                { search: /perturbNormal\(TBN,texture2D\(bumpSampler,vBumpUV\+uvOffset\).xyz,vBumpInfos.y\)/g, replace: `perturbNormal(TBN, ${uvForPerturbNormal}, vBumpInfos.y)` },
                {
                    search: /parallaxOcclusion\(invTBN\*-viewDirectionW,invTBN\*normalW,vBumpUV,vBumpInfos.z\)/g,
                    replace: `parallaxOcclusion((invTBN * -viewDirectionW), (invTBN * normalW), vBumpUV, vBumpInfos.z, ${useParallax && this.useParallaxOcclusion ? normalSamplerName : "bumpSampler"})`,
                },
                {
                    search: /parallaxOffset\(invTBN\*viewDirectionW,vBumpInfos\.z\)/g,
                    replace: `parallaxOffset(invTBN * viewDirectionW, vBumpInfos.z, ${useParallax ? this.parallaxHeight.associatedVariableName : "0."})`,
                },
                { search: /vTangentSpaceParams/g, replace: this._tangentSpaceParameterName },
                { search: /vBumpInfos.y/g, replace: replaceForBumpInfos },
                { search: /vBumpInfos.z/g, replace: replaceForParallaxInfos },
                { search: /vBumpUV/g, replace: uv.associatedVariableName },
                { search: /vPositionW/g, replace: worldPosition.associatedVariableName + ".xyz" },
                { search: /normalW=/g, replace: this.output.associatedVariableName + ".xyz = " },
                { search: /mat3\(normalMatrix\)\*normalW/g, replace: "mat3(normalMatrix) * " + this.output.associatedVariableName + ".xyz" },
                { search: /normalW/g, replace: worldNormal.associatedVariableName + ".xyz" },
                { search: /viewDirectionW/g, replace: useParallax ? this.viewDirection.associatedVariableName : "vec3(0.)" },
                tangentReplaceString,
            ],
        });
        return this;
    }
    _dumpPropertiesCode() {
        let codeString = super._dumpPropertiesCode() + `${this._codeVariableName}.invertX = ${this.invertX};\r\n`;
        codeString += `${this._codeVariableName}.invertY = ${this.invertY};\r\n`;
        codeString += `${this._codeVariableName}.useParallaxOcclusion = ${this.useParallaxOcclusion};\r\n`;
        return codeString;
    }
    serialize() {
        const serializationObject = super.serialize();
        serializationObject.invertX = this.invertX;
        serializationObject.invertY = this.invertY;
        serializationObject.useParallaxOcclusion = this.useParallaxOcclusion;
        return serializationObject;
    }
    _deserialize(serializationObject, scene, rootUrl) {
        super._deserialize(serializationObject, scene, rootUrl);
        this.invertX = serializationObject.invertX;
        this.invertY = serializationObject.invertY;
        this.useParallaxOcclusion = !!serializationObject.useParallaxOcclusion;
    }
}
__decorate([
    editableInPropertyPage("Invert X axis", PropertyTypeForEdition.Boolean, "PROPERTIES", { notifiers: { update: false } })
], PerturbNormalBlock.prototype, "invertX", void 0);
__decorate([
    editableInPropertyPage("Invert Y axis", PropertyTypeForEdition.Boolean, "PROPERTIES", { notifiers: { update: false } })
], PerturbNormalBlock.prototype, "invertY", void 0);
__decorate([
    editableInPropertyPage("Use parallax occlusion", PropertyTypeForEdition.Boolean)
], PerturbNormalBlock.prototype, "useParallaxOcclusion", void 0);
RegisterClass("BABYLON.PerturbNormalBlock", PerturbNormalBlock);
//# sourceMappingURL=perturbNormalBlock.js.map