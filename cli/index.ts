#!/usr/bin/env node
"use strict"

import { Command } from 'commander';
const program = new Command();

program 
    .name('docuflow')
    .description('A CLI for generating modern, beautiful documentation.')
    .version('0.0.1')

// Denotes the command that actually builds the documentation.
program.command('build')
    .description('Build the documentation from the provided configuration.')
    .argument('[docs]', 'The path to the MDX files to build. Defaults to the `./docs` directory.', './docs')
    .option('-o, --output <output>', 'The path to the output directory.', './dist')
    .option('-c, --config <config>', 'The path to the configuration file.', './docuflow.config.js')

program.parse(process.argv);

const options = program.opts();
console.log(options);