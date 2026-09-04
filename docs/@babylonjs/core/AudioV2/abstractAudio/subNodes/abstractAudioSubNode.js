import { AbstractNamedAudioNode } from "../abstractAudioNode.js";
/** @internal */
export class _AbstractAudioSubNode extends AbstractNamedAudioNode {
    /** @internal */
    constructor(name, engine) {
        super(name, engine, 3 /* AudioNodeType.HAS_INPUTS_AND_OUTPUTS */);
    }
    /** @internal */
    connect(node) {
        if (!this._connect(node)) {
            throw new Error("Connect failed");
        }
    }
    /** @internal */
    disconnect(node) {
        if (!this._disconnect(node)) {
            throw new Error("Disconnect failed");
        }
    }
    /** @internal */
    disconnectAll() {
        if (!this._downstreamNodes) {
            throw new Error("Disconnect failed");
        }
        const it = this._downstreamNodes.values();
        for (let next = it.next(); !next.done; next = it.next()) {
            if (!this._disconnect(next.value)) {
                throw new Error("Disconnect failed");
            }
        }
    }
}
//# sourceMappingURL=abstractAudioSubNode.js.map