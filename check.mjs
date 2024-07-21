import { parseArgs } from './argsUtils.mjs'
import { GitDiffCommandBuilder } from './gitDiffCommandBuilder.mjs'

const { options, args, command } = parseArgs();



const actionByCommand = {
  'loc': ()=>{
    /**
     * @type {{exclude?: string | string[]}}
     */
    const { exclude = [], limitTotal, limitAdded, limitDeleted, throwIfExceed, report = 'human' } = options
    const exclusions = typeof exclude  === 'string' ? 
      exclude.split(',') : 
      exclude.flatMap(ex=>ex.split(','));


    const { stdout } = GitDiffCommandBuilder
      .create()
      .numStat()
      .addArgs(...args)
      .addExclusion(...exclusions)
      .setSpawnOptions({
        stdio: 'pipe'
      })
      .executeSync()

    const changes =  stdout
      .toString()
      .split('\n')
      .filter(Boolean)
      .map((line)=>line.split('\t'))
      .map(([deletions, additions, file])=>({
        additions: Number(additions),
        deletions: Number(deletions),
        file
      }))

    const { additions, deletions } = changes
      .reduce((acc, {additions, deletions})=>({
        additions: acc.additions + additions,
        deletions: acc.deletions + deletions
      }), {additions: 0, deletions: 0})

      const total = additions + deletions;


      const errors = [];

      if(limitTotal && total > Number(limitTotal))
        errors.push(`Total lines of code ${total} exceeds the limit of ${limitTotal}`);

      if(limitAdded && additions > Number(limitAdded))
        errors.push(`Total lines of code added ${additions} exceeds the limit of ${limitAdded}`);

      if(limitDeleted && deletions > Number(limitDeleted))
        errors.push(`Total lines of code deleted ${deletions} exceeds the limit of ${limitDeleted}`);

      if(report === 'json'){
        console.log(JSON.stringify({
          total,
          additions,
          deletions
        }))
      }else if(report === 'human'){
        console.log(`Total: ${total}`);
        console.log(`Additions: ${additions}`);
        console.log(`Deletions: ${deletions}`);
      }else if(report === 'html-table'){
        console.log(`
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
              ${errors.length ? "<tr><td colspan=2>" + errors.join('</td></tr><tr><td colspan=2>') + '</td></tr>' : ''}
            </tbody>
          </table>`.split('\n').map(line=>line.trim()).join('')
        )
      }else if(report === 'complete'){
        console.table(changes);
        console.table({ total, additions, deletions });
      }

      if(errors.length && throwIfExceed){
        throw new Error(errors.join('\n'));
      }
  },
  'files': ()=>{
    GitDiffCommandBuilder
      .create()
      .nameOnly()
      .addArgs(...args)
      .addExclusion()
      .executeSync()
  }
}

const action = actionByCommand[command];

if(!action){
  throw new Error(`command ${command} not found`);
}

action();

