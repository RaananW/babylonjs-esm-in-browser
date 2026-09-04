import { type ReflectionProbe, type ReflectionProbeParse } from "./reflectionProbe.pure.js";
type ReflectionProbeParseType = typeof ReflectionProbeParse;
declare module "../scene.pure.js" {
    interface Scene {
        /**
         * The list of reflection probes added to the scene
         * @see https://doc.babylonjs.com/features/featuresDeepDive/environment/reflectionProbes
         */
        reflectionProbes: Array<ReflectionProbe>;
        /**
         * Removes the given reflection probe from this scene.
         * @param toRemove The reflection probe to remove
         * @returns The index of the removed reflection probe
         */
        removeReflectionProbe(toRemove: ReflectionProbe): number;
        /**
         * Adds the given reflection probe to this scene.
         * @param newReflectionProbe The reflection probe to add
         */
        addReflectionProbe(newReflectionProbe: ReflectionProbe): void;
    }
}
declare module "./reflectionProbe.pure.js" {
    namespace ReflectionProbe {
        let Parse: ReflectionProbeParseType;
    }
}
export {};
