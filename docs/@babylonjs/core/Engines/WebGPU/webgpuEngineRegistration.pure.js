// --- Core (minimum for a working engine) ---
import { RegisterAbstractEngineDom } from "../AbstractEngine/abstractEngine.dom.pure.js";
import { RegisterAbstractEngineRenderPass } from "../AbstractEngine/abstractEngine.renderPass.pure.js";
import { RegisterAbstractEngineStates } from "../AbstractEngine/abstractEngine.states.pure.js";
import { RegisterAbstractEngineStencil } from "../AbstractEngine/abstractEngine.stencil.pure.js";
// --- Standard additions ---
import { RegisterAbstractEngineLoadFile } from "../AbstractEngine/abstractEngine.loadFile.pure.js";
import { RegisterEnginesWebGPUExtensionsEngineAlpha } from "./Extensions/engine.alpha.pure.js";
import { RegisterEnginesWebGPUExtensionsEngineRenderTarget } from "./Extensions/engine.renderTarget.pure.js";
import { RegisterEnginesWebGPUExtensionsEngineRenderTargetTexture } from "./Extensions/engine.renderTargetTexture.pure.js";
// --- Full additions ---
import { RegisterAbstractEngineLoadingScreen } from "../AbstractEngine/abstractEngine.loadingScreen.pure.js";
import { RegisterAbstractEngineAlpha } from "../AbstractEngine/abstractEngine.alpha.pure.js";
import { RegisterAbstractEngineTexture } from "../AbstractEngine/abstractEngine.texture.pure.js";
import { RegisterAbstractEngineCubeTexture } from "../AbstractEngine/abstractEngine.cubeTexture.pure.js";
import { RegisterAbstractEngineQuery } from "../AbstractEngine/abstractEngine.query.pure.js";
import { RegisterAbstractEngineTextureSelector } from "../AbstractEngine/abstractEngine.textureSelector.pure.js";
import { RegisterAbstractEngineTimeQuery } from "../AbstractEngine/abstractEngine.timeQuery.pure.js";
import { RegisterAbstractEngineViews } from "../AbstractEngine/abstractEngine.views.pure.js";
import { RegisterEnginesWebGPUExtensionsEngineRawTexture } from "./Extensions/engine.rawTexture.pure.js";
import { RegisterEnginesWebGPUExtensionsEngineReadTexture } from "./Extensions/engine.readTexture.pure.js";
import { RegisterEnginesWebGPUExtensionsEngineCubeTexture } from "./Extensions/engine.cubeTexture.pure.js";
import { RegisterEnginesWebGPUExtensionsEngineRenderTargetCube } from "./Extensions/engine.renderTargetCube.pure.js";
import { RegisterEnginesWebGPUExtensionsEngineQuery } from "./Extensions/engine.query.pure.js";
import { RegisterEnginesWebGPUExtensionsEngineDynamicTexture } from "./Extensions/engine.dynamicTexture.pure.js";
import { RegisterEnginesWebGPUExtensionsEngineMultiRender } from "./Extensions/engine.multiRender.pure.js";
import { RegisterEnginesWebGPUExtensionsEngineComputeShader } from "./Extensions/engine.computeShader.pure.js";
import { RegisterWebGPUDebugging } from "./Extensions/engine.debugging.pure.js";
import { RegisterEnginesWebGPUExtensionsEngineVideoTexture } from "./Extensions/engine.videoTexture.pure.js";
/**
 * Registers the minimum set of engine extensions required for basic rendering with WebGPU.
 * Includes: DOM binding, render passes, GPU states, and stencil.
 */
export function RegisterCoreWebGPUEngineExtensions() {
    RegisterAbstractEngineDom();
    RegisterAbstractEngineRenderPass();
    RegisterAbstractEngineStates();
    RegisterAbstractEngineStencil();
}
/**
 * Registers the standard set of engine extensions needed by most WebGPU scenes.
 * Includes everything in {@link RegisterCoreWebGPUEngineExtensions} plus
 * file loading, alpha blending, render targets, and render target textures.
 */
export function RegisterStandardWebGPUEngineExtensions() {
    RegisterCoreWebGPUEngineExtensions();
    RegisterAbstractEngineLoadFile();
    RegisterEnginesWebGPUExtensionsEngineAlpha();
    RegisterEnginesWebGPUExtensionsEngineRenderTarget();
    RegisterEnginesWebGPUExtensionsEngineRenderTargetTexture();
}
/**
 * Registers all available engine extensions for the WebGPU engine.
 * Includes everything in {@link RegisterStandardWebGPUEngineExtensions} plus
 * cube textures, raw textures, dynamic textures, multi-render, queries,
 * compute shaders, video textures, debugging, and more.
 */
export function RegisterFullWebGPUEngineExtensions() {
    RegisterStandardWebGPUEngineExtensions();
    RegisterAbstractEngineLoadingScreen();
    RegisterAbstractEngineAlpha();
    RegisterAbstractEngineTexture();
    RegisterAbstractEngineCubeTexture();
    RegisterAbstractEngineQuery();
    RegisterAbstractEngineTextureSelector();
    RegisterAbstractEngineTimeQuery();
    RegisterAbstractEngineViews();
    RegisterEnginesWebGPUExtensionsEngineRawTexture();
    RegisterEnginesWebGPUExtensionsEngineReadTexture();
    RegisterEnginesWebGPUExtensionsEngineCubeTexture();
    RegisterEnginesWebGPUExtensionsEngineRenderTargetCube();
    RegisterEnginesWebGPUExtensionsEngineQuery();
    RegisterEnginesWebGPUExtensionsEngineDynamicTexture();
    RegisterEnginesWebGPUExtensionsEngineMultiRender();
    RegisterEnginesWebGPUExtensionsEngineComputeShader();
    RegisterWebGPUDebugging();
    RegisterEnginesWebGPUExtensionsEngineVideoTexture();
}
//# sourceMappingURL=webgpuEngineRegistration.pure.js.map