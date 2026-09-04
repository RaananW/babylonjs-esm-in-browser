/** This module has no top-level side effects: it only declares the optional HTML-in-Canvas polyfill installer */
/**
 * Shape of the `three-html-render` polyfill module (only the parts this wrapper uses).
 */
export interface IHtmlInCanvasPolyfillModule {
    /** Installs the WICG HTML-in-Canvas polyfill onto the relevant DOM prototypes. */
    installHtmlInCanvasPolyfill?: (options?: {
        force?: boolean;
    }) => void;
    /** Removes a previously installed polyfill. */
    uninstallHtmlInCanvasPolyfill?: () => void;
}
/**
 * Options for {@link InstallHtmlInCanvasPolyfill}.
 */
export interface IInstallHtmlInCanvasPolyfillOptions {
    /** Install the polyfill even when the browser already supports the API natively (default false). */
    force?: boolean;
    /** Module specifier to lazily import the polyfill from (default `"three-html-render"`). */
    moduleSpecifier?: string;
    /** A pre-imported polyfill module to use instead of dynamically importing one. */
    polyfillModule?: IHtmlInCanvasPolyfillModule;
}
/**
 * Detects whether the browser supports the WICG HTML-in-Canvas API natively (or already has it installed).
 * @returns true when an HTMLCanvasElement exposes `captureElementImage`
 */
export declare function IsHtmlInCanvasSupportedNatively(): boolean;
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
export declare function InstallHtmlInCanvasPolyfill(options?: IInstallHtmlInCanvasPolyfillOptions): Promise<boolean>;
/**
 * Removes a polyfill previously installed by {@link InstallHtmlInCanvasPolyfill}.
 */
export declare function UninstallHtmlInCanvasPolyfill(): void;
