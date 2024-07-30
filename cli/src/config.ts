export default interface Config {
    /// The name of the project. Will default to "documentation" if not provided.
    name?: string;

    /// The path to where the documentation is located. Will default to "/docs" if not provided.
    docsPath?: string;

    /// A list of glob-like paths to the files that should be included
    /// in the documentation. The glob will be evaluated in the current
    /// `docsPath` directory. Will default to["./**/*.{mdx, md}"] if not provided.
    /// A majority of the time, you will not need to change this.
    docFileGlobs?: string[];
}
