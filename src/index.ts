#!/usr/bin/env node

/**
 * The actual CLI of docuflow. Will be implemented using commander.js. Will load the docuflow settings module
 * and all the documentation into the system so that the script can find everything.
 */

import { Command } from 'commander';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

const program = new Command();

program
    .version("0.0.1")
    .description("A simple CLI tool for rendering markdown documentation.");

const build = program
    .command('build')
    .description('Build the documentation')
    .option('-c, --config <config>', 'The configuration file to use', './docuflow.config.js');

program.parse(process.argv);

const options = program.opts();

// Check if we're building the documentation
if (program.args[0] === 'build') {
    console.log("Building the documentation...");
    console.log(options);

    const buildOptions = build.opts();
    console.log(buildOptions);

    // Try and require the config but, if there was no config passed,
    // then we can continue with an empty object.
    let config: Record<string, any> = {};
    if (buildOptions.config) {
        try {
            const configPath = path.resolve(buildOptions.config);
            const configModule = await import(configPath);
            config = configModule.default || configModule;
        } catch (e) {
            console.error("Failed to require the configuration file. Please check the path and try again.");
            process.exit(1);
        }
    }

    // Grab the outdir for the project and make it if it does not exist
    const outDir: string = config.outDir || './dist';
    await fs.mkdir(outDir, { recursive: true });

    // Copy all the MD files to the outDir. We're going to need them for dynamically generating
    // the documentation. We'll store them in /dist/docs so the script knows where to find them
    const destinationDocsDir: string = `${outDir}/docs`;
    await fs.mkdir(destinationDocsDir, { recursive: true });

    const docsDir: string = config.docsDir || './docs';
    const docs: string[] = await fs.readdir(docsDir);

    for (const doc of docs) {
        await fs.copyFile(`${docsDir}/${doc}`, `${destinationDocsDir}/${doc}`);
    }

    // Copy over all js, html, json, and css files from this dur into the outDir in the same structure 
    // as the docs directory (using glob)
    const sourceDir = path.resolve(__dirname);
    const files = await glob('**/*.{js,html,json,css}', { cwd: sourceDir });

    for (const file of files) {
        // Take the file relative to the sourceDir and copy it to the outDir
        const sourceFile = path.resolve(sourceDir, file);
        const destinationFile = path.resolve(outDir, file);
        await fs.mkdir(path.dirname(destinationFile), { recursive: true });
        await fs.copyFile(sourceFile, destinationFile);
    }

    // Copy over our index.html and index.js files to the outdir
    await fs.copyFile(`${__dirname}/index.html`, `${outDir}/index.html`);
    await fs.copyFile(`${__dirname}/docuflow.js`, `${outDir}/docuflow.js`);

    // Write the configuration file to the outDir, if it exists
    if (config) {
        await fs.writeFile(`${outDir}/config.json`, JSON.stringify(config, null, 4));
    }

    console.log("Documentation built successfully!");
}