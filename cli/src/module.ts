import path from "path";
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

    constructor(name: string, modulePath: string, modules?: Module[], settings?: ModuleSettings, files?: string[]) {
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
    }

    /// Returns the directory name of the module.
    get dirName(): string {
        return path.basename(this.path);
    }

    public addFile(file: string) {
        this.files.push(file);
    }

    public addFiles(files: string[]) {
        this.files = this.files.concat(files);
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

    /// Resolves the module's settings by looking for a "mod.js" file in the module's directory.
    private async resolveSettings(): Promise<ModuleSettings> {
        // (1) Join the path to a potential mod.js
        const settingsPath = path.join(this.path, "mod.js");
        try {
            // (2) Import it
            const settings = await import(settingsPath);
            
            // (3) Set the settings
            this.settings = settings;
            return settings;
        } catch (e) {
            // (4) If the file doesn't exist, we can just return an empty object
            return {};
        }
    }

    /// Gets all the sub-modules that are in this module's directory and adds them
    /// to this module.
    private async resolveSubModules(): Promise<Module[]> {
        console.log('Resolving submodules in', this.path, this.name);
        const modules: Module[] = [];
        
        // Grab all directories in the module's directory
        const directories = await glob(path.join(this.path, "*/"), { absolute: true });
        for (const dir of directories) {
            const moduleName = path.basename(dir);
            const module = new Module(moduleName, dir);

            this.addModule(module);
            modules.push(module);
        }

        return modules;
    }

    /// Gets all the files in this module's directory and adds them to this module.
    private async resolveFiles(docFileGlobs: string[]): Promise<string[]> {
        console.log('Resolving files in', this.path, this.name);
        let files: string[] = [];
        for (const docFileGlob of docFileGlobs) {
            // Grab all the files that match the glob
            const matched = await glob(path.join(this.path, docFileGlob), { absolute: true });
            files = files.concat(matched);
        }

        this.addFiles(files);
        return files;
    }

    /// Resolves the module's settings, sub-modules, and files. Additionally, will resolve all
    /// module's children in the same way, allowing for a full tree of modules to be resolved.
    ///
    /// @param docFileGlobs The list of glob-like paths to the files that should be included.
    public async resolve(docFileGlobs: string[]): Promise<void> {
        // Resolve this current module's files, sub-modules, and settings.
        await this.resolveFiles(docFileGlobs);
        await this.resolveSettings();
        await this.resolveSubModules();

        // For each child in our children, resolve them as well.
        for (const child of this.modules) {
            await child.resolve(docFileGlobs);
        }
    }
} 
