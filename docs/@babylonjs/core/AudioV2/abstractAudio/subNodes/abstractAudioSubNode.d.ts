import { AbstractNamedAudioNode } from "../abstractAudioNode.js";
import { type AudioEngineV2 } from "../audioEngineV2.js";
/** @internal */
export declare abstract class _AbstractAudioSubNode extends AbstractNamedAudioNode {
    /** @internal */
    protected constructor(name: string, engine: AudioEngineV2);
    /** @internal */
    connect(node: _AbstractAudioSubNode): void;
    /** @internal */
    disconnect(node: _AbstractAudioSubNode): void;
    /** @internal */
    disconnectAll(): void;
}
