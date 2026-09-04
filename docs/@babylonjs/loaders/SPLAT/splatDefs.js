/**
 * Indicator of the parsed ply buffer. A standard ready to use splat or an array of positions for a point cloud
 */
export var Mode;
(function (Mode) {
    Mode[Mode["Splat"] = 0] = "Splat";
    Mode[Mode["PointCloud"] = 1] = "PointCloud";
    Mode[Mode["Mesh"] = 2] = "Mesh";
    Mode[Mode["Reject"] = 3] = "Reject";
})(Mode || (Mode = {}));
//# sourceMappingURL=splatDefs.js.map