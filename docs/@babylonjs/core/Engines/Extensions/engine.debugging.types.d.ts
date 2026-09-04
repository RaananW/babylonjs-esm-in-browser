export {};
/**
 * Note that users may not import this file, so each time we want to call one of them, we must check if it exists.
 * @internal
 */
declare module "../../Engines/abstractEngine.pure.js" {
    interface AbstractEngine {
        /** @internal */
        _debugPushGroup(groupName: string): void;
        /** @internal */
        _debugPopGroup(): void;
        /** @internal */
        _debugInsertMarker(text: string): void;
    }
}
