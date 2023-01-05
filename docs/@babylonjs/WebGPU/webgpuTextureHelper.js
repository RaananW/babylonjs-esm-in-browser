/* eslint-disable @typescript-eslint/naming-convention */
// License for the mipmap generation code:
//
// Copyright 2020 Brandon Jones
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
import * as WebGPUConstants from "./webgpuConstants.js";
import { Scalar } from "../../Maths/math.scalar.js";

import { InternalTextureSource } from "../../Materials/Textures/internalTexture.js";
import { WebGPUHardwareTexture } from "./webgpuHardwareTexture.js";
// TODO WEBGPU improve mipmap generation by using compute shaders
// TODO WEBGPU use WGSL instead of GLSL
const mipmapVertexSource = `
    const vec2 pos[4] = vec2[4](vec2(-1.0f, 1.0f), vec2(1.0f, 1.0f), vec2(-1.0f, -1.0f), vec2(1.0f, -1.0f));
    const vec2 tex[4] = vec2[4](vec2(0.0f, 0.0f), vec2(1.0f, 0.0f), vec2(0.0f, 1.0f), vec2(1.0f, 1.0f));

    layout(location = 0) out vec2 vTex;

    void main() {
        vTex = tex[gl_VertexIndex];
        gl_Position = vec4(pos[gl_VertexIndex], 0.0, 1.0);
    }
    `;
const mipmapFragmentSource = `
    layout(set = 0, binding = 0) uniform sampler imgSampler;
    layout(set = 0, binding = 1) uniform texture2D img;

    layout(location = 0) in vec2 vTex;
    layout(location = 0) out vec4 outColor;

    void main() {
        outColor = texture(sampler2D(img, imgSampler), vTex);
    }
    `;
const invertYPreMultiplyAlphaVertexSource = `
    #extension GL_EXT_samplerless_texture_functions : enable

    const vec2 pos[4] = vec2[4](vec2(-1.0f, 1.0f), vec2(1.0f, 1.0f), vec2(-1.0f, -1.0f), vec2(1.0f, -1.0f));
    const vec2 tex[4] = vec2[4](vec2(0.0f, 0.0f), vec2(1.0f, 0.0f), vec2(0.0f, 1.0f), vec2(1.0f, 1.0f));

    layout(set = 0, binding = 0) uniform texture2D img;

    #ifdef INVERTY
        layout(location = 0) out flat ivec2 vTextureSize;
    #endif

    void main() {
        #ifdef INVERTY
            vTextureSize = textureSize(img, 0);
        #endif
        gl_Position = vec4(pos[gl_VertexIndex], 0.0, 1.0);
    }
    `;
const invertYPreMultiplyAlphaFragmentSource = `
    #extension GL_EXT_samplerless_texture_functions : enable

    layout(set = 0, binding = 0) uniform texture2D img;

    #ifdef INVERTY
        layout(location = 0) in flat ivec2 vTextureSize;
    #endif
    layout(location = 0) out vec4 outColor;

    void main() {
    #ifdef INVERTY
        vec4 color = texelFetch(img, ivec2(gl_FragCoord.x, vTextureSize.y - gl_FragCoord.y), 0);
    #else
        vec4 color = texelFetch(img, ivec2(gl_FragCoord.xy), 0);
    #endif
    #ifdef PREMULTIPLYALPHA
        color.rgb *= color.a;
    #endif
        outColor = color;
    }
    `;
const invertYPreMultiplyAlphaWithOfstVertexSource = invertYPreMultiplyAlphaVertexSource;
const invertYPreMultiplyAlphaWithOfstFragmentSource = `
    #extension GL_EXT_samplerless_texture_functions : enable

    layout(set = 0, binding = 0) uniform texture2D img;
    layout(set = 0, binding = 1) uniform Params {
        float ofstX;
        float ofstY;
        float width;
        float height;
    };

    #ifdef INVERTY
        layout(location = 0) in flat ivec2 vTextureSize;
    #endif
    layout(location = 0) out vec4 outColor;

    void main() {
        if (gl_FragCoord.x < ofstX || gl_FragCoord.x >= ofstX + width) {
            discard;
        }
        if (gl_FragCoord.y < ofstY || gl_FragCoord.y >= ofstY + height) {
            discard;
        }
    #ifdef INVERTY
        vec4 color = texelFetch(img, ivec2(gl_FragCoord.x, ofstY + height - (gl_FragCoord.y - ofstY)), 0);
    #else
        vec4 color = texelFetch(img, ivec2(gl_FragCoord.xy), 0);
    #endif
    #ifdef PREMULTIPLYALPHA
        color.rgb *= color.a;
    #endif
        outColor = color;
    }
    `;
const clearVertexSource = `
    const vec2 pos[4] = vec2[4](vec2(-1.0f, 1.0f), vec2(1.0f, 1.0f), vec2(-1.0f, -1.0f), vec2(1.0f, -1.0f));

    void main() {
        gl_Position = vec4(pos[gl_VertexIndex], 0.0, 1.0);
    }
    `;
const clearFragmentSource = `
    layout(set = 0, binding = 0) uniform Uniforms {
        uniform vec4 color;
    };

    layout(location = 0) out vec4 outColor;

    void main() {
        outColor = color;
    }
    `;
const copyVideoToTextureVertexSource = `
    struct VertexOutput {
        @builtin(position) Position : vec4<f32>,
        @location(0) fragUV : vec2<f32>
    }
  
    @vertex
    fn main(
        @builtin(vertex_index) VertexIndex : u32
    ) -> VertexOutput {
        var pos = array<vec2<f32>, 4>(
            vec2(-1.0,  1.0),
            vec2( 1.0,  1.0),
            vec2(-1.0, -1.0),
            vec2( 1.0, -1.0)
        );
        var tex = array<vec2<f32>, 4>(
            vec2(0.0, 0.0),
            vec2(1.0, 0.0),
            vec2(0.0, 1.0),
            vec2(1.0, 1.0)
        );

        var output: VertexOutput;

        output.Position = vec4<f32>(pos[VertexIndex], 0.0, 1.0);
        output.fragUV = tex[VertexIndex];

        return output;
    }
    `;
const copyVideoToTextureFragmentSource = `
    @group(0) @binding(0) var videoSampler: sampler;
    @group(0) @binding(1) var videoTexture: texture_external;

    @fragment
    fn main(
        @location(0) fragUV: vec2<f32>
    ) -> @location(0) vec4<f32> {
        return textureSampleBaseClampToEdge(videoTexture, videoSampler, fragUV);
    }
    `;
const copyVideoToTextureInvertYFragmentSource = `
    @group(0) @binding(0) var videoSampler: sampler;
    @group(0) @binding(1) var videoTexture: texture_external;

    @fragment
    fn main(
        @location(0) fragUV: vec2<f32>
    ) -> @location(0) vec4<f32> {
        return textureSampleBaseClampToEdge(videoTexture, videoSampler, vec2<f32>(fragUV.x, 1.0 - fragUV.y));
    }
    `;
var PipelineType;
(function (PipelineType) {
    PipelineType[PipelineType["MipMap"] = 0] = "MipMap";
    PipelineType[PipelineType["InvertYPremultiplyAlpha"] = 1] = "InvertYPremultiplyAlpha";
    PipelineType[PipelineType["Clear"] = 2] = "Clear";
    PipelineType[PipelineType["InvertYPremultiplyAlphaWithOfst"] = 3] = "InvertYPremultiplyAlphaWithOfst";
})(PipelineType || (PipelineType = {}));
var VideoPipelineType;
(function (VideoPipelineType) {
    VideoPipelineType[VideoPipelineType["DontInvertY"] = 0] = "DontInvertY";
    VideoPipelineType[VideoPipelineType["InvertY"] = 1] = "InvertY";
})(VideoPipelineType || (VideoPipelineType = {}));
const shadersForPipelineType = [
    { vertex: mipmapVertexSource, fragment: mipmapFragmentSource },
    { vertex: invertYPreMultiplyAlphaVertexSource, fragment: invertYPreMultiplyAlphaFragmentSource },
    { vertex: clearVertexSource, fragment: clearFragmentSource },
    { vertex: invertYPreMultiplyAlphaWithOfstVertexSource, fragment: invertYPreMultiplyAlphaWithOfstFragmentSource },
];
/**
 * Map a (renderable) texture format (GPUTextureFormat) to an index for fast lookup (in caches for eg)
 */
export const renderableTextureFormatToIndex = {
    "": 0,
    r8unorm: 1,
    r8uint: 2,
    r8sint: 3,
    r16uint: 4,
    r16sint: 5,
    r16float: 6,
    rg8unorm: 7,
    rg8uint: 8,
    rg8sint: 9,
    r32uint: 10,
    r32sint: 11,
    r32float: 12,
    rg16uint: 13,
    rg16sint: 14,
    rg16float: 15,
    rgba8unorm: 16,
    "rgba8unorm-srgb": 17,
    rgba8uint: 18,
    rgba8sint: 19,
    bgra8unorm: 20,
    "bgra8unorm-srgb": 21,
    rgb10a2unorm: 22,
    rg32uint: 23,
    rg32sint: 24,
    rg32float: 25,
    rgba16uint: 26,
    rgba16sint: 27,
    rgba16float: 28,
    rgba32uint: 29,
    rgba32sint: 30,
    rgba32float: 31,
    stencil8: 32,
    depth16unorm: 33,
    depth24plus: 34,
    "depth24plus-stencil8": 35,
    depth32float: 36,
    "depth24unorm-stencil8": 37,
    "depth32float-stencil8": 38,
};
/** @internal */
export class WebGPUTextureHelper {
    //------------------------------------------------------------------------------
    //                         Initialization / Helpers
    //------------------------------------------------------------------------------
    constructor(device, glslang, tintWASM, bufferManager) {
        this._pipelines = {};
        this._compiledShaders = [];
        this._videoPipelines = {};
        this._videoCompiledShaders = [];
        this._deferredReleaseTextures = [];
        this._device = device;
        this._glslang = glslang;
        this._tintWASM = tintWASM;
        this._bufferManager = bufferManager;
        this._mipmapSampler = device.createSampler({ minFilter: WebGPUConstants.FilterMode.Linear });
        this._videoSampler = device.createSampler({ minFilter: WebGPUConstants.FilterMode.Linear });
        this._ubCopyWithOfst = this._bufferManager.createBuffer(4 * 4, WebGPUConstants.BufferUsage.Uniform | WebGPUConstants.BufferUsage.CopyDst).underlyingResource;
        this._getPipeline(WebGPUConstants.TextureFormat.RGBA8Unorm);
        this._getVideoPipeline(WebGPUConstants.TextureFormat.RGBA8Unorm);
    }
    static ComputeNumMipmapLevels(width, height) {
        return Scalar.ILog2(Math.max(width, height)) + 1;
    }
    _getPipeline(format, type = PipelineType.MipMap, params) {
        const index = type === PipelineType.MipMap
            ? 1 << 0
            : type === PipelineType.InvertYPremultiplyAlpha
                ? ((params.invertY ? 1 : 0) << 1) + ((params.premultiplyAlpha ? 1 : 0) << 2)
                : type === PipelineType.Clear
                    ? 1 << 3
                    : type === PipelineType.InvertYPremultiplyAlphaWithOfst
                        ? ((params.invertY ? 1 : 0) << 4) + ((params.premultiplyAlpha ? 1 : 0) << 5)
                        : 0;
        if (!this._pipelines[format]) {
            this._pipelines[format] = [];
        }
        let pipelineAndBGL = this._pipelines[format][index];
        if (!pipelineAndBGL) {
            let defines = "#version 450\r\n";
            if (type === PipelineType.InvertYPremultiplyAlpha || type === PipelineType.InvertYPremultiplyAlphaWithOfst) {
                if (params.invertY) {
                    defines += "#define INVERTY\r\n";
                }
                if (params.premultiplyAlpha) {
                    defines += "#define PREMULTIPLYALPHA\r\n";
                }
            }
            let modules = this._compiledShaders[index];
            if (!modules) {
                let vertexCode = this._glslang.compileGLSL(defines + shadersForPipelineType[type].vertex, "vertex");
                let fragmentCode = this._glslang.compileGLSL(defines + shadersForPipelineType[type].fragment, "fragment");
                if (this._tintWASM) {
                    vertexCode = this._tintWASM.convertSpirV2WGSL(vertexCode);
                    fragmentCode = this._tintWASM.convertSpirV2WGSL(fragmentCode);
                }
                const vertexModule = this._device.createShaderModule({
                    code: vertexCode,
                });
                const fragmentModule = this._device.createShaderModule({
                    code: fragmentCode,
                });
                modules = this._compiledShaders[index] = [vertexModule, fragmentModule];
            }
            const pipeline = this._device.createRenderPipeline({
                layout: WebGPUConstants.AutoLayoutMode.Auto,
                vertex: {
                    module: modules[0],
                    entryPoint: "main",
                },
                fragment: {
                    module: modules[1],
                    entryPoint: "main",
                    targets: [
                        {
                            format,
                        },
                    ],
                },
                primitive: {
                    topology: WebGPUConstants.PrimitiveTopology.TriangleStrip,
                    stripIndexFormat: WebGPUConstants.IndexFormat.Uint16,
                },
            });
            pipelineAndBGL = this._pipelines[format][index] = [pipeline, pipeline.getBindGroupLayout(0)];
        }
        return pipelineAndBGL;
    }
    _getVideoPipeline(format, type = VideoPipelineType.DontInvertY) {
        const index = type === VideoPipelineType.InvertY ? 1 << 0 : 0;
        if (!this._videoPipelines[format]) {
            this._videoPipelines[format] = [];
        }
        let pipelineAndBGL = this._videoPipelines[format][index];
        if (!pipelineAndBGL) {
            let modules = this._videoCompiledShaders[index];
            if (!modules) {
                const vertexModule = this._device.createShaderModule({
                    code: copyVideoToTextureVertexSource,
                });
                const fragmentModule = this._device.createShaderModule({
                    code: index === 0 ? copyVideoToTextureFragmentSource : copyVideoToTextureInvertYFragmentSource,
                });
                modules = this._videoCompiledShaders[index] = [vertexModule, fragmentModule];
            }
            const pipeline = this._device.createRenderPipeline({
                label: `CopyVideoToTexture_${format}_${index === 0 ? "DontInvertY" : "InvertY"}`,
                layout: WebGPUConstants.AutoLayoutMode.Auto,
                vertex: {
                    module: modules[0],
                    entryPoint: "main",
                },
                fragment: {
                    module: modules[1],
                    entryPoint: "main",
                    targets: [
                        {
                            format,
                        },
                    ],
                },
                primitive: {
                    topology: WebGPUConstants.PrimitiveTopology.TriangleStrip,
                    stripIndexFormat: WebGPUConstants.IndexFormat.Uint16,
                },
            });
            pipelineAndBGL = this._videoPipelines[format][index] = [pipeline, pipeline.getBindGroupLayout(0)];
        }
        return pipelineAndBGL;
    }
    static _GetTextureTypeFromFormat(format) {
        switch (format) {
            // One Component = 8 bits
            case WebGPUConstants.TextureFormat.R8Unorm:
            case WebGPUConstants.TextureFormat.R8Snorm:
            case WebGPUConstants.TextureFormat.R8Uint:
            case WebGPUConstants.TextureFormat.R8Sint:
            case WebGPUConstants.TextureFormat.RG8Unorm:
            case WebGPUConstants.TextureFormat.RG8Snorm:
            case WebGPUConstants.TextureFormat.RG8Uint:
            case WebGPUConstants.TextureFormat.RG8Sint:
            case WebGPUConstants.TextureFormat.RGBA8Unorm:
            case WebGPUConstants.TextureFormat.RGBA8UnormSRGB:
            case WebGPUConstants.TextureFormat.RGBA8Snorm:
            case WebGPUConstants.TextureFormat.RGBA8Uint:
            case WebGPUConstants.TextureFormat.RGBA8Sint:
            case WebGPUConstants.TextureFormat.BGRA8Unorm:
            case WebGPUConstants.TextureFormat.BGRA8UnormSRGB:
            case WebGPUConstants.TextureFormat.RGB10A2Unorm: // composite format - let's say it's byte...
            case WebGPUConstants.TextureFormat.RGB9E5UFloat: // composite format - let's say it's byte...
            case WebGPUConstants.TextureFormat.RG11B10UFloat: // composite format - let's say it's byte...
            case WebGPUConstants.TextureFormat.Depth24UnormStencil8: // composite format - let's say it's byte...
            case WebGPUConstants.TextureFormat.Depth32FloatStencil8: // composite format - let's say it's byte...
            case WebGPUConstants.TextureFormat.BC7RGBAUnorm:
            case WebGPUConstants.TextureFormat.BC7RGBAUnormSRGB:
            case WebGPUConstants.TextureFormat.BC6HRGBUFloat:
            case WebGPUConstants.TextureFormat.BC6HRGBFloat:
            case WebGPUConstants.TextureFormat.BC5RGUnorm:
            case WebGPUConstants.TextureFormat.BC5RGSnorm:
            case WebGPUConstants.TextureFormat.BC3RGBAUnorm:
            case WebGPUConstants.TextureFormat.BC3RGBAUnormSRGB:
            case WebGPUConstants.TextureFormat.BC2RGBAUnorm:
            case WebGPUConstants.TextureFormat.BC2RGBAUnormSRGB:
            case WebGPUConstants.TextureFormat.BC4RUnorm:
            case WebGPUConstants.TextureFormat.BC4RSnorm:
            case WebGPUConstants.TextureFormat.BC1RGBAUnorm:
            case WebGPUConstants.TextureFormat.BC1RGBAUnormSRGB:
            case WebGPUConstants.TextureFormat.ETC2RGB8Unorm:
            case WebGPUConstants.TextureFormat.ETC2RGB8UnormSRGB:
            case WebGPUConstants.TextureFormat.ETC2RGB8A1Unorm:
            case WebGPUConstants.TextureFormat.ETC2RGB8A1UnormSRGB:
            case WebGPUConstants.TextureFormat.ETC2RGBA8Unorm:
            case WebGPUConstants.TextureFormat.ETC2RGBA8UnormSRGB:
            case WebGPUConstants.TextureFormat.EACR11Unorm:
            case WebGPUConstants.TextureFormat.EACR11Snorm:
            case WebGPUConstants.TextureFormat.EACRG11Unorm:
            case WebGPUConstants.TextureFormat.EACRG11Snorm:
            case WebGPUConstants.TextureFormat.ASTC4x4Unorm:
            case WebGPUConstants.TextureFormat.ASTC4x4UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC5x4Unorm:
            case WebGPUConstants.TextureFormat.ASTC5x4UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC5x5Unorm:
            case WebGPUConstants.TextureFormat.ASTC5x5UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC6x5Unorm:
            case WebGPUConstants.TextureFormat.ASTC6x5UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC6x6Unorm:
            case WebGPUConstants.TextureFormat.ASTC6x6UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC8x5Unorm:
            case WebGPUConstants.TextureFormat.ASTC8x5UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC8x6Unorm:
            case WebGPUConstants.TextureFormat.ASTC8x6UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC8x8Unorm:
            case WebGPUConstants.TextureFormat.ASTC8x8UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC10x5Unorm:
            case WebGPUConstants.TextureFormat.ASTC10x5UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC10x6Unorm:
            case WebGPUConstants.TextureFormat.ASTC10x6UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC10x8Unorm:
            case WebGPUConstants.TextureFormat.ASTC10x8UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC10x10Unorm:
            case WebGPUConstants.TextureFormat.ASTC10x10UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC12x10Unorm:
            case WebGPUConstants.TextureFormat.ASTC12x10UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC12x12Unorm:
            case WebGPUConstants.TextureFormat.ASTC12x12UnormSRGB:
                return 0;
            // One component = 16 bits
            case WebGPUConstants.TextureFormat.R16Uint:
            case WebGPUConstants.TextureFormat.R16Sint:
            case WebGPUConstants.TextureFormat.RG16Uint:
            case WebGPUConstants.TextureFormat.RG16Sint:
            case WebGPUConstants.TextureFormat.RGBA16Uint:
            case WebGPUConstants.TextureFormat.RGBA16Sint:
            case WebGPUConstants.TextureFormat.Depth16Unorm:
                return 5;
            case WebGPUConstants.TextureFormat.R16Float:
            case WebGPUConstants.TextureFormat.RG16Float:
            case WebGPUConstants.TextureFormat.RGBA16Float:
                return 2;
            // One component = 32 bits
            case WebGPUConstants.TextureFormat.R32Uint:
            case WebGPUConstants.TextureFormat.R32Sint:
            case WebGPUConstants.TextureFormat.RG32Uint:
            case WebGPUConstants.TextureFormat.RG32Sint:
            case WebGPUConstants.TextureFormat.RGBA32Uint:
            case WebGPUConstants.TextureFormat.RGBA32Sint:
                return 7;
            case WebGPUConstants.TextureFormat.R32Float:
            case WebGPUConstants.TextureFormat.RG32Float:
            case WebGPUConstants.TextureFormat.RGBA32Float:
            case WebGPUConstants.TextureFormat.Depth32Float:
                return 1;
            case WebGPUConstants.TextureFormat.Stencil8:
                throw "No fixed size for Stencil8 format!";
            case WebGPUConstants.TextureFormat.Depth24Plus:
                throw "No fixed size for Depth24Plus format!";
            case WebGPUConstants.TextureFormat.Depth24PlusStencil8:
                throw "No fixed size for Depth24PlusStencil8 format!";
        }
        return 0;
    }
    static _GetBlockInformationFromFormat(format) {
        switch (format) {
            // 8 bits formats
            case WebGPUConstants.TextureFormat.R8Unorm:
            case WebGPUConstants.TextureFormat.R8Snorm:
            case WebGPUConstants.TextureFormat.R8Uint:
            case WebGPUConstants.TextureFormat.R8Sint:
                return { width: 1, height: 1, length: 1 };
            // 16 bits formats
            case WebGPUConstants.TextureFormat.R16Uint:
            case WebGPUConstants.TextureFormat.R16Sint:
            case WebGPUConstants.TextureFormat.R16Float:
            case WebGPUConstants.TextureFormat.RG8Unorm:
            case WebGPUConstants.TextureFormat.RG8Snorm:
            case WebGPUConstants.TextureFormat.RG8Uint:
            case WebGPUConstants.TextureFormat.RG8Sint:
                return { width: 1, height: 1, length: 2 };
            // 32 bits formats
            case WebGPUConstants.TextureFormat.R32Uint:
            case WebGPUConstants.TextureFormat.R32Sint:
            case WebGPUConstants.TextureFormat.R32Float:
            case WebGPUConstants.TextureFormat.RG16Uint:
            case WebGPUConstants.TextureFormat.RG16Sint:
            case WebGPUConstants.TextureFormat.RG16Float:
            case WebGPUConstants.TextureFormat.RGBA8Unorm:
            case WebGPUConstants.TextureFormat.RGBA8UnormSRGB:
            case WebGPUConstants.TextureFormat.RGBA8Snorm:
            case WebGPUConstants.TextureFormat.RGBA8Uint:
            case WebGPUConstants.TextureFormat.RGBA8Sint:
            case WebGPUConstants.TextureFormat.BGRA8Unorm:
            case WebGPUConstants.TextureFormat.BGRA8UnormSRGB:
            case WebGPUConstants.TextureFormat.RGB9E5UFloat:
            case WebGPUConstants.TextureFormat.RGB10A2Unorm:
            case WebGPUConstants.TextureFormat.RG11B10UFloat:
                return { width: 1, height: 1, length: 4 };
            // 64 bits formats
            case WebGPUConstants.TextureFormat.RG32Uint:
            case WebGPUConstants.TextureFormat.RG32Sint:
            case WebGPUConstants.TextureFormat.RG32Float:
            case WebGPUConstants.TextureFormat.RGBA16Uint:
            case WebGPUConstants.TextureFormat.RGBA16Sint:
            case WebGPUConstants.TextureFormat.RGBA16Float:
                return { width: 1, height: 1, length: 8 };
            // 128 bits formats
            case WebGPUConstants.TextureFormat.RGBA32Uint:
            case WebGPUConstants.TextureFormat.RGBA32Sint:
            case WebGPUConstants.TextureFormat.RGBA32Float:
                return { width: 1, height: 1, length: 16 };
            // Depth and stencil formats
            case WebGPUConstants.TextureFormat.Stencil8:
                throw "No fixed size for Stencil8 format!";
            case WebGPUConstants.TextureFormat.Depth16Unorm:
                return { width: 1, height: 1, length: 2 };
            case WebGPUConstants.TextureFormat.Depth24Plus:
                throw "No fixed size for Depth24Plus format!";
            case WebGPUConstants.TextureFormat.Depth24PlusStencil8:
                throw "No fixed size for Depth24PlusStencil8 format!";
            case WebGPUConstants.TextureFormat.Depth32Float:
                return { width: 1, height: 1, length: 4 };
            case WebGPUConstants.TextureFormat.Depth24UnormStencil8:
                return { width: 1, height: 1, length: 4 };
            case WebGPUConstants.TextureFormat.Depth32FloatStencil8:
                return { width: 1, height: 1, length: 5 };
            // BC compressed formats usable if "texture-compression-bc" is both
            // supported by the device/user agent and enabled in requestDevice.
            case WebGPUConstants.TextureFormat.BC7RGBAUnorm:
            case WebGPUConstants.TextureFormat.BC7RGBAUnormSRGB:
            case WebGPUConstants.TextureFormat.BC6HRGBUFloat:
            case WebGPUConstants.TextureFormat.BC6HRGBFloat:
            case WebGPUConstants.TextureFormat.BC5RGUnorm:
            case WebGPUConstants.TextureFormat.BC5RGSnorm:
            case WebGPUConstants.TextureFormat.BC3RGBAUnorm:
            case WebGPUConstants.TextureFormat.BC3RGBAUnormSRGB:
            case WebGPUConstants.TextureFormat.BC2RGBAUnorm:
            case WebGPUConstants.TextureFormat.BC2RGBAUnormSRGB:
                return { width: 4, height: 4, length: 16 };
            case WebGPUConstants.TextureFormat.BC4RUnorm:
            case WebGPUConstants.TextureFormat.BC4RSnorm:
            case WebGPUConstants.TextureFormat.BC1RGBAUnorm:
            case WebGPUConstants.TextureFormat.BC1RGBAUnormSRGB:
                return { width: 4, height: 4, length: 8 };
            // ETC2 compressed formats usable if "texture-compression-etc2" is both
            // supported by the device/user agent and enabled in requestDevice.
            case WebGPUConstants.TextureFormat.ETC2RGB8Unorm:
            case WebGPUConstants.TextureFormat.ETC2RGB8UnormSRGB:
            case WebGPUConstants.TextureFormat.ETC2RGB8A1Unorm:
            case WebGPUConstants.TextureFormat.ETC2RGB8A1UnormSRGB:
            case WebGPUConstants.TextureFormat.EACR11Unorm:
            case WebGPUConstants.TextureFormat.EACR11Snorm:
                return { width: 4, height: 4, length: 8 };
            case WebGPUConstants.TextureFormat.ETC2RGBA8Unorm:
            case WebGPUConstants.TextureFormat.ETC2RGBA8UnormSRGB:
            case WebGPUConstants.TextureFormat.EACRG11Unorm:
            case WebGPUConstants.TextureFormat.EACRG11Snorm:
                return { width: 4, height: 4, length: 16 };
            // ASTC compressed formats usable if "texture-compression-astc" is both
            // supported by the device/user agent and enabled in requestDevice.
            case WebGPUConstants.TextureFormat.ASTC4x4Unorm:
            case WebGPUConstants.TextureFormat.ASTC4x4UnormSRGB:
                return { width: 4, height: 4, length: 16 };
            case WebGPUConstants.TextureFormat.ASTC5x4Unorm:
            case WebGPUConstants.TextureFormat.ASTC5x4UnormSRGB:
                return { width: 5, height: 4, length: 16 };
            case WebGPUConstants.TextureFormat.ASTC5x5Unorm:
            case WebGPUConstants.TextureFormat.ASTC5x5UnormSRGB:
                return { width: 5, height: 5, length: 16 };
            case WebGPUConstants.TextureFormat.ASTC6x5Unorm:
            case WebGPUConstants.TextureFormat.ASTC6x5UnormSRGB:
                return { width: 6, height: 5, length: 16 };
            case WebGPUConstants.TextureFormat.ASTC6x6Unorm:
            case WebGPUConstants.TextureFormat.ASTC6x6UnormSRGB:
                return { width: 6, height: 6, length: 16 };
            case WebGPUConstants.TextureFormat.ASTC8x5Unorm:
            case WebGPUConstants.TextureFormat.ASTC8x5UnormSRGB:
                return { width: 8, height: 5, length: 16 };
            case WebGPUConstants.TextureFormat.ASTC8x6Unorm:
            case WebGPUConstants.TextureFormat.ASTC8x6UnormSRGB:
                return { width: 8, height: 6, length: 16 };
            case WebGPUConstants.TextureFormat.ASTC8x8Unorm:
            case WebGPUConstants.TextureFormat.ASTC8x8UnormSRGB:
                return { width: 8, height: 8, length: 16 };
            case WebGPUConstants.TextureFormat.ASTC10x5Unorm:
            case WebGPUConstants.TextureFormat.ASTC10x5UnormSRGB:
                return { width: 10, height: 5, length: 16 };
            case WebGPUConstants.TextureFormat.ASTC10x6Unorm:
            case WebGPUConstants.TextureFormat.ASTC10x6UnormSRGB:
                return { width: 10, height: 6, length: 16 };
            case WebGPUConstants.TextureFormat.ASTC10x8Unorm:
            case WebGPUConstants.TextureFormat.ASTC10x8UnormSRGB:
                return { width: 10, height: 8, length: 16 };
            case WebGPUConstants.TextureFormat.ASTC10x10Unorm:
            case WebGPUConstants.TextureFormat.ASTC10x10UnormSRGB:
                return { width: 10, height: 10, length: 16 };
            case WebGPUConstants.TextureFormat.ASTC12x10Unorm:
            case WebGPUConstants.TextureFormat.ASTC12x10UnormSRGB:
                return { width: 12, height: 10, length: 16 };
            case WebGPUConstants.TextureFormat.ASTC12x12Unorm:
            case WebGPUConstants.TextureFormat.ASTC12x12UnormSRGB:
                return { width: 12, height: 12, length: 16 };
        }
        return { width: 1, height: 1, length: 4 };
    }
    static _IsHardwareTexture(texture) {
        return !!texture.release;
    }
    static _IsInternalTexture(texture) {
        return !!texture.dispose;
    }
    static IsImageBitmap(imageBitmap) {
        return imageBitmap.close !== undefined;
    }
    static IsImageBitmapArray(imageBitmap) {
        return Array.isArray(imageBitmap) && imageBitmap[0].close !== undefined;
    }
    setCommandEncoder(encoder) {
        this._commandEncoderForCreation = encoder;
    }
    static IsCompressedFormat(format) {
        switch (format) {
            case WebGPUConstants.TextureFormat.BC7RGBAUnormSRGB:
            case WebGPUConstants.TextureFormat.BC7RGBAUnorm:
            case WebGPUConstants.TextureFormat.BC6HRGBFloat:
            case WebGPUConstants.TextureFormat.BC6HRGBUFloat:
            case WebGPUConstants.TextureFormat.BC5RGSnorm:
            case WebGPUConstants.TextureFormat.BC5RGUnorm:
            case WebGPUConstants.TextureFormat.BC4RSnorm:
            case WebGPUConstants.TextureFormat.BC4RUnorm:
            case WebGPUConstants.TextureFormat.BC3RGBAUnormSRGB:
            case WebGPUConstants.TextureFormat.BC3RGBAUnorm:
            case WebGPUConstants.TextureFormat.BC2RGBAUnormSRGB:
            case WebGPUConstants.TextureFormat.BC2RGBAUnorm:
            case WebGPUConstants.TextureFormat.BC1RGBAUnormSRGB:
            case WebGPUConstants.TextureFormat.BC1RGBAUnorm:
            case WebGPUConstants.TextureFormat.ETC2RGB8Unorm:
            case WebGPUConstants.TextureFormat.ETC2RGB8UnormSRGB:
            case WebGPUConstants.TextureFormat.ETC2RGB8A1Unorm:
            case WebGPUConstants.TextureFormat.ETC2RGB8A1UnormSRGB:
            case WebGPUConstants.TextureFormat.ETC2RGBA8Unorm:
            case WebGPUConstants.TextureFormat.ETC2RGBA8UnormSRGB:
            case WebGPUConstants.TextureFormat.EACR11Unorm:
            case WebGPUConstants.TextureFormat.EACR11Snorm:
            case WebGPUConstants.TextureFormat.EACRG11Unorm:
            case WebGPUConstants.TextureFormat.EACRG11Snorm:
            case WebGPUConstants.TextureFormat.ASTC4x4Unorm:
            case WebGPUConstants.TextureFormat.ASTC4x4UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC5x4Unorm:
            case WebGPUConstants.TextureFormat.ASTC5x4UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC5x5Unorm:
            case WebGPUConstants.TextureFormat.ASTC5x5UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC6x5Unorm:
            case WebGPUConstants.TextureFormat.ASTC6x5UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC6x6Unorm:
            case WebGPUConstants.TextureFormat.ASTC6x6UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC8x5Unorm:
            case WebGPUConstants.TextureFormat.ASTC8x5UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC8x6Unorm:
            case WebGPUConstants.TextureFormat.ASTC8x6UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC8x8Unorm:
            case WebGPUConstants.TextureFormat.ASTC8x8UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC10x5Unorm:
            case WebGPUConstants.TextureFormat.ASTC10x5UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC10x6Unorm:
            case WebGPUConstants.TextureFormat.ASTC10x6UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC10x8Unorm:
            case WebGPUConstants.TextureFormat.ASTC10x8UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC10x10Unorm:
            case WebGPUConstants.TextureFormat.ASTC10x10UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC12x10Unorm:
            case WebGPUConstants.TextureFormat.ASTC12x10UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC12x12Unorm:
            case WebGPUConstants.TextureFormat.ASTC12x12UnormSRGB:
                return true;
        }
        return false;
    }
    static GetWebGPUTextureFormat(type, format, useSRGBBuffer = false) {
        switch (format) {
            case 15:
                return WebGPUConstants.TextureFormat.Depth16Unorm;
            case 16:
                return WebGPUConstants.TextureFormat.Depth24Plus;
            case 13:
                return WebGPUConstants.TextureFormat.Depth24PlusStencil8;
            case 14:
                return WebGPUConstants.TextureFormat.Depth32Float;
            case 17:
                return WebGPUConstants.TextureFormat.Depth24UnormStencil8;
            case 18:
                return WebGPUConstants.TextureFormat.Depth32FloatStencil8;
            case 36492:
                return useSRGBBuffer ? WebGPUConstants.TextureFormat.BC7RGBAUnormSRGB : WebGPUConstants.TextureFormat.BC7RGBAUnorm;
            case 36495:
                return WebGPUConstants.TextureFormat.BC6HRGBUFloat;
            case 36494:
                return WebGPUConstants.TextureFormat.BC6HRGBFloat;
            case 33779:
                return useSRGBBuffer ? WebGPUConstants.TextureFormat.BC3RGBAUnormSRGB : WebGPUConstants.TextureFormat.BC3RGBAUnorm;
            case 33778:
                return useSRGBBuffer ? WebGPUConstants.TextureFormat.BC2RGBAUnormSRGB : WebGPUConstants.TextureFormat.BC2RGBAUnorm;
            case 33777:
            case 33776:
                return useSRGBBuffer ? WebGPUConstants.TextureFormat.BC1RGBAUnormSRGB : WebGPUConstants.TextureFormat.BC1RGBAUnorm;
            case 37808:
                return useSRGBBuffer ? WebGPUConstants.TextureFormat.ASTC4x4UnormSRGB : WebGPUConstants.TextureFormat.ASTC4x4Unorm;
            case 36196:
            case 37492:
                return useSRGBBuffer ? WebGPUConstants.TextureFormat.ETC2RGB8UnormSRGB : WebGPUConstants.TextureFormat.ETC2RGB8Unorm;
            case 37496:
                return useSRGBBuffer ? WebGPUConstants.TextureFormat.ETC2RGBA8UnormSRGB : WebGPUConstants.TextureFormat.ETC2RGBA8Unorm;
        }
        switch (type) {
            case 3:
                switch (format) {
                    case 6:
                        return WebGPUConstants.TextureFormat.R8Snorm;
                    case 7:
                        return WebGPUConstants.TextureFormat.RG8Snorm;
                    case 4:
                        throw "RGB format not supported in WebGPU";
                    case 8:
                        return WebGPUConstants.TextureFormat.R8Sint;
                    case 9:
                        return WebGPUConstants.TextureFormat.RG8Sint;
                    case 10:
                        throw "RGB_INTEGER format not supported in WebGPU";
                    case 11:
                        return WebGPUConstants.TextureFormat.RGBA8Sint;
                    default:
                        return WebGPUConstants.TextureFormat.RGBA8Snorm;
                }
            case 0:
                switch (format) {
                    case 6:
                        return WebGPUConstants.TextureFormat.R8Unorm;
                    case 7:
                        return WebGPUConstants.TextureFormat.RG8Unorm;
                    case 4:
                        throw "TEXTUREFORMAT_RGB format not supported in WebGPU";
                    case 5:
                        return useSRGBBuffer ? WebGPUConstants.TextureFormat.RGBA8UnormSRGB : WebGPUConstants.TextureFormat.RGBA8Unorm;
                    case 12:
                        return useSRGBBuffer ? WebGPUConstants.TextureFormat.BGRA8UnormSRGB : WebGPUConstants.TextureFormat.BGRA8Unorm;
                    case 8:
                        return WebGPUConstants.TextureFormat.R8Uint;
                    case 9:
                        return WebGPUConstants.TextureFormat.RG8Uint;
                    case 10:
                        throw "RGB_INTEGER format not supported in WebGPU";
                    case 11:
                        return WebGPUConstants.TextureFormat.RGBA8Uint;
                    case 0:
                        throw "TEXTUREFORMAT_ALPHA format not supported in WebGPU";
                    case 1:
                        throw "TEXTUREFORMAT_LUMINANCE format not supported in WebGPU";
                    case 2:
                        throw "TEXTUREFORMAT_LUMINANCE_ALPHA format not supported in WebGPU";
                    default:
                        return WebGPUConstants.TextureFormat.RGBA8Unorm;
                }
            case 4:
                switch (format) {
                    case 8:
                        return WebGPUConstants.TextureFormat.R16Sint;
                    case 9:
                        return WebGPUConstants.TextureFormat.RG16Sint;
                    case 10:
                        throw "TEXTUREFORMAT_RGB_INTEGER format not supported in WebGPU";
                    case 11:
                        return WebGPUConstants.TextureFormat.RGBA16Sint;
                    default:
                        return WebGPUConstants.TextureFormat.RGBA16Sint;
                }
            case 5:
                switch (format) {
                    case 8:
                        return WebGPUConstants.TextureFormat.R16Uint;
                    case 9:
                        return WebGPUConstants.TextureFormat.RG16Uint;
                    case 10:
                        throw "TEXTUREFORMAT_RGB_INTEGER format not supported in WebGPU";
                    case 11:
                        return WebGPUConstants.TextureFormat.RGBA16Uint;
                    default:
                        return WebGPUConstants.TextureFormat.RGBA16Uint;
                }
            case 6:
                switch (format) {
                    case 8:
                        return WebGPUConstants.TextureFormat.R32Sint;
                    case 9:
                        return WebGPUConstants.TextureFormat.RG32Sint;
                    case 10:
                        throw "TEXTUREFORMAT_RGB_INTEGER format not supported in WebGPU";
                    case 11:
                        return WebGPUConstants.TextureFormat.RGBA32Sint;
                    default:
                        return WebGPUConstants.TextureFormat.RGBA32Sint;
                }
            case 7: // Refers to UNSIGNED_INT
                switch (format) {
                    case 8:
                        return WebGPUConstants.TextureFormat.R32Uint;
                    case 9:
                        return WebGPUConstants.TextureFormat.RG32Uint;
                    case 10:
                        throw "TEXTUREFORMAT_RGB_INTEGER format not supported in WebGPU";
                    case 11:
                        return WebGPUConstants.TextureFormat.RGBA32Uint;
                    default:
                        return WebGPUConstants.TextureFormat.RGBA32Uint;
                }
            case 1:
                switch (format) {
                    case 6:
                        return WebGPUConstants.TextureFormat.R32Float; // By default. Other possibility is R16Float.
                    case 7:
                        return WebGPUConstants.TextureFormat.RG32Float; // By default. Other possibility is RG16Float.
                    case 4:
                        throw "TEXTUREFORMAT_RGB format not supported in WebGPU";
                    case 5:
                        return WebGPUConstants.TextureFormat.RGBA32Float; // By default. Other possibility is RGBA16Float.
                    default:
                        return WebGPUConstants.TextureFormat.RGBA32Float;
                }
            case 2:
                switch (format) {
                    case 6:
                        return WebGPUConstants.TextureFormat.R16Float;
                    case 7:
                        return WebGPUConstants.TextureFormat.RG16Float;
                    case 4:
                        throw "TEXTUREFORMAT_RGB format not supported in WebGPU";
                    case 5:
                        return WebGPUConstants.TextureFormat.RGBA16Float;
                    default:
                        return WebGPUConstants.TextureFormat.RGBA16Float;
                }
            case 10:
                throw "TEXTURETYPE_UNSIGNED_SHORT_5_6_5 format not supported in WebGPU";
            case 13:
                throw "TEXTURETYPE_UNSIGNED_INT_10F_11F_11F_REV format not supported in WebGPU";
            case 14:
                throw "TEXTURETYPE_UNSIGNED_INT_5_9_9_9_REV format not supported in WebGPU";
            case 8:
                throw "TEXTURETYPE_UNSIGNED_SHORT_4_4_4_4 format not supported in WebGPU";
            case 9:
                throw "TEXTURETYPE_UNSIGNED_SHORT_5_5_5_1 format not supported in WebGPU";
            case 11:
                switch (format) {
                    case 5:
                        return WebGPUConstants.TextureFormat.RGB10A2Unorm;
                    case 11:
                        throw "TEXTUREFORMAT_RGBA_INTEGER format not supported in WebGPU when type is TEXTURETYPE_UNSIGNED_INT_2_10_10_10_REV";
                    default:
                        return WebGPUConstants.TextureFormat.RGB10A2Unorm;
                }
        }
        return useSRGBBuffer ? WebGPUConstants.TextureFormat.RGBA8UnormSRGB : WebGPUConstants.TextureFormat.RGBA8Unorm;
    }
    static GetNumChannelsFromWebGPUTextureFormat(format) {
        switch (format) {
            case WebGPUConstants.TextureFormat.R8Unorm:
            case WebGPUConstants.TextureFormat.R8Snorm:
            case WebGPUConstants.TextureFormat.R8Uint:
            case WebGPUConstants.TextureFormat.R8Sint:
            case WebGPUConstants.TextureFormat.BC4RUnorm:
            case WebGPUConstants.TextureFormat.BC4RSnorm:
            case WebGPUConstants.TextureFormat.R16Uint:
            case WebGPUConstants.TextureFormat.R16Sint:
            case WebGPUConstants.TextureFormat.Depth16Unorm:
            case WebGPUConstants.TextureFormat.R16Float:
            case WebGPUConstants.TextureFormat.R32Uint:
            case WebGPUConstants.TextureFormat.R32Sint:
            case WebGPUConstants.TextureFormat.R32Float:
            case WebGPUConstants.TextureFormat.Depth32Float:
            case WebGPUConstants.TextureFormat.Stencil8:
            case WebGPUConstants.TextureFormat.Depth24Plus:
            case WebGPUConstants.TextureFormat.EACR11Unorm:
            case WebGPUConstants.TextureFormat.EACR11Snorm:
                return 1;
            case WebGPUConstants.TextureFormat.RG8Unorm:
            case WebGPUConstants.TextureFormat.RG8Snorm:
            case WebGPUConstants.TextureFormat.RG8Uint:
            case WebGPUConstants.TextureFormat.RG8Sint:
            case WebGPUConstants.TextureFormat.Depth24UnormStencil8: // composite format - let's say it's byte...
            case WebGPUConstants.TextureFormat.Depth32FloatStencil8: // composite format - let's say it's byte...
            case WebGPUConstants.TextureFormat.BC5RGUnorm:
            case WebGPUConstants.TextureFormat.BC5RGSnorm:
            case WebGPUConstants.TextureFormat.RG16Uint:
            case WebGPUConstants.TextureFormat.RG16Sint:
            case WebGPUConstants.TextureFormat.RG16Float:
            case WebGPUConstants.TextureFormat.RG32Uint:
            case WebGPUConstants.TextureFormat.RG32Sint:
            case WebGPUConstants.TextureFormat.RG32Float:
            case WebGPUConstants.TextureFormat.Depth24PlusStencil8:
            case WebGPUConstants.TextureFormat.EACRG11Unorm:
            case WebGPUConstants.TextureFormat.EACRG11Snorm:
                return 2;
            case WebGPUConstants.TextureFormat.RGB9E5UFloat: // composite format - let's say it's byte...
            case WebGPUConstants.TextureFormat.RG11B10UFloat: // composite format - let's say it's byte...
            case WebGPUConstants.TextureFormat.BC6HRGBUFloat:
            case WebGPUConstants.TextureFormat.BC6HRGBFloat:
            case WebGPUConstants.TextureFormat.ETC2RGB8Unorm:
            case WebGPUConstants.TextureFormat.ETC2RGB8UnormSRGB:
                return 3;
            case WebGPUConstants.TextureFormat.RGBA8Unorm:
            case WebGPUConstants.TextureFormat.RGBA8UnormSRGB:
            case WebGPUConstants.TextureFormat.RGBA8Snorm:
            case WebGPUConstants.TextureFormat.RGBA8Uint:
            case WebGPUConstants.TextureFormat.RGBA8Sint:
            case WebGPUConstants.TextureFormat.BGRA8Unorm:
            case WebGPUConstants.TextureFormat.BGRA8UnormSRGB:
            case WebGPUConstants.TextureFormat.RGB10A2Unorm: // composite format - let's say it's byte...
            case WebGPUConstants.TextureFormat.BC7RGBAUnorm:
            case WebGPUConstants.TextureFormat.BC7RGBAUnormSRGB:
            case WebGPUConstants.TextureFormat.BC3RGBAUnorm:
            case WebGPUConstants.TextureFormat.BC3RGBAUnormSRGB:
            case WebGPUConstants.TextureFormat.BC2RGBAUnorm:
            case WebGPUConstants.TextureFormat.BC2RGBAUnormSRGB:
            case WebGPUConstants.TextureFormat.BC1RGBAUnorm:
            case WebGPUConstants.TextureFormat.BC1RGBAUnormSRGB:
            case WebGPUConstants.TextureFormat.RGBA16Uint:
            case WebGPUConstants.TextureFormat.RGBA16Sint:
            case WebGPUConstants.TextureFormat.RGBA16Float:
            case WebGPUConstants.TextureFormat.RGBA32Uint:
            case WebGPUConstants.TextureFormat.RGBA32Sint:
            case WebGPUConstants.TextureFormat.RGBA32Float:
            case WebGPUConstants.TextureFormat.ETC2RGB8A1Unorm:
            case WebGPUConstants.TextureFormat.ETC2RGB8A1UnormSRGB:
            case WebGPUConstants.TextureFormat.ETC2RGBA8Unorm:
            case WebGPUConstants.TextureFormat.ETC2RGBA8UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC4x4Unorm:
            case WebGPUConstants.TextureFormat.ASTC4x4UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC5x4Unorm:
            case WebGPUConstants.TextureFormat.ASTC5x4UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC5x5Unorm:
            case WebGPUConstants.TextureFormat.ASTC5x5UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC6x5Unorm:
            case WebGPUConstants.TextureFormat.ASTC6x5UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC6x6Unorm:
            case WebGPUConstants.TextureFormat.ASTC6x6UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC8x5Unorm:
            case WebGPUConstants.TextureFormat.ASTC8x5UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC8x6Unorm:
            case WebGPUConstants.TextureFormat.ASTC8x6UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC8x8Unorm:
            case WebGPUConstants.TextureFormat.ASTC8x8UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC10x5Unorm:
            case WebGPUConstants.TextureFormat.ASTC10x5UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC10x6Unorm:
            case WebGPUConstants.TextureFormat.ASTC10x6UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC10x8Unorm:
            case WebGPUConstants.TextureFormat.ASTC10x8UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC10x10Unorm:
            case WebGPUConstants.TextureFormat.ASTC10x10UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC12x10Unorm:
            case WebGPUConstants.TextureFormat.ASTC12x10UnormSRGB:
            case WebGPUConstants.TextureFormat.ASTC12x12Unorm:
            case WebGPUConstants.TextureFormat.ASTC12x12UnormSRGB:
                return 4;
        }
        throw `Unknown format ${format}!`;
    }
    static HasStencilAspect(format) {
        switch (format) {
            case WebGPUConstants.TextureFormat.Stencil8:
            case WebGPUConstants.TextureFormat.Depth24UnormStencil8:
            case WebGPUConstants.TextureFormat.Depth32FloatStencil8:
            case WebGPUConstants.TextureFormat.Depth24PlusStencil8:
                return true;
        }
        return false;
    }
    static HasDepthAndStencilAspects(format) {
        switch (format) {
            case WebGPUConstants.TextureFormat.Depth24UnormStencil8:
            case WebGPUConstants.TextureFormat.Depth32FloatStencil8:
            case WebGPUConstants.TextureFormat.Depth24PlusStencil8:
                return true;
        }
        return false;
    }
    copyVideoToTexture(video, texture, format, invertY = false, commandEncoder) {
        var _a, _b, _c, _d;
        const useOwnCommandEncoder = commandEncoder === undefined;
        const [pipeline, bindGroupLayout] = this._getVideoPipeline(format, invertY ? VideoPipelineType.InvertY : VideoPipelineType.DontInvertY);
        if (useOwnCommandEncoder) {
            commandEncoder = this._device.createCommandEncoder({});
        }
        (_b = (_a = commandEncoder).pushDebugGroup) === null || _b === void 0 ? void 0 : _b.call(_a, `copy video to texture - invertY=${invertY}`);
        const webgpuHardwareTexture = texture._hardwareTexture;
        const renderPassDescriptor = {
            colorAttachments: [
                {
                    view: webgpuHardwareTexture.underlyingResource.createView({
                        format,
                        dimension: WebGPUConstants.TextureViewDimension.E2d,
                        mipLevelCount: 1,
                        baseArrayLayer: 0,
                        baseMipLevel: 0,
                        arrayLayerCount: 1,
                        aspect: WebGPUConstants.TextureAspect.All,
                    }),
                    loadOp: WebGPUConstants.LoadOp.Load,
                    storeOp: WebGPUConstants.StoreOp.Store,
                },
            ],
        };
        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        const descriptor = {
            layout: bindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: this._videoSampler,
                },
                {
                    binding: 1,
                    resource: this._device.importExternalTexture({
                        source: video.underlyingResource,
                    }),
                },
            ],
        };
        const bindGroup = this._device.createBindGroup(descriptor);
        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.draw(4, 1, 0, 0);
        passEncoder.end();
        (_d = (_c = commandEncoder).popDebugGroup) === null || _d === void 0 ? void 0 : _d.call(_c);
        if (useOwnCommandEncoder) {
            this._device.queue.submit([commandEncoder.finish()]);
            commandEncoder = null;
        }
    }
    invertYPreMultiplyAlpha(gpuOrHdwTexture, width, height, format, invertY = false, premultiplyAlpha = false, faceIndex = 0, mipLevel = 0, layers = 1, ofstX = 0, ofstY = 0, rectWidth = 0, rectHeight = 0, commandEncoder, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    allowGPUOptimization) {
        var _a, _b, _c, _d, _e, _f;
        const useRect = rectWidth !== 0;
        const useOwnCommandEncoder = commandEncoder === undefined;
        const [pipeline, bindGroupLayout] = this._getPipeline(format, useRect ? PipelineType.InvertYPremultiplyAlphaWithOfst : PipelineType.InvertYPremultiplyAlpha, {
            invertY,
            premultiplyAlpha,
        });
        faceIndex = Math.max(faceIndex, 0);
        if (useOwnCommandEncoder) {
            commandEncoder = this._device.createCommandEncoder({});
        }
        (_b = (_a = commandEncoder).pushDebugGroup) === null || _b === void 0 ? void 0 : _b.call(_a, `internal process texture - invertY=${invertY} premultiplyAlpha=${premultiplyAlpha}`);
        let gpuTexture;
        if (WebGPUTextureHelper._IsHardwareTexture(gpuOrHdwTexture)) {
            gpuTexture = gpuOrHdwTexture.underlyingResource;
            if (!(invertY && !premultiplyAlpha && layers === 1 && faceIndex === 0)) {
                // we optimize only for the most likely case (invertY=true, premultiplyAlpha=false, layers=1, faceIndex=0) to avoid dealing with big caches
                gpuOrHdwTexture = undefined;
            }
        }
        else {
            gpuTexture = gpuOrHdwTexture;
            gpuOrHdwTexture = undefined;
        }
        if (!gpuTexture) {
            return;
        }
        if (useRect) {
            this._bufferManager.setRawData(this._ubCopyWithOfst, 0, new Float32Array([ofstX, ofstY, rectWidth, rectHeight]), 0, 4 * 4);
        }
        const webgpuHardwareTexture = gpuOrHdwTexture;
        const outputTexture = (_c = webgpuHardwareTexture === null || webgpuHardwareTexture === void 0 ? void 0 : webgpuHardwareTexture._copyInvertYTempTexture) !== null && _c !== void 0 ? _c : this.createTexture({ width, height, layers: 1 }, false, false, false, false, false, format, 1, commandEncoder, WebGPUConstants.TextureUsage.CopySrc | WebGPUConstants.TextureUsage.RenderAttachment | WebGPUConstants.TextureUsage.TextureBinding);
        const renderPassDescriptor = (_d = webgpuHardwareTexture === null || webgpuHardwareTexture === void 0 ? void 0 : webgpuHardwareTexture._copyInvertYRenderPassDescr) !== null && _d !== void 0 ? _d : {
            colorAttachments: [
                {
                    view: outputTexture.createView({
                        format,
                        dimension: WebGPUConstants.TextureViewDimension.E2d,
                        baseMipLevel: 0,
                        mipLevelCount: 1,
                        arrayLayerCount: 1,
                        baseArrayLayer: 0,
                    }),
                    loadOp: WebGPUConstants.LoadOp.Load,
                    storeOp: WebGPUConstants.StoreOp.Store,
                },
            ],
        };
        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        let bindGroup = useRect ? webgpuHardwareTexture === null || webgpuHardwareTexture === void 0 ? void 0 : webgpuHardwareTexture._copyInvertYBindGroupWithOfst : webgpuHardwareTexture === null || webgpuHardwareTexture === void 0 ? void 0 : webgpuHardwareTexture._copyInvertYBindGroup;
        if (!bindGroup) {
            const descriptor = {
                layout: bindGroupLayout,
                entries: [
                    {
                        binding: 0,
                        resource: gpuTexture.createView({
                            format,
                            dimension: WebGPUConstants.TextureViewDimension.E2d,
                            baseMipLevel: mipLevel,
                            mipLevelCount: 1,
                            arrayLayerCount: layers,
                            baseArrayLayer: faceIndex,
                        }),
                    },
                ],
            };
            if (useRect) {
                descriptor.entries.push({
                    binding: 1,
                    resource: {
                        buffer: this._ubCopyWithOfst,
                    },
                });
            }
            bindGroup = this._device.createBindGroup(descriptor);
        }
        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.draw(4, 1, 0, 0);
        passEncoder.end();
        commandEncoder.copyTextureToTexture({
            texture: outputTexture,
        }, {
            texture: gpuTexture,
            mipLevel,
            origin: {
                x: 0,
                y: 0,
                z: faceIndex,
            },
        }, {
            width,
            height,
            depthOrArrayLayers: 1,
        });
        if (webgpuHardwareTexture) {
            webgpuHardwareTexture._copyInvertYTempTexture = outputTexture;
            webgpuHardwareTexture._copyInvertYRenderPassDescr = renderPassDescriptor;
            if (useRect) {
                webgpuHardwareTexture._copyInvertYBindGroupWithOfst = bindGroup;
            }
            else {
                webgpuHardwareTexture._copyInvertYBindGroup = bindGroup;
            }
        }
        else {
            this._deferredReleaseTextures.push([outputTexture, null]);
        }
        (_f = (_e = commandEncoder).popDebugGroup) === null || _f === void 0 ? void 0 : _f.call(_e);
        if (useOwnCommandEncoder) {
            this._device.queue.submit([commandEncoder.finish()]);
            commandEncoder = null;
        }
    }
    copyWithInvertY(srcTextureView, format, renderPassDescriptor, commandEncoder) {
        var _a, _b, _c, _d;
        const useOwnCommandEncoder = commandEncoder === undefined;
        const [pipeline, bindGroupLayout] = this._getPipeline(format, PipelineType.InvertYPremultiplyAlpha, { invertY: true, premultiplyAlpha: false });
        if (useOwnCommandEncoder) {
            commandEncoder = this._device.createCommandEncoder({});
        }
        (_b = (_a = commandEncoder).pushDebugGroup) === null || _b === void 0 ? void 0 : _b.call(_a, `internal copy texture with invertY`);
        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        const bindGroup = this._device.createBindGroup({
            layout: bindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: srcTextureView,
                },
            ],
        });
        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.draw(4, 1, 0, 0);
        passEncoder.end();
        (_d = (_c = commandEncoder).popDebugGroup) === null || _d === void 0 ? void 0 : _d.call(_c);
        if (useOwnCommandEncoder) {
            this._device.queue.submit([commandEncoder.finish()]);
            commandEncoder = null;
        }
    }
    //------------------------------------------------------------------------------
    //                               Creation
    //------------------------------------------------------------------------------
    createTexture(imageBitmap, hasMipmaps = false, generateMipmaps = false, invertY = false, premultiplyAlpha = false, is3D = false, format = WebGPUConstants.TextureFormat.RGBA8Unorm, sampleCount = 1, commandEncoder, usage = -1, additionalUsages = 0) {
        if (sampleCount > 1) {
            // WebGPU only supports 1 or 4
            sampleCount = 4;
        }
        const layerCount = imageBitmap.layers || 1;
        const textureSize = {
            width: imageBitmap.width,
            height: imageBitmap.height,
            depthOrArrayLayers: layerCount,
        };
        const isCompressedFormat = WebGPUTextureHelper.IsCompressedFormat(format);
        const mipLevelCount = hasMipmaps ? WebGPUTextureHelper.ComputeNumMipmapLevels(imageBitmap.width, imageBitmap.height) : 1;
        const usages = usage >= 0 ? usage : WebGPUConstants.TextureUsage.CopySrc | WebGPUConstants.TextureUsage.CopyDst | WebGPUConstants.TextureUsage.TextureBinding;
        additionalUsages |= hasMipmaps && !isCompressedFormat ? WebGPUConstants.TextureUsage.CopySrc | WebGPUConstants.TextureUsage.RenderAttachment : 0;
        if (!isCompressedFormat && !is3D) {
            // we don't know in advance if the texture will be updated with copyExternalImageToTexture (which requires to have those flags), so we need to force the flags all the times
            additionalUsages |= WebGPUConstants.TextureUsage.RenderAttachment | WebGPUConstants.TextureUsage.CopyDst;
        }
        const gpuTexture = this._device.createTexture({
            label: `Texture_${textureSize.width}x${textureSize.height}x${textureSize.depthOrArrayLayers}_${hasMipmaps ? "wmips" : "womips"}_${format}_samples${sampleCount}`,
            size: textureSize,
            dimension: is3D ? WebGPUConstants.TextureDimension.E3d : WebGPUConstants.TextureDimension.E2d,
            format,
            usage: usages | additionalUsages,
            sampleCount,
            mipLevelCount,
        });
        if (WebGPUTextureHelper.IsImageBitmap(imageBitmap)) {
            this.updateTexture(imageBitmap, gpuTexture, imageBitmap.width, imageBitmap.height, layerCount, format, 0, 0, invertY, premultiplyAlpha, 0, 0);
            if (hasMipmaps && generateMipmaps) {
                this.generateMipmaps(gpuTexture, format, mipLevelCount, 0, commandEncoder);
            }
        }
        return gpuTexture;
    }
    createCubeTexture(imageBitmaps, hasMipmaps = false, generateMipmaps = false, invertY = false, premultiplyAlpha = false, format = WebGPUConstants.TextureFormat.RGBA8Unorm, sampleCount = 1, commandEncoder, usage = -1, additionalUsages = 0) {
        if (sampleCount > 1) {
            // WebGPU only supports 1 or 4
            sampleCount = 4;
        }
        const width = WebGPUTextureHelper.IsImageBitmapArray(imageBitmaps) ? imageBitmaps[0].width : imageBitmaps.width;
        const height = WebGPUTextureHelper.IsImageBitmapArray(imageBitmaps) ? imageBitmaps[0].height : imageBitmaps.height;
        const isCompressedFormat = WebGPUTextureHelper.IsCompressedFormat(format);
        const mipLevelCount = hasMipmaps ? WebGPUTextureHelper.ComputeNumMipmapLevels(width, height) : 1;
        const usages = usage >= 0 ? usage : WebGPUConstants.TextureUsage.CopySrc | WebGPUConstants.TextureUsage.CopyDst | WebGPUConstants.TextureUsage.TextureBinding;
        additionalUsages |= hasMipmaps && !isCompressedFormat ? WebGPUConstants.TextureUsage.CopySrc | WebGPUConstants.TextureUsage.RenderAttachment : 0;
        if (!isCompressedFormat) {
            // we don't know in advance if the texture will be updated with copyExternalImageToTexture (which requires to have those flags), so we need to force the flags all the times
            additionalUsages |= WebGPUConstants.TextureUsage.RenderAttachment | WebGPUConstants.TextureUsage.CopyDst;
        }
        const gpuTexture = this._device.createTexture({
            label: `TextureCube_${width}x${height}x6_${hasMipmaps ? "wmips" : "womips"}_${format}_samples${sampleCount}`,
            size: {
                width,
                height,
                depthOrArrayLayers: 6,
            },
            dimension: WebGPUConstants.TextureDimension.E2d,
            format,
            usage: usages | additionalUsages,
            sampleCount,
            mipLevelCount,
        });
        if (WebGPUTextureHelper.IsImageBitmapArray(imageBitmaps)) {
            this.updateCubeTextures(imageBitmaps, gpuTexture, width, height, format, invertY, premultiplyAlpha, 0, 0);
            if (hasMipmaps && generateMipmaps) {
                this.generateCubeMipmaps(gpuTexture, format, mipLevelCount, commandEncoder);
            }
        }
        return gpuTexture;
    }
    generateCubeMipmaps(gpuTexture, format, mipLevelCount, commandEncoder) {
        var _a, _b, _c, _d;
        const useOwnCommandEncoder = commandEncoder === undefined;
        if (useOwnCommandEncoder) {
            commandEncoder = this._device.createCommandEncoder({});
        }
        (_b = (_a = commandEncoder).pushDebugGroup) === null || _b === void 0 ? void 0 : _b.call(_a, `create cube mipmaps - ${mipLevelCount} levels`);
        for (let f = 0; f < 6; ++f) {
            this.generateMipmaps(gpuTexture, format, mipLevelCount, f, commandEncoder);
        }
        (_d = (_c = commandEncoder).popDebugGroup) === null || _d === void 0 ? void 0 : _d.call(_c);
        if (useOwnCommandEncoder) {
            this._device.queue.submit([commandEncoder.finish()]);
            commandEncoder = null;
        }
    }
    generateMipmaps(gpuOrHdwTexture, format, mipLevelCount, faceIndex = 0, commandEncoder) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const useOwnCommandEncoder = commandEncoder === undefined;
        const [pipeline, bindGroupLayout] = this._getPipeline(format);
        faceIndex = Math.max(faceIndex, 0);
        if (useOwnCommandEncoder) {
            commandEncoder = this._device.createCommandEncoder({});
        }
        (_b = (_a = commandEncoder).pushDebugGroup) === null || _b === void 0 ? void 0 : _b.call(_a, `create mipmaps for face #${faceIndex} - ${mipLevelCount} levels`);
        let gpuTexture;
        if (WebGPUTextureHelper._IsHardwareTexture(gpuOrHdwTexture)) {
            gpuTexture = gpuOrHdwTexture.underlyingResource;
            gpuOrHdwTexture._mipmapGenRenderPassDescr = gpuOrHdwTexture._mipmapGenRenderPassDescr || [];
            gpuOrHdwTexture._mipmapGenBindGroup = gpuOrHdwTexture._mipmapGenBindGroup || [];
        }
        else {
            gpuTexture = gpuOrHdwTexture;
            gpuOrHdwTexture = undefined;
        }
        if (!gpuTexture) {
            return;
        }
        const webgpuHardwareTexture = gpuOrHdwTexture;
        for (let i = 1; i < mipLevelCount; ++i) {
            const renderPassDescriptor = (_d = (_c = webgpuHardwareTexture === null || webgpuHardwareTexture === void 0 ? void 0 : webgpuHardwareTexture._mipmapGenRenderPassDescr[faceIndex]) === null || _c === void 0 ? void 0 : _c[i - 1]) !== null && _d !== void 0 ? _d : {
                colorAttachments: [
                    {
                        view: gpuTexture.createView({
                            format,
                            dimension: WebGPUConstants.TextureViewDimension.E2d,
                            baseMipLevel: i,
                            mipLevelCount: 1,
                            arrayLayerCount: 1,
                            baseArrayLayer: faceIndex,
                        }),
                        loadOp: WebGPUConstants.LoadOp.Load,
                        storeOp: WebGPUConstants.StoreOp.Store,
                    },
                ],
            };
            if (webgpuHardwareTexture) {
                webgpuHardwareTexture._mipmapGenRenderPassDescr[faceIndex] = webgpuHardwareTexture._mipmapGenRenderPassDescr[faceIndex] || [];
                webgpuHardwareTexture._mipmapGenRenderPassDescr[faceIndex][i - 1] = renderPassDescriptor;
            }
            const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
            const bindGroup = (_f = (_e = webgpuHardwareTexture === null || webgpuHardwareTexture === void 0 ? void 0 : webgpuHardwareTexture._mipmapGenBindGroup[faceIndex]) === null || _e === void 0 ? void 0 : _e[i - 1]) !== null && _f !== void 0 ? _f : this._device.createBindGroup({
                layout: bindGroupLayout,
                entries: [
                    {
                        binding: 0,
                        resource: this._mipmapSampler,
                    },
                    {
                        binding: 1,
                        resource: gpuTexture.createView({
                            format,
                            dimension: WebGPUConstants.TextureViewDimension.E2d,
                            baseMipLevel: i - 1,
                            mipLevelCount: 1,
                            arrayLayerCount: 1,
                            baseArrayLayer: faceIndex,
                        }),
                    },
                ],
            });
            if (webgpuHardwareTexture) {
                webgpuHardwareTexture._mipmapGenBindGroup[faceIndex] = webgpuHardwareTexture._mipmapGenBindGroup[faceIndex] || [];
                webgpuHardwareTexture._mipmapGenBindGroup[faceIndex][i - 1] = bindGroup;
            }
            passEncoder.setPipeline(pipeline);
            passEncoder.setBindGroup(0, bindGroup);
            passEncoder.draw(4, 1, 0, 0);
            passEncoder.end();
        }
        (_h = (_g = commandEncoder).popDebugGroup) === null || _h === void 0 ? void 0 : _h.call(_g);
        if (useOwnCommandEncoder) {
            this._device.queue.submit([commandEncoder.finish()]);
            commandEncoder = null;
        }
    }
    createGPUTextureForInternalTexture(texture, width, height, depth, creationFlags) {
        if (!texture._hardwareTexture) {
            texture._hardwareTexture = new WebGPUHardwareTexture();
        }
        if (width === undefined) {
            width = texture.width;
        }
        if (height === undefined) {
            height = texture.height;
        }
        if (depth === undefined) {
            depth = texture.depth;
        }
        const gpuTextureWrapper = texture._hardwareTexture;
        const isStorageTexture = ((creationFlags !== null && creationFlags !== void 0 ? creationFlags : 0) & 1) !== 0;
        gpuTextureWrapper.format = WebGPUTextureHelper.GetWebGPUTextureFormat(texture.type, texture.format, texture._useSRGBBuffer);
        gpuTextureWrapper.textureUsages =
            texture._source === InternalTextureSource.RenderTarget || texture.source === InternalTextureSource.MultiRenderTarget
                ? WebGPUConstants.TextureUsage.TextureBinding | WebGPUConstants.TextureUsage.CopySrc | WebGPUConstants.TextureUsage.RenderAttachment
                : texture._source === InternalTextureSource.DepthStencil
                    ? WebGPUConstants.TextureUsage.TextureBinding | WebGPUConstants.TextureUsage.RenderAttachment
                    : -1;
        gpuTextureWrapper.textureAdditionalUsages = isStorageTexture ? WebGPUConstants.TextureUsage.StorageBinding : 0;
        const hasMipMaps = texture.generateMipMaps;
        const layerCount = depth || 1;
        let mipmapCount;
        if (texture._maxLodLevel !== null) {
            mipmapCount = texture._maxLodLevel;
        }
        else {
            mipmapCount = hasMipMaps ? WebGPUTextureHelper.ComputeNumMipmapLevels(width, height) : 1;
        }
        if (texture.isCube) {
            const gpuTexture = this.createCubeTexture({ width, height }, texture.generateMipMaps, texture.generateMipMaps, texture.invertY, false, gpuTextureWrapper.format, 1, this._commandEncoderForCreation, gpuTextureWrapper.textureUsages, gpuTextureWrapper.textureAdditionalUsages);
            gpuTextureWrapper.set(gpuTexture);
            gpuTextureWrapper.createView({
                format: gpuTextureWrapper.format,
                dimension: WebGPUConstants.TextureViewDimension.Cube,
                mipLevelCount: mipmapCount,
                baseArrayLayer: 0,
                baseMipLevel: 0,
                arrayLayerCount: 6,
                aspect: WebGPUTextureHelper.HasDepthAndStencilAspects(gpuTextureWrapper.format) ? WebGPUConstants.TextureAspect.DepthOnly : WebGPUConstants.TextureAspect.All,
            }, isStorageTexture);
        }
        else {
            const gpuTexture = this.createTexture({ width, height, layers: layerCount }, texture.generateMipMaps, texture.generateMipMaps, texture.invertY, false, texture.is3D, gpuTextureWrapper.format, 1, this._commandEncoderForCreation, gpuTextureWrapper.textureUsages, gpuTextureWrapper.textureAdditionalUsages);
            gpuTextureWrapper.set(gpuTexture);
            gpuTextureWrapper.createView({
                format: gpuTextureWrapper.format,
                dimension: texture.is2DArray
                    ? WebGPUConstants.TextureViewDimension.E2dArray
                    : texture.is3D
                        ? WebGPUConstants.TextureDimension.E3d
                        : WebGPUConstants.TextureViewDimension.E2d,
                mipLevelCount: mipmapCount,
                baseArrayLayer: 0,
                baseMipLevel: 0,
                arrayLayerCount: texture.is3D ? 1 : layerCount,
                aspect: WebGPUTextureHelper.HasDepthAndStencilAspects(gpuTextureWrapper.format) ? WebGPUConstants.TextureAspect.DepthOnly : WebGPUConstants.TextureAspect.All,
            }, isStorageTexture);
        }
        texture.width = texture.baseWidth = width;
        texture.height = texture.baseHeight = height;
        texture.depth = texture.baseDepth = depth;
        this.createMSAATexture(texture, texture.samples);
        return gpuTextureWrapper;
    }
    createMSAATexture(texture, samples) {
        const gpuTextureWrapper = texture._hardwareTexture;
        if (gpuTextureWrapper === null || gpuTextureWrapper === void 0 ? void 0 : gpuTextureWrapper.msaaTexture) {
            this.releaseTexture(gpuTextureWrapper.msaaTexture);
            gpuTextureWrapper.msaaTexture = null;
        }
        if (!gpuTextureWrapper || (samples !== null && samples !== void 0 ? samples : 1) <= 1) {
            return;
        }
        const width = texture.width;
        const height = texture.height;
        const layerCount = texture.depth || 1;
        if (texture.isCube) {
            const gpuMSAATexture = this.createCubeTexture({ width, height }, false, false, texture.invertY, false, gpuTextureWrapper.format, samples, this._commandEncoderForCreation, gpuTextureWrapper.textureUsages, gpuTextureWrapper.textureAdditionalUsages);
            gpuTextureWrapper.msaaTexture = gpuMSAATexture;
        }
        else {
            const gpuMSAATexture = this.createTexture({ width, height, layers: layerCount }, false, false, texture.invertY, false, texture.is3D, gpuTextureWrapper.format, samples, this._commandEncoderForCreation, gpuTextureWrapper.textureUsages, gpuTextureWrapper.textureAdditionalUsages);
            gpuTextureWrapper.msaaTexture = gpuMSAATexture;
        }
    }
    //------------------------------------------------------------------------------
    //                                  Update
    //------------------------------------------------------------------------------
    updateCubeTextures(imageBitmaps, gpuTexture, width, height, format, invertY = false, premultiplyAlpha = false, offsetX = 0, offsetY = 0) {
        const faces = [0, 3, 1, 4, 2, 5];
        for (let f = 0; f < faces.length; ++f) {
            const imageBitmap = imageBitmaps[faces[f]];
            this.updateTexture(imageBitmap, gpuTexture, width, height, 1, format, f, 0, invertY, premultiplyAlpha, offsetX, offsetY);
        }
    }
    // TODO WEBGPU handle data source not being in the same format than the destination texture?
    updateTexture(imageBitmap, texture, width, height, layers, format, faceIndex = 0, mipLevel = 0, invertY = false, premultiplyAlpha = false, offsetX = 0, offsetY = 0, allowGPUOptimization) {
        const gpuTexture = WebGPUTextureHelper._IsInternalTexture(texture) ? texture._hardwareTexture.underlyingResource : texture;
        const blockInformation = WebGPUTextureHelper._GetBlockInformationFromFormat(format);
        const gpuOrHdwTexture = WebGPUTextureHelper._IsInternalTexture(texture) ? texture._hardwareTexture : texture;
        const textureCopyView = {
            texture: gpuTexture,
            origin: {
                x: offsetX,
                y: offsetY,
                z: Math.max(faceIndex, 0),
            },
            mipLevel: mipLevel,
            premultipliedAlpha: premultiplyAlpha,
        };
        const textureExtent = {
            width: Math.ceil(width / blockInformation.width) * blockInformation.width,
            height: Math.ceil(height / blockInformation.height) * blockInformation.height,
            depthOrArrayLayers: layers || 1,
        };
        if (imageBitmap.byteLength !== undefined) {
            imageBitmap = imageBitmap;
            const bytesPerRow = Math.ceil(width / blockInformation.width) * blockInformation.length;
            const aligned = Math.ceil(bytesPerRow / 256) * 256 === bytesPerRow;
            if (aligned) {
                const commandEncoder = this._device.createCommandEncoder({});
                const buffer = this._bufferManager.createRawBuffer(imageBitmap.byteLength, WebGPUConstants.BufferUsage.MapWrite | WebGPUConstants.BufferUsage.CopySrc, true);
                const arrayBuffer = buffer.getMappedRange();
                new Uint8Array(arrayBuffer).set(imageBitmap);
                buffer.unmap();
                commandEncoder.copyBufferToTexture({
                    buffer: buffer,
                    offset: 0,
                    bytesPerRow,
                    rowsPerImage: height,
                }, textureCopyView, textureExtent);
                this._device.queue.submit([commandEncoder.finish()]);
                this._bufferManager.releaseBuffer(buffer);
            }
            else {
                this._device.queue.writeTexture(textureCopyView, imageBitmap, {
                    offset: 0,
                    bytesPerRow,
                    rowsPerImage: height,
                }, textureExtent);
            }
            if (invertY || premultiplyAlpha) {
                if (WebGPUTextureHelper._IsInternalTexture(texture)) {
                    const dontUseRect = offsetX === 0 && offsetY === 0 && width === texture.width && height === texture.height;
                    this.invertYPreMultiplyAlpha(gpuOrHdwTexture, texture.width, texture.height, format, invertY, premultiplyAlpha, faceIndex, mipLevel, layers || 1, offsetX, offsetY, dontUseRect ? 0 : width, dontUseRect ? 0 : height, undefined, allowGPUOptimization);
                }
                else {
                    // we should never take this code path
                    throw "updateTexture: Can't process the texture data because a GPUTexture was provided instead of an InternalTexture!";
                }
            }
        }
        else {
            imageBitmap = imageBitmap;
            if (invertY) {
                textureCopyView.premultipliedAlpha = false; // we are going to handle premultiplyAlpha ourselves
                // we must preprocess the image
                if (WebGPUTextureHelper._IsInternalTexture(texture) && offsetX === 0 && offsetY === 0 && width === texture.width && height === texture.height) {
                    // optimization when the source image is the same size than the destination texture and offsets X/Y == 0:
                    // we simply copy the source to the destination and we apply the preprocessing on the destination
                    this._device.queue.copyExternalImageToTexture({ source: imageBitmap }, textureCopyView, textureExtent);
                    this.invertYPreMultiplyAlpha(gpuOrHdwTexture, width, height, format, invertY, premultiplyAlpha, faceIndex, mipLevel, layers || 1, 0, 0, 0, 0, undefined, allowGPUOptimization);
                }
                else {
                    // we must apply the preprocessing on the source image before copying it into the destination texture
                    const commandEncoder = this._device.createCommandEncoder({});
                    // create a temp texture and copy the image to it
                    const srcTexture = this.createTexture({ width, height, layers: 1 }, false, false, false, false, false, format, 1, commandEncoder, WebGPUConstants.TextureUsage.CopySrc | WebGPUConstants.TextureUsage.TextureBinding);
                    this._deferredReleaseTextures.push([srcTexture, null]);
                    textureExtent.depthOrArrayLayers = 1;
                    this._device.queue.copyExternalImageToTexture({ source: imageBitmap }, { texture: srcTexture }, textureExtent);
                    textureExtent.depthOrArrayLayers = layers || 1;
                    // apply the preprocessing to this temp texture
                    this.invertYPreMultiplyAlpha(srcTexture, width, height, format, invertY, premultiplyAlpha, faceIndex, mipLevel, layers || 1, 0, 0, 0, 0, commandEncoder, allowGPUOptimization);
                    // copy the temp texture to the destination texture
                    commandEncoder.copyTextureToTexture({ texture: srcTexture }, textureCopyView, textureExtent);
                    this._device.queue.submit([commandEncoder.finish()]);
                }
            }
            else {
                // no preprocessing: direct copy to destination texture
                this._device.queue.copyExternalImageToTexture({ source: imageBitmap }, textureCopyView, textureExtent);
            }
        }
    }
    readPixels(texture, x, y, width, height, format, faceIndex = 0, mipLevel = 0, buffer = null, noDataConversion = false) {
        const blockInformation = WebGPUTextureHelper._GetBlockInformationFromFormat(format);
        const bytesPerRow = Math.ceil(width / blockInformation.width) * blockInformation.length;
        const bytesPerRowAligned = Math.ceil(bytesPerRow / 256) * 256;
        const size = bytesPerRowAligned * height;
        const gpuBuffer = this._bufferManager.createRawBuffer(size, WebGPUConstants.BufferUsage.MapRead | WebGPUConstants.BufferUsage.CopyDst);
        const commandEncoder = this._device.createCommandEncoder({});
        commandEncoder.copyTextureToBuffer({
            texture,
            mipLevel,
            origin: {
                x,
                y,
                z: Math.max(faceIndex, 0),
            },
        }, {
            buffer: gpuBuffer,
            offset: 0,
            bytesPerRow: bytesPerRowAligned,
        }, {
            width,
            height,
            depthOrArrayLayers: 1,
        });
        this._device.queue.submit([commandEncoder.finish()]);
        return this._bufferManager.readDataFromBuffer(gpuBuffer, size, width, height, bytesPerRow, bytesPerRowAligned, WebGPUTextureHelper._GetTextureTypeFromFormat(format), 0, buffer, true, noDataConversion);
    }
    //------------------------------------------------------------------------------
    //                              Dispose
    //------------------------------------------------------------------------------
    releaseTexture(texture) {
        if (WebGPUTextureHelper._IsInternalTexture(texture)) {
            const hardwareTexture = texture._hardwareTexture;
            const irradianceTexture = texture._irradianceTexture;
            // We can't destroy the objects just now because they could be used in the current frame - we delay the destroying after the end of the frame
            this._deferredReleaseTextures.push([hardwareTexture, irradianceTexture]);
        }
        else {
            this._deferredReleaseTextures.push([texture, null]);
        }
    }
    destroyDeferredTextures() {
        for (let i = 0; i < this._deferredReleaseTextures.length; ++i) {
            const [hardwareTexture, irradianceTexture] = this._deferredReleaseTextures[i];
            if (hardwareTexture) {
                if (WebGPUTextureHelper._IsHardwareTexture(hardwareTexture)) {
                    hardwareTexture.release();
                }
                else {
                    hardwareTexture.destroy();
                }
            }
            irradianceTexture === null || irradianceTexture === void 0 ? void 0 : irradianceTexture.dispose();
        }
        this._deferredReleaseTextures.length = 0;
    }
}
//# sourceMappingURL=webgpuTextureHelper.js.map