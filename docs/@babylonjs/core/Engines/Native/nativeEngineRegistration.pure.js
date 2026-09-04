// --- Core ---
import { RegisterAbstractEngineDom } from "../AbstractEngine/abstractEngine.dom.pure.js";
import { RegisterAbstractEngineRenderPass } from "../AbstractEngine/abstractEngine.renderPass.pure.js";
import { RegisterAbstractEngineStates } from "../AbstractEngine/abstractEngine.states.pure.js";
import { RegisterAbstractEngineStencil } from "../AbstractEngine/abstractEngine.stencil.pure.js";
import { RegisterNativeEngine } from "../nativeEngine.pure.js";
// --- Standard additions ---
import { RegisterAbstractEngineTexture } from "../AbstractEngine/abstractEngine.texture.pure.js";
import { RegisterAbstractEngineLoadFile } from "../AbstractEngine/abstractEngine.loadFile.pure.js";
// --- Full additions ---
import { RegisterAbstractEngineLoadingScreen } from "../AbstractEngine/abstractEngine.loadingScreen.pure.js";
import { RegisterAbstractEngineAlpha } from "../AbstractEngine/abstractEngine.alpha.pure.js";
import { RegisterAbstractEngineCubeTexture } from "../AbstractEngine/abstractEngine.cubeTexture.pure.js";
import { RegisterAbstractEngineQuery } from "../AbstractEngine/abstractEngine.query.pure.js";
import { RegisterAbstractEngineTextureSelector } from "../AbstractEngine/abstractEngine.textureSelector.pure.js";
import { RegisterAbstractEngineTimeQuery } from "../AbstractEngine/abstractEngine.timeQuery.pure.js";
import { RegisterAbstractEngineViews } from "../AbstractEngine/abstractEngine.views.pure.js";
import { RegisterNativeEngineCubeTexture } from "./Extensions/nativeEngine.cubeTexture.pure.js";
import { RegisterValidatedNativeDataStream } from "./validatedNativeDataStream.pure.js";
/**
 * Registers the minimum set of engine extensions required for basic rendering with NativeEngine.
 * Includes: DOM binding, render passes, GPU states, stencil, and the native engine mixins.
 */
export function RegisterCoreNativeEngineExtensions() {
    RegisterAbstractEngineDom();
    RegisterAbstractEngineRenderPass();
    RegisterAbstractEngineStates();
    RegisterAbstractEngineStencil();
    RegisterNativeEngine();
}
/**
 * Registers the standard set of engine extensions needed by most NativeEngine scenes.
 * Includes everything in {@link RegisterCoreNativeEngineExtensions} plus
 * textures and file loading.
 */
export function RegisterStandardNativeEngineExtensions() {
    RegisterCoreNativeEngineExtensions();
    RegisterAbstractEngineTexture();
    RegisterAbstractEngineLoadFile();
}
/**
 * Registers all available engine extensions for the NativeEngine.
 * Includes everything in {@link RegisterStandardNativeEngineExtensions} plus
 * cube textures, queries, views, loading screen, and native-specific extensions.
 */
export function RegisterFullNativeEngineExtensions() {
    RegisterStandardNativeEngineExtensions();
    RegisterAbstractEngineLoadingScreen();
    RegisterAbstractEngineAlpha();
    RegisterAbstractEngineCubeTexture();
    RegisterAbstractEngineQuery();
    RegisterAbstractEngineTextureSelector();
    RegisterAbstractEngineTimeQuery();
    RegisterAbstractEngineViews();
    RegisterNativeEngineCubeTexture();
    RegisterValidatedNativeDataStream();
}
//# sourceMappingURL=nativeEngineRegistration.pure.js.map