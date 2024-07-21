import { getProp, splitBy } from '../utils/fn-utils.mjs';
import { GitDiffCommandBuilder } from './gitDiffCommandBuilder.mjs';

export class LOCService{
  /**
   * @type {import('../../types/CheckCli').LOCOptions}
   */
  #options
  #args
  #gitCommandBuilder
  #name = 'loc'

  constructor({
    options, 
    args, 
    gitCommandBuilder = GitDiffCommandBuilder.create(),
    name
  } = {}
  ){
    this.#options = options;
    this.#args = args;
    this.#gitCommandBuilder = gitCommandBuilder;
    this.#name = name ?? this.#name;
  }

  #parseExclusions(){
    const exclusions = this.#options.exclude ?? [];

    return (
      typeof exclusions === "string"
        ? exclusions.split(",")
        : exclusions.flatMap(splitBy(","))
    );
  }

  execute(){
    const {
      limitTotal,
      limitAdded,
      limitDeleted,
      filters
    } = this.#options;

    const exclusions = this.#parseExclusions();

    const { stdout } = this.#gitCommandBuilder
      .numStat()
      .addDiffFilter(filters)
      .addArgs(...this.#args)
      .addExclusion(...exclusions)
      .setSpawnOptions({
        stdio: "pipe",
      })
      .executeSync();

    const changes = stdout
      .toString()
      .split("\n")
      .filter(Boolean)
      .map(splitBy("\t"))
      .map(([additions, deletions, file]) => ({
        additions: Number(additions),
        deletions: Number(deletions),
        file: String(file),
      }));

    const { additions, deletions } = changes.reduce(
      (acc, { additions, deletions }) => ({
        additions: acc.additions + additions,
        deletions: acc.deletions + deletions,
      }),
      { additions: 0, deletions: 0 }
    );

    const total = additions + deletions;

    /**
     * @type {string[]}
     */
    const errors = [
      {
        limit: limitAdded,
        value: additions,
        error: `Total lines of code added ${additions} exceeds the limit of ${limitAdded}`,
      },
      {
        limit: limitDeleted,
        value: deletions,
        error: `Total lines of code deleted ${deletions} exceeds the limit of ${limitDeleted}`,
      },
      {
        limit: limitTotal,
        value: total,
        error: `Total lines of code ${total} exceeds the limit of ${limitTotal}`,
      },
    ]
      .filter(({ limit, value }) => limit && value > Number(limit))
      .map(getProp("error"));

    return {
      data: {
        total,
        additions,
        deletions,
        changes
      },
      errors,
      name: this.#name
    }
  }
}