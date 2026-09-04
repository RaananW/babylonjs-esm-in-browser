/** Pure barrel — re-exports only side-effect-free modules */
/* eslint-disable @typescript-eslint/no-restricted-imports */
export * from "./glTFFileLoader.pure.js";
export * from "./glTFValidation.js";
import * as GLTF1 from "./1.0/pure.js";
import * as GLTF2 from "./2.0/pure.js";
export { GLTF1, GLTF2 };
//# sourceMappingURL=pure.js.map