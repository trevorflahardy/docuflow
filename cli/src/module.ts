import path from "path";

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
    /// The name of the module.
    name: string;

    /// The path to the module.
    path: string;

    /// The list of sub-modules.
    modules: Module[] = [];

    /// The settings for this module
    settings: ModuleSettings = {};

    constructor(name: string, modulePath: string, modules?: Module[], settings?: ModuleSettings) {
        this.name = name;
        this.path = path.resolve(modulePath);

        if (modules) {
            this.modules = modules;
        }

        if (settings) {
            this.settings = settings;
        }
    }
} 
