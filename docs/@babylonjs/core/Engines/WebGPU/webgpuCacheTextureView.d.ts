/**
 * Caches GPUTextureView objects so that render-pass attachments (color, MSAA resolve, depth/stencil)
 * don't recreate a fresh view every time a render target is bound/cleared.
 * Views are keyed on the live GPUTexture object via a WeakMap: once a texture is recreated (e.g. on resize)
 * the old texture becomes unreachable and its cached views are collected along with it, so no manual
 * invalidation is required.
 * @internal
 */
export declare class WebGPUCacheTextureView {
    private _cache;
    getView(texture: GPUTexture, descriptor: GPUTextureViewDescriptor): GPUTextureView;
    private static _GetKey;
}
