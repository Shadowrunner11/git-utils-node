#!/usr/bin/env node

import { parseArgs } from "./src/utils/argsUtils.mjs";
import { throwIf } from "./src/utils/fn-utils.mjs";
import { GitDiffCommandBuilder } from "./src/services/gitDiffCommandBuilder.mjs";
import { getConfig } from './src/utils/config-utils.cjs';
import { LOCService } from "./src/services/locService.mjs";
import { getActionsByCommandHashMap } from "./src/modules/reportActionByCommand.mjs";
import { Program } from "./src/services/program.mjs";

/**
 * @type {{
 *  options: import('./types/CheckCli').CheckOptions
 *  args: string[]
 *  command: string
 * }}
 */
const { options: optionsFromCli , args, command } = parseArgs();


const { help, configPath, root, ...restOptionsFromCli } = optionsFromCli

if (help) {
  console.log(getHelpText());
  process.exit(0);
}


/**@type {import('./types/CheckCli').CheckOptions} */
const options = {
  ...getConfig({
    root,
    configPath
  })[command],
  ...restOptionsFromCli,
};

const { actionName, result } = new Program({
  options,
  args,
})
  .addAction("loc", LOCService)
  .addAction("files", () => {
    // TODO: complete the implementation
    GitDiffCommandBuilder.create()
      .nameOnly()
      .addArgs(...args)
      .addExclusion()
      .executeSync();
  },)
  .executeAction(command);


if(actionName === 'loc'){
  const { report, throwIfExceed } = options;
  const reportFn = getActionsByCommandHashMap()[report];

  throwIf(!reportFn, `report ${report ?? ''} not found`);

  const { errors } = result 

  console.log(reportFn({...result.data, errors}));
  
  throwIf(errors.length && throwIfExceed, errors.join("\n"));
}



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
      --config-path: Path to the configuration file
      --root: Root directory
  `;
}
