import { type AnimationAppendSerializedAnimations, type AnimationCreateAndStartAnimation, type AnimationCreateAndStartHierarchyAnimation, type AnimationCreateFromSnippetAsync, type AnimationCreateMergeAndStartAnimation, type AnimationCreateAnimation, type AnimationMakeAnimationAdditive, type AnimationParse, type AnimationParseFromFileAsync, type AnimationParseFromSnippetAsync, type AnimationTransitionTo } from "./animation.pure.js";
type AnimationAppendSerializedAnimationsType = typeof AnimationAppendSerializedAnimations;
type AnimationCreateAndStartAnimationType = typeof AnimationCreateAndStartAnimation;
type AnimationCreateAndStartHierarchyAnimationType = typeof AnimationCreateAndStartHierarchyAnimation;
type AnimationCreateFromSnippetAsyncType = typeof AnimationCreateFromSnippetAsync;
type AnimationCreateMergeAndStartAnimationType = typeof AnimationCreateMergeAndStartAnimation;
type AnimationCreateAnimationType = typeof AnimationCreateAnimation;
type AnimationMakeAnimationAdditiveType = typeof AnimationMakeAnimationAdditive;
type AnimationParseType = typeof AnimationParse;
type AnimationParseFromFileAsyncType = typeof AnimationParseFromFileAsync;
type AnimationParseFromSnippetAsyncType = typeof AnimationParseFromSnippetAsync;
type AnimationTransitionToType = typeof AnimationTransitionTo;
declare module "./animation.pure.js" {
    namespace Animation {
        let Parse: AnimationParseType;
        let ParseFromFileAsync: AnimationParseFromFileAsyncType;
        let ParseFromSnippetAsync: AnimationParseFromSnippetAsyncType;
        let CreateFromSnippetAsync: AnimationCreateFromSnippetAsyncType;
        let CreateAnimation: AnimationCreateAnimationType;
        let CreateAndStartAnimation: AnimationCreateAndStartAnimationType;
        let CreateAndStartHierarchyAnimation: AnimationCreateAndStartHierarchyAnimationType;
        let CreateMergeAndStartAnimation: AnimationCreateMergeAndStartAnimationType;
        let MakeAnimationAdditive: AnimationMakeAnimationAdditiveType;
        let TransitionTo: AnimationTransitionToType;
        let AppendSerializedAnimations: AnimationAppendSerializedAnimationsType;
    }
}
export {};
