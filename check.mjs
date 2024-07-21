#!/usr/bin/env node

import { parseArgs } from "./src/utils/argsUtils.mjs";
import { getProp, splitBy, throwIf } from "./src/utils/fn-utils.mjs";
import { GitDiffCommandBuilder } from "./src/services/gitDiffCommandBuilder.mjs";
import { getConfig } from './src/utils/config-utils.cjs';


const { options: optionsFromCli, args, command } = parseArgs();

if (optionsFromCli.help) {
  console.log(getHelpText());
  process.exit(0);
}


const options = {
  ...getConfig()[command],
  ...optionsFromCli,
};

const actionByReport = {
  json: ({ total, additions, deletions }) =>
    JSON.stringify({
      total,
      additions,
      deletions,
    }),
  human: ({ total, additions, deletions }) =>
    `Total: ${total}\nAdditions: ${additions}\nDeletions: ${deletions}`,
  "html-table": ({ total, additions, deletions, errors }) =>
    `
    <table>
      <tbody>
        <tr>
          <td>Total</td>
          <td>${total}</td>
        </tr>
        <tr>
          <td>Additions</td>
          <td>${additions}</td>
        </tr>
        <tr>
          <td>Deletions</td>
          <td>${deletions}</td>
        </tr>
        ${
          errors.length
            ? "<tr><td colspan=2>" +
              errors.join("</td></tr><tr><td colspan=2>") +
              "</td></tr>"
            : ""
        }
      </tbody>
    </table>`
      .split("\n")
      .map((line) => line.trim())
      .join(""),
  complete: ({ total, additions, deletions, changes, errors }) => {
    console.table(changes);
    console.table({ total, additions, deletions });

    return errors.join("\n");
  },
};

const actionByCommand = {
  loc: () => {
    /**
     * @type {import('./types/GitCommandBuilder').DiffFilters}
     */
    const defaultDiffFilters = {
      copied: false,
      deleted: false,
      renamed: false,
    }
    /**
     * @type {import('./types/CheckCli').LOCOptions}
     */
    const {
      exclude = [],
      limitTotal,
      limitAdded,
      limitDeleted,
      throwIfExceed,
      report = "human",
      filters = defaultDiffFilters
    } = options;

    const exclusions =
      typeof exclude === "string"
        ? exclude.split(",")
        : exclude.flatMap(splitBy(","));

    const { stdout } = GitDiffCommandBuilder.create()
      .numStat()
      .addDiffFilter(filters)
      .addArgs(...args)
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

    const reportFn = actionByReport[report];

    throwIf(!reportFn, `report ${report ?? ''} not found`);

    console.log(reportFn({ total, additions, deletions, changes, errors }));

    throwIf(errors.length && throwIfExceed, errors.join("\n"));
  
  },
  files: () => {
    GitDiffCommandBuilder.create()
      .nameOnly()
      .addArgs(...args)
      .addExclusion()
      .executeSync();
  },
};

const action = actionByCommand[command];

if (!action) {
  throw new Error(`
    command ${command ?? ''} not found
    Available commands: ${Object.keys(actionByCommand).join(", ")}
  `);
}

action();

// TODO: add contextual help for each command
function getHelpText() {
  return `
    Usage: check [command] [options]
    Examples: 
      a) To check if the total lines of code exceeds 1000 excluding package.json and package-lock.json
        node ./check.mjs loc --limitTotal=1000 --report=html-table --exclude="./package.json,./package-lock.json" ^HEAD HEAD

      b) Alternative you can use the following command (the exclude option can be used multiple times)
        node ./check.mjs loc --limitTotal=1000 --report=html-table --exclude="./package.json" --exclude="./package-lock.json" ^HEAD HEAD

    Commands:
      loc: Check lines of code
      files: Check files
    Options:
      --exclude: Exclude files or directories
      --limitTotal: Limit total lines of code
      --limitAdded: Limit added lines of code
      --limitDeleted: Limit deleted lines of code
      --throwIfExceed: Throw an error if the limit is exceeded
      --report: Report format (human, json, html-table, complete)
      --help: Print this message
  `;
}
