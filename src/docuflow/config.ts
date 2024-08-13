/**
 * Represents a package's configuration. This is the layout of the docuflow project. If not provided, one will be generated automatically with the CLI.
 */
export interface ModuleConfigOptions {
    directory: string;
    submodules?: ModuleConfigOptions[];

    // An index representing the order of this module. If not provided, it will be generated
    // based om the order they are given in the directory. This can be set through the `module.js`
    // file in the module's directory.
    index: number;

    // A list of files in the module. The path is relative to the location of the module's
    // directory. Thus, docs/module/file.md would be file.md
    files?: string[];
}

/**
 * Represents docuflow's configuration type.
 */
export interface ConfigOptions {
    docsDir?: string; // A relative path to the docs directory (where the docs are located.)
    outDir?: string; // A relative path to the output directory.
    projectName: string;
    modules: ModuleConfigOptions[];
}

export class ModuleConfig {
    options: ModuleConfigOptions;

    parent: ModuleConfig | null;
    submodules: ModuleConfig[];

    constructor(
        options: ModuleConfigOptions,
        parent: ModuleConfig | null = null
    ) {
        this.options = options;
        this.parent = parent;
        this.submodules =
            options.submodules
                ?.map((submodule) => new ModuleConfig(submodule, this))
                .sort((a, b) => {
                    return a.index - b.index;
                }) || [];
    }

    get name(): string {
        return fileNameToDisplayName(this.directory);
    }

    get directory(): string {
        return this.options.directory;
    }

    get files(): string[] {
        return this.options.files || [];
    }

    get index(): number {
        return this.options.index;
    }
}

export default class Config {
    options: ConfigOptions;
    modules: ModuleConfig[];

    constructor(options: ConfigOptions) {
        this.options = options;
        this.modules = options.modules.map((module) => new ModuleConfig(module)).sort((a, b) => {
            return a.index - b.index;
        });
    }

    /**
     * Loads the configuration from the docuflow.config.json file.
     */
    static async load(): Promise<Config> {
        const configPath = "/docuflow.config.json";
        const config = await fetch(configPath);
        const configJson = await config.json();

        return new Config(configJson);
    }

    get projectName(): string {
        return this.options.projectName;
    }

    /**
     * Takes a file name and module and creates a full path to the file.
     *
     * Ie, index.md in /welcome/index.md, would be welcome/index.md
     */
    createFilePath(module: ModuleConfig, file: string): string {
        let path = file;

        let parent: ModuleConfig | null = module;
        while (parent) {
            path = `${module.directory}/${path}`;
            parent = module.parent;
        }

        return path;
    }

    findModule(path: string[]): ModuleConfig | null {
        // Remove the last element of the path (the file name)
        path.pop();

        let currentModule: ModuleConfig | null = null;
        for (const module of this.modules) {
            if (module.name.toLowerCase() === path[0].toLowerCase()) {
                currentModule = module;
                break;
            }
        }

        if (!currentModule) {
            return null;
        }

        for (let i = 1; i < path.length; i++) {
            const submodule: ModuleConfig | undefined = currentModule.submodules.find(
                (submodule) => submodule.name.toLowerCase() === path[i].toLowerCase()
            );

            if (!submodule) {
                return null;
            }

            currentModule = submodule;
        }

        return currentModule;
    }
}

export function fileNameToDisplayName(file: string): string {
    // Takes a file like name and transforms it to some display name.
    return file
        .replace(/_/g, " ") // Replace all underscores
        .replace(/-/g, " ") // Replace all hyphens
        .replace(".mdx", "") // Remove .mdx extension
        .replace(".md", "") // Remove .md extension
        .replace(
            /\w\S*/g,
            (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
        );
}
