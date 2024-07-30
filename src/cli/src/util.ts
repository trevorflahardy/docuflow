import path from "path";
import Config from "./config";
import { AppState } from "./state";
import { promises as fs } from "fs";

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

export async function dumpState(state: AppState): Promise<void> {
    // For lack of better things to do, we're going to store the state in a json file in our dist 
    // output. This is so that:
    // (1) the user can see the state of the application's structure,
    // (2) the end user can parse the website's structure, and
    // (3) the user can debug the application easily.
    const statePath = path.join(state.outDir, "assets", "app_state.json");
    console.log(`Dumping state to ${statePath}`);
    const stateData = JSON.stringify(state, null, 4);

    // Create the directory if it doesn't exist
    await fs.mkdir(path.dirname(statePath), { recursive: true });

    // And write the state to the file
    await fs.writeFile(statePath, stateData);
}