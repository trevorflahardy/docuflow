import path from "path";
import { AppState } from "./state";
import { glob } from "glob";

/// Denotes the settings for a module. To define a module, create a directory and place 
/// ".mdx" or ".md" files into it. To change settings, define a "mod.js" file in the 
/// directory with the following structure:
export interface ModuleSettings {
    /// The name of the module
    name?: string,

    /// The description of the module
    description?: string,
}


/// Denotes a documentation module. Each module is represented by a directory, and can have
/// sub-modules, as well as documentation files and settings.
export class Module {
    /// The name of the module, set by the user.
    name: string;

    /// The path to the module.
    path: string;

    /// The list of sub-modules.
    modules: Module[] = [];

    /// The settings for this module
    settings: ModuleSettings = {};

    /// The documentation files in this module
    files: string[] = [];

    // The global app state
    state: AppState

    constructor(name: string, modulePath: string, state: AppState, modules?: Module[], settings?: ModuleSettings, files?: string[]) {
        this.name = name;
        this.path = path.resolve(modulePath);

        if (modules) {
            this.modules = modules;
        }

        if (settings) {
            this.settings = settings;
        }
        
        if (files) {
            this.files = files;
        }

        this.state = state;
    }

    /// Returns the directory name of the module.
    get dirName(): string {
        return path.basename(this.path);
    }

    public addFile(file: string) {
        this.files.push(file);
    }

    public removeFile(file: string) {
        const index = this.files.indexOf(file);
        if (index !== -1) {
            this.files.splice(index, 1);
        }
    }

    public addModule(module: Module) {
        this.modules.push(module);
    }

    public removeModule(module: Module) {
        const index = this.modules.indexOf(module);
        if (index !== -1) {
            this.modules.splice(index, 1);
        }
    }
} 
