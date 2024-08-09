import { Token } from "./tokens";

export interface Node {
    /**
     * Converts the node to HTML.
     */
    toHTML(): string;

}

/**
 * Represents raw Text in the MD file. This is just a string of characters that follow
 * each other not interrupted by any special characters or nodes or formatting.
 */
export class Text implements Node {
    tokens: Array<Token> = [];

    constructor(tokens: Array<Token>) {
        this.tokens = tokens;
    }

    get length(): number {
        return this.tokens.length;
    }

    toHTML(): string {
        return this.tokens.map(token => token.value).join("");
    }
}

/**
 * Represents content in the MD file. This is raw content without any formatting, 
 * a body.
 */
export class Paragraph implements Node {
    nodes: Array<Node> = [];

    constructor(nodes: Array<Node>) {
        this.nodes = nodes;
    }

    get length(): number {
        return this.nodes.length;
    }

    toHTML(): string {
        // Every node in this paragraph should be wrapped in a <p> tag.
        // So for N nodes we have N <p> tags.
        return this.nodes.map(node => `<p>${node.toHTML()}</p>`).join("\n");
    }
}

/**
 * Represents a heading in the MD file. This is a title.
 */
export class Heading implements Node {
    nodes: Array<Node> = []; // The nodes that make up this heading
    level: number; // The level of the heading, from 1 to 6

    constructor(nodes: Array<Node>, level: number) {
        this.nodes = nodes;
        this.level = level;
    }

    toHTML(): string {
        // Grab the level of the heading, and wrap the text in an <h{level}> tag
        const level = this.level;

        return `<h${level}>${this.nodes.map(node => node.toHTML()).join("\n")}</h${level}>`
    }
}

export class Italic implements Node {
    nodes: Array<Node> = [];

    constructor(nodes: Array<Node>) {
        this.nodes = nodes;
    }

    toHTML(): string {
        return `<i>${this.nodes.map(node => node.toHTML()).join("")}</i>`;
    }
}