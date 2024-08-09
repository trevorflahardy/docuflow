import { Heading, Italic, Node, Paragraph, Text } from "./ast.js";
import { TokenType, Token } from "./tokens.js";

/**
 * Represents an MD parser. This class is responsible for walking through a MD
 * file and parsing it into HTML. This class is only meant to handle one
 * file at a time.
 */
export class Parser {
    content: string; // The content of the MD file

    currentLine: number = 1; // The current line number while parsing
    currentColumnIndex: number = 0; // The current column number while parsing (0-indexed)
    currentCharIndex: number = 0; // The current character index while parsing (0-indexed)

    tokens: Array<Token> = []; // The tokens that make up the MD file. Will only be set after parsing

    constructor(content: string) {
        this.content = content;
        this.tokens = this.parseTokens();
    }

    private parseTokens(): Array<Token> {
        let tokens: Array<Token> = [];

        for (let i = 0; i < this.content.length; i++) {
            // Grab it's char
            this.currentCharIndex = i;
            const char = this.content[this.currentCharIndex];

            // If it's a newline character, increment the 
            // line number and reset the column index
            if (char === "\n") {
                this.currentLine++;
                this.currentColumnIndex = 0;
            }

            // Turn it into a token.
            // NOTE: We're keeping \n tokens because they're important for
            // formatting. We'll use them to determine when to create new
            // paragraphs.
            const token = new Token(char, this.currentLine, this.currentColumnIndex, this.currentCharIndex);

            // And append it to the list of tokens
            tokens.push(token);
        }

        // Return our tokens
        return tokens;
    }

    /**
     * Peeks at the next token in the stream without consuming it.
     * Returns NULL if there are no more tokens.
     */
    private peek(amount: number = 1): Token | null {
        if (this.tokens.length <= amount) {
            return null;
        }

        return this.tokens[amount];
    }

    /**
     * Consumes the current token in the stream and returns it. Moves
     * onto the next token. Returns NULL if there are no more tokens.
     */
    private consume(): Token | null {
        if (!this.tokens) {
            return null;
        }

        // Remove the first token int he array, index 0, and return it
        const token = this.tokens.shift()!;
        this.currentCharIndex++;
        return token;
    }

    private currentToken(): Token | null {
        if (!this.tokens) {
            return null;
        }

        return this.tokens[0];
    }

    // private parseItalic(): Italic {
    //     // Called if the current token is a star, it is not followed
    //     // by another star (for a bold) or a space for a raw star or list of 
    //     // some sort.
    //     let italic = new Italic([]);
    // 
    //     // Consume this token to ignore the star
    //     this.consume();
    // 
    //     while (this.currentToken() && this.currentToken()!.type !== TokenType.STAR_IDENTIFIER) {
    //         const next = this.consume()!;
    //         italic.tokens.push(next);
    //     }
    // 
    //     // We know the next token is a star, so consume it
    //     this.consume();
    // 
    //     // And return the italic node
    //     return italic;
    // }

    private parseHeader(): Heading {
        // If the token is a header, we need to create a header node starting
        // at this token and walking until we find a new line.
        let level = 0;

        // While we have tokens and the token is a header identifier, increment
        // the level of the header
        while (this.currentToken() && this.currentToken()!.type === TokenType.HEADER_IDENTIFIER) {
            level++;
            this.consume();
        }

        let header = new Heading([], level);
        let currentText = new Text([]);
        while (this.currentToken() && this.currentToken()!.type !== TokenType.NEW_LINE) {
            const next = this.consume()!;

            // TODO: If this is some italic identifier, append the currentText to
            // TODO: header, parse new italic object, and then create a new currentText
            // TODO: object.

            // For now, just add the token to the current text
            currentText.tokens.push(next);
        }

        header.nodes.push(currentText);
        return header;
    }

    private parseParagraph(): Paragraph {
        // If the token is a character, we need to create a paragraph node starting
        // at this token and walking until we find a new line.
        let paragraph = new Paragraph([]);

        let currentText = new Text([this.consume()!]);
        while (this.currentToken() && this.currentToken()!.type !== TokenType.HEADER_IDENTIFIER) {
            const next = this.consume()!;

            // If this next is a new line, we need to append the current text to
            // the paragraph and create a new text object to continue.
            if (next.type === TokenType.NEW_LINE) {
                paragraph.text.push(currentText);
                currentText = new Text([]);
                continue;
            }
            else {
                // This is a normal character, so we can append it to the current text
                currentText.tokens.push(next);
            }
        }

        return paragraph;
    }

    private parseAST(): Array<Node> {
        // Now that we have our tokens, we can walk through them to create an AST.
        // Some elements, like code blocks, lists, and tables, will require special
        // handling, and others (like bodies) are quite simple. Unlike a traditional AST,
        // we're going to be creating a flat list of nodes. This is because we're not
        // going to be doing any transformations on the nodes themselves. Instead, we'll
        // be using the nodes to generate HTML. This is a bit of a simplification, but
        // it should be sufficient for our needs.
        let ast: Array<Node> = [];
        console.log('Parsing AST');

        // While we still have tokens, continue getting them and parsing them
        while (this.tokens) {
            const token = this.currentToken();
            if (!token) {
                break;
            }

            console.log('Parsing token: ', token.value);

            // If the token type is a new line, we can skip over it. The parsing
            // process will handle new lines (will walk until a new line is found).
            if (token.type === TokenType.NEW_LINE) {
                console.log('Skipping new line');
                this.consume();
                continue;
            }
            else if (token.type == TokenType.HEADER_IDENTIFIER) {
                console.log('Parsing header');
                const header = this.parseHeader();
                console.log('Parsed header and pushing', header);
                ast.push(header);
            }
            else {
                const paragraph = this.parseParagraph();
                ast.push(paragraph);
            }
        }

        return ast
    }

    /**
     * Parses the contents of the MD file into an AST then into HTML. Will return the
     * created HTML as a string.
     */
    toHTML(): string {
        // Walk through all the AST nodes and convert them to HTML, then join them
        // together into a single string.
        const parsed = this.parseAST();
        console.log('Parsed AST', parsed);

        return parsed.map(node => node.toHTML()).join("\n");
    }
}