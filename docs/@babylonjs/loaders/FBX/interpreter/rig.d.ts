import { type FBXObjectMap } from "./connections.js";
import { type FBXBoneData, type FBXSkinData } from "./skeleton.js";
export type FBXRigBoneData = FBXBoneData;
export interface FBXSkinBindingData {
    skinId: number;
    geometryId: number;
    rigId: string;
    skinBoneIndexToRigBoneIndex: number[];
    clusterModelIds: Set<number>;
}
export interface FBXRigData {
    id: string;
    rootModelIds: number[];
    bones: FBXRigBoneData[];
    modelIdToBoneIndex: Map<number, number>;
    clusterModelIds: Set<number>;
    skinBindings: FBXSkinBindingData[];
    warnings: string[];
}
export declare function resolveRigs(objectMap: FBXObjectMap, skins: FBXSkinData[]): FBXRigData[];
