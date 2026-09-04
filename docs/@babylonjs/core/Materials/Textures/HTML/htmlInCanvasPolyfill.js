/** This module has no top-level side effects: it only declares the optional HTML-in-Canvas polyfill installer */
import { Logger } from "../../../Misc/logger.js";
let _InstalledModule = null;
/**
 * Detects whether the browser supports the WICG HTML-in-Canvas API natively (or already has it installed).
 * @returns true when an HTMLCanvasElement exposes `captureElementImage`
 */
export function IsHtmlInCanvasSupportedNatively() {
    if (typeof document === "undefined") {
        return false;
    }
    const canvas = document.createElement("canvas");
    return typeof canvas.captureElementImage === "function";
}
/**
 * Lazily installs the WICG HTML-in-Canvas polyfill (`three-html-render`) so that {@link HtmlTexture} and the
 * interaction managers work in browsers that do not yet ship the native API.
 *
 * The polyfill is an optional dependency: it is imported on demand and never bundled into Babylon. When the
 * browser already supports the API natively, this is a no-op unless `force` is set or the `?polyfillHIC` URL
 * flag is present.
 * @param options optional installation configuration
 * @returns a promise that resolves to true when the polyfill was installed, false otherwise
 */
export async function InstallHtmlInCanvasPolyfill(options = {}) {
    const force = options.force ?? _HasPolyfillUrlFlag();
    if (!force && IsHtmlInCanvasSupportedNatively()) {
        return false;
    }
    const module = options.polyfillModule ?? (await _ImportPolyfill(options.moduleSpecifier ?? "three-html-render"));
    if (!module || typeof module.installHtmlInCanvasPolyfill !== "function") {
        Logger.Warn("HTML-in-Canvas: the polyfill module does not expose installHtmlInCanvasPolyfill; nothing was installed.");
        return false;
    }
    module.installHtmlInCanvasPolyfill(force ? { force: true } : undefined);
    _InstalledModule = module;
    return true;
}
/**
 * Removes a polyfill previously installed by {@link InstallHtmlInCanvasPolyfill}.
 */
export function UninstallHtmlInCanvasPolyfill() {
    if (_InstalledModule && typeof _InstalledModule.uninstallHtmlInCanvasPolyfill === "function") {
        _InstalledModule.uninstallHtmlInCanvasPolyfill();
    }
    _InstalledModule = null;
}
async function _ImportPolyfill(specifier) {
    try {
        // The specifier is a variable so bundlers leave this as a runtime import and the optional package is
        // not required to be installed at build time. The UMD/global build cannot resolve a bare module
        // specifier, so this dynamic import is neutralized there (see rewriteDynamicExternalImportsPlugin);
        // UMD consumers should pass `polyfillModule` instead.
        return (await import(/* @vite-ignore */ /* webpackIgnore: true */ specifier));
    }
    catch {
        Logger.Warn(`HTML-in-Canvas: could not load polyfill module "${specifier}". Install three-html-render or pass a polyfillModule.`);
        return null;
    }
}
function _HasPolyfillUrlFlag() {
    return typeof window !== "undefined" && !!window.location && /[?&]polyfillHIC\b/i.test(window.location.search);
}
//# sourceMappingURL=htmlInCanvasPolyfill.js.map