import { extractBoneTransform, isSkeletonModel } from "./skeleton.js";
import { cleanFBXName, getPropertyValue } from "../types/fbxTypes.js";
export function resolveRigs(objectMap, skins) {
    if (skins.length === 0) {
        return [];
    }
    const groupByRoot = new Map();
    for (const skin of skins) {
        const clusterModelIds = skin.bones.filter((bone) => bone.isCluster).map((bone) => bone.modelId);
        if (clusterModelIds.length === 0) {
            continue;
        }
        const rootModelId = findRigGroupingRoot(clusterModelIds, objectMap);
        const group = groupByRoot.get(rootModelId);
        if (group) {
            group.push(skin);
        }
        else {
            groupByRoot.set(rootModelId, [skin]);
        }
    }
    return Array.from(groupByRoot.entries())
        .sort(([a], [b]) => compareNumber(a, b))
        .map(([rootModelId, groupSkins]) => buildRig(rootModelId, groupSkins, objectMap));
}
function buildRig(rootModelId, skins, objectMap) {
    const clusterModelIds = new Set();
    const rigModelIds = new Set();
    const sourceBonesByModelId = new Map();
    const sourceOrderByModelId = new Map();
    for (const skin of skins) {
        for (const bone of skin.bones) {
            if (!sourceOrderByModelId.has(bone.modelId)) {
                sourceOrderByModelId.set(bone.modelId, sourceOrderByModelId.size);
            }
            let sources = sourceBonesByModelId.get(bone.modelId);
            if (!sources) {
                sources = [];
                sourceBonesByModelId.set(bone.modelId, sources);
            }
            sources.push(bone);
            if (!bone.isCluster) {
                continue;
            }
            clusterModelIds.add(bone.modelId);
            for (const ancestorId of getModelAncestorChain(bone.modelId, objectMap)) {
                rigModelIds.add(ancestorId);
            }
        }
    }
    const warnings = collectTransformLinkWarnings(sourceBonesByModelId);
    const preferredBoneByModelId = new Map();
    for (const [modelId, sources] of Array.from(sourceBonesByModelId)) {
        preferredBoneByModelId.set(modelId, choosePreferredBoneSource(sources));
    }
    const parentByModelId = buildParentMap(rigModelIds, objectMap);
    const orderedModelIds = orderParentsBeforeChildren(rigModelIds, parentByModelId, sourceOrderByModelId);
    const bones = [];
    const modelIdToBoneIndex = new Map();
    for (const modelId of orderedModelIds) {
        const sourceBone = preferredBoneByModelId.get(modelId) ?? createFallbackBone(modelId, objectMap);
        if (!sourceBone) {
            continue;
        }
        const parentModelId = parentByModelId.get(modelId);
        const parentIndex = parentModelId === undefined ? -1 : (modelIdToBoneIndex.get(parentModelId) ?? -1);
        const index = bones.length;
        const bone = {
            ...sourceBone,
            index,
            parentIndex,
            isCluster: clusterModelIds.has(modelId),
        };
        bones.push(bone);
        modelIdToBoneIndex.set(modelId, index);
    }
    const skinBindings = skins.map((skin) => buildSkinBinding(skin, `rig_${rootModelId.toString()}`, modelIdToBoneIndex));
    return {
        id: `rig_${rootModelId.toString()}`,
        rootModelIds: bones.filter((bone) => bone.parentIndex < 0).map((bone) => bone.modelId),
        bones,
        modelIdToBoneIndex,
        clusterModelIds,
        skinBindings,
        warnings,
    };
}
function buildSkinBinding(skin, rigId, modelIdToBoneIndex) {
    const skinBoneIndexToRigBoneIndex = skin.bones.map((bone) => {
        const rigBoneIndex = modelIdToBoneIndex.get(bone.modelId);
        if (rigBoneIndex === undefined && bone.isCluster) {
            throw new Error(`FBX rig resolver: cluster bone ${bone.name} is missing from resolved rig ${rigId}`);
        }
        return rigBoneIndex ?? -1;
    });
    return {
        skinId: skin.id,
        geometryId: skin.geometryId,
        rigId,
        skinBoneIndexToRigBoneIndex,
        clusterModelIds: new Set(skin.bones.filter((bone) => bone.isCluster).map((bone) => bone.modelId)),
    };
}
function findRigGroupingRoot(clusterModelIds, objectMap) {
    const lca = findLowestCommonAncestor(clusterModelIds, objectMap) ?? clusterModelIds[0];
    let root = lca;
    let parentId = findModelParentId(root, objectMap);
    while (parentId !== undefined) {
        const parentNode = objectMap.objects.get(parentId);
        if (!parentNode || parentNode.name !== "Model" || !isSkeletonModel(parentNode)) {
            break;
        }
        root = parentId;
        parentId = findModelParentId(parentId, objectMap);
    }
    return root;
}
function findLowestCommonAncestor(modelIds, objectMap) {
    if (modelIds.length === 0) {
        return undefined;
    }
    const chains = modelIds.map((modelId) => getModelAncestorChain(modelId, objectMap));
    const common = new Set(chains[0]);
    for (const chain of chains.slice(1)) {
        for (const modelId of Array.from(common)) {
            if (!chain.includes(modelId)) {
                common.delete(modelId);
            }
        }
    }
    return chains[0].find((modelId) => common.has(modelId));
}
function getModelAncestorChain(modelId, objectMap) {
    const chain = [];
    let currentId = modelId;
    while (currentId !== undefined) {
        const node = objectMap.objects.get(currentId);
        if (!node || node.name !== "Model") {
            break;
        }
        chain.push(currentId);
        currentId = findModelParentId(currentId, objectMap);
    }
    return chain;
}
function buildParentMap(modelIds, objectMap) {
    const parentByModelId = new Map();
    for (const modelId of Array.from(modelIds)) {
        const parentId = findModelParentId(modelId, objectMap);
        if (parentId !== undefined && modelIds.has(parentId)) {
            parentByModelId.set(modelId, parentId);
        }
    }
    return parentByModelId;
}
function orderParentsBeforeChildren(modelIds, parentByModelId, sourceOrderByModelId) {
    const childrenByModelId = new Map();
    for (const modelId of Array.from(modelIds)) {
        const parentId = parentByModelId.get(modelId);
        if (parentId === undefined) {
            continue;
        }
        let children = childrenByModelId.get(parentId);
        if (!children) {
            children = [];
            childrenByModelId.set(parentId, children);
        }
        children.push(modelId);
    }
    for (const children of Array.from(childrenByModelId.values())) {
        children.sort((a, b) => compareSourceOrder(a, b, sourceOrderByModelId));
    }
    const roots = Array.from(modelIds)
        .filter((modelId) => !parentByModelId.has(modelId))
        .sort((a, b) => compareSourceOrder(a, b, sourceOrderByModelId));
    const ordered = [];
    const queue = [...roots];
    while (queue.length > 0) {
        const modelId = queue.shift();
        ordered.push(modelId);
        queue.push(...(childrenByModelId.get(modelId) ?? []));
    }
    return ordered;
}
function findModelParentId(modelId, objectMap) {
    const parentConnection = objectMap.connections.find((conn) => conn.type === "OO" && conn.childId === modelId && objectMap.objects.get(conn.parentId)?.name === "Model");
    return parentConnection?.parentId;
}
function choosePreferredBoneSource(sources) {
    return (sources.find((bone) => bone.isCluster && bone.transformLinkMatrix) ??
        sources.find((bone) => bone.isCluster) ??
        sources.find((bone) => bone.modelBindPoseMatrix) ??
        sources[0]);
}
function collectTransformLinkWarnings(sourceBonesByModelId) {
    const warnings = [];
    for (const [modelId, sources] of Array.from(sourceBonesByModelId)) {
        const matrices = sources.filter((bone) => bone.isCluster && bone.transformLinkMatrix).map((bone) => bone.transformLinkMatrix);
        if (matrices.length < 2) {
            continue;
        }
        const first = matrices[0];
        if (matrices.some((matrix) => !areMatricesEquivalent(first, matrix, 1e-5))) {
            warnings.push(`Model ${modelId.toString()} has differing Cluster.TransformLink matrices across skins`);
        }
    }
    return warnings;
}
function areMatricesEquivalent(a, b, epsilon) {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (Math.abs(a[i] - b[i]) > epsilon) {
            return false;
        }
    }
    return true;
}
function createFallbackBone(modelId, objectMap) {
    const modelNode = objectMap.objects.get(modelId);
    if (!modelNode || modelNode.name !== "Model") {
        return null;
    }
    const transform = extractBoneTransform(modelNode);
    return {
        modelId,
        name: cleanFBXName(getPropertyValue(modelNode, 1) ?? `Bone${modelId.toString()}`),
        index: -1,
        parentIndex: -1,
        isCluster: false,
        translation: transform.translation,
        rotation: transform.rotation,
        preRotation: transform.preRotation,
        postRotation: transform.postRotation,
        rotationPivot: transform.rotationPivot,
        scalingPivot: transform.scalingPivot,
        rotationOffset: transform.rotationOffset,
        scalingOffset: transform.scalingOffset,
        scale: transform.scale,
        rotationOrder: transform.rotationOrder,
        inheritType: transform.inheritType,
        clusterMode: "Unknown",
        bindPoseMatrix: null,
        transformLinkMatrix: null,
        transformAssociateModelMatrix: null,
        modelBindPoseMatrix: null,
        diagnostics: [],
    };
}
function compareNumber(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}
function compareSourceOrder(a, b, sourceOrderByModelId) {
    const aOrder = sourceOrderByModelId.get(a) ?? Number.MAX_SAFE_INTEGER;
    const bOrder = sourceOrderByModelId.get(b) ?? Number.MAX_SAFE_INTEGER;
    return aOrder - bOrder || compareNumber(a, b);
}
//# sourceMappingURL=rig.js.map