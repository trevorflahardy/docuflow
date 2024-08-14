import { ModuleConfigOptions } from "./interfaces";
import projectConfigOptions from '../docuflow.config';

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
    modules: ModuleConfig[];

    constructor(modules: ModuleConfigOptions[] = []) {
        const mods = modules || projectConfigOptions.modules;
        this.modules = mods.map((module) => new ModuleConfig(module)).sort((a, b) => {
            return a.index - b.index;
        });
    }

    /**
     * Loads the configuration from the docuflow.config.json file.
     */
    static async load(): Promise<Config> {
        // One of two things can happen while loading. Either
        // (1) the modules.json file exists and we can load it (ie. the modules were automatically generated),
        // (2) The user specified their own modules in the docuflow.config.ts file and we can load from that instead.
        const modulesPath = "/modules.json";
        try {
            const config = await fetch(modulesPath);
            const configJson = await config.json();
            return new Config(configJson.modules);
        } catch {
            return new Config(projectConfigOptions.modules || []);
        }
    }

    get projectName(): string {
        return projectConfigOptions.projectName;
    }

    /**
     * Grabs the first file in the first module and returns the path to it.
     */
    get defaultPath(): string {
        return this.createFilePath(this.modules[0], this.modules[0].files[0]);
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
