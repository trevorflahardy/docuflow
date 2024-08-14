import { ConfigOptions } from "./docuflow/interfaces";


const projectDescription = `
A lightweight documentation generator that allows users to create documentation from Markdown (MD) and Markdown + JSX (MDX). It's designed to be elegant whilst providing
a great deal of customization for the user.
`

/**
 * The configuration options for the docuflow project. In runtime, the modules
 * will be generated based on the docs directory and placed in a modules.json file.
 */
const options: ConfigOptions = {
    docsDir: "./docs",
    outDir: "./dist",
    projectName: "Docuflow",
    projectDescription: projectDescription,
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