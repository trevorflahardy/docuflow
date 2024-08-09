/**
 * Represents one of the many types of tokens in an MD file.
 */
export enum TokenType {
    HEADER_IDENTIFIER,
    CHAR,
    NEW_LINE,
    STAR_IDENTIFIER,
}


/** 
 * Represents a Token in an MD file. This is a character, specific identifier,
 * or similar.
 */
export class Token {
    value: string;
    line: number;
    column: number; // The index of this token in the line
    index: number; // The index of this token in the file

    constructor(value: string, line: number, column: number, index: number) {
        this.value = value;
        this.line = line;
        this.column = column;
        this.index = index;
    }

    get type(): TokenType {
        // Determine the type of token based on its value
        switch (this.value) {
            case "#":
                return TokenType.HEADER_IDENTIFIER;
            case "\n":
                return TokenType.NEW_LINE;
            case "*":
                return TokenType.STAR_IDENTIFIER;
            default:
                return TokenType.CHAR;
        }
    }
}