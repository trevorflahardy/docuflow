import { Bold, Heading, Italic, Node, Paragraph, Text } from "./ast";
import { TokenType, Token } from "./tokens";

/**
 * Represents an MD parser. This class is responsible for walking through a MD
 * file and parsing it into HTML. This class is only meant to handle one
 * file at a time.
 */
export class Parser {
    content: string; // The content of the MD file

    tokens: Array<Token> = []; // The tokens that make up the MD file. Will only be set after parsing

    constructor(content: string) {
        this.content = content;
        this.tokens = this.parseTokens();

        console.log('EOF token:', this.content[this.content.length - 1]);
    }

    private parseTokens(): Array<Token> {
        let tokens: Array<Token> = [];

        for (let i = 0; i < this.content.length; i++) {
            const char = this.content[i];

            // Turn it into a token.
            // NOTE: We're keeping \n tokens because they're important for
            // formatting. We'll use them to determine when to create new
            // paragraphs.
            const token = new Token(char);

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
    private peek(forwardBy: number = 1): Token | null {
        if (this.tokens.length == 0) {
            return null;
        }

        // If the forwardBy is out of bounds, return NULL
        if (forwardBy >= this.tokens.length) {
            return null;
        }

        // Return the token at the forwardBy index
        return this.tokens[forwardBy];
    }

    // Overloads
    private consume(): Token | null;
    private consume(forwardBy: number): Array<Token> | null;

    private consume(forwardBy?: number): Token | Array<Token> | null {
        if (this.tokens.length == 0) {
            return null;
        }

        if (forwardBy == undefined) {
            // Remove the first token in the array, index 0, and return it
            const token = this.tokens.shift()!;
            return token;
        }
        else {
            // Ensure the count is within the bounds of the tokens
            const count = Math.min(forwardBy, this.tokens.length);

            // Remove the specified number of tokens from the array and return them
            return this.tokens.splice(0, count);
        }

    }

    private currentToken(): Token | null {
        if (this.tokens.length == 0) {
            return null;
        }

        return this.tokens[0];
    }

    private currentTokenIs(...type: Array<TokenType>): boolean | null {
        const current = this.currentToken();
        if (!current) {
            return null;
        }

        for (let i = 0; i < type.length; i++) {
            if (current.type === type[i]) {
                return true;
            }
        }

        return false;
    }

    private currentTokenIsNot(...type: Array<TokenType>): boolean | null {
        const currentTokenIs = this.currentTokenIs(...type);
        if (currentTokenIs === null) {
            return null;
        }

        return !currentTokenIs;
    }

    private currentMayBeItalic(): boolean {
        const peek = this.peek();
        return this.currentToken() !== null && this.currentTokenIs(TokenType.UNDERLINE_IDENTIFIER)! && peek !== null && peek.type === TokenType.CHAR;
    }

    private currentMayBeBold(): boolean {
        const peek = this.peek();
        return this.currentToken() !== null && this.currentTokenIs(TokenType.STAR_IDENTIFIER)! && peek !== null && peek.type === TokenType.STAR_IDENTIFIER;
    }

    /**
     * Denotes if a possible bold can be parsed. That is, if the bold has an
     * ending double star. This is important because we need to know if we can parse a
     * bold or not.
     * 
     * **this is bold** -> Can parse
     * **this is not bold -> Cannot parse
     * This is ** not bold -> Cannot parse
     */
    private canParseBold(): boolean {
        let ahead = 1;
        let nextToken: Token | null;
        let followingToken: Token | null;

        // While the next peek and the following are not null
        while ((nextToken = this.peek(ahead)) !== null && (followingToken = this.peek(ahead)) !== null) {
            // Return true if we find the closing stars
            if (nextToken.type === TokenType.STAR_IDENTIFIER && followingToken.type === TokenType.STAR_IDENTIFIER) {
                return true;
            }

            // Return false if we hit a new line
            if (nextToken.type === TokenType.NEW_LINE || followingToken.type === TokenType.NEW_LINE) {
                return false;
            }

            ahead++;
        }

        // We have hit the end of the tokens and did not find a closing star
        return false;
    }

    /**
     * Denotes if a possible italic can be parsed. That is, if the italic has an 
     * ending star. This is important because we need to know if we can parse an
     * italic or not.
     * 
     * *this is italic* -> Can parse
     * *this is not italic -> Cannot parse
     * This is * not italic -> Cannot parse
     */
    private canParseItalic(): boolean {
        let ahead = 1;
        let nextToken: Token | null;

        while ((nextToken = this.peek(ahead)) !== null) {
            // Break if we find the closing star or hit a new line
            if (nextToken.type === TokenType.UNDERLINE_IDENTIFIER) {
                return true;
            }

            if (nextToken.type === TokenType.NEW_LINE) {
                return false;
            }

            ahead++;
        }

        // If we exit the loop, we didn't find a closing star
        return false;
    }


    private parsePotentialBold(): Bold | null {
        if (!this.canParseBold()) {
            console.log('Cannot parse bold for current token', this.currentToken());
            return null;
        }

        // Consume the two star tokens at the beginning
        const consumed = this.consume(2);
        console.log('Consumed two stars when parsing bold: ', consumed);

        let bold = new Bold([]);
        let currentText = new Text([]);

        // While the current token is not a star
        while (this.currentTokenIsNot(TokenType.STAR_IDENTIFIER) && this.peek() !== null && this.peek()!.type !== TokenType.STAR_IDENTIFIER) {
            if (this.currentMayBeItalic()) {
                // This may be some italic text. Try and parse it. If we can't, treat it as a normal character
                const italic = this.parsePotentialItalic();
                if (italic) {
                    // We were able to parse it. Push the current text, reset it, and add the italic 
                    bold.nodes.push(currentText);
                    currentText = new Text([]);
                    bold.nodes.push(italic);
                    continue;
                }
            }

            const next = this.consume()!;
            currentText.tokens.push(next);
        }

        // Because the while loop looks while the current token is not a star and the following isn't a star,
        // when we break out of the loop we have one additional char to consume.
        currentText.tokens.push(this.consume()!);

        // Consume the ending star tokens
        this.consume(2);

        // If the current text has tokens, we need to append it to the bold object
        if (currentText.length > 0) {
            bold.nodes.push(currentText);
        }

        return bold
    }

    /**
     * Parses an italic token. This is a Text that is surrounded by a single star
     * on either side. For example, *this is italic*.
     * 
     * The invariant is that the current token is a star, and the next token
     * is a character. This will consume the star token and return an Italic
     * object.
     * 
     * @returns Italic | null - The italic object if it could be parsed, NULL otherwise.
     */
    private parsePotentialItalic(): Italic | null {
        if (!this.canParseItalic()) {
            console.log('Cannot parse italic for current token', this.currentToken());
            return null;
        }

        let italic = new Italic([]);
        let currentText = new Text([]);

        // Consume the star token at the beginning
        this.consume();

        // While the current token is not a star, consume the token and add it to
        // the current text.
        while (this.currentTokenIsNot(TokenType.UNDERLINE_IDENTIFIER)) {
            // Check if we could have some bold text. If we can, try and parse it
            if (this.currentMayBeBold()) {
                // Try and parse the bold. If we can't, then we just treat this star as if it was
                // a normal character.
                const bold = this.parsePotentialBold();
                if (bold) {
                    // We were able to parse it. Push the current text, reset it, and add the bold
                    italic.nodes.push(currentText);
                    currentText = new Text([]);
                    italic.nodes.push(bold);
                    continue;
                }
            }

            const next = this.consume()!;
            currentText.tokens.push(next);
        }

        // Consume the ending star token.
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
        while (this.currentTokenIs(TokenType.HEADER_IDENTIFIER)) {
            level++;
            this.consume();
        }

        let header = new Heading([], level);
        let currentText = new Text([]);
        while (this.currentTokenIsNot(TokenType.NEW_LINE)) {
            // If this is a star and the next is a char, this could be an italic
            if (this.currentMayBeItalic()) {
                // Try and parse the italic. If we can't, then we just treat this star as if it was
                // a normal character.
                const italic = this.parsePotentialItalic();
                if (italic) {
                    // We were able to parse it. Push the current text, reset it, and add the italic 
                    header.nodes.push(currentText);
                    currentText = new Text([]);
                    header.nodes.push(italic);
                }
                else {
                    // We were not able to parse it. Push this star as a normal character
                    currentText.tokens.push(this.consume()!);
                }

                continue;
            }
            else if (this.currentMayBeBold()) {
                // Try and parse the bold. If we can't, then we just treat this star as if it was
                // a normal character.
                const bold = this.parsePotentialBold();
                if (bold) {
                    // We were able to parse it. Push the current text, reset it, and add the bold
                    header.nodes.push(currentText);
                    currentText = new Text([]);
                    header.nodes.push(bold);
                }
                else {
                    // We were not able to parse it. Push this star as a normal character
                    currentText.tokens.push(this.consume()!);
                }
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

        while (this.currentTokenIsNot(TokenType.HEADER_IDENTIFIER) && this.tokens.length > 0) {
            // If this token is a new line, one of many things could happen
            if (this.currentTokenIs(TokenType.NEW_LINE)) {
                // If this is the last token (ie nothing new to peek to), we can break out of the loop
                let next = this.peek();
                if (next === null) {
                    this.consume();
                    break;
                }

                // If the next token is also a new line, this means the paragraph is over
                if (next.type === TokenType.NEW_LINE) {
                    // Consume the next new line as well and break
                    console.log('Next is also a new line token, consuming the next line also and breaking');
                    this.consume();
                    break;
                }

                // If the next token is a header identifier, this means the paragraph is over. Consume
                // this blank line and break
                if (next.type === TokenType.HEADER_IDENTIFIER) {
                    this.consume();
                    break;
                }

                // If nothing else, simply move onto the next character. Push this current line
                // to the paragraph and reset the current text
                if (currentText.length > 0) {
                    currentText.tokens.push(new Token(" "));
                    paragraph.nodes.push(currentText);
                    currentText = new Text([]);
                }

                this.consume();
                continue;
            }
            // If this token is a star and the next is a char, this is an italic
            else if (this.currentMayBeItalic()) {
                // Try and parse this italic. If we can't, treat it as a normal character
                const italic = this.parsePotentialItalic();
                if (italic) {
                    // This is valid, so we need to push the current text, reset it, and add the italic
                    if (currentText.length > 0) {
                        paragraph.nodes.push(currentText);
                        currentText = new Text([]);
                    }

                    paragraph.nodes.push(italic);
                    continue;
                }
            }
            // If this token is a star and the following is also a star, then this is a bold
            else if (this.currentMayBeBold()) {
                // Try and parse the bold. If we can't, treat it as a normal character
                const bold = this.parsePotentialBold();
                if (bold) {
                    // This is valid, so we need to push the current text, reset it, and add the bold
                    if (currentText.length > 0) {
                        paragraph.nodes.push(currentText);
                        currentText = new Text([]);
                    }

                    paragraph.nodes.push(bold);
                    continue;
                }
            }

            // All parsing has failed, this must be a normal character
            currentText.tokens.push(this.consume()!);
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
        while (this.tokens.length > 0) {
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