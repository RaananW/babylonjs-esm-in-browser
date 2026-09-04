import { type Nullable, type NodeRenderGraphBlock, type INodeRenderGraphCreateOptions, type INodeRenderGraphEditorOptions, type Scene, type INodeRenderGraphCustomBlockDescription, type Immutable, type Camera } from "../../index.js";
import { Observable } from "../../Misc/observable.js";
import { NodeRenderGraphOutputBlock } from "./Blocks/outputBlock.pure.js";
import { FrameGraph } from "../frameGraph.js";
import { NodeRenderGraphInputBlock } from "./Blocks/inputBlock.pure.js";
/**
 * Defines a node render graph
 */
export declare class NodeRenderGraph {
    private static _BuildIdGenerator;
    private _buildId;
    /** Define the Url to load node editor script */
    static EditorURL: string;
    /** Define the Url to load snippets */
    static SnippetUrl: string;
    /** Description of custom blocks to use in the node render graph editor */
    static CustomBlockDescriptions: INodeRenderGraphCustomBlockDescription[];
    private BJSNODERENDERGRAPHEDITOR;
    /** @returns the inspector from bundle or global */
    private _getGlobalNodeRenderGraphEditor;
    /**
     * Gets or sets data used by visual editor
     * @see https://nrge.babylonjs.com
     */
    editorData: any;
    /**
     * Gets an array of blocks that needs to be serialized even if they are not yet connected
     */
    attachedBlocks: NodeRenderGraphBlock[];
    /**
     * Observable raised before the node render graph is built
     */
    onBeforeBuildObservable: Observable<FrameGraph>;
    /**
     * Observable raised after the node render graph is built
     * Note that this is the same observable as the one in the underlying FrameGraph!
     */
    get onBuildObservable(): Observable<FrameGraph>;
    /**
     * Observable raised when an error is detected
     */
    onBuildErrorObservable: Observable<string>;
    /** Gets or sets the RenderGraphOutputBlock used to gather the final node render graph data */
    outputBlock: Nullable<NodeRenderGraphOutputBlock>;
    /**
     * Snippet ID if the graph was created from the snippet server
     */
    snippetId: string;
    /**
     * The name of the node render graph
     */
    name: string;
    /**
     * A free comment about the graph
     */
    comment: string;
    private readonly _engine;
    private readonly _scene;
    private readonly _resizeObserver;
    private readonly _frameGraph;
    private readonly _options;
    /**
     * Gets the frame graph used by this node render graph
     */
    get frameGraph(): FrameGraph;
    /**
     * Gets the scene used by this node render graph
     * @returns the scene used by this node render graph
     */
    getScene(): Scene;
    /**
     * Gets the options used to create this node render graph
     */
    get options(): Immutable<INodeRenderGraphCreateOptions>;
    /**
     * Creates a new node render graph
     * @param name defines the name of the node render graph
     * @param scene defines the scene to use to execute the graph
     * @param options defines the options to use when creating the graph
     */
    constructor(name: string, scene: Scene, options?: INodeRenderGraphCreateOptions);
    /**
     * Gets the current class name ("NodeRenderGraph")
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets a block by its name
     * @param name defines the name of the block to retrieve
     * @returns the required block or null if not found
     */
    getBlockByName<T extends NodeRenderGraphBlock>(name: string): Nullable<T>;
    /**
     * Get a block using a predicate
     * @param predicate defines the predicate used to find the good candidate
     * @returns the required block or null if not found
     */
    getBlockByPredicate<T extends NodeRenderGraphBlock>(predicate: (block: NodeRenderGraphBlock) => boolean): Nullable<T>;
    /**
     * Get all blocks that match a predicate
     * @param predicate defines the predicate used to find the good candidate(s)
     * @returns the list of blocks found
     */
    getBlocksByPredicate<T extends NodeRenderGraphBlock>(predicate: (block: NodeRenderGraphBlock) => boolean): T[];
    /**
     * Gets the list of input blocks attached to this material
     * @returns an array of InputBlocks
     */
    getInputBlocks(): NodeRenderGraphInputBlock[];
    /**
     * Replaces a camera in all camera input blocks of this node render graph.
     * If the current camera is found in any input block, it is replaced by the new camera,
     * optionally updating the scene's pointer camera and rebuilding the graph.
     * @param currentCamera The camera to replace.
     * @param newCamera The new camera to assign to the matching input blocks.
     * @param updateCameraToUseForPointers If true (default), updates `scene.cameraToUseForPointers` to the new camera when a replacement occurs.
     * @param rebuildGraph If true (default), rebuilds the graph asynchronously after the replacement.
     * @returns A promise that resolves to true if at least one input block was updated, false otherwise.
     */
    replaceCameraAsync(currentCamera: Nullable<Camera>, newCamera: Camera, updateCameraToUseForPointers?: boolean, rebuildGraph?: boolean): Promise<boolean>;
    /**
     * Launch the node render graph editor
     * @param config Define the configuration of the editor
     * @returns a promise fulfilled when the node editor is visible
     */
    edit(config?: INodeRenderGraphEditorOptions): Promise<void>;
    /**
     * Creates the node editor window.
     * @param additionalConfig Additional configuration for the FGE
     */
    private _createNodeEditor;
    /**
     * Build the final list of blocks that will be executed by the "execute" method.
     * It also builds the underlying frame graph unless specified otherwise.
     * @param dontBuildFrameGraph If the underlying frame graph should not be built (default: false)
     * @param waitForReadiness If the method should wait for the frame graph to be ready before resolving (default: true). Note that this parameter has no effect if "dontBuildFrameGraph" is true.
     * @param setAsSceneFrameGraph If the built frame graph must be set as the scene's frame graph (default: true)
     */
    buildAsync(dontBuildFrameGraph?: boolean, waitForReadiness?: boolean, setAsSceneFrameGraph?: boolean): Promise<void>;
    private _autoFillExternalInputs;
    /**
     * Returns a promise that resolves when the node render graph is ready to be executed
     * This method must be called after the graph has been built (NodeRenderGraph.build called)!
     * @param timeStep Time step in ms between retries (default is 16)
     * @param maxTimeout Maximum time in ms to wait for the graph to be ready (default is 10000)
     * @returns The promise that resolves when the graph is ready
     */
    whenReadyAsync(timeStep?: number, maxTimeout?: number): Promise<void>;
    /**
     * Execute the graph (the graph must have been built before!)
     */
    execute(): void;
    private _initializeBlock;
    /**
     * Clear the current graph
     */
    clear(): void;
    /**
     * Remove a block from the current graph
     * @param block defines the block to remove
     */
    removeBlock(block: NodeRenderGraphBlock): void;
    /**
     * Clear the current graph and load a new one from a serialization object
     * @param source defines the JSON representation of the graph
     * @param merge defines whether or not the source must be merged or replace the current content
     */
    parseSerializedObject(source: any, merge?: boolean): void;
    private _restoreConnections;
    /**
     * Generate a string containing the code declaration required to create an equivalent of this node render graph
     * @returns a string
     */
    generateCode(): string;
    private _gatherBlocks;
    /**
     * Clear the current graph and set it to a default state
     */
    setToDefault(): void;
    /**
     * Makes a duplicate of the current node render graph.
     * Note that you should call buildAsync() on the returned graph to make it usable.
     * @param name defines the name to use for the new node render graph
     * @returns the new node render graph
     */
    clone(name: string): NodeRenderGraph;
    /**
     * Serializes this node render graph in a JSON representation
     * @param selectedBlocks defines the list of blocks to save (if null the whole node render graph will be saved)
     * @returns the serialized node render graph object
     */
    serialize(selectedBlocks?: NodeRenderGraphBlock[]): any;
    /**
     * Disposes the resources
     */
    dispose(): void;
    /**
     * Creates a new node render graph set to default basic configuration
     * @param name defines the name of the node render graph
     * @param scene defines the scene to use
     * @param nodeRenderGraphOptions defines options to use when creating the node render graph
     * @returns a new NodeRenderGraph
     */
    static CreateDefaultAsync(name: string, scene: Scene, nodeRenderGraphOptions?: INodeRenderGraphCreateOptions): Promise<NodeRenderGraph>;
    /**
     * Creates a node render graph from parsed graph data
     * @param source defines the JSON representation of the node render graph
     * @param scene defines the scene to use
     * @param nodeRenderGraphOptions defines options to use when creating the node render
     * @param skipBuild defines whether to skip building the node render graph (default is true)
     * @returns a new node render graph
     */
    static Parse(source: any, scene: Scene, nodeRenderGraphOptions?: INodeRenderGraphCreateOptions, skipBuild?: boolean): NodeRenderGraph;
    /**
     * Creates a node render graph from a snippet saved by the node render graph editor
     * @param snippetId defines the snippet to load
     * @param scene defines the scene to use
     * @param nodeRenderGraphOptions defines options to use when creating the node render graph
     * @param nodeRenderGraph defines a node render graph to update (instead of creating a new one)
     * @param skipBuild defines whether to skip building the node render graph (default is true)
     * @returns a promise that will resolve to the new node render graph
     */
    static ParseFromSnippetAsync(snippetId: string, scene: Scene, nodeRenderGraphOptions?: INodeRenderGraphCreateOptions, nodeRenderGraph?: NodeRenderGraph, skipBuild?: boolean): Promise<NodeRenderGraph>;
}
