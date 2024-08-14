/**
 * Represents a package's configuration. This is the layout of the docuflow project. If not provided, one will be generated automatically with the CLI.
 */
export interface ModuleConfigOptions {
    directory: string;
    submodules?: ModuleConfigOptions[];

    // An index representing the order of this module. If not provided, it will be generated
    // based om the order they are given in the directory. This can be set through the `module.js`
    // file in the module's directory.
    index: number;

    // A list of files in the module. The path is relative to the location of the module's
    // directory. Thus, docs/module/file.md would be file.md
    files?: string[];
}

/**
 * Represents the theme configuration. This is the custom styling of the docuflow project.
 */
export interface ThemeOptions {
    accent?: {
        light: string;
        dark: string;
    }
}

export interface LinkSettings {
    url: string; // The URL to the link
    name: string; // A display name for the link 
    bannerDisplay?: boolean; // Denotes if the link should be displayed on the website banner.
}

export interface LinksSettings {
    github?: LinkSettings; // A special link for the github repository.
}

export declare type LinksOptions = LinksSettings & {
    [key: string]: string | LinkSettings;
}


/**
 * Represents docuflow's configuration type.
 */
export interface ConfigOptions {
    docsDir?: string; // A relative path to the docs directory (where the docs are located.)
    outDir?: string; // A relative path to the output directory.
    projectName: string;
    projectDescription?: string;
    modules?: ModuleConfigOptions[]; // A list of modules in the project. If not provided then auto generated.
    theme?: ThemeOptions,
    home?: string; // A path to the home page, relative to the docs directory. This is a MDX file.
    links?: LinksOptions
}