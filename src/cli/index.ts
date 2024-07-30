#!/usr/bin/env node
"use strict"

import { AppState } from "./src/state";
import { fetchConfig } from "./src/util";

import { Command } from 'commander';
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
}
