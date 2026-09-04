/**
 * Parse an ASCII FBX file into an FBXDocument.
 */
export function parseAsciiFBX(text) {
    const tokenizer = new Tokenizer(text);
    const version = parseVersion(text);
    const nodes = [];
    while (!tokenizer.isEOF()) {
        tokenizer.skipWhitespaceAndComments();
        if (tokenizer.isEOF()) {
            break;
        }
        const node = parseNodeFromTokens(tokenizer);
        if (node) {
            nodes.push(node);
        }
    }
    return { version, nodes };
}
/** Extract FBX version from the header comment (e.g. "; FBX 7.7.0 project file") */
function parseVersion(text) {
    const match = text.match(/;\s*FBX\s+(\d+)\.(\d+)\.(\d+)/);
    if (!match) {
        throw new Error("Cannot determine FBX version from ASCII header");
    }
    return parseInt(match[1]) * 1000 + parseInt(match[2]) * 100 + parseInt(match[3]);
}
// ── Tokenizer ──────────────────────────────────────────────────────────────────
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Identifier"] = 0] = "Identifier";
    TokenType[TokenType["Number"] = 1] = "Number";
    TokenType[TokenType["String"] = 2] = "String";
    TokenType[TokenType["OpenBrace"] = 3] = "OpenBrace";
    TokenType[TokenType["CloseBrace"] = 4] = "CloseBrace";
    TokenType[TokenType["Colon"] = 5] = "Colon";
    TokenType[TokenType["Comma"] = 6] = "Comma";
    TokenType[TokenType["Star"] = 7] = "Star";
    TokenType[TokenType["EOF"] = 8] = "EOF";
})(TokenType || (TokenType = {}));
class Tokenizer {
    constructor(text) {
        this.text = text;
        this.pos = 0;
        this.len = text.length;
    }
    isEOF() {
        this.skipWhitespaceAndComments();
        return this.pos >= this.len;
    }
    peek() {
        const saved = this.pos;
        const tok = this.next();
        this.pos = saved;
        return tok;
    }
    next() {
        this.skipWhitespaceAndComments();
        if (this.pos >= this.len) {
            return { type: 8 /* TokenType.EOF */, value: "", pos: this.pos };
        }
        const ch = this.text[this.pos];
        const startPos = this.pos;
        switch (ch) {
            case "{":
                this.pos++;
                return { type: 3 /* TokenType.OpenBrace */, value: "{", pos: startPos };
            case "}":
                this.pos++;
                return { type: 4 /* TokenType.CloseBrace */, value: "}", pos: startPos };
            case ":":
                this.pos++;
                return { type: 5 /* TokenType.Colon */, value: ":", pos: startPos };
            case ",":
                this.pos++;
                return { type: 6 /* TokenType.Comma */, value: ",", pos: startPos };
            case "*":
                this.pos++;
                return { type: 7 /* TokenType.Star */, value: "*", pos: startPos };
            case '"':
                return this.readString();
            default:
                if (this.isNumberStart(ch)) {
                    return this.readNumber();
                }
                if (this.isIdentStart(ch)) {
                    return this.readIdentifier();
                }
                throw new Error(`Unexpected character '${ch}' at position ${this.pos}`);
        }
    }
    expect(type) {
        const tok = this.next();
        if (tok.type !== type) {
            throw new Error(`Expected token type ${type} but got ${tok.type} ('${tok.value}') at pos ${tok.pos}`);
        }
        return tok;
    }
    /** Look ahead to see if the next identifier + colon is a child node start */
    isNextNodeStart() {
        const saved = this.pos;
        this.skipWhitespaceAndComments();
        // Read the identifier
        if (this.pos < this.len && this.isIdentStart(this.text[this.pos])) {
            while (this.pos < this.len && this.isIdentChar(this.text[this.pos])) {
                this.pos++;
            }
            // Skip whitespace between identifier and potential colon
            while (this.pos < this.len && (this.text[this.pos] === " " || this.text[this.pos] === "\t")) {
                this.pos++;
            }
            const isNode = this.pos < this.len && this.text[this.pos] === ":";
            this.pos = saved;
            return isNode;
        }
        this.pos = saved;
        return false;
    }
    skipWhitespaceAndComments() {
        while (this.pos < this.len) {
            const ch = this.text[this.pos];
            if (ch === " " || ch === "\t" || ch === "\r" || ch === "\n") {
                this.pos++;
            }
            else if (ch === ";") {
                // Skip comment to end of line
                while (this.pos < this.len && this.text[this.pos] !== "\n") {
                    this.pos++;
                }
            }
            else {
                break;
            }
        }
    }
    readString() {
        const startPos = this.pos;
        this.pos++; // skip opening quote
        let value = "";
        while (this.pos < this.len && this.text[this.pos] !== '"') {
            if (this.text[this.pos] === "\\" && this.pos + 1 < this.len) {
                this.pos++;
                value += this.text[this.pos];
            }
            else {
                value += this.text[this.pos];
            }
            this.pos++;
        }
        if (this.pos < this.len) {
            this.pos++; // skip closing quote
        }
        return { type: 2 /* TokenType.String */, value, pos: startPos };
    }
    readNumber() {
        const startPos = this.pos;
        // Handle leading sign
        if (this.text[this.pos] === "-" || this.text[this.pos] === "+") {
            this.pos++;
        }
        while (this.pos < this.len && this.isDigit(this.text[this.pos])) {
            this.pos++;
        }
        if (this.pos < this.len && this.text[this.pos] === ".") {
            this.pos++;
            while (this.pos < this.len && this.isDigit(this.text[this.pos])) {
                this.pos++;
            }
        }
        // Scientific notation
        if (this.pos < this.len && (this.text[this.pos] === "e" || this.text[this.pos] === "E")) {
            this.pos++;
            if (this.pos < this.len && (this.text[this.pos] === "+" || this.text[this.pos] === "-")) {
                this.pos++;
            }
            while (this.pos < this.len && this.isDigit(this.text[this.pos])) {
                this.pos++;
            }
        }
        return { type: 1 /* TokenType.Number */, value: this.text.substring(startPos, this.pos), pos: startPos };
    }
    readIdentifier() {
        const startPos = this.pos;
        while (this.pos < this.len && this.isIdentChar(this.text[this.pos])) {
            this.pos++;
        }
        return { type: 0 /* TokenType.Identifier */, value: this.text.substring(startPos, this.pos), pos: startPos };
    }
    isDigit(ch) {
        return ch >= "0" && ch <= "9";
    }
    isNumberStart(ch) {
        if (this.isDigit(ch)) {
            return true;
        }
        if ((ch === "-" || ch === "+") && this.pos + 1 < this.len) {
            return this.isDigit(this.text[this.pos + 1]) || this.text[this.pos + 1] === ".";
        }
        return false;
    }
    isIdentStart(ch) {
        return (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z") || ch === "_";
    }
    isIdentChar(ch) {
        return this.isIdentStart(ch) || this.isDigit(ch) || ch === "|";
    }
}
// ── Node Parsing ───────────────────────────────────────────────────────────────
function parseNodeFromTokens(tokenizer) {
    const nameTok = tokenizer.peek();
    if (nameTok.type === 4 /* TokenType.CloseBrace */ || nameTok.type === 8 /* TokenType.EOF */) {
        return null;
    }
    // Node name
    const identTok = tokenizer.next();
    if (identTok.type !== 0 /* TokenType.Identifier */) {
        throw new Error(`Expected identifier for node name, got '${identTok.value}' at pos ${identTok.pos}`);
    }
    const name = identTok.value;
    tokenizer.expect(5 /* TokenType.Colon */);
    // Parse properties until we hit '{' or end-of-line content
    const properties = [];
    const children = [];
    // Check for array shorthand: *count { a: ... }
    let peek = tokenizer.peek();
    if (peek.type === 7 /* TokenType.Star */) {
        // Array node like "Vertices: *25959 {"
        tokenizer.next(); // consume *
        const countTok = tokenizer.expect(1 /* TokenType.Number */);
        const count = parseInt(countTok.value);
        tokenizer.expect(3 /* TokenType.OpenBrace */);
        // Expect "a:" followed by comma-separated values
        const aTok = tokenizer.next();
        if (aTok.type === 0 /* TokenType.Identifier */ && aTok.value === "a") {
            tokenizer.expect(5 /* TokenType.Colon */);
            const values = parseArrayValues(tokenizer, count);
            properties.push({ type: "float64[]", value: new Float64Array(values) });
        }
        tokenizer.expect(4 /* TokenType.CloseBrace */);
        return { name, properties, children };
    }
    // Parse inline properties (comma-separated values on the same logical line)
    // Values can be: numbers, strings, or bare identifiers (e.g. "T", "Y", "CullingOff")
    peek = tokenizer.peek();
    while (peek.type !== 3 /* TokenType.OpenBrace */ && peek.type !== 4 /* TokenType.CloseBrace */ && peek.type !== 8 /* TokenType.EOF */) {
        if (peek.type === 1 /* TokenType.Number */) {
            const tok = tokenizer.next();
            const numVal = parseNumericValue(tok.value);
            if (Number.isInteger(numVal) && !tok.value.includes(".") && !tok.value.includes("e") && !tok.value.includes("E")) {
                properties.push({ type: isInt32(numVal) ? "int32" : "int64", value: numVal });
            }
            else {
                properties.push({ type: "float64", value: numVal });
            }
        }
        else if (peek.type === 2 /* TokenType.String */) {
            const tok = tokenizer.next();
            properties.push({ type: "string", value: tok.value });
        }
        else if (peek.type === 0 /* TokenType.Identifier */) {
            // Check if this is a property value or the start of a new child node.
            // If the next non-whitespace after the identifier is ':', it's a child node name — stop.
            if (tokenizer.isNextNodeStart()) {
                break;
            }
            // Bare identifier as a property value (e.g. "T", "Y", "CullingOff")
            const tok = tokenizer.next();
            properties.push({ type: "string", value: tok.value });
        }
        else if (peek.type === 6 /* TokenType.Comma */) {
            tokenizer.next(); // consume comma
        }
        else {
            break;
        }
        peek = tokenizer.peek();
    }
    // Check for block body { ... }
    peek = tokenizer.peek();
    if (peek.type === 3 /* TokenType.OpenBrace */) {
        tokenizer.next(); // consume '{'
        // Parse child nodes
        while (true) {
            peek = tokenizer.peek();
            if (peek.type === 4 /* TokenType.CloseBrace */ || peek.type === 8 /* TokenType.EOF */) {
                break;
            }
            const child = parseNodeFromTokens(tokenizer);
            if (child) {
                children.push(child);
            }
            else {
                break;
            }
        }
        tokenizer.expect(4 /* TokenType.CloseBrace */);
    }
    return { name, properties, children };
}
function parseArrayValues(tokenizer, count) {
    const values = [];
    while (true) {
        const peek = tokenizer.peek();
        if (peek.type === 4 /* TokenType.CloseBrace */ || peek.type === 8 /* TokenType.EOF */) {
            break;
        }
        if (peek.type === 6 /* TokenType.Comma */) {
            tokenizer.next();
            continue;
        }
        if (peek.type === 1 /* TokenType.Number */) {
            const tok = tokenizer.next();
            values.push(Number(tok.value));
        }
        else {
            break;
        }
    }
    if (values.length !== count) {
        throw new Error(`ASCII FBX array declared ${count} values but parsed ${values.length}`);
    }
    return values;
}
function parseNumericValue(str) {
    return Number(str);
}
function isInt32(value) {
    return value >= -2147483648 && value <= 2147483647;
}
//# sourceMappingURL=fbxAsciiParser.js.map