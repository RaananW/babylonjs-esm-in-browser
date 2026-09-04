import { type Color4, type Scene, type FrameGraphTextureHandle, type Camera, type FrameGraphObjectList, type IShadowLight, type FrameGraphShadowGeneratorTask, type FrameGraphObjectRendererTask, type FrameGraph, type NodeRenderGraphBlock } from "../../../index.js";
/**
 * Description of a custom block to be used in the node render graph editor
 */
export interface INodeRenderGraphCustomBlockDescription {
    /** Block name. It will be used as the block name in the left menu of the editor. Spaces must be replaced by underscores in the name. */
    name: string;
    /** Description (tooltip) of the block. */
    description: string;
    /** Category of the block. Spaces must be replaced by underscores in the category name. */
    menu: string;
    /** Factory function to create the block. */
    factory: (frameGraph: FrameGraph, scene: Scene) => NodeRenderGraphBlock;
}
/**
 * Interface used to configure the node render graph editor
 */
export interface INodeRenderGraphEditorOptions {
    /** Define the URL to load node editor script from */
    editorURL?: string;
    /** Additional configuration for the FGE */
    nodeRenderGraphEditorConfig?: {
        backgroundColor?: Color4;
        hostScene?: Scene;
        customBlockDescriptions?: INodeRenderGraphCustomBlockDescription[];
    };
}
/**
 * Options that can be passed to the node render graph build method
 */
export interface INodeRenderGraphCreateOptions {
    /** If true, textures created by the node render graph will be visible in the inspector, for easier debugging (default: false) */
    debugTextures?: boolean;
    /** Rebuild the node render graph when the screen is resized (default: true) */
    rebuildGraphOnEngineResize?: boolean;
    /** Defines if the build should log activity (default: false) */
    verbose?: boolean;
    /** Defines if the autoConfigure method should be called when initializing blocks (default: false) */
    autoConfigure?: boolean;
    /** If true, external inputs like object lists and cameras will be filled with default values, taken from the scene. Note that external textures are not concerned (default: true). */
    autoFillExternalInputs?: boolean;
}
/**
 * Defines the kind of connection point for node render graph nodes
 */
export declare enum NodeRenderGraphBlockConnectionPointTypes {
    /** General purpose texture */
    Texture = 1,
    /** Back buffer color texture */
    TextureBackBuffer = 2,
    /** Back buffer depth/stencil attachment */
    TextureBackBufferDepthStencilAttachment = 4,
    /** Depth/stencil attachment */
    TextureDepthStencilAttachment = 8,
    /** Depth (in view space) geometry texture */
    TextureViewDepth = 16,
    /** Normal (in view space) geometry texture */
    TextureViewNormal = 32,
    /** Albedo geometry texture */
    TextureAlbedo = 64,
    /** Reflectivity geometry texture */
    TextureReflectivity = 128,
    /** Position (in world space) geometry texture */
    TextureWorldPosition = 256,
    /** Velocity geometry texture */
    TextureVelocity = 512,
    /** Irradiance geometry texture */
    TextureIrradiance = 1024,
    /** Albedo (sqrt) geometry texture */
    TextureAlbedoSqrt = 2048,
    /** Depth (in screen space) geometry texture */
    TextureScreenDepth = 4096,
    /** Normal (in world space) geometry texture */
    TextureWorldNormal = 8192,
    /** Position (in local space) geometry texture */
    TextureLocalPosition = 16384,
    /** Linear velocity geometry texture */
    TextureLinearVelocity = 32768,
    /** Normalied depth (in view space) geometry texture */
    TextureNormalizedViewDepth = 65536,
    /** Bit field for all textures but back buffer depth/stencil */
    TextureAllButBackBufferDepthStencil = 1048571,
    /** Bit field for all textures but back buffer color and depth/stencil */
    TextureAllButBackBuffer = 1048569,
    /** Bit field for all textures */
    TextureAll = 1048575,
    /** Resource container */
    ResourceContainer = 1048576,
    /** Shadow generator */
    ShadowGenerator = 2097152,
    /** Light */
    ShadowLight = 4194304,
    /** Camera */
    Camera = 16777216,
    /** List of objects (meshes, particle systems, sprites) */
    ObjectList = 33554432,
    /** Detect type based on connection */
    AutoDetect = 268435456,
    /** Output type that will be defined by input type */
    BasedOnInput = 536870912,
    /** Undefined */
    Undefined = 1073741824,
    /** Custom object */
    Object = 2147483648,
    /** Bitmask of all types */
    All = 4294967295
}
/**
 * Enum used to define the compatibility state between two connection points
 */
export declare enum NodeRenderGraphConnectionPointCompatibilityStates {
    /** Points are compatibles */
    Compatible = 0,
    /** Points are incompatible because of their types */
    TypeIncompatible = 1,
    /** Points are incompatible because they are in the same hierarchy **/
    HierarchyIssue = 2
}
/**
 * Defines the direction of a connection point
 */
export declare enum NodeRenderGraphConnectionPointDirection {
    /** Input */
    Input = 0,
    /** Output */
    Output = 1
}
/**
 * Defines the type of a connection point value
 */
export type NodeRenderGraphBlockConnectionPointValueType = FrameGraphTextureHandle | Camera | FrameGraphObjectList | IShadowLight | FrameGraphShadowGeneratorTask | FrameGraphObjectRendererTask;
