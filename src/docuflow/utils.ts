import { loadConfig, ModuleConfig } from "./config";
import pathLib from 'path';


export async function findModule(path: string[]): Promise<ModuleConfig | null> {
    // If there is no path, then we are at the root module
    if (path.length === 0) {
        return null;
    }

    const config = await loadConfig();
    const root = config.module;

    // The last element in the path is always going to be the file name. Thus, we trim
    // off the last element to get the directory path.
    const directory = path.slice(0, path.length - 1);

    if (directory.length === 0) {
        return root;
    }

    // We are going to traverse the directory path to find the module.
    let currentModule: ModuleConfig = root;
    for (const dir of directory) {
        const module = currentModule.submodules.find(m => m.name.toLowerCase() === dir.toLowerCase());
        if (!module) {
            return null;
        }

        currentModule = module;
    }

    return currentModule;
}

export function findFileInModule(fileName: string, module: ModuleConfig): string | null {
    // If this file name is not in the module, then we return null
    for (const file of module.files) {
        // This file is a full path, so we need to extract the file name
        const basename = pathLib.basename(file);
        if (basename.toLowerCase() === fileName.toLowerCase()) {
            return file;
        }
    }

    // If all else fails, return null
    return null;
}   