import { ShaderDefineExpression } from "../shaderDefineExpression.js";
/** @internal */
export declare class ShaderDefineArithmeticOperator extends ShaderDefineExpression {
    define: string;
    operand: string;
    testValue: string;
    constructor(define: string, operand: string, testValue: string);
    toString(): string;
    isTrue(preprocessors: {
        [key: string]: string;
    }): boolean;
}
