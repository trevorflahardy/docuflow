# Docuflow

Docuflow is a lightweight documentation generator from markdown files. It is designed to be simple and easy to use. It is a single binary that generates a static site from markdown files.

The build time of the site is very fast, as the markdown files are not parsed at build time. Instead, the markdown files are parsed at runtime, and the HTML is cached (or at least, it will be).

<img width="1485" alt="image" src="https://github.com/user-attachments/assets/957a1f8a-4810-46f2-a175-0fbb68d448bd">


## Usage

### Development Testing

To test the site locally, run the following command:

```bash
git clone https://github.com/trevorflahardy/docuflow
cd docuflow
npm install && npm run dev
```

## Development Note

This side project of mine is in its infancy. It is almost **unusable**. I am currently working on the basic functionality of the site. This `README.md` will be updated as the project progresses.

The goal of this project is to write my own parser for Markdown files and to, eventually, extend conventional Markdown for useful purposes, such as inline evaluated code
blocks, variables, latex, etc.

### Development Goals

- [ ] Creating a runnable CLI that injects the relevent docs into the outputted website.
- [x] Running and functioning MDX rendering.
- [x] Auto generated modules.
- [ ] Project config:
  - [ ] A settable website accent color.
  - [ ] Customizable links on the page header.
 - [ ] A way to add custom pages that aren't documentation-based. 

... more will be added here as I go along.
