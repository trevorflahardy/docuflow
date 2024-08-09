import { Parser } from './parser/parser.js';

/**
 * The actual Docuflow class. Handles all the management of state, logic, and rendering of
 * MD files as needed.
 */
export class Docuflow {
    currentMD: string;

    constructor() {
        this.currentMD = "index.md";
    }

    async renderMarkdown(md: string): Promise<string> {
        // Open the MD file and parse each of its elements.
        const response = await fetch(`./docs/${md}`);
        const content = await response.text();

        const parser = new Parser(content);
        console.log('Parsed all tokens', parser.tokens.length);
        return parser.toHTML();
    }

    async inject() {
        // Grab the element to inject into, in this case, id="content"
        const contentElement = document.getElementById("content");

        if (contentElement) {
            // For a test, let's render the currentMD and inject it
            const rendered = await this.renderMarkdown(this.currentMD);
            console.log('Rendered text', rendered);
            contentElement.innerHTML = rendered;
        }
    }
}

const docuflow = new Docuflow();
await docuflow.inject();