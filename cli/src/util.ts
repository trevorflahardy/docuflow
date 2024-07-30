import path from "path";
import Config, { Configuration } from "./config";

/// Fetches the docuflow configuration file from the given path.
export async function fetchConfig(configPath: string): Promise<Config> {
    // The configPath is a .js file, so we need to import it
    const config = await import(path.resolve(configPath));
    return config.default;
}