import { ConfigOptions } from "./docuflow/interfaces";

/**
 * The configuration options for the docuflow project. In runtime, the modules
 * will be generated based on the docs directory and placed in a modules.json file.
 */
const options: ConfigOptions = {
    docsDir: "./docs",
    outDir: "./dist",
    projectName: "Docuflow",
    projectDescription: "A documentation generator for your project.",
    theme: {
        accent: {
            light: "#FF1E00",
            dark: "#FF1E00"
        }
    },
    links: {
        github: {
            url: "https://github.com/trevorflahardy/docuflow",
            name: "Github",
            bannerDisplay: true,
        },
    }
}

export default options;