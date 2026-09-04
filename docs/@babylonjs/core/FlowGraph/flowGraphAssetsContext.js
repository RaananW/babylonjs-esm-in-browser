/**
 * The type of the assets that flow graph supports
 */
export var FlowGraphAssetType;
(function (FlowGraphAssetType) {
    FlowGraphAssetType["Animation"] = "Animation";
    FlowGraphAssetType["AnimationGroup"] = "AnimationGroup";
    FlowGraphAssetType["Mesh"] = "Mesh";
    FlowGraphAssetType["Material"] = "Material";
    FlowGraphAssetType["Camera"] = "Camera";
    FlowGraphAssetType["Light"] = "Light";
    // Further asset types will be added here when needed.
})(FlowGraphAssetType || (FlowGraphAssetType = {}));
/**
 * Returns the asset with the given index and type from the assets context.
 * @param assetsContext The assets context to get the asset from
 * @param type The type of the asset
 * @param index The index of the asset
 * @param useIndexAsUniqueId If set to true, instead of the index in the array it will search for the unique id of the asset.
 * @returns The asset or null if not found
 */
export function GetFlowGraphAssetWithType(assetsContext, type, index, useIndexAsUniqueId) {
    switch (type) {
        case "Animation" /* FlowGraphAssetType.Animation */:
            return useIndexAsUniqueId
                ? (assetsContext.animations.find((a) => a.uniqueId === index) ?? null)
                : (assetsContext.animations[index] ?? null);
        case "AnimationGroup" /* FlowGraphAssetType.AnimationGroup */:
            return useIndexAsUniqueId
                ? (assetsContext.animationGroups.find((a) => a.uniqueId === index) ?? null)
                : (assetsContext.animationGroups[index] ?? null);
        case "Mesh" /* FlowGraphAssetType.Mesh */:
            return useIndexAsUniqueId
                ? (assetsContext.meshes.find((a) => a.uniqueId === index) ?? null)
                : (assetsContext.meshes[index] ?? null);
        case "Material" /* FlowGraphAssetType.Material */:
            return useIndexAsUniqueId
                ? (assetsContext.materials.find((a) => a.uniqueId === index) ?? null)
                : (assetsContext.materials[index] ?? null);
        case "Camera" /* FlowGraphAssetType.Camera */:
            return useIndexAsUniqueId
                ? (assetsContext.cameras.find((a) => a.uniqueId === index) ?? null)
                : (assetsContext.cameras[index] ?? null);
        case "Light" /* FlowGraphAssetType.Light */:
            return useIndexAsUniqueId
                ? (assetsContext.lights.find((a) => a.uniqueId === index) ?? null)
                : (assetsContext.lights[index] ?? null);
        default:
            return null;
    }
}
//# sourceMappingURL=flowGraphAssetsContext.js.map