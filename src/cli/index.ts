#!/usr/bin/env node
import { AppState } from "./src/state";
import { dumpState, fetchConfig } from "./src/util";
import { build as viteBuild } from "vite";

import { Command } from 'commander';
import path from "path";
const program = new Command();

program
    .name('docuflow')
    .description('A CLI for generating modern, beautiful documentation.')
    .version('0.0.1')

// Denotes the command that actually builds the documentation.
const build = program.command('build')
    .description('Build the documentation from the provided configuration.')
    .option('-c, --config <path>', 'Path to the configuration file.', './docuflow.config.js')

// Parses the command line arguments.
program.parse(process.argv);

const invokedCommand = program.args[0];

// If the user has invoked the "build" command, the first argument will be "build".
if (invokedCommand === 'build') {
    const buildOptions = build.opts();

    const configPath = buildOptions.config;
    const configData = await fetchConfig(configPath);
    const state = new AppState(configPath, configData);

    await state.resolveModules();

    // For lack of better things to do, we're going to store the state in a json file in our dist 
    // output. This is so that:
    // (1) the user can see the state of the application's structure,
    // (2) the end user can parse the website's structure, and
    // (3) the user can debug the application easily.
    await dumpState(state);

    // Now we can build the documentation using Vite.
    await viteBuild({
        root: "src/website",
        build: {
            outDir: path.join(process.cwd(), state.outDir),
        }
    })

}
