import { Glob } from "glob";
import { Module } from "./module";
import path from "path";

export default interface Config {
    /// The name of the project. Will default to "documentation" if not provided.
    name?: string;

    /// The path to where the documentation is located. Will default to "/docs" if not provided.
    docsPath?: string;

    /// A list of glob-like paths to the files that should be included in the documentation. The glob
    /// will be evaluated in the current `docsPath` directory. Will default 
    /// to["./**/*.{mdx, md}"] if not provided.
    docFileGlob?: string[];
}

/// Denotes the global configuration for this app
export class Configuration {
    /// The path to the configuration file, if any.
    configPath: string | null = null;

    /// The configuration object.
    config: Config = {};

    /// The documentation module.
    module: Module | null = null;

    constructor(configPath?: string, config?: Config) {
        if (configPath) {
            // Resolve the full path to the configuration file
            this.configPath = path.resolve(configPath);
        }

        if (config) {
            this.config = config;
        }

        this.parseModules();
    }

    /// Returns the name of the project.
    get name(): string {
        return this.config.name || "documentation";
    }

    /// Returns where the documentation is located
    get docsPath(): string {
        return this.config.docsPath || "./docs";
    }

    /// Returns the list of paths to the documentation files.
    get docFileGlob(): string[] {
        return this.config.docFileGlob || ["**/*.{mdx, md}"];
    }

    /// Parses all the modules in the documentation and creates a tree of modules.
    async parseModules(): Promise<void> {
        // Grab all the files in the docs directory given by the config regex
        // For each file, create a module object and add it to the tree
        const glob = new Glob(this.docFileGlob, {})
        for await (const file of glob) {
            // Extract the directory name from the file path
            const dir = path.dirname(file);

            console.log('File:', file);
            console.log('Dir:', dir);
        }
    }
}
