import { type Nullable } from "../../types.js";
import { type IMainAudioBusOptions, MainAudioBus } from "../abstractAudio/mainAudioBus.js";
import { _WebAudioBaseSubGraph } from "./subNodes/webAudioBaseSubGraph.js";
import { type _WebAudioEngine } from "./webAudioEngine.js";
import { type IWebAudioInNode, type IWebAudioSuperNode } from "./webAudioNode.js";
/** @internal */
export declare class _WebAudioMainBus extends MainAudioBus implements IWebAudioSuperNode {
    protected _subGraph: _WebAudioBaseSubGraph;
    /** @internal */
    readonly engine: _WebAudioEngine;
    /** @internal */
    constructor(name: string, engine: _WebAudioEngine);
    /** @internal */
    _initAsync(options: Partial<IMainAudioBusOptions>): Promise<void>;
    /** @internal */
    dispose(): void;
    /** @internal */
    get _inNode(): Nullable<AudioNode>;
    /** @internal */
    get _outNode(): Nullable<AudioNode>;
    protected _connect(node: IWebAudioInNode): boolean;
    protected _disconnect(node: IWebAudioInNode): boolean;
    /** @internal */
    getClassName(): string;
    private static _SubGraph;
}
