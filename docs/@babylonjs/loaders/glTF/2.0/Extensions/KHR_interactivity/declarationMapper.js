import { Logger } from "@babylonjs/core/Misc/logger.js";
import { getAnimationTypeByFlowGraphType } from "@babylonjs/core/FlowGraph/flowGraphRichTypes.js";
// Per-block runaway-loop guard for KHR_interactivity for-loops. Interactivity assets may run large
// finite loops (e.g. the math/random Monte Carlo conformance asset iterates 10k times), so this is
// set above the FlowGraphForLoopBlock process-wide default while staying low enough that the guard is
// still meaningful — every iteration runs a full synchronous sub-graph, so a much larger value (and
// especially nested loops) could lock the main thread before the guard trips. Applied per for-loop
// block via the flow/for extraProcessor rather than by mutating the shared static.
const InteractivityForLoopMaxIterations = 20000;
export function getMappingForFullOperationName(fullOperationName) {
    const [op, extension] = fullOperationName.split(":");
    return getMappingForDeclaration({ op, extension });
}
export function getMappingForDeclaration(declaration, returnNoOpIfNotAvailable = true) {
    const mapping = declaration.extension ? gltfExtensionsToFlowGraphMapping[declaration.extension]?.[declaration.op] : gltfToFlowGraphMapping[declaration.op];
    if (!mapping) {
        Logger.Warn(`No mapping found for operation ${declaration.op} and extension ${declaration.extension || "KHR_interactivity"}`);
        if (returnNoOpIfNotAvailable) {
            const inputs = {};
            const outputs = {
                flows: {},
            };
            if (declaration.inputValueSockets) {
                inputs.values = {};
                for (const key in declaration.inputValueSockets) {
                    inputs.values[key] = {
                        name: key,
                    };
                }
            }
            if (declaration.outputValueSockets) {
                outputs.values = {};
                Object.keys(declaration.outputValueSockets).forEach((key) => {
                    outputs.values[key] = {
                        name: key,
                    };
                });
            }
            return {
                blocks: [], // no blocks, just mapping
                inputs,
                outputs,
            };
        }
    }
    return mapping;
}
/**
 * This function will add new mapping to glTF interactivity.
 * Other extensions can define new types of blocks, this is the way to let interactivity know how to parse them.
 * @param key the type of node, i.e. "variable/get"
 * @param extension the extension of the interactivity operation, i.e. "KHR_selectability"
 * @param mapping The mapping object. See documentation or examples below.
 */
export function addNewInteractivityFlowGraphMapping(key, extension, mapping) {
    gltfExtensionsToFlowGraphMapping[extension] || (gltfExtensionsToFlowGraphMapping[extension] = {});
    gltfExtensionsToFlowGraphMapping[extension][key] = mapping;
}
const gltfExtensionsToFlowGraphMapping = {
    /**
     * This is the BABYLON extension for glTF interactivity.
     * It defines babylon-specific blocks and operations.
     */
    BABYLON: {
        /**
         * flow/log is a flow node that logs input to the console.
         * It has "in" and "out" flows, and takes a message as input.
         * The message can be any type of value.
         * The message is logged to the console when the "in" flow is triggered.
         * The "out" flow is triggered when the message is logged.
         */
        "flow/log": {
            blocks: ["FlowGraphConsoleLogBlock" /* FlowGraphBlockNames.ConsoleLog */],
            inputs: {
                values: {
                    message: { name: "message" },
                },
            },
        },
    },
};
// this mapper is just a way to convert the glTF nodes to FlowGraph nodes in terms of input/output connection names and values.
const gltfToFlowGraphMapping = {
    "event/onStart": {
        blocks: ["FlowGraphSceneReadyEventBlock" /* FlowGraphBlockNames.SceneReadyEvent */],
        outputs: {
            values: {
                // KHR_interactivity `ref event` output (the event reference).
                event: { name: "event" },
            },
            flows: {
                out: { name: "done" },
            },
        },
    },
    "event/onTick": {
        blocks: ["FlowGraphSceneTickEventBlock" /* FlowGraphBlockNames.SceneTickEvent */],
        inputs: {},
        outputs: {
            values: {
                timeSinceLastTick: { name: "deltaTime", gltfType: "number" /*, dataTransformer: (time: number) => time / 1000*/ },
                // KHR_interactivity `ref event` output (the event reference).
                event: { name: "event" },
            },
            flows: {
                out: { name: "done" },
            },
        },
    },
    "event/send": {
        blocks: ["FlowGraphSendCustomEventBlock" /* FlowGraphBlockNames.SendCustomEvent */],
        extraProcessor(gltfBlock, declaration, _mapping, parser, serializedObjects) {
            // set eventId and eventData. The configuration object of the glTF should have a single object.
            // validate that we are running it on the right block.
            if (declaration.op !== "event/send" || !gltfBlock.configuration || Object.keys(gltfBlock.configuration).length !== 1) {
                throw new Error("Receive event should have a single configuration object, the event itself");
            }
            const eventConfiguration = gltfBlock.configuration["event"];
            const eventId = eventConfiguration.value?.[0];
            if (typeof eventId !== "number") {
                throw new Error("Event id should be a number");
            }
            const event = parser.arrays.events[eventId];
            const serializedObject = serializedObjects[0];
            serializedObject.config || (serializedObject.config = {});
            serializedObject.config.eventId = event.eventId;
            serializedObject.config.eventData = event.eventData;
            return serializedObjects;
        },
    },
    "event/receive": {
        blocks: ["FlowGraphReceiveCustomEventBlock" /* FlowGraphBlockNames.ReceiveCustomEvent */],
        outputs: {
            values: {
                // KHR_interactivity `ref event` output (the event reference).
                event: { name: "event" },
            },
            flows: {
                out: { name: "done" },
            },
        },
        validation(gltfBlock, interactivityGraph) {
            if (!gltfBlock.configuration) {
                Logger.Error("Receive event should have a configuration object");
                return { valid: false, error: "Receive event should have a configuration object" };
            }
            const eventConfiguration = gltfBlock.configuration["event"];
            if (!eventConfiguration) {
                Logger.Error("Receive event should have a single configuration object, the event itself");
                return { valid: false, error: "Receive event should have a single configuration object, the event itself" };
            }
            const eventId = eventConfiguration.value?.[0];
            if (typeof eventId !== "number") {
                Logger.Error("Event id should be a number");
                return { valid: false, error: "Event id should be a number" };
            }
            const event = interactivityGraph.events?.[eventId];
            if (!event) {
                Logger.Error(`Event with id ${eventId} not found`);
                return { valid: false, error: `Event with id ${eventId} not found` };
            }
            return { valid: true };
        },
        extraProcessor(gltfBlock, declaration, _mapping, parser, serializedObjects) {
            // set eventId and eventData. The configuration object of the glTF should have a single object.
            // validate that we are running it on the right block.
            if (declaration.op !== "event/receive" || !gltfBlock.configuration || Object.keys(gltfBlock.configuration).length !== 1) {
                throw new Error("Receive event should have a single configuration object, the event itself");
            }
            const eventConfiguration = gltfBlock.configuration["event"];
            const eventId = eventConfiguration.value?.[0];
            if (typeof eventId !== "number") {
                throw new Error("Event id should be a number");
            }
            const event = parser.arrays.events[eventId];
            const serializedObject = serializedObjects[0];
            serializedObject.config || (serializedObject.config = {});
            serializedObject.config.eventId = event.eventId;
            serializedObject.config.eventData = event.eventData;
            return serializedObjects;
        },
    },
    "event/stopPropagation": {
        blocks: ["FlowGraphStopEventPropagationBlock" /* FlowGraphBlockNames.StopEventPropagation */],
        inputs: {
            values: {
                event: { name: "event" },
                stopImmediate: { name: "stopImmediate" },
            },
            flows: {
                in: { name: "in" },
            },
        },
        outputs: {
            flows: {
                out: { name: "out" },
            },
        },
    },
    "math/E": getSimpleInputMapping("FlowGraphEBlock" /* FlowGraphBlockNames.E */),
    "math/Pi": getSimpleInputMapping("FlowGraphPIBlock" /* FlowGraphBlockNames.PI */),
    "math/Tau": getSimpleInputMapping("FlowGraphTauBlock" /* FlowGraphBlockNames.Tau */),
    "math/Inf": getSimpleInputMapping("FlowGraphInfBlock" /* FlowGraphBlockNames.Inf */),
    "math/NaN": getSimpleInputMapping("FlowGraphNaNBlock" /* FlowGraphBlockNames.NaN */),
    "math/abs": getSimpleInputMapping("FlowGraphAbsBlock" /* FlowGraphBlockNames.Abs */),
    "math/sign": getSimpleInputMapping("FlowGraphSignBlock" /* FlowGraphBlockNames.Sign */),
    "math/trunc": getSimpleInputMapping("FlowGraphTruncBlock" /* FlowGraphBlockNames.Trunc */),
    "math/floor": getSimpleInputMapping("FlowGraphFloorBlock" /* FlowGraphBlockNames.Floor */),
    "math/ceil": getSimpleInputMapping("FlowGraphCeilBlock" /* FlowGraphBlockNames.Ceil */),
    "math/round": {
        blocks: ["FlowGraphRoundBlock" /* FlowGraphBlockNames.Round */],
        configuration: {},
        inputs: {
            values: {
                a: { name: "a" },
            },
        },
        outputs: {
            values: {
                value: { name: "value" },
            },
        },
        extraProcessor(gltfBlock, declaration, _mapping, parser, serializedObjects) {
            var _a;
            // configure it to work the way glTF specifies
            (_a = serializedObjects[0]).config || (_a.config = {});
            serializedObjects[0].config.roundHalfAwayFromZero = true;
            return serializedObjects;
        },
    },
    "math/fract": getSimpleInputMapping("FlowGraphFractBlock" /* FlowGraphBlockNames.Fraction */),
    "math/neg": getSimpleInputMapping("FlowGraphNegationBlock" /* FlowGraphBlockNames.Negation */),
    "math/add": getSimpleInputMapping("FlowGraphAddBlock" /* FlowGraphBlockNames.Add */, ["a", "b"], true),
    "math/sub": getSimpleInputMapping("FlowGraphSubtractBlock" /* FlowGraphBlockNames.Subtract */, ["a", "b"], true),
    "math/mul": {
        blocks: ["FlowGraphMultiplyBlock" /* FlowGraphBlockNames.Multiply */],
        extraProcessor(_gltfBlock, _declaration, _mapping, _parser, serializedObjects) {
            var _a;
            // configure it to work the way glTF specifies
            (_a = serializedObjects[0]).config || (_a.config = {});
            serializedObjects[0].config.useMatrixPerComponent = true;
            serializedObjects[0].config.preventIntegerFloatArithmetic = true;
            // try to infer the type or fallback to Integer
            // check the gltf block for the inputs, see if they have a type
            let type = -1;
            Object.keys(_gltfBlock.values || {}).find((value) => {
                if (_gltfBlock.values?.[value].type !== undefined) {
                    type = _gltfBlock.values[value].type;
                    return true;
                }
                return false;
            });
            if (type !== -1) {
                serializedObjects[0].config.type = _parser.arrays.types[type].flowGraphType;
            }
            return serializedObjects;
        },
        validation(gltfBlock) {
            if (gltfBlock.values) {
                // make sure types are the same
                return ValidateTypes(gltfBlock);
            }
            return { valid: true };
        },
    },
    "math/div": getSimpleInputMapping("FlowGraphDivideBlock" /* FlowGraphBlockNames.Divide */, ["a", "b"], true),
    "math/rem": getSimpleInputMapping("FlowGraphModuloBlock" /* FlowGraphBlockNames.Modulo */, ["a", "b"]),
    "math/min": getSimpleInputMapping("FlowGraphMinBlock" /* FlowGraphBlockNames.Min */, ["a", "b"]),
    "math/max": getSimpleInputMapping("FlowGraphMaxBlock" /* FlowGraphBlockNames.Max */, ["a", "b"]),
    "math/clamp": getSimpleInputMapping("FlowGraphClampBlock" /* FlowGraphBlockNames.Clamp */, ["a", "b", "c"]),
    "math/saturate": getSimpleInputMapping("FlowGraphSaturateBlock" /* FlowGraphBlockNames.Saturate */),
    "math/mix": getSimpleInputMapping("FlowGraphMathInterpolationBlock" /* FlowGraphBlockNames.MathInterpolation */, ["a", "b", "c"]),
    // Smooth-step (Hermite interpolation): edges a/b and value c.
    "math/smoothStep": getSimpleInputMapping("FlowGraphSmoothStepBlock" /* FlowGraphBlockNames.SmoothStep */, ["a", "b", "c"]),
    // Linear sRGB <-> OkLCh (Oklab polar form). Scalar r/g/b inputs map to l/c/h
    // outputs (hue in radians) and vice-versa.
    "math/rgbToOkLCh": {
        blocks: ["FlowGraphRGBToOkLChBlock" /* FlowGraphBlockNames.RGBToOkLCh */],
        inputs: {
            values: {
                r: { name: "r", gltfType: "number" },
                g: { name: "g", gltfType: "number" },
                b: { name: "b", gltfType: "number" },
            },
        },
        outputs: {
            values: {
                l: { name: "l" },
                c: { name: "c" },
                h: { name: "h" },
            },
        },
    },
    "math/rgbFromOkLCh": {
        blocks: ["FlowGraphRGBFromOkLChBlock" /* FlowGraphBlockNames.RGBFromOkLCh */],
        inputs: {
            values: {
                l: { name: "l", gltfType: "number" },
                c: { name: "c", gltfType: "number" },
                h: { name: "h", gltfType: "number" },
            },
        },
        outputs: {
            values: {
                r: { name: "r" },
                g: { name: "g" },
                b: { name: "b" },
            },
        },
    },
    // Quaternion spherical-linear interpolation. Inputs are two unit
    // quaternions and an unclamped float coefficient.
    "math/quatSlerp": getSimpleInputMapping("FlowGraphMathSlerpBlock" /* FlowGraphBlockNames.MathSlerp */, ["a", "b", "c"]),
    // Vector spherical-linear interpolation (float2/float3). Inputs are two
    // vectors and an unclamped float coefficient.
    "math/slerp": getSimpleInputMapping("FlowGraphVectorSlerpBlock" /* FlowGraphBlockNames.VectorSlerp */, ["a", "b", "c"]),
    "math/eq": getSimpleInputMapping("FlowGraphEqualityBlock" /* FlowGraphBlockNames.Equality */, ["a", "b"]),
    // Reference equality. The spec defines `ref/eq` as: true if both refs are
    // null, true if both refer to the same object (regardless of whether it
    // exists), false otherwise. FlowGraphEqualityBlock falls through to a
    // strict `===` comparison for non-vector/matrix/numeric types, which
    // already produces the spec-defined behaviour for Babylon object refs.
    "ref/eq": getSimpleInputMapping("FlowGraphEqualityBlock" /* FlowGraphBlockNames.Equality */, ["a", "b"]),
    "math/lt": getSimpleInputMapping("FlowGraphLessThanBlock" /* FlowGraphBlockNames.LessThan */, ["a", "b"]),
    "math/le": getSimpleInputMapping("FlowGraphLessThanOrEqualBlock" /* FlowGraphBlockNames.LessThanOrEqual */, ["a", "b"]),
    "math/gt": getSimpleInputMapping("FlowGraphGreaterThanBlock" /* FlowGraphBlockNames.GreaterThan */, ["a", "b"]),
    "math/ge": getSimpleInputMapping("FlowGraphGreaterThanOrEqualBlock" /* FlowGraphBlockNames.GreaterThanOrEqual */, ["a", "b"]),
    "math/isNaN": getSimpleInputMapping("FlowGraphIsNaNBlock" /* FlowGraphBlockNames.IsNaN */),
    "math/isInf": getSimpleInputMapping("FlowGraphIsInfBlock" /* FlowGraphBlockNames.IsInfinity */),
    "math/select": {
        blocks: ["FlowGraphConditionalBlock" /* FlowGraphBlockNames.Conditional */],
        inputs: {
            values: {
                condition: { name: "condition" },
                // Should we validate those have the same type here, or assume it is already validated?
                a: { name: "onTrue" },
                b: { name: "onFalse" },
            },
        },
        outputs: {
            values: {
                value: { name: "output" },
            },
        },
    },
    "math/random": {
        blocks: ["FlowGraphRandomBlock" /* FlowGraphBlockNames.Random */],
        outputs: {
            values: {
                value: { name: "value" },
            },
        },
    },
    "math/sin": getSimpleInputMapping("FlowGraphSinBlock" /* FlowGraphBlockNames.Sin */),
    "math/cos": getSimpleInputMapping("FlowGraphCosBlock" /* FlowGraphBlockNames.Cos */),
    "math/tan": getSimpleInputMapping("FlowGraphTanBlock" /* FlowGraphBlockNames.Tan */),
    "math/asin": getSimpleInputMapping("FlowGraphASinBlock" /* FlowGraphBlockNames.Asin */),
    "math/acos": getSimpleInputMapping("FlowGraphACosBlock" /* FlowGraphBlockNames.Acos */),
    "math/atan": getSimpleInputMapping("FlowGraphATanBlock" /* FlowGraphBlockNames.Atan */),
    "math/atan2": getSimpleInputMapping("FlowGraphATan2Block" /* FlowGraphBlockNames.Atan2 */, ["a", "b"]),
    "math/sinh": getSimpleInputMapping("FlowGraphSinhBlock" /* FlowGraphBlockNames.Sinh */),
    "math/cosh": getSimpleInputMapping("FlowGraphCoshBlock" /* FlowGraphBlockNames.Cosh */),
    "math/tanh": getSimpleInputMapping("FlowGraphTanhBlock" /* FlowGraphBlockNames.Tanh */),
    "math/asinh": getSimpleInputMapping("FlowGraphASinhBlock" /* FlowGraphBlockNames.Asinh */),
    "math/acosh": getSimpleInputMapping("FlowGraphACoshBlock" /* FlowGraphBlockNames.Acosh */),
    "math/atanh": getSimpleInputMapping("FlowGraphATanhBlock" /* FlowGraphBlockNames.Atanh */),
    "math/exp": getSimpleInputMapping("FlowGraphExponentialBlock" /* FlowGraphBlockNames.Exponential */),
    "math/log": getSimpleInputMapping("FlowGraphLogBlock" /* FlowGraphBlockNames.Log */),
    "math/log2": getSimpleInputMapping("FlowGraphLog2Block" /* FlowGraphBlockNames.Log2 */),
    "math/log10": getSimpleInputMapping("FlowGraphLog10Block" /* FlowGraphBlockNames.Log10 */),
    "math/sqrt": getSimpleInputMapping("FlowGraphSquareRootBlock" /* FlowGraphBlockNames.SquareRoot */),
    "math/cbrt": getSimpleInputMapping("FlowGraphCubeRootBlock" /* FlowGraphBlockNames.CubeRoot */),
    "math/pow": getSimpleInputMapping("FlowGraphPowerBlock" /* FlowGraphBlockNames.Power */, ["a", "b"]),
    "math/length": getSimpleInputMapping("FlowGraphLengthBlock" /* FlowGraphBlockNames.Length */),
    "math/normalize": getSimpleInputMapping("FlowGraphNormalizeBlock" /* FlowGraphBlockNames.Normalize */),
    "math/dot": getSimpleInputMapping("FlowGraphDotBlock" /* FlowGraphBlockNames.Dot */, ["a", "b"]),
    "math/cross": getSimpleInputMapping("FlowGraphCrossBlock" /* FlowGraphBlockNames.Cross */, ["a", "b"]),
    "math/rotate2D": {
        blocks: ["FlowGraphRotate2DBlock" /* FlowGraphBlockNames.Rotate2D */],
        inputs: {
            values: {
                a: { name: "a" },
                angle: { name: "b" },
            },
        },
        outputs: {
            values: {
                value: { name: "value" },
            },
        },
    },
    "math/rotate3D": {
        blocks: ["FlowGraphRotate3DBlock" /* FlowGraphBlockNames.Rotate3D */],
        inputs: {
            values: {
                a: { name: "a" },
                rotation: { name: "b" },
            },
        },
        outputs: {
            values: {
                value: { name: "value" },
            },
        },
    },
    "math/transform": {
        // glTF transform is vectorN with matrixN
        blocks: ["FlowGraphTransformVectorBlock" /* FlowGraphBlockNames.TransformVector */],
        inputs: {
            values: {
                a: { name: "a" },
                b: { name: "b" },
            },
        },
        outputs: {
            values: {
                value: { name: "value" },
            },
        },
    },
    "math/combine2": {
        blocks: ["FlowGraphCombineVector2Block" /* FlowGraphBlockNames.CombineVector2 */],
        inputs: {
            values: {
                a: { name: "input_0", gltfType: "number" },
                b: { name: "input_1", gltfType: "number" },
            },
        },
        outputs: {
            values: {
                value: { name: "value" },
            },
        },
    },
    "math/combine3": {
        blocks: ["FlowGraphCombineVector3Block" /* FlowGraphBlockNames.CombineVector3 */],
        inputs: {
            values: {
                a: { name: "input_0", gltfType: "number" },
                b: { name: "input_1", gltfType: "number" },
                c: { name: "input_2", gltfType: "number" },
            },
        },
        outputs: {
            values: {
                value: { name: "value" },
            },
        },
    },
    "math/combine4": {
        blocks: ["FlowGraphCombineVector4Block" /* FlowGraphBlockNames.CombineVector4 */],
        inputs: {
            values: {
                a: { name: "input_0", gltfType: "number" },
                b: { name: "input_1", gltfType: "number" },
                c: { name: "input_2", gltfType: "number" },
                d: { name: "input_3", gltfType: "number" },
            },
        },
        outputs: {
            values: {
                value: { name: "value" },
            },
        },
    },
    // one input, N outputs! outputs named using numbers.
    "math/extract2": {
        blocks: ["FlowGraphExtractVector2Block" /* FlowGraphBlockNames.ExtractVector2 */],
        inputs: {
            values: {
                a: { name: "input", gltfType: "number" },
            },
        },
        outputs: {
            values: {
                "0": { name: "output_0" },
                "1": { name: "output_1" },
            },
        },
    },
    "math/extract3": {
        blocks: ["FlowGraphExtractVector3Block" /* FlowGraphBlockNames.ExtractVector3 */],
        inputs: {
            values: {
                a: { name: "input", gltfType: "number" },
            },
        },
        outputs: {
            values: {
                "0": { name: "output_0" },
                "1": { name: "output_1" },
                "2": { name: "output_2" },
            },
        },
    },
    "math/extract4": {
        blocks: ["FlowGraphExtractVector4Block" /* FlowGraphBlockNames.ExtractVector4 */],
        inputs: {
            values: {
                a: { name: "input", gltfType: "number" },
            },
        },
        outputs: {
            values: {
                "0": { name: "output_0" },
                "1": { name: "output_1" },
                "2": { name: "output_2" },
                "3": { name: "output_3" },
            },
        },
    },
    "math/transpose": getSimpleInputMapping("FlowGraphTransposeBlock" /* FlowGraphBlockNames.Transpose */),
    "math/determinant": getSimpleInputMapping("FlowGraphDeterminantBlock" /* FlowGraphBlockNames.Determinant */),
    "math/inverse": getSimpleInputMapping("FlowGraphInvertMatrixBlock" /* FlowGraphBlockNames.InvertMatrix */),
    "math/matMul": getSimpleInputMapping("FlowGraphMatrixMultiplicationBlock" /* FlowGraphBlockNames.MatrixMultiplication */, ["a", "b"]),
    "math/matCompose": {
        blocks: ["FlowGraphMatrixCompose" /* FlowGraphBlockNames.MatrixCompose */],
        inputs: {
            values: {
                translation: { name: "position", gltfType: "float3" },
                rotation: { name: "rotationQuaternion", gltfType: "float4" },
                scale: { name: "scaling", gltfType: "float3" },
            },
        },
        outputs: {
            values: {
                value: { name: "value" },
            },
        },
        extraProcessor(_gltfBlock, _declaration, _mapping, _parser, serializedObjects, context) {
            // configure it to work the way glTF specifies
            const d = serializedObjects[0].dataInputs.find((input) => input.name === "rotationQuaternion");
            if (!d) {
                throw new Error("Rotation quaternion input not found");
            }
            // if value is defined, set the type to quaternion
            if (context._connectionValues[d.uniqueId]) {
                context._connectionValues[d.uniqueId].type = "Quaternion" /* FlowGraphTypes.Quaternion */;
            }
            return serializedObjects;
        },
    },
    "math/matDecompose": {
        blocks: ["FlowGraphMatrixDecompose" /* FlowGraphBlockNames.MatrixDecompose */],
        inputs: {
            values: {
                a: { name: "input", gltfType: "number" },
            },
        },
        outputs: {
            values: {
                translation: { name: "position" },
                rotation: { name: "rotationQuaternion" },
                scale: { name: "scaling" },
            },
        },
        extraProcessor(_gltfBlock, _declaration, _mapping, _parser, serializedObjects) {
            var _a;
            // KHR_interactivity step 4 of the matDecompose algorithm requires a non-decomposable matrix to still
            // report the extracted translation and the raw column lengths, instead of the type defaults the
            // FlowGraph block emits by default. The block has no `isValid` output in glTF, so the caller can only
            // observe those values.
            (_a = serializedObjects[0]).config || (_a.config = {});
            serializedObjects[0].config.keepDegenerateComponents = true;
            return serializedObjects;
        },
    },
    "math/quatConjugate": getSimpleInputMapping("FlowGraphConjugateBlock" /* FlowGraphBlockNames.Conjugate */, ["a"]),
    "math/quatMul": {
        blocks: ["FlowGraphMultiplyBlock" /* FlowGraphBlockNames.Multiply */],
        inputs: {
            values: {
                a: { name: "a", gltfType: "vector4" },
                b: { name: "b", gltfType: "vector4" },
            },
        },
        outputs: {
            values: {
                value: { name: "value" },
            },
        },
        extraProcessor(_gltfBlock, _declaration, _mapping, _parser, serializedObjects) {
            var _a;
            (_a = serializedObjects[0]).config || (_a.config = {});
            serializedObjects[0].config.type = "Quaternion" /* FlowGraphTypes.Quaternion */;
            return serializedObjects;
        },
    },
    "math/quatAngleBetween": getSimpleInputMapping("FlowGraphAngleBetweenBlock" /* FlowGraphBlockNames.AngleBetween */, ["a", "b"]),
    "math/quatFromAxisAngle": {
        blocks: ["FlowGraphQuaternionFromAxisAngleBlock" /* FlowGraphBlockNames.QuaternionFromAxisAngle */],
        inputs: {
            values: {
                axis: { name: "a", gltfType: "float3" },
                angle: { name: "b", gltfType: "number" },
            },
        },
        outputs: {
            values: {
                value: { name: "value" },
            },
        },
    },
    "math/quatToAxisAngle": getSimpleInputMapping("FlowGraphAxisAngleFromQuaternionBlock" /* FlowGraphBlockNames.AxisAngleFromQuaternion */, ["a"]),
    "math/quatFromDirections": getSimpleInputMapping("FlowGraphQuaternionFromDirectionsBlock" /* FlowGraphBlockNames.QuaternionFromDirections */, ["a", "b"]),
    "math/quatFromUpForward": {
        blocks: ["FlowGraphQuaternionFromUpForwardBlock" /* FlowGraphBlockNames.QuaternionFromUpForward */],
        inputs: {
            values: {
                up: { name: "a", gltfType: "float3" },
                forward: { name: "b", gltfType: "float3" },
            },
        },
        outputs: {
            values: {
                value: { name: "value" },
            },
        },
    },
    // Tait–Bryan intrinsic Euler angles (x/y/z, in radians) to a rotation quaternion. The rotation
    // order is selected by the `order` configuration string (default `yxz`).
    "math/quatFromAngles": {
        blocks: ["FlowGraphQuaternionFromAnglesBlock" /* FlowGraphBlockNames.QuaternionFromAngles */],
        configuration: {
            order: { name: "order", defaultValue: ["yxz"] },
        },
        inputs: {
            values: {
                x: { name: "a", gltfType: "number" },
                y: { name: "b", gltfType: "number" },
                z: { name: "c", gltfType: "number" },
            },
        },
        outputs: {
            values: {
                value: { name: "value" },
            },
        },
    },
    "math/combine2x2": {
        blocks: ["FlowGraphCombineMatrix2DBlock" /* FlowGraphBlockNames.CombineMatrix2D */],
        inputs: {
            values: {
                a: { name: "input_0", gltfType: "number" },
                b: { name: "input_1", gltfType: "number" },
                c: { name: "input_2", gltfType: "number" },
                d: { name: "input_3", gltfType: "number" },
            },
        },
        outputs: {
            values: {
                value: { name: "value" },
            },
        },
    },
    "math/extract2x2": {
        blocks: ["FlowGraphExtractMatrix2DBlock" /* FlowGraphBlockNames.ExtractMatrix2D */],
        inputs: {
            values: {
                a: { name: "input", gltfType: "float2x2" },
            },
        },
        outputs: {
            values: {
                "0": { name: "output_0" },
                "1": { name: "output_1" },
                "2": { name: "output_2" },
                "3": { name: "output_3" },
            },
        },
    },
    "math/combine3x3": {
        blocks: ["FlowGraphCombineMatrix3DBlock" /* FlowGraphBlockNames.CombineMatrix3D */],
        inputs: {
            values: {
                a: { name: "input_0", gltfType: "number" },
                b: { name: "input_1", gltfType: "number" },
                c: { name: "input_2", gltfType: "number" },
                d: { name: "input_3", gltfType: "number" },
                e: { name: "input_4", gltfType: "number" },
                f: { name: "input_5", gltfType: "number" },
                g: { name: "input_6", gltfType: "number" },
                h: { name: "input_7", gltfType: "number" },
                i: { name: "input_8", gltfType: "number" },
            },
        },
        outputs: {
            values: {
                value: { name: "value" },
            },
        },
    },
    "math/extract3x3": {
        blocks: ["FlowGraphExtractMatrix3DBlock" /* FlowGraphBlockNames.ExtractMatrix3D */],
        inputs: {
            values: {
                a: { name: "input", gltfType: "float3x3" },
            },
        },
        outputs: {
            values: {
                "0": { name: "output_0" },
                "1": { name: "output_1" },
                "2": { name: "output_2" },
                "3": { name: "output_3" },
                "4": { name: "output_4" },
                "5": { name: "output_5" },
                "6": { name: "output_6" },
                "7": { name: "output_7" },
                "8": { name: "output_8" },
            },
        },
    },
    "math/combine4x4": {
        blocks: ["FlowGraphCombineMatrixBlock" /* FlowGraphBlockNames.CombineMatrix */],
        inputs: {
            values: {
                a: { name: "input_0", gltfType: "number" },
                b: { name: "input_1", gltfType: "number" },
                c: { name: "input_2", gltfType: "number" },
                d: { name: "input_3", gltfType: "number" },
                e: { name: "input_4", gltfType: "number" },
                f: { name: "input_5", gltfType: "number" },
                g: { name: "input_6", gltfType: "number" },
                h: { name: "input_7", gltfType: "number" },
                i: { name: "input_8", gltfType: "number" },
                j: { name: "input_9", gltfType: "number" },
                k: { name: "input_10", gltfType: "number" },
                l: { name: "input_11", gltfType: "number" },
                m: { name: "input_12", gltfType: "number" },
                n: { name: "input_13", gltfType: "number" },
                o: { name: "input_14", gltfType: "number" },
                p: { name: "input_15", gltfType: "number" },
            },
        },
        outputs: {
            values: {
                value: { name: "value" },
            },
        },
    },
    "math/extract4x4": {
        blocks: ["FlowGraphExtractMatrixBlock" /* FlowGraphBlockNames.ExtractMatrix */],
        configuration: {},
        inputs: {
            values: {
                a: { name: "input", gltfType: "number" },
            },
        },
        outputs: {
            values: {
                "0": { name: "output_0" },
                "1": { name: "output_1" },
                "2": { name: "output_2" },
                "3": { name: "output_3" },
                "4": { name: "output_4" },
                "5": { name: "output_5" },
                "6": { name: "output_6" },
                "7": { name: "output_7" },
                "8": { name: "output_8" },
                "9": { name: "output_9" },
                "10": { name: "output_10" },
                "11": { name: "output_11" },
                "12": { name: "output_12" },
                "13": { name: "output_13" },
                "14": { name: "output_14" },
                "15": { name: "output_15" },
            },
        },
    },
    "math/not": {
        blocks: ["FlowGraphBitwiseNotBlock" /* FlowGraphBlockNames.BitwiseNot */],
        inputs: {
            values: {
                a: { name: "a" },
            },
        },
        outputs: {
            values: {
                value: { name: "value" },
            },
        },
        extraProcessor(_gltfBlock, _declaration, _mapping, _parser, serializedObjects, context) {
            var _a;
            // configure it to work the way glTF specifies
            (_a = serializedObjects[0]).config || (_a.config = {});
            // try to infer the type or fallback to Integer
            const socketIn = serializedObjects[0].dataInputs[0];
            serializedObjects[0].config.valueType = context._connectionValues[socketIn.uniqueId]?.type ?? "FlowGraphInteger" /* FlowGraphTypes.Integer */;
            return serializedObjects;
        },
    },
    "math/and": {
        blocks: ["FlowGraphBitwiseAndBlock" /* FlowGraphBlockNames.BitwiseAnd */],
        inputs: {
            values: {
                a: { name: "a" },
                b: { name: "b" },
            },
        },
        outputs: {
            values: {
                value: { name: "value" },
            },
        },
        extraProcessor(_gltfBlock, _declaration, _mapping, _parser, serializedObjects, context) {
            var _a;
            // configure it to work the way glTF specifies
            (_a = serializedObjects[0]).config || (_a.config = {});
            // try to infer the type or fallback to Integer
            const socketInA = serializedObjects[0].dataInputs[0];
            const socketInB = serializedObjects[0].dataInputs[1];
            serializedObjects[0].config.valueType =
                context._connectionValues[socketInA.uniqueId]?.type ?? context._connectionValues[socketInB.uniqueId]?.type ?? "FlowGraphInteger" /* FlowGraphTypes.Integer */;
            return serializedObjects;
        },
    },
    "math/or": {
        blocks: ["FlowGraphBitwiseOrBlock" /* FlowGraphBlockNames.BitwiseOr */],
        inputs: {
            values: {
                a: { name: "a" },
                b: { name: "b" },
            },
        },
        outputs: {
            values: {
                value: { name: "value" },
            },
        },
        extraProcessor(_gltfBlock, _declaration, _mapping, _parser, serializedObjects, context) {
            var _a;
            // configure it to work the way glTF specifies
            (_a = serializedObjects[0]).config || (_a.config = {});
            // try to infer the type or fallback to Integer
            const socketInA = serializedObjects[0].dataInputs[0];
            const socketInB = serializedObjects[0].dataInputs[1];
            serializedObjects[0].config.valueType =
                context._connectionValues[socketInA.uniqueId]?.type ?? context._connectionValues[socketInB.uniqueId]?.type ?? "FlowGraphInteger" /* FlowGraphTypes.Integer */;
            return serializedObjects;
        },
    },
    "math/xor": {
        blocks: ["FlowGraphBitwiseXorBlock" /* FlowGraphBlockNames.BitwiseXor */],
        inputs: {
            values: {
                a: { name: "a" },
                b: { name: "b" },
            },
        },
        outputs: {
            values: {
                value: { name: "value" },
            },
        },
        extraProcessor(_gltfBlock, _declaration, _mapping, _parser, serializedObjects, context) {
            var _a;
            // configure it to work the way glTF specifies
            (_a = serializedObjects[0]).config || (_a.config = {});
            // try to infer the type or fallback to Integer
            const socketInA = serializedObjects[0].dataInputs[0];
            const socketInB = serializedObjects[0].dataInputs[1];
            serializedObjects[0].config.valueType =
                context._connectionValues[socketInA.uniqueId]?.type ?? context._connectionValues[socketInB.uniqueId]?.type ?? "FlowGraphInteger" /* FlowGraphTypes.Integer */;
            return serializedObjects;
        },
    },
    "math/asr": getSimpleInputMapping("FlowGraphBitwiseRightShiftBlock" /* FlowGraphBlockNames.BitwiseRightShift */, ["a", "b"]),
    "math/lsl": getSimpleInputMapping("FlowGraphBitwiseLeftShiftBlock" /* FlowGraphBlockNames.BitwiseLeftShift */, ["a", "b"]),
    "math/clz": getSimpleInputMapping("FlowGraphLeadingZerosBlock" /* FlowGraphBlockNames.LeadingZeros */),
    "math/ctz": getSimpleInputMapping("FlowGraphTrailingZerosBlock" /* FlowGraphBlockNames.TrailingZeros */),
    "math/popcnt": getSimpleInputMapping("FlowGraphOneBitsCounterBlock" /* FlowGraphBlockNames.OneBitsCounter */),
    "math/rad": getSimpleInputMapping("FlowGraphDegToRadBlock" /* FlowGraphBlockNames.DegToRad */),
    "math/deg": getSimpleInputMapping("FlowGraphRadToDegBlock" /* FlowGraphBlockNames.RadToDeg */),
    "type/boolToInt": getSimpleInputMapping("FlowGraphBooleanToInt" /* FlowGraphBlockNames.BooleanToInt */),
    "type/boolToFloat": getSimpleInputMapping("FlowGraphBooleanToFloat" /* FlowGraphBlockNames.BooleanToFloat */),
    "type/intToBool": getSimpleInputMapping("FlowGraphIntToBoolean" /* FlowGraphBlockNames.IntToBoolean */),
    "type/intToFloat": getSimpleInputMapping("FlowGraphIntToFloat" /* FlowGraphBlockNames.IntToFloat */),
    "type/floatToInt": getSimpleInputMapping("FlowGraphFloatToInt" /* FlowGraphBlockNames.FloatToInt */),
    "type/floatToBool": getSimpleInputMapping("FlowGraphFloatToBoolean" /* FlowGraphBlockNames.FloatToBoolean */),
    // flows
    "flow/sequence": {
        blocks: ["FlowGraphSequenceBlock" /* FlowGraphBlockNames.Sequence */],
        extraProcessor(gltfBlock, _declaration, _mapping, _arrays, serializedObjects) {
            const serializedObject = serializedObjects[0];
            serializedObject.config || (serializedObject.config = {});
            serializedObject.config.outputSignalCount = Object.keys(gltfBlock.flows || []).length;
            serializedObject.signalOutputs.forEach((output, index) => {
                output.name = "out_" + index;
            });
            return serializedObjects;
        },
    },
    "flow/branch": {
        blocks: ["FlowGraphBranchBlock" /* FlowGraphBlockNames.Branch */],
        outputs: {
            flows: {
                true: { name: "onTrue" },
                false: { name: "onFalse" },
            },
        },
    },
    "flow/switch": {
        blocks: ["FlowGraphSwitchBlock" /* FlowGraphBlockNames.Switch */],
        configuration: {
            cases: { name: "cases", isArray: true, inOptions: true, defaultValue: [] },
        },
        inputs: {
            values: {
                selection: { name: "case" },
                default: { name: "default" },
            },
        },
        validation(gltfBlock) {
            const cases = gltfBlock.configuration?.cases;
            if (cases && cases.value) {
                const onlyIntegers = cases.value.every((caseValue) => {
                    // case value should be an integer. Since Number.isInteger(1.0) is true, we need to check if toString has only digits.
                    return typeof caseValue === "number" && /^-?\d+$/.test(caseValue.toString());
                });
                if (!onlyIntegers) {
                    Logger.Warn("Switch cases should be integers. Using empty array instead.");
                    cases.value = [];
                    return { valid: true };
                }
                // check for duplicates
                const uniqueCases = new Set(cases.value);
                cases.value = Array.from(uniqueCases);
            }
            return { valid: true };
        },
        extraProcessor(gltfBlock, declaration, _mapping, _arrays, serializedObjects) {
            // convert all names of output flow to out_$1 apart from "default"
            if (declaration.op !== "flow/switch" || !gltfBlock.flows || Object.keys(gltfBlock.flows).length === 0) {
                throw new Error("Switch should have a single configuration object, the cases array");
            }
            const serializedObject = serializedObjects[0];
            serializedObject.signalOutputs.forEach((output) => {
                if (output.name !== "default") {
                    output.name = "out_" + output.name;
                }
            });
            return serializedObjects;
        },
    },
    "flow/while": {
        blocks: ["FlowGraphWhileLoopBlock" /* FlowGraphBlockNames.WhileLoop */],
        outputs: {
            flows: {
                loopBody: { name: "executionFlow" },
            },
        },
    },
    "flow/for": {
        blocks: ["FlowGraphForLoopBlock" /* FlowGraphBlockNames.ForLoop */],
        configuration: {
            initialIndex: { name: "initialIndex", gltfType: "number", inOptions: true, defaultValue: 0 },
        },
        inputs: {
            values: {
                startIndex: { name: "startIndex", gltfType: "number" },
                endIndex: { name: "endIndex", gltfType: "number" },
            },
        },
        outputs: {
            values: {
                index: { name: "index" },
            },
            flows: {
                loopBody: { name: "executionFlow" },
            },
        },
        extraProcessor(_gltfBlock, _declaration, _mapping, _arrays, serializedObjects) {
            const serializedObject = serializedObjects[0];
            serializedObject.config || (serializedObject.config = {});
            serializedObject.config.incrementIndexWhenLoopDone = true;
            // KHR_interactivity assets may run large finite loops (e.g. the math/random Monte Carlo
            // conformance asset iterates 10k times), well above the block's conservative default guard.
            // Raise the cap for interactivity for-loops only, per block, instead of mutating the
            // process-wide FlowGraphForLoopBlock.MaxLoopIterations that every other FlowGraph relies on.
            serializedObject.config.maxLoopIterations = InteractivityForLoopMaxIterations;
            return serializedObjects;
        },
    },
    "flow/doN": {
        blocks: ["FlowGraphDoNBlock" /* FlowGraphBlockNames.DoN */],
        configuration: {},
        inputs: {
            values: {
                n: { name: "maxExecutions", gltfType: "number" },
            },
        },
        outputs: {
            values: {
                currentCount: { name: "executionCount" },
            },
        },
    },
    "flow/multiGate": {
        blocks: ["FlowGraphMultiGateBlock" /* FlowGraphBlockNames.MultiGate */],
        configuration: {
            isRandom: { name: "isRandom", gltfType: "boolean", inOptions: true, defaultValue: false },
            isLoop: { name: "isLoop", gltfType: "boolean", inOptions: true, defaultValue: false },
        },
        extraProcessor(gltfBlock, declaration, _mapping, _arrays, serializedObjects) {
            if (declaration.op !== "flow/multiGate" || !gltfBlock.flows || Object.keys(gltfBlock.flows).length === 0) {
                throw new Error("MultiGate should have a single configuration object, the number of output flows");
            }
            const serializedObject = serializedObjects[0];
            serializedObject.config || (serializedObject.config = {});
            serializedObject.config.outputSignalCount = Object.keys(gltfBlock.flows).length;
            serializedObject.signalOutputs.forEach((output, index) => {
                output.name = "out_" + index;
            });
            return serializedObjects;
        },
    },
    "flow/waitAll": {
        blocks: ["FlowGraphWaitAllBlock" /* FlowGraphBlockNames.WaitAll */],
        configuration: {
            inputFlows: { name: "inputSignalCount", gltfType: "number", inOptions: true, defaultValue: 0 },
        },
        inputs: {
            flows: {
                reset: { name: "reset" },
                "[segment]": { name: "in_$1" },
            },
        },
        validation(gltfBlock) {
            // check that the configuration value is an integer
            if (typeof gltfBlock.configuration?.inputFlows?.value?.[0] !== "number") {
                gltfBlock.configuration = gltfBlock.configuration || {
                    inputFlows: { value: [0] },
                };
                gltfBlock.configuration.inputFlows.value = [0];
            }
            return { valid: true };
        },
    },
    "flow/throttle": {
        blocks: ["FlowGraphThrottleBlock" /* FlowGraphBlockNames.Throttle */],
        outputs: {
            flows: {
                err: { name: "error" },
            },
        },
    },
    "flow/setDelay": {
        blocks: ["FlowGraphSetDelayBlock" /* FlowGraphBlockNames.SetDelay */],
        outputs: {
            flows: {
                err: { name: "error" },
            },
            values: {
                // New spec renames this output to `lastDelay` (ref). Internally we still produce a
                // FlowGraphInteger; the index is unique per delay so it acts as the opaque handle.
                lastDelay: { name: "lastDelayIndex" },
            },
        },
    },
    "flow/cancelDelay": {
        blocks: ["FlowGraphCancelDelayBlock" /* FlowGraphBlockNames.CancelDelay */],
        inputs: {
            values: {
                // New spec renames this input to `delay` (ref). The underlying block reads an int
                // from `delayIndex`; when a ref-string flows in we coerce it via the path converter.
                delay: { name: "delayIndex" },
            },
        },
    },
    "variable/get": {
        blocks: ["FlowGraphGetVariableBlock" /* FlowGraphBlockNames.GetVariable */],
        validation(gltfBlock) {
            if (!gltfBlock.configuration?.variable?.value) {
                Logger.Error("Variable get block should have a variable configuration");
                return { valid: false, error: "Variable get block should have a variable configuration" };
            }
            return { valid: true };
        },
        configuration: {
            variable: {
                name: "variable",
                gltfType: "number",
                flowGraphType: "string",
                inOptions: true,
                isVariable: true,
                dataTransformer(index, parser) {
                    return parser.getVariableName(index);
                },
            },
        },
    },
    "variable/set": {
        blocks: ["FlowGraphSetVariableBlock" /* FlowGraphBlockNames.SetVariable */],
        configuration: {
            variables: {
                name: "variables",
                gltfType: "number",
                flowGraphType: "string",
                inOptions: true,
                isArray: true,
                dataTransformer(index, parser) {
                    return index.map((i) => parser.getVariableName(i));
                },
            },
        },
        extraProcessor(_gltfBlock, _declaration, _mapping, parser, serializedObjects) {
            // variable/get configuration
            const serializedGetVariable = serializedObjects[0];
            serializedGetVariable.dataInputs.forEach((input) => {
                input.name = parser.getVariableName(+input.name);
            });
            return serializedObjects;
        },
    },
    "variable/interpolate": {
        blocks: [
            "FlowGraphInterpolationBlock" /* FlowGraphBlockNames.ValueInterpolation */,
            "FlowGraphContextBlock" /* FlowGraphBlockNames.Context */,
            "FlowGraphPlayAnimationBlock" /* FlowGraphBlockNames.PlayAnimation */,
            "FlowGraphBezierCurveEasing" /* FlowGraphBlockNames.BezierCurveEasing */,
            "FlowGraphGetVariableBlock" /* FlowGraphBlockNames.GetVariable */,
        ],
        configuration: {
            variable: {
                name: "propertyName",
                inOptions: true,
                isVariable: true,
                dataTransformer(index, parser) {
                    return parser.getVariableName(index);
                },
            },
            useSlerp: {
                name: "animationType",
                inOptions: true,
                defaultValue: false,
                dataTransformer(value) {
                    return value === true ? "Quaternion" /* FlowGraphTypes.Quaternion */ : undefined;
                },
            },
        },
        inputs: {
            values: {
                value: { name: "value_1" },
                duration: { name: "duration_1", gltfType: "number" },
                p1: { name: "controlPoint1", toBlock: "FlowGraphBezierCurveEasing" /* FlowGraphBlockNames.BezierCurveEasing */ },
                p2: { name: "controlPoint2", toBlock: "FlowGraphBezierCurveEasing" /* FlowGraphBlockNames.BezierCurveEasing */ },
            },
            flows: {
                in: { name: "in", toBlock: "FlowGraphPlayAnimationBlock" /* FlowGraphBlockNames.PlayAnimation */ },
            },
        },
        outputs: {
            flows: {
                err: { name: "error", toBlock: "FlowGraphPlayAnimationBlock" /* FlowGraphBlockNames.PlayAnimation */ },
                out: { name: "out", toBlock: "FlowGraphPlayAnimationBlock" /* FlowGraphBlockNames.PlayAnimation */ },
                done: { name: "done", toBlock: "FlowGraphPlayAnimationBlock" /* FlowGraphBlockNames.PlayAnimation */ },
            },
        },
        interBlockConnectors: [
            {
                input: "object",
                output: "userVariables",
                inputBlockIndex: 2,
                outputBlockIndex: 1,
                isVariable: true,
            },
            {
                input: "animation",
                output: "animation",
                inputBlockIndex: 2,
                outputBlockIndex: 0,
                isVariable: true,
            },
            {
                input: "easingFunction",
                output: "easingFunction",
                inputBlockIndex: 0,
                outputBlockIndex: 3,
                isVariable: true,
            },
            {
                input: "value_0",
                output: "value",
                inputBlockIndex: 0,
                outputBlockIndex: 4,
                isVariable: true,
            },
        ],
        extraProcessor(gltfBlock, _declaration, _mapping, parser, serializedObjects) {
            var _a, _b;
            // is useSlerp is used, animationType should be set to be quaternion!
            const serializedValueInterpolation = serializedObjects[0];
            const propertyIndex = gltfBlock.configuration?.variable.value?.[0];
            if (typeof propertyIndex !== "number") {
                Logger.Error("Variable index is not defined for variable interpolation block");
                throw new Error("Variable index is not defined for variable interpolation block");
            }
            const variable = parser.arrays.staticVariables[propertyIndex];
            // if not set by useSlerp
            if (typeof serializedValueInterpolation.config?.animationType?.value === "undefined") {
                serializedValueInterpolation.config || (serializedValueInterpolation.config = {});
                (_a = serializedValueInterpolation.config).animationType || (_a.animationType = {});
                serializedValueInterpolation.config.animationType.value = getAnimationTypeByFlowGraphType(variable.type);
            }
            // variable/get configuration
            const serializedGetVariable = serializedObjects[4];
            serializedGetVariable.config || (serializedGetVariable.config = {});
            (_b = serializedGetVariable.config).variable || (_b.variable = {});
            serializedGetVariable.config.variable.value = parser.getVariableName(propertyIndex);
            return serializedObjects;
        },
    },
    "pointer/get": {
        blocks: ["FlowGraphGetPropertyBlock" /* FlowGraphBlockNames.GetProperty */, "FlowGraphJsonPointerParserBlock" /* FlowGraphBlockNames.JsonPointerParser */],
        validation: ValidateJsonPointerTemplate,
        configuration: {
            pointer: { name: "jsonPointer", toBlock: "FlowGraphJsonPointerParserBlock" /* FlowGraphBlockNames.JsonPointerParser */ },
        },
        inputs: {
            values: {
                "[segment]": { name: "$1", toBlock: "FlowGraphJsonPointerParserBlock" /* FlowGraphBlockNames.JsonPointerParser */ },
            },
        },
        interBlockConnectors: [
            {
                input: "object",
                output: "object",
                inputBlockIndex: 0,
                outputBlockIndex: 1,
                isVariable: true,
            },
            {
                input: "propertyName",
                output: "propertyName",
                inputBlockIndex: 0,
                outputBlockIndex: 1,
                isVariable: true,
            },
            {
                input: "customGetFunction",
                output: "getFunction",
                inputBlockIndex: 0,
                outputBlockIndex: 1,
                isVariable: true,
            },
        ],
        extraProcessor(gltfBlock, _declaration, _mapping, parser, serializedObjects) {
            serializedObjects.forEach((serializedObject) => {
                // check if it is the json pointer block
                if (serializedObject.className === "FlowGraphJsonPointerParserBlock" /* FlowGraphBlockNames.JsonPointerParser */) {
                    serializedObject.config || (serializedObject.config = {});
                    serializedObject.config.outputValue = true;
                }
            });
            return serializedObjects;
        },
    },
    "pointer/set": {
        blocks: ["FlowGraphSetPropertyBlock" /* FlowGraphBlockNames.SetProperty */, "FlowGraphJsonPointerParserBlock" /* FlowGraphBlockNames.JsonPointerParser */],
        validation: ValidateJsonPointerTemplate,
        configuration: {
            pointer: { name: "jsonPointer", toBlock: "FlowGraphJsonPointerParserBlock" /* FlowGraphBlockNames.JsonPointerParser */ },
        },
        inputs: {
            values: {
                // must be defined due to the array taking over
                value: { name: "value" },
                "[segment]": { name: "$1", toBlock: "FlowGraphJsonPointerParserBlock" /* FlowGraphBlockNames.JsonPointerParser */ },
            },
        },
        outputs: {
            flows: {
                err: { name: "error" },
            },
        },
        interBlockConnectors: [
            {
                input: "object",
                output: "object",
                inputBlockIndex: 0,
                outputBlockIndex: 1,
                isVariable: true,
            },
            {
                input: "propertyName",
                output: "propertyName",
                inputBlockIndex: 0,
                outputBlockIndex: 1,
                isVariable: true,
            },
            {
                input: "customSetFunction",
                output: "setFunction",
                inputBlockIndex: 0,
                outputBlockIndex: 1,
                isVariable: true,
            },
        ],
        extraProcessor(gltfBlock, _declaration, _mapping, parser, serializedObjects) {
            serializedObjects.forEach((serializedObject) => {
                // check if it is the json pointer block
                if (serializedObject.className === "FlowGraphJsonPointerParserBlock" /* FlowGraphBlockNames.JsonPointerParser */) {
                    serializedObject.config || (serializedObject.config = {});
                    serializedObject.config.outputValue = true;
                }
            });
            return serializedObjects;
        },
    },
    "pointer/interpolate": {
        // interpolate, parse the pointer and play the animation generated. 3 blocks!
        blocks: ["FlowGraphInterpolationBlock" /* FlowGraphBlockNames.ValueInterpolation */, "FlowGraphJsonPointerParserBlock" /* FlowGraphBlockNames.JsonPointerParser */, "FlowGraphPlayAnimationBlock" /* FlowGraphBlockNames.PlayAnimation */, "FlowGraphBezierCurveEasing" /* FlowGraphBlockNames.BezierCurveEasing */],
        validation: ValidateJsonPointerTemplate,
        configuration: {
            pointer: { name: "jsonPointer", toBlock: "FlowGraphJsonPointerParserBlock" /* FlowGraphBlockNames.JsonPointerParser */ },
        },
        inputs: {
            values: {
                value: { name: "value_1" },
                "[segment]": { name: "$1", toBlock: "FlowGraphJsonPointerParserBlock" /* FlowGraphBlockNames.JsonPointerParser */ },
                duration: { name: "duration_1", gltfType: "number" /*, inOptions: true */ },
                p1: { name: "controlPoint1", toBlock: "FlowGraphBezierCurveEasing" /* FlowGraphBlockNames.BezierCurveEasing */ },
                p2: { name: "controlPoint2", toBlock: "FlowGraphBezierCurveEasing" /* FlowGraphBlockNames.BezierCurveEasing */ },
            },
            flows: {
                in: { name: "in", toBlock: "FlowGraphPlayAnimationBlock" /* FlowGraphBlockNames.PlayAnimation */ },
            },
        },
        outputs: {
            flows: {
                err: { name: "error", toBlock: "FlowGraphPlayAnimationBlock" /* FlowGraphBlockNames.PlayAnimation */ },
                out: { name: "out", toBlock: "FlowGraphPlayAnimationBlock" /* FlowGraphBlockNames.PlayAnimation */ },
                done: { name: "done", toBlock: "FlowGraphPlayAnimationBlock" /* FlowGraphBlockNames.PlayAnimation */ },
            },
        },
        interBlockConnectors: [
            {
                input: "object",
                output: "object",
                inputBlockIndex: 2,
                outputBlockIndex: 1,
                isVariable: true,
            },
            {
                input: "propertyName",
                output: "propertyName",
                inputBlockIndex: 0,
                outputBlockIndex: 1,
                isVariable: true,
            },
            {
                input: "customBuildAnimation",
                output: "generateAnimationsFunction",
                inputBlockIndex: 0,
                outputBlockIndex: 1,
                isVariable: true,
            },
            {
                input: "animation",
                output: "animation",
                inputBlockIndex: 2,
                outputBlockIndex: 0,
                isVariable: true,
            },
            {
                input: "easingFunction",
                output: "easingFunction",
                inputBlockIndex: 0,
                outputBlockIndex: 3,
                isVariable: true,
            },
            {
                input: "value_0",
                output: "value",
                inputBlockIndex: 0,
                outputBlockIndex: 1,
                isVariable: true,
            },
        ],
        extraProcessor(gltfBlock, _declaration, _mapping, parser, serializedObjects) {
            serializedObjects.forEach((serializedObject) => {
                // check if it is the json pointer block
                if (serializedObject.className === "FlowGraphJsonPointerParserBlock" /* FlowGraphBlockNames.JsonPointerParser */) {
                    serializedObject.config || (serializedObject.config = {});
                    serializedObject.config.outputValue = true;
                }
                else if (serializedObject.className === "FlowGraphInterpolationBlock" /* FlowGraphBlockNames.ValueInterpolation */) {
                    serializedObject.config || (serializedObject.config = {});
                    Object.keys(gltfBlock.values || []).forEach((key) => {
                        const value = gltfBlock.values?.[key];
                        if (key === "value" && value) {
                            // get the type of the value
                            const type = value.type;
                            if (type !== undefined) {
                                serializedObject.config.animationType = parser.arrays.types[type].flowGraphType;
                            }
                        }
                    });
                }
            });
            return serializedObjects;
        },
    },
    "animation/start": {
        blocks: ["FlowGraphPlayAnimationBlock" /* FlowGraphBlockNames.PlayAnimation */, "FlowGraphArrayIndexBlock" /* FlowGraphBlockNames.ArrayIndex */, "KHR_interactivity/FlowGraphGLTFDataProvider"],
        inputs: {
            values: {
                animation: { name: "index", gltfType: "number", toBlock: "FlowGraphArrayIndexBlock" /* FlowGraphBlockNames.ArrayIndex */ },
                speed: { name: "speed", gltfType: "number" },
                startTime: {
                    name: "from",
                    gltfType: "number",
                    convertConnectedTimeToFrames: true,
                    dataTransformer: (time, parser) => [time[0] * parser._animationTargetFps],
                },
                endTime: {
                    name: "to",
                    gltfType: "number",
                    convertConnectedTimeToFrames: true,
                    dataTransformer: (time, parser) => [time[0] * parser._animationTargetFps],
                },
            },
        },
        outputs: {
            flows: {
                err: { name: "error" },
            },
        },
        interBlockConnectors: [
            {
                input: "animationGroup",
                output: "value",
                inputBlockIndex: 0,
                outputBlockIndex: 1,
                isVariable: true,
            },
            {
                input: "array",
                output: "animationGroups",
                inputBlockIndex: 1,
                outputBlockIndex: 2,
                isVariable: true,
            },
        ],
        extraProcessor(_gltfBlock, _declaration, _mapping, _arrays, serializedObjects, _context, globalGLTF) {
            // add the glTF to the configuration of the last serialized object
            const serializedObject = serializedObjects[serializedObjects.length - 1];
            serializedObject.config || (serializedObject.config = {});
            serializedObject.config.glTF = globalGLTF;
            return serializedObjects;
        },
    },
    "animation/stop": {
        blocks: ["FlowGraphStopAnimationBlock" /* FlowGraphBlockNames.StopAnimation */, "FlowGraphArrayIndexBlock" /* FlowGraphBlockNames.ArrayIndex */, "KHR_interactivity/FlowGraphGLTFDataProvider"],
        inputs: {
            values: {
                animation: { name: "index", gltfType: "number", toBlock: "FlowGraphArrayIndexBlock" /* FlowGraphBlockNames.ArrayIndex */ },
            },
        },
        outputs: {
            flows: {
                err: { name: "error" },
            },
        },
        interBlockConnectors: [
            {
                input: "animationGroup",
                output: "value",
                inputBlockIndex: 0,
                outputBlockIndex: 1,
                isVariable: true,
            },
            {
                input: "array",
                output: "animationGroups",
                inputBlockIndex: 1,
                outputBlockIndex: 2,
                isVariable: true,
            },
        ],
        extraProcessor(_gltfBlock, _declaration, _mapping, _arrays, serializedObjects, _context, globalGLTF) {
            // add the glTF to the configuration of the last serialized object
            const serializedObject = serializedObjects[serializedObjects.length - 1];
            serializedObject.config || (serializedObject.config = {});
            serializedObject.config.glTF = globalGLTF;
            return serializedObjects;
        },
    },
    "animation/stopAt": {
        blocks: ["FlowGraphStopAnimationBlock" /* FlowGraphBlockNames.StopAnimation */, "FlowGraphArrayIndexBlock" /* FlowGraphBlockNames.ArrayIndex */, "KHR_interactivity/FlowGraphGLTFDataProvider"],
        configuration: {},
        inputs: {
            values: {
                animation: { name: "index", gltfType: "number", toBlock: "FlowGraphArrayIndexBlock" /* FlowGraphBlockNames.ArrayIndex */ },
                stopTime: {
                    name: "stopAtFrame",
                    gltfType: "number",
                    convertConnectedTimeToFrames: true,
                    dataTransformer: (time, parser) => [time[0] * parser._animationTargetFps],
                },
            },
        },
        outputs: {
            flows: {
                err: { name: "error" },
            },
        },
        interBlockConnectors: [
            {
                input: "animationGroup",
                output: "value",
                inputBlockIndex: 0,
                outputBlockIndex: 1,
                isVariable: true,
            },
            {
                input: "array",
                output: "animationGroups",
                inputBlockIndex: 1,
                outputBlockIndex: 2,
                isVariable: true,
            },
        ],
        extraProcessor(_gltfBlock, _declaration, _mapping, _arrays, serializedObjects, _context, globalGLTF) {
            // add the glTF to the configuration of the last serialized object
            const serializedObject = serializedObjects[serializedObjects.length - 1];
            serializedObject.config || (serializedObject.config = {});
            serializedObject.config.glTF = globalGLTF;
            return serializedObjects;
        },
    },
    "math/switch": {
        blocks: ["FlowGraphDataSwitchBlock" /* FlowGraphBlockNames.DataSwitch */],
        configuration: {
            cases: { name: "cases", isArray: true, inOptions: true, defaultValue: [] },
        },
        inputs: {
            values: {
                selection: { name: "case" },
            },
        },
        validation(gltfBlock) {
            const cases = gltfBlock.configuration?.cases;
            if (cases && cases.value) {
                const onlyIntegers = cases.value.every((caseValue) => {
                    // case value should be an integer. Since Number.isInteger(1.0) is true, we need to check if toString has only digits.
                    return typeof caseValue === "number" && /^-?\d+$/.test(caseValue.toString());
                });
                if (!onlyIntegers) {
                    Logger.Warn("Switch cases should be integers. Using empty array instead.");
                    cases.value = [];
                    return { valid: true };
                }
                // check for duplicates
                const uniqueCases = new Set(cases.value);
                cases.value = Array.from(uniqueCases);
            }
            return { valid: true };
        },
        extraProcessor(_gltfBlock, _declaration, _mapping, _arrays, serializedObjects) {
            const serializedObject = serializedObjects[0];
            serializedObject.dataInputs.forEach((input) => {
                if (input.name !== "default" && input.name !== "case") {
                    input.name = "in_" + input.name;
                }
            });
            serializedObject.config || (serializedObject.config = {});
            serializedObject.config.treatCasesAsIntegers = true;
            return serializedObjects;
        },
    },
    "debug/log": {
        blocks: ["FlowGraphConsoleLogBlock" /* FlowGraphBlockNames.ConsoleLog */],
        configuration: {
            message: { name: "messageTemplate", inOptions: true },
        },
    },
};
function getSimpleInputMapping(type, inputs = ["a"], inferType) {
    return {
        blocks: [type],
        inputs: {
            values: inputs.reduce((acc, input) => {
                acc[input] = { name: input };
                return acc;
            }, {}),
        },
        outputs: {
            values: {
                value: { name: "value" },
            },
        },
        extraProcessor(gltfBlock, _declaration, _mapping, _parser, serializedObjects) {
            var _a;
            if (inferType) {
                // configure it to work the way glTF specifies
                (_a = serializedObjects[0]).config || (_a.config = {});
                serializedObjects[0].config.preventIntegerFloatArithmetic = true;
                // try to infer the type or fallback to Integer
                // check the gltf block for the inputs, see if they have a type
                let type = -1;
                Object.keys(gltfBlock.values || {}).find((value) => {
                    if (gltfBlock.values?.[value].type !== undefined) {
                        type = gltfBlock.values[value].type;
                        return true;
                    }
                    return false;
                });
                if (type !== -1) {
                    serializedObjects[0].config.type = _parser.arrays.types[type].flowGraphType;
                }
            }
            return serializedObjects;
        },
        validation(gltfBlock) {
            if (inferType) {
                // make sure types are the same
                return ValidateTypes(gltfBlock);
            }
            return { valid: true };
        },
    };
}
function ValidateTypes(gltfBlock) {
    if (gltfBlock.values) {
        const types = Object.keys(gltfBlock.values)
            .map((key) => gltfBlock.values[key].type)
            .filter((type) => type !== undefined);
        const allSameType = types.every((type) => type === types[0]);
        if (!allSameType) {
            return { valid: false, error: "All inputs must be of the same type" };
        }
    }
    return { valid: true };
}
/**
 * Returns whether a literal path segment has an odd number of consecutive occurrences of any bracket character.
 * Brackets used literally inside a path segment must be doubled, so an odd run means the segment is malformed.
 * @param segment the literal path segment
 * @returns true when the segment contains an odd run of brackets
 */
function HasOddBracketRun(segment) {
    for (let index = 0; index < segment.length; index++) {
        const character = segment[index];
        if ("[]{}".indexOf(character) === -1) {
            continue;
        }
        let runLength = 1;
        while (segment[index + runLength] === character) {
            runLength++;
        }
        if (runLength % 2 !== 0) {
            return true;
        }
        index += runLength - 1;
    }
    return false;
}
/**
 * Validates the `pointer` configuration value of a `pointer/*` operation, following the JSON Pointer Template
 * Parsing steps of the KHR_interactivity specification. A template parameter must span an entire path segment, so
 * a template such as `/materials/{materialRef}pbrMetallicRoughness/...` is a syntax error, and the specification
 * requires the whole behavior graph to be rejected.
 * @param gltfBlock the glTF interactivity node
 * @returns the validation result
 */
function ValidateJsonPointerTemplate(gltfBlock) {
    const pointer = gltfBlock.configuration?.pointer?.value?.[0];
    if (typeof pointer !== "string") {
        return { valid: false, error: "A pointer operation requires a string `pointer` configuration value" };
    }
    // A JSON Pointer (RFC 6901) is either empty or a sequence of `/`-prefixed reference tokens.
    if (pointer.length !== 0 && pointer[0] !== "/") {
        return { valid: false, error: `The JSON Pointer Template "${pointer}" is not a syntactically valid JSON Pointer` };
    }
    const invalid = (reason) => ({ valid: false, error: `The JSON Pointer Template "${pointer}" is invalid: ${reason}` });
    const socketIds = new Set();
    for (const segment of pointer.split("/")) {
        const isIntegerParameter = segment[0] === "[" && segment[1] !== "[";
        const isReferenceParameter = segment[0] === "{" && segment[1] !== "{";
        if (!isIntegerParameter && !isReferenceParameter) {
            if (HasOddBracketRun(segment)) {
                return invalid(`the path segment "${segment}" contains an odd number of consecutive brackets`);
            }
            continue;
        }
        const closingBracket = isIntegerParameter ? "]" : "}";
        const body = segment.substring(1, segment.length - 1);
        if (segment.length < 3 || segment[segment.length - 1] !== closingBracket || /[[{]/.test(body) || /[\]}]/.test(body)) {
            return invalid(`the template parameter path segment "${segment}" is malformed`);
        }
        const socketId = body.replace(/~1/g, "/").replace(/~0/g, "~");
        if (socketIds.has(socketId)) {
            return invalid(`the template parameter "${socketId}" is used more than once`);
        }
        socketIds.add(socketId);
    }
    return { valid: true };
}
export function getAllSupportedNativeNodeTypes() {
    return Object.keys(gltfToFlowGraphMapping);
}
/**
 *
 * These are the nodes from the specs:

### Math Nodes
1. **Constants**
   - E (`math/E`) FlowGraphBlockNames.E
   - Pi (`math/Pi`) FlowGraphBlockNames.PI
   - Infinity (`math/Inf`) FlowGraphBlockNames.Inf
   - Not a Number (`math/NaN`) FlowGraphBlockNames.NaN
2. **Arithmetic Nodes**
   - Absolute Value (`math/abs`) FlowGraphBlockNames.Abs
   - Sign (`math/sign`) FlowGraphBlockNames.Sign
   - Truncate (`math/trunc`) FlowGraphBlockNames.Trunc
   - Floor (`math/floor`) FlowGraphBlockNames.Floor
   - Ceil (`math/ceil`) FlowGraphBlockNames.Ceil
   - Round (`math/round`)  FlowGraphBlockNames.Round
   - Fraction (`math/fract`) FlowGraphBlockNames.Fract
   - Negation (`math/neg`) FlowGraphBlockNames.Negation
   - Addition (`math/add`) FlowGraphBlockNames.Add
   - Subtraction (`math/sub`) FlowGraphBlockNames.Subtract
   - Multiplication (`math/mul`) FlowGraphBlockNames.Multiply
   - Division (`math/div`) FlowGraphBlockNames.Divide
   - Remainder (`math/rem`) FlowGraphBlockNames.Modulo
   - Minimum (`math/min`) FlowGraphBlockNames.Min
   - Maximum (`math/max`) FlowGraphBlockNames.Max
   - Clamp (`math/clamp`) FlowGraphBlockNames.Clamp
   - Saturate (`math/saturate`) FlowGraphBlockNames.Saturate
   - Interpolate (`math/mix`) FlowGraphBlockNames.MathInterpolation
3. **Comparison Nodes**
   - Equality (`math/eq`) FlowGraphBlockNames.Equality
   - Less Than (`math/lt`) FlowGraphBlockNames.LessThan
   - Less Than Or Equal To (`math/le`) FlowGraphBlockNames.LessThanOrEqual
   - Greater Than (`math/gt`) FlowGraphBlockNames.GreaterThan
   - Greater Than Or Equal To (`math/ge`) FlowGraphBlockNames.GreaterThanOrEqual
4. **Special Nodes**
   - Is Not a Number (`math/isNaN`) FlowGraphBlockNames.IsNaN
   - Is Infinity (`math/isInf`) FlowGraphBlockNames.IsInfinity
   - Select (`math/select`) FlowGraphBlockNames.Conditional
   - Switch (`math/switch`) FlowGraphBlockNames.DataSwitch
   - Random (`math/random`) FlowGraphBlockNames.Random
5. **Angle and Trigonometry Nodes**
   - Degrees-To-Radians (`math/rad`) FlowGraphBlockNames.DegToRad
   - Radians-To-Degrees (`math/deg`) FlowGraphBlockNames.RadToDeg
   - Sine (`math/sin`)  FlowGraphBlockNames.Sin
   - Cosine (`math/cos`) FlowGraphBlockNames.Cos
   - Tangent (`math/tan`) FlowGraphBlockNames.Tan
   - Arcsine (`math/asin`) FlowGraphBlockNames.Asin
   - Arccosine (`math/acos`) FlowGraphBlockNames.Acos
   - Arctangent (`math/atan`) FlowGraphBlockNames.Atan
   - Arctangent 2 (`math/atan2`) FlowGraphBlockNames.Atan2
6. **Hyperbolic Nodes**
   - Hyperbolic Sine (`math/sinh`) FlowGraphBlockNames.Sinh
   - Hyperbolic Cosine (`math/cosh`) FlowGraphBlockNames.Cosh
   - Hyperbolic Tangent (`math/tanh`) FlowGraphBlockNames.Tanh
   - Inverse Hyperbolic Sine (`math/asinh`) FlowGraphBlockNames.Asinh
   - Inverse Hyperbolic Cosine (`math/acosh`) FlowGraphBlockNames.Acosh
   - Inverse Hyperbolic Tangent (`math/atanh`) FlowGraphBlockNames.Atanh
7. **Exponential Nodes**
   - Exponent (`math/exp`) FlowGraphBlockNames.Exponential
   - Natural Logarithm (`math/log`) FlowGraphBlockNames.Log
   - Base-2 Logarithm (`math/log2`) FlowGraphBlockNames.Log2
   - Base-10 Logarithm (`math/log10`) FlowGraphBlockNames.Log10
   - Square Root (`math/sqrt`) FlowGraphBlockNames.SquareRoot
   - Cube Root (`math/cbrt`) FlowGraphBlockNames.CubeRoot
   - Power (`math/pow`) FlowGraphBlockNames.Power
8. **Vector Nodes**
   - Length (`math/length`) FlowGraphBlockNames.Length
   - Normalize (`math/normalize`) FlowGraphBlockNames.Normalize
   - Dot Product (`math/dot`) FlowGraphBlockNames.Dot
   - Cross Product (`math/cross`) FlowGraphBlockNames.Cross
   - Rotate 2D (`math/rotate2D`) FlowGraphBlockNames.Rotate2D
   - Rotate 3D (`math/rotate3D`) FlowGraphBlockNames.Rotate3D
   - Transform (`math/transform`) FlowGraphBlockNames.TransformVector
9. **Matrix Nodes**
   - Transpose (`math/transpose`) FlowGraphBlockNames.Transpose
   - Determinant (`math/determinant`) FlowGraphBlockNames.Determinant
   - Inverse (`math/inverse`) FlowGraphBlockNames.InvertMatrix
   - Multiplication (`math/matMul`) FlowGraphBlockNames.MatrixMultiplication
   - Compose (`math/matCompose`) FlowGraphBlockNames.MatrixCompose
   - Decompose (`math/matDecompose`) FlowGraphBlockNames.MatrixDecompose
10. **Quaternion Nodes**
    - Conjugate (`math/quatConjugate`) FlowGraphBlockNames.Conjugate
    - Multiplication (`math/quatMul`) FlowGraphBlockNames.Multiply
    - Angle Between Quaternions (`math/quatAngleBetween`) FlowGraphBlockNames.AngleBetween
    - Quaternion From Axis Angle (`math/quatFromAxisAngle`) FlowGraphBlockNames.QuaternionFromAxisAngle
    - Quaternion To Axis Angle (`math/quatToAxisAngle`) FlowGraphBlockNames.QuaternionToAxisAngle
    - Quaternion From Two Directional Vectors (`math/quatFromDirections`) FlowGraphBlockNames.QuaternionFromDirections
11. **Swizzle Nodes**
    - Combine (`math/combine2`, `math/combine3`, `math/combine4`, `math/combine2x2`, `math/combine3x3`, `math/combine4x4`)
        FlowGraphBlockNames.CombineVector2, FlowGraphBlockNames.CombineVector3, FlowGraphBlockNames.CombineVector4
        FlowGraphBlockNames.CombineMatrix2D, FlowGraphBlockNames.CombineMatrix3D, FlowGraphBlockNames.CombineMatrix
    - Extract (`math/extract2`, `math/extract3`, `math/extract4`, `math/extract2x2`, `math/extract3x3`, `math/extract4x4`)
        FlowGraphBlockNames.ExtractVector2, FlowGraphBlockNames.ExtractVector3, FlowGraphBlockNames.ExtractVector4
        FlowGraphBlockNames.ExtractMatrix2D, FlowGraphBlockNames.ExtractMatrix3D, FlowGraphBlockNames.ExtractMatrix
12. **Integer Arithmetic Nodes**
    - Absolute Value (`math/abs`) FlowGraphBlockNames.Abs
    - Sign (`math/sign`) FlowGraphBlockNames.Sign
    - Negation (`math/neg`) FlowGraphBlockNames.Negation
    - Addition (`math/add`) FlowGraphBlockNames.Add
    - Subtraction (`math/sub`) FlowGraphBlockNames.Subtract
    - Multiplication (`math/mul`) FlowGraphBlockNames.Multiply
    - Division (`math/div`) FlowGraphBlockNames.Divide
    - Remainder (`math/rem`) FlowGraphBlockNames.Modulo
    - Minimum (`math/min`) FlowGraphBlockNames.Min
    - Maximum (`math/max`) FlowGraphBlockNames.Max
    - Clamp (`math/clamp`) FlowGraphBlockNames.Clamp
13. **Integer Comparison Nodes**
    - Equality (`math/eq`) FlowGraphBlockNames.Equality
    - Less Than (`math/lt`) FlowGraphBlockNames.LessThan
    - Less Than Or Equal To (`math/le`) FlowGraphBlockNames.LessThanOrEqual
    - Greater Than (`math/gt`) FlowGraphBlockNames.GreaterThan
    - Greater Than Or Equal To (`math/ge`) FlowGraphBlockNames.GreaterThanOrEqual
14. **Integer Bitwise Nodes**
    - Bitwise NOT (`math/not`) FlowGraphBlockNames.BitwiseNot
    - Bitwise AND (`math/and`) FlowGraphBlockNames.BitwiseAnd
    - Bitwise OR (`math/or`) FlowGraphBlockNames.BitwiseOr
    - Bitwise XOR (`math/xor`) FlowGraphBlockNames.BitwiseXor
    - Right Shift (`math/asr`) FlowGraphBlockNames.BitwiseRightShift
    - Left Shift (`math/lsl`) FlowGraphBlockNames.BitwiseLeftShift
    - Count Leading Zeros (`math/clz`) FlowGraphBlockNames.LeadingZeros
    - Count Trailing Zeros (`math/ctz`) FlowGraphBlockNames.TrailingZeros
    - Count One Bits (`math/popcnt`) FlowGraphBlockNames.OneBitsCounter
15. **Boolean Arithmetic Nodes**
    - Equality (`math/eq`) FlowGraphBlockNames.Equality
    - Boolean NOT (`math/not`) FlowGraphBlockNames.BitwiseNot
    - Boolean AND (`math/and`) FlowGraphBlockNames.BitwiseAnd
    - Boolean OR (`math/or`) FlowGraphBlockNames.BitwiseOr
    - Boolean XOR (`math/xor`) FlowGraphBlockNames.BitwiseXor

### Type Conversion Nodes
1. **Boolean Conversion Nodes**
   - Boolean to Integer (`type/boolToInt`) FlowGraphBlockNames.BooleanToInt
   - Boolean to Float (`type/boolToFloat`) FlowGraphBlockNames.BooleanToFloat
2. **Integer Conversion Nodes**
   - Integer to Boolean (`type/intToBool`) FlowGraphBlockNames.IntToBoolean
   - Integer to Float (`type/intToFloat`) FlowGraphBlockNames.IntToFloat
3. **Float Conversion Nodes**
   - Float to Boolean (`type/floatToBool`) FlowGraphBlockNames.FloatToBoolean
   - Float to Integer (`type/floatToInt`) FlowGraphBlockNames.FloatToInt

### Control Flow Nodes
1. **Sync Nodes**
   - Sequence (`flow/sequence`) FlowGraphBlockNames.Sequence
   - Branch (`flow/branch`) FlowGraphBlockNames.Branch
   - Switch (`flow/switch`) FlowGraphBlockNames.Switch
   - While Loop (`flow/while`) FlowGraphBlockNames.WhileLoop
   - For Loop (`flow/for`) FlowGraphBlockNames.ForLoop
   - Do N (`flow/doN`) FlowGraphBlockNames.DoN
   - Multi Gate (`flow/multiGate`) FlowGraphBlockNames.MultiGate
   - Wait All (`flow/waitAll`) FlowGraphBlockNames.WaitAll
   - Throttle (`flow/throttle`) FlowGraphBlockNames.Throttle
2. **Delay Nodes**
   - Set Delay (`flow/setDelay`) FlowGraphBlockNames.SetDelay
   - Cancel Delay (`flow/cancelDelay`) FlowGraphBlockNames.CancelDelay

### State Manipulation Nodes
1. **Custom Variable Access**
   - Variable Get (`variable/get`) FlowGraphBlockNames.GetVariable
   - Variable Set (`variable/set`) FlowGraphBlockNames.SetVariable
   - Variable Interpolate (`variable/interpolate`)
2. **Object Model Access** // TODO fully test this!!!
   - JSON Pointer Template Parsing (`pointer/get`) [FlowGraphBlockNames.GetProperty, FlowGraphBlockNames.JsonPointerParser]
   - Effective JSON Pointer Generation (`pointer/set`) [FlowGraphBlockNames.SetProperty, FlowGraphBlockNames.JsonPointerParser]
   - Pointer Get (`pointer/get`) [FlowGraphBlockNames.GetProperty, FlowGraphBlockNames.JsonPointerParser]
   - Pointer Set (`pointer/set`) [FlowGraphBlockNames.SetProperty, FlowGraphBlockNames.JsonPointerParser]
   - Pointer Interpolate (`pointer/interpolate`) [FlowGraphBlockNames.ValueInterpolation, FlowGraphBlockNames.JsonPointerParser, FlowGraphBlockNames.PlayAnimation, FlowGraphBlockNames.BezierCurveEasing]

### Animation Control Nodes
1. **Animation Play** (`animation/start`) FlowGraphBlockNames.PlayAnimation
2. **Animation Stop** (`animation/stop`) FlowGraphBlockNames.StopAnimation
3. **Animation Stop At** (`animation/stopAt`) FlowGraphBlockNames.StopAnimation

### Event Nodes
1. **Lifecycle Event Nodes**
   - On Start (`event/onStart`) FlowGraphBlockNames.SceneReadyEvent
   - On Tick (`event/onTick`) FlowGraphBlockNames.SceneTickEvent
2. **Custom Event Nodes**
   - Receive (`event/receive`) FlowGraphBlockNames.ReceiveCustomEvent
   - Send (`event/send`) FlowGraphBlockNames.SendCustomEvent

 */
//# sourceMappingURL=declarationMapper.js.map