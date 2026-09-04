/** This file must only contain pure code and pure imports */
import { WebGPUShaderProcessingContext } from "./webgpuShaderProcessingContext.js";
import { Logger } from "../../Misc/logger.js";
import { WebGPUShaderProcessor } from "./webgpuShaderProcessor.js";
import { RemoveComments, InjectStartingAndEndingCode } from "../../Misc/codeStringParsingTools.js";

const builtInName_frag_depth = "fragmentOutputs.fragDepth";
const leftOverVarName = "uniforms";
const internalsVarName = "internals";
const gpuTextureViewDimensionByWebGPUTextureFunction = {
    texture_1d: "1d" /* WebGPUConstants.TextureViewDimension.E1d */,
    texture_2d: "2d" /* WebGPUConstants.TextureViewDimension.E2d */,
    texture_2d_array: "2d-array" /* WebGPUConstants.TextureViewDimension.E2dArray */,
    texture_3d: "3d" /* WebGPUConstants.TextureViewDimension.E3d */,
    texture_cube: "cube" /* WebGPUConstants.TextureViewDimension.Cube */,
    texture_cube_array: "cube-array" /* WebGPUConstants.TextureViewDimension.CubeArray */,
    texture_multisampled_2d: "2d" /* WebGPUConstants.TextureViewDimension.E2d */,
    texture_depth_2d: "2d" /* WebGPUConstants.TextureViewDimension.E2d */,
    texture_depth_2d_array: "2d-array" /* WebGPUConstants.TextureViewDimension.E2dArray */,
    texture_depth_cube: "cube" /* WebGPUConstants.TextureViewDimension.Cube */,
    texture_depth_cube_array: "cube-array" /* WebGPUConstants.TextureViewDimension.CubeArray */,
    texture_depth_multisampled_2d: "2d" /* WebGPUConstants.TextureViewDimension.E2d */,
    texture_storage_1d: "1d" /* WebGPUConstants.TextureViewDimension.E1d */,
    texture_storage_2d: "2d" /* WebGPUConstants.TextureViewDimension.E2d */,
    texture_storage_2d_array: "2d-array" /* WebGPUConstants.TextureViewDimension.E2dArray */,
    texture_storage_3d: "3d" /* WebGPUConstants.TextureViewDimension.E3d */,
    texture_external: null,
};
/** @internal */
export class WebGPUShaderProcessorWGSL extends WebGPUShaderProcessor {
    constructor() {
        super(...arguments);
        this.shaderLanguage = 1 /* ShaderLanguage.WGSL */;
        this.uniformRegexp = /uniform\s+(\w+)\s*:\s*(.+)\s*;/;
        this.textureRegexp = /var\s+(\w+)\s*:\s*((array<\s*)?(texture_\w+)\s*(<\s*(.+)\s*>)?\s*(,\s*\w+\s*>\s*)?);/;
        this.noPrecision = true;
        this.pureMode = false;
    }
    _getArraySize(name, uniformType, preProcessors) {
        let length = 0;
        const endArray = uniformType.lastIndexOf(">");
        if (uniformType.indexOf("array") >= 0 && endArray > 0) {
            let startArray = endArray;
            while (startArray > 0 && uniformType.charAt(startArray) !== " " && uniformType.charAt(startArray) !== ",") {
                startArray--;
            }
            const lengthInString = uniformType.substring(startArray + 1, endArray);
            length = +lengthInString;
            if (isNaN(length)) {
                length = +preProcessors[lengthInString.trim()];
            }
            while (startArray > 0 && (uniformType.charAt(startArray) === " " || uniformType.charAt(startArray) === ",")) {
                startArray--;
            }
            uniformType = uniformType.substring(uniformType.indexOf("<") + 1, startArray + 1);
        }
        return [name, uniformType, length];
    }
    initializeShaders(processingContext) {
        this._webgpuProcessingContext = processingContext;
        this._attributesInputWGSL = [];
        this._attributesWGSL = [];
        this._attributesConversionCodeWGSL = [];
        this._hasNonFloatAttribute = false;
        this._varyingsWGSL = [];
        this._varyingNamesWGSL = [];
        this._stridedUniformArrays = [];
    }
    preProcessShaderCode(code) {
        // Same check as in webgpuShaderProcessorsGLSL to avoid same ubDelcaration to be injected twice.
        const ubDeclaration = this.pureMode
            ? ""
            : `struct ${WebGPUShaderProcessor.InternalsUBOName} {\n  yFactor_: f32,\n  textureOutputHeight_: f32,\n};\nvar<uniform> ${internalsVarName} : ${WebGPUShaderProcessor.InternalsUBOName};\n`;
        const alreadyInjected = code.indexOf(ubDeclaration) !== -1;
        return alreadyInjected ? code : ubDeclaration + RemoveComments(code);
    }
    varyingCheck(varying) {
        const regex = /(flat|linear|perspective)?\s*(center|centroid|sample)?\s*\bvarying\b/;
        return regex.test(varying);
    }
    varyingProcessor(varying, isFragment, preProcessors) {
        const varyingRegex = /\s*(flat|linear|perspective)?\s*(center|centroid|sample)?\s*varying\s+(?:(?:highp)?|(?:lowp)?)\s*(\S+)\s*:\s*(.+)\s*;/gm;
        const match = varyingRegex.exec(varying);
        if (match !== null) {
            const interpolationType = match[1] ?? "perspective";
            const interpolationSampling = match[2] ?? "center";
            const varyingType = match[4];
            const name = match[3];
            const interpolation = interpolationType === "flat" ? `@interpolate(${interpolationType})` : `@interpolate(${interpolationType}, ${interpolationSampling})`;
            let location;
            if (isFragment) {
                location = this._webgpuProcessingContext.availableVaryings[name];
                if (location === undefined) {
                    Logger.Warn(`Invalid fragment shader: The varying named "${name}" is not declared in the vertex shader! This declaration will be ignored.`);
                }
            }
            else {
                location = this._webgpuProcessingContext.getVaryingNextLocation(varyingType, this._getArraySize(name, varyingType, preProcessors)[2]);
                this._webgpuProcessingContext.availableVaryings[name] = location;
                this._varyingsWGSL.push(`  @location(${location}) ${interpolation} ${name} : ${varyingType},`);
                this._varyingNamesWGSL.push(name);
            }
            varying = "";
        }
        return varying;
    }
    attributeProcessor(attribute, preProcessors) {
        const attribRegex = /\s*attribute\s+(\S+)\s*:\s*(.+)\s*;/gm;
        const match = attribRegex.exec(attribute);
        if (match !== null) {
            const attributeType = match[2];
            const name = match[1];
            const location = this._webgpuProcessingContext.getAttributeNextLocation(attributeType, this._getArraySize(name, attributeType, preProcessors)[2]);
            this._webgpuProcessingContext.availableAttributes[name] = location;
            this._webgpuProcessingContext.orderedAttributes[location] = name;
            const numComponents = this._webgpuProcessingContext.vertexBufferKindToNumberOfComponents[name];
            if (numComponents !== undefined) {
                // Special case for an int/ivecX vertex buffer that is used as a float/vecX attribute in the shader.
                const newType = numComponents < 0 ? (numComponents === -1 ? "i32" : "vec" + -numComponents + "<i32>") : numComponents === 1 ? "u32" : "vec" + numComponents + "<u32>";
                const newName = `_int_${name}_`;
                this._attributesInputWGSL.push(`@location(${location}) ${newName} : ${newType},`);
                this._attributesWGSL.push(`${name} : ${attributeType},`);
                this._attributesConversionCodeWGSL.push(`vertexInputs.${name} = ${attributeType}(vertexInputs_.${newName});`);
                this._hasNonFloatAttribute = true;
            }
            else {
                this._attributesInputWGSL.push(`@location(${location}) ${name} : ${attributeType},`);
                this._attributesWGSL.push(`${name} : ${attributeType},`);
                this._attributesConversionCodeWGSL.push(`vertexInputs.${name} = vertexInputs_.${name};`);
            }
            attribute = "";
        }
        return attribute;
    }
    uniformProcessor(uniform, isFragment, preProcessors) {
        const match = this.uniformRegexp.exec(uniform);
        if (match !== null) {
            const uniformType = match[2];
            const name = match[1];
            this._addUniformToLeftOverUBO(name, uniformType, preProcessors);
            uniform = "";
        }
        return uniform;
    }
    textureProcessor(texture, isFragment, preProcessors) {
        const match = this.textureRegexp.exec(texture);
        if (match !== null) {
            const name = match[1]; // name of the variable
            const type = match[2]; // texture_2d<f32> or array<texture_2d_array<f32>, 5> for eg
            const isArrayOfTexture = !!match[3];
            const textureFunc = match[4]; // texture_2d, texture_depth_2d, etc
            const isStorageTexture = textureFunc.indexOf("storage") > 0;
            const componentType = match[6]; // f32 or i32 or u32 or undefined
            let storageTextureFormat = null;
            let storageTextureAccess = "write-only" /* WebGPUConstants.StorageTextureAccess.WriteOnly */;
            if (isStorageTexture) {
                const commaIndex = componentType.indexOf(",");
                storageTextureFormat = componentType.substring(0, commaIndex).trim();
                const accessMode = componentType.substring(commaIndex + 1).trim();
                switch (accessMode) {
                    case "read":
                        storageTextureAccess = "read-only" /* WebGPUConstants.StorageTextureAccess.ReadOnly */;
                        break;
                    case "read_write":
                        storageTextureAccess = "read-write" /* WebGPUConstants.StorageTextureAccess.ReadWrite */;
                        break;
                    default:
                        storageTextureAccess = "write-only" /* WebGPUConstants.StorageTextureAccess.WriteOnly */;
                        break;
                }
            }
            let arraySize = isArrayOfTexture ? this._getArraySize(name, type, preProcessors)[2] : 0;
            let textureInfo = this._webgpuProcessingContext.availableTextures[name];
            if (!textureInfo) {
                textureInfo = {
                    isTextureArray: arraySize > 0,
                    isStorageTexture,
                    storageTextureAccess: isStorageTexture ? storageTextureAccess : undefined,
                    textures: [],
                    sampleType: "float" /* WebGPUConstants.TextureSampleType.Float */,
                };
                arraySize = arraySize || 1;
                for (let i = 0; i < arraySize; ++i) {
                    textureInfo.textures.push(this._webgpuProcessingContext.getNextFreeUBOBinding());
                }
            }
            else {
                arraySize = textureInfo.textures.length;
            }
            this._webgpuProcessingContext.availableTextures[name] = textureInfo;
            const isDepthTexture = textureFunc.indexOf("depth") > 0;
            const textureDimension = gpuTextureViewDimensionByWebGPUTextureFunction[textureFunc];
            const sampleType = isDepthTexture
                ? "depth" /* WebGPUConstants.TextureSampleType.Depth */
                : componentType === "u32"
                    ? "uint" /* WebGPUConstants.TextureSampleType.Uint */
                    : componentType === "i32"
                        ? "sint" /* WebGPUConstants.TextureSampleType.Sint */
                        : "float" /* WebGPUConstants.TextureSampleType.Float */;
            textureInfo.sampleType = sampleType;
            if (textureDimension === undefined) {
                // eslint-disable-next-line no-throw-literal
                throw `Can't get the texture dimension corresponding to the texture function "${textureFunc}"!`;
            }
            for (let i = 0; i < arraySize; ++i) {
                const { groupIndex, bindingIndex } = textureInfo.textures[i];
                if (i === 0) {
                    texture = `@group(${groupIndex}) @binding(${bindingIndex}) ${texture}`;
                }
                this._addTextureBindingDescription(name, textureInfo, i, textureDimension, storageTextureFormat, !isFragment, storageTextureAccess);
            }
        }
        return texture;
    }
    _convertDefinesToConst(preProcessors) {
        let code = "";
        for (const key in preProcessors) {
            const value = preProcessors[key];
            if (key.startsWith("__")) {
                continue;
            }
            if (!isNaN(parseInt(value)) || !isNaN(parseFloat(value))) {
                code += `const ${key} = ${value};\n`;
            }
            else if (key && value === "") {
                code += `const ${key} = true;\n`;
            }
        }
        return code;
    }
    postProcessor(code, _defines, _isFragment, _processingContext, _parameters, preProcessors, preProcessorsFromCode) {
        // Collect the preprocessor names (coming from a "#define NAME VALUE" declaration) directly defined in the shader code (preProcessorsFromCode) and not defined at the material level (preProcessors).
        // This is because we will have to perform a replace on the code to replace the defines with their values.
        //
        // We don't have to do it for preprocessor names defined at the material level because replacing them by "const NAME = VALUE;" will take care of it (see _convertDefinesToConst()) and is faster than doing a search/replace for each of them.
        //
        // The reason why doing "const NAME = VALUE;" doesn't work for preprocessor names defined in the code is that VALUE can be any string and not only numbers or booleans.
        // So, if we have this code:
        //
        //      #define vDiffuseUV vMainUV
        //      textureSample(..., fragmentInputs.vDiffuseUV)
        ///
        // only a search/replace will work, 'const vDiffuseUV = "vMainUV";' will not work
        //
        // Note that the search/replace text processing will also apply to the "#define NAME VALUE" definition itself, so it will become "#define VALUE VALUE"
        // It's not a problem, though, because all #define XXX will be commented out in the final code.
        const defineList = [];
        for (const key in preProcessorsFromCode) {
            const value = preProcessorsFromCode[key];
            // Excludes the defines that are booleans (note that there aren't "false" booleans: we simply don't add them in the preProcessorsFromCode object).
            // That's because we need (at least some of) them to stay untouched, like #define DISABLE_UNIFORMTY_ANALYSIS or #define CUSTOM_VERTEX_BEGIN (else, they would be replaced with "#define true" after the search/replace processing)
            if (value !== "true") {
                defineList.push(key);
            }
        }
        // We must sort the define names by length to avoid replacing a define with a longer name (ex: #define A 1 and #define AB 2, if we replace A with 1, we will have #define 1B 2)
        // So, we start by longest names and we finish with the shortest ones.
        defineList.sort((a, b) => (a.length - b.length > 0 ? -1 : a.length === b.length ? 0 : 1));
        for (const name of defineList) {
            // Let's retrieve the value of the define from the code
            // Note that we can't use the value from preProcessorsFromCode[name] because this value could have been changed from a previous replace
            // For example:
            //      #define IOR 1.333
            //      #define ETA 1.0/IOR
            //
            // After IOR replacement is performed, we will have:
            //      #define 1.333 1.333
            //      #define ETA 1.0/1.333
            //
            // but preProcessorsFromCode["ETA"] is still "1.0/IOR" and not "1.0/1.333", so we must retrieve the value for ETA from the current code
            const i0 = code.indexOf("#define " + name);
            let i1 = code.indexOf("\n", i0);
            if (i1 === -1) {
                i1 = code.length;
            }
            const value = code.substring(i0 + 8 + name.length + 1, i1);
            code = code.replace(new RegExp(name, "g"), value);
        }
        code = this._convertDefinesToConst(preProcessors) + code;
        if ("VERTEXOUTPUT_INVARIANT" in preProcessors) {
            code = "#define VERTEXOUTPUT_INVARIANT\n" + code;
        }
        return code;
    }
    finalizeShaders(vertexCode, fragmentCode) {
        const enabledExtensions = [];
        const fragCoordCode = fragmentCode.indexOf("fragmentInputs.position") >= 0 && !this.pureMode
            ? `
            if (internals.yFactor_ == 1.) {
                fragmentInputs.position.y = internals.textureOutputHeight_ - fragmentInputs.position.y;
            }
        `
            : "";
        // Add the group/binding info to the sampler declaration (var xxx: sampler|sampler_comparison)
        vertexCode = this._processSamplers(vertexCode, true);
        fragmentCode = this._processSamplers(fragmentCode, false);
        // Add the group/binding info to the uniform/storage buffer declarations (var<uniform> XXX:YYY or var<storage(,read_write|read)> XXX:YYY)
        vertexCode = this._processCustomBuffers(vertexCode, true);
        fragmentCode = this._processCustomBuffers(fragmentCode, false);
        // Builds the leftover UBOs.
        const leftOverUBO = this._buildLeftOverUBO();
        vertexCode = leftOverUBO + vertexCode;
        fragmentCode = leftOverUBO + fragmentCode;
        // Vertex code
        vertexCode = vertexCode.replace(/#define /g, "//#define ");
        vertexCode = this._processStridedUniformArrays(vertexCode);
        let vertexInputs = "struct VertexInputs {\n  @builtin(vertex_index) vertexIndex : u32,\n  @builtin(instance_index) instanceIndex : u32,\n";
        if (this._attributesInputWGSL.length > 0) {
            vertexInputs += this._attributesInputWGSL.join("\n");
        }
        vertexInputs += "\n};\nvar<private> vertexInputs" + (this._hasNonFloatAttribute ? "_" : "") + " : VertexInputs;\n";
        if (this._hasNonFloatAttribute) {
            vertexInputs += "struct VertexInputs_ {\n  vertexIndex : u32, instanceIndex : u32,\n";
            vertexInputs += this._attributesWGSL.join("\n");
            vertexInputs += "\n};\nvar<private> vertexInputs : VertexInputs_;\n";
        }
        let vertexOutputs = "struct FragmentInputs {\n  @builtin(position)" + (vertexCode.indexOf("#define VERTEXOUTPUT_INVARIANT") >= 0 ? " @invariant" : "") + " position : vec4<f32>,\n";
        if (this._varyingsWGSL.length > 0) {
            vertexOutputs += this._varyingsWGSL.join("\n");
        }
        vertexOutputs += "\n};\nvar<private> vertexOutputs : FragmentInputs;\n";
        vertexCode = vertexInputs + vertexOutputs + vertexCode;
        let vertexMainStartingCode = `\n  vertexInputs${this._hasNonFloatAttribute ? "_" : ""} = input;\n`;
        if (this._hasNonFloatAttribute) {
            vertexMainStartingCode += "vertexInputs.vertexIndex = vertexInputs_.vertexIndex;\nvertexInputs.instanceIndex = vertexInputs_.instanceIndex;\n";
            vertexMainStartingCode += this._attributesConversionCodeWGSL.join("\n");
            vertexMainStartingCode += "\n";
        }
        const vertexMainEndingCode = this.pureMode
            ? `  return vertexOutputs;`
            : `  vertexOutputs.position.y = vertexOutputs.position.y * internals.yFactor_;\n  return vertexOutputs;`;
        let needDiagnosticOff = vertexCode.indexOf(`#define DISABLE_UNIFORMITY_ANALYSIS`) !== -1;
        vertexCode =
            (needDiagnosticOff ? "diagnostic(off, derivative_uniformity);\n" : "") +
                "diagnostic(off, chromium.unreachable_code);\n" +
                InjectStartingAndEndingCode(vertexCode, "fn main", vertexMainStartingCode, vertexMainEndingCode);
        // fragment code
        fragmentCode = fragmentCode.replace(/#define /g, "//#define ");
        fragmentCode = this._processStridedUniformArrays(fragmentCode);
        if (!this.pureMode) {
            fragmentCode = fragmentCode.replace(/dpdy/g, "(-internals.yFactor_)*dpdy"); // will also handle dpdyCoarse and dpdyFine
        }
        let fragmentInputs = "struct FragmentInputs {\n  @builtin(position) position : vec4<f32>,\n  @builtin(front_facing) frontFacing : bool,\n";
        if (this._varyingsWGSL.length > 0) {
            fragmentInputs += this._varyingsWGSL.join("\n");
        }
        fragmentInputs += "\n};\nvar<private> fragmentInputs : FragmentInputs;\n";
        let fragmentOutputs = "struct FragmentOutputs {\n";
        // A fragData location is float (vec4<f32>) unless the shader writes an integer vector to it — a shader
        // rendering into an integer color target (e.g. RGBA_INTEGER u32) must declare a matching integer output.
        // Detect the integer type from the assignment's right-hand side: an inline vec4<u32>/vec4<i32> constructor,
        // or a plain identifier whose declaration is an integer vec4. Defaults to vec4<f32> (backward compatible).
        // LIMITATION: this is a lightweight regex scan, not a type checker. Any other RHS shape — a function call, a
        // `select(...)`, or a conditional expression that yields an integer vec4 — is NOT recognized and defaults to
        // vec4<f32>; that surfaces later as a WGSL "cannot assign vec4<u32> to vec4<f32>" compile error rather than
        // here. Shaders that render to integer targets should assign an inline vec4<u32>/vec4<i32> (constructor or a
        // directly-typed local) so the output type is detected. Extend the patterns below if new forms are needed.
        // Scan a comment-stripped copy so a commented-out integer write can't flip a real float output.
        const scanCode = fragmentCode.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, " ");
        // fragData writes are in `fn main`; scope the RHS-identifier declaration lookup there so a same-named integer
        // local in a helper function can't win. Match the entry point exactly (not a substring, which `fn mainHelper`
        // would satisfy); a no-match (-1) bails to the vec4<f32> default rather than scanning the whole source.
        const mainBodyStart = scanCode.search(/\bfn\s+main\s*\(/);
        const detectIntVec = (expr) => {
            if (/^\s*(vec4<u32>|vec4u\s*\()/.test(expr)) {
                return "vec4<u32>";
            }
            if (/^\s*(vec4<i32>|vec4i\s*\()/.test(expr)) {
                return "vec4<i32>";
            }
            return null;
        };
        const fragDataOutputType = (index) => {
            const assign = scanCode.match(new RegExp(`fragmentOutputs\\.fragData${index}\\s*=\\s*([^;]+);`));
            if (!assign) {
                return "vec4<f32>";
            }
            const rhs = assign[1].trim();
            const direct = detectIntVec(rhs);
            if (direct) {
                return direct;
            }
            // Bare identifier RHS (e.g. `fragData0 = computedUintColor;`): resolve its type from a `var/let NAME :
            // vec4<u32>` or `var/let NAME = vec4<u32>(...)` declaration, searched only in main up to this write.
            const id = rhs.match(/^([A-Za-z_]\w*)$/);
            if (id && mainBodyStart >= 0) {
                const declScope = scanCode.slice(mainBodyStart, assign.index ?? scanCode.length);
                const typed = declScope.match(new RegExp(`(?:var|let)\\s+${id[1]}\\s*:\\s*(vec4<u32>|vec4<i32>)`));
                if (typed) {
                    return typed[1];
                }
                const inited = declScope.match(new RegExp(`(?:var|let)\\s+${id[1]}\\s*=\\s*([^;]+);`));
                if (inited) {
                    const t = detectIntVec(inited[1].trim());
                    if (t) {
                        return t;
                    }
                }
            }
            return "vec4<f32>";
        };
        // Adding fragData output locations
        const regexRoot = "fragmentOutputs\\.fragData";
        let match = scanCode.match(new RegExp(regexRoot + "0", "g"));
        let indexLocation = 0;
        if (match) {
            fragmentOutputs += ` @location(${indexLocation}) fragData0 : ${fragDataOutputType(0)},\n`;
            indexLocation++;
            for (let index = 1; index < 8; index++) {
                match = scanCode.match(new RegExp(regexRoot + index, "g"));
                if (match) {
                    fragmentOutputs += ` @location(${indexLocation}) fragData${indexLocation} : ${fragDataOutputType(index)},\n`;
                    indexLocation++;
                }
            }
            if (fragmentCode.indexOf("MRT_AND_COLOR") !== -1) {
                fragmentOutputs += `  @location(${indexLocation}) color : vec4<f32>,\n`;
                indexLocation++;
            }
        }
        // Adding fragData output locations
        const regex = /oitDepthSampler/;
        match = fragmentCode.match(regex);
        if (match) {
            fragmentOutputs += ` @location(${indexLocation++}) depth : vec2<f32>,\n`;
            fragmentOutputs += ` @location(${indexLocation++}) frontColor : vec4<f32>,\n`;
            fragmentOutputs += ` @location(${indexLocation++}) backColor : vec4<f32>,\n`;
        }
        if (indexLocation === 0) {
            const useDualSourceBlending = fragmentCode.indexOf("DUAL_SOURCE_BLENDING") !== -1;
            if (useDualSourceBlending) {
                enabledExtensions.push("dual_source_blending");
                fragmentOutputs += "  @location(0) @blend_src(0) color : vec4<f32>,\n";
                fragmentOutputs += "  @location(0) @blend_src(1) color2 : vec4<f32>,\n";
            }
            else {
                fragmentOutputs += "  @location(0) color : vec4<f32>,\n";
            }
            // indexLocation++; // if you need this variable after this block, uncomment this
        }
        // FragDepth
        let hasFragDepth = false;
        let idx = 0;
        while (!hasFragDepth) {
            idx = fragmentCode.indexOf(builtInName_frag_depth, idx);
            if (idx < 0) {
                break;
            }
            const saveIndex = idx;
            hasFragDepth = true;
            while (idx > 1 && fragmentCode.charAt(idx) !== "\n") {
                if (fragmentCode.charAt(idx) === "/" && fragmentCode.charAt(idx - 1) === "/") {
                    hasFragDepth = false;
                    break;
                }
                idx--;
            }
            idx = saveIndex + builtInName_frag_depth.length;
        }
        if (hasFragDepth) {
            fragmentOutputs += "  @builtin(frag_depth) fragDepth: f32,\n";
        }
        fragmentOutputs += "};\nvar<private> fragmentOutputs : FragmentOutputs;\n";
        fragmentCode = fragmentInputs + fragmentOutputs + fragmentCode;
        const fragmentStartingCode = "  fragmentInputs = input;\n  " + fragCoordCode;
        const fragmentEndingCode = "  return fragmentOutputs;";
        needDiagnosticOff = fragmentCode.indexOf(`#define DISABLE_UNIFORMITY_ANALYSIS`) !== -1;
        if (enabledExtensions.length > 0) {
            fragmentCode = "enable " + enabledExtensions.join(";\nenable ") + ";\n" + fragmentCode;
        }
        fragmentCode =
            (needDiagnosticOff ? "diagnostic(off, derivative_uniformity);\n" : "") +
                "diagnostic(off, chromium.unreachable_code);\n" +
                InjectStartingAndEndingCode(fragmentCode, "fn main", fragmentStartingCode, fragmentEndingCode);
        this._collectBindingNames();
        this._preCreateBindGroupEntries();
        this._webgpuProcessingContext.vertexBufferKindToNumberOfComponents = {};
        return { vertexCode, fragmentCode };
    }
    _generateLeftOverUBOCode(name, uniformBufferDescription) {
        let stridedArrays = "";
        let ubo = `struct ${name} {\n`;
        for (const leftOverUniform of this._webgpuProcessingContext.leftOverUniforms) {
            const type = leftOverUniform.type.replace(/^(.*?)(<.*>)?$/, "$1");
            const size = WebGPUShaderProcessor.UniformSizes[type];
            if (leftOverUniform.length > 0) {
                if (size <= 2) {
                    const stridedArrayType = `${name}_${this._stridedUniformArrays.length}_strided_arr`;
                    stridedArrays += `struct ${stridedArrayType} {
                        @size(16)
                        el: ${type},
                    }`;
                    this._stridedUniformArrays.push(leftOverUniform.name);
                    ubo += ` @align(16) ${leftOverUniform.name} : array<${stridedArrayType}, ${leftOverUniform.length}>,\n`;
                }
                else {
                    ubo += ` ${leftOverUniform.name} : array<${leftOverUniform.type}, ${leftOverUniform.length}>,\n`;
                }
            }
            else {
                ubo += `  ${leftOverUniform.name} : ${leftOverUniform.type},\n`;
            }
        }
        ubo += "};\n";
        ubo = `${stridedArrays}\n${ubo}`;
        ubo += `@group(${uniformBufferDescription.binding.groupIndex}) @binding(${uniformBufferDescription.binding.bindingIndex}) var<uniform> ${leftOverVarName} : ${name};\n`;
        return ubo;
    }
    _processSamplers(code, isVertex) {
        const samplerRegexp = /var\s+(\w+Sampler)\s*:\s*(sampler|sampler_comparison)\s*;/gm;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const match = samplerRegexp.exec(code);
            if (match === null) {
                break;
            }
            const name = match[1]; // name of the variable
            const samplerType = match[2]; // sampler or sampler_comparison
            const suffixLessLength = name.length - `Sampler`.length;
            const textureName = name.lastIndexOf(`Sampler`) === suffixLessLength ? name.substring(0, suffixLessLength) : null;
            const samplerBindingType = samplerType === "sampler_comparison" ? "comparison" /* WebGPUConstants.SamplerBindingType.Comparison */ : "filtering" /* WebGPUConstants.SamplerBindingType.Filtering */;
            if (textureName) {
                const textureInfo = this._webgpuProcessingContext.availableTextures[textureName];
                if (textureInfo) {
                    textureInfo.autoBindSampler = true;
                }
            }
            let samplerInfo = this._webgpuProcessingContext.availableSamplers[name];
            if (!samplerInfo) {
                samplerInfo = {
                    binding: this._webgpuProcessingContext.getNextFreeUBOBinding(),
                    type: samplerBindingType,
                };
                this._webgpuProcessingContext.availableSamplers[name] = samplerInfo;
            }
            this._addSamplerBindingDescription(name, samplerInfo, isVertex);
            const part1 = code.substring(0, match.index);
            const insertPart = `@group(${samplerInfo.binding.groupIndex}) @binding(${samplerInfo.binding.bindingIndex}) `;
            const part2 = code.substring(match.index);
            code = part1 + insertPart + part2;
            samplerRegexp.lastIndex += insertPart.length;
        }
        return code;
    }
    _processCustomBuffers(code, isVertex) {
        const instantiateBufferRegexp = /var<\s*(uniform|storage)\s*(,\s*(read|read_write)\s*)?>\s+(\S+)\s*:\s*(\S+)\s*;/gm;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const match = instantiateBufferRegexp.exec(code);
            if (match === null) {
                break;
            }
            const type = match[1];
            const decoration = match[3];
            let name = match[4];
            const structName = match[5];
            let bufferInfo = this._webgpuProcessingContext.availableBuffers[name];
            if (!bufferInfo) {
                const knownUBO = type === "uniform" ? WebGPUShaderProcessingContext.KnownUBOs[structName] : null;
                let binding;
                if (knownUBO) {
                    name = structName;
                    binding = knownUBO.binding;
                    if (binding.groupIndex === -1) {
                        binding = this._webgpuProcessingContext.availableBuffers[name]?.binding;
                        if (!binding) {
                            binding = this._webgpuProcessingContext.getNextFreeUBOBinding();
                        }
                    }
                }
                else {
                    binding = this._webgpuProcessingContext.getNextFreeUBOBinding();
                }
                bufferInfo = { binding };
                this._webgpuProcessingContext.availableBuffers[name] = bufferInfo;
            }
            this._addBufferBindingDescription(name, this._webgpuProcessingContext.availableBuffers[name], decoration === "read_write"
                ? "storage" /* WebGPUConstants.BufferBindingType.Storage */
                : type === "storage"
                    ? "read-only-storage" /* WebGPUConstants.BufferBindingType.ReadOnlyStorage */
                    : "uniform" /* WebGPUConstants.BufferBindingType.Uniform */, isVertex);
            const groupIndex = bufferInfo.binding.groupIndex;
            const bindingIndex = bufferInfo.binding.bindingIndex;
            const part1 = code.substring(0, match.index);
            const insertPart = `@group(${groupIndex}) @binding(${bindingIndex}) `;
            const part2 = code.substring(match.index);
            code = part1 + insertPart + part2;
            instantiateBufferRegexp.lastIndex += insertPart.length;
        }
        return code;
    }
    _processStridedUniformArrays(code) {
        for (const uniformArrayName of this._stridedUniformArrays) {
            code = code.replace(new RegExp(`${uniformArrayName}\\s*\\[(.*?)\\]`, "g"), `${uniformArrayName}[$1].el`);
        }
        return code;
    }
}
//# sourceMappingURL=webgpuShaderProcessorsWGSL.pure.js.map