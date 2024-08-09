import { Heading, Italic, Node, Paragraph, Text } from "./ast";
import { TokenType, Token } from "./tokens";

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

    /**
     * Parses an italic token. This is a Text that is surrounded by a single star
     * on either side. For example, *this is italic*.
     * 
     * The invariant is that the current token is a star, and the next token
     * is a character. This will consume the star token and return an Italic
     * object.
     */
    private parseItalic(): Italic {
        let italic = new Italic([]);
        let currentText = new Text([]);

        // Consume the star token at the beginning
        this.consume();

        // While the current token is not a star, consume the token and add it to
        // the current text.
        while (this.currentToken() && this.currentToken()!.type !== TokenType.STAR_IDENTIFIER) {
            const next = this.consume()!;
            currentText.tokens.push(next);
        }

        // After we have all the tokens, consume the star token at the end, if it exists
        this.consume();

        // And if the currentText has tokens, we need to append it to the italic object
        if (currentText.length > 0) {
            italic.nodes.push(currentText);
        }

        return italic
    }


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
            // TODO: If this is some italic identifier, append the currentText to
            // TODO: header, parse new italic object, and then create a new currentText
            // TODO: object.
            if (this.currentToken()!.type === TokenType.STAR_IDENTIFIER && this.peek() && this.peek()!.type === TokenType.CHAR) {
                header.nodes.push(currentText);
                currentText = new Text([]);
                const italic = this.parseItalic();
                header.nodes.push(italic);
                continue
            }

            // For now, just add the token to the current text
            currentText.tokens.push(this.consume()!);
        }

        if (currentText.length > 0) {
            header.nodes.push(currentText);
        }

        return header;
    }

    private parseParagraph(): Paragraph {
        // If the token is a character, we need to create a paragraph node starting
        // at this token and walking until we find a new line.
        let paragraph = new Paragraph([]);
        let currentText = new Text([]);

        while (this.currentToken() && this.currentToken()!.type !== TokenType.HEADER_IDENTIFIER && this.currentToken()!.type !== TokenType.NEW_LINE) {
            // If this token is a star and the next is a char, this is an italic
            if (this.currentToken()!.type === TokenType.STAR_IDENTIFIER && this.peek() && this.peek()!.type === TokenType.CHAR) {
                if (currentText.length > 0) {
                    paragraph.nodes.push(currentText);
                }

                currentText = new Text([]);
                const italic = this.parseItalic();
                paragraph.nodes.push(italic);
                continue;
            }
            else {
                // This is a normal character, so we can append it to the current text
                currentText.tokens.push(this.consume()!);
            }
        }

        // If the current text has tokens, we need to append it to the paragraph
        if (currentText.length > 0) {
            paragraph.nodes.push(currentText);
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