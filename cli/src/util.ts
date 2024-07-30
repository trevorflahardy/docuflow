import path from "path";
import Config from "./config";

/// Fetches the docuflow configuration file from the given path.
export async function fetchConfig(configPath: string): Promise<Config> {
    // The configPath is a .js file, so we need to import it
    const config = await import(path.resolve(configPath));

    // If this does not have a default export, throw an error to inform the user
    if (!config.default) {
        throw new Error(`\`docuflow.config.js\` (${configPath}) file must have a default export.`);
    }

    return config.default;
}