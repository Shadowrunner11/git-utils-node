# Git Utils Node

A utility tool designed to work with Git repositories, providing functionalities such as checking lines of code (LOC) changes, filtering diffs, and more. This tool is built with Node.js and is intended for use in development environments, especially in CI/CD pipelines to enforce code quality checks.

## Features 🚧

- **LOC Check**: Analyze the number of lines added, deleted, or modified in a Git repository and compare against predefined limits.
- **Diff Filtering**: Apply filters to Git diffs to include or exclude specific types of changes (e.g., copied, deleted, renamed files).
- **Customizable Reports**: Generate reports in various formats (human-readable, JSON, HTML table) based on the analysis results.
- **Exclusion Lists**: Define files or directories to exclude from the analysis.


## Installation 🚧

This tool requires Node.js version 20.0.0 or higher.


## Roadmap

- [ ] Evaluate the support for using native Node.js fetch to comment in prs (without using octokit)
- [ ] Create abstractions for the program cli execution in the main file
- [ ] Create a IoC container
- [ ] Create documentation
- [ ] Evaluate the creation of codemods or build process to have retro compatibility
- [ ] Document the abstractions and the use
- [ ] Create abstractions for HTML report creation
- [ ] Add tool to check the use of changelog
- [ ] Add tool to read the pull request body and create a  adapter, DSL or AST
- [ ] Create tool to read yml
- [ ] Add support for large diff (spawn events)
- [ ] Add support for create reports directly into files
- [ ] Add examples reading the group of the creator of pr  and checking if needs a different configuration
- [ ] Add support to check if this needs and override, especially reading the tags of pr
- [ ] Add documentation page
- [ ] Add support for modifying or inheritance of configuration
- [ ] Support for async spawn with events and streaming
- [ ] Support for creating directly the needed files of the report
- [ ] Check for the real value of lines added and deleted, seems inverted in github