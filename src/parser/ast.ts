import { Token, TokenType } from "./tokens.js";

export interface Node {
    /**
     * Converts the node to HTML.
     */
    toHTML(): string;

}

/**
 * Represents content in the MD file. This is raw content without any formatting, 
 * a body.
 */
export class Paragraph implements Node {
    tokens: Array<Token> = [];

    constructor(tokens: Array<Token>) {
        this.tokens = tokens;
    }

    get length(): number {
        return this.tokens.length;
    }

    toHTML(): string {
        // The body must be wrapped in a <p> tag
        return `<p>${this.tokens.map(token => token.value).join("")}</p>`
    }
}

/**
 * Represents a heading in the MD file. This is a title.
 */
export class Heading implements Node {
    tokens: Array<Token> = []; // The tokens that make up the heading, including the # symbol

    constructor(tokens: Array<Token>) {
        this.tokens = tokens;
    }

    get level(): number {
        /// The level of the heading, from 1 to 6. 
        let level = 0;
        for (const token of this.tokens) {
            if (token.type !== TokenType.HEADER) {
                break;
            }

            level++;
        }

        return level;
    }

    toHTML(): string {
        // Grab the level of the heading, and wrap the text in an <h{level}> tag
        const level = this.level;
        // Grab only the tokens that come after the # symbols
        const tokens = this.tokens.slice(level);

        return `<h${level}>${tokens.map(token => token.value).join("")}</h${level}>`
    }

}