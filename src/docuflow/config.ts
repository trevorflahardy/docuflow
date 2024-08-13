/**
 * Represents a package's configuration. This is the layout of the docuflow project. If not provided, one will be generated automatically with the CLI.
 */
export interface ModuleConfig {
    name: string;
    directory: string;
    submodules: ModuleConfig[];
    files: string[];
}

/**
 * Represents docuflow's configuration type.
 */
export default interface Config {
    docsDir?: string,
    outDir?: string,
    projectName: string,
    module: ModuleConfig
}

export async function loadConfig(): Promise<Config> {
    // Open the public/docuflow.config.json file and return its contents as a Config object
    const config = await fetch('/docuflow.config.json');
    return config.json();
}