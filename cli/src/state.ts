
/// Denotes the global configuration for docuflow. Holds the configuration set by the user,

import {Module} from "./module";
import Config from "./config";
import path from "path";
import { Glob } from "glob";


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
    get docFileGlob(): string[] {
        return this.config.docFileGlob || ["**/*.{mdx, md}"];
    }

    private findModuleFromDir(dir: string, module: Module): Module | null {
        // Traverse the module tree to find the module with the given path.
        // If the module is not found, return null.
        
        // If the current module is the one we are looking for, return it
        if (module.path === dir) {
            return module;
        }

        // Otherwise, traverse the submodules
        for (const subModule of module.modules) {
            const foundModule = this.findModuleFromDir(dir, subModule);
            if (foundModule) {
                return foundModule;
            }
        }

        // If we have traversed all the submodules and not found the module, return null
        return null;
    }

    private findModuleFromFile(filePath: string): Module | null {
        // If the module tree does not exist, return null
        if (!this.module) {
            return null;
        }

        // Traverse the module tree to find the module with the given path.
        // If the module is not found, return null.
        
        // Grab the dir name from this path
        const dir = path.dirname(filePath);

        // If the module is the root module, return it
        if (dir === this.docsPath) {
            return this.module;
        }

        // Otherwise, traverse the module tree to find the module
        return this.findModuleFromDir(dir, this.module);
    }

    /// ----------------------------------------------------------------------------------------
    /// TODO: I hate the fact that the parsing is done in the AppState class. Ideally
    /// TODO: speaking, the AppState class should only hold the main Module and the building
    /// TODO: of cache should be done recursively in the Module class. One function for finding
    /// TODO: all files in a dir, another for building sub-modules, and a final one for
    /// TODO: parsing the module settings. Fix this. This is running like horrible spaghetti 
    /// TODO: code, and oh my god it's so incredibly slow.
    /// ----------------------------------------------------------------------------------------

    /// Parse a module from a given path (to a documentation file).
    private parseModule(fromFile: string): Module {
        // Check if this module already exists in our tree.
        const existingModule = this.findModuleFromFile(fromFile);
        if (existingModule) {
            // This module already exists, simply append this file to it
            // and return the module
            existingModule.addFile(fromFile);
            return existingModule;
        }

        // This module does not exist, we need to create a new module for it.
        // Walk from the root module/to/the/module/we/need/to/create
        const dir = path.dirname(fromFile);
        const parts = dir.split(path.sep);
        let currentModule = this.module;

        for (const part of parts) {
            if (currentModule) {
                // The current module exists, check if the sub-module we're looking to 
                // go into exists, or, if the part is the current module itself.
                console.log(currentModule.dirName, part)
                if (currentModule.dirName === part) {
                    // This is the current module, continue to the next part
                    continue;
                }

                let existingModule = currentModule.modules.find(m => m.dirName === part);
                if (!existingModule) {
                    // This module does not exist, create a new one.
                    existingModule = new Module(part, path.join(currentModule.path, part), this);
                    currentModule.addModule(existingModule);
                }

                // Move into the sub-module
                currentModule = existingModule;
                continue;
            }

            // There is no current module, this is the root module. Create it then
            // continue walking.
            this.module = currentModule = new Module(part, this.docsPath, this);
        }

        // currentModule, at this point, has been created while walking the path.
        // for some reason, if it hasn't, then we have been given an invalid fromFile path.
        if (!currentModule) {
            throw new Error(`Invalid documentation file path: ${fromFile}`);
        }

        // Add the file to the module
        currentModule.addFile(fromFile);

        // And return the module
        return currentModule;
    }
    
    /// Parses all the modules in the documentation and creates a tree of modules.
    async parseModules(): Promise<void> {
        // Grab all the files in the docs directory given by the config regex
        // For each file, create a module object and add it to the tree
        const glob = new Glob(`${this.docsPath}/${this.docFileGlob}`, {})
        for await (const file of glob) {
            console.log(file);
            this.parseModule(file);
        }

        console.log('Mapping:', JSON.stringify(this.module))
    }
}
