import { BaseCommandBuilder } from './baseCommandBuilder.mjs';

export class GitDiffCommandBuilder extends BaseCommandBuilder {
  static filters = {
    added: 'A',
    copied: 'C',
    deleted: 'D',
    modified: 'M',
    renamed: 'R',
    changed: 'T',
    unmerged: 'U',
    unknown: 'X',
    broken: 'B'
  }

  constructor(initialArgs = []) {
    super({
      initialArgs: ['--no-pager','diff', ...initialArgs],
      command: 'git'
    });
  }

  static create(...args){
    return new GitDiffCommandBuilder(...args);
  }

  nameOnly() {
    this.addOption('name-only');

    return this;
  }

  numStat() {
    this.addOption('numstat');

    return this;
  }
  addExclusion(...exclusions){
    exclusions.forEach(exclusion=>this.addOption(`:!${exclusion}`))

    return this;
  }

  /**
   * @param {string | Record<keyof Partial<GitDiffCommandBuilder.diffFilerOptions>, boolean>} filter 
   */
  addDiffFilter(filter){
    if(!filter)
      throw new Error('filter not added')

    if(typeof filter === 'string')
      return this.addOption('diff-filter',filter)

    return this.addOption('diff-filter', Object
      .entries(filter)
      .map(([key, value])=> GitDiffCommandBuilder
        .diffFilerOptions[value ? key: key.toLowerCase()]
      )
      .join('')
    )
  }

  addArgs(...args){
    super.addArgs(...args);

    return this;
  }
}   