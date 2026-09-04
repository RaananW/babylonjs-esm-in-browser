/**
 * Adds common sub graph functionality to an audio node.
 *
 * Audio nodes such as static sounds, streaming sounds, and buses can use audio sub graphs to process audio internally
 * before sending it to connected downstream audio nodes. This is useful for applying effects, spatial audio, and other
 * audio processing tasks common to multiple audio node classes.
 *
 * A key feature of audio sub graphs is their audio sub nodes are created asynchronously on demand so the minimum set
 * of sub nodes are used at all times to save memory and CPU resources. The tradeoff is a small delay when first
 * setting a property backed by a sub node. This delay is avoided by using the appropriate options to initialize the
 * sub node on creation, e.g. `spatialEnabled` and `stereoEnabled`, or by setting any creation option backed by the
 * sub node, e.g. `spatialPosition` and `stereoPan`.
 *
 * @internal
 */
export class _AbstractAudioSubGraph {
    constructor() {
        this._createSubNodePromises = {};
        this._isDisposed = false;
        this._subNodes = {};
        this._onSubNodeDisposed = (node) => {
            const subNode = node;
            delete this._subNodes[subNode.name];
            this._onSubNodesChanged();
        };
    }
    /**
     * Executes the given callback with the named sub node, creating the sub node if needed.
     *
     * @param name The name of the sub node
     * @param callback The function to call with the named sub node
     *
     * @internal
     */
    callOnSubNode(name, callback) {
        const node = this.getSubNode(name);
        if (node) {
            callback(node);
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-floating-promises, github/no-then
        this._createSubNodePromisesResolvedAsync().then(() => {
            const node = this.getSubNode(name);
            if (node) {
                callback(node);
                return;
            }
            // eslint-disable-next-line @typescript-eslint/no-floating-promises, github/no-then
            this.createAndAddSubNodeAsync(name).then((node) => {
                callback(node);
            });
        });
    }
    /**
     * Creates the named subnode and adds it to the sub graph.
     *
     * @param name The name of the sub node.
     * @returns A promise that resolves to the created sub node.
     *
     * @internal
     */
    // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
    createAndAddSubNodeAsync(name) {
        var _a;
        // eslint-disable-next-line github/no-then
        (_a = this._createSubNodePromises)[name] || (_a[name] = this._createSubNode(name).then((node) => {
            this._addSubNode(node);
            return node;
        }));
        return this._createSubNodePromises[name];
    }
    /**
     * Releases associated resources.
     *
     * @internal
     */
    dispose() {
        this._isDisposed = true;
        const subNodes = Object.values(this._subNodes);
        for (const subNode of subNodes) {
            subNode.dispose();
        }
        this._subNodes = {};
        this._createSubNodePromises = {};
    }
    /**
     * Gets a previously created sub node.
     *
     * @param name - The name of the sub node
     * @returns The named sub node, or `null` if it has not been created, yet
     *
     * @internal
     * */
    getSubNode(name) {
        return this._subNodes[name] ?? null;
    }
    /**
     * Removes a sub node from the sub graph.
     *
     * @param subNode - The sub node to remove
     * @returns A promise that resolves when the sub node is removed
     *
     * @internal
     */
    async removeSubNodeAsync(subNode) {
        if (!subNode) {
            return;
        }
        await this._createSubNodePromisesResolvedAsync();
        const name = subNode.name;
        if (this._subNodes[name]) {
            delete this._subNodes[name];
        }
        delete this._createSubNodePromises[name];
        this._onSubNodesChanged();
    }
    async _createSubNodePromisesResolvedAsync() {
        return await Promise.all(Object.values(this._createSubNodePromises));
    }
    _addSubNode(node) {
        if (this._isDisposed) {
            node.dispose();
            return;
        }
        this._subNodes[node.name] = node;
        node.onDisposeObservable.addOnce(this._onSubNodeDisposed);
        this._onSubNodesChanged();
    }
}
//# sourceMappingURL=abstractAudioSubGraph.js.map