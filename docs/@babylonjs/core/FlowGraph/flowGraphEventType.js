/**
 * Event types supported by the FlowGraph.
 */
export var FlowGraphEventType;
(function (FlowGraphEventType) {
    FlowGraphEventType["SceneReady"] = "SceneReady";
    FlowGraphEventType["SceneDispose"] = "SceneDispose";
    FlowGraphEventType["SceneBeforeRender"] = "SceneBeforeRender";
    FlowGraphEventType["SceneAfterRender"] = "SceneAfterRender";
    FlowGraphEventType["MeshPick"] = "MeshPick";
    FlowGraphEventType["PointerDown"] = "PointerDown";
    FlowGraphEventType["PointerUp"] = "PointerUp";
    FlowGraphEventType["PointerMove"] = "PointerMove";
    FlowGraphEventType["PointerOver"] = "PointerOver";
    FlowGraphEventType["PointerOut"] = "PointerOut";
    FlowGraphEventType["KeyDown"] = "KeyDown";
    FlowGraphEventType["KeyUp"] = "KeyUp";
    FlowGraphEventType["NoTrigger"] = "NoTrigger";
})(FlowGraphEventType || (FlowGraphEventType = {}));
//# sourceMappingURL=flowGraphEventType.js.map