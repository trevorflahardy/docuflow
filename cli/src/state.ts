
/// Denotes the global configuration for docuflow. Holds the configuration set by the user,

import {Module} from "./module";
import Config from "./config";
import path from "path";


/// as well as the parsed documentation modules to be used in the build process.
export class AppState {
    /// The path to the configuration file, if any.
    configPath: string | null = null;

    /// The configuration of the project.
    config: Config = {};

    /// The main (entrypoint) documentation module. Holds all the 
    /// documentation modules, their respective children, and any 
    /// metadata associated with the module.
    module: Module | null = null;

    constructor(configPath?: string, config?: Config) {
        if (configPath) {
            // Resolve the full path to the configuration file
            this.configPath = path.resolve(configPath);
        }

        if (config) {
            this.config = config;
        }
    }

    /// Returns the name of the project.
    get name(): string {
        return this.config.name || "documentation";
    }

    /// Returns where the documentation is located
    get docsPath(): string {
        return this.config.docsPath || "/docs";
    }

    /// Returns the list of paths to the documentation files.
    get docFileGlobs(): string[] {
        return this.config.docFileGlobs || ["/*.{mdx, md}"];
    }

    
    /// Resolves all the modules in the documentation and creates a tree of modules.
    async resolveModules(): Promise<void> {
        // Create the main module
        this.module = new Module(this.name, this.docsPath);
        await this.module.resolve(this.docFileGlobs);

        console.log('Mapping:', JSON.stringify(this.module))
    }
}
