import { marked } from 'marked';
import Config, { ModuleConfig } from './config';

/**
 * The actual Docuflow class. Handles all the management of state, logic, and rendering of
 * MD files as needed.
 */
export class Docuflow {
    selectedModule: ModuleConfig | null = null; // The selected and active module.
    selectedFile: string | null = null; // The file that this user is viewing within the selected module.

    async loadConfig(): Promise<Config> {
        // Load the config from the root of the project.
        const configPath = "./docuflow.config.json";
        const config = await fetch(configPath);
        const configJson = await config.json();
        return configJson;
    }

    private async readSelectedFile(): Promise<string> {
        if (!this.selectedModule) {
            throw new Error("No module selected");
        }

        const file = this.selectedFile;
        if (!file) {
            throw new Error("No file selected");
        }

        const response = await fetch(file);
        const content = await response.text();
        return content;
    }

    async renderMarkdown(): Promise<string> {
        // Open the MD file and parse each of its elements.
        if (!this.selectedModule) {
            throw new Error("No module selected");
        }

        const file = this.selectedFile;
        if (!file) {
            throw new Error(`No file selected for package ${this.selectedModule.name}`);
        }

        const content = await this.readSelectedFile();
        const rendered = marked(content);
        return rendered;
    }

    async inject() {
        // Grab the element to inject into, in this case, id="content"
        const contentElement = document.getElementById("content");

        if (!contentElement) {
            throw new Error("Could not find element with id 'content'");
        }

        const config = await this.loadConfig();
        console.log(config);

        // Grab the root module from the docs directory and parse it, then we can
        // start rendering the content.
        this.selectedModule = config.module;
        this.selectedFile = config.module.files[0];

        // For a test, let's render the currentMD and inject it
        const rendered = await this.renderMarkdown();
        contentElement.innerHTML = rendered;
    }
}
