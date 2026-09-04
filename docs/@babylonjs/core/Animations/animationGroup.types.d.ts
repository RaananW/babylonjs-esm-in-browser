import { type AnimationGroupClipFrames, type AnimationGroupClipFramesInPlace, type AnimationGroupClipInPlace, type AnimationGroupClipKeys, type AnimationGroupClipKeysInPlace, type AnimationGroupMakeAnimationAdditive, type AnimationGroupMergeAnimationGroups, type AnimationGroupParse } from "./animationGroup.pure.js";
type AnimationGroupClipFramesType = typeof AnimationGroupClipFrames;
type AnimationGroupClipFramesInPlaceType = typeof AnimationGroupClipFramesInPlace;
type AnimationGroupClipInPlaceType = typeof AnimationGroupClipInPlace;
type AnimationGroupClipKeysType = typeof AnimationGroupClipKeys;
type AnimationGroupClipKeysInPlaceType = typeof AnimationGroupClipKeysInPlace;
type AnimationGroupMakeAnimationAdditiveType = typeof AnimationGroupMakeAnimationAdditive;
type AnimationGroupMergeAnimationGroupsType = typeof AnimationGroupMergeAnimationGroups;
type AnimationGroupParseType = typeof AnimationGroupParse;
declare module "./animationGroup.pure.js" {
    namespace AnimationGroup {
        let ClipFrames: AnimationGroupClipFramesType;
        let ClipFramesInPlace: AnimationGroupClipFramesInPlaceType;
        let ClipInPlace: AnimationGroupClipInPlaceType;
        let ClipKeys: AnimationGroupClipKeysType;
        let ClipKeysInPlace: AnimationGroupClipKeysInPlaceType;
        let MakeAnimationAdditive: AnimationGroupMakeAnimationAdditiveType;
        let MergeAnimationGroups: AnimationGroupMergeAnimationGroupsType;
        let Parse: AnimationGroupParseType;
    }
}
export {};
