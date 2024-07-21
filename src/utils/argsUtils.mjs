export const hasProcess = typeof process !== 'undefined';

/**
 * 
 * @param {string} option 
 */
export const transformFromSpineCaseToCamelCase = (option)=>option
  .replace(/-([a-z])/g, (_, letter)=> letter.toUpperCase());

// TODO: add transformer for options
export const parseArgs = (args = hasProcess ? process.argv : [])=>{
  const [ node, file, ...restArgs ] = args;

  const options = {};

  const finalArgs = [];

  for(const arg of restArgs){
    if(arg.startsWith('--')){
      const [key, value] = arg
        .slice(2)
        .split('=');

      const camelKey = transformFromSpineCaseToCamelCase(key);

      const prevValue = options[camelKey];

      if(prevValue)
        options[camelKey] = Array.isArray(prevValue) ? [...prevValue, value] : [prevValue, value];
      else
        options[camelKey] = value ?? true;
    }else if(arg.startsWith('-')){
      arg
        .slice(1)
        .split('')
        .forEach((flag)=>{
          options[flag] = true;
        })
    }
    else
      finalArgs.push(arg);
    
  }

  return {
    node,
    file,
    options,
    args: finalArgs.slice(1),
    command: finalArgs[0]
  }
}